# Hand-drawn house style (the course's video style)

How this course builds narrated videos: marker line art and hand lettering
drawn on stroke by stroke in Remotion, on the WWT navy ground.
`sketch-builder` reads this whole file before any build; `stills-reviewer`
reads "Checks". The video designer never reads it: design intent comes in
tool-free, in the playbook's visual terms (`video-design.md`), and turning it
into strokes is the builder's job.

Every rule here was found building li-v6-ch1-hd (2026-09-25) unless it says
otherwise. Worked example: `examples/li-v6-ch1-hd/` (read its
`src/LiV6Ch1HD.tsx` before your first build).

## Division of labor

Remotion draws everything, with the toolkit in `src/components/sketch/`.
One composition file per chapter holds the drawing, the narration split, the
mix, and the Studio schema. Two on-demand specialists supply what can't be
doodled, each shown as a clean card laid onto the drawing:

| Source | For | Shown as |
|---|---|---|
| `manim-builder` | an exact plot, a true-to-scale diagram, math that must be precise | its transparent layer (`ManimLayer`) on a printed card |
| `blender-builder` | a specific real device, an exploded or true-to-scale 3D view | its transparent frames on a card |
| stock (Envato search) | a screen recording, a photo-accurate part | a card |

Use them only when the designer's shot list asks for something exact; the
drawing is the default for everything else.

## The toolkit (`src/components/sketch/`, barrel `index.ts`)

- **Geometry is strokes.** Everything is a list of strokes (`Stroke` =
  points, one pen-down each): glyphs, rough.js shapes, hand-built doodles.
  `Ink` draws any stroke list with perfect-freehand marker weight (a slow,
  seeded swell) and draws on in order: `progress` 0-1 runs the pen along
  stroke after stroke, with `penLift` px of travel between them. Put
  `<InkDefs />` once per `<svg>` and the drawing inside
  `<g filter="url(#marker)">` (frozen edge roughness).
- **Lettering is `HandText`.** The house hand is EMS Readability, a
  single-line plotter font, so letters write on as pen strokes. Each letter
  has a seeded wobble (baseline, tilt, size, spacing) plus a slow wander
  along its strokes; `jitter` and `wobble` default to 1.4. It is condensed
  to 86% width. `cap` is the cap height in px (the designer's sizes are cap
  heights). `text` takes `TextSpan[]` for several colors in one line.
  `layoutText()` measures without drawing: same seed, same `jitter`, same
  width, so always measure with the settings you render with.
- **Shapes** (`shapes.ts`): `line` (one confident bowed stroke), `rect`,
  `ellipse` (a loose circle), `poly`, `arrow` (shaft, then a one-stroke
  head; `bend` bows it), `braceH` / `braceV`, `cloud` (scalloped;
  `flatBottom=false` for a thought bubble), `cross`, `scribble`, `blob` (a
  big lumpy enclosure, clockwise from top left), `doodle` (authored SVG path
  data placed and wobbled), and ready doodles `computer`, `rack`, `office`,
  `house`. Add new doodles to `shapes.ts` as functions returning strokes, in
  drawing order: outline first, then details.
- **Wipes** are `SweepMask`: a soft-edged left-to-right mask. The whole
  sheet uses the frame span; a rub-out uses a small span around the word
  (`x0`, `x1`, `soft` 30).
- **Grounds:** `NavyGround` (navy lightest behind the drawing, navy-ink
  corners, frozen grain) and `TitleLight` (two drifting blue and indigo
  pools; `fadeStartSec` fades it out with the title, `fadeInStartSec` brings
  it back for `SketchThankYou`). Both behind `{transparent ? null : ...}`.
- **Palette:** `WWT` tokens and `INK` roles in `palette.ts`
  (`INK.line`, `note`, `ghost`, `a`, `b`, `key`, `bad`, `good`).
  `theme.ts` maps the old names (`ACCENT`, `DANGER`, `SUCCESS`, `WARNING`,
  `PANEL_BG`, `TERM_BG`) to WWT values and adds `GROUND` for GIFs and cards.

## Building a chapter

