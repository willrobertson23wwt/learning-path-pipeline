# li-v6-ch1 shot list (chapter 1, "Addresses and Prefixes")

**Vision:** the learner sees an address as one row of 32 bits with a movable
fence in it: everything left of the fence is the network, everything right
is the host, and the number after the slash says where the fence stands.

**Anchor:** the address strip. The decimal address sits on top, its 32 bits
sit in four groups of eight directly beneath their octets, and an amber
divider stands in the bit row with a cyan "network" brace to its left and a
green "host" brace to its right. It carries scenes A to C unchanged in
identity; every idea is a change to it. It is also the motif to reopen
chapter 2 on: the /24 strip with its host bits turning all zeros (network
address) and all ones (broadcast).

**Reveal:** `cReveal` ("moves") through hold 4. "/24" has just become
"/16"; on "moves left" the divider slides slowly left across the third
octet (1.8 s), each bit it passes turns from cyan to green, the braces
stretch and shrink with it, and the bit counts tick from 24 / 8 to 16 / 16.
The narration then stops for 2.5 s: the slide finishes about 1.4 s into the
silence and the result sits still for about 1.1 s more. The address digits
never change.

Times: narration time is the transcript's; final time adds the 1.0 s title
lead-in and the holds (total 6.5 s after the lead-in, 7.5 s in all).
Final times below are estimates; the resolved beats.json is authoritative.
Composition length: 81.27 + 7.5 + 2.0 tail = **90.77 s**.

## Scenes

| Scene | Final time (s) | What the viewer sees |
|---|---|---|
| Title | 0-4.3 | "Addresses and Prefixes" over the fluid loop; it stays, on paper, through the first sentence while the address writes on above it |
| A: 32 bits, two parts | 1.1-17.7 | an address, its bits growing out of it, the split into network and host |
| B: The prefix | 17.9-39.7 | "/24" appears, its 24 flies down to count the network bits, the decimal reading colors in |
| C: Different prefix | 39.9-65.6 | /24 becomes /16, the divider slides left (reveal), neighbors change |
| D: Private ranges | 65.7-89.5 | the three private ranges, a path to the public internet drawn and then blocked, the chapter's example lands in the 192.168 row |
| Tail | 89.5-90.8 | foreground fades out, paper only |

### Title  [0-4.3 final]
- beat `titleIn` (0): the title springs in over the dark fluid loop,
  already on screen at frame 0 and settled by about 0.3 s.
  - "Addresses and Prefixes": prose type, 96 px, white 92%, centered, box
    ~ 520-1400 x 430-510.
  - "Chapter 1 · Addressing and Subnetting": prose type, 44 px, white 60%,
    centered, box ~ 590-1330 x 548-592.
- Lead-in (`titleHold`, 1.0 s): the title sits alone before the first word.
- beat `loopOut` (~1.1) on "every IPv4": the fluid loop fades to the paper
  (0.6 s). The title stays, still, now on paper, so nothing moves behind
  the address when it arrives.
- beat `aAddr` (~2.6) on "32 bits": "192.168.10.42" writes on above the
  title (0.7 s), prose type, 110 px, white 92%, compact, centered at y 290.
  Box 640-1280 x 252-328, 102 px clear of the title. The title has had
  about 2.3 s undisturbed by then and stays readable until `titleOut`.
- beat `titleOut` (~3.8) on "That's it": title and subtitle fade out (0.5
  s). Title visible and still for about 3.5 s in all (8 words need 2.6 s).

### A: 32 bits, two parts  [1.1-17.7 final]
- `aAddr` (above) is this scene's first beat. Picture before name: the
  concrete address comes before "bits" is shown.
- beat `aSpread` (~4.9) on "The four numbers": the four octets slide apart
  (0.9 s, eased) to stand over the columns where their bits will go; the
  dots ride to the gap centers. Relate. Resting boxes: "192" 282-447, "168"
  658-823, "10" 1061-1171, "42" 1437-1547, dots at x 552, 928, 1304; all y
  252-328.
- beat `aBitsIn` (~8.0) on "way of writing": each octet grows its eight
  bits downward (grow from the cause): the digits fan out of the octet into
  their cells, one octet after the other, left to right, 0.35 s apart, 1.5
  s in all, so the build plays over "thirty two ones and zeros" and ends
  about as the sentence does. The decimal octets stay put. Bits: prose
  type, 52 px, white 92%, one digit per 40 px cell, row centered at y 440.
  - Strings: `11000000` `10101000` `00001010` `00101010`.
  - Group boxes: g1 204-524, g2 580-900, g3 956-1276, g4 1332-1652; all y
    422-458. Gaps 56 px, centered on the dots above.
- Hold 1 (1.0 s) after "ones and zeros": the finished bits sit in silence.
- beat `aDim` (~11.2, offset +0.55 so it lands on the heard words) on "And
  every address": decimal row dims to white 60% (0.4 s). Dim the rest.
- beat `aSplit` (~12.3) on "two parts": a divider draws top to bottom in
  the gap between g3 and g4: white 60%, 3 px, x 1304, y 405-475 (0.4 s).
  Grey on purpose: it has no name yet.
- beat `aNet` (~14.5) on "names the network": g1-g3 bits recolor to cyan,
  sweeping left to right (0.6 s); a cyan brace (3 px) draws under them,
  x 204-1276, y 480-510; "network" writes on under it, prose 48 px, cyan,
  centered (740, 555), box 660-820 x 537-573.
- beat `aHost` (~15.8) on "names the host": g4 bits recolor green; green
  brace x 1332-1652, y 480-510; "host", prose 48 px, green, centered (1492,
  555), box 1445-1540 x 537-573.
  - Second cue for cyan/green: the word labels and braces, network on the
    left.
- Hold 2 (1.0 s) after "on that network."
- Resting layout at the fullest beat (`aHost`):

  | Element | Box (x, y) |
  |---|---|
  | decimal row (white 60%) | 282-1547 x 252-328 |
  | bit row | 204-1652 x 422-458 |
  | divider (grey) | 1302-1306 x 405-475 |
  | network brace / label | 204-1276 x 480-510 / 660-820 x 537-573 |
  | host brace / label | 1332-1652 x 480-510 / 1445-1540 x 537-573 |

