// ─────────────────────────────────────────────────────────────────────────────
// Audio content definitions
//
// HOW AUDIO FILES ARE GENERATED:
//   1. Run `node scripts/generate-podcasts.js` with your ELEVENLABS_API_KEY set.
//      This calls ElevenLabs TTS for every episode/session voice track and saves
//      MP3s into assets/audio/.
//   2. For session background music, use Suno (suno.com) with the `musicPrompt`
//      below, download the track, and save it to assets/audio/<sessionId>-music.mp3.
//      OR run `node scripts/generate-podcasts.js --music` if you have Suno API access.
//   3. After files are in assets/audio/, they get bundled with the app automatically.
//
// VOICE: Uses ElevenLabs voice "Rachel" by default (calm, warm, female US English).
//   Voice ID: 21m00Tcm4TlvDq8ikWAM
//   Change DEFAULT_VOICE_ID in services/elevenlabs.ts to use a different voice.
// ─────────────────────────────────────────────────────────────────────────────

export type AudioState = 'activated' | 'shutdown' | 'any';

export interface PodcastEpisode {
  id: string;
  title: string;
  summary: string;
  tag: string;
  emoji: string;
  durationMin: number;
  script: string;
  audioFile: string;
}

export interface GuidedSession {
  id: string;
  title: string;
  summary: string;
  emoji: string;
  durationMin: number;
  targetState: AudioState;
  voiceScript: string;
  musicPrompt: string;
  musicStyle: string;
  voiceFile: string;
  musicFile: string;
}

// ─── EPISODES ────────────────────────────────────────────────────────────────

