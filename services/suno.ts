// ─────────────────────────────────────────────────────────────────────────────
// Suno music generation
//
// Suno (suno.com) generates AI music from text prompts. This file provides
// a client for the Suno API and a CLI workflow guide.
//
// ─── HOW TO GENERATE SESSION BACKGROUND MUSIC ───────────────────────────────
//
// OPTION A: Suno Web Interface (simplest, no API needed)
// ──────────────────────────────────────────────────────
//   1. Go to suno.com and sign in
//   2. For each session, copy the `musicPrompt` from audioContent.ts
//   3. In Suno, use "Custom Mode" and paste the prompt as the "Description"
//   4. Set the Style Tags to the `musicStyle` field from audioContent.ts
//   5. Generate (usually 2–4 variations appear) — pick the best one
//   6. Download the MP3
//   7. Rename to match the `musicFile` field in audioContent.ts
//   8. Place in assets/audio/
//
// The four session music files to generate:
//   session-settle-activated-music.mp3   "Settle an activated system"
//   session-wake-shutdown-music.mp3      "Gently wake up a shut-down system"
//   session-ground-now-music.mp3         "Ground yourself right now"
//   session-evening-unwind-music.mp3     "Evening unwind"
//
// OPTION B: Suno API (requires API access)
// ─────────────────────────────────────────
// Suno's API is in limited access. If you have access:
//   - Set SUNO_API_KEY in your .env
//   - Run: node scripts/generate-podcasts.js --music
//   - The script will submit generation jobs, poll for completion, and
//     download the best track for each session.
//
// OPTION C: Alternative music sources
// ─────────────────────────────────────
// If Suno API access isn't available, you can substitute with:
//   - Udio (udio.com) — similar AI music generation
//   - Mubert (api.mubert.com) — has an API, generates ambient loops
//   - Royalty-free ambient music from Freesound.org or Pixabay Music
//     (filter for "ambient", "therapeutic", "binaural")
//   - Music by Marconi Union, Brian Eno, Stars of the Lid — often used in
//     therapeutic settings; check licensing before commercial use.
// ─────────────────────────────────────────────────────────────────────────────

export const SUNO_API_BASE = 'https://api.suno.ai/v1'; // Verify current URL at docs.suno.com

export interface SunoGenerationRequest {
  prompt: string;
  style: string;
  title: string;
  instrumental: true; // Always true — we never want lyrics
  duration?: number;  // seconds, if supported
}

export interface SunoGenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audioUrl?: string;
  title?: string;
}

// Suno client — used by scripts/generate-podcasts.js, not at runtime in the app.
export class SunoClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMusic(request: SunoGenerationRequest): Promise<string> {
    const response = await fetch(`${SUNO_API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        instrumental: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Suno API error ${response.status}: ${text}`);
    }

    const data = await response.json();
    const jobId: string = data.id ?? data.job_id;

    // Poll for completion
    return this.pollUntilComplete(jobId);
  }

  private async pollUntilComplete(jobId: string, maxWaitMs = 300_000): Promise<string> {
    const startTime = Date.now();
    const pollInterval = 5000; // 5 seconds

    while (Date.now() - startTime < maxWaitMs) {
      await new Promise((r) => setTimeout(r, pollInterval));

      const statusRes = await fetch(`${SUNO_API_BASE}/generate/${jobId}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });

      if (!statusRes.ok) continue;

      const job: SunoGenerationJob = await statusRes.json();

      if (job.status === 'completed' && job.audioUrl) {
        return job.audioUrl;
      }
      if (job.status === 'failed') {
        throw new Error(`Suno generation job ${jobId} failed`);
      }

      console.log(`  Suno job ${jobId}: ${job.status}... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
    }

    throw new Error(`Suno generation job ${jobId} timed out after ${maxWaitMs / 1000}s`);
  }

  async downloadAudio(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download audio: ${res.status}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }
}
