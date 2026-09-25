// Build a WebVTT caption file from a narration transcript (scripts/transcribe.mjs
// output), so every micro-video and briefing ships with captions.
//
// Usage:
//   node scripts/captions.mjs public/chapters/<folder>/narration.transcript.json \
//     --script courses/<slug>/scripts/NN-<lab-slug>/<media-id>.md \
//     --map courses/<slug>/caption-map.json \
//     [--beats public/chapters/<folder>/beats.json]
//
// All flags are optional; --script is the recommended mode. Writes
// narration.vtt next to the transcript.
//
// --beats moves the cues onto the composition's timeline. A narrated video
// adds holds (pauses) by splitting the narration at sentence breaks, so
// without it every cue after a hold runs early against the render. It reads
// beats.json's `holds` (composition seconds; a hold at 0 is the lead-in) and
// shifts each cue by the lead-in plus every hold that comes before it in the
// narration. Run it once beats.json exists (the /video step), not at /audio.
//
// --script takes the cue TEXT from the spec's narration (the same text
// generate-audio.mjs sent to ElevenLabs: frontmatter stripped, everything above
// "## Visual brief", minus headings and HTML comments) and only the TIMINGS
// from whisper. Script words and transcript words are normalized (lowercase,
// punctuation stripped) and aligned in order with a dynamic-programming
// sequence alignment that also accepts near-miss spellings and one word heard
// as two (or two as one). Matched script words take the matched word's timing;
// runs of unmatched script words are spread across the transcript words (or the
// silence) between their aligned neighbors. Sentence punctuation comes from the
// script. The alignment rate and every unaligned stretch over 3 words go to
// stderr, so a wrong script/transcript pair or a bad take is obvious. Without
// --script the cue text is whisper's own text, as before, which mishears
// technical words: read that .vtt against the script before delivering it.
//
// --map points at a JSON object of spoken form -> caption text, e.g.
//   {"ess ess": "ss", "soo-doh": "sudo", "Get Child Item": "Get-ChildItem"}
// The narration uses phonetic spellings so the voice says commands right;
// captions should show the real syntax. Matching is case-insensitive on whole
// words and runs BEFORE cues are sized, so a replacement longer than its spoken
// form can never push a cue to a third line. Keep the map in step with the TTS
// phonetic list in CLAUDE.md (courses/<slug>/caption-map.json by convention).
// Without --script the map only fixes spoken forms whisper happened to spell
// exactly as the script does ("ess ess" often comes back as "SS").
//
// Cue rules (DCMP Captioning Key and Netflix English timed text guidance; see
// .claude/references/writing/video-scripts.md Q7):
// - A cue is at most MAX_LINES lines of MAX_LINE characters and at most
//   MAX_CUE_SECONDS long. A cue that fits one line stays one line.
// - Cues break at sentence ends, and at a pause after a comma, semicolon, or
//   colon (PAUSE_BREAK_MS). When a cue overflows, it splits at the latest
//   clause punctuation in its second half, and never after an article,
//   preposition, or conjunction.
// - Two-line cues are balanced: prefer a break after punctuation, never end
//   line 1 on a function word (BAD_END), prefer bottom-heavy when otherwise
//   equal.
// - Caption-map replacements and code-like tokens (containing / _ = or an
//   inner - or .) are unbreakable: a token is never split across lines or cues,
//   and spaces inside a replacement are written as no-break spaces so a narrow
//   player cannot re-wrap "ss -tln" either.
// - Each cue stays up at least MIN_CUE_SECONDS (extended into the next gap, or
//   merged with the next cue, or rejoined to the previous cue when a clause
//   split made it; otherwise flagged), ends CUE_GAP_MS before the next one
//   starts, and
//   is flagged above MAX_CPS characters per second. The file's words per
//   minute is reported against MAX_WPM.
// - No backticks or markdown in cue text; only real syntax for words actually
//   spoken. &, <, > are escaped as WebVTT requires.