export const episodes: PodcastEpisode[] = [
  {
    id: 'ep-why-body-reacts',
    title: "Why your body keeps reacting",
    summary: "It's not in your head. It's in your nervous system.",
    tag: 'The basics',
    emoji: '🧠',
    durationMin: 4,
    audioFile: 'ep-why-body-reacts.mp3',
    script: `After something scary or painful, the body doesn't automatically reset to "safe." The nervous system learned that something dangerous happened. And so it stays on guard — watching, scanning, waiting for signs it could happen again. This is protective. It kept your ancestors alive. But it becomes a problem when the alert stays on long after the danger has passed. Racing heart. Tight chest. Feeling frozen or numb. Jumpiness. Trouble sleeping. These are not signs you're weak or broken. They're signs your body is doing exactly what it was designed to do — it just hasn't gotten the message that it's over. The goal isn't to stop these reactions. What you can do is help your nervous system learn, slowly and gently, that it's safe enough to settle.`,
  },
  {
    id: 'ep-fight-flight-freeze',
    title: "Fight, flight, and freeze",
    summary: "Three survival responses — and why you can't just 'calm down.'",
    tag: 'How it works',
    emoji: '⚡',
    durationMin: 4,
    audioFile: 'ep-fight-flight-freeze.mp3',
    script: `When the nervous system senses danger, it doesn't consult your thinking brain. It acts. In a fraction of a second, your body shifts into one of three survival modes. Fight: the system mobilizes to defend. You feel restless, angry, tense — ready to push back. Flight: the system mobilizes to run. Anxiety surges. You want to escape, avoid, get out. Freeze: when fighting or running won't help, the system plays dead. Numbness sets in. You feel stuck, shut down, disconnected, like you're behind glass watching your own life. That's why "just calm down" doesn't work. By the time someone says those words, your body has already made the decision. What does help is working with the body, not against it. Slow breathing signals safety to the nervous system. Grounding pulls attention into the present moment.`,
  },
  {
    id: 'ep-hypervigilance',
    title: "What is hypervigilance?",
    summary: 'Always on alert. Scanning for danger. Exhausted from watching.',
    tag: 'Common experiences',
    emoji: '👁',
    durationMin: 4,
    audioFile: 'ep-hypervigilance.mp3',
    script: `Hypervigilance is the nervous system stuck in scanning mode. It's the experience of being continuously alert — checking exits when you walk into a room, reading people's expressions for signs of disapproval or threat, startling at sounds that wouldn't bother most people, finding it almost impossible to relax even when nothing is wrong. The system is watching. Always watching. And it's exhausting. Hypervigilance isn't a personality flaw. It's an adaptation — a nervous system that learned, through real experience, that the environment wasn't safe. The antidote is accumulating small, reliable experiences of safety. Grounding exercises. Orienting — slowly scanning a room and noticing what's neutral or pleasant. Long exhale breathing. These are messages to the nervous system: nothing bad is happening right now. It's safe enough to put the watch down, just for a moment.`,
  },
  {
    id: 'ep-window-of-tolerance',
    title: "The Window of Tolerance",
    summary: "There's a zone where you can think, feel, and function. Here's how to find it.",
    tag: 'A useful map',
    emoji: '🪟',
    durationMin: 4,
    audioFile: 'ep-window-of-tolerance.mp3',
    script: `Psychiatrist Dan Siegel described what he called a "window of tolerance." It's a zone of arousal — a kind of middle band — where you can think clearly, feel your feelings without being overwhelmed by them, and respond to what's happening rather than just react. Above the window is hyperarousal: too activated. Anxiety, panic, anger, racing thoughts. Below the window is hypoarousal: too shut down. Numb, foggy, disconnected, exhausted, collapsed. Trauma narrows the window. Small things push you above or below it. The exercises in this app are designed to help you notice where you are and find small ways to move back toward the center. The window can widen over time. That's what healing actually looks like. Not the absence of hard feelings, but a growing ability to be with them without being swept away.`,
  },
  {
    id: 'ep-what-is-emdr',
    title: "What is EMDR therapy?",
    summary: 'An evidence-based therapy that works with the body, not just the mind.',
    tag: 'Therapy options',
    emoji: '👁️',
    durationMin: 3,
    audioFile: 'ep-what-is-emdr.mp3',
    script: `EMDR stands for Eye Movement Desensitization and Reprocessing. It was developed by Francine Shapiro in the late 1980s and is now recognized by the World Health Organization and the American Psychological Association as an evidence-based treatment for PTSD. A trained therapist guides you to briefly hold a painful memory in mind while doing bilateral stimulation — typically slow left-right eye movements, alternating taps, or audio tones that switch from ear to ear. The back-and-forth rhythm seems to help the brain reprocess traumatic memories, so they lose some of their grip. The bilateral tool in this app is a calming aid, not EMDR. If you're interested in the real thing, the EMDR International Association has a therapist finder at emdria.org.`,
  },
  {
    id: 'ep-day-tight',
    title: "Live in day-tight compartments",
    summary: "The past is gone. The future isn't here. Today is the only place you can actually live.",
    tag: 'Carnegie',
    emoji: '🚪',
    durationMin: 3,
    audioFile: 'ep-day-tight.mp3',
    script: `Carnegie borrowed this image from the physician Sir William Osler: a great ocean liner with watertight compartments. When one floods, the others stay dry. The ship keeps sailing. The past is finished. Nothing you do today changes it. The future hasn't arrived — worrying about it only borrows trouble from days that may never come, and drains the energy you need for what's actually in front of you. Today is the one compartment that's open. Today is the only place you have any real power. The question that unlocks this: what can I do today? Just today? Not what should I have done. Not what might happen. What can I actually do with the next few hours, right here, with what I have? That's the compartment you're in. That's where your life is happening. And it's enough.`,
  },
  {
    id: 'ep-worry-math',
    title: "Why most of what you worry about never happens",
    summary: "The math of worry is worse than you think.",
    tag: 'Carnegie',
    emoji: '📊',
    durationMin: 3,
    audioFile: 'ep-worry-math.mp3',
    script: `Studies on what people actually worry about consistently find the same pattern. About forty percent of worries never happen at all. About thirty percent are about things that already happened and can't be changed. About twenty-two percent are about trivial things. About eight percent are real concerns. Of that eight percent, most are solvable. So roughly ninety-two percent of worry energy is misdirected. Carnegie's prescription isn't to stop worrying. It's to redirect. Ask yourself: is this in the eight percent? Is this real, is it happening now, and can I do something about it? If yes — make a plan and act on it. The worry usually quiets once there's a real response. If no — notice that. You're burning fuel on an engine that's running in place. And you can choose to let it idle.`,
  },
  {
    id: 'ep-cooperate-inevitable',
    title: "Cooperate with the inevitable",
    summary: "What cannot be changed must be accepted — or it will control you.",
    tag: 'Carnegie',
    emoji: '🌊',
    durationMin: 3,
    audioFile: 'ep-cooperate-inevitable.mp3',
    script: `Carnegie described one of the most powerful mental moves a worried person can make: the willingness to accept what cannot be changed. Fighting against a fact — a diagnosis, a loss, a decision that can't be undone — doesn't change the fact. It keeps you locked in the fight, burning energy that could go toward what comes next. Acceptance doesn't mean approval. It doesn't mean the thing that happened was okay. It means: this is real. This happened. And now I have to decide what to do with it. When you stop fighting a reality that isn't going to move, something releases. The energy that was going into resistance becomes available again. The question that unlocks this is simple: can I change this? If yes — make a plan. If no — accept it, and redirect. Put your energy where it can actually go somewhere.`,
  },
];

