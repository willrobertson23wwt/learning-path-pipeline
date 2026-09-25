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
and "Lessons learned" and follow them. This skill wires the pipeline's inputs
into that workflow and splits the work across agents:

- `article-writer` writes the article for any standalone video, in the
  background.
- For narrated items (videos and the briefing), a design team, run through
  "Designing a narrated item" below:
  - `video-designer` sets the artistic and instructional vision, and knows
    nothing about tools;
  - `sketch-builder` draws the video by hand (marker lettering, doodles,
    the course's navy ground) and builds the whole composition around it
    (`.claude/references/sketch-style.md`);
  - on demand only, for what must be exact: `manim-builder` (a plotted
    curve, a true-to-scale diagram) and `blender-builder` (a real device in
    3D), each shown as a card in the drawing.
- `media-builder` builds each GIF and card, one agent per item, in
  parallel. GIFs and cards stay crisp (exact keystrokes and lookup tables
  read best typeset) on the flat navy `GROUND` in the WWT palette.
- `stills-reviewer` checks each item's stills before it renders.

The agents share one working tree (no worktrees). What keeps
that safe is ownership: each builder writes only its own item's files, and
you (the main thread) own every shared file (`Root.tsx`, shared components,
the outline, CLAUDE.md, `caption-map.json`) and every final render.

For a range, finish each lab (build, verify, render, deliver) before
starting the next, in ascending order, and report per lab. If one fails, say
so plainly and carry on with the rest.

## Per lab

1. **Inputs.** The specs in `courses/<slug>/scripts/NN-<lab-slug>/`. For a
   video or the briefing, the narration is what the audio says. The visual
   brief is the script writer's suggestion: the designer may use it or set
   it aside, and gets no visual brief at all when the user asks for a fresh
   design. and `public/chapters/<id>/` must hold
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

## Designing a narrated item

This replaces steps 4 and 5 for videos and the briefing. The designer owns
the vision, the builders own feasibility, and you mediate between them.
Their written exchange goes in the shot list's `## Design log`.

1. **Brief the designer.** Run `node scripts/beats.mjs <transcript> --words`
   and give `video-designer` its inputs:
   - the timed transcript;
   - the narration;
   - the item's purpose from the outline (media type, which lab step it
     sits at, and what the learner just did and does next);
   - the continuity note;
   - the visual brief, unless the user asked for a fresh design.

   The designer gets no tool names, no code, and no earlier build.
   It writes `out/<id>/design.md` and `out/<id>/beats.spec.json`. Resolve
   the spec with `beats.mjs --spec` and send any problems back to it.
2. **Feasibility.** Send the shot list to `sketch-builder`. It marks every
   beat DRAW, ADAPT, MANIM, BLENDER, STOCK, or CAN'T, measures every string
   at the designer's cap height, and checks the holds against the voice's
   own breaks. Send any MANIM elements to `manim-builder` for its own
   answer. Only then ask the user about the Manim toolchain if it isn't
   installed (`scripts/setup-manim.sh`, about 2 GB).
3. **Mediate.** Settle anything purely technical with the builders
   yourself: engine assignment, a shape shifted to fit its lettering, split
   points. Take every ADAPT and
   CAN'T back to the designer in visual terms only:
   - what the viewer would see instead;
   - two or three alternatives;
   - never an API or tool name.

   The designer decides whether each alternative keeps its intent, or
   redesigns the beat. Two rounds at most. Anything still unresolved goes
   to the user, with both positions stated fairly.