- **One timing helper.** `at(t0, dur, easing)` returns 0-1 progress from
  the beat times in `beats.json` (`B.name`). Writing uses
  `Easing.inOut(Easing.sin)` (a steady hand with a soft start and stop);
  fades `Easing.inOut(Easing.cubic)`; the reveal's slide a quick start with
  a long settle (`Easing.bezier(0.3, 0.75, 0.3, 1)`). Durations come from
  the shot list; writing runs at about speaking pace.
- **Each element owns its window.** Give every `Ink` and `HandText` its own
  `progress={at(beat, dur)}`; sub-steps (an arrow, then its word) split one
  progress. Mount a scene only inside its window
  (`t >= start - 0.1 && t < wipe + 0.7`).
- **Seeds are identity.** Every element gets a stable, unique `seed` (the
  text is the default). Changing a seed redraws the wobble; keep seeds when
  you nudge positions.
- **Move with `translate`, never by changing coordinates.** Wobble noise
  is computed from the stroke's coordinates, so an element whose points
  move would boil. Build moving things (the divider, its signs) at their
  home position and wrap them in `<g transform="translate(dx 0)">`; the
  same holds for shifting a whole scene for balance.
- **Recolor by interpolation.** A second-marker sweep is
  `interpolateColors` per glyph, staggered left to right; a trail behind a
  moving thing is driven by position (`interpolate(glyphX - dividerX, ...)`),
  not by time, so it can't drift from the mover.
- **Place from measured widths, not from the shot list's boxes.** Lettering
  runs 15-60% wider than a designer's estimate (lowercase most). Measure with
  `layoutText`, then fit what surrounds it: a circle around a prefix, a
  brace after the widest row, a bubble around its rows, a label beside a
  shape. Keep the designer's cap sizes; move the shape, and note it in the
  shot list's Design log.
- **Arrows aren't glyphs.** The font has no arrow characters; draw them
  with `arrow()` beside the word.
- **Upright where it must read exactly.** A capital I or l on a slant can
  read as "/": letter short acronyms and terms with `jitter` 0.6-0.9, and
  the address rows at 0.9 so the tall x's don't read as capitals.
- **Audio** is the same as before: the narration split at every hold
  (`kit.ts` cut table, each cut inside measured silence, checked against
  beats.json), `MixTrack` from `public/chapters/<id>/mix.json`, Studio
  toggles for narration, music and effects.

## Timing lessons

- **A hold adds to the voice's own break.** After "left." in li-v6-ch1 the
  voice already pauses 0.8 s, so a 2.4 s hold made a 3.2 s silence and the
  finished slide sat still 2.2 s. Measure the silence around every key
  animation hold (the sound engineer's timeline, or RMS below -45 dBFS),
  and size the hold so the result sits about 1-1.3 s. Tell the user when
  that changes an approved number.
- **A beat can't reuse the previous beat's words.** `beats.mjs` searches
  forward from the previous beat's phrase, so a hold on "host on that
  network" right after a beat on "names the host" fails. Trim to the words
  that aren't shared ("on that network"); keep the same first word for a
  start edge, the same last word for an end edge, and no time moves.
- **Literal times follow the holds.** A shot list's `{"at": ...}` times
  (a wipe inside a hold, the end) are written against the designer's
  estimates; recompute them from the resolved holds.
- **A new hold needs a measured cut.** Find the silence after its phrase in
  the mastered voice and add the cut to `kit.ts`'s table.

## Frame

- 1920x1080, 30 fps. Nothing essential below y 918 (captions). Keep the
  composition balanced in the 0-918 band: a strip that fills only the top
  half for half a minute reads as sitting high; move the whole scene with a
  `translate` rather than re-laying it out.
- Marker lines 4-5 px; bold marks (a key divider, a cross) 6-8 px; lettering
  stroke width follows cap height (about 0.085 x cap, at least 2.5 px).
- Render with JPEG quality 95 (`remotion.config.ts`); the navy falloff bands
  otherwise.

## Checks (stills-reviewer)

In addition to the usual layout, legibility and caption-band checks:

- lettering touching or crossing a drawn shape (circles, braces, bubbles,
  enclosures): the most common defect in this style;
- a slanted capital that changes a word's reading ("C/DR");
- letters that read as a different case (a tall x as X);
- color on the wrong side of a divider, or red without its cross;
- drawings that move or wobble after they're drawn (boil);
- the lesson frame sitting high or low in the 0-918 band;
- a wipe that leaves a hard edge or streak, or changes the ground.
