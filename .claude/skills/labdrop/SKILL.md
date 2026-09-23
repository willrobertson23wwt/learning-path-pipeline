---
name: labdrop
description: Build an ATC Lab Drop marketing video, a ~50-60 s promo for a learning path with a music-synced brand sting, voiceover slides and a WWT end card, rendered as one MP4. Use when the user asks for a Lab Drop, promo, teaser, or marketing video for a learning path. Not for course chapters; those go through /video.
argument-hint: <learning path name> [source video or description]
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Build a "Lab Drop" marketing one-off: a short (~50-60s) promo video for a
learning path, in the style of `LabDrop` (`src/LabDrop.tsx` in the template repo — the
worked example, built for a Linux learning path). `$ARGUMENTS` names the learning path
being promoted (and optionally a source video/description to mirror).

These are NOT path media items — they don't use the course pipeline
(`/outline → /scripts → /audio → /video`), the paper/fluid backdrops, or the
chapter composition conventions. One composition, one deliverable MP4 with
music + SFX + voiceover baked in.

## Structure (mirror the worked example)

1. **Brand sting (~0-8s)** — the ONLY place "ATC LAB DROP" appears, ever.
   Keycap tiles slam in word-by-word on detected music beats, over the
   glitch-grid backdrop. Never speak or write "Lab Drop" anywhere else in the
   video: not in narration, not in slide text, not on the end card.
2. **whoami cold open** — terminal types `$ whoami` (or the platform's
   equivalent, e.g. `PS> $env:USERNAME`, `Router# show users`), answers with
   the learning-path slug (e.g. `powershell-fundamentals`).
3. **Title** — the learning path's name as a plain wordmark + accent bar. No
   subtitle, no brand tiles.
4. **3-6 numbered slides** (`01 / 05` mono indicator + progress dots) — one
   headline per slide summarizing a course/skill area, each with a small
   animated visual (terminal, stack diagram, chips + bars). Slide beats come
   from the narration transcript, same as path videos.
5. **Outro** — bare `$` prompt → pixel-mosaic wipe → end card: learning-path
   wordmark + accent bar + the WWT mark (`public/labdrop/wwt-logo.png`)
   floating gently (±5px, ~6s period). No CTA unless asked.

## Assets (public/labdrop/ — already in place, reuse across lab drops)

- `particles-loop.mp4` — full-video backdrop (Envato dark line-particles,
  20s, use `<Loop durationInFrames={595}>`).
- `glitch-intro.mp4` — behind the sting only, with a `rgba(5,8,15,0.55)`
  tint overlay (the clip's early reveal phase is bright and will wash the
  frame without it).
- `music.mp3`, `sfx/` (impact, click, typing, whoosh) — source library is
  the licensed asset library named in CLAUDE.md (background music, sound FX,
  a typewriter pack, a light-switch pack); copy new picks into
  `public/labdrop/` (staticFile can't reach outside the project).
- `wwt-logo.png` — transparent WWT mark for the end card.

## Audio pipeline

- **Narration**: write the VO script to
  `courses/labdrop/scripts/NN-<name>/01-full.md` (frontmatter `folder:
  labdrop-vN`), generate via `node scripts/generate-audio.mjs labdrop`,
  transcribe, and retime every beat from the transcript (comp beat =
  transcript cue + `narrOff`). ~150 words ≈ 45s.
- **Music beats**: detect real onsets before animating the sting — decode
  the track's first ~14s to mono 8kHz WAV (`npx remotion ffmpeg`, wav not
  raw pcm; the bundled ffmpeg has NO filters and no aevalsrc/anoisesrc),
  compute 20ms RMS windows in Node, peak-pick positive RMS deltas. Slam one
  word per strong hit; each slam gets a white flash that must be ZERO before
  its hit (3-point interpolate `[f0-1, f0, f0+9] → [0, 0.32, 0]` — clamping
  left at the peak washes the whole sting gray).
- **Mix levels** (approved on the worked example): music 0.55 under the
  sting, duck to **-35 dB (0.018)** under the VO, ~0.3 swell for the end
  card, fade to 0 at the tail. Whooshes ~0.3-0.35. SFX: impact + click on
  each tile slam, typing under type-on beats, whoosh peaks ON transitions
  (profile multi-whoosh files with the RMS plot and trim to a single hit).
- **Pause-before-the-closer**: if the VO's final tagline needs breathing
  room, don't regenerate — split the narration `<Audio>` into two Sequences
  at a word boundary from the transcript (`narrCut` + `narrPause` in the
  beat table) and shift downstream beats. Check exact word start/end times;
  the TTS often leaves zero gap between sentences.

## Conventions that differ from path media

- Backdrops: Envato assets only — never `PaperBackdrop`/`TransitionBackdrop`.
- No `-Overlay` composition, no `deliverables/` copy (deliver from `out/`),
  no companion article.
- Fixed-duration composition (no `calculateMetadata`); duration =
  `TL.end * FPS`. Keep the ~2s foreground-fade end buffer (backdrop holds).
- Everything else from CLAUDE.md still applies: springs, hold-don't-pulse,
  per-beat stills at multi-element moments, explicit light text colors,
  `whiteSpace: 'nowrap'` on big wordmarks, typecheck before rendering.

## Steps

1. Confirm the learning path name, slide content (course/skill areas), and
   any source video to mirror. Draft the VO script (no "Lab Drop" wording)
   and stop for review if the user hasn't already approved copy. Narration
   costs credits, so don't generate it from unapproved copy.
2. Generate + transcribe narration; dump word timings; beat-detect the music.
3. Build/retime the composition (clone the `LabDrop` pattern: `kitLD.ts`
   beat table, scenes file, composition in `src/Root.tsx`).
4. Typecheck → per-beat stills (sting mid-slam, title, each slide, mosaic,
   end card) → render MP4 to `out/`.
5. Report what to listen for (mix levels, SFX timing) — those are ear calls
   the user makes on the render.
