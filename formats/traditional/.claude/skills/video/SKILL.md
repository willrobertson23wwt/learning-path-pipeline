---
name: video
description: Build, verify, and render every chapter of a video (or a numbered range of videos) in a traditional path, in the course's hand-drawn style: design every chapter in one pass, draw each as its own composition, mix a music track per chapter, render one MP4 plus captions per chapter into deliverables/, write the video's catalog description and companion article, and update Course Status. Use when the user asks to build, animate, render, or make the chapters or graphics for a video, e.g. "/video linux-intermediate 6" or "/video linux-intermediate 6-8". Stage 4 of the pipeline; needs transcripts from /audio.
argument-hint: <course-slug> <video | first-last>
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Build the chapters for one video or an inclusive range of videos (`/video
linux-intermediate 6`, `... 6-8`). A video is 2-4 chapters. Each chapter
becomes one deliverable pair (chapter 0 is narration only):

| Chapter | Deliverable | Built from |
|---|---|---|
| `<prefix>-vN-chM` | `<chapter-id>.mp4` (hand-drawn on navy, audio and music baked in) + `<chapter-id>.vtt` captions | narration transcript + the approved shot list |
| `<prefix>-vN-intro` (chapter 0) | `<prefix>-vN-intro.mp3` + `.vtt`: narration only, no composition | its `narration.mp3` and captions from `/audio`, which the user lays over custom intro footage |

The user cuts each chapter's MP4 between screencast segments in Premiere and
crossfades the chapters' music there, so every chapter is a standalone
composition: it opens on its own title card and ends on its own tail.

CLAUDE.md fully specifies how a chapter is built: read its "Per-chapter
workflow", "Architecture", "Style & motion conventions", and "Lessons
learned", plus `.claude/references/sketch-style.md`, and follow them.

## Who does what

You run this stage and decide what to hand off, by CLAUDE.md "Who does the
work". The defaults for this skill:

| Work | Default | Hand it off when |
|---|---|---|
| Shot lists, every chapter in one pass | you, reading `.claude/agents/video-designer.md` for the method and output shape, so motifs carry from chapter to chapter | the user asks for a fresh or second design: `video-designer` |
| Building the chapters | one `sketch-builder` per chapter, in parallel (a video has 2-4) | a one-chapter video (the path intro or review): build it yourself, reading `.claude/agents/sketch-builder.md` |
| Exact pieces (a plotted curve, a real device in 3D) | `manim-builder`, `blender-builder` (noisy, slow) | always handed off; only when the engine plan needs one |
| Stills review (a gate, below) | whoever didn't build the chapter: you, when builders did | you built it: `stills-reviewer` |
| Music, effects, mix, across all chapters | `sound-engineer` (search output is noisy; it has the Epidemic tools) | always handed off |
| The companion article | `article-writer`, in the background | the writer fails: write it yourself with `/article` |

**Gates.** These hold however the work is split:

- No chapter renders until its stills have been checked by someone who
  didn't build it, and every BLOCKING and FIX finding is fixed or accepted
  by you as intentional (say so in the report).
- No chapter is built until the user approves the video's shot lists.
- Nothing is downloaded from Epidemic Sound or Envato, and no Blender asset
  is started, without the user's go-ahead.

