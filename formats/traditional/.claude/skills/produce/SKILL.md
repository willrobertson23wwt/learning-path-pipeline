---
name: produce
description: One-shot fast path that runs /audio then /video for one named video in a traditional path (narration for every chapter including chapter 0, transcription, captions, the hand-drawn chapter builds, mix, render, catalog description, and article) without the usual listen-first stop. Only when the user explicitly invokes /produce with a video number.
argument-hint: <course-slug> <video>
disable-model-invocation: true
---

Produce one video end to end: narration for every chapter, transcription,
captions, the designed, built, mixed, and rendered chapters, the video's
catalog description, and its companion article. `$ARGUMENTS` is the course
slug and a required video number (`/produce linux-intermediate 6`). Refuse
a bare slug, and refuse a range: name one video per run, because each
video's credits and render time should be checked before the next is
spent. For more videos, run `/produce` again, or run `/audio` and `/video`
with a range.

This is the user's opt-in fast path. It skips one thing: the stop between
`/audio` and `/video` where the user listens to the narration. Everything
else in those two skills still applies, so read both and follow them. In
particular, `/video`'s other stops stay: the review of the video's shot
lists before any build, the music and effects picks (nothing is downloaded
until the user chooses), any Blender go-ahead, and the Studio handoff.

## Gates, before spending anything

- Follow `.claude/house-style.md`, including the repo check.
- The outline is `status: approved` and the video's chapter scripts exist
  in `courses/<slug>/scripts/NN-<video-slug>/` (`00-intro.md` and every
  `MM-<chapter-slug>.md` the outline lists). If scripts are missing, stop
  and point at `/scripts`. This skill produces from reviewed scripts; it
  never writes them.
- Run the audio dry run (`node scripts/generate-audio.mjs <slug> <video>
  --dry-run`) and the `script-linter` agent on the same video at once. If
  anything is off (word counts far out of range, over the character limit,
  a missing `folder:`, or any BLOCKING linter finding), stop and report. A
  bad script wastes both credits and a render.
- Tell the user the video's total character count (the sum of the dry
  run's per-file counts) before generating.

## Run

1. **Audio.** Follow `/audio` for this video: generate the MP3s for chapter
   0 and every chapter (skip existing, never `--force`), transcribe each,
   and build captions with `--script` and `caption-map.json`. Since no one
   listens before the build, measure each take's wpm now (`/audio`'s report
   step) and put any take above 165 or below 120 wpm at the top of the
   report as a retake candidate. Chapter 0 needs its audio only; it gets no
   composition.
2. **Video.** Follow `/video`'s "Per video" steps for this video:
   description then the article in the background, continuity, "Designing
   the video" (with its review stop and its audio policy: any narration
   change the user approves there is regenerated at most once for the
   video, batched, character count stated first), render, caption check,
   loudness check, deliver, collect the article, Course Status.
3. **Report:** each chapter's duration, measured wpm, and deliverable paths
   (`deliverables/<chapter-id>.mp4` and `.vtt`), chapter 0's audio path,
   the video's description (quoted), the article path and word count,
   anything flagged in review, caption warnings and fixes, and each
   chapter's measured loudness. The user reviews the deliverables and
   chapter 0's MP3. For a narration retake they edit the script, delete
   that chapter's MP3, rerun `/audio <slug> <video>`, and re-render.

If audio succeeds but a chapter build fails, say so plainly and finish the
other chapters. The MP3s are kept either way.
