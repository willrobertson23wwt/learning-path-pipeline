---
name: audio
description: Generate ElevenLabs narration MP3s for a lab-first path's reviewed micro-video and briefing scripts, then transcribe them for word-level timings and build their captions. Use when the user asks to generate, regenerate, or retake narration or voiceover audio for a path, a lab, or a range of labs, e.g. "/audio linux-filesystem 3". Spends API credits, so run it only on an explicit request, never as an automatic follow-on to /scripts.
argument-hint: <course-slug> [lab | first-last]
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Generate narration for a path's reviewed media specs. `$ARGUMENTS` is the
course slug, optionally followed by a lab number or inclusive range
(`/audio linux-filesystem`, `... 3`, `... 1-4`; `0` is the briefing). Each
video or briefing spec becomes one ElevenLabs request and one
`narration.mp3`; GIF and card specs have no narration and are skipped. Node
commands need the PATH setup in `.claude/house-style.md`.

The model comes from `ELEVENLABS_MODEL_ID` in `.env` (default `eleven_v3`),
with optional `ELEVENLABS_STABILITY` and `ELEVENLABS_SEED`. It must match
the platform profile's **TTS model** line; one model, stability, and seed
(if any) per path, so a retake after a one-word edit sounds like the approved take.
If `.env` and the profile disagree, stop and ask which is right.

## Steps

1. **Dry run and show the plan** (files, character counts, rough durations):
   `node scripts/generate-audio.mjs <slug> [lab|first-last] --dry-run`.
   Flag anything off before any credits are spent: a duration far from the
   spec's `length`, over the per-request character limit (4,900 on
   eleven_v3), or missing `folder:` frontmatter. In parallel, run the `script-linter` agent on the same slug
   and range. It checks what the dry run can't: phonetic-list spellings,
   mangled syntax, where each video sits in its lab, the standalone closing
   line, and brief quotes that must match the narration verbatim. Show its findings with the plan. Any BLOCKING finding
   stops generation until the script is fixed or the user says to go ahead.

2. **Generate:** `node scripts/generate-audio.mjs <slug> [lab|first-last]`.
   Existing MP3s are skipped. To retake one video after a script edit,
   delete its `narration.mp3`; to redo one whole lab, pass its number plus
   `--force`. Don't use `--force` on the whole path or a multi-lab range: it
   re-bills every video and overwrites takes the user already approved.

3. **Transcribe and caption** each newly generated MP3:
   `node scripts/transcribe.mjs public/chapters/<folder>/narration.mp3`, then
   `node scripts/captions.mjs public/chapters/<folder>/narration.transcript.json --map courses/<slug>/caption-map.json --script courses/<slug>/scripts/NN-<lab-slug>/<media-id>.md`.
   Every micro-video and the briefing ships with captions (a design rule).
   With `--script`, the cue text comes from the spec's narration and only
   the timings come from whisper, so whisper's mishearings never reach the
   captions. The map turns phonetic spellings back into real syntax; if
   it's missing, create it from the TTS phonetic list first. Read what the
   command prints: a cue above 20 characters per second, or a place where
   the script and the transcript didn't align, gets a fix or a note in the
   report. A legacy `*-intro` folder needs neither step.

4. **Report and stop.** For each file give:
   - its duration (from the transcript JSON or `npx remotion ffmpeg -i
     <file>`);
   - its measured rate: the narration's word count over speaking seconds
     (the first word's start to the last word's end in the transcript).
     `captions.mjs` prints the file average too. Flag a take above 165 wpm
     or below 120 wpm as a retake candidate;
   - the caption warnings from step 3.

   Suggest how to listen (`afplay <file>` on macOS, `Start-Process <file>`
   on Windows, or Remotion Studio). The user listens to every track before
   `/video`. Retake any line that sounds unnatural (wrong stress, a mangled
   term, a robotic run): in 2024 to 2026 studies, lower perceived
   human-likeness in a synthetic voice reduced motivation and retention. A
   bad take is cheap to redo now and expensive after the beats are timed to
   it. When the user approves the path's first take, record its measured
   rate in the platform profile's **Measured narration rate** line, so later
   word budgets use it.

If the API returns an error, show the response body; quota and voice-ID
problems are self-explanatory there. The key, voice ID, and model live in
`.env` (see `.env.example`).

Optional: when the phonetic list passes about 20 entries, suggest moving it
into an ElevenLabs pronunciation dictionary with alias rules (they work on
every model; phoneme rules work only on eleven_v3 and flash_v2), passed as
`pronunciation_dictionary_locators`. Scripts could then keep real words. It
needs a change to `generate-audio.mjs`, so it's the user's call.
