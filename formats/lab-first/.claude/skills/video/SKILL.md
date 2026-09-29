---
name: video
description: Build, verify, and render every media item for a lab (or a range of labs) in a lab-first path: narrated micro-videos and the briefing as MP4s with captions, silent looping GIFs, and reference-card PNGs, then deliver them into deliverables/ and the lab repo's media folders, write articles for standalone videos, and update Course Status. Use when the user asks to build, animate, render, or make the videos, GIFs, cards, or graphics for a lab, e.g. "/video linux-filesystem 3". Stage 4 of the pipeline; narrated items need transcripts from /audio.
argument-hint: <course-slug> <lab | first-last>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Build the media for one lab or an inclusive range (`/video linux-filesystem
3`, `... 1-4`; `0` is Module 0: the briefing). A card is built with the
lab that first uses it. Each item in the
lab's scripts folder becomes one deliverable:

| Type | Deliverable | Built from |
|---|---|---|
| `video` | `<id>.mp4` (hand-drawn on navy, audio baked in) + `<id>.vtt` captions | narration transcript + visual brief |
| `briefing` | `<id>.mp4` + `<id>.vtt` | same, as a standalone video |
| `gif` | `<id>.mp4` (muted H.264 loop) + `<id>.png` poster of the finished state | the loop spec's beat table |
| `card` | `<id>.png`, static | the card layout |

CLAUDE.md fully specifies how media is built: read its "Per-media workflow",
"Architecture", "Style & motion conventions" (including the per-type rules),
and "Lessons learned" and follow them. Narrated items are hand-drawn with the
sketch toolkit (`.claude/references/sketch-style.md`); GIFs and cards stay
crisp (exact keystrokes and lookup tables read best typeset) on the flat navy
`GROUND` in the WWT palette.

## Who does what

You run this stage and decide what to hand off, by CLAUDE.md "Who does the
work". The defaults for this skill:

| Work | Default | Hand it off when |
|---|---|---|
| Shot list for a narrated item | you, reading `.claude/agents/video-designer.md` for the method and output shape | the user asks for a fresh or second design: `video-designer` |
| Building a narrated item | you, reading `.claude/agents/sketch-builder.md` | the lab has two or more narrated items: one `sketch-builder` each, in parallel |
| GIFs and cards | you, when there are one or two | three or more: one `media-builder` each, in parallel |
| Exact pieces (a plotted curve, a real device in 3D) | `manim-builder`, `blender-builder` (noisy, slow) | always handed off; only when the engine plan needs one |
| Stills review (a gate, below) | whoever didn't build the item | you built it: `stills-reviewer` |
| Music, effects, mix | `sound-engineer` (search output is noisy; it has the Epidemic tools) | always handed off |
| Article for a standalone video | `article-writer`, in the background | a single short article with nothing else running: write it yourself with `/article` |

**Gates.** These hold however the work is split:

- No item renders until its stills have been checked by someone who didn't
  build it, and every BLOCKING and FIX finding is fixed or accepted by you
  as intentional (say so in the report).
- No narrated item is built until the user approves its shot list.
- Nothing is downloaded from Epidemic Sound or Envato, and no Blender asset
  is started, without the user's go-ahead.

**Ownership, when agents run in parallel.** They share one working tree (no
worktrees). Each writes only its own item's files; you own every shared file
(`Root.tsx`, shared components, the outline, CLAUDE.md, `caption-map.json`)
and every final render. If a builder asks for a shared change, make it
yourself and tell the other builders it's there. Once a builder has
reported, its files are yours too.

For a range, finish each lab (build, verify, render, deliver) before
starting the next, in ascending order, and report per lab. If one fails, say
so plainly and carry on with the rest.

## Per lab

1. **Inputs.** The specs in `courses/<slug>/scripts/NN-<lab-slug>/`. For a
   video or the briefing, the narration is what the audio says. The visual
   brief is the script writer's suggestion: use it or set it aside, and
   ignore it entirely when the user asks for a fresh design.
   `public/chapters/<id>/` must hold `narration.mp3`,
   `narration.transcript.json`, and `narration.vtt`. If any is missing,
   stop and run `/audio` first; beats built without real timings drift.
   GIFs and cards need only their spec.
2. **Articles for standalone videos.** For each item with
   `standalone: true`, make sure the outline has its `- **Description:**`
   line (write it from the spec if missing), then start its article (see
   "Who does what"; in the background, so it runs while you build).
   Embedded videos and GIFs get no article.
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

   Typecheck clean, so any builder can render stills without touching
   Root.tsx.
