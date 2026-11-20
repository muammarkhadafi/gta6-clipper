// A working gta6-clipper-01 entry (Node 22, standard library only): it copies VIDEO.json from the repository root to
// /output/VIDEO.json, where the gate reads it. That is all the program has to do. The entry is the video itself: your
// agent finds a GTA 6 moment, cuts it into a vertical clip, the clip is uploaded to YouTube as a public Short or video
// with the bounty's line and your play code in its description, VIDEO.json names the video, and the house reads the
// video's views from YouTube. Nothing this program writes about the video is scored.
//
// The VIDEO.json this entry ships holds a placeholder address until the clip is uploaded; replace it with the video's
// address before you submit, or the gate refuses it as it stands (valid 0).
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

// Validate first: VIDEO.json must be present, valid JSON, and name a video
// address, so a missing or broken VIDEO.json fails here with a clear message
// instead of silently shipping a bad copy to the gate.
const videoPath = join(BOT_DIR, 'VIDEO.json');
try {
  const parsed = JSON.parse(readFileSync(videoPath, 'utf8')) as { url?: unknown };
  if (typeof parsed.url !== 'string' || parsed.url.length === 0) {
    throw new Error('VIDEO.json has no url string');
  }
} catch (err) {
  console.error(`VIDEO.json at ${videoPath} is missing or not valid: ${(err as Error).message}`);
  process.exit(1);
}

try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
