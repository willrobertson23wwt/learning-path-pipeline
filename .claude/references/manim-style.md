# Manim house style

How this course builds the exact pieces of a video in Manim. Since
2026-09-25 the course draws its videos by hand in Remotion
(`sketch-style.md`, `sketch-builder`); Manim is an on-demand specialist,
like Blender, for what must be precise: a plotted curve, a true-to-scale
diagram, math. Its output is a transparent layer shown as a clean card on
the drawing. `manim-builder` reads this whole file before any build;
`sketch-builder` reads "Division of labor" and "Handoff to Remotion". The
video designer never reads it.

The rules below were found in the li-v6-ch1 pilot (September 2026), when
Manim drew whole chapters; they still hold for any Manim layer.

## Division of labor

`sketch-builder` owns the composition and draws everything by hand.
Manim draws only the elements the shot list's engine plan assigns it (an
exact plot, a precise diagram), each as one transparent layer placed with
`ManimLayer` on a card (a printed-looking panel: navy-ink fill, a 2 px
border at white 30-40%). Its colors come from `manim/_kit/theme.py`, the WWT
palette; its text is LaTeX for words and math, monospace for commands, as
below.

Blender is a third, on-demand source, for 3D assets stock can't supply
(`blender-builder`, rules in `.claude/references/blender-style.md`). It
renders transparent PNG frames that a `ManimLayer` places, or that a Manim
scene loads as an image sequence when Manim objects must interact with it.

The engine plan in the shot list records each Manim element, its window,
and why it had to be exact.

**No pills.** The user rejected the rounded-pill label (a bordered capsule
around a short phrase). Emphasis comes from the text itself: writing on,
a color change, an underline drawing in, a single `Circumscribe`, scale.

## Type

- **LaTeX for all words and math:** titles, labels, on-screen captions,
  verdicts, formulas. `Tex` / `MathTex`, Computer Modern, animated with
  `Write` (draw-on) or `FadeIn`. Color per word with `\textcolor` or by
  indexing substrings.
- **Monospace for commands, paths, and terminal output:** `Text` or `Code`
  in Menlo (`theme.mono_font()`). Never set shell syntax in LaTeX: `$ _ ~ #
  % \ { } ^ &` all need escaping, and a command must be copy-exact.
  IP addresses in running prose may be LaTeX (`192.168.10.42` has no
  specials); in a command or its output they are mono.
- **Sizes:** the designer gives pixel sizes on the 1080p frame. For `Tex` /
  `MathTex` use `theme.px_tex(css_px)` (1.40 px per font_size unit,
  Computer Modern); for Pango `Text` / `Code` use `theme.px_font(css_px)`
  (1.88, Menlo and Helvetica Neue Bold). Both calibrated in the pilot.
- **Colored LaTeX hairlines:** Computer Modern's thin strokes are 1-2 px at
  40 px, under the 2 px minimum for colored strokes. Set colored words at
  44 px or more. Body text at least
  40 px on the 1080p frame, labels at least 32 px, mono in terminals at
  least 30 px.
- **No `Integer` / `DecimalNumber` for text that must match the course
  type:** they're `MathTex` underneath (fine now that LaTeX is installed,
  but they re-typeset every frame; for a counting label, pre-build the few
  values and swap visibility).
- Pango `Text` (sans) spaces glyphs 3-6% differently from a browser. It
  only matters when Manim text must match Remotion text side by side, which
  Manim-first avoids. If it ever does, `manim/_kit/typeset.py`
  `css_text()` places glyphs at the font file's advances.

## Color

Follow `.claude/references/video-design/03-accessible-color.md` (WCAG 2.2):
contrast for text and for graphics that carry meaning, and never color as the
only cue. Colors come from `manim/_kit/theme.py` (mirrors `theme.ts`); no
Manim defaults (`BLUE`, `YELLOW`, ...).

## Motion

- Rate functions: `rate_functions.ease_out_cubic` (or `ease_out_quart`) for
  entrances, `smooth` for moves and sweeps. Never `linear`, except a
  constant-speed travel the design asks for. `Write` and every animation
  inside `LaggedStart` default to linear or smooth inconsistently: set
  `rate_func` explicitly on each.
- Elements enter once and hold until their scene cuts; no looping pulses;
  nothing flashes more than three times in any second (WCAG 2.3.1).
- Updaters: an animation suspends a mobject's updaters and restores them
  afterwards. Clear updaters (`clear_updaters()`) once a tracker-driven move
  ends, or a later animation on the same mobject snaps back.
- Morphs: `TransformFromCopy` between shapes with different glyph counts
  (3 digits to 8 bits) scrambles; `TransformMatchingShapes` matches few
  shapes. For "this becomes these", fade the source out toward the target
  while the targets fan in from the source (`FadeOut(..., target_position=)`
  with a lagged `FadeIn(..., target_position=)`).
- `BraceBetweenPoints` redrawn every frame via `always_redraw` doesn't
  shimmer.

## Frame and timing

- Every scene subclasses `manim/_kit/timing.py` `BeatScene`: `media_id`,
  `window = (startBeat, endBeat)`, `wait_until`, `run_until`, `finish()`.
  Beats come from `public/chapters/<id>/beats.json`; never hard-code a time.
  `finish()` asserts the frame count.
- 1920x1080, 30 fps, transparent (`theme.use_course_frame()`). 1 Manim unit
  = 135 px; `theme.px()` converts positions. The bottom 15% (y > 918 px)
  stays empty for captions.
- One continuous scene per window; use `next_section()` for internal
  milestones rather than separate classes, so seams are identical by
  construction.
- **Straight alpha.** Cairo renders premultiplied color, which every
  consumer downstream reads as straight, so translucent fills went dark and
  tints behaved as alpha squared. `BeatScene` uses
  `_kit/straight_alpha.py` by default. Apply it in exactly one place.

## Render and handoff to Remotion

- Render only with `scripts/manim-render.sh <scene.py> <Class>
  public/manim/<id>/<name>.webm [--frames] [--preview]`. It writes a PNG
  master, then either copies the frames (`--frames`, while iterating) or
  encodes VP9 with alpha tagged BT.709 (final), and checks frame count and
  alpha. Untagged encodes dulled ACCENT and SUCCESS; the tag fixes it. Never
  use `-ql` (15 fps).
- `ManimLayer` plays either: `src="manim/<id>/<name>"` (frames folder,
  frame-exact in Studio) or `src="manim/<id>/<name>.webm"` (final).
- Manim is the pixi env (`.pixi/bin/pixi run ...`); LaTeX is TinyTeX in
  `.tinytex/` (the render script puts it on PATH). Neither needs sudo.
- Render time in the pilot: about 80 s for 56 s of 1080p (straight alpha
  costs about 4x per frame), plus about 2 min for the VP9 encode.

## Tunables: `manim/<id>/layout.json`

Every position, size, and per-element timing offset the user might want to
change after review lives in `manim/<id>/layout.json`, read by the scene at
render time (defaults in the file, never duplicated in code). With
`scripts/manim-watch.sh` running, saving the file re-renders the frames and
Studio picks them up: this is the Manim half of "final changes in Studio".
Name keys the way the shot list names elements.
