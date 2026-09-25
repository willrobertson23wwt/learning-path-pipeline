# Worked example: a Manim chapter (li-v6-ch1), superseded

**Superseded as the video style** (2026-09-25): the course draws its videos
by hand now; the reference is `../li-v6-ch1-hd/`. Keep this one for
`manim-builder`, which still makes exact plots and diagrams on demand: its
scene, `BeatScene` timing, layout.json tunables, and the transparent WebM
layer are how a Manim card is built. The charcoal `CourseBackdrop` it used
was retired with the switch to navy.

The pilot of the Manim-first video pipeline, built in the linux-intermediate
course (branch `manim-pilot`, a test rebuild of "Addresses and Prefixes",
chapter 1 of video 6; that course is finished and posted, so never build
in it). These files are a reference copy, not compiled: new paths build their
own chapters from the patterns here. The shared pieces they use are real
template files (`manim/_kit/`, `src/components/ManimLayer.tsx`, `MixTrack.tsx`,
`scripts/`).

| File | What it shows |
|---|---|
| `design.md` | The video-designer's shot list: Vision through Design log, Holds, Sound, the Background proposal the user chose (L1 + T1), the Engine plan. |
| `beats.spec.json` → `beats.json` | Beat-to-phrase map and its resolved timing (`node scripts/beats.mjs <transcript> --spec ... --out ...`), with holds sized to what moves (0.2 s over a still frame, 1.5 s around the reveal). |
| `narration.md` | The narration the design started from. |
| `manim/scene.py`, `manim/layout.json` | One `BeatScene` over the whole chapter, every tunable in layout.json. |
| `src/LiV6Ch1Manim.tsx` | The wrapper: course backdrops behind `transparent` guards, `ManimLayer` (via `GuardedManimLayer`), the narration split at holds, `MixTrack`, the Studio schema (layer placement and audio toggles). |
| `src/kit.ts`, `NarrationTrack.tsx` | The audio cut table (cuts inside measured silence, checked against beats.json holds) and the split narration. |
| `src/GuardedManimLayer.tsx` | Hides the layer until its frames or WebM exist, so the wrapper renders before Manim does. |
| `mix.json`, `mix.bed.json` | The sound engineer's mix: music baked to its envelope and played at 0 dB (Remotion rounds volume to 0.01 steps), effects with gains. |
| `mix-sheet.md`, `sound-vocabulary.md` | The video's mix sheet (versions v1-v3 and why) and the course's effect vocabulary. |

What the user decided along the way (now house rules in CLAUDE.md and the
references): Manim draws everything, LaTeX for all text but commands;
DANGER #FF6666; no pills; pauses sized to what moves; title silent apart
from its effect, music flat at voice -34 LU, one track per chapter, soft
effects at voice -16 to -17 LU; -16 LUFS masters for Vimeo; the charcoal
lesson ground and drifting title light (also behind the thank-you card).
