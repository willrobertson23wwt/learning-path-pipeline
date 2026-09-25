# li-v6-ch1 shot list, hand-drawn style (chapter 1, "Addresses and Prefixes")

**Vision:** the learner sees an address as one hand-written row of 32 bits
with a gold fence post standing in it: everything left of the post is the
network, everything right is the host, the number after the slash says
where the post stands, and when the post moves, the machine's idea of who
its neighbors are moves with it.

**Anchor:** the strip, drawn once in scene A and kept through C. The
decimal address is lettered big, its 32 bits are lettered beneath their
four numbers, a divider stands in the bit row carrying two hand signs,
"← network" and "host →", and a small doodled computer sits at the left
end of the bit row: the machine that reads those bits. In C the same
machine gets a thought bubble. Scene D is a fresh sheet: a hand-drawn
enclosure of private address space, with a path out of it that is crossed
off before it reaches the internet cloud.

**Reveal:** `cReveal`, on "moves left", through hold 4. "/24" has just
been rubbed out and re-lettered "/16" inside a gold circle, and the old
reading has been wiped off. The gold divider then slides left across the
third octet (1.8 s, the one slow move in the chapter), its two signs
riding with it, and each bit it passes is gone over in orange. The
narration stops for 2.4 s: the slide ends 1.3 s into the silence and the
result sits still for 1.1 s. The address digits never change.

Times: "narr" is the transcript's time; "final" adds the 1.0 s lead-in and
the holds before it (6.3 s of holds, 7.3 s in all). Final times are
estimates; the resolved beats.json is authoritative. Composition length:
**90.34 s** (it assumes the proposed hold 6; 89.34 s without it).

## Slide or redraw: the rule this chapter uses

The user asked whether changing pieces should move or be erased and
redrawn. The answer, per beat, is in each beat below. The rule behind it:

- **Slide** only what the narration says moves and what the eye must
  follow as one thing: the divider in the reveal ("the split moves left"),
  with the two signs it carries. Nothing else in the chapter slides.
- **Re-color sweep** (gone over with a second marker, in the direction of
  the cause) when the same marks take on a new role: the divider being
  named gold, the bits becoming network or host, the third octet's bits
  turning to host behind the moving divider.
- **Erase and re-letter** when a value or a reading changes: "24" becomes
  "16" in place; the underlines and bit counts of the /24 reading are
  wiped and re-drawn for /16, each on the words that describe it. A person
  at a board would do exactly this, and redrawing lands each new piece on
  its own phrase instead of all at once.
- **Keep and add** when before and after are the lesson: the machine's old
  idea stays in its bubble in ghost gray, and the new idea is written
  under it.
- **Wipe the sheet** when the idea changes: once between C and D, and once
  at the tail.

## Scenes

| Scene | Final time (s) | What the viewer sees |
|---|---|---|
| Title | 0-4.4 | "Addresses and Prefixes" hand-lettered over the title light; it leaves with the light on "That's it" |
| A: 32 bits, two parts | 4.97-17.22 | the address written out spread wide, its bits written under it, a computer doodle beside the bits, a split drawn in, the two sides colored and signed |
| B: The prefix | 17.44-38.55 | the split turns gold, "/24" is written on, "CIDR notation" noted above it, bit counts written, the decimal numbers underlined network and host |
| C: Different prefix | 38.77-64.29 | "/24" is circled and re-lettered "/16", the old reading is wiped, the divider slides left (reveal), the /16 reading is drawn, the machine thinks about its neighbors; then the sheet is wiped |
| D: Private ranges | 64.54-89.04 | an enclosure is drawn and named private address space, the three ranges written inside, a path out is crossed off before the internet cloud, a lab, an office and a home drawn inside, the chapter's address written under its range |
| Tail | 89.04-90.34 | the sheet is wiped; clean ground only |

### Title  [0-4.4 final]
- beat `titleIn` (0): on the title light (two soft pools of blue and
  indigo drifting slowly), "Addresses and Prefixes" letters itself on,
  left to right, 0.0-0.8 s. Hand lettering, headline cap 70, main marker,
  centered, box 520-1400 x 450-520.
- beat `titleSub` (0.8): "Chapter 1 · Addressing and Subnetting" letters
  on beneath it, 0.8-1.2 s (the middle dot is a drawn dot). Cap 34,
  secondary, centered, box 580-1340 x 570-604.
