---
name: produce
description: One-shot audio + video — generate narration and build/render the chapters for one video (or a numbered range) without stopping between stages
---

Produce videos end to end: ElevenLabs narration, transcription, Remotion
chapters, rendered MP4s. `$ARGUMENTS` is the course slug and a REQUIRED video
number or inclusive range (e.g. `/produce powershell-fundamentals 3` or
`/produce powershell-fundamentals 21-24`). Refuse a whole-course run (a bare slug
with no numbers); the user must name the videos explicitly.

For a range, produce the videos one at a time in ascending order — run the
full pipeline (audio → chapters → render → deliverables) for one video before
starting the next, so a failure partway leaves finished videos behind, not
half-done ones. Report the review checklist per video as each completes.

This is the user's opt-in fast path: it deliberately skips the usual
listen-to-the-audio stop between `/audio` and `/video`. Everything else about
those two skills still applies — read both and follow them.

**Guard:** never run in the template repo (`remotion-training-graphics` in
package.json). And the input gate stays: the outline must be
`status: approved` and the video's chapter scripts must already exist in
`courses/<slug>/scripts/NN-*/`. If scripts are missing, stop and point at
`/scripts` — this skill produces from reviewed scripts; it never writes them.

## Steps

1. Sanity gate (cheap, before spending API credits): run the audio dry-run
   (`node scripts/generate-audio.mjs <slug> <video|first-last> --dry-run`, nvm
   PATH per CLAUDE.md) covering ALL requested videos up front. If anything is
   off (word counts far out of range, over the model's char limit, missing
   `folder:`), STOP and report instead of pushing through — a bad script
   wastes both credits and a render.
2. Follow the `/audio` skill: generate the video's narration MP3s (skip
   existing; never blanket `--force`), then transcribe each non-intro chapter.
3. Follow the `/video` skill for each chapter (skip `00-intro`): beat table
   from the transcript, build per the visual brief, register in `src/Root.tsx`,
   typecheck, verify per-beat stills (especially multi-element moments).
4. Render each chapter's deliverable MP4 and copy to `deliverables/` per
   CLAUDE.md. Then write the video's companion article per the `/article`
   skill (a self-contained written alternative to watching the video).
5. Report a review checklist: each chapter's duration, file path, and anything
   flagged during stills verification — plus the video's short description
   (learner-facing, under 30 words, from the `- **Description:**` line under
   the video's heading in the outline; write and add it there if missing —
   see `/video`). The user reviews the finished MP4s and
   the intro MP3; if a narration line needs a retake, they edit the script and
   rerun `/audio <slug> <video>` for that chapter (delete its MP3 first), then
   re-render.

If audio succeeds but a chapter build fails, say so plainly and finish the
other chapters — the generated MP3s are kept either way.