### B: The prefix  [17.9-39.7 final]
- beat `bCue` (~19.2) on "where that split" is: the divider turns amber
  and thickens to 5 px, reaching a little further, y 395-485 (0.4 s). Cue,
  then change.
- beat `bSlash` (~22.0) on "/24": "/24" writes on right after "42", prose
  110 px, amber, box 1555-1720 x 244-355 (the slash rises about 8 px above
  the digits and dips about 27 px below them). Color bridge: same amber as
  the divider.
- beat `bCidr` (~22.9) on "CIDR notation": "CIDR notation" writes on above
  the prefix, prose 44 px, white 92%, right-aligned to x 1720, box
  1440-1720 x 142-178. Picture, then name: the /24 is on screen first.
- beat `bNet24` (~25.6) on "first 24 bits": travel to the slot. A copy of
  the "24" lifts off "/24" and arcs down (0.9 s), shrinking from 110 to 44
  px and shifting amber to cyan on the way, landing under "network"; "
  bits" writes on after it. Result: "24 bits", prose 44 px, cyan, centered
  (740, 615), box 665-815 x 598-632. It crosses the bit row in flight
  (intended; nothing rests in its path).
- beat `bHost8` (~28.6) on "eight bits for hosts": "8 bits" writes on under
  "host", prose 44 px, green, centered (1492, 615), box 1437-1547 x 598-632.
- beat `bTake` (~30.2) on "Take 192": the decimal row brightens back to
  white 92%, left to right (0.5 s). The example is the subject again.
- beat `bNetDec` (~36.0) on "through the 10": "192.168.10" recolors cyan,
  left to right, and a cyan underline (3 px) draws beneath it, y 363-366,
  x 282-1171. Color bridge to the cyan bits right below.
- beat `bHostDec` (~37.6) on "42 is the" host: "42" recolors green and a
  green underline draws beneath it, y 363-366, x 1437-1547.
  - Second cue: the underlines, plus each octet standing over its labeled
    bits.
  - All underlines in this chapter sit on one line, y 363-366, clear of the
    slash's foot (bottom about y 355).
- Hold 3 (1.0 s) after "The 42 is the host."
- Resting layout at the fullest beat (`bHostDec`):

  | Element | Box (x, y) |
  |---|---|
  | "CIDR notation" | 1440-1720 x 142-178 |
  | decimal row + "/24" | 282-1720 x 244-355 |
  | underlines cyan / green | 282-1171 / 1437-1547, y 363-366 |
  | bit row | 204-1652 x 422-458 |
  | divider (amber) | 1301-1306 x 395-485 |
  | braces | 204-1276 and 1332-1652, y 480-510 |
  | "network" / "host" | 660-820 / 1445-1540, y 537-573 |
  | "24 bits" / "8 bits" | 665-815 / 1437-1547, y 598-632 |

### C: Different prefix  [39.9-65.6 final]
- beat `cCue` (~43.6) on "a different prefix": an amber underline (3 px)
  draws in under "/24", y 363-366, x 1565-1720, 18 px clear of the green
  underline under "42". It stays for the rest of the scene. Cue, then
  change.
- beat `cSlash16` (~47.0) on "/16": the "24" fades out as "16" fades in,
  in the same place (0.5 s); the slash and the amber underline don't move.
  Quiet on purpose: the digits aren't the insight, the divider is.
- beat `cClear` (~47.9) on "the split": the decimal row's cyan and green,
  and the cyan and green underlines, fade back to plain white 92% (0.3 s).
  The amber underline stays. The old reading no longer holds, so it clears
  before the new one is shown.
- **THE REVEAL**, beat `cReveal` (~48.2) on "moves" left: the amber divider
  slides from x 1304 to x 928 (1.8 s, slow ease, the one big move of the
  chapter). As it passes each bit of g3, right to left, that bit turns from
  cyan to green. The braces' inner ends travel with the divider (network
  brace shrinks to 204-900, host brace grows to 956-1652); "network" and
  "host" glide to their new centers (552 and 1304); the counts tick one bit
  at a time as the divider crosses each cell, ending "16 bits" / "16 bits".
  Everything that moves is attached to the divider, so the eye follows one
  thing.
  - Hold 4 (2.5 s) after "and the split moves left." The slide ends about
    1.4 s into the silence; the result then sits still for about 1.1 s,
    and the next sentence goes on describing that result.
- beat `cNet16` (~52.5) on "first two numbers": "192.168" recolors cyan and
  its underline draws, y 363-366, x 282-823.
- beat `cHost16` (~54.4) on "last two together": "10.42" recolors green and
  its underline draws, y 363-366, x 1061-1547. The address now carries
  three underlines on one line: network, host, prefix.
- beat `cNbr24` (~56.1 final) on "its neighbors": the neighbors block
  begins. "neighbors" fades in (prose 44 px, white 60%, right-aligned to x
  790) on the /24 row's baseline while the first row writes on beside it.
  Ghost of the original, first row: "/24  192.168.10.x", prose 52 px, all
  white 60%. The block is lifted 58 px from the design-space boxes below:
  it starts about 26 px below "16 bits".
- beat `cNbr16` (~57.1 final) on "changed completely": second row, 62 px
  below the first: "/16" amber, "192.168" cyan, ".x.x" with the x letters
  green and the dots white 92%, prose 52 px. As it writes on, "neighbors"
  glides down (0.45 s, eased) to sit centered between the two rows.
  Compare: the neighborhood grew from one third octet to every third octet.
  - Second cue: the x letters mark the host part that varies; network is
    on the left; the "neighbors" label.
- "An address without its prefix is only half the story" gets no new
  element: it plays over the fully assembled frame, which is the summary.
- Hold 5 (1.0 s) after "only half the story." The frame then keeps holding
  through "One more thing you'll see everywhere. Certain ranges".
