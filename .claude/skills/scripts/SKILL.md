---
name: scripts
description: Write the spec for every media item in an approved lab-first outline: narration and a visual brief for each micro-video and the briefing, a loop spec for each GIF, and a layout for each reference card, under courses/<slug>/scripts/NN-<lab-slug>/<media-id>.md. Use whenever the user wants narration, voiceover text, GIF specs, card layouts, or media scripts written or rewritten for a path or one lab, e.g. "/scripts linux-filesystem 3" or "redo the scripts for Lab 2". Stage 2 of the pipeline; it never generates audio.
argument-hint: <course-slug> [lab | first-last]
---

Write the media specs for a lab-first path. `$ARGUMENTS` is the course slug,
optionally followed by a lab number or inclusive range (`0` is Module 0: the
briefing and any cards introduced there). Follow `.claude/house-style.md`,
including the repo check, and its "Lab-first design" section: each item's
job depends on where it sits in the lab.

Read `courses/<slug>/outline.md` first. If its frontmatter still says
`status: draft`, point that out and ask the user to confirm it's approved
before writing anything. Every media item in the outline has an ID
(`lf-l3-v1`, `lf-l1-g1`, `lf-card-fhs-map`, `lf-briefing`); write one file
per ID in range, and nothing the outline doesn't list.

**Research first.** Each lab has one brief at
`courses/<slug>/research/NN-<lab-slug>.md` (see "Research briefs" in
`.claude/house-style.md`), shared with `/lab`. For each lab that needs one,
launch the `researcher` agent in `lab` mode, all in one message when there
are several. Verified syntax, defaults, and output shapes go into the visual
briefs, loop specs, and cards; the brief's misconceptions sharpen what each
micro-video explains. If the brief contradicts the approved outline on
scope, write the spec as outlined and raise the conflict in your report.

When the specs are written, run the `script-linter` agent on the slug and
range and, in parallel, `prose-checker` on the video and card files. Fix
their BLOCKING and FIX findings and include any remaining NOTEs in your
report. Then stop. The user reviews the specs before `/audio`, because every
generated minute of narration costs ElevenLabs credits.

## Files

```
courses/<slug>/scripts/NN-<lab-slug>/<media-id>.md
```

NN is the zero-padded lab number (`00-briefing/` for Module 0). A card lives
in the folder of the lab that introduces it. The capstone has no media of its
own, so it gets no folder.

Frontmatter, shared by every type:

```markdown
---
id: lf-l3-v1
type: video          # video | briefing | gif | card
lab: 3
title: Names, Inodes, and Data
folder: lf-l3-v1     # audio lands in public/chapters/<folder>/; same as id
length: 90           # target seconds (video, briefing, gif); omit for a card
optional: false      # the lab labels optional videos as such
standalone: false    # true: published on its own; gets an article and the video close
follows: "Step 2, the predict step: which cat works after rm original.txt?"
---
```

`follows` names the step the item sits beside, in the learner's words, so
the narration can start from what the learner just did. `standalone` is true
for the briefing and for any video the outline marks as published on its
own; everything else is embedded in a lab.

The body depends on the type.

## Video and briefing

Narration above `## Visual brief`, exactly as for the voice to read, then the
brief. `scripts/generate-audio.mjs` sends everything above the heading to
ElevenLabs.

```markdown
<Narration as plain prose paragraphs, only words to be spoken.>

## Visual brief

<The motion-graphics spec, per beat.>
```

**Length.** About 140 words per minute. A micro-video (30-90 s) is roughly
70-210 words; aim at the `length` the outline gives. The briefing (about 2-3
minutes) is roughly 280-420 words. Each file stays under 2,900 characters,
the eleven_v3 per-request limit. Count before saving.

**An embedded micro-video explains one surprise.** The learner has just
predicted and run something, and the result didn't match what they expected.
The video:

