# Video design playbook

The working rules for designing a narrated explainer in this course, drawn
from three cited briefs in `video-design/`. This is what the viewer sees and
hears, and why. It says nothing about how any of it is made: the build team
turns a design into frames, and tells the designer, in visual terms, when
something has to look different.

- `video-design/01-instructional-evidence.md`: what the learning science
  supports, with effect sizes and its weak spots.
- `video-design/02-motion-craft.md`: how skilled explainers compose,
  choreograph, and pace, including the signature moves below.
- `video-design/03-accessible-color.md`: WCAG 2.2 color, contrast, size,
  timing, and flashing, measured against this course's palette.

Read this file every time. Go to a brief when a decision is close or when
you need to justify a departure.

## Where these videos live

- **Embedded micro-videos** (30-90 s) sit at a step in a lab guide, shown
  beside a browser terminal in a player about **800 px wide**. The learner
  has just done something (often a predict step) and goes straight back to
  the terminal afterwards. No title card: frame 0 shows content, usually
  what the learner just saw, redrawn. The last frame holds, fully readable,
  for about 2 s.
- **Standalone videos** (the briefing, and any video the outline marks
  standalone; 1-3 min) open on a title and close on the course's thank-you
  card. The title and the background behind it leave together, on the
  same fade: text never outlives the background it was composed on. (In
  the pilot the title lingered on the plain paper after its backdrop had
  gone, and it read as a mistake.) Anything new waits until both are
  gone.
- **Chapters of a traditional video** (60-120 s of narration each, 2-4 per
  video) are cut by the editor between screencast footage. Each opens on
  its own title card over the title light (the chapter title, with
  "Chapter N · <Video title>" under it) and ends on about 2 s of plain
  ground for the editor's transition; only the video's last chapter closes
  on the thank-you card. You design every chapter of a video together, so
  its motifs carry across the screencasts between them.
- The frame is **1920x1080**. Captions render in the **bottom 15%** (below
  y 918). Keep all essential content inside the central 90% of the frame
  and above that band.
- Narration carries everything. A viewer who only listens must get every
  command, value, and label they need (so the video needs no separate audio
  description). A viewer who only watches with captions must never find the
  picture contradicting the words.

## The course's visual language

The course draws its videos by hand (the user's choice, 2026-09-25, after
comparing it with a typeset version): the look of the minutephysics
explainers, on a dark navy sheet. Worked example: the li-v6-ch1-hd shot list
in `examples/li-v6-ch1-hd/design.md`.

- **Everything is drawn in marker as the narrator speaks.** Words are hand
  lettered; pictures are simple line doodles (stick figures, a computer, a
  server rack, a house, a cloud, thought and speech bubbles, arrows, braces,
  circles, underlines, crosses). Lines draw themselves stroke by stroke in
  the order a person would draw them: letters left to right, a doodle's
  outline first, then its details. There is no hand on screen.
- **Doodles carry ideas, not decoration.** A machine with a thought bubble
  holding its neighbors says more than a paragraph. Keep them tiny, fast
  and plain; no brands, logos or photographs.
- **Most of the sheet is empty ground.** One idea per sheet; when the idea
  changes, the sheet is wiped clean (one soft left-to-right sweep) and a
  new drawing starts. Drawings are still once drawn: no wobble, boil or idle
  motion.
- **How things appear:** written or drawn on at a hand's pace. A word takes
  about as long as it takes to say; a small doodle 0.5-1.5 s; a big
  enclosure about 1 s.