- Resting layout at the fullest beat (`cNbr16`). The boxes below are the
  original design-space boxes, before the build's centering shift. As
  built (r3), scene C's content runs about y 234-817 in the 0-918 usable
  area; the neighbors block is lifted 58 px (rows 62 px apart, starting
  about 26 px below "16 bits", bottom at y 817), and "neighbors" sits
  centered between the rows.

  | Element | Box (x, y) |
  |---|---|
  | "CIDR notation" | 1440-1720 x 142-178 |
  | decimal row + "/16" | 282-1720 x 244-355 |
  | underlines cyan / green / amber | 282-823 / 1061-1547 / 1565-1720, y 363-366 |
  | bit row (g1-g2 cyan, g3-g4 green) | 204-1652 x 422-458 |
  | divider (amber) | 926-931 x 395-485 |
  | braces | 204-900 and 956-1652, y 480-510 |
  | "network" / "host" | 472-632 / 1257-1352, y 537-573 |
  | "16 bits" / "16 bits" | 477-627 / 1229-1379, y 598-632 |
  | "neighbors" | 600-790 x 752-788 |
  | row "/24 192.168.10.x" (ghost) | 830-1275 x 712-748 |
  | row "/16 192.168.x.x" | 830-1230 x 792-828 |

### D: Private ranges  [65.7-89.5 final]
- beat `dOut` (~69.3) at the end of "Certain ranges": the whole anchor
  slides out to the left and fades (0.5 s, shortened if the resolved gap to
  `dHead` is tighter).
- beat `dHead` (~69.9) on "private address space": "private address space"
  writes on, prose 64 px, white 92%, centered (960, 200), box 640-1280 x
  176-224.
- beat `dTen` (~71.7) on "starting with 10": row 1 writes on, left-aligned
  at x 260: "10.x.x.x", prose 64 px, digits and dots white 92%, x letters
  white 60% and upright (roman, not italic). Box 260-490 x 326-374.
- beat `d172a` (~73.5) on "172.16": row 2, first half: "172.16.x.x", box
  260-570 x 446-494.
- beat `d172b` (~75.2) on "172.31": row 2 completes: " – 172.31.x.x". Full
  row box 260-900 x 446-494.
- beat `d192` (~77.9) at the end of "everything starting with": row 3:
  "192.168.x.x", writing on as "one ninety two dot one sixty eight" is
  spoken. Box 260-600 x 566-614.
- beat `dNoRoute` (~80.6, offset +0.3 so it lands on the heard words) on
  "never route": a muted brace (white 60%, 3 px) and a line leaving its tip
  draw as one stroke (0.8 s): brace 940-970 x 326-614, line x 985-1425,
  y 469-471, heading right into open space. Relate: these three ranges,
  going somewhere.
- beat `dPublic` (~82.1) at the end of "public internet": where the line
  ends, a line-art cloud fades in (white 60%, 3 px stroke, box 1440-1600 x
  415-525) and "public internet" writes on under it, prose 48 px, white
  92%, box 1355-1685 x 557-593. The path is now complete.
- beat `dBlock` (~82.8) on "They're where" (+0.4): a red cross (DANGER, 6
  px strokes) lands on the middle of the line, box 1180-1240 x 440-500,
  blocking the path (the overlap is the point).
- beat `dNotRouted` (~83.2) on "your lab": "not routed" writes on above the
  cross, prose 44 px, red, box 1110-1310 x 374-410. Picture, then name:
  the cross blocks first, the word follows. Pass/fail gets the glyph plus
  the word.
- beat `dExample` (~86.6) on "examples in": grow from the cause. A copy of
  row 3 slides down to y 710 (0.5 s), box 260-600 x 686-734.
- beat `dMorph` (~87.3) at the end of "this module": in the copy, "x.x"
  crossfades in place into "10.42" (0.5 s, "192.168." holding still),
  giving "192.168.10.42", white 92%, box 260-660 x 686-734. The chapter's
  example is one member of the 192.168 range. It settles about 1.5 s
  before the tail fade.
- Resting layout at the fullest beat (`dMorph`):

  | Element | Box (x, y) |
  |---|---|
  | "private address space" | 640-1280 x 176-224 |
  | "10.x.x.x" | 260-490 x 326-374 |
  | "172.16.x.x – 172.31.x.x" | 260-900 x 446-494 |
  | "192.168.x.x" | 260-600 x 566-614 |
  | "192.168.10.42" | 260-660 x 686-734 |
  | brace | 940-970 x 326-614 |
  | line | 985-1425 x 469-471 |
  | red cross (on the line) / "not routed" | 1180-1240 x 440-500 / 1110-1310 x 374-410 |
  | cloud / "public internet" | 1440-1600 x 415-525 / 1355-1685 x 557-593 |

  Whole composition spans x 260-1685 (center 972).

### Tail  [89.5-90.8 final]
- beat `fadeOut` (~89.5), 0.7 s after the last word "they do": every
  foreground element fades out together (0.6 s). From ~90.1 to `end`
  (90.77) only the paper shows, clean frames for the editor's transition
  into chapter 2. No thank-you card.

## Holds

| Hold | Length | After the sentence | Serves |
|---|---|---|---|
| lead-in (`titleHold`) | 1.0 s | before "Every IPv4 address is thirty two bits." | the title reads alone first; it then stays through the first sentence |
| 1 (`hold1Bits`) | 1.0 s | "...a friendly way of writing thirty two ones and zeros." | the bits build (which plays over its own words) sits finished in silence |
| 2 (`hold2Parts`) | 1.0 s | "...the back part names the host on that network." | scene change; new labels "network", "host" |
| 3 (`hold3Reading`) | 1.0 s | "The forty two is the host." | scene change; the colored /24 reading sits before the prefix changes |
| 4 (`hold4Reveal`) | 2.5 s | "...and the split moves left." | the reveal finishes in silence, then its result sits |
| 5 (`hold5Story`) | 1.0 s | "An address without its prefix is only half the story." | scene change; the fullest frame (neighbors rows) reads |

The lead-in is not after a sentence: the narration starts 1.0 s into the
composition. It's written as `{"at": 0, "hold": 1.0}`; if the resolver
can't take a hold there, start the narration at 1.0 s and shift every beat.

## Background

Default throughout. Title: the dark fluid loop, showing at frame 0, fading
to the paper on "every IPv4" while the title stays, so the address never
writes on over moving texture. Scenes A-D and the tail: the dark paper,
still. The lightest paper under "not routed" measures gray 48 (red 4.62:1,
passes); the paper must not get any lighter there.

## Background proposal

(Round 3 proposal for the whole course. Not yet approved; the scenes above
still describe the current paper and fluid loop.)

**The system in one line.** There is one still, dark ground under every
lesson frame in the course, and the title is that same ground with slow,
soft light moving over it. Motion in the background means "a video is
beginning" (or ending, on the thank-you card). Stillness means "the lesson
is on". Every seam in the course is then the same ground with one layer
arriving or leaving: title to lesson, the end of one chapter to the title of
the next, and the last lesson frame to the thank-you card.

