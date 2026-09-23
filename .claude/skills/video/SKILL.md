---
name: video
description: Build, verify, and render every media item for a lab (or a range of labs) in a lab-first path: narrated micro-videos and the briefing as MP4s with captions, silent looping GIFs, and reference-card PNGs, then deliver them into deliverables/ and the lab repo's media folders, write articles for standalone videos, and update Course Status. Use when the user asks to build, animate, render, or make the videos, GIFs, cards, or graphics for a lab, e.g. "/video linux-filesystem 3". Stage 4 of the pipeline; narrated items need transcripts from /audio.
argument-hint: <course-slug> <lab | first-last>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Build the media for one lab or an inclusive range (`/video linux-filesystem
3`, `... 1-4`; `0` is Module 0: the briefing and its cards). Each item in the
lab's scripts folder becomes one deliverable:

| Type | Deliverable | Built from |
|---|---|---|
| `video` | `<id>.mp4` (dark background, audio baked in) + `<id>.vtt` captions | narration transcript + visual brief |
| `briefing` | `<id>.mp4` + `<id>.vtt` | same, as a standalone video |
| `gif` | `<id>.gif`, silent, loops | the loop spec's beat table |
| `card` | `<id>.png`, static | the card layout |

CLAUDE.md fully specifies how media is built: read its "Per-media workflow",
"Architecture", "Style & motion conventions" (including the per-type rules),
and "Lessons learned" and follow them. This skill wires the pipeline's inputs
into that workflow and splits the work across agents:

- `article-writer` writes the article for any standalone video, in the
  background.
- `media-builder` builds each item, one agent per item, in parallel.
- `stills-reviewer` checks each item's stills before it renders.

The folder isn't a git repo, so the agents share one working tree. What keeps
that safe is ownership: each builder writes only its own item's files, and
you (the main thread) own every shared file (`Root.tsx`, shared components,
the outline, CLAUDE.md, `caption-map.json`) and every final render.

For a range, finish each lab (build, verify, render, deliver) before
starting the next, in ascending order, and report per lab. If one fails, say
so plainly and carry on with the rest.

## Per lab

1. **Inputs.** The specs in `courses/<slug>/scripts/NN-<lab-slug>/`. For a
   video or the briefing: the visual brief is the design spec, the narration
   is what the audio says, and `public/chapters/<id>/` must hold
   `narration.mp3`, `narration.transcript.json`, and `narration.vtt`. If any
   is missing, stop and run `/audio` first; beats built without real timings
   drift. GIFs and cards need only their spec.
2. **Articles for standalone videos.** For each item with
   `standalone: true`, make sure the outline has its `- **Description:**`
   line (write it from the spec if missing), then launch one
   `article-writer` agent per standalone item in the background (slug and
   media ID). Embedded videos and GIFs get no article.
3. **Plan continuity and scaffold.** Read every spec in the lab together
   and write `out/<prefix>-lN-continuity.md`: the terminal styling, prompt,
   and motifs the lab's items share (and those earlier labs already used),
   and any shared component they need. Build shared components now. Then
   create a stub per item (`src/<CompositionId>.tsx` exporting a component
   that renders nothing plus its `<name>Schema` and `<name>Defaults`) and
   register it in `src/Root.tsx` with the IDs from the outline's "Media IDs"
   table:
   - video and briefing: `<CompositionId>` and `<CompositionId>-Overlay`,
     duration from `audioMetadata(audio, END_BUFFER_SECONDS)`;
   - GIF: `<CompositionId>` only, 1280x720, `durationInFrames` = the spec's
     `length` x `FPS`, no audio;
   - card: `<CompositionId>` only, 1920x1080, `durationInFrames={1}`.

   Typecheck clean. Builders can then render stills without touching
   Root.tsx.
4. **Build in parallel.** Launch one `media-builder` per item, all in one
   message, each with: slug, lab number, media ID, type, composition ID,
   spec path, and continuity note path. Keep each builder's agent ID. If a
   builder asks for a shared change, make it yourself and tell the other
   builders it's there.
5. **Review stills.** As each builder reports, send its stills list,
   composition ID, type, and spec path to a `stills-reviewer` (reviews run in
   parallel). Send the findings back to that builder with `SendMessage` and
   repeat until the reviewer returns `CLEAN`. If you accept a finding as
   intentional, say so in the report.
6. **Render.** When every item is clean, run a full `npx tsc --noEmit` (it
   must pass for the whole project now). Render one at a time, since
   parallel renders fight over CPU and finish no sooner:
   - video and briefing: `npx remotion render <Id> out/<id>.mp4` (no overlay
     `.mov` unless asked);
   - GIF: `npx remotion render <Id> out/<id>.gif --codec=gif
     --every-nth-frame=2` (15 fps, loops forever). Over about 5 MB, also
     render a silent loop, `npx remotion render <Id> out/<id>-loop.mp4
     --muted`, and tell the user which one the lab page should embed;
   - card: `npx remotion still <Id> out/<id>.png --frame=0`.
7. **Check captions.** Read each `public/chapters/<id>/narration.vtt`
   against the spec's narration. Whisper mishears technical words, and any
   phonetic spelling left in a cue means `caption-map.json` is missing an
   entry: add it and rerun `node scripts/captions.mjs` for that item. Fix
   one-off mishearings in the VTT itself. Captions show real syntax, never
   the narration's phonetic forms.
8. **Deliver.** Copy each deliverable to `deliverables/` as `<id>.mp4`,
   `<id>.vtt`, `<id>.gif`, or `<id>.png`. If the outline names this lab's
   repo (`**Lab repo:** <lab-slug>`) and `labs/<lab-slug>/` exists, also copy
   each file to the media path the guide references, and list any guide
   reference with no file and any file the guide doesn't reference.
9. **Collect articles.** Wait for each `article-writer`, confirm the file
   exists, run `prose-checker` on it, and send any FIX findings back to the
   writer with `SendMessage`. Put the path, word count, and any flagged
   ambiguities in the report. If a writer failed, write the article yourself
   with `/article`.
10. **Course Status.** Add the lab's media to CLAUDE.md's "Course Status"
    section at the same level of detail as existing entries. Later labs and
    `/closeout` rely on it.

A lab with a single item can be built in the main thread instead of by a
builder; its stills still go to `stills-reviewer`.
