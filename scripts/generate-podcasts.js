#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Audio content generation script
//
// Generates all podcast episode and guided session audio files using
// ElevenLabs TTS (and optionally Suno for background music).
//
// SETUP:
//   npm install node-fetch @types/node   # or use Node 18+ built-in fetch
//   export ELEVENLABS_API_KEY="your_key_here"
//   export SUNO_API_KEY="your_key_here"  # optional, only for --music flag
//
// USAGE:
//   node scripts/generate-podcasts.js              # generate all voice tracks
//   node scripts/generate-podcasts.js --music      # also generate Suno music
//   node scripts/generate-podcasts.js --id ep-why-body-reacts  # single item
//   node scripts/generate-podcasts.js --dry-run    # preview what would be generated
//
// OUTPUT: assets/audio/*.mp3
//
// COST ESTIMATE (ElevenLabs Starter plan, ~$5/month for 30k chars):
//   ~8 episodes x ~1200 chars avg  =  ~9,600 chars
//   ~4 session voice scripts x ~2500 chars avg  =  ~10,000 chars
//   Total: ~20,000 chars — fits comfortably on the free tier (10k chars/month)
//   or Starter plan in one run. Files are generated once and bundled.
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SUNO_API_KEY = process.env.SUNO_API_KEY;
const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel — calm, warm
const MODEL_ID = 'eleven_turbo_v2_5'; // Fast + high quality. Use 'eleven_multilingual_v2' for more emotion.
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'audio');

const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes('--dry-run');
const GENERATE_MUSIC = ARGS.includes('--music');
const SINGLE_ID = (() => { const i = ARGS.indexOf('--id'); return i !== -1 ? ARGS[i + 1] : null; })();

// ─── Import content definitions ───────────────────────────────────────────────
// We inline the content here so this script works without tsx/ts-node.
// If you add new episodes/sessions to audioContent.ts, copy the relevant
// id/script/audioFile fields here too.