Shared rules for all options:
- Only white 92% and white 60% text ever sits on a title backdrop. Palette
  colors are measured against the lesson ground only, and red never
  appears on a title backdrop (it drops under 4.5:1 on the lighter title
  shapes; see the numbers below).
- Any tonal falloff must look perfectly smooth at full screen and in the
  800 px player: no visible steps, rings, or contour bands in the dark. A
  gradient that shows steps reads as a fault and pulls the eye.
- Any speckle or grain is frozen: the same in every frame, part of the
  surface. It never shimmers or crawls.

### 1. Lesson background: three options

All three are still. I'm not asking for even a near-imperceptible drift
in the lesson. The holds depend on a frame that is truly still (the
reveal's result "sits still for about 1.1 s"). Rule 18 bans decorative
drift. A slowly moving dark ground also tends to look like faint crawling
blotches in the dark areas, which sit exactly where the eye rests between
elements. The title already provides the course's motion, so the lesson
doesn't need any.

**L1: Charcoal, lit from the center** (recommended)
- What the viewer sees: a near-neutral charcoal with a slight cool cast,
  lightest where the diagram sits and darkening very gently toward the
  corners and the caption band, like a sheet lit by a lamp overhead. No
  visible texture at any size.
- Base tones: center #232427 (35,36,39), corners #18191B (24,25,27). The
  blue channel sits 3-4 levels above red, which is enough to keep it from
  looking brown on warm screens and not enough to read as blue.
- Falloff: an oval of light centered on the usable area, (960, 459), not
  on the frame, so the caption band sits on darker ground. The whole
  content area (about x 200-1720, y 110-830) stays within 3-4 levels of
  the center tone, so every element of the strip sits on the same ground.
  The darkening happens outside that area and reaches the corner value
  only at the frame corners: about 5 units of lightness in all, which you
  see only if you look at the corners.
- Grain: a single-pixel speckle, plus or minus 1 level. It isn't meant to
  be seen as texture. It is only there so the falloff looks smooth.
- Lightest pixel #242528 (36,37,40). Darkest pixel #17181A (23,24,26).
- Why it serves learning: the brightest ground is under the diagram, and
  the frame edges recede, so attention is drawn inward without anything
  being drawn. With no hue cast, cyan, green, amber and red read at their
  true hue, and without texture the thin serif strokes have nothing
  behind them. Every palette color gains contrast over the current paper
  (table below).

**L2: Slate, darkening downward**
- What the viewer sees: a flat, cool slate, dark blue-grey rather than
  grey, with one very gentle top-to-bottom darkening. No center light, no
  corners, no texture. The plainest of the three.
- Base tones: top edge #1E2025 (30,32,37), bottom edge #16181C (22,24,28),
  changing evenly down the frame. That is about 4 units of lightness from
  top to bottom.
- Grain: the same invisible single-pixel speckle as L1, plus or minus 1
  level, there only to keep the darkening smooth.
- Lightest pixel #1F2126 (31,33,38) at the top. Darkest pixel #15171B
  (21,23,27) at the bottom.
- Why it serves learning: it is the darkest option, so it gives every
  color the most contrast, and the darkest band sits under the captions,
  where it helps them most. The cost is the cool cast. Cyan (the "focus"
  color) sits closest to the ground's hue, so it stands out a little less
  than it does on a neutral ground, and the frame reads a little more
  "tech" and a little less "paper".

**L3: Graphite drawing paper**
- What the viewer sees: the course's paper idea, made for it. It is a
  uniform, faintly warm graphite with a fine, even paper tooth. There are
  no creases, folds, stains or large blotches: nothing with a shape. At
  full screen, up close, it reads as a matte sheet. In the 800 px player
  it reads as flat.
- Base tone: #222120 (34,33,32). It has only a slight edge falloff: 4
  levels darker at the corners, to #1E1D1C (30,29,28).
- Texture: a fine tooth 2-4 px across, plus or minus 3 levels, the same
  density everywhere, frozen.
- Lightest pixel #252423 (37,36,35). Darkest pixel #1B1A19 (27,26,25).
- Why it serves learning: it keeps the "written on paper" feel that suits
  the prose type being drawn on, while removing what competed in the
  current texture (creases and patches with shapes and edges, and
  lightness that wanders up to gray 48). The cost is that it is still a
  texture behind thin serif strokes at full screen, which is what the user
  asked to move away from, and in the player its tooth disappears, so it
  offers little over L1.

**Text contrast at each option's lightest pixel** (WCAG ratio; white
composited over that pixel; the current paper's lightest patch, gray 48,
for comparison):

| Color | L1 #242528 | L2 #1F2126 | L3 #252423 | Current paper, gray 48 |
|---|---|---|---|---|
| ACCENT #00C2FF | 7.41 | 7.79 | 7.50 | 6.39 |
| SUCCESS #3DD68C | 8.17 | 8.59 | 8.26 | 7.04 |
| WARNING #E8A13A | 7.01 | 7.36 | 7.08 | 6.03 |
| DANGER #FF6666 | 5.36 | 5.63 | 5.42 | 4.62 |
| white 92% | 13.2 | 13.8 | 13.3 | about 11.6 |
| white 60% | 6.43 | 6.63 | 6.48 | about 5.7 |

All three pass 1.4.3 AA for every palette color with margin. ACCENT,
SUCCESS and WARNING also reach AAA (7:1) on all three. Against the darkest
pixel, white 92% stays near 15:1, in line with Material's dark-theme
figures, so halation is no worse than a standard dark theme. None of the
grounds is pure black.

### 2. Title background: three options

Common to all three:
- The base is the chosen lesson ground itself, and the moving shapes sit
  over it. At frame 0 the backdrop is already in motion (it doesn't start
  from rest) and already in its standard starting position. Every video in
  the course opens on the same starting picture, a signature like the
  chapter-begins tone.
- A calm zone surrounds the title block: the title and subtitle boxes
  plus 60 px, about x 460-1460, y 370-650. Inside it the backdrop never
  gets more than about 4 levels lighter than the ground, and it changes by
  no more than 2-3 levels across the whole 2.4 s, so the words sit on a
  steady tone.
