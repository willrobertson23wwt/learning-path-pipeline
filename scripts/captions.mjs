// Build a WebVTT caption file from a narration transcript (scripts/transcribe.mjs
// output), so every micro-video and briefing ships with captions.
//
// Usage:
//   node scripts/captions.mjs public/chapters/<folder>/narration.transcript.json [--map <file.json>]
//
// Writes narration.vtt next to the transcript. Cues break at sentence ends, at
// long pauses, or when a cue would pass two lines of MAX_LINE characters or
// MAX_CUE_SECONDS.
//
// --map points at a JSON object of spoken form -> caption text, e.g.
//   {"ess ess": "ss", "soo-doh": "sudo", "Get Child Item": "Get-ChildItem"}
// The narration uses phonetic spellings so the voice says commands right;
// captions should show the real syntax. Matching is case-insensitive on whole
// words. Keep the map in step with the TTS phonetic list in CLAUDE.md
// (courses/<slug>/caption-map.json by convention). Whisper also mishears
// technical words, so read the .vtt against the script before delivering it.

import {existsSync, readFileSync, writeFileSync} from 'node:fs';

const MAX_LINE = 42;
const MAX_LINES = 2;
const MAX_CUE_SECONDS = 5.5;
const PAUSE_BREAK_MS = 700;

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--'));
const mapIdx = args.indexOf('--map');
const mapPath = mapIdx >= 0 ? args[mapIdx + 1] : null;
if (!input || (mapIdx >= 0 && !mapPath)) {
  console.error('Usage: node scripts/captions.mjs <narration.transcript.json> [--map <file.json>]');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`No transcript at ${input}. Run scripts/transcribe.mjs on the MP3 first.`);
  process.exit(1);
}

// Each whisper segment is roughly one word (transcribe.mjs asks for token-level
// timestamps). Drop empty segments and special tokens like [_BEG_].
const words = JSON.parse(readFileSync(input, 'utf8'))
  .map((s) => ({text: s.text.replace(/\[_[A-Z]+_\]/g, ''), from: s.offsets.from, to: s.offsets.to}))
  .filter((w) => w.text.trim() !== '');

// Glue punctuation-only or leading-apostrophe pieces ("'s", ",") onto the word before.
const merged = [];
for (const w of words) {
  const prev = merged[merged.length - 1];
  if (prev && !/^\s/.test(w.text)) {
    prev.text += w.text;
    prev.to = w.to;
  } else {
    merged.push({...w, text: w.text.trim()});
  }
}

const lineWrap = (text) => {
  const lines = [''];
  for (const word of text.split(' ')) {
    const cur = lines[lines.length - 1];
    if (cur && (cur + ' ' + word).length > MAX_LINE) lines.push(word);
    else lines[lines.length - 1] = cur ? `${cur} ${word}` : word;
  }
  return lines;
};

const cues = [];
let cue = null;
for (let i = 0; i < merged.length; i++) {
  const w = merged[i];
  if (cue) {
    const text = `${cue.text} ${w.text}`;
    const tooLong = lineWrap(text).length > MAX_LINES || (w.to - cue.from) / 1000 > MAX_CUE_SECONDS;
    const pause = w.from - cue.to > PAUSE_BREAK_MS;
    if (tooLong || pause) {
      cues.push(cue);
      cue = null;
    }
  }
  if (!cue) cue = {from: w.from, to: w.to, text: w.text};
  else {
    cue.text += ` ${w.text}`;
    cue.to = w.to;
  }
  if (/[.!?]["')\]]?$/.test(w.text)) {
    cues.push(cue);
    cue = null;
  }
}
if (cue) cues.push(cue);

let map = {};
if (mapPath) {
  if (!existsSync(mapPath)) {
    console.error(`No caption map at ${mapPath}.`);
    process.exit(1);
  }
  map = JSON.parse(readFileSync(mapPath, 'utf8'));
}
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fixes = Object.entries(map)
  .sort((a, b) => b[0].length - a[0].length)
  .map(([spoken, shown]) => [new RegExp(`(?<![\\w-])${escape(spoken)}(?![\\w-])`, 'gi'), shown]);
const applyMap = (text) => fixes.reduce((t, [re, shown]) => t.replace(re, shown), text);

const ts = (ms) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(r).padStart(3, '0')}`;
};

const body = cues
  .map((c, i) => {
    // Keep each cue on screen until the next one starts (up to 0.8 s past its last word).
    const next = cues[i + 1];
    const end = next ? Math.min(next.from, c.to + 800) : c.to + 800;
    return `${i + 1}\n${ts(c.from)} --> ${ts(end)}\n${lineWrap(applyMap(c.text)).join('\n')}`;
  })
  .join('\n\n');

const out = input.replace(/\.transcript\.json$/, '.vtt');
writeFileSync(out, `WEBVTT\n\n${body}\n`);
console.log(`${cues.length} cues -> ${out}`);
