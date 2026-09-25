---
name: produce
description: One-shot fast path that runs /audio then /video for named labs (narration, transcription, captions, media build, render, articles for standalone videos) without the usual listen-first stop. Only when the user explicitly invokes /produce with a lab number or range.
argument-hint: <course-slug> <lab | first-last>
disable-model-invocation: true
---

Produce a lab's media end to end: narration, transcription, captions, the
built and rendered videos, GIFs, and cards, and articles for standalone
videos. `$ARGUMENTS` is the course slug and a required lab number or
inclusive range (`/produce linux-filesystem 3`, `... 1-4`; `0` is the
briefing). Refuse a bare slug; the user must name the labs, because a
whole-path run can burn a lot of credits and render time before anyone
checks it.

This is the user's opt-in fast path. It skips one thing: the stop between
`/audio` and `/video` where the user listens to the narration. Everything
else in those two skills still applies, so read both and follow them.

## Gates, before spending anything

- Follow `.claude/house-style.md`, including the repo check.
- The outline is `status: approved` and each requested lab's media specs
  exist in `courses/<slug>/scripts/NN-*/`. If scripts are missing,
  stop and point at `/scripts`. This skill produces from reviewed scripts; it
  never writes them.
- Run the audio dry run and the `script-linter` agent across all requested
  labs at once. If anything is off (word counts far out of range, over the
  character limit, a missing `folder:`, or any BLOCKING linter finding), stop
  and report. A bad script wastes both credits and a render.

## Run

For a range, run the whole pipeline for one lab before starting the next, in
ascending order, so a failure leaves finished labs behind instead of
half-done ones.

1. `/audio` steps 2-3: generate MP3s (skip existing, never a blanket
   `--force`), transcribe, and build captions with `--script`. Since no one
   listens before the build, measure each take's wpm now (`/audio` step 4)
   and put any take above 165 or below 120 wpm at the top of the report as
   a retake candidate.
2. `/video`'s per-lab steps: articles for standalone videos, continuity and
   scaffold, parallel media builds, stills review, render, caption check,
   deliver, Course Status.
3. **Report per lab:** each item's duration, measured wpm, and deliverable
   paths (a GIF delivers an MP4 and its PNG poster), anything flagged in
   review, and caption warnings and fixes. The user reviews the deliverables.
   For a narration retake they edit the spec, delete that video's MP3, rerun
   `/audio <slug> <lab>`, and re-render.

If audio succeeds but a build fails, say so plainly and finish the other
items. The MP3s are kept either way.