- Nothing is sharp. The words are the only crisp things in the title
  frame, so the eye has nothing else to lock onto.
- Speed: a shape travels 40-50 px (about 20 px/s) during the 2.4 s. That
  is enough to read as alive at full screen and still noticeable in the
  800 px player, but well short of reading as an object moving. The
  picture takes at least 60 s to repeat, so no loop can show in 2.4 s, or
  in a longer title card in the briefing.
- Handoff: at 2.4-3.0 s the moving shapes fade out on the same eased
  curve as the title and subtitle. The ground under them doesn't change,
  so the fade reads as the light leaving, and the frame at 3.0 s is
  exactly the lesson ground. Nothing new arrives before then (as now).
- Flashing: brightness changes only slowly. The largest change anywhere is
  the fade itself: one steady dimming of a dark area, by about 2% of full
  luminance, over 0.6 s. That is far below the flash threshold of a 10%
  change, and it doesn't reverse.

**T1: Slow light** (recommended, pairs with L1)
- What the viewer sees: two large, completely out-of-focus pools of deep
  colored light drifting slowly across the charcoal, like light seen
  through frosted glass or deep water. No edges, no texture, no highlights.
- Glow A, deep cyan: core #16354A (22,53,74), a soft oval about 1300 x 900
  px that fades into the ground across its whole radius. At frame 0 it is
  centered at about (300, 900), partly off the lower-left edge, and it
  drifts up and to the right at about 20 px/s.
- Glow B, deep indigo: core #1E2446 (30,36,70), about 1500 x 1000 px,
  centered at about (1650, 150), partly off the upper-right edge. It
  drifts down and to the left at about 15 px/s, on a slightly different
  heading. The two speeds read as depth; moving in lockstep would read as
  a camera pan.
- Each glow also widens or narrows by about 5% over 10 s, so the light
  seems to breathe in shape but never in brightness.
- The title block sits in the dim valley between them. Behind the text
  the backdrop is never lighter than #1E2A3A (30,42,58).
- Lightest pixel anywhere: #1E364C (30,54,76), where the cores are.
  Darkest: L1's corner, #17181A.
- Text contrast. White 92% gets 10.8:1 at the lightest pixel and about
  12.4:1 inside the calm zone. The white 60% subtitle gets 5.55:1 even if
  it sat on the lightest core, and about 6.2:1 where it actually sits. For
  the record, at the lightest core: ACCENT 6.02, SUCCESS 6.64, WARNING
  5.69, DANGER 4.35. That last figure fails, hence the "no red on a title
  backdrop" rule.
- Palette fit: deep shades of the accent family (cyan) and of the navy of
  the terminal panels. At this darkness they read as "the course's color",
  not as the cyan that means focus.

**T2: Slow folds** (pairs with L2)
- What the viewer sees: a course-made version of the look the user has
  already seen. Two or three broad, softly shaded bands, like folds of
  heavy dark silk, sweep in from the lower-left corner, with a smaller pair
  in the upper-right. They leave a clear diagonal channel of plain slate
  from upper left to lower right, and the title sits in it. There are no
  hairline edges, no fine hatching, and no glints: the stock loop's fine
  line texture is what to drop.
- Colors: shadowed undersides #0D1626 (13,22,38, the terminal panel's
  navy), body #142238 (20,34,56), rounded crests #1C2E48 (28,46,72). The
  transitions between them are soft, over 60-100 px.
- Motion: a slow swell travels along each band, the crest moving about 20
  px/s along the band's length. The bands' outlines barely change. The
  bands swell on 16, 21 and 27 s cycles, out of step, so the whole picture
  doesn't repeat for minutes. The bands stay at least 120 px from the text
  boxes.
- Lightest pixel #1C2E48 (28,46,72). Darkest #0D1626 (13,22,38), which is
  darker than the ground, in the folds' shadows, and not black.
- Text contrast at the lightest crest: white 92% about 11.2:1, white 60%
  about 6.0:1 (DANGER would be 4.79; the rule still applies).
- Trade-off: the most continuity with the pilot look, and the most "made"
  feel. But the folds have form, and form in the corner of the eye draws
  it more than formless light does, so the crests must stay this dim.

**T3: Drawn threads** (pairs with L3, or with L1)
- What the viewer sees: six long, smooth curves like threads in a slow
  current, spanning the width of the frame. Each is a gentle wave of one
  to one and a half wavelengths, drawn in the course's own line: the same
  kind of stroke as the braces, the divider, and the scene D path. Three
  sit above the title (y 120-330) and three below (y 690-860). None
  crosses the title block or enters the caption band. Each thread fades to
  nothing before it reaches the frame edge, so no line end ever shows.
- Colors and depth: the three nearer threads are deep cyan #22465A
  (34,70,90), 3 px, soft-edged. The three farther threads are #1A3440
  (26,52,64), 5 px, softer and slightly out of focus.
- Motion: a wave travels along each thread at about 25 px/s, with an
  amplitude of 20-30 px. The threads keep their spacing and never cross
  each other. They repeat after 60 s or more.
- The threads stay at least 80 px from the title and subtitle boxes.
- Lightest pixel #22465A (34,70,90). Darkest: the ground's darkest.
- Threads against the ground: about 1.5:1. That is intentionally below
  the 3:1 that meaningful lines need, so the threads read as setting, not
  as diagram.
- Trade-off: it previews the course's visual language, and it is the most
  distinctive of the three. It is also the riskiest. Fine lines in motion
  are the closest thing on screen to the serif strokes of the title, so
  they compete most for the eye. In the 800 px player they are also the
  most likely to shimmer or step.

### 3. Recommendation: L1 with T1

- **One ground, one light.** T1 is L1 with light drifting over it. The
  lesson's still center light has been under the glows the whole time, so
  the 2.4-3.0 s fade reads as the moving light settling into the still
  light, not as one picture replacing another. The same seam works at a
  chapter's end (the last frames show only L1) into the next chapter's
  title (L1 plus glows). It also works into the thank-you card: I propose
  that it use T1, fading in over L1, as a bookend.
- **Neutral, as asked.** L1 has no visible hue and no visible texture, so
  nothing competes with the diagram, and all four palette colors read at
  their true hue with more contrast than today (DANGER goes from 4.62 to
  5.36).
