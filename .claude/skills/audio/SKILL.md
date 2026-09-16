---
name: audio
description: Generate ElevenLabs narration audio for approved scripts, then transcribe for word timings
---

Generate narration audio for a course's approved scripts. `$ARGUMENTS` is the
course slug, optionally followed by a video number or an inclusive range to do
just those videos' chapters (e.g. `/audio powershell-fundamentals`,
`/audio powershell-fundamentals 3`, or `/audio powershell-fundamentals 21-24`).
Each chapter script file becomes one ElevenLabs request and one
`narration.mp3`.

## Steps

1. Node is installed via nvm and NOT on PATH in non-interactive shells — prefix
   every command per CLAUDE.md:
   `export PATH="$HOME/.nvm/versions/node/<version>/bin:$PATH"`

2. Dry-run first and show the user the plan (which files, char counts, rough
   durations): `node scripts/generate-audio.mjs <slug> [video|first-last] --dry-run`
   (the video argument accepts a single number or an inclusive range like
   `21-24`). Flag anything suspicious (a chapter way over/under the 150-300
   word range, over the model's per-request character limit, missing `folder:`
   frontmatter) BEFORE spending API credits.

3. Generate: `node scripts/generate-audio.mjs <slug> [video|first-last]`
   Existing MP3s are skipped; if the user asked to regenerate a chapter after a
   script edit, delete that chapter's `narration.mp3` (or pass the video number
   plus `--force` to redo one video). Never use `--force` for the whole course
   or for a multi-video range.

4. For each newly generated MP3, transcribe for word-level timings:
   `node scripts/transcribe.mjs public/chapters/<folder>/narration.mp3`
   Skip `*-intro` folders — intro segments get custom (non-Remotion) visuals,
   so no word timings are needed.

5. Report each file's duration (`npx remotion ffmpeg -i <file>` or read the
   transcript JSON) and STOP. The user listens to every track before any video
   work starts. Suggest `afplay public/chapters/<folder>/narration.mp3` or
   Remotion Studio for review. Do not start building chapters.

If the API returns an error, show the response body — quota and voice-ID
problems are self-explanatory there. The key and voice ID live in `.env`
(see `.env.example`).
