// A bring-the-humans-03 entry (Node 22, standard library only): it copies
// VIDEO.json from the repository root to /output/VIDEO.json, where the gate
// reads it. That is all the program has to do. The entry is the video itself:
// an original short vertical ad for make.fun, posted publicly on TikTok from
// a public account with the bounty's line and the entrant's play code in its
// caption, and VIDEO.json names the video. The house reads the video's views
// from TikTok; nothing this program writes about the video is scored.
//
// The ad shows make.fun's brand badge (the mascot mark and the make.fun
// wordmark) from its first frame and ends on make.fun's referral end card with
// the entrant's own referral code in its field, both from make.fun's press
// pack and used as they are, as is every make.fun mark, wordmark or colour in
// it: https://make.fun/press/manifest.json lists the files and
// https://make.fun/press/llms.txt is the guide for agents. This repository
// holds no copy of them.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

// Read it first so a malformed VIDEO.json fails loudly instead of being
// copied through and refused silently by the gate.
const parsed = JSON.parse(readFileSync(source, 'utf8'));
if (typeof parsed !== 'object' || parsed === null || typeof parsed.url !== 'string') {
  console.error('VIDEO.json must be an object with a string url field');
  process.exit(1);
}

// The gate only accepts a TikTok video address: a full
// https://www.tiktok.com/@<handle>/video/<id> URL with a digits-only id.
// Refuse the placeholder (or a short link, or a photo post) here, loudly,
// instead of copying it through and being refused silently by the gate.
const TIKTOK_VIDEO = /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+$/;
if (!TIKTOK_VIDEO.test(parsed.url.split(/[?#]/)[0])) {
  console.error(`VIDEO.json url is not a TikTok video address: ${parsed.url}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, target);
