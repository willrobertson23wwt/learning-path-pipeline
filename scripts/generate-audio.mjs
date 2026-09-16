// Generate ElevenLabs narration MP3s for a course's approved scripts.
// One script file = one chapter = one TTS request = one narration.mp3.
//
// Usage:
//   node scripts/generate-audio.mjs <course-slug> [video|first-last] [--force] [--dry-run] [--no-trim]
//
// Reads courses/<course-slug>/scripts/NN-<video>/MM-<chapter>.md (recursively).
// The narration is everything above the "## Visual brief" heading, minus
// frontmatter, headings, and HTML comments. Output goes to
// public/chapters/<folder>/narration.mp3 where <folder> comes from the script
// file's frontmatter. Existing MP3s are skipped unless --force.
//
// After each generation, unusually long pauses between sentences are shortened
// (never fully removed — see trimExcessSilence) unless --no-trim is passed.
//
// Requires .env with ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID (see .env.example).

import {execFileSync, execSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync} from 'node:fs';
import path from 'node:path';

try {
  process.loadEnvFile(path.join(process.cwd(), '.env'));
} catch {
  // no .env — fall through to plain environment variables
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
// Per-request character limits: eleven_v3 allows 3k, multilingual v2 allows 10k.
const MAX_CHARS = MODEL_ID.startsWith('eleven_v3') ? 2900 : 9500;

const flags = process.argv.slice(2);
const force = flags.includes('--force');
const dryRun = flags.includes('--dry-run');
const noTrim = flags.includes('--no-trim');
const args = flags.filter((a) => !a.startsWith('--'));
const slug = args[0];
// [video] accepts a single number ("3") or an inclusive range ("21-24").
let videoRange = null;
if (args[1]) {
  const m = args[1].match(/^(\d+)(?:-(\d+))?$/);
  if (!m) {
    console.error(`Bad video argument "${args[1]}" — use a number (3) or a range (21-24).`);
    process.exit(1);
  }
  videoRange = [Number(m[1]), Number(m[2] ?? m[1])];
  if (videoRange[0] > videoRange[1]) videoRange.reverse();
}

if (!slug) {
  console.error('Usage: node scripts/generate-audio.mjs <course-slug> [video|first-last] [--force] [--dry-run] [--no-trim]');
  process.exit(1);
}
if (!dryRun && (!API_KEY || !VOICE_ID)) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const scriptsDir = path.join(process.cwd(), 'courses', slug, 'scripts');
if (!existsSync(scriptsDir)) {
  console.error(`No scripts found at ${scriptsDir} — run /scripts ${slug} first.`);
  process.exit(1);
}

function parseScript(raw) {
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

async function tts(text) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {'xi-api-key': API_KEY, 'Content-Type': 'application/json'},
      body: JSON.stringify({text, model_id: MODEL_ID}),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs API ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

// ElevenLabs occasionally leaves an excessively long pause between sentences.
// This shortens (never fully removes) any INTERNAL gap longer than
// SILENCE_CAP_SECONDS down to that length; short natural pauses are left
// alone since SILENCE_MIN_SECONDS only flags gaps already on the long side,
// and the very first/last silence in the file (lead-in/tail) is never touched.
const SILENCE_NOISE_DB = -40; // quieter than this counts as silence
const SILENCE_MIN_SECONDS = 0.6; // only flag gaps at least this long
const SILENCE_CAP_SECONDS = 0.45; // shorten flagged gaps down to this length

function getDurationSeconds(filePath) {
  const out = execSync(`npx remotion ffprobe "${filePath}" 2>&1`, {encoding: 'utf8'});
  const m = out.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
}

function trimExcessSilence(filePath) {
  const duration = getDurationSeconds(filePath);
  if (duration == null) return {trimmed: 0, cut: 0};

  const detectOut = execSync(
    `npx remotion ffmpeg -i "${filePath}" -af silencedetect=noise=${SILENCE_NOISE_DB}dB:d=${SILENCE_MIN_SECONDS} -f null - 2>&1`,
    {encoding: 'utf8'},
  );
  const starts = [...detectOut.matchAll(/silence_start:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...detectOut.matchAll(/silence_end:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  const gaps = starts
    .map((start, i) => ({start, end: ends[i]}))
    .filter((g) => g.end != null && g.start > 0.1 && g.end < duration - 0.1 && g.end - g.start > SILENCE_CAP_SECONDS);
  if (gaps.length === 0) return {trimmed: 0, cut: 0};

  // keep everything except the tail of each flagged gap (past SILENCE_CAP_SECONDS)
  let cursor = 0;
  let cutSeconds = 0;
  const keep = [];
  for (const g of gaps) {
    const cutStart = g.start + SILENCE_CAP_SECONDS;
    keep.push([cursor, cutStart]);
    cutSeconds += g.end - cutStart;
    cursor = g.end;
  }
  keep.push([cursor, null]);

  const filterParts = keep.map(([start, end], i) => {
    const range = end == null ? `start=${start}` : `start=${start}:end=${end}`;
    return `[0:a]atrim=${range},asetpts=PTS-STARTPTS[a${i}]`;
  });
  const concatInputs = keep.map((_, i) => `[a${i}]`).join('');
  const filterComplex = `${filterParts.join(';')};${concatInputs}concat=n=${keep.length}:v=0:a=1[out]`;

  const tmpOut = `${filePath}.trimmed.mp3`;
  execFileSync('npx', [
    'remotion', 'ffmpeg', '-i', filePath,
    '-filter_complex', filterComplex, '-map', '[out]',
    '-ar', '44100', '-b:a', '128k', '-y', tmpOut,
  ]);
  writeFileSync(filePath, readFileSync(tmpOut));
  unlinkSync(tmpOut);
  return {trimmed: gaps.length, cut: cutSeconds};
}

const files = readdirSync(scriptsDir, {recursive: true})
  .filter((f) => f.endsWith('.md'))
  .sort();
let generated = 0;
let failed = 0;
const done = [];

for (const file of files) {
  const {meta, narration} = parseScript(readFileSync(path.join(scriptsDir, file), 'utf8'));
  const video = meta.video ? Number(meta.video) : Number(path.dirname(file).match(/^(\d+)/)?.[1]);
  const chapter = meta.chapter ? Number(meta.chapter) : Number(path.basename(file).match(/^(\d+)/)?.[1]);
  if (videoRange !== null && (video < videoRange[0] || video > videoRange[1])) continue;

  if (!meta.folder) {
    console.error(`✗ ${file}: no "folder:" in frontmatter — add e.g. folder: <prefix>-v${video || 'N'}-ch${chapter || 'M'}`);
    failed++;
    continue;
  }
  const outDir = path.join(process.cwd(), 'public', 'chapters', meta.folder);
  const outFile = path.join(outDir, 'narration.mp3');

  if (!narration) {
    console.error(`✗ ${file}: no narration text found`);
    failed++;
    continue;
  }
  if (narration.length > MAX_CHARS) {
    console.error(`✗ ${file}: narration is ${narration.length} chars but ${MODEL_ID} allows ${MAX_CHARS}/request — trim it or use eleven_multilingual_v2`);
    failed++;
    continue;
  }
  if (existsSync(outFile) && !force) {
    console.log(`• ${file} → ${meta.folder}/narration.mp3 already exists (use --force to regenerate)`);
    continue;
  }
  if (dryRun) {
    console.log(`○ ${file} → ${meta.folder}/narration.mp3 (${narration.length} chars, ~${Math.round((narration.split(/\s+/).length / 140) * 60)}s)`);
    continue;
  }

  try {
    process.stdout.write(`⟳ ${file} → ${meta.folder}/narration.mp3 ... `);
    const audio = await tts(narration);
    mkdirSync(outDir, {recursive: true});
    writeFileSync(outFile, audio);

    let trimNote = '';
    if (!noTrim) {
      try {
        const {trimmed, cut} = trimExcessSilence(outFile);
        if (trimmed > 0) trimNote = `, trimmed ${trimmed} long pause${trimmed > 1 ? 's' : ''} (-${cut.toFixed(1)}s)`;
      } catch (err) {
        trimNote = ` (silence-trim skipped: ${err.message.split('\n')[0]})`;
      }
    }
    const finalSize = statSync(outFile).size;
    console.log(`done (${(finalSize / 1024 / 1024).toFixed(1)} MB${trimNote})`);
    generated++;
    done.push(outFile);
  } catch (err) {
    console.log('FAILED');
    console.error(`  ${err.message}`);
    failed++;
  }
}

console.log(`\n${generated} generated, ${failed} failed.`);
if (done.length) {
  console.log('\nNext: listen to each file, then transcribe for word timings:');
  for (const f of done) console.log(`  node scripts/transcribe.mjs ${path.relative(process.cwd(), f)}`);
}
if (failed) process.exit(1);