import {existsSync, readFileSync, writeFileSync} from 'node:fs';

const MAX_LINE = 42;
const MAX_LINES = 2;
const MAX_CUE_SECONDS = 5.5;
const MIN_CUE_SECONDS = 1.0;
const CUE_GAP_MS = 80; // 2 frames at 25 fps, about 2.4 frames at 30 fps
const TAIL_MS = 800; // how long a cue lingers past its last word when nothing follows soon
const MAX_CPS = 20; // Netflix adult reading rate
const MAX_WPM = 160; // DCMP upper-level educational presentation rate
// generate-audio.mjs shortens every internal silence of SILENCE_MIN_SECONDS
// (0.6 s) or more down to SILENCE_CAP_SECONDS (0.45 s), so after the trim a
// word gap is almost never longer than about 450 ms. A pause break above that
// would be dead code, so this sits just under the cap and only fires after
// clause punctuation (a comma, semicolon, or colon), where a new cue reads
// naturally. Sentence ends always break regardless of the gap. If you change
// the trim constants, revisit this value.
const PAUSE_BREAK_MS = 400;

// Words that must not end line 1 of a cue (or a cue that runs on into the
// next one): articles, prepositions, conjunctions. SOFT_END words (possessives
// and determiners) are discouraged but allowed when nothing better exists.
const BAD_END = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'nor',
  'from', 'by', 'into', 'onto', 'via', 'per', 'as', 'than', 'about', 'over', 'under',
  'through', 'between', 'after', 'before', 'without', 'within',
]);
const SOFT_END = new Set(['your', 'its', 'their', 'our', 'my', 'this', 'these', 'those', 'each', 'every', 'no', 'is', 'are']);

// ---------------------------------------------------------------- arguments

const USAGE = 'Usage: node scripts/captions.mjs <narration.transcript.json> [--map <file.json>] [--script <spec.md>] [--beats <beats.json>]';
const args = process.argv.slice(2);
const opts = {};
let input = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--map' || a === '--script' || a === '--beats') {
    if (!args[i + 1] || args[i + 1].startsWith('--')) {
      console.error(USAGE);
      process.exit(1);
    }
    opts[a.slice(2)] = args[++i];
  } else if (a.startsWith('--')) {
    console.error(`Unknown option ${a}.\n${USAGE}`);
    process.exit(1);
  } else if (!input) input = a;
}
if (!input) {
  console.error(USAGE);
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`No transcript at ${input}. Run scripts/transcribe.mjs on the MP3 first.`);
  process.exit(1);
}

const warnings = [];
const warn = (msg) => warnings.push(msg);

// Holds from beats.json, as narration-time positions. A hold's composition
// time minus the holds before it is where it sits in the narration (inside
// the silence the audio is cut at); the lead-in (at 0) shifts everything.
let holdShift = () => 0;
if (opts.beats) {
  if (!existsSync(opts.beats)) {
    console.error(`No beats file at ${opts.beats}.`);
    process.exit(1);
  }
  const holds = [...(JSON.parse(readFileSync(opts.beats, 'utf8')).holds ?? [])].sort((a, b) => a.at - b.at);
  let before = 0;
  const marks = holds.map((h) => {
    const m = {narrMs: h.at <= 0.001 ? -Infinity : (h.at - before) * 1000, ms: h.seconds * 1000};
    before += h.seconds;
    return m;
  });
  holdShift = (narrMs) => marks.reduce((sum, m) => (m.narrMs <= narrMs ? sum + m.ms : sum), 0);
}

// ------------------------------------------------------------------ helpers