- **Nothing sharp behind the title.** T1 is the only option with no
  edges, lines, or forms at all, so the words are the only thing to read,
  and its motion still shows at player size.
- Second choice: L2 with T2, if the user prefers to keep the character of
  the current fluid title, with folds and a cooler lesson frame.

### 4. What would change in this shot list if we switch

- **Scenes, beats, boxes, colors, sizes, timings: nothing.** No choice in
  scenes A-D was tuned to the paper's texture. Every color was chosen on
  meaning and checked against the paper's lightest patch, and each new
  ground is darker than that patch, so every check gets easier.
- **Figures and wording that would be updated:**
  - Background: "the lightest paper under 'not routed' measures gray 48
    (red 4.62:1, passes); the paper must not get any lighter there" becomes
    red at 5.36:1 (L1), and the caveat goes away.
  - Checks, "Contrast (on the default paper)": figures per the table
    above.
  - Wording only: "fluid loop" becomes the title backdrop, and "paper" or
    "paper only" becomes the lesson ground. This affects the Title scene,
    the Tail, Background, Sound effect 1, and Question 1.
- **Slightly better, not changed:**
  - The "dim the rest" beats (the decimal row going to white 60%) read a
    little more recessed on a darker ground, which helps.
  - The amber divider, braces, underlines and cross gain contrast.
- **Title scene:** the layout stays as it is. T1's calm zone is designed
  around this chapter's title boxes (96 px title at y 430-510, 44 px
  subtitle at y 548-592), which I propose as the standard title position
  for the course.
- **Sound:** no change. The chapter-begins tone ("soft, airy") suits
  drifting light even better than it suits the fluid.
- **For later chapters, not this one:** the dark navy terminal panel
  (from the color brief) nearly disappears against the darker ground at
  the frame edges (about 1.0-1.2:1). Where a panel's edge matters, it will
  need a visible border, about 2 px at white 30-40%, or it should sit in
  the lit center. Chapter 1 has no panels.
- **Outside this shot list:** the playbook's Background line ("dark,
  slightly textured paper (about gray 40), with a slow dark fluid loop")
  would be rewritten to the chosen pair once the user approves.

### Questions for the build team (backgrounds)

1. L1's falloff: confirm it shows no steps or rings at full screen and in
   the 800 px player after final delivery. If the fine speckle can't keep
   it smooth, I'd rather have a flatter falloff (fewer levels between
   center and corner) than any visible grain.
2. T1 in the 800 px player: confirm the drift reads as "slightly moving"
   within 2.4 s. If it doesn't, raise the speed toward 30 px/s rather
   than making the glows brighter.
3. The 2.4-3.0 s fade: confirm the frame at 3.0 s is identical to the
   lesson ground, with no tone jump when the title layer ends.

### For the user

- Which pair: L1 with T1 (recommended), L2 with T2 (closest to the current
  look), or L3 with T3 (keeps the paper, adds drawn lines)?
- Should the thank-you card at the end of standalone videos use the title
  backdrop, as a bookend?

## Sound

Times are composition seconds from beats.json.

**Mood and arc.** Calm, patient, a little curious: the feel of reading
something carefully, not of being sold something. The chapter asks the
learner to look closely at one row of bits for most of its length, so the
bed stays low and even and never asks for attention. It has one lift, at
the reveal, so the ear confirms the one thing the eye must not miss.
- Title and scene A (0-17.9): the music starts with the title at frame 0
  and is the only sound for the 1.1 s lead-in, then tucks under the first
  word ("every IPv4", ~1.1). Even, unhurried, settled.
- Scene B (17.9-39.9): the same, steady. The prefix is careful counting;
  nothing in the music should suggest drama.
- Scene C up to the reveal (39.9-48.7): from "Here's the part people miss"
  the music leans forward slightly: a little more motion, a sense that
  something is about to change, still no louder.
- Hold 4 (48.67-51.17): the chapter's one opening-up (see below).
- Rest of scene C (51.2-65.7): settles back to the bed, a shade warmer than
  before, as the result is described.
- Scene D (65.7-89.5): lighter and more everyday. Private ranges are
  practical, familiar ground ("your lab, your office, and your home").
- Tail (89.5-90.77): thins out and stays open (see the end, below).

**Where it lifts or breathes.**
- Under the title (0-2.4): present from the first frame, gentle, carrying
  the title alone for about a second. It should feel like a door opening,
  not a fanfare, and step back under the voice without a bump.
- Holds 1, 2, 3 and 5 (1.0 s each, at 9.64, 16.86, 38.85, 64.74): the bed
  breathes. It simply carries on and is heard for a moment in the gap; no
  swell, no new phrase. These are pauses to look, not events.
- Hold 5 in particular turns the page to scene D: if the music has a
  natural phrase ending, let it fall here so D starts on a fresh phrase.
- **Hold 4, the reveal (48.67-51.17):** the one lift of the chapter. As
  "left" ends, the divider is still sliding; the music opens up (brighter,
  a little fuller, a change of harmony or a held, rising note) through the
  rest of the slide, and arrives as the divider comes to rest at about
  49.9. It then holds that open feeling over the still result for about a
  second and eases back under the voice at "Now only the first two
  numbers" (~51.2). It should feel like understanding, "oh, it moved", not
  triumph. Keep it modest: later chapters (subnetting) move this same
  divider for bigger stakes and need room to lift higher.

**Sound effects (two).** Neither falls under a spoken word.
1. `titleIn` (0), the chapter title appears over the fluid loop, in the
   lead-in before any narration. A single soft, airy tone, light in weight,
   with a short gentle tail (about a second), finished before the first
   word at ~1.1. Meaning: **a chapter begins.** It is the chapter's
   signpost, not a decoration of the text; every li-v6 chapter title should
   get this same sound and nothing else should.
2. `cReveal` landing (~49.9), inside hold 4: the amber divider finishes its
   slide and comes to rest at the new split. A soft, low glide that fades
   up from nothing only once "left" has ended (~48.7), then closes with a
   small, muted seat as the divider stops: felted and wooden, like a slider
   dropping into a notch. Low-to-medium weight, about 1.2 s in all, the
   seat the essential part. Meaning: **the boundary between network and
   host has moved.** Keep this sound for the divider only; in later
   chapters it plays whenever the divider settles at a new prefix, and for
   no other motion.

