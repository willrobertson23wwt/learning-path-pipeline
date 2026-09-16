// Transcribe a chapter MP3 to word-level timestamps using whisper.cpp.
// Usage: node scripts/transcribe.mjs public/chapters/hard-ch1/narration.mp3
import {execSync} from 'node:child_process';
import {existsSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {downloadWhisperModel, installWhisperCpp, transcribe} from '@remotion/install-whisper-cpp';

const WHISPER_DIR = path.join(process.cwd(), 'whisper.cpp');
const WHISPER_VERSION = '1.5.5';
const MODEL = 'base.en';

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: node scripts/transcribe.mjs <path-to-audio>');
  process.exit(1);
}
const input = path.resolve(inputArg);

await installWhisperCpp({to: WHISPER_DIR, version: WHISPER_VERSION});
await downloadWhisperModel({model: MODEL, folder: WHISPER_DIR});

// whisper.cpp wants 16 kHz mono WAV. Regenerate it when the source audio is
// newer — a stale cached wav silently produces timings for the OLD narration.
const wav16 = input.replace(/\.[^.]+$/, '.16khz.wav');
if (!existsSync(wav16) || statSync(wav16).mtimeMs < statSync(input).mtimeMs) {
  execSync(`npx remotion ffmpeg -i "${input}" -ar 16000 -ac 1 -y "${wav16}"`, {stdio: 'inherit'});
}

const {transcription} = await transcribe({
  inputPath: wav16,
  whisperPath: WHISPER_DIR,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  tokenLevelTimestamps: true,
});

const out = input.replace(/\.[^.]+$/, '.transcript.json');
writeFileSync(out, JSON.stringify(transcription, null, 2));

for (const segment of transcription) {
  console.log(`[${(segment.offsets.from / 1000).toFixed(2)}s -> ${(segment.offsets.to / 1000).toFixed(2)}s] ${segment.text}`);
}
console.log(`\nSaved: ${out}`);
