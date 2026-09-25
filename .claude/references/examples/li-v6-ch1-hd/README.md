# Worked example: a hand-drawn narrated chapter (li-v6-ch1-hd)

The course's video style (user decision, 2026-09-25): marker line art and
hand lettering drawn on stroke by stroke as the narrator speaks, doodles
that carry the ideas, on the WWT navy ground. Built in the `hand-drawn-test`
sandbox from the li-v6-ch1 narration (linux-intermediate's "Addresses and
Prefixes"; that course is finished and posted, so never build in it). These
files are a reference copy, not compiled: new paths build their own
chapters from the patterns here. The shared pieces are real template files
(`src/components/sketch/`, `MixTrack.tsx`, `scripts/`). The rules are in
`.claude/references/sketch-style.md`.

| File | What it shows |
|---|---|
| `style-brief.md` | The brief the designer got for this first round (now the house style in sketch-style.md). |
| `design.md` | The video-designer's shot list: the slide-or-redraw rule, doodles, holds, the build notes at the end of the Design log. |
| `beats.spec.json` -> `beats.json` | Beat-to-phrase map and its resolved timing (`node scripts/beats.mjs <transcript> --spec ... --out ...`). Note the trimmed phrases: a beat can't reuse the previous beat's words. |
| `src/LiV6Ch1HD.tsx` | The whole chapter in one file: an `at(t0, dur)` progress helper, every element an `Ink` or `HandText` with its own window, the divider and its signs moved by `translate` (so their wobble never changes), the reveal's color trail driven by position, `SweepMask` for the rub-out and the sheet wipes, scenes mounted only in their window, the Studio schema (audio toggles). |
| `src/kit.ts`, `NarrationTrack.tsx` | The audio cut table (cuts inside measured silence, one per hold, checked against beats.json) and the split narration. |
| `mix.json`, `mix.bed.json`, `mix-sheet.md` | The sound engineer's refit to this timeline (the approved track and effects, envelope baked, -16.1 LUFS measured on the render). |
| `narration.md` | The narration the design started from. |

In the sandbox the chapter file sat at `src/sketch-test/hd/`, so its imports
are one level deeper than a course's `src/<Id>.tsx` would be.

What the user decided along the way: this style over Manim and the older
Remotion look; no hand on screen; the WWT palette everywhere; navy ground,
title light in WWT blue and indigo; GIFs and cards stay crisp (navy, WWT)
rather than hand-drawn; Manim only for exact plots, shown as a card.