4. **Engine plan.** Append `## Engine plan` to the shot list: everything is
   drawn unless listed; list each MANIM, BLENDER or STOCK element with its
   window, its card's box, and why it had to be exact. The
   designer never reads this section. Give each asset request a source,
   with the builders' input:
   - **stock:** search Envato Elements with the designer's terms
     (`mcp__envato__search_graphics`, `search_stock_video`, `search_3d`,
     `search_photos`, `search_fonts`) and give the user 3-5 candidate links
     per request with a line on how each fits; the connector only searches,
     so the user licenses and downloads on the Envato site;
   - **Blender:** `blender-builder` researches the real object (dimensions,
     photos, CAD), models it to scale, and renders frames. Use it only when
     stock won't serve (a specific real device, an exploded view, a
     true-to-scale assembly), because it's slow; estimate its time;
   - **fallback:** the designer's shapes-and-type version.
5. **Audio policy.** ElevenLabs usage is limited, so new narration is a last
   resort:
   - Holds and pauses come from splitting the existing audio, never from
     regenerating it.
   - Regenerate only for the shot list's `## Narration changes` that the
     user approves at the review stop.
   - At most once per video, with every change batched into one `/audio`
     run after approval.
   - Before running it, tell the user the character count.
   - Afterwards: re-transcribe, rebuild beats.json from the same
     beats.spec.json, and send the designer only the beats that moved.
6. **Review stop.** Show the user the shot list (scene table, what changed
   from the brief, open questions), the engine plan, any background the
   designer proposes, and each asset request with its source and search
   terms, so the user can look in the licensed asset library (CLAUDE.md
   "Licensed asset library"). A Blender asset needs the user's go-ahead
   here, with its time estimate. Don't build until the user approves. An asset the user finds
   gets copied into `public/` for the builders; one that isn't found means
   the beat uses its fallback.
7. **Build.** Scaffold the stub and register it in Root.tsx (inline
   `defaultProps` literal). Launch `sketch-builder`, plus `manim-builder`
   and one `blender-builder` per approved exact element, in one message.
   Blender research comes first: show the user the reference sheet
   (dimensions and sources) if the object must be exact, and ask before any
   reference photos or CAD files are downloaded. A Manim layer starts as a
   frames folder; while it's missing, the drawing renders its stills with
   the layer hidden. Before the build starts, re-resolve beats.json with
   any hold the builder corrected (a hold adds to the voice's own break)
   and tell the user if an approved number changed.
8. **Review.** Render composite stills with `scripts/stills.mjs` and send
   them to `stills-reviewer` (it also reads sketch-style.md "Checks").
   Route each finding to the builder that owns it. Any finding that changes the design itself goes back to the designer
   first. Repeat until CLEAN.
9. **Sound.** Launch `sound-engineer` in plan mode with every chapter of
   the video (shot lists, beats.json, transcripts) and the video's mix sheet
   if one exists (`courses/<slug>/sound/<video-id>.md`). Show the user its
   music candidates, its effect cues, and its download list (file name,
   Epidemic ID, size), and download nothing until they pick. Then run it in
   build mode with the picks. Mount `<MixTrack>` from
   `public/chapters/<id>/mix.json`, point the narration Sequences at the
   mastered `.voice.wav`, render the stems it asks for from the toggles,
   and send them back for measurement. Fix every level that fails the
   cheat sheet in `.claude/references/sound-design.md` before the handoff.
   Licensed audio in `public/audio/` stays out of git; the mix sheet
   records each file's Epidemic ID so it can be downloaded again.
10. **Studio handoff.** Start Studio. Tell the user which controls are in
   the props panel (the audio toggles, and anything the builder exposed),
   and, if the video has a Manim layer, which are in
   `manim/<id>/layout.json` and how `scripts/manim-watch.sh` re-renders it
   on save. Wait for their changes. They hear the full mix in Studio, so ask them to listen
   for the bed under speech and each effect.
11. **Final.** If the video has Manim layers, encode them
   (`manim-render.sh` without `--frames`) and switch each `ManimLayer` to its
   `.webm`. Then continue with step 6 (Render) above. Before delivering, send the rendered MP4 to
   `sound-engineer` for the final loudness check (-16 ±0.5 LUFS, true peak
   -1.0 dBTP or lower, decoded), and apply any gain it gives you.