- **How things change** (decide per beat and say why):
  - **slide** only what the narration says moves and the eye must follow as
    one thing (the reveal's divider);
  - **go over it with a second marker** (a re-color sweep in the direction
    of the cause) when the same marks take a new role;
  - **rub out and re-letter** when a value or reading changes;
  - **circle, underline or box it** to cue;
  - **cross it out or scribble over it** when it no longer holds;
  - **keep and add** (the old version in ghost gray above the new) when
    before-and-after is the lesson;
  - **wipe the sheet** when the idea changes.
  Drawn marks don't fly around: instead of flying a number to its slot,
  write the matching number there in the same color.
- **One marker, one hand.** Line weight about 4-6 px at 1920x1080; bold
  marks (a cross, a key divider) up to 8 px. One casual hand-lettered print
  (mixed case, like neat whiteboard writing) for every word the viewer
  reads. Hierarchy comes from size and color only.
- **Hand lettering runs wide.** Estimate a string's width as about 0.65 x
  its cap height x its characters, spaces included ("network" at cap 40 is
  about 195 px; "private address space" at cap 56 about 750 px), and leave
  room around anything that has to fit inside or beside a drawn shape. The
  build team measures the real lettering and may shift a shape a little to
  fit; it keeps your sizes.
- **Commands are printed, not lettered.** Anything the learner types or
  reads in a terminal (commands, paths, output, config lines) appears as a
  clean monospace line on a printed-looking card laid onto the drawing, set
  exactly as typed. Exact things that must be precise, like a plotted curve
  or a true-to-scale diagram, are also clean printed cards. An address
  inside a sentence is lettered; the same address in a command or its
  output is printed.
- **Background:** a dark WWT navy sheet, lightest behind the drawing,
  deeper toward the corners, with a fine still grain. Titles, and the
  thank-you card that closes a standalone video, sit on the same sheet with
  two soft pools of blue and indigo light drifting slowly; the light fades
  as the title leaves, together with it. Only the main marker color and the
  secondary color sit on the title light; red never does.
- **Palette:** the WWT design system, one meaning each for the whole
  series. Thin marker lines are held to the text rule, so the light tints
  carry lines and lettering; the full-strength brand colors are for filled
  shapes and thick strokes only.

  | Role | Color | Means |
  |---|---|---|
  | main marker | near-white (WWT gray-50) | most lines and lettering |
  | secondary | pale lavender-gray (navy-25) | labels, notes, "not yet named" |
  | ghost | mid gray (navy-50) | superseded or background content |
  | accent A | light blue (blue-50) | the current focus; one side of a comparison ("network" in addressing) |
  | accent B | light orange (orange-50) | the other side ("host" in addressing) |
  | key | gold | the one thing the reveal is about; the setting that changes the outcome |
  | problem | light red (red-50) | fails / denied / broken; always with a drawn cross or the word |
  | success | green | works / allowed; check marks and thick strokes only |

  The main marker is the default. Color is for what the viewer should look
  at now. Light red and light orange are close in hue: never let red carry
  meaning in a frame where orange does without its cross.
- **Assets.** Almost everything is drawn. When a moment truly needs
  something that can't be doodled (a specific real device, a screen
  recording, a photo-accurate part), request it (see "Asset requests"
  below), and never make a beat depend on it arriving: give it a drawn
  fallback.
- **No pills.** Emphasis comes from the drawing itself: writing on, a
  second-marker sweep, an underline, one circle-around, size.
- **No emojis.** Drawn check and cross marks are fine.
- **Sound:** a very low instrumental music bed runs under every narrated
  video and fills the holds, so silence in the narration is never dead air.
  You describe the sound you want in the shot list's `## Sound` section:
  mood and energy arc, where the music should lift or settle, and the few
  beats that earn a sound effect. A sound engineer picks the music and sets
  the levels.
  - Keep effects rare and meaningful: one sound per meaning, the same sound
    for the same meaning across the course, never under speech unless it's
    soft.
  - Extra sounds compete with narration for attention (Moreno & Mayer 2000).

## Rules

### What goes on screen

1. Show the picture before the name. The concrete thing acts first; the
   term, symbol, or formula arrives after the viewer has seen what it does.
   Never open a scene on a definition.
2. Start from what the learner just saw (their real output, their real
   device), then move to the abstract model.
3. Animate only what changes over time. Structure, and anything the
   learner will want to look at again, is a still, persistent picture.
4. Cut anything not needed to understand the point, however good it looks.
5. On-screen words are labels, key terms, and exact syntax: two or three
   words, six at most, placed on or beside the thing they name. Never put
   the narrated sentence on screen (the captions already do).
6. Print every command, address, and permission string the learner must
   reproduce. Don't leave it spoken only.

### Timing

7. Each visual appears on the words that describe it: not before, not
   after. Name the exact phrase for every beat.