// Lowercase and strip everything but letters and digits: "Ess," -> "ess",
// "soo-doh" -> "soodoh", "don't" -> "dont". Used for matching only.
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const bare = (s) => s.toLowerCase().replace(/[^a-z']/g, '');
const endsSentence = (text) => /[.!?]["')\]]*$/.test(text);
const endsClause = (text) => /[,;:]["')\]]*$/.test(text);
const codeLike = (text) => /[/_=]/.test(text) || /[\p{L}\p{N}][-.][\p{L}\p{N}]/u.test(text);
const secs = (ms) => (ms / 1000).toFixed(2);

// ------------------------------------------------------------- transcript

// Each whisper segment is roughly one word (transcribe.mjs asks for token-level
// timestamps). Drop empty segments and special tokens like [_BEG_].
const segments = JSON.parse(readFileSync(input, 'utf8'))
  .map((s) => ({text: s.text.replace(/\[_[A-Z]+_\]/g, ''), from: s.offsets.from, to: s.offsets.to}))
  .filter((w) => w.text.trim() !== '');

// Glue punctuation-only or leading-apostrophe pieces ("'s", ",") onto the word before.
const heard = [];
for (const w of segments) {
  const prev = heard[heard.length - 1];
  if (prev && !/^\s/.test(w.text)) {
    prev.text += w.text;
    prev.to = w.to;
  } else {
    heard.push({...w, text: w.text.trim()});
  }
}
if (heard.length === 0) {
  console.error(`Transcript ${input} has no words.`);
  process.exit(1);
}

// -------------------------------------------------------------------- map

let map = {};
if (opts.map) {
  if (!existsSync(opts.map)) {
    console.error(`No caption map at ${opts.map}.`);
    process.exit(1);
  }
  map = JSON.parse(readFileSync(opts.map, 'utf8'));
}
// Longest spoken form first, so "ess ess dash tee" wins over "ess ess".
const mapEntries = Object.entries(map)
  .map(([spoken, shown]) => ({norms: spoken.split(/\s+/).map(norm).filter(Boolean), shown: String(shown)}))
  .filter((e) => e.norms.length > 0)
  .sort((a, b) => b.norms.length - a.norms.length || b.norms.join('').length - a.norms.join('').length);

// Turn timed words into caption tokens, replacing spoken forms with their
// caption text. A replacement becomes ONE token (timed from its first word's
// start to its last word's end) and keeps the punctuation around the spoken
// form: "ess ess," -> "ss,". A phrase never matches across clause or sentence
// punctuation inside it.
const toTokens = (words) => {
  const tokens = [];
  for (let i = 0; i < words.length; ) {
    const hit = mapEntries.find((e) =>
      e.norms.every(
        (n, k) =>
          i + k < words.length &&
          norm(words[i + k].text) === n &&
          (k === e.norms.length - 1 || !/[.!?,;:]["')\]]*$/.test(words[i + k].text)),
      ),
    );
    if (hit) {
      const first = words[i];
      const last = words[i + hit.norms.length - 1];
      const lead = first.text.match(/^[^\p{L}\p{N}]*/u)[0];
      const trail = last.text.match(/[^\p{L}\p{N}]*$/u)[0];
      tokens.push({text: lead + hit.shown + trail, from: first.from, to: last.to, keep: true, mapped: true});
      i += hit.norms.length;
    } else {
      const w = words[i];
      tokens.push({text: w.text, from: w.from, to: w.to, keep: codeLike(w.text), mapped: false});
      i++;
    }
  }
  return tokens;
};

// ----------------------------------------------------------------- script

// Same extraction as parseScript() in generate-audio.mjs: frontmatter
// stripped, everything above "## Visual brief", minus HTML comments and
// heading lines. (Copied, not imported: generate-audio.mjs runs on import.)
function parseScript(raw) {
  raw = raw.replace(/\r\n/g, '\n');
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = {};
  if (fm) {
    for (const line of fm[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2].replace(/\s+#.*$/, '').trim();
    }
  }
  const body = (fm ? raw.slice(fm[0].length) : raw).split(/^## Visual brief/im)[0];
  const narration = body
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return {meta, narration};
}

// Players render markdown literally, so drop it: links keep their text,
// backticks go, emphasis markers at word edges go, list and quote markers go.
const stripMarkdown = (text) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`+/g, '')
    .replace(/(\*\*|__)(\S(?:.*?\S)?)\1/g, '$2')
    .replace(/(^|\s)[*_](\S(?:[^*_]*?\S)?)[*_](?=\s|[.,;:!?)"']|$)/g, '$1$2')
    .replace(/^\s*(?:[-*+]|\d+\.|>)\s+/gm, '');

const lev = (a, b) => {
  const row = Array.from({length: b.length + 1}, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return row[b.length];
};
// 2 = same word, 1 = near miss ("inode" heard for "inodes"), 0 = different.
const pairScore = (a, b) => {
  if (a === b) return 2;
  if (a.length < 4 || b.length < 4 || a[0] !== b[0] || Math.abs(a.length - b.length) > 2) return 0;
  return 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.75 ? 1 : 0;
};

// Align script words to transcript words in order (weighted LCS). Returns,
// per script word, {from, to, jFirst, jLast} or null when unmatched.
function align(sw, tw) {
  const n = sw.length;
  const m = tw.length;
  const W = m + 1;
  const score = new Int32Array((n + 1) * W);
  const move = new Uint8Array((n + 1) * W); // 1 skip script, 2 skip transcript, 3 one:one, 4 one:two, 5 two:one
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      if (i === 0 && j === 0) continue;
      let best = -1;
      let mv = 0;
      const consider = (s, k) => {
        if (s > best) {
          best = s;
          mv = k;
        }
      };
      if (i > 0 && j > 0) {
        const p = pairScore(sw[i - 1], tw[j - 1].norm);
        if (p) consider(score[(i - 1) * W + j - 1] + p, 3);
      }
      if (i > 0 && j > 1 && sw[i - 1] === tw[j - 2].norm + tw[j - 1].norm) consider(score[(i - 1) * W + j - 2] + 2, 4);
      if (i > 1 && j > 0 && sw[i - 2] + sw[i - 1] === tw[j - 1].norm) consider(score[(i - 2) * W + j - 1] + 4, 5);
      if (i > 0) consider(score[(i - 1) * W + j], 1);
      if (j > 0) consider(score[i * W + j - 1], 2);
      score[i * W + j] = best;
      move[i * W + j] = mv;
    }
  }
  const out = new Array(n).fill(null);
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const mv = move[i * W + j];
    if (mv === 1) i--;
    else if (mv === 2) j--;
    else if (mv === 3) {
      out[i - 1] = {from: tw[j - 1].from, to: tw[j - 1].to, jFirst: j - 1, jLast: j - 1};
      i--;
      j--;
    } else if (mv === 4) {
      out[i - 1] = {from: tw[j - 2].from, to: tw[j - 1].to, jFirst: j - 2, jLast: j - 1};
      i--;
      j -= 2;
    } else {
      // two script words heard as one: split its span by length
      const t = tw[j - 1];
      const cut = t.from + ((t.to - t.from) * sw[i - 2].length) / (sw[i - 2].length + sw[i - 1].length);
      out[i - 2] = {from: t.from, to: cut, jFirst: j - 1, jLast: j - 1};
      out[i - 1] = {from: cut, to: t.to, jFirst: j - 1, jLast: j - 1};
      i -= 2;
      j--;
    }
  }
  return out;
}

// Script words with timings: aligned ones from whisper, the rest spread
// across the transcript words (or silence) between their aligned neighbors.
function timeScript(narration) {
  const words = stripMarkdown(narration)
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => ({text, norm: norm(text)}));
  const tw = heard.map((w) => ({...w, norm: norm(w.text)})).filter((w) => w.norm);
  const idx = words.map((w, k) => (w.norm ? k : -1)).filter((k) => k >= 0);
  const hits = align(
    idx.map((k) => words[k].norm),
    tw,
  );
  const timing = new Array(words.length).fill(null);
  idx.forEach((k, a) => (timing[k] = hits[a]));

  const first = tw[0]?.from ?? heard[0].from;
  const last = tw[tw.length - 1]?.to ?? heard[heard.length - 1].to;
  const stretches = [];
  for (let a = 0; a < words.length; ) {
    if (timing[a]) {
      a++;
      continue;
    }
    let b = a;
    while (b < words.length && !timing[b]) b++;
    const prev = a > 0 ? timing[a - 1] : null;
    const next = b < words.length ? timing[b] : null;
    const jLo = prev ? prev.jLast + 1 : 0;
    const jHi = next ? next.jFirst - 1 : tw.length - 1;
    let start = prev ? prev.to : first;
    let end = next ? next.from : last;
    if (jHi >= jLo) {
      // unmatched transcript words sit in the hole: the run was spoken there
      start = Math.max(start, tw[jLo].from);
      end = Math.min(end, tw[jHi].to);
    }
    if (end < start) end = start;
    const weights = words.slice(a, b).map((w) => w.text.length + 1);
    const total = weights.reduce((s, x) => s + x, 0);
    let t = start;
    for (let k = a; k < b; k++) {
      const d = ((end - start) * weights[k - a]) / total;
      timing[k] = {from: t, to: t + d, interpolated: true};
      t += d;
    }
    const counted = words.slice(a, b).filter((w) => w.norm).length;
    if (counted > 3) stretches.push({at: start, text: words.slice(a, b).map((w) => w.text).join(' ')});
    a = b;
  }

  const aligned = idx.filter((k) => !timing[k].interpolated).length;
  const pct = idx.length ? Math.round((100 * aligned) / idx.length) : 0;
  console.error(`script alignment: ${pct}% of ${idx.length} script words aligned to the transcript (${aligned}/${idx.length})`);
  for (const s of stretches) console.error(`  unaligned at ${secs(s.at)}s: "${s.text}"`);
  if (pct < 60) warn(`only ${pct}% of the script aligned: is this the right spec for this transcript, and is the transcript current?`);

  return words.map((w, k) => ({text: w.text, from: timing[k].from, to: timing[k].to}));
}

// ---------------------------------------------------------------- tokens

let timedWords;
if (opts.script) {
  if (!existsSync(opts.script)) {
    console.error(`No script spec at ${opts.script}.`);
    process.exit(1);
  }
  const {meta, narration} = parseScript(readFileSync(opts.script, 'utf8'));
  if (meta.type === 'gif' || meta.type === 'card') {
    console.error(`${opts.script} is a ${meta.type} spec; it has no narration to caption.`);
    process.exit(1);
  }
  if (!narration) {
    console.error(`No narration found above "## Visual brief" in ${opts.script}.`);
    process.exit(1);
  }
  timedWords = timeScript(narration);
} else {
  timedWords = heard.map((w) => ({...w, text: w.text.replace(/`+/g, '')})).filter((w) => w.text);
}
const tokens = toTokens(timedWords);
for (const t of tokens) {
  if (t.text.length > MAX_LINE) warn(`"${t.text}" is ${t.text.length} characters, longer than one caption line (${MAX_LINE}); it gets a line to itself and overflows`);
}

// ------------------------------------------------------------- line layout

const lineLen = (toks) => toks.reduce((n, t) => n + t.text.length, 0) + Math.max(0, toks.length - 1);

// Greedy fill gives the fewest lines, so it decides whether a cue fits.
const greedyLines = (toks) => {
  const lines = [[]];
  for (const t of toks) {
    const cur = lines[lines.length - 1];
    if (cur.length && lineLen([...cur, t]) > MAX_LINE) lines.push([t]);
    else cur.push(t);
  }
  return lines;
};
const fits = (toks) => greedyLines(toks).length <= MAX_LINES;

// Best two-line break: balanced, after punctuation when it can be, never after
// a function word, bottom-heavy on a tie. forced = a token index the break
// must sit at (two short sentences sharing a cue get a line each).
const layout = (toks, forced = null) => {
  if (forced == null && lineLen(toks) <= MAX_LINE) return [toks];
  if (MAX_LINES < 2 || toks.length < 2) return greedyLines(toks);
  let best = null;
  for (let k = 1; k < toks.length; k++) {
    if (forced != null && k !== forced) continue;
    const a = lineLen(toks.slice(0, k));
    const b = lineLen(toks.slice(k));
    const end = toks[k - 1].text;
    const tail = toks.slice(k);
    let cost = (Math.max(0, a - MAX_LINE) + Math.max(0, b - MAX_LINE)) * 1000 + Math.abs(a - b);
    if (endsSentence(end) || endsClause(end)) cost -= 18;
    else if (BAD_END.has(bare(end))) cost += 500;
    else if (SOFT_END.has(bare(end))) cost += 40;
    if (tail.length === 1 && (BAD_END.has(bare(tail[0].text)) || SOFT_END.has(bare(tail[0].text)))) cost += 500;
    if (BAD_END.has(bare(tail[0].text)) && !endsClause(end)) cost -= 10; // break before a conjunction or preposition
    if (a > b) cost += 0.5;
    if (!best || cost < best.cost) best = {k, cost};
  }
  const lines = [toks.slice(0, best.k), toks.slice(best.k)];
  // A layout that still needs a third line (only when cue building could not
  // avoid it) falls back to greedy so nothing is cut.
  return lines.every((l) => lineLen(l) <= MAX_LINE) || forced != null ? lines : greedyLines(toks);
};

// Where to split an overflowing cue: the latest clause punctuation in its
// second half, else the latest token that is not a function word, else the end.
const splitPoint = (cur) => {
  const lo = Math.max(1, Math.floor(cur.length / 2));
  for (let k = cur.length; k >= lo; k--) if (endsClause(cur[k - 1].text)) return k;
  for (let k = cur.length; k >= lo; k--) {
    const w = bare(cur[k - 1].text);
    if (!BAD_END.has(w) && !SOFT_END.has(w)) return k;
  }
  return cur.length;
};

// ---------------------------------------------------------------- cues

const spanMs = (toks) => toks[toks.length - 1].to - toks[0].from;
const overflows = (toks) => !fits(toks) || spanMs(toks) / 1000 > MAX_CUE_SECONDS;

const groups = [];
let cur = [];
const flush = () => {
  if (cur.length) groups.push(cur);
  cur = [];
};
for (const t of tokens) {
  if (cur.length) {
    const last = cur[cur.length - 1];
    // Break at a clause pause only if the cue, lingering into that pause,
    // can still stay up MIN_CUE_SECONDS.
    const pause =
      endsClause(last.text) &&
      t.from - last.to > PAUSE_BREAK_MS &&
      t.from - CUE_GAP_MS - cur[0].from >= MIN_CUE_SECONDS * 1000;
    if (pause) flush();
    else if (overflows([...cur, t])) {
      const k = splitPoint(cur);
      const rest = cur.slice(k);
      cur = cur.slice(0, k);
      flush();
      cur = rest;
      if (cur.length && overflows([...cur, t])) flush();
    }
  }
  cur.push(t);
  if (endsSentence(t.text)) flush();
}
flush();

const cues = groups.map((toks) => ({toks, forced: null}));
const cueFrom = (c) => c.toks[0].from;
const cueTo = (c) => c.toks[c.toks.length - 1].to;
const cueText = (c) => c.toks.map((t) => t.text).join(' ');

// Merge b into a if the result still reads as one cue. Two sentences may share
// a cue only as one line each (never end a sentence and start another on the
// same line).
const tryMerge = (a, b) => {
  const toks = [...a.toks, ...b.toks];
  if ((cueTo(b) - cueFrom(a)) / 1000 > MAX_CUE_SECONDS) return null;
  if (endsSentence(cueText(a))) {
    if (a.forced != null || b.forced != null || MAX_LINES < 2) return null;
    if (lineLen(a.toks) > MAX_LINE || lineLen(b.toks) > MAX_LINE) return null;
    return {toks, forced: a.toks.length};
  }
  if (a.forced != null || b.forced != null || !fits(toks)) return null;
  return {toks, forced: null};
};

// Minimum duration and the gap before the next cue.
for (let i = 0; i < cues.length; i++) {
  const c = cues[i];
  const next = cues[i + 1];
  const limit = next ? cueFrom(next) - CUE_GAP_MS : Infinity;
  // Linger up to TAIL_MS past the last word, but not past MAX_CUE_SECONDS on
  // screen unless the words themselves run that long.
  let end = Math.min(limit, cueTo(c) + TAIL_MS, Math.max(cueTo(c), cueFrom(c) + MAX_CUE_SECONDS * 1000));
  if (end - cueFrom(c) < MIN_CUE_SECONDS * 1000) {
    if (limit - cueFrom(c) >= MIN_CUE_SECONDS * 1000) end = cueFrom(c) + MIN_CUE_SECONDS * 1000;
    else {
      const merged = next ? tryMerge(c, next) : null;
      if (merged) {
        cues.splice(i, 2, merged);
        i--;
        continue;
      }
      // Last resort: rejoin the previous cue when this one only exists because
      // a clause pause or an overflow split the sentence there.
      const prev = cues[i - 1];
      const back = prev && !endsSentence(cueText(prev)) ? tryMerge(prev, c) : null;
      if (back) {
        cues.splice(i - 1, 2, back);
        i -= 2;
        continue;
      }
      warn(`cue ${i + 1} (${secs(cueFrom(c))}s) is on screen ${secs(end - cueFrom(c))}s, under ${MIN_CUE_SECONDS}s, and cannot extend or merge: "${cueText(c)}"`);
    }
  }
  if (end <= cueFrom(c)) end = cueFrom(c) + 1;
  c.end = end;
}

// ---------------------------------------------------------------- output

const ts = (ms) => {
  ms = Math.max(0, Math.round(ms));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(r).padStart(3, '0')}`;
};
const vttEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const render = (t) => vttEscape(t.mapped ? t.text.replace(/ /g, '\u00A0') : t.text);

let words = 0;
const body = cues
  .map((c, i) => {
    const text = cueText(c);
    words += text.split(/\s+/).length;
    const dur = (c.end - cueFrom(c)) / 1000;
    const cps = text.length / dur;
    if (cps > MAX_CPS) warn(`cue ${i + 1} (${secs(cueFrom(c))}s) reads at ${cps.toFixed(1)} characters per second, over ${MAX_CPS}: "${text}"`);
    const lines = layout(c.toks, c.forced).map((l) => l.map(render).join(' '));
    if (lines.length > MAX_LINES) warn(`cue ${i + 1} (${secs(cueFrom(c))}s) needs ${lines.length} lines: "${text}"`);
    const shift = holdShift(cueFrom(c));
    return `${i + 1}\n${ts(cueFrom(c) + shift)} --> ${ts(c.end + shift)}\n${lines.join('\n')}`;
  })
  .join('\n\n');

const out = input.replace(/\.transcript\.json$/, '.vtt');
writeFileSync(out, `WEBVTT\n\n${body}\n`);

const speakingMin = (cueTo(cues[cues.length - 1]) - cueFrom(cues[0])) / 60000;
const wpm = speakingMin > 0 ? words / speakingMin : 0;
if (wpm > MAX_WPM) warn(`average rate is ${Math.round(wpm)} words per minute over speaking time, above the ${MAX_WPM} wpm ceiling for adult educational captions`);
for (const w of warnings) console.error(`warning: ${w}`);
console.log(`${cues.length} cues, ${words} words, ${Math.round(wpm)} wpm over ${(speakingMin * 60).toFixed(1)}s of speech -> ${out}${opts.beats ? ` (shifted by the holds in ${opts.beats})` : ''}`);