4. **Build the GIFs and cards** (narrated items go through "Designing a
   narrated item" below, which can start at the same time). If you hand
   them off, give each `media-builder` the slug, lab number, media ID, type,
   composition ID, spec path, and continuity note path, all in one message,
   and keep each agent ID.
5. **Review stills** (the gate above). Send the reviewer the stills list,
   composition ID, type, and spec path; reviews of different items run in
   parallel. Fix the findings (yourself, or through the builder that's
   still working), re-render only the affected stills, and send just those
   back to the same reviewer with `SendMessage` until it returns `CLEAN`.
6. **Render.** When every item is clean, run a full `npx tsc --noEmit` (it
   must pass for the whole project now). Render one at a time, since
   parallel renders fight over CPU and finish no sooner:
   - video and briefing: `npx remotion render <Id> out/<id>.mp4` (no overlay
     `.mov` unless asked);
   - GIF: `npx remotion render <Id> out/<id>.mp4 --muted`, then the poster,
     `npx remotion still <Id> out/<id>.png --frame=<N>`, where N is the
     finished state: the loop spec's hold beat start x `FPS`, after
     everything has settled. The lab page embeds the MP4 as an autoplaying,
     muted loop with controls (so it can be paused) and the PNG as its
     poster;
   - card: `npx remotion still <Id> out/<id>.png --frame=0`.
7. **Check captions.** `/audio` built each `public/chapters/<id>/narration.vtt`
   with `--script`, so cue text comes from the spec's narration and only the
   timings from whisper. Rerun `node scripts/captions.mjs <transcript>
   --map courses/<slug>/caption-map.json --script <spec>` if the VTT is
   missing or older than the spec, and read its warnings: a cue above 20
   characters per second, the file's average wpm, and any place the script
   and transcript didn't align (check that cue's timing in the VTT). Any
   phonetic spelling left in a cue means `caption-map.json` is missing an
   entry: add it and rerun. Captions show real syntax, never the
   narration's phonetic forms. Then, for each narrated item, rebuild its
   captions on the composition timeline with `--beats
   public/chapters/<id>/beats.json` added, since every hold moves the cues
   after it; check one cue after the last hold against the render, and
   never hand-edit cue times. List the remaining warnings in the report.
8. **Deliver.** Copy each deliverable to `deliverables/`: `<id>.mp4` and
   `<id>.vtt` for a video, `<id>.mp4` and `<id>.png` for a GIF, `<id>.png`
   for a card. If the outline names this lab's repo (`**Lab repo:**
   <lab-slug>`) and `labs/<lab-slug>/` exists, also copy each file to the
   media path the guide references (`media/module-N/` for the module that
   embeds it; a card goes to the module that first uses it), and list any
   guide reference with no file and any file the guide doesn't reference.
9. **Collect articles.** Confirm each article exists. If an agent wrote it,
   read it yourself against `/unslop` and the house style and fix what you
   find; if you wrote it, run `prose-checker` on it. Put the path, word
   count, and any flagged ambiguities in the report.
10. **Course Status.** Add the lab's media to CLAUDE.md's "Course Status"
    section at the same level of detail as existing entries. Later labs and
    `/closeout` rely on it.

## Designing a narrated item

This replaces steps 4 and 5 for videos and the briefing.

1. **Write the shot list, vision first.** Run `node scripts/beats.mjs
   <transcript> --words` for the timed transcript. Read
   `.claude/agents/video-designer.md` and its reading list, then write
   `out/<id>/design.md` and `out/<id>/beats.spec.json` in the shape it
   gives, from:
   - the timed transcript and the narration;
   - the item's purpose from the outline (media type, which lab step it
     sits at, and what the learner just did and does next);
   - the continuity note;
   - the visual brief, unless the user asked for a fresh design.

   Design the clearest explanation for the learner before thinking about
   how it's drawn; the toolkit's limits come in the next step, not this
   one. Resolve the spec with `beats.mjs --spec` and fix any phrase it
   can't find.
2. **Check it against the toolkit.** Now read `.claude/agents/sketch-builder.md`
   and sketch-style.md, and go through the shot list beat by beat, as its
   feasibility mode describes: measure every string with `layoutText` at
   its cap height and fit the boxes to the real widths, check each hold
   against the voice's own break, check that no beat phrase reuses the
   previous beat's words, and check the palette roles. Where a beat can't
   be drawn as designed, change it to the closest version that keeps its
   intent, and note each change in the shot list's `## Design log` in
   visual terms. If a MANIM element is needed and the toolchain isn't
   installed, ask the user before running `scripts/setup-manim.sh` (about
   2 GB); `manim-builder` in feasibility mode can confirm the element
   first.
