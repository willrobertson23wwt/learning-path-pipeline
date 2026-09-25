---
name: audio
description: Generate ElevenLabs narration MP3s for a traditional path's reviewed chapter scripts (every chapter, each video's chapter 0 intro, and the path intro and review videos), then transcribe them for word-level timings and build their captions. Use when the user asks to generate, regenerate, or retake narration or voiceover audio for a path, a video, or a range of videos, e.g. "/audio linux-intermediate 3". Spends API credits, so run it only on an explicit request, never as an automatic follow-on to /scripts.
argument-hint: <course-slug> [video | first-last]
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Generate narration for a path's reviewed chapter scripts. `$ARGUMENTS` is
the course slug, optionally followed by a video number or inclusive range
(`/audio linux-intermediate`, `... 3`, `... 21-24`; `0` is the path intro
video). Each script file becomes one ElevenLabs request and one
`narration.mp3`, and that includes every video's chapter 0
(`00-intro.md`): it has no composition, but the user lays its audio over
the custom intro footage in Premiere. Node commands need the PATH setup in
`.claude/house-style.md`.

The model comes from `ELEVENLABS_MODEL_ID` in `.env` (default `eleven_v3`),
with optional `ELEVENLABS_STABILITY` and `ELEVENLABS_SEED`. It must match
the platform profile's **TTS model** line; one model, stability, and seed
(if any) per path, so a retake after a one-word edit sounds like the
approved take. If `.env` and the profile disagree, stop and ask which is
right.

## The ElevenLabs budget

ElevenLabs usage is limited, so every request counts:

- **State the character count first.** Before any run, tell the user how
  many characters it will send (add up the dry run's per-file counts over
  the files it would generate).
- **Regenerate at most once per video.** Batch every wording change for a
  video's chapters into one run. Holds and pauses never need new audio:
  `/video` makes them by splitting the existing take.
- **Wording changes wait for the shot list.** `/video` collects the
  designer's `## Narration changes` for every chapter of the video, the
  user approves them at its review stop, and only then does this skill run
  once for that video.
- **Fix a bad take now.** A mangled term, wrong stress on a key word, or a
  robotic run is worth retaking at the listen-first stop below, before any
  beats are timed to it. Batch every such retake for the video into one
  run, and tell the user whether it leaves room for the shot list's changes
  later or whether they should wait and combine them.

## Steps

1. **Dry run and show the plan** (files, character counts, rough
   durations, and the total characters):
   `node scripts/generate-audio.mjs <slug> [video|first-last] --dry-run`.
   Files whose `narration.mp3` already exists show as skipped. Flag
   anything off before any credits are spent:
   - a chapter's rough duration far from its outline length (the dry run
     estimates at 140 wpm from words alone, and the outline length is
     narration time, so the two should roughly match; see `/scripts` "Word
     budget");
   - a file over 2,900 characters, the house margin (the script refuses
     anything over 4,900);
   - missing `folder:` frontmatter (the right value is the chapter ID,
     `<prefix>-vN-chM` or `<prefix>-vN-intro`).

   In parallel, run the `script-linter` agent on the same slug and range.
   It checks what the dry run can't: phonetic-list spellings, mangled
   syntax, the close line in each video's last chapter only, chapter 0's
   shape, folder IDs against the outline, holds, and brief quotes that must
   match the narration verbatim. Show its findings with the plan. Any
   BLOCKING finding stops generation until the script is fixed or the user
   says to go ahead.

2. **Generate:** `node scripts/generate-audio.mjs <slug> [video|first-last]`.
   Existing MP3s are skipped, so a range picks up where it left off. To
   retake some chapters after a script edit, delete those chapters'
   `narration.mp3` files and run the video once. `--force` with a single
   video number redoes every chapter of that video, chapter 0 included; use
   it only when every chapter changed. Never use `--force` on the whole
   path or a multi-video range: it re-bills every chapter and overwrites
   takes the user already approved.

3. **Transcribe and caption** each newly generated MP3, chapter 0 included:
   `node scripts/transcribe.mjs public/chapters/<folder>/narration.mp3`, then
   `node scripts/captions.mjs public/chapters/<folder>/narration.transcript.json --map courses/<slug>/caption-map.json --script courses/<slug>/scripts/NN-<video-slug>/MM-<chapter-slug>.md`.
   The generate step prints both commands for every file it wrote. Every
   chapter ships with captions (a design rule), and chapter 0's cover the
   intro segment of the assembled video. With `--script`, the cue text
   comes from the script's narration and only the timings come from
   whisper, so whisper's mishearings never reach the captions. The map
   turns phonetic spellings back into real syntax; if it's missing, create
   it from the TTS phonetic list first (the main thread owns it). Read what
   the command prints: a cue above 20 characters per second, or a place
   where the script and the transcript didn't align, gets a fix or a note
   in the report.

4. **Report and stop.** For each file give:
   - its duration (from the transcript JSON or `npx remotion ffmpeg -i
     <file>`), against the chapter's outline length;
   - its measured rate: the narration's word count over speaking seconds
     (the first word's start to the last word's end in the transcript).
     `captions.mjs` prints the file average too. Flag a take above 165 wpm
     or below 120 wpm as a retake candidate;
   - the caption warnings from step 3.

   Then each video's total narration time, and the characters this run
   used. Suggest how to listen (`afplay <file>` on macOS, `Start-Process
   <file>` on Windows, or Remotion Studio for chapters with a composition;
   chapter 0 has none, so play its file). The user listens to every track
   before `/video`. In 2024 to 2026 studies, lower perceived human-likeness
   in a synthetic voice reduced motivation and retention, so a line that
   sounds unnatural is worth a retake under the budget rules above. When
   the user approves the path's first take, record its measured rate in the
   platform profile's **Measured narration rate** line, so later word
   budgets use it.

## After the shot list

When `/video` brings back a video's approved narration changes, edit those
chapter scripts, rerun the `script-linter` on the video, state the
character count, delete only the changed chapters' `narration.mp3` files,
and run steps 2 and 3 for the video once. Report the new durations and
tell `/video` which chapters moved, so it re-resolves their beats from the
same `beats.spec.json`.

If the API returns an error, show the response body; quota and voice-ID
problems are self-explanatory there. The key, voice ID, and model live in
`.env` (see `.env.example`).

Optional: when the phonetic list passes about 20 entries, suggest moving it
into an ElevenLabs pronunciation dictionary with alias rules (they work on
every model; phoneme rules work only on eleven_v3 and flash_v2), passed as
`pronunciation_dictionary_locators`. Scripts could then keep real words. It
needs a change to `generate-audio.mjs`, so it's the user's call.
