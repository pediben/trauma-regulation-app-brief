// ─────────────────────────────────────────────────────────────────────────────
// ElevenLabs TTS service
//
// This file has two purposes:
//   1. RUNTIME: getAudioUri() resolves the URL/path for a given audio file so
//      the AudioPlayer knows where to stream from.
//   2. BUILD-TIME: the generate* functions are used by scripts/generate-podcasts.js
//      to pre-generate all audio files. They are NOT called at runtime in the app.
//
// SETUP:
//   - Get your ElevenLabs API key at elevenlabs.io
//   - Set ELEVENLABS_API_KEY in your .env (or pass directly to the script)
//   - Run: node scripts/generate-podcasts.js
//
// VOICES:
//   Default voice is "Rachel" (ID: 21m00Tcm4TlvDq8ikWAM) — calm, warm, clear.
//   Other good options for therapeutic content:
//     - "Adam"    pNInz6obpgDQGcFmaJgB  (deep, calm, male)
//     - "Bella"   EXAVITQu4vr4xnSDxMaL  (soft, warm, female)
//     - "Domi"    AZnzlk1XvdvUeBnXmlld  (strong, warm, female)
//   Browse all at: https://api.elevenlabs.io/v1/voices
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel
export const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

// ─── Runtime: audio URI resolution ───────────────────────────────────────────
//
// The app resolves audio files in this order:
//   1. CDN URL (if EXPO_PUBLIC_AUDIO_CDN_BASE is set in your .env)
//   2. Bundled local file from assets/audio/
//
// To use a CDN (recommended for production to allow content updates without
// an app store update), upload your generated MP3s to Supabase Storage, S3,
// or any CDN, then set EXPO_PUBLIC_AUDIO_CDN_BASE in app.config.js.

const CDN_BASE = process.env.EXPO_PUBLIC_AUDIO_CDN_BASE;

// Map of filename → local require() for bundled audio
// Add entries here whenever you add a new audio file to assets/audio/.
// (React Native requires static require() calls — no dynamic paths.)
const LOCAL_AUDIO: Record<string, () => number> = {
  'ep-why-body-reacts.mp3': () => require('../assets/audio/ep-why-body-reacts.mp3'),
  'ep-fight-flight-freeze.mp3': () => require('../assets/audio/ep-fight-flight-freeze.mp3'),
  'ep-hypervigilance.mp3': () => require('../assets/audio/ep-hypervigilance.mp3'),
  'ep-window-of-tolerance.mp3': () => require('../assets/audio/ep-window-of-tolerance.mp3'),
  'ep-what-is-emdr.mp3': () => require('../assets/audio/ep-what-is-emdr.mp3'),
  'ep-day-tight.mp3': () => require('../assets/audio/ep-day-tight.mp3'),
  'ep-worry-math.mp3': () => require('../assets/audio/ep-worry-math.mp3'),
  'ep-cooperate-inevitable.mp3': () => require('../assets/audio/ep-cooperate-inevitable.mp3'),
  'session-settle-activated-voice.mp3': () => require('../assets/audio/session-settle-activated-voice.mp3'),
  'session-settle-activated-music.mp3': () => require('../assets/audio/session-settle-activated-music.mp3'),
  'session-wake-shutdown-voice.mp3': () => require('../assets/audio/session-wake-shutdown-voice.mp3'),
  'session-wake-shutdown-music.mp3': () => require('../assets/audio/session-wake-shutdown-music.mp3'),
  'session-ground-now-voice.mp3': () => require('../assets/audio/session-ground-now-voice.mp3'),
  'session-ground-now-music.mp3': () => require('../assets/audio/session-ground-now-music.mp3'),
  'session-evening-unwind-voice.mp3': () => require('../assets/audio/session-evening-unwind-voice.mp3'),
  'session-evening-unwind-music.mp3': () => require('../assets/audio/session-evening-unwind-music.mp3'),
};

/**
 * Resolves the audio source for expo-av.
 * Returns a CDN URL string or a local require() result.
 * Returns null if the file hasn't been generated yet.
 */
export function getAudioSource(filename: string): string | number | null {
  if (CDN_BASE) {
    return `${CDN_BASE.replace(/\/$/, '')}/${filename}`;
  }
  const loader = LOCAL_AUDIO[filename];
  if (!loader) return null;
  try {
    return loader();
  } catch {
    // File not generated yet
    return null;
  }
}

// ─── Build-time: ElevenLabs API types ────────────────────────────────────────
// These types are used by scripts/generate-podcasts.js, not in the app itself.

export interface ElevenLabsVoiceSettings {
  stability: number;        // 0–1. Higher = more consistent. Recommend 0.65–0.80 for narration.
  similarity_boost: number; // 0–1. How closely to match the voice. Recommend 0.75.
  style?: number;           // 0–1. Style exaggeration. Keep low (0–0.3) for narration.
  use_speaker_boost?: boolean;
}

export interface ElevenLabsTTSRequest {
  text: string;
  model_id: string;
  voice_settings: ElevenLabsVoiceSettings;
}

// Default voice settings tuned for calm therapeutic narration
export const NARRATION_VOICE_SETTINGS: ElevenLabsVoiceSettings = {
  stability: 0.75,
  similarity_boost: 0.75,
  style: 0.15,
  use_speaker_boost: true,
};

// For guided sessions — slightly warmer/softer
export const SESSION_VOICE_SETTINGS: ElevenLabsVoiceSettings = {
  stability: 0.80,
  similarity_boost: 0.75,
  style: 0.10,
  use_speaker_boost: true,
};
