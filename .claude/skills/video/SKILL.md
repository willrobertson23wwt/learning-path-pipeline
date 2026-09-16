---
name: video
description: Build the Remotion motion-graphics chapters for a video (or a numbered range of videos) whose audio is generated and approved
---

Build the motion-graphics chapters for one video or an inclusive range of
videos. `$ARGUMENTS` is the course slug and a video number or range (e.g.
`/video powershell-fundamentals 3` or `/video powershell-fundamentals 21-24`).
A video is 2-4 chapters; each chapter has its own narration MP3 and becomes
one rendered .mp4 (dark background + audio), which the user cuts between
screencast segments in Premiere.

For a range, process the videos one at a time in ascending order — fully
finish one video (build, verify, render, deliver) before starting the next,
and report per video as you go. If one video fails, say so plainly and
continue with the rest.

This stage is fully specified by CLAUDE.md — read it and follow the per-chapter
workflow and the style & motion conventions exactly. This skill only wires the
pipeline inputs into that workflow:

1. **Narration scripts + visual briefs:** `courses/<slug>/scripts/NN-<video>/MM-*.md`,
   one file per chapter. The visual brief section is the design spec; the
   narration text is what the audio says. **Skip `00-intro.md`** — the user's
   custom intro footage covers that segment; it gets no composition.
2. **Audio + word timings:** `public/chapters/<folder>/narration.mp3` and
   `narration.transcript.json` (folder from each script's frontmatter). If a
   transcript is missing, run `/audio` first — do not proceed without timings.
3. For each chapter: map narration cues from the transcript to a beat table,
   build it using the bespoke schema-driven pattern (see `src/ExampleCh1.tsx` +
   `src/components/example-ch1/` for the worked example), register composition IDs `<Prefix>V<N>Ch<M>` /
   `<Prefix>V<N>Ch<M>-Overlay` in `src/Root.tsx` (prefix from the outline
   frontmatter, PascalCased).
4. Keep visual continuity across the video's chapters (shared palette, reused
   motifs, consistent panel styling) — they play as one lesson with screencast
   footage between them.
5. Typecheck, verify per-beat stills (especially moments with multiple elements
   on screen — overlap is a recurring bug), render every chapter's .mp4 (no
   overlay .mov unless the user asks), copy deliverables out per CLAUDE.md.
6. Include the video's short description in the delivery report: a
   learner-facing, under-30-word summary of what the video teaches (for the
   course platform's catalog). It lives on a `- **Description:**` line
   directly under the video's `### N. Title` heading in
   `courses/<slug>/outline.md` — if the outline doesn't have one yet, write
   it and add it there, then quote it in the report.
7. Write the video's companion article per the `/article` skill — every
   video ships with a written alternative so the student can read the
   lesson instead of watching it.
8. Update CLAUDE.md's course status section with a summary of the new video,
   matching the detail level of the existing entries.
