// Resolve narration phrases to beat times from a whisper.cpp transcript, so
// Remotion and Manim scenes share one timing source (beats.json).
//
// Dump the transcript as timed words (pick phrases from this, not the script:
// whisper writes "32" where the narration says "thirty two"):
//   node scripts/beats.mjs public/chapters/<id>/narration.transcript.json --words
//
// Resolve a beat spec to beats.json:
//   node scripts/beats.mjs public/chapters/<id>/narration.transcript.json \
//     --spec out/<id>/beats.spec.json [--out public/chapters/<id>/beats.json]
//
// beats.spec.json maps beat name -> one of:
//   "phrase as whisper wrote it"          start of the phrase's first word
//   {"phrase": "...", "offset": -0.2}     same, shifted (seconds)
//   {"phrase": "...", "edge": "end"}      end of the phrase's last word
//   {"at": 57.9}                          a literal composition time (scene cuts, the end)
//   {"at": 0, "hold": 3.0}                a hold at a literal time (a lead-in)
//   {"phrase": "...", "edge": "end", "hold": 2.5}
//                                         a hold: the narration stops for 2.5 s at
//                                         this point (end of the phrase's last word)
// Phrase beats are narration time plus every hold before them, so they come
// out in composition time: list beats after a hold at their narration phrase
// and the shift is added here. `at` times are composition time already.
// beats.json also lists each hold ({name, at, seconds}, `at` in composition
// time) so the audio can be split there.
// Phrases match case- and punctuation-insensitively, searched in spec order
// from the previous beat's match, so a phrase that repeats resolves to the
// occurrence after the beat before it.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const transcriptPath = args[0];
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
if (!transcriptPath) {
  console.error('Usage: node scripts/beats.mjs <transcript.json> (--words | --spec <beats.spec.json> [--out <beats.json>])');
  process.exit(1);
}

// whisper.cpp token output: a token starting with a space begins a new word;
// bracketed tokens ([_BEG_], [_TT_...]) are markers, not speech.
const segments = JSON.parse(readFileSync(transcriptPath, 'utf8'));
const words = [];
for (const seg of segments) {
  for (const tok of seg.tokens ?? []) {
    if (tok.text.startsWith('[_') || tok.text.trim() === '') continue;
    const from = tok.offsets.from / 1000;
    const to = tok.offsets.to / 1000;
    if (tok.text.startsWith(' ') || words.length === 0) {
      words.push({text: tok.text.trim(), from, to});
    } else {
      const w = words[words.length - 1];
      w.text += tok.text;
      w.to = to;
    }
  }
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9/]+/g, ' ').trim();
const normWords = words.map((w) => norm(w.text)).map((w) => w.split(/\s+/).filter(Boolean));
const flat = []; // one entry per normalized word piece, pointing back at its word
normWords.forEach((pieces, i) => pieces.forEach((p) => flat.push({p, i})));
const duration = words.length ? words[words.length - 1].to : 0;

if (args.includes('--words')) {
  let line = '';
  let lineStart = 0;
  words.forEach((w, i) => {
    if (!line) lineStart = w.from;
    line += (line ? ' ' : '') + w.text;
    if (/[.?!]$/.test(w.text) || line.length > 90 || i === words.length - 1) {
      console.log(`${lineStart.toFixed(2).padStart(7)}  ${line}`);
      line = '';
    }
  });
  console.log(`\nduration ${duration.toFixed(2)} s, ${words.length} words`);
  process.exit(0);
}

const specPath = flag('--spec');
if (!specPath) {
  console.error('Pass --words or --spec <beats.spec.json>.');
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const beats = {};
const matched = {};
const problems = [];
const holds = [];
let shift = 0; // total hold time so far (s)
let cursor = 0; // index into flat

for (const [name, raw] of Object.entries(spec)) {
  const entry = typeof raw === 'string' ? {phrase: raw} : raw;
  if (typeof entry.at === 'number') {
    beats[name] = round(entry.at);
    if (typeof entry.hold === 'number') {
      // a hold at a literal time, e.g. a lead-in before the first word
      holds.push({name, at: round(entry.at), seconds: entry.hold});
      shift += entry.hold;
    }
    continue;
  }
  const target = norm(entry.phrase ?? '').split(/\s+/).filter(Boolean);
  if (!target.length) {
    problems.push(`${name}: no phrase or at`);
    continue;
  }
  const hit = find(target, cursor) ?? find(target, 0);
  if (hit == null) {
    problems.push(`${name}: phrase not found: "${entry.phrase}"`);
    continue;
  }
  if (hit < cursor) problems.push(`${name}: "${entry.phrase}" only found before the previous beat (out of order?)`);
  const first = words[flat[hit].i];
  const last = words[flat[hit + target.length - 1].i];
  const t = (entry.edge === 'end' ? last.to : first.from) + (entry.offset ?? 0) + shift;
  beats[name] = round(t);
  if (typeof entry.hold === 'number') {
    holds.push({name, at: round(t), seconds: entry.hold});
    shift += entry.hold;
  }
  matched[name] = words.slice(flat[hit].i, flat[hit + target.length - 1].i + 1).map((w) => w.text).join(' ');
  cursor = hit + target.length;
}

const outPath = flag('--out') ?? path.join(path.dirname(transcriptPath), 'beats.json');
mkdirSync(path.dirname(outPath), {recursive: true});
writeFileSync(
  outPath,
  JSON.stringify(
    {transcript: transcriptPath, duration: round(duration), totalHold: round(shift), beats, holds, matched},
    null,
    2,
  ) + '\n',
);

for (const [name, t] of Object.entries(beats)) {
  console.log(`${t.toFixed(2).padStart(7)}  ${name}${matched[name] ? `  <- "${matched[name]}"` : ''}`);
}
for (const h of holds) console.log(`hold ${h.seconds} s at ${h.at} (${h.name})`);
console.log(`\nwrote ${outPath}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ` + problems.join('\n  '));
  process.exit(2);
}

function find(target, start) {
  for (let i = start; i + target.length <= flat.length; i++) {
    if (target.every((p, k) => flat[i + k].p === p)) return i;
  }
  return null;
}
function round(t) {
  return Math.round(t * 100) / 100;
}