- Lead-in (`titleHold`, 1.0 s): the title draws itself in the silence
  before the first word, so the lead-in has something happening in it.
- "Every IPv4 address is thirty two bits" is spoken over the finished
  title. Title complete and still from 1.2 to 3.8 s (2.6 s; 8 words need
  2.4 s).
- beat `titleOut` (3.80) on "That's it": title, subtitle and the title
  light fade out together (0.6 s, eased), leaving the still navy sheet.
  Nothing new is drawn until they have gone (4.4); the sheet is clean for
  0.57 s.
- Slide or redraw: neither; the title and its light leave as one, per the
  playbook's "text never outlives its background".

### A: 32 bits, two parts  [4.97-17.22 final]
- beat `aAddr` (4.97) on "The four numbers": the address is written left
  to right, number by number, already spread out over where its bits will
  go, the way a teacher leaves room under a number: "192", dot, "168",
  dot, "10", dot, "42" (1.5 s; the three dots arrive as "separated by
  dots" is said). Picture before name: the concrete address is on the
  sheet before "bits" are shown. Hand lettering, cap 70, main marker.
  Boxes: "192" 452-584, "168" 800-932, "10" 1170-1258, "42" 1518-1606, all
  y 220-290; dots about 12 px round at x 692, 1040, 1388, y 278-290.
  - Slide or redraw: written in its final spread position, so the octets
    never have to slide apart (the previous design slid them; in this
    medium the hand plans the spacing instead).
- beat `aBits` (7.24) on "way of writing": under each number, its eight
  bits are written left to right, one group after another, 0.5 s a group,
  2.0 s in all, finishing just before "zeros" ends. Grow from the cause:
  each group starts right under its number. Hand lettering, cap 44, main
  marker, 36 px per digit cell; the 1s are a single clean stroke and the
  0s a closed oval, so the two can't be confused at player size.
  - Strings: `11000000` `10101000` `00001010` `00101010`.
  - Group boxes: g1 374-662, g2 722-1010, g3 1070-1358, g4 1418-1706, all
    y 366-410. Gap centers at x 692, 1040, 1388, right under the dots.
- Hold 1 (`hold1Machine`, 1.1 s) after "thirty two ones and zeros.":
  **doodle 1, the machine.** In the silence, a small computer is drawn at
  the left end of the bit row, facing it (0.8 s): the monitor outline,
  then its stand and foot, then "01" lettered small on its screen. Main
  marker for the outline, secondary for "01" (cap 28). Box 214-324 x
  340-436 (monitor 214-324 x 340-414). Why it teaches: the numbers above
  are the friendly form for people; the row beside the computer is what
  the machine actually holds. It is also the machine whose idea of its
  neighbors changes in scene C. The frame then sits still for 0.3 s.
- beat `aSplit` (11.84) on "splits into two parts": a vertical line draws
  top to bottom through the bit row in the gap between g3 and g4 (0.35
  s). Secondary color, 5 px, x 1388, y 342-434. Lavender on purpose: the
  split has no name yet.
- beat `aNetSweep` (13.61) on "The front part": g1-g3 are gone over in
  blue, left to right, as if with a second marker (0.4 s). Re-color sweep:
  same digits, new role.
- beat `aNetLabel` (14.02) on "names the network": a short blue arrow
  pointing left, then "network", is lettered just left of the divider,
  under the bits (0.6 s). String "← network", cap 40, blue, right-aligned
  to x 1366, box 1129-1366 x 452-492. It hangs off the divider like a
  sign on a fence post: everything this way is network.
- beat `aHostSweep` (15.17) on "the back part": g4 is gone over in orange,
  left to right (0.3 s).
- beat `aHostLabel` (15.66) on "names the host": "host" then a short
  orange arrow pointing right, lettered just right of the divider (0.5 s).
  String "host →", cap 40, orange, left-aligned at x 1410, box 1410-1572 x
  452-492.
  - Second cue for blue/orange: the words and their arrows, and fixed
    position (network left of the post, host right).
- Hold 2 (`hold2Parts`, 0.4 s) after "the host on that network.": a still
  breath at the scene change.
- Resting layout at the fullest beat (`aHostLabel`):

  | Element | Box (x, y) |
  |---|---|
  | machine doodle | 214-324 x 340-436 |
  | decimal row with dots | 452-1606 x 220-290 |
  | bits (g1-g3 blue, g4 orange) | 374-1706 x 366-410 |
  | divider (secondary, 5 px) | 1385-1391 x 342-434 |
  | "← network" (blue) | 1129-1366 x 452-492 |
  | "host →" (orange) | 1410-1572 x 452-492 |

### B: The prefix  [17.44-38.55 final]
- beat `bCue` (18.90) on "where that split": the divider is gone over in
  gold, top to bottom, and thickens to 8 px, reaching a little further,
  y 338-440 (0.4 s). Cue, then change; re-color sweep. From here on gold
  means "the prefix and the split it sets".
- beat `bSlash` (21.52) on "/24", from "ends in /24" +0.45 s: "/24" is
  lettered right after "42", gold, cap 70 (0.45 s). Box 1640-1770 x
  210-300 (the slash rises about 10 px above the digits and dips about 10
  px below). Color bridge: the same gold as the divider.
- beat `bCidr` (22.61) on "CIDR notation": "CIDR notation" is lettered
  just above the prefix, right-aligned to it, cap 34, secondary (0.8 s).
  Box 1510-1770 x 140-174. Picture, then name: the /24 is on the sheet
  first.
- beat `bNet24` (24.58) on "first 24 bits": "24 bits" is lettered under
  "← network", right-aligned with it (0.5 s): "24" in gold, "bits" in
  secondary, cap 34. Box 1219-1366 x 512-546. The gold "24" is the same
  number as the "/24" above, so the color says "this is the prefix,
  counted as bits". (Replaces the previous design's flying "24": drawn
  marks don't fly in this medium; the matching gold number does the job.)
- beat `bHost8` (28.02) on "eight bits for hosts": "8 bits" is lettered
  under "host →", cap 34, all secondary (0.45 s). Box 1410-1536 x 512-546.
  Not gold: the 8 is what the prefix leaves over, not the prefix.
- "Take 192.168.10.42/24" (29.7-34.3 final): nothing new is drawn. The
  narrator reads out exactly what is on the sheet.
- beat `bNetDec` (35.65) on "through the 10": a blue marker underline,
  slightly wavy, draws left to right under "192 . 168 . 10" (0.6 s). Box
  452-1258 x 304-316. Color bridge to the blue bits right below.
- beat `bHostDec` (37.14) on "42 is the host": an orange underline draws
  under "42" (0.3 s). Box 1518-1606 x 304-316.
  - Second cue: each underlined number stands directly over its signed,
    colored bits.
- Hold 3 (`hold3Reading`, 0.4 s) after "The forty two is the host.": a
  still breath at the scene change.
- Resting layout at the fullest beat (`bHostDec`):

  | Element | Box (x, y) |
  |---|---|
  | "CIDR notation" (secondary) | 1510-1770 x 140-174 |
  | decimal row + "/24" (gold) | 452-1770 x 210-300 |
  | underlines blue / orange | 452-1258 / 1518-1606, y 304-316 |
  | machine doodle | 214-324 x 340-436 |
  | bits | 374-1706 x 366-410 |
  | divider (gold, 8 px) | 1384-1392 x 338-440 |
  | "← network" / "host →" | 1129-1366 / 1410-1572, y 452-492 |
  | "24 bits" / "8 bits" | 1219-1366 / 1410-1536, y 512-546 |

### C: Different prefix  [38.77-64.29 final]
- "Here's the part people miss." plays over the finished B frame.
- beat `cCue` (41.58) on "a different prefix": a gold circle, one loose
  stroke, is drawn around "/24" (0.5 s). Box 1622-1790 x 198-312. It
  stays for the rest of the scene. Cue, then change.
- beat `cSlash16` (45.63) on "to /16": the "24" is rubbed out (its strokes
  fade left to right, 0.2 s), then "16" is lettered in the same place,
  gold, cap 70 (0.45 s). The slash and the circle don't move.
  - Slide or redraw: **erase and re-letter.** A value changed; the circle
    keeps the identity ("this is still the prefix"). Quiet on purpose: the
    digits aren't the insight, the divider is.
- beat `cClear` (46.50) on "and the split": the /24 reading is wiped off:
  the blue and orange underlines and the two bit counts fade out together
  (0.3 s). The signs "← network" and "host →" stay; they belong to the
  divider and are still true on either side of it.
  - Slide or redraw: **erase**, before the move, so nothing wrong is ever
    on the sheet while the divider travels.
- **THE REVEAL**, beat `cReveal` (46.99) on "moves left": the gold divider
  slides from x 1388 to x 1040 (1.8 s, quick start, long slow settle), the
  two signs riding with it at the same spacing. As it passes each bit of
  g3, right to left, that bit is gone over in orange, so the orange follows
  the post like a trail. Everything that moves is attached to the divider:
  the eye follows one thing.
  - Slide or redraw: **slide.** This is the one move in the chapter. The
    narration says "moves", and the learner must see the same post travel
    to its new place; erasing it and redrawing it would show a before and
    an after but not the moving, which is the idea later chapters build on.
  - Hold 4 (`hold4Reveal`, 2.4 s) after "and the split moves left.": the
    slide ends 1.3 s into the silence, then the result sits still for 1.1
    s. The one sound effect lands as the divider comes to rest.
- beat `cNet16` (50.96) on "first two numbers": a blue underline draws
  under "192 . 168" (0.5 s). Box 452-932 x 304-316.
- beat `cNetCount` (51.85) on "name the network": "16 bits" is lettered
  under "← network" ("16" gold, "bits" secondary, cap 34, 0.5 s). Box
  871-1018 x 512-546.
- beat `cHost16` (53.36) on "last two together": an orange underline draws
  under "10 . 42" (0.5 s). Box 1170-1606 x 304-316.
- beat `cHostCount` (54.11) on "name the host": "16 bits" is lettered under
  "host →" (all secondary, cap 34, 0.5 s). Box 1062-1209 x 512-546.
  - Slide or redraw for these four: **redraw**, one piece per phrase, the
    same kinds of marks as in B, in their new places.
- "Nothing about the address changed," plays over the still strip: the
  digits the viewer has been looking at since scene A are visibly
  untouched.
- beat `cBubble` (57.08) on "but the machine's": **doodle 2, the machine's
  idea.** Three small circles rise from the computer's lower right,
  smallest first, then a lumpy thought-bubble outline draws below and to
  the right of it (0.7 s). Main marker, 4 px. Circles within 292-394 x
  462-604; bubble 420-960 x 620-846. Grow from the cause: the idea comes
  out of the machine.
- beat `cNbr24` (57.84) on "idea of who": inside the bubble, the first row
  is written, all in ghost gray (1.0 s): "/24  192.168.10.x". Cap 40. Box
  470-895 x 668-708. Ghost of the original: this is what the machine
  thought its neighbors were.
- beat `cNbr16` (59.05) on "just changed": the second row is written under
  it (1.0 s): "/16  192.168.x.x", cap 40, with "/16" gold, "192.168" blue,
  the dots main marker and each "x" orange. Box 470-870 x 752-792.
  Compare: the neighborhood grew from one value of the third number to
  every value of the last two.
  - Slide or redraw: **keep and add.** The old idea stays, grayed, above
    the new one, so the change can be read at a glance.
  - Second cues: each row starts with its prefix; the x letters mark the
    part that varies (the host); network is on the left.
- "An address without its prefix is only half the story." plays over the
  finished frame (60.2-63.3 final): the summary, nothing new drawn.
- Hold 5 (`hold5Story`, 1.0 s) after "only half the story.": the frame
  sits still for 0.3 s, then beat `cWipe` (63.59): the whole drawing is
  wiped off in a soft left-to-right sweep, like a board cleared with one
  pass of a wide cloth (0.6 s). The ground itself doesn't change. The
  narrator starts the next topic on a clean sheet.
- Resting layout at the fullest beat (`cNbr16`):

  | Element | Box (x, y) |
  |---|---|
  | "CIDR notation" (secondary) | 1510-1770 x 140-174 |
  | decimal row + "/16" (gold) | 452-1770 x 210-300 |
  | gold circle | 1622-1790 x 198-312 |
  | underlines blue / orange | 452-932 / 1170-1606, y 304-316 |
  | machine doodle | 214-324 x 340-436 |
  | bits (g1-g2 blue, g3-g4 orange) | 374-1706 x 366-410 |
  | divider (gold, 8 px) | 1036-1044 x 338-440 |
  | "← network" / "host →" | 781-1018 / 1062-1224, y 452-492 |
  | "16 bits" / "16 bits" | 871-1018 / 1062-1209, y 512-546 |
  | bubble circles | 292-394 x 462-604 |
  | bubble | 420-960 x 620-846 |
  | row "/24  192.168.10.x" (ghost) | 470-895 x 668-708 |
  | row "/16  192.168.x.x" | 470-870 x 752-792 |

  The divider now stands directly under the dot between "168" and "10",
  so the decimal split and the bit split visibly line up.

### D: Private ranges  [64.54-89.04 final]
- "One more thing you'll see everywhere." is spoken over the clean sheet
  (64.5-67.2 final). See Questions for the user.
- beat `dLoop` (67.18) on "Certain ranges": **doodle 3, the private
  space.** A large, slightly lumpy rounded enclosure is drawn in one
  clockwise stroke from its top left (1.0 s). Main marker, 5 px. Box
  150-1170 x 110-870. Picture before name: a fenced-off area, which the
  next words call reserved.
- beat `dHead` (68.48) on "private address space": "private address
  space" is lettered along the inside top of the enclosure (0.9 s).
  Headline cap 56, main marker, box 230-850 x 160-216.
- beat `dTen` (70.57) on "10", from "starting with 10" +0.45 s: row 1 is
  written: "10.x.x.x" (0.5 s). Cap 48; digits and dots main marker, the x
  letters secondary. Box 230-450 x 280-328.
- beat `d172a` (72.50) on "172.16", from "from 172.16" +0.2 s: row 2,
  first half: "172.16.x.x" (0.7 s). Box 230-530 x 380-428.
- beat `d172b` (73.71) on "through 172.31": row 2 completes with a drawn
  dash and "172.31.x.x" (0.9 s). Full row "172.16.x.x – 172.31.x.x", box
  230-880 x 380-428.
- beat `d192` (76.99) on "192.168", from "starting with 192.168" +0.75 s:
  row 3: "192.168.x.x" (0.8 s). Box 230-560 x 480-528.
- beat `dArrow` (78.62) on "These never": **doodle 4, the way out.** A
  tall curly brace draws down the right of the three rows and, in the same
  stroke, an arrow leaves its tip heading right, out through the
  enclosure's edge (1.0 s). Main marker, 5 px. Brace 905-945 x 280-528;
  arrow 950-1400 x 392-416. Relate: these three ranges, trying to go
  somewhere.
- beat `dCross` (79.62) on "never route": a red cross, two quick 8 px
  strokes, lands on the arrow just outside the enclosure (0.35 s), then
  "no route" is lettered above it in red (0.5 s). Cross 1220-1280 x
  375-435 (on the arrow: the overlap is the point); "no route" cap 34, box
  1195-1325 x 316-350. Pass/fail: glyph plus word.
- beat `dCloud` (80.49) on "public internet" +0.2 s: **doodle 5, the
  public internet.** A cloud outline draws just beyond the arrow's tip
  (0.6 s), then "public internet" is lettered under it (0.6 s). Cloud main
  marker, 5 px, box 1440-1700 x 330-480; label cap 34, secondary, box
  1455-1690 x 505-539. The arrow stops 40 px short of the cloud: it never
  gets there.
- Hold 6 (`hold6Blocked`, 1.0 s, **new, to be measured**) after "on the
  public internet.": the label finishes 0.66 s into the silence and the
  blocked path sits for about 0.35 s before the next sentence moves the
  eye back inside the enclosure. Without it, the lab doodle would start
  while "public internet" is still being lettered.
- beats `dLab` (82.99, on "lab"), `dOffice` (83.54, on "office"), `dHome`
  (84.21, on "home network"): **doodle 6, where they live.** Three small
  line doodles are drawn inside the enclosure along its bottom, left to
  right, each on its word (about 0.5 s each), outline first, then details.
  Main marker, 4-5 px, all standing on one baseline at y 810, with no
  labels (the narrator names each as it is drawn).
  - lab: a server rack, a tall box with four slot lines and a small dot
    beside each. Box 280-370 x 680-810.
  - office: a tall building, outline then a 2 x 4 grid of small windows.
    Box 550-670 x 640-810.
  - home: a house, square body, pitched roof, a door. Box 840-1000 x
    680-810.
  They sit inside the same line the arrow couldn't get past: that is the
  picture of "private".
- beat `dExample` (86.73) on "examples in this module": the chapter's
  address comes home. Under row 3, a small secondary hook arrow, then
  "192.168.10.42" is lettered, main marker, cap 48 (0.9 s), with its
  "192.168." directly under row 3's "192.168.". Hook 250-290 x 560-600;
  address 300-690 x 568-616. It reads as one member of the row above.
  - Slide or redraw: **written fresh**, not copied down (the previous
    design slid a copy and morphed its x's; here the hand simply writes
    the example under its range).
- Resting layout at the fullest beat (`dExample`):

  | Element | Box (x, y) |
  |---|---|
  | enclosure | 150-1170 x 110-870 |
  | "private address space" | 230-850 x 160-216 |
  | "10.x.x.x" | 230-450 x 280-328 |
  | "172.16.x.x – 172.31.x.x" | 230-880 x 380-428 |
  | "192.168.x.x" | 230-560 x 480-528 |
  | hook + "192.168.10.42" | 250-690 x 560-616 |
  | brace / arrow | 905-945 x 280-528 / 950-1400 x 392-416 |
  | red cross (on the arrow) / "no route" | 1220-1280 x 375-435 / 1195-1325 x 316-350 |
  | cloud / "public internet" | 1440-1700 x 330-480 / 1455-1690 x 505-539 |
  | lab / office / home | 280-370 / 550-670 / 840-1000, y 640-810 |

  The whole drawing spans x 150-1700. The empty lower right is deliberate
  open ground on the "outside".

### Tail  [89.04-90.34 final]
- beat `tailWipe` (89.04), 0.6 s after the last word "do": the same
  left-to-right wipe as `cWipe` (0.6 s). From 89.64 to `end` (90.34) only
  the clean navy ground shows, for the editor's transition into chapter
  2. No thank-you card. The finished D frame is complete and still for
  1.4 s before the wipe.

## Holds

| Hold | Length | After the sentence | What happens in it |
|---|---|---|---|
| lead-in (`titleHold`) | 1.0 s | before "Every IPv4 address is thirty two bits." | the title letters itself on (0-1.2 s) |
| 1 (`hold1Machine`) | 1.1 s | "...a friendly way of writing thirty two ones and zeros." | doodle 1, the computer, is drawn beside the finished bits (0.8 s), then 0.3 s still |
| 2 (`hold2Parts`) | 0.4 s | "...the back part names the host on that network." | still breath at the A to B change |
| 3 (`hold3Reading`) | 0.4 s | "The forty two is the host." | still breath at the B to C change |
| 4 (`hold4Reveal`) | 2.4 s | "Change that slash twenty four to slash sixteen and the split moves left." | the reveal's slide finishes (1.3 s), then the result sits (1.1 s); the one sound effect |
| 5 (`hold5Story`) | 1.0 s | "An address without its prefix is only half the story." | 0.3 s still on the full C frame, then the sheet wipe (0.6 s) |
| 6 (`hold6Blocked`), new | 1.0 s | "These never route on the public internet." | "public internet" finishes lettering, then the blocked path sits |

Holds 2 and 3 are shorter than the previous version's 1.0 s because
nothing is drawn in them (the playbook's still-frame breath). Holds 1 and
5 stay near 1 s because something is being drawn in them. Hold 6 is new:
please measure it. The lead-in is `{"at": 0, "hold": 1.0}` as before.

## Background

The style brief's grounds, unchanged. Title: the navy ground with the two
drifting pools of blue and indigo light, which fade out with the title on
"That's it". Scenes A-D and the tail: the still navy sheet, lightest
behind the drawing, with its fine still grain. The wipes clear the
drawing only; the ground never moves or changes tone.

## Sound

The approved sound stands. Changes and confirmations only:
- The music bed starts as the title leaves (`titleOut`, 3.80 final); the
  soft swell sits under the title as it letters itself on.
- The one effect stays on the divider coming to rest after the reveal,
  now at about 48.79 final (the slide starts on "moves left" at 46.99 and
  runs 1.8 s), inside hold 4 (47.48-49.88).
- No drawing sounds: no marker squeaks or scratches under the lettering.
  They would run under almost every spoken phrase and compete with the
  voice.
- The two wipes (`cWipe`, `tailWipe`) and the red cross are silent; the
  bed carries them. At hold 5 the wipe falls where a music phrase can end,
  so D can start on a fresh phrase.
- The new hold 6 needs nothing special: the bed simply carries on for a
  second.

## Asset requests

None. Every doodle (computer, thought bubble, enclosure, brace and arrow,
cross, cloud, rack, office, house) is simple marker line art drawn in the
chapter's own stroke.

## Narration changes

None. Every beat lands on the words as recorded.

Listen check, not a change: the transcript reads "why the the examples".
If the recording really doubles the word, the user may want to hear it
before approving; `dExample` is timed on "examples in this module" either
way.

## Checks

- **Contrast** (on the navy ground's lightest patch, behind the drawing):
  - Text in main marker, secondary, blue, orange, gold and red must each
    be at or above 4.5:1; the brief says the roles were measured on this
    ground. The one role I'm using as text that the brief doesn't mark as
    text is ghost gray, in the bubble's "/24  192.168.10.x" row. If ghost
    gray is under 4.5:1 there, that row uses secondary with a single
    horizontal strike through it as the "superseded" cue.
  - Lines the viewer needs (divider, circle, underlines, bubble, enclosure,
    brace, arrow, cross, cloud, building doodles) are 4-8 px, above 3:1.
  - Only main marker and secondary sit on the title light.
  - Red appears only in D, with its cross and the words "no route"; there
    is no orange in D, so red never shares a frame with orange.
- **Color never alone:** blue/orange always carry the signs "← network" and
  "host →" and their side of the divider (network left); decimal
  underlines stand over their signed bits; the bubble rows carry their
  prefix and x letters; gold is always the prefix, its circle, its counted
  "24"/"16", or the divider it sets; red has the cross and "no route".
- **Sizes (cap heights):** title 70, subtitle 34; decimal row and prefix
  70; bits 44; signs 40; counts 34; "CIDR notation" 34; bubble rows 40;
  D heading 56, D rows and example 48; "no route" and "public internet" 34;
  "01" on the computer's screen 28 (a doodle detail, nothing to read). Nothing
  under 26.
- **Caption band:** lowest content is the D enclosure, bottom y 870;
  in C, the bubble, bottom y 846. Nothing below y 918; both at least 40 px
  clear of it.
- **Central 90%:** everything within x 96-1824, y 54-918. Widest: the
  strip, x 214-1790.
- **Overlaps (closest pairs):** "CIDR notation" bottom 174 to the circle
  top 198 (24 px); gold divider bottom 440 to the signs 452 (12 px);
  counts bottom 546 to the bubble top 620; bubble circles to "← network"
  (after the slide) more than 380 px; the divider after the slide stands
  under the dot at x 1040, 48 px below it; orange underline end 1606 to
  the circle, over 70 px at that height; "no route" 25 px right of the
  enclosure edge. Intended overlaps: the red cross on the arrow, and the
  sliding signs passing under g3 (nothing else is there during the slide).
- **One thing at a time:** every beat draws or changes one element or one
  attached group; sub-steps inside a beat (erase then re-letter, outline
  then details, cross then word) run one after another. The reveal moves
  one attached group (divider, signs, and the orange trail behind it).
- **Durations:** writing at about the pace of speech; doodles 0.5-1.0 s;
  small marks 0.2-0.5 s; the enclosure 1.0 s; the one slow move, the
  slide, 1.8 s.
- **Stillness and flashing:** drawings are still once drawn; no wobble,
  boil or idle motion. Nothing flashes. The wipes are single soft sweeps.
- **Reading time:** title complete and still 2.6 s; the C frame complete
  and still 3.5 s before its wipe (two bubble rows, 32 characters, need
  about 2.5 s); the D frame complete and still 1.4 s before the tail, with
  everything but the example on screen 5 s or more.
- **Picture before name:** the address before "bits"; the split before
  "prefix"; "/24" before "CIDR notation"; the enclosure before "private
  address space"; the cross before "no route".

## Questions for the build team

1. The reveal: the gold divider slides 348 px left, its two signs riding
   along at a fixed spacing, while each g3 bit it passes is re-colored
   orange. Confirm the orange arrives bit by bit as the post passes, like
   a trail, and not as one fade over the whole octet.
2. `cSlash16`: the "24" rubbed out left to right, then "16" lettered in its
   place inside the circle. If a rub-out can't look like erasing, a quick
   0.2 s fade of the "24" is fine; the re-lettering should still write on.
3. The wipes: a soft left-to-right sweep that clears the drawing as it
   passes, 0.6 s. If a sweep would show an edge or streak, a plain 0.6 s
   fade of the drawing is the fallback; the ground must not change either
   way.
4. The thought bubble: three draws in about 3 s (`cBubble` 0.7 s, the ghost
   row 1.0 s, the new row 1.0 s). Confirm each finishes before the next
   starts at these beats.
5. Hand lettering of the bits: confirm 1s and 0s stay unmistakable at cap
   44 in the 800 px player (about 18 px there), and that the 32 digits sit
   on one steady baseline, wandering like a hand but not bouncing.
6. Ghost gray as text: measure the "/24  192.168.10.x" row against the
   lightest ground behind the bubble; below 4.5:1, use the fallback in
   Checks.
7. `dCross` then "no route" then `dCloud`: they resolve 0.2 s apart at the
   seams. If the lettering of "no route" isn't finished when the cloud
   starts, start the cloud when it finishes.
8. Two literal times in beats.spec.json depend on the holds: `cWipe`
   (63.59) is meant as hold 5's start + 0.3 s, and `end` (90.34) as
   `tailWipe` + 1.3 s. If any hold resolves to a different length, or hold
   6 is dropped, move them to match.

## Questions for the user

1. **The clean sheet before D.** As designed, the sheet is wiped in hold 5
   and "One more thing you'll see everywhere." is spoken over empty ground
   (about 2.6 s), with the enclosure starting on "Certain ranges". The
   alternative is to keep the full C frame through that sentence and wipe
   on "Certain" (the previous version's timing). I recommend the clean
   sheet: the fresh page is the signal of a new topic.
2. **The computer arriving in silence.** It is drawn in hold 1, right after
   the bits, and isn't named until "the machine's" in C, 45 s later. The
   alternative is to draw it only in C, on "but the machine's", which
   crowds that sentence (computer, bubble, two rows in 3 s). I recommend
   hold 1.
3. **Hold 6** (1.0 s after "These never route on the public internet.") is
   new and needs measuring. Without it, cut the cloud's label to a fade and
   the chapter is 1.0 s shorter.
4. **Holds 2 and 3** drop from 1.0 s to 0.4 s because nothing is drawn in
   them. If you liked the longer breaths at those scene changes, they can
   go back to 1.0 s with no other change.

## Design log

- Round 0, hand-drawn style (2026-09-25): fresh shot list for the recorded
  narration in the style brief's look (marker line art and hand lettering
  on navy, spot colors blue/orange/gold, doodles, sheet wipes). Kept from
  the approved version: the strip with a movable divider, the /24 to /16
  slide as the reveal, the neighbors comparison, the private ranges with a
  blocked path, the example landing in its range. Changed for the medium:
  octets written already spread (no spread slide); braces replaced by two
  signs that ride the divider; the flying "24" replaced by a gold "24"
  count; "/24" circled, rubbed out and re-lettered; the /24 reading wiped
  before the slide and redrawn after it; doodles added (the machine in
  hold 1, its thought bubble holding the neighbors rows, the private
  enclosure, the crossed-off path, the internet cloud, a lab, an office and
  a home); a sheet wipe at C to D and at the tail. Holds resized to what is
  drawn in them (1.1 / 0.4 / 0.4 / 2.4 / 1.0), one new hold proposed
  (hold 6, 1.0 s). Composition 90.34 s.
- Build, 2026-09-25 (main thread, after the user approved round 0 as is):
  - Hold 4 built at **1.6 s, not 2.4 s**. A hold is added to the voice's own
    sentence break, which after "left." is already 0.8 s (measured gap
    47.754-50.162), so 2.4 s would have left the finished slide sitting
    still 2.2 s. At 1.6 s the silence is 2.4 s and the result sits about
    1.4 s, the intent above. Everything after it moved 0.8 s earlier; end
    89.67 s (2690 frames). `cWipe` and `end` literal times moved with it.
  - Five beat phrases were trimmed so a beat never reuses the previous
    beat's words (the resolver searches forward): same start or end words,
    so no time moved.
  - The lettering measured 15-60% wider than the boxes above (lowercase
    most), so it is condensed to 86% width, and the gold circle, the brace,
    the cross and "no route", and the thought bubble are placed from
    measured widths. Sizes are as designed.
  - Stills review: scenes A-C sit 45 px lower and D 35 px higher (vertical
    balance); "CIDR" lettered upright (a slanted I read "C/DR"); the
    example address starts directly under row 3 with the hook in the
    margin; the arrow keeps its head short of the cloud as designed.