// ─── GUIDED SESSIONS ─────────────────────────────────────────────────────────

export const guidedSessions: GuidedSession[] = [
  {
    id: 'session-settle-activated',
    title: "Settle an activated system",
    summary: "For when you're anxious, on edge, or can't slow down. 12 minutes of long exhale breathing, orienting, and bilateral rhythm.",
    emoji: '🌬️',
    durationMin: 12,
    targetState: 'activated',
    voiceFile: 'session-settle-activated-voice.mp3',
    musicFile: 'session-settle-activated-music.mp3',
    musicPrompt: `Slow, calm ambient music for nervous system regulation. Steady gentle pulse around 60 BPM. Soft piano, gentle strings, subtle pads. No sudden changes. No percussion. No lyrics. Major or neutral key. Sounds like: gently floating, settling, exhaling. Duration: 12 minutes.`,
    musicStyle: 'ambient, therapeutic, 60bpm, piano, strings, calm, no lyrics, no drums',
    voiceScript: `Find a comfortable position. You can sit or lie down — whatever feels right. Let your eyes close, or soften your gaze toward the floor. Take a moment to just notice that you're here. You don't need to be anywhere else right now. Let's start with your breath. Breathe in slowly through your nose for a count of four. One, two, three, four. Now hold gently for two. And breathe out slowly for a count of six. One, two, three, four, five, six. The long exhale is doing something real. It's activating the parasympathetic brake — the part of your nervous system that slows the heart rate and lowers the alarm. Every long exhale is a message: not a threat. It's safe to settle. Now I'm going to invite you to try something called orienting. Slowly open your eyes, or gently lift your gaze. And just look around. Not searching for anything. Just noticing. Let your eyes move slowly around the room. Pause on anything that feels neutral — the corner of a wall, a piece of furniture, a patch of light. This is orienting. You're telling your brainstem: I've looked. There's no threat here. We can stand down. Now, let's add a bilateral rhythm. Place your hands on your thighs, or cross your arms gently over your chest. And slowly, begin to tap — left, right, left, right — in a slow, steady rhythm. Let the rhythm anchor you here. In this moment. In this body. In this room that is safe. Whenever you're ready, you can let the tapping slow and stop. You did something real just now. That wasn't just relaxation — it was giving your nervous system the evidence it needed that it's safe enough to settle. Take your time.`,
  },
  {
    id: 'session-wake-shutdown',
    title: "Gently wake up a shut-down system",
    summary: "For when you're numb, foggy, or disconnected. 10 minutes of activating breath and body scan to help you return.",
    emoji: '☀️',
    durationMin: 10,
    targetState: 'shutdown',
    voiceFile: 'session-wake-shutdown-voice.mp3',
    musicFile: 'session-wake-shutdown-music.mp3',
    musicPrompt: `Gentle, slightly uplifting ambient music for slowly awakening a shut-down nervous system. Soft and warm, not intense. Gentle pulse around 70 BPM. Piano, light acoustic guitar, subtle strings. Gradually brightening over 10 minutes. No sudden changes. No lyrics.`,
    musicStyle: 'ambient, warm, gentle, 70bpm, piano, acoustic guitar, uplifting, no lyrics',
    voiceScript: `Welcome. Wherever you are right now — numbed out, foggy, disconnected, like you're watching yourself from a distance — that's okay. You don't need to feel anything in particular to be here. Shut-down states are the nervous system's protection. At some point, it learned that going offline was safer than staying present. We're going to work gently with that — not push through it, but invite it to ease, a little at a time. Start by noticing your feet on the floor. If you can, press them down gently — just a little pressure. Feel the ground. Now your hands. Rub them together slowly — just for a moment — until you feel a little warmth. Good. Sensation is the beginning of coming back. Let's try an activating breath — breathe with a little more energy to wake the system up gently. Take a full breath in through the nose — fill your chest all the way up. And breathe out completely. Shut-down states don't lift all at once. They lift in small increments — a bit more sensation here, a bit more presence there. Each exercise is one more inch back toward yourself. When you're ready, take a slightly deeper breath in, and let it go. You can come back to this anytime. There's no rush.`,
  },
  {
    id: 'session-ground-now',
    title: "Ground yourself right now",
    summary: "When you need to return to the present moment fast. 8 minutes of 5-4-3-2-1 grounding with gentle guidance.",
    emoji: '🌿',
    durationMin: 8,
    targetState: 'activated',
    voiceFile: 'session-ground-now-voice.mp3',
    musicFile: 'session-ground-now-music.mp3',
    musicPrompt: `Neutral, grounding ambient music. Very gentle, 65 BPM, steady and stable. Soft pads, subtle nature sounds (very quiet forest or distant water). No piano melody, just texture and atmosphere. No lyrics. No percussion.`,
    musicStyle: 'ambient, grounding, nature, pads, 65bpm, no melody, no lyrics, texture',
    voiceScript: `Right now, wherever your mind went — we're going to bring it back. Not to the past. Not to the future. Just here. This room. This body. This moment. We're going to use your senses. Senses only exist in the present. The nervous system can't be flooded by a threat and also fully present in sensory experience at the same time. Grounding uses that. Let's start. Look around you and find five things you can see. Not quickly — take your time with each one. One thing you can see. Take your time. Find another. And a third. A fourth. And a fifth. You found five things that exist right now, in this moment. They're real. You're here. Now: four things you can hear. Good. Three things you can physically feel — the texture of the surface under you, the temperature of the air on your skin, the pressure of the floor under your feet. Two things you can smell. And one thing you can taste. Five, four, three, two, one. All present. All real. All happening right now. You can do this anywhere. At a desk, in a waiting room, on public transit, in the middle of a hard conversation. Your senses are always available. The present moment is always available.`,
  },
  {
    id: 'session-evening-unwind',
    title: "Evening unwind",
    summary: "A slow 20-minute body scan and breathing sequence to put the day down and prepare for rest.",
    emoji: '🌙',
    durationMin: 20,
    targetState: 'any',
    voiceFile: 'session-evening-unwind-voice.mp3',
    musicFile: 'session-evening-unwind-music.mp3',
    musicPrompt: `Very slow, deeply soothing ambient music for sleep preparation and nervous system settling. 50 BPM or slower. Very soft synth pads, gentle cello, distant bells or singing bowls. Almost no rhythm — just texture that ebbs and flows like breathing. Gradually getting quieter over 20 minutes. No lyrics. No percussion.`,
    musicStyle: 'ambient, sleep, very slow, pads, cello, bowls, no rhythm, no lyrics, deep calm',
    voiceScript: `The day is over. Whatever happened in it — the hard moments, the things that didn't go the way you wanted, the things still unresolved — you don't have to carry them into sleep. Tonight, you can set them down. Find a position you can stay in for a while. Lying down is ideal if that's available. Let your arms rest at your sides, or on your belly. Let your legs relax — let your feet fall open naturally. Take one intentional breath — in through the nose, out through the mouth. Just to signal to your body that we're shifting gears. We're going to travel slowly through the body. When we reach each part, you don't need to do anything to it. Just notice it's there. Just say hello. Start with the top of your head. Your forehead. Your eyes. Let them be heavy. Let them rest. Your jaw — let it hang loose. Your neck. Your shoulders. Let them sink. Your arms, all the way down to your fingertips. Let them go. Your chest. Your belly. Your lower back. Your hips. Your thighs. Your knees. Your calves. Your feet. Your whole body, from head to toe. Heavy. Here. Not going anywhere. Let's close with a few long exhale breaths. In through the nose, two, three, four. Hold, two. Out through the mouth, soft and slow, two, three, four, five, six, seven, eight. There is nothing you need to do now. Nowhere you need to be. If sleep comes, let it. If it doesn't, let this rest be enough. You put the day down. That's something. Good night.`,
  },
];