3. **Engine plan.** Append `## Engine plan` to the shot list: everything is
   drawn unless listed; list each MANIM, BLENDER or STOCK element with its
   window, its card's box, and why it had to be exact. Give each asset
   request a source:
   - **stock:** search Envato Elements with the shot list's terms
     (`mcp__envato__search_graphics`, `search_stock_video`, `search_3d`,
     `search_photos`, `search_fonts`) and give the user 3-5 candidate links
     per request with a line on how each fits; the connector only searches,
     so the user licenses and downloads on the Envato site;
   - **Blender:** `blender-builder` researches the real object (dimensions,
     photos, CAD), models it to scale, and renders frames. Use it only when
     stock won't serve (a specific real device, an exploded view, a
     true-to-scale assembly), because it's slow; estimate its time;
   - **fallback:** a shapes-and-type version, drawn.
4. **Audio policy.** ElevenLabs usage is limited, so new narration is a last
   resort:
   - Holds and pauses come from splitting the existing audio, never from
     regenerating it.
   - Regenerate only for the shot list's `## Narration changes` that the
     user approves at the review stop.
   - At most once per video, with every change batched into one `/audio`
     run after approval.
   - Before running it, tell the user the character count.
   - Afterwards: re-transcribe, rebuild beats.json from the same
     beats.spec.json, and retime only the beats that moved.
5. **Review stop.** Show the user the shot list (scene table, what changed
   from the brief, the Design log's toolkit changes, open questions), the
   engine plan, any background you propose, and each asset request with
   its source and search terms, so the user can look in the licensed asset
   library (CLAUDE.md "Licensed asset library"). A Blender asset needs the
   user's go-ahead here, with its time estimate. Don't build until the user
   approves. An asset the user finds gets copied into `public/`; one that
   isn't found means the beat uses its fallback.
6. **Build, with the sound plan alongside.** Scaffold the stub and register
   it in Root.tsx (inline `defaultProps` literal). In one message, start
   what runs in parallel: `sound-engineer` in plan mode (step 8), any
   `manim-builder` and one `blender-builder` per approved exact element,
   and, if you're handing off the build, one `sketch-builder` per narrated
   item. Then build (or, with builders running, watch for their reports).
   Blender research comes first: show the user the reference sheet
   (dimensions and sources) if the object must be exact, and ask before any
   reference photos or CAD files are downloaded. A Manim layer starts as a
   frames folder; while it's missing, the drawing renders its stills with
   the layer hidden. If building shows a hold needs to change (a hold adds
   to the voice's own break), re-resolve beats.json and tell the user if an
   approved number moved.
7. **Review** (the stills gate). Render composite stills with
   `scripts/stills.mjs` (every beat mid-draw and settled, each scene's
   fullest frame, the reveal, every wipe, first and last frames) and look
   at a contact sheet yourself first. Then send them to the reviewer; if
   you built it, that's `stills-reviewer`, which also reads sketch-style.md
   "Checks". Fix, re-render the affected stills, and repeat until CLEAN. A
   finding that would change the design itself goes to the user if it
   touches something they approved.
8. **Sound.** `sound-engineer` in plan mode gets every chapter of the video
   (shot lists, beats.json, transcripts) and the video's mix sheet if one
   exists (`courses/<slug>/sound/<video-id>.md`). When it reports, show the
   user its music candidates, its effect cues, and its download list (file
   name, Epidemic ID, size), and download nothing until they pick. Then
   send it the picks with `SendMessage` for build mode. Mount `<MixTrack>`
   from `public/chapters/<id>/mix.json`, point the narration Sequences at
   the mastered `.voice.wav`, render the stems it asks for from the
   toggles, and send them back for measurement. Fix every level that fails
   the cheat sheet in `.claude/references/sound-design.md` before the
   handoff. Licensed audio in `public/audio/` stays out of git; the mix
   sheet records each file's Epidemic ID so it can be downloaded again.
9. **Studio handoff.** Start Studio. Tell the user which controls are in
   the props panel (the audio toggles, and anything you exposed), and, if
   the video has a Manim layer, which are in `manim/<id>/layout.json` and
   how `scripts/manim-watch.sh` re-renders it on save. Wait for their
   changes. They hear the full mix in Studio, so ask them to listen for the
   bed under speech and each effect. For anything they'd rather point at
   than describe, offer the review editor (CLAUDE.md "Review editor"):
   they mark the frame, press Send, and you run `/revise <id>`. Repeat
   until they have nothing left open.
10. **Final.** If the video has Manim layers, encode them
    (`manim-render.sh` without `--frames`) and switch each `ManimLayer` to
    its `.webm`. Then continue with step 6 (Render) above. Before
    delivering, measure the rendered MP4 yourself (two-pass `loudnorm` JSON
    on the decoded file, sound-design.md: -16 ±0.5 LUFS, true peak -1.0
    dBTP or lower), apply any gain it needs, and record the reading in the
    mix sheet.