**Silent on purpose.**
- The bit build (`aBitsIn`), the recolors, braces, labels, underlines, and
  every write-on: routine entrances, all under speech.
- The "24" flight (`bNet24`): under speech; the arc carries it.
- `cSlash16`, the "24" to "16" swap: quiet on purpose in the picture, so
  quiet in sound too. The digits aren't the insight.
- The reveal's per-bit color changes and ticking counts: no ticks. Sixteen
  clicks would crowd the one slide the viewer should follow and land on
  "left".
- `dBlock`, the red cross: it lands under "They're where your lab", so it
  gets no sound; the cross and "not routed" carry it. (A "blocked" sound
  can be introduced in a later chapter where a block falls in silence.)
- `dOut`, the anchor leaving, and the tail fade: no whoosh. The music
  carries the scene change and the ending.

**The end, into chapter 2.** No closing cadence and no button. After "they
do" (~88.8) the music thins and sits on a held, open, slightly unresolved
sound through the fade and the paper-only frames, still faintly sounding
at 90.77, so the editor can carry it straight into chapter 2 rather than
the listener hearing a stop. Chapter 2 reopens on this same address strip
(the /24 host bits turning all zeros and all ones), so it should pick up
the same bed, same feel and key, as if the music had only paused for
breath. Leave chapter 2 to decide its own lift; this chapter's reveal
should stay the smaller one.

## Asset requests

None. The internet cloud is drawn from lines in the course style.

## Narration changes

None. Every beat lands on the words as recorded.

One listen-check, not a change: the transcript reads "it's why the the
examples", while the script has one "the". If the recording really repeats
the word, that line may want a retake; if it's a recognizer artifact,
nothing to do.

## Checks

- **Contrast (on the default paper):** text uses white 92%, white 60%,
  cyan, green, amber, and red, all at or above 4.5:1 on the paper per the
  color brief. White 60% is used only for secondary text (the dimmed
  decimal row, "neighbors", the ghost row, the x letters) and for the
  muted brace, line, and cloud. Red: "not routed" at 4.62:1 on the lightest
  patch under it (gray 48), passing thinly, backed by the cross glyph.
  Lines the viewer needs (divider, braces, underlines, cross, D line and
  cloud) are all 3 px or more, above 3:1.
- **Color never alone:** network/host always has the word labels and
  braces, network on the left; decimal colors have underlines and sit over
  their labeled bits; the neighbors rows have x letters for the host part;
  amber is always a written prefix, its underline, or the divider it names;
  red has the cross glyph and "not routed".
