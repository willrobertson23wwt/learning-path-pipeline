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

## Steps

1. **Dry run and show the plan** (files, character counts, rough durations):
   `node scripts/generate-audio.mjs <slug> [lab|first-last] --dry-run`.
   Flag anything off before any credits are spent: a duration far from the
   spec's `length`, over the per-request character limit, or missing
   `folder:` frontmatter. In parallel, run the `script-linter` agent on the same slug
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
   `node scripts/captions.mjs public/chapters/<folder>/narration.transcript.json --map courses/<slug>/caption-map.json`.
   Every micro-video and the briefing ships with captions (a design rule).
   The map turns phonetic spellings back into real syntax; if it's missing,
   create it from the TTS phonetic list first. A legacy `*-intro` folder
   needs neither step.

4. **Report and stop.** Give each file's duration (from the transcript JSON
   or `npx remotion ffmpeg -i <file>`) and suggest how to listen (`afplay
   <file>` on macOS, `Start-Process <file>` on Windows, or Remotion Studio).
   The user listens to every track before `/video`, and `/video` reads each
   caption file against its script before delivering it. A bad take is cheap to
   redo now and expensive after the beats are timed to it.

If the API returns an error, show the response body; quota and voice-ID
problems are self-explanatory there. The key and voice ID live in `.env`
(see `.env.example`).