const EPISODES = [
  { id: 'ep-why-body-reacts', audioFile: 'ep-why-body-reacts.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_WHY_BODY_REACTS },
  { id: 'ep-fight-flight-freeze', audioFile: 'ep-fight-flight-freeze.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_FIGHT_FLIGHT_FREEZE },
  { id: 'ep-hypervigilance', audioFile: 'ep-hypervigilance.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_HYPERVIGILANCE },
  { id: 'ep-window-of-tolerance', audioFile: 'ep-window-of-tolerance.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_WINDOW_OF_TOLERANCE },
  { id: 'ep-what-is-emdr', audioFile: 'ep-what-is-emdr.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_WHAT_IS_EMDR },
  { id: 'ep-day-tight', audioFile: 'ep-day-tight.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_DAY_TIGHT },
  { id: 'ep-worry-math', audioFile: 'ep-worry-math.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_WORRY_MATH },
  { id: 'ep-cooperate-inevitable', audioFile: 'ep-cooperate-inevitable.mp3', voiceId: DEFAULT_VOICE_ID, script: require('./episode-scripts').EP_COOPERATE_INEVITABLE },
];

const SESSIONS = [
  {
    id: 'session-settle-activated',
    voiceFile: 'session-settle-activated-voice.mp3',
    musicFile: 'session-settle-activated-music.mp3',
    voiceId: DEFAULT_VOICE_ID,
    musicPrompt: 'Slow calm ambient music for nervous system regulation. Steady gentle pulse around 60 BPM. Soft piano, gentle strings, subtle pads. No sudden changes. No percussion. No lyrics. Major or neutral key. Sounds like gently floating, settling, exhaling. Duration 12 minutes.',
    musicStyle: 'ambient therapeutic 60bpm piano strings calm',
    voiceScript: require('./episode-scripts').SESSION_SETTLE_ACTIVATED,
  },
  {
    id: 'session-wake-shutdown',
    voiceFile: 'session-wake-shutdown-voice.mp3',
    musicFile: 'session-wake-shutdown-music.mp3',
    voiceId: DEFAULT_VOICE_ID,
    musicPrompt: 'Gentle slightly uplifting ambient music for slowly awakening a shut-down nervous system. 70 BPM. Piano, light acoustic guitar, subtle strings. Gradually brightening. No sudden changes. No lyrics.',
    musicStyle: 'ambient warm gentle 70bpm piano acoustic guitar uplifting',
    voiceScript: require('./episode-scripts').SESSION_WAKE_SHUTDOWN,
  },
  {
    id: 'session-ground-now',
    voiceFile: 'session-ground-now-voice.mp3',
    musicFile: 'session-ground-now-music.mp3',
    voiceId: DEFAULT_VOICE_ID,
    musicPrompt: 'Neutral grounding ambient music. 65 BPM, steady and stable. Soft pads, subtle nature sounds. No melody, just texture. No lyrics. No percussion.',
    musicStyle: 'ambient grounding nature pads 65bpm no melody no lyrics texture',
    voiceScript: require('./episode-scripts').SESSION_GROUND_NOW,
  },
  {
    id: 'session-evening-unwind',
    voiceFile: 'session-evening-unwind-voice.mp3',
    musicFile: 'session-evening-unwind-music.mp3',
    voiceId: DEFAULT_VOICE_ID,
    musicPrompt: 'Very slow deeply soothing ambient music for sleep preparation. 50 BPM or slower. Soft synth pads, gentle cello, singing bowls. Almost no rhythm, just texture. Gradually getting quieter over 20 minutes. No lyrics.',
    musicStyle: 'ambient sleep very slow pads cello bowls no rhythm no lyrics deep calm',
    voiceScript: require('./episode-scripts').SESSION_EVENING_UNWIND,
  },
];

// ─── ElevenLabs TTS ───────────────────────────────────────────────────────────

async function generateVoice(script, voiceId, outputPath) {
  if (DRY_RUN) {
    console.log(`  [dry-run] Would generate voice -> ${path.basename(outputPath)} (${script.length} chars)`);
    return;
  }

  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not set. Export it in your shell before running this script.');
  }

  const url = `${ELEVENLABS_BASE}/text-to-speech/${voiceId}`;
  const body = JSON.stringify({
    text: script,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.77,
      similarity_boost: 0.75,
      style: 0.12,
      use_speaker_boost: true,
    },
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${text}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  console.log(`  v Saved ${path.basename(outputPath)} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

// ─── Suno music generation ────────────────────────────────────────────────────

async function generateMusic(session) {
  if (!GENERATE_MUSIC) return;

  const outputPath = path.join(OUTPUT_DIR, session.musicFile);
  if (fs.existsSync(outputPath)) {
    console.log(`  ->  ${session.musicFile} already exists — skipping`);
    return;
  }

  if (DRY_RUN) {
    console.log(`  [dry-run] Would generate Suno music -> ${session.musicFile}`);
    console.log(`           Prompt: ${session.musicPrompt.slice(0, 80)}...`);
    return;
  }

  if (!SUNO_API_KEY) {
    console.warn(`  !  SUNO_API_KEY not set — skipping ${session.musicFile}`);
    console.warn(`     Generate manually at suno.com with prompt:`);
    console.warn(`     "${session.musicPrompt}"`);
    return;
  }

  console.log(`  Submitting Suno job for ${session.id}...`);
  const res = await fetch('https://api.suno.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUNO_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: session.musicPrompt,
      style: session.musicStyle,
      title: session.id,
      instrumental: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  x Suno error ${res.status}: ${text}`);
    return;
  }

  const job = await res.json();
  console.log(`  Suno job submitted: ${job.id} — polling...`);

  // Poll
  let audioUrl = null;
  const deadline = Date.now() + 300_000;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 5000));
    const poll = await fetch(`https://api.suno.ai/v1/generate/${job.id}`, {
      headers: { 'Authorization': `Bearer ${SUNO_API_KEY}` },
    });
    const status = await poll.json();
    console.log(`  Suno: ${status.status}`);
    if (status.status === 'completed' && status.audioUrl) { audioUrl = status.audioUrl; break; }
    if (status.status === 'failed') { console.error(`  x Suno job failed`); return; }
  }

  if (!audioUrl) { console.error(`  x Suno job timed out`); return; }

  const dlRes = await fetch(audioUrl);
  const buffer = Buffer.from(await dlRes.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  console.log(`  v Saved ${session.musicFile} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n  Regulate — audio generation script');
  console.log(`Output dir: ${OUTPUT_DIR}\n`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Episodes
  for (const ep of EPISODES) {
    if (SINGLE_ID && ep.id !== SINGLE_ID) continue;
    const outputPath = path.join(OUTPUT_DIR, ep.audioFile);

    console.log(`\nEpisode: ${ep.id}`);
    if (fs.existsSync(outputPath) && !ARGS.includes('--force')) {
      console.log(`  ->  ${ep.audioFile} already exists — skipping (use --force to regenerate)`);
      continue;
    }
    await generateVoice(ep.script, ep.voiceId, outputPath);
  }

  // Sessions
  for (const session of SESSIONS) {
    if (SINGLE_ID && session.id !== SINGLE_ID) continue;
    const voicePath = path.join(OUTPUT_DIR, session.voiceFile);

    console.log(`\nSession: ${session.id}`);

    if (fs.existsSync(voicePath) && !ARGS.includes('--force')) {
      console.log(`  ->  ${session.voiceFile} already exists — skipping (use --force to regenerate)`);
    } else {
      await generateVoice(session.voiceScript, session.voiceId, voicePath);
    }

    await generateMusic(session);
  }

  console.log('\n Done.');
  if (!GENERATE_MUSIC) {
    console.log('\n  Background music not generated (no --music flag).');
    console.log('   See services/suno.ts for manual generation instructions via suno.com.');
  }
  console.log('\nNext steps:');
  console.log('  1. Verify the generated MP3s sound right (play them!)');
  console.log('  2. For sessions, also place the Suno background music in assets/audio/');
  console.log('  3. Run `npx expo start` to test the Listen tab');
  console.log('  4. Optional: upload MP3s to Supabase Storage and set EXPO_PUBLIC_AUDIO_CDN_BASE\n');
}

main().catch((err) => {
  console.error('\n Error:', err.message);
  process.exit(1);
});