8. Let the picture land, and size each pause to what moves in it. A pause
   over a still frame (a scene change, a finished frame to read) is only a
   short breath: about 0.2 s beyond the voice's own sentence break. The
   viewer was reading during the speech, and a long silence over a
   motionless frame feels dead (the user's listen on the first pilot).
   For a key animation that plays with nothing spoken over it (the reveal,
   a transform the lesson depends on), the silence should last the
   animation's run time plus about 1 s to take in the result. A hold is
   added to the voice's own sentence break (often 0.5-0.9 s), so count
   that break: in li-v6-ch1-hd a 2.4 s hold after a 0.8 s break would have
   left the finished slide sitting 2.2 s; 1.6 s was right. Say the total
   silence you want, and the hold you think it needs. Place each hold at a sentence
   boundary, say which beat it serves and what moves during it, and don't
   hold where nothing moves. (Designer-inserted pauses at meaningful
   boundaries helped learning in three studies; see brief 01.)
9. Text holds still while it is read: at least 0.3 s per word (1 s per 13
   characters), never under about 1 s, and at most 15-20 characters per
   second for dense strings.
10. Name and show each component, and what it does, before showing the
    components working together.

### Motion

11. Every movement has a job you can name: reveal, relate, transform,
    compare, or point. If you can't name it, cut it.
12. One thing moves at a time. When two must change, stagger them.
13. Keep one anchor object on screen across a sequence and change it in
    place. Don't wipe and redraw the same thing; wipe the sheet only when
    the idea changes.
14. When one thing becomes another, change it in place so each part of the
    input visibly lands on its part of the output: rub out and re-letter
    the part that changed, or go over it with a second marker.
15. Stage a complex change as simple steps of about a second each, eased,
    with no overlapping objects.
16. Scale a move's duration to its size: small nudges 0.3-0.5 s, large
    transforms 0.8-1.5 s. Ease every move: quick start, slow settle.
17. Save the one big, slower, expressive move for the moment of insight.
    Everything else stays quiet and quick.
18. Elements enter once and hold until their scene ends. No looping, no
    pulsing, no decorative drift, zoom, or shake. Nothing flashes more than
    three times in any one second.

### Cueing and color

19. Cue the one element the narration is about: recolor it, dim the rest,
    or spotlight it. A cue that travels along the path of cause and effect
    beats a static arrow. A cue aims the eye; the narration still explains.
20. Never let color carry a meaning alone. Every color-coded distinction
    gets a second cue that stays on screen with it: a word label, a drawn
    glyph, a fixed position, or a line style. Pass/fail always gets a
    glyph plus a word; network/host always gets its word labels, with
    network on the left.
21. Text needs at least 4.5:1 contrast against what's directly behind it
    (every palette role above passes on the navy sheet's lightest point:
    main 14.7, secondary 9.4, ghost 5.0, blue 7.2, orange 8.1, gold 10.0,
    red 6.1; green is 4.6, so it is for thick strokes, not words). Any
    line, border, or fill edge the viewer needs in order to understand the
    picture needs 3:1. A pale fill can stay pale if a full-color border
    carries the edge.
22. Draw marker lines at least 4 px wide on the 1080p frame.

### Size and layout

23. Lettering sizes are cap heights (the height of a capital letter) on
    the 1080p frame: headlines 60-70 px, main content 44-70 px, labels
    28-34 px, nothing under 26 px. Printed monospace on a card at least
    34 px type.
24. Compose for a small player: one focal point per beat, generous
    negative space, paired elements balanced and centered together, single
    elements centered.
25. Nothing overlaps or touches unless the overlap is the point.

## Signature moves

Reach for these by name in a shot list, described as the viewer sees them.

1. **Persistent anchor.** One structure stays through the sequence; each new
   idea is a change to it.
2. **Change in place.** The part that changed is rubbed out and
   re-lettered, or gone over in a new color; the rest stays put.
3. **Picture, then name.** The object acts; then its term is written on.
4. **Build up piece by piece.** A command, formula, or diagram assembles as
   the narration reaches each part, each part in the color of what it
   stands for.
5. **Color bridge.** A region and its word share a color, so the eye links
   them with no arrow.
6. **Matching number.** Instead of flying a value to its slot, the same
   number is written there in the same color, so the color says "this is
   that".
7. **Dim the rest.** Everything but the subject drops to grey.
8. **Grow from the cause.** A new element emerges from the thing that
   produces it.
9. **Concrete case, then the general one.** One instance plays with fixed
   values, then the picture sweeps across many values to show the pattern.
10. **Cue, then change.** A highlight lands on the part about to change a
    beat before it changes.
11. **Ghost of the original.** After a transform, a faint copy of the
    before stays beside the after.
12. **Clean sheet.** When the idea changes, the drawing is wiped off in
    one soft sweep and the next idea starts on empty ground.
13. **The reveal.** Quiet and quick until one larger, slower move delivers
    the insight; once per video.
14. **Hold the assembled frame.** At a scene change, the finished picture
    sits still for a short breath (rule 8), not a long silence.
15. **Ask with the picture.** Open on a puzzle (a surprising output, a
    mismatch) that the narration then explains.
16. **The doodle that thinks.** A small drawn character or machine with a
    thought or speech bubble holds the idea from its point of view ("who
    are my neighbors?").

## Asset requests

For each asset, in the shot list's `## Asset requests`:
- **What:** the thing itself, in plain words ("a photo-accurate front
  panel of the lab's switch").
- **Style:** line or filled, flat or dimensional, stroke weight, level of
  detail, and how it should sit with the course palette on a dark
  background. Say whether it must be recolorable to palette colors
  (vector) or can arrive colored.
- **Format and size:** vector or image, still or looping, transparent or
  not, the largest size it appears at on the 1080p frame, and loop length
  for motion.
- **Where and why:** the scene and beat, and what it teaches there.
- **Search terms:** four to eight keywords, as you'd type them into a stock
  library, plus words to exclude (e.g. "-3D -isometric -cartoon").
- **Must not:** anything that would break the rules (busy detail behind
  text, bright or light backgrounds, text baked into the art, brand logos).
- **Fallback:** what the beat shows if no match turns up.

## A shot list records

For each beat:
- the narration phrase it lands on;
- what changes, and which signature move it is;
- the exact on-screen strings, each with its type role and color;
- the second cue behind every color distinction;
- the **resting state**: every element's box on the 1920x1080 frame once
  the beat settles.

Also record the holds, and the one "reveal" moment. Check every resting
state against the rules on overlap, the caption band, size, and contrast
before handing it over.