- **Sizes:** colored words at 44 px or more ("24 bits", "8 bits", "16
  bits", "not routed" at 44; "network", "host" at 48), so the serif's thin
  strokes stay at 2 px or more. Muted labels 44 px, address 110 px, bits
  52 px, D rows 64 px, title 96 px. Nothing is under 44 px. At an 800 px
  player, 44 px is about 18 px.
- **Caption band:** the lowest element anywhere is the /16 neighbors row,
  bottom at y 828; D's lowest is the example at y 734. Nothing below y 918.
- **Central 90%:** all content within x 96-1824 and y 54-918; widest is
  B/C at x 204-1720.
- **Overlaps:** checked per resting table above. Closest pairs: green
  underline end 1547 to amber underline start 1565 (18 px); underlines (y
  363) to the slash's foot (about y 355), 8 px; underlines to bit row, 56
  px; address (y 328) to title (y 430) in the title scene, 102 px; divider
  to brace ends 26 px each side; "not routed" bottom 410 to cross top 440.
  Intended overlaps: the traveling "24" in flight, and the red cross on the
  line.
- **One thing at a time:** every beat changes one element or one attached
  group. `cSlash16`, `cClear`, and the reveal are staggered; in D the
  stroke, the cloud, the cross, and "not routed" each land on their own
  beat (0.4-1.5 s apart). Two soft exceptions: "neighbors" fades in while
  its row writes on, and the address writes on above the still title.
  At `cNbr16`, "neighbors" glides to center (0.45 s) as the /16 row writes
  on; both belong to the one block.
- **Motion durations:** small changes 0.3-0.6 s, octet spread 0.9 s, the
  "24" flight 0.9 s, the D stroke 0.8 s, the reveal 1.8 s (the one slow
  move).
- **Flashing:** none. The counts tick about 7 times a second at the
  slide's fastest (small digits changing, no luminance flash); every
  intermediate frame is consistent.
- **Reading time:** title about 3.5 s visible and still (2.3 s alone); the
  final example about 1.5 s still before the fade, with the rows above it
  on screen for 10 s or more.
- **Picture before name:** the address before "bits", the /24 before "CIDR
  notation", the split before "prefix", the cross before "not routed". One
  exception in D (see Deviations).

## Deviations and additions (no visual brief was given)

- The neighbors block ("/24 192.168.10.x", "/16 192.168.x.x") shows values
  the narration doesn't speak. It is the picture for "the machine's idea of
  who its neighbors are just changed completely", and its x notation is
  reused in scene D's ranges.
- The x notation ("10.x.x.x") is not narrated; the narration says
  "anything starting with ten". It's the plainest way to print "starting
  with" as an address.
- The chapter's example address lands in the 192.168 row at the end, to
  make "why the examples look the way they do" visible.
- The ranges' CIDR forms are left off (user decision, round 1).
- "private address space" appears on its words before the rows it names,
  because the narration says the name first; the rows follow within 2 s.
- The bits hold is 1.0 s, not the playbook's 2-3 s for a key transform
  (user decision to trim, round 1). The build starts earlier, on "way of
  writing", so it plays over its own words and the silence holds the
  result.
- The title shares the frame with the first sentence (the address writes
  on above it) so the lead-in can be 1.0 s.
## Questions for the build team

1. The title scene: the fluid loop fades to paper on "every IPv4" while the
   title stays put, then the address writes on 102 px above the title.
   Confirm the title reads cleanly on the plain paper once the loop is gone.
2. `dBlock` and `dNotRouted` are timed from "They're where" (+0.4) and
   "your lab". If they resolve less than 0.4 s apart, set `dNotRouted` to
   `dBlock` + 0.4 s instead.
3. `dMorph` is the end of "this module". If that lands less than 0.5 s
   after `dExample` (the slide still moving), start the crossfade as the
   slide settles instead.
4. The 1.8 s reveal now starts on "moves", while "left" is still being
   spoken. Confirm `cClear` (on "the split", 0.3 s) finishes before it, and
   that the slide still ends inside the hold.
## Open for the user

Nothing from round 1. The three decisions (no CIDR forms on the ranges,
trim the holds, music added in post) are applied.

## Design log

- Round 0 (fresh design): shot list and beats.spec.json written from the
  narration and timed transcript only.
- Round 1 (build team findings, user decisions):
  - User 1, CIDR forms on the ranges: left off, as proposed.
  - User 2, length: holds trimmed from 11.5 s to 7.5 s. Kept the 2.5 s
    reveal hold and the three 1 s scene-change holds. Dropped the hold after
    the 192.168 range. Lead-in 3.0 to 1.0 s (the title now stays through
    the first sentence, item 7). Bits hold 2.0 to 1.0 s, with the build
    moved earlier to "way of writing" so it ends about as the sentence
    does. Total 94.77 to 90.77 s.
  - User 3, music: settled; no change to the design.
  - Item 4, the circle around "/24": accepted (a). An amber underline
    draws under "/24" on "a different prefix" and carries on under "/16".
    Because the prefix underline now arrives here, the old `cHalf` beat
    (the amber underline on "without its prefix") is gone; that sentence
    plays over the assembled frame.
  - Item 5, "/24" to "/16": accepted (a), a crossfade of the digits in
    place. The digit change isn't the insight, so it stays quiet.
  - Item 6, the blocked path: accepted (a) and reordered to picture before
    name. The brace and line draw as one stroke on "never route"; the
    cloud and "public internet" appear at the end of that sentence; the
    cross lands on the line and "not routed" follows, in the next
    sentence.
  - Item 7, title: chose the overlap. The loop fades to paper on the first
    word so the address never writes over moving texture; the address
    writes on above the still title on "32 bits"; the title fades on
    "That's it" (about 3.5 s still, 2.3 s alone).
  - Item 8: offsets +0.55 on `aDim` and +0.3 on `dNoRoute`, as given.
  - Item 9, the reveal's start: I want it on the word. With the circle gone,
    nothing has to leave first: `cClear` moves to "the split" and the slide
    (`cReveal`) starts on "moves", so it plays as "moves left" is said and
    finishes in the silence, with about 1.1 s of still result after.
  - Item 10: accepted; "neighbors" fades in while its row writes on.
  - Item 11, last frame: `dMorph` moves earlier to the end of "this
    module", and the fade starts 0.7 s after "they do" and lasts 0.6 s:
    about 1.5 s still, then about 0.7 s of paper only.
  - Item 12: accepted; the slide is now 1.8 s.
  - Item 13: every colored label is now 44 px or more.
  - Item 14: all three underlines lowered to y 363-366, one shared line
    clear of the slash's foot.
  - Item 15: asset request dropped; the line-art cloud is built.
  - Item 16: noted; the x letters are upright.
  - Red on gray 48 (4.62:1): accepted as a pass; noted under Background.
- Round 1 resolve (caller, 2026-09-24): dNotRouted landed 0.22 s after dBlock; added +0.18 offset per the designer's check, so it lands at dBlock + 0.4 s.
- Round 2, sound (2026-09-24): added `## Sound` after `## Background` (music bed arc, the hold 4 lift at 48.67-51.17, two effects at `titleIn` and the `cReveal` landing, an open ending for chapter 2). Nothing else in the design changed.
- Round 3, backgrounds (2026-09-24): added `## Background proposal` after `## Background`, a course-wide system with three still lesson grounds (L1 charcoal lit from the center, L2 slate darkening downward, L3 graphite drawing paper), three slow title backdrops (T1 slow light, T2 slow folds, T3 drawn threads), and a recommendation of L1 with T1. It is a proposal awaiting the user's choice; no scene, beat, box, color or timing changed.

- User decision (2026-09-24): the thank-you card uses the title backdrop, as a bookend. User picked L1 + T1 at 30 px/s (built: src/components/CourseBackdrop.tsx).
- Build note for the thank-you card (chapter 3): after about 3 s the title light drifts into the text zone (x 460-1460, y 370-650), lifting it 6.5 levels at 5 s and 10.6 at 10 s, over the designer's ~4-level limit. For a longer card, choose a short slice from frame 0, a different text position, or a generator path that curves the glows away from the center.

## Engine plan
(Build team only; the designer doesn't read this. Settled by the caller
with manim-builder and remotion-builder, 2026-09-24.)

| Element | Engine | Window (s) | Notes |
|---|---|---|---|
| Narration audio | Remotion | 0-90.77 | 6 `<Audio>` Sequences: starts at 1.0 (lead-in), then cuts at measured silence, narration time 8.433 / 15.167 / 35.767 / 45.000 / 58.600 (not the transcript's word ends, which clip "network", "left", "story"); 2-frame ramps; voice only |
| PaperBackdrop | Remotion | 0-90.77 | behind the `transparent` guard |
| Fluid loop (TransitionBackdrop) | Remotion | 0-~1.4 | fades to paper from `loopOut` (1.12), eased |
| Title text, scenes A-D, all words, the strip, the cloud (line art), the blocked path, the tail fade | Manim | 0-90.77 | one `BeatScene`, window (`titleIn`, `end`), `next_section()` per scene; Tex for all words (`px_tex`), nothing in mono (no commands in this chapter); `layout.json` for positions and sizes |
| Assets | none | | cloud drawn as line art (asset request dropped); no stock, no Blender |

Studio controls: the Manim layer's x, y, scale, start offset, and a
show/hide toggle; everything inside the layer is tuned in
`manim/li-v6-ch1/layout.json` with `scripts/manim-watch.sh` running.
Narration changes: none, so no new audio.
- Build review (user, 2026-09-24): move the strip scenes (A-C) down so each fullest frame centers in the usable area (bottom at least 40 px above y 918, one shift for A-C); move "CIDR notation" next to the prefix (just above it) instead of the top-right corner.
- Round 4 (glide) proposed, then withdrawn: the user kept r3's layout.
- Studio review (user, 2026-09-24): the title outlived its fluid loop (loop gone at 1.7 s, title until 4.3 s), so it sat alone on the paper. Title and loop now fade out together: loopOut = titleOut = 2.4 s, same 0.6 s eased fade; the address writes on after both are gone.