**Ownership, when agents run in parallel.** They share one working tree (no
worktrees). Each builder writes only its own chapter's files; you own every
shared file (`Root.tsx`, shared components, the outline, CLAUDE.md,
`caption-map.json`) and every final render. If a builder asks for a shared
change (a doodle to promote into `lp-toolkit/sketch`), make it yourself
in a linked toolkit checkout (`lp-toolkit`'s README) and tell the other
builders it's there. Once a builder has
reported, its files are yours too.

For a range, finish each video (design, build, verify, render, deliver)
before starting the next, in ascending order, and report per video. If one
fails, say so plainly and carry on with the rest.

## Per video

1. **Inputs.** The chapter scripts in
   `courses/<slug>/scripts/NN-<video-slug>/`: `00-intro.md` (chapter 0)
   and `MM-<chapter-slug>.md` for each chapter, each with `folder:` (the
   chapter ID) in its frontmatter. The narration is what the audio says.
   The `## Visual brief` and the outline's **Visual moments** are the script
   writer's suggestions: use them or set them aside, and ignore both when
   the user asks for a fresh design. For every chapter
   except chapter 0, `public/chapters/<chapter-id>/` must hold
   `narration.mp3`, `narration.transcript.json`, and `narration.vtt`. If
   any is missing, stop and run `/audio` first; beats built without real
   timings drift. Check that chapter 0's `narration.mp3` exists too, and
   name its path in the report; skip everything else for it.
2. **Description, then the article.** The video's catalog description lives
   on a `- **Description:**` line directly under its `### N. Title` heading
   in `courses/<slug>/outline.md`: learner-facing, under 30 words, saying
   what the video teaches. If it's missing, write it from the chapter
   scripts, run the unslop pass on it, add it to the outline, and quote it
   in the report. Then start the article in the background (see "Who does
   what"), with the slug and video number. It writes
   `courses/<slug>/articles/NN-<video-slug>.md` and stops if the
   description is missing, which is why the line comes first.
3. **Plan continuity.** Read every chapter script in the video together,
   the outline's entries for this video and its neighbors, and the Course
   Status entries and continuity notes of earlier videos in the module. Write
   `out/<prefix>-vN-continuity.md`: the running example, the terminal or
   console styling and prompt (from the platform profile), the motifs and
   color meanings earlier videos already used, and what the chapters of this
   video share. Build any shared component the note calls for now.
4. **Design and build.** Run "Designing the video" below.
5. **Render.** When every chapter is clean and the user has finished in
   Studio, run a full `npx tsc --noEmit` (it must pass for the whole project
   now). Render one chapter at a time, since parallel renders fight over CPU
   and finish no sooner: `npx remotion render <Prefix>V<N>Ch<M>
   out/<chapter-id>.mp4`. No overlay `.mov` unless the user asks.
6. **Check captions.** `/audio` built each chapter's `narration.vtt` with
   `--script`, so cue text comes from the script's narration and only the
   timings from whisper. Rerun `npx lp-captions
   public/chapters/<chapter-id>/narration.transcript.json --map
   courses/<slug>/caption-map.json --script
   courses/<slug>/scripts/NN-<video-slug>/MM-<chapter-slug>.md` if the VTT
   is missing or older than the script or the transcript, and read its
   warnings: a cue above 20 characters per second, the file's average wpm,
   and any place the script and transcript didn't align (check that cue's
   timing in the VTT). Any phonetic spelling left in a cue means
   `caption-map.json` is missing an entry: add it and rerun. Captions show
   real syntax, never the narration's phonetic forms. Then rebuild each
   chapter's captions on its composition timeline, since every hold moves
   the cues after it: the same command with `--beats
   public/chapters/<chapter-id>/beats.json`. Check one cue after the last
   hold against the render; never hand-edit cue times. Chapter 0 has no
   holds, so its `/audio` captions stand.
7. **Check loudness.** Measure each rendered chapter MP4 yourself (two-pass
   `loudnorm` JSON on the decoded file, `.claude/references/sound-design.md`:
   -16 ±0.5 LUFS integrated, true peak -1.0 dBTP or lower). Apply any gain it
   needs, re-render that chapter, and record each reading in the mix sheet.
8. **Deliver.** Copy each chapter's `<chapter-id>.mp4` and `<chapter-id>.vtt`
   to `deliverables/`, and chapter 0's `narration.mp3` and `narration.vtt`
   as `<prefix>-vN-intro.mp3` and `<prefix>-vN-intro.vtt`.
9. **Collect the article.** Confirm the file exists. If an agent wrote it,
   read it yourself against `/unslop` and the house style and fix what you
   find; if you wrote it (`/article <slug> <video>`, because the writer
   failed), run `prose-checker` on it. Put the path, word count, and any
   flagged ambiguities in the report.
10. **Course Status.** Add the video to CLAUDE.md's "Course Status" section
    at the same level of detail as existing entries (or, for the first
    video, one line per chapter: title, duration, composition file, the
    motif and the reveal, then gotchas found in stills, captions, or on
    listen-through). Later videos and `/closeout` rely on it.
11. **Report** for the video: each chapter's duration and deliverable
    paths, chapter 0's audio path, the description (quoted), the article
    path and word count, findings accepted as intentional in review,
    caption warnings and fixes, each chapter's measured loudness, and the
    music track and Epidemic ID per chapter.

## Designing the video

The whole video goes through each step together, so the user reviews it
once.

1. **Write the shot lists, vision first.** For each chapter, run `npx
   lp-beats public/chapters/<chapter-id>/narration.transcript.json
   --words`. Read `.claude/agents/video-designer.md` and its reading list
   (where it says "Lab-first design", read `.claude/house-style.md`
   "Traditional course design"), then write one shot list per chapter,
   `out/<chapter-id>/design.md` and `out/<chapter-id>/beats.spec.json`, from:
   - every chapter's timed transcript and narration, in order;
   - the video's goal and each chapter's key points from the outline, and
     where the chapter sits: chapter 1 follows the intro footage, and each
     later chapter follows a screencast segment the user records, so every
     chapter opens on its own title card;
   - the title card text for each chapter: "<Chapter title>" with
     "Chapter M · <Video title>" beneath it, over the title light (titles
     from the scripts' frontmatter and the outline);
   - how each chapter ends: the ground-only tail (about 2 s, one sheet wipe
     leaving the navy ground), except the video's last chapter, whose
     narration ends with the close line and whose drawing hands over to the
     thank-you card;
   - the continuity note;
   - each chapter's visual brief and the outline's visual moments, unless
     the user asked for a fresh design.

   Write every chapter in one pass so anchors, motifs, and color meanings
   carry across chapters, with a short `## Across the video` section at the
   top of the first chapter's shot list naming what carries. Holds are
   sized to what moves: about 0.2 s added to the voice's own break over a
   still frame, and a key animation's run time plus about 1 s of silence,
   counting the voice's own break. Design the clearest explanation for the
   learner before thinking about how it's drawn; the toolkit's limits come
   in the next step, not this one. Resolve each spec with `npx
   lp-beats <transcript> --spec out/<chapter-id>/beats.spec.json
   --out public/chapters/<chapter-id>/beats.json` and fix any phrase it
   can't find.
2. **Check them against the toolkit.** Now read
   `.claude/agents/sketch-builder.md` and sketch-style.md, and go through
   every shot list beat by beat, as its feasibility mode describes: measure
   every string with `layoutText` at its cap height and fit the boxes to
   the real widths, check each hold against the voice's own break, check
   that no beat phrase reuses the previous beat's words, and check the
   palette roles. Where a beat can't be drawn as designed, change it to the
   closest version that keeps its intent (a change to a shared motif is
   made in every chapter that uses it), and note each change in that shot
   list's `## Design log` in visual terms. If a MANIM element is needed and
   the toolchain isn't installed, ask the user before running
   `scripts/setup-manim.sh` (about 2 GB); `manim-builder` in feasibility
   mode can confirm the element first.
3. **Engine plan.** Append `## Engine plan` to each chapter's shot list:
   everything is drawn unless listed; list each MANIM, BLENDER or STOCK
   element with its window, its card's box, and why it had to be exact.
   Give each asset request a source:
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
   - Regenerate only for the shot lists' `## Narration changes` that the
     user approves at the review stop.
   - At most once per video, with every change in every chapter batched
     into one `/audio <slug> <video>` run after approval (delete only the
     changed chapters' MP3s first; never `--force`).
   - Before running it, tell the user the character count.
   - Afterwards: re-transcribe, rebuild captions, rebuild each changed
     chapter's beats.json from the same beats.spec.json, and retime only
     the beats that moved.
5. **Review stop.** Show the user every chapter's shot list together: per
   chapter, the scene table, what changed from the visual brief, the Design
   log's toolkit changes, and open questions; the `## Across the video`
   motifs; each engine plan; any background you propose; all narration changes with their
   combined character count; and each asset request with its source and
   search terms, so the user can look in the licensed asset library
   (CLAUDE.md "Licensed asset library"). A Blender asset needs the user's
   go-ahead here, with its time estimate. Don't build until the user
   approves. An asset the user finds gets copied into `public/` for the
   builders; one that isn't found means the beat uses its fallback.
6. **Build.** For each chapter, scaffold a stub (`src/<Prefix>V<N>Ch<M>.tsx`
   exporting a component that renders nothing plus its schema and defaults)
   and register `<Prefix>V<N>Ch<M>` and `<Prefix>V<N>Ch<M>-Overlay` in
   `src/Root.tsx` with an inline `defaultProps` literal and the duration
   from the chapter's beats.json (`round(end x FPS)`, holds and tail
   included). The prefix is the outline's, PascalCased. Typecheck clean.
   Then, in one message, start what runs in parallel: one `sketch-builder`
   per chapter in build mode (slug, video and chapter numbers, chapter ID,
   composition ID, shot list, beats.json, continuity note), `sound-engineer`
   in plan mode (step 8), and any `manim-builder` and one `blender-builder`
   per approved exact element. A one-chapter video you build yourself
   while those run. If a builder finds a hold has to change (a
   hold adds to the voice's own break), re-resolve that beats.json and tell
   the user if an approved number moved.
   Blender research comes first: show the user the reference sheet
   (dimensions and sources) if the object must be exact, and ask before any
   reference photos or CAD files are downloaded. A Manim layer starts as a
   frames folder; while it's missing, the drawing renders its stills with
   the layer hidden. If a builder asks for a shared change (a doodle to
   promote into `lp-toolkit/sketch`), make it yourself in a linked toolkit
   checkout (`lp-toolkit`'s README) and tell the other builders it's there.
7. **Review** (the stills gate). Each builder returns its chapter's stills
   (`npx lp-stills <Id> out/stills/<Id> <f1,f2,...>`). Review
   them yourself, since you didn't build them, against sketch-style.md
   "Checks" and the item type (a standalone chapter of a multi-chapter
   video: title card at frame 0, the ground-only tail or, for the last
   chapter, the thank-you card at the end); a contact sheet per chapter
   helps. Check that shared motifs look the same in every chapter. Fix
   small findings yourself; send a large one to that chapter's builder with
   `SendMessage` while it still has its context. A chapter you built
   yourself goes to `stills-reviewer` instead. A finding that would change
   the design goes to the user if it touches something they approved.
   Repeat until each chapter is clean. If you accept a finding as
   intentional, say so in the report.
8. **Sound.** `sound-engineer` in plan mode gets every chapter of
   the video (shot lists, beats.json, transcripts) and the video's mix sheet
   if one exists (`courses/<slug>/sound/<prefix>-vN.md`). The plan gives a
   different track per chapter, lo-fi first, with the title silent apart
   from its effect, the bed flat at voice minus 34 LU, soft effects
   (swells and whooshes), and every chapter but the last ending with its
   music still sounding so the Premiere crossfade has music on both sides.
   Show the user its music candidates per chapter (with preview links), its
   effect cues, and its download list (file name, Epidemic ID, size), and
   download nothing until they pick. Then send it the picks with
   `SendMessage` for build mode: it writes each chapter's `public/chapters/<chapter-id>/mix.json`
   and mastered `.voice.wav`. Mount `<MixTrack>` in each chapter, point its
   narration Sequences at the mastered voice, render the stems it asks for
   from the toggles, and send them back for measurement. Fix every level
   that fails the cheat sheet in `.claude/references/sound-design.md`
   before the handoff. Licensed audio in `public/audio/` stays out of git;
   the mix sheet records each file's Epidemic ID so it can be downloaded
   again.
9. **Studio handoff.** Start Studio. Tell the user which controls are in
    each chapter's props panel (the audio toggles, and anything the build
    exposed), and, if a chapter has a Manim layer, which are in
    `manim/<chapter-id>/layout.json` and how `scripts/manim-watch.sh`
    re-renders it on save. Wait for their changes. They hear the full mix in
    Studio, so ask them to listen for the bed under speech, each effect,
    and the track change between chapters. For anything they'd rather point
    at than describe, offer the review editor (CLAUDE.md "Review editor"):
    they mark the frame, press Send, and you run `/revise <chapter-id>`.
    Repeat until they have nothing left open.
10. **Final.** If a chapter has Manim layers, encode them (`manim-render.sh`
    without `--frames`) and switch each `ManimLayer` to its `.webm`. Then
    continue with "Per video" step 5 (Render).

## The path's intro and review videos

If the outline has them, the path's intro video (video 0, `<prefix>-intro`)
and review video (`<prefix>-review`) go through the same flow as a
one-chapter video: `/video <slug> 0` or `/video <slug> <N>` (the review's
global number), composition
`<Prefix>Intro` or `<Prefix>Review`, one MP4 plus VTT. The intro is
marketing-style; if its script or the outline doesn't say whether it keeps
the hand-drawn look and a chapter title card, ask the user before writing
the shot list, and say what you'd otherwise assume (hand-drawn, a title card
with the path's name, no close line (the scripts leave it out of the
intro), and the ground-only tail at the end).