- opens on what they just saw ("That `ls -l` said zero bytes, but `wc`
  counted thousands"), never on a welcome, a title, or "in this video";
- explains the one idea behind it, with the mental model the lab needs next;
- ends by handing back to the lab ("head back and recreate the original"),
  with no closing line and no Thank You card;
- works for a learner who skipped the predict step, since every video is
  optional: one sentence of setup is enough;
- never re-teaches what a GIF or card already covers.

**Standalone videos** (the briefing, and any video marked `standalone`) are
watched on their own. The briefing gives the path's mental models, the
supportive information from the outline's Module 0, and hands off to Lab 1.
A standalone video ends with exactly: "Hope you found this helpful and I'd
like to thank you for watching." Its visual brief ends on the "Thank You for
Watching!" card. No teaser for another video.

**Writing for TTS.**
- Prose paragraphs only: no markdown, lists, stage directions, or "[pause]".
- Write flowing sentences of normal length. Runs of short, comma-fragmented
  sentences come out choppy on eleven_v3 (word, word, pause).
- Say commands the way they're spoken and put the exact syntax in the visual
  brief: "run chmod plus x on the file" with `chmod +x hello.sh` on screen;
  "run Get Service with the Name parameter" for `Get-Service -Name spooler`;
  "show I P route" for `show ip route`. Punctuation-heavy strings get mangled.
- Use the TTS phonetic list in CLAUDE.md's platform profile for every
  mention (`ss` becomes "ess ess", `sh` becomes "S H"). When a retake exposes
  a new one, add it to the list.
- Keep `courses/<slug>/caption-map.json` in step with the phonetic list: an
  object of spoken form to real syntax (`{"ess ess": "ss"}`). Captions are
  built from the audio, and the map puts the real syntax back on screen.
- Leave paths, registry keys, URLs, and long identifiers out of narration;
  describe the location ("the system log directory") and show the string on
  screen. Speak a path only when the path is the lesson, and then say it
  once, phonetically ("et cetera slash resolv dot conf").

**Teaching voice.** Conversational, direct, second person. One idea per
paragraph. Explain like an expert teacher talking to someone new to this
concept. For a hard concept, a real-world scenario that shows why it matters
beats an abstract warning.

**Visual briefs.**
- Quote the narration phrase each visual beat syncs to, in order. `/video`
  times the beats from those phrases.
- An embedded video opens on content at frame 0 (the output the learner just
  saw, redrawn), not on a title card; the lab page already shows the title.
  A standalone video opens on its title card.
- Use patterns the repo already renders well: terminal or console type-on
  (any prompt), line-by-line code or config builds, before/after contrasts,
  check and cross comparisons, stacked-layer diagrams (directory entry,
  inode, data blocks). See CLAUDE.md "Style & motion conventions".
- GUI-heavy topics still get motion graphics: diagram the concept instead of
  redrawing dialogs.
- One or two scenes, one focal element at a time, centered.

**Before saving,** run the unslop pass over each narration body. Its "Course
content" exceptions matter: the standalone closing line stays, and the
spoken command forms above win over its compression rule. Visual briefs are
out of scope.

## GIF

No narration and no audio. The body is one `## Loop spec` section that
`/video` builds from directly:

```markdown
## Loop spec

- **Shows:** <the mechanic, in one sentence: typing `cd /us` and pressing Tab>
- **Length:** <5-15 s total, including the hold>
- **Canvas:** 1280x720, flat dark background (no texture; it bloats the file)
- **Beats (seconds):**
  - 0.0 empty prompt `labuser@lab:~$ ` with cursor
  - 0.5 type `cd /us` (about 12 characters per second)
  - 1.4 key badge "Tab" appears under the cursor
  - 1.6 line completes to `cd /usr/`
  - 2.0-5.5 hold the finished line so it can be read
  - 5.5-6.0 fade back to the empty prompt (frame 0 again)
- **Text on screen:** <every string, copy-accurate, with the platform prompt>
- **Loop point:** the last frame matches frame 0
```

Rules: show mechanics only (where to click, what to type, how to read one
dense line), never explanation. Keep keystrokes and output copy-accurate on
the platform baseline. Hold the finished state long enough to read, at least
1.5 s. Key presses that print nothing (Tab, Enter, Ctrl+C) get a small
labeled badge so a silent loop still shows them.

## Reference card

A static image the lab pins for lookup. The body is one `## Card layout`
section:

```markdown
## Card layout

- **Title:** <card title as shown>
- **Canvas:** 1920x1080, flat dark background, readable at half size
- **Content:** <the exact table, map, or diagram: every label, value, and
  line of syntax as it appears on the card>
- **Emphasis:** <what stands out, e.g. the octal column in accent color>
```

Rules: only what learners look up again and again; no sentences where a
label will do; every value copy-accurate. The card's text is learner-facing,
so it follows house style (no em dashes, no emojis), but short labels and
table fragments are fine.
