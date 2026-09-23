---
name: scripts
description: Write the spec for every media item in an approved lab-first outline: narration and a visual brief for each micro-video and the briefing, a loop spec for each GIF, and a layout for each reference card, under courses/<slug>/scripts/NN-<lab-slug>/<media-id>.md. Use whenever the user wants narration, voiceover text, GIF specs, card layouts, or media scripts written or rewritten for a path or one lab, e.g. "/scripts linux-filesystem 3" or "redo the scripts for Lab 2". Stage 2 of the pipeline; it never generates audio.
argument-hint: <course-slug> [lab | first-last]
---

Write the media specs for a lab-first path. `$ARGUMENTS` is the course slug,
optionally followed by a lab number or inclusive range (`0` is Module 0:
the briefing). Follow `.claude/house-style.md`,
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
in the folder of the lab whose module step first uses it, since that's
where it's shown inline. The capstone has no media of its
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

**Word budget.** Budget words against speaking time, not clip length:
speaking time is `length` minus the 2 s end buffer minus about 1 s per scene
change (the hold `/video` makes there). Use 140 words per minute for an
embedded micro-video and 150 for the briefing. 160 is the ceiling (the DCMP
rate for adult educational captions, which inherit the narration's rate),
and the linter flags anything faster as FIX.

| `length` | Scene changes | Speaking time | Words |
|---|---|---|---|
| 30 s | 1 | 27 s | about 63 |
| 45 s | 1 | 42 s | about 98 |
| 60 s | 1 | 57 s | about 133 |
| 75 s | 1 | 72 s | about 168 |
| 90 s | 2 | 86 s | about 200 |
| Briefing 150 s | 4 | 144 s | about 360 |
| Briefing 180 s | 4 | 174 s | about 435 |

A spec stays under about 4,900 characters, a margin under eleven_v3's
5,000-character request limit; a briefing is about 2,400. Count before
saving. The platform profile's **Measured narration rate** replaces 140 or
150 once the path has an approved take.

**An embedded micro-video explains one surprise.** The learner has just
predicted and run something, and the result didn't match what they
expected. Explanation that builds on the learner's wrong answer is what
makes predict-then-watch work, so every micro-video follows five beats:

1. **Observe** (one sentence, in the first 6 s or so): restate what they
   just saw, over the redrawn output at frame 0. "The long listing says
   zero bytes, but the word count found thousands." This is also the one
   sentence of setup a learner who skipped the step needs, since every
   video is optional. Never a welcome, a title, or "in this video".
2. **Name the expectation** (one sentence): what most learners predicted
   and why that was reasonable. "If you expected the sizes to match, that's
   the right instinct for an ordinary file."
3. **Model** (about 60 to 70% of the words): the one mechanism behind the
   surprise, the mental model the lab needs next, built on screen in sync
   with at most one analogy.
4. **Payoff** (one or two sentences): replay the surprise through the
   model. "So the listing reports what's stored on disk, which is nothing,
   and the word count reads what the kernel generates on the spot."
5. **Hand back** (one sentence): a concrete next action in the lab ("head
   back and recreate the original"), with no closing line and no Thank You
   card.

It never re-teaches what a GIF or card already covers. **It never answers a
later predict prompt.** Read the outline's predict prompts that come after
this video in the same lab: the narration must not state or imply their
outcomes. The model equips the learner to make that prediction; stating
the answer takes away the attempt the method depends on.

**Standalone videos** (the briefing, and any video marked `standalone`) are
watched on their own. The briefing gives the path's mental models and the
supportive information from the outline's Module 0, in this order:

1. The title card, then one or two sentences on a real scenario that shows
   the stakes. No welcome.
2. One outlining sentence naming the three or four mental models, used
   once.
3. One scene per model. Each opens with a heading sentence that names the
   model and runs about 60 to 90 words, with the model's key term on screen
   as a keyword label.
4. A pointer to the reference card that holds the lookup material, which
   the labs show inline at the step that first needs it.
5. A hand-off naming the first thing the learner does in the first lab
   (the concept, not a lab number), then the close.

A standalone video ends with exactly: "Hope you found this helpful and I'd
like to thank you for watching." Its visual brief ends on the "Thank You for
Watching!" card. No teaser for another video.

**Writing for the ear.** Listeners get one pass. The voice and global-English
rules in `.claude/style-guide.md` apply (V1-V7, G2-G7); its "Narration
exemptions" replace the number, symbol, and formatting rules.
- Prose paragraphs only: no markdown, lists, or stage directions.
- One idea per sentence, in full clauses, usually 8 to 20 words and none
  over 25. Runs of short, comma-fragmented sentences come out choppy on
  eleven_v3 (word, word, pause), so write flowing sentences of normal
  length, not fragments.
- Front-load: the subject and the key term come early, with no clause over
  about five words before the subject ("When you, after creating the link,
  remove..." is out).
- Repeat the key term; never cycle synonyms (G5). Repetition is how a
  listener tracks the idea. Signpost with plain transitions ("First",
  "Now", "So", "That's why"), and use at most one outlining sentence per
  video.
- Say what a command does before its syntax, and speak the syntax only when
  it is the lesson. The learner just typed it and the lab page shows it, so
  "the long listing" usually beats "L S dash L". When the syntax is spoken,
  say it the way it's spoken and put the exact form in the visual brief:
  "run chmod plus x on the file" with `chmod +x hello.sh` on screen; "run
  Get Service with the Name parameter" for `Get-Service -Name spooler`;
  "show I P route" for `show ip route`.
- Spoken forms, written this way in the narration and matched in the
  caption map:

  | On screen | In the narration |
  |---|---|
  | Flags `-l`, `-R`, `--all` | "dash L", "dash capital R", "dash dash all" |
  | Symbols `\|`, `~`, `>`, `$` | "pipe", "tilde", "greater-than", "dollar sign"; better, the meaning ("redirect it into a file") |
  | A path | its role ("the hostname file"); only when the path is the lesson, once, phonetically ("slash et cetera slash hostname") |
  | An IP address | its role ("the gateway address"), digits on screen; when the digits matter, "one ninety-two dot zero dot two dot ten" |
  | Ports and versions | "port four forty-three", "twenty-four oh four" |
  | Octal modes | digit by digit, "seven five zero" (each digit is one permission group) |
  | Keys | "Control C", "the Tab key" |
  | Any other number | words, as the voice should say them; round when exactness isn't the point |

- Rewrite around heteronyms the voice can misread: read, live, lead,
  record, object, content, close, minute, invalid, wind, tear. For a
  platform word with two spoken forms ("route", "cache", "char", `etc`),
  pick one per path and put it in the phonetic list.
- Model-neutral text only: no SSML (`<break>`), no bracketed audio tags
  ("[pause]", "[slows down]"), no inline IPA, no ellipses, and no capitals
  for emphasis (capitals add stress). Spell out an acronym with spaces
  ("D N S") unless it is on the path's acronym list in the platform
  profile. Pronunciation lives in respellings, which work on every model.
- Use the TTS phonetic list in CLAUDE.md's platform profile for every
  mention (`ss` becomes "ess ess", `sh` becomes "S H"). When a retake
  exposes a new one, add it to the list.
- Keep `courses/<slug>/caption-map.json` in step with the phonetic list and
  the spoken forms: an object of spoken form to real syntax (`{"ess ess":
  "ss"}`). Caption text comes from this narration with the map applied, so
  a spoken form with no entry shows up in the captions as spoken.
- Leave paths, registry keys, URLs, and long identifiers out of narration;
  describe the location ("the system log directory") and show the string on
  screen.
- Start a new paragraph at each scene change. Paragraph breaks are the only
  pauses in the audio, and `/video` splits the narration there for a hold
  of about 1 s; don't ask for pauses anywhere else.

**Teaching voice.** Conversational, direct, second person. One idea per
paragraph. Explain like an expert teacher talking to someone new to this
concept. For a hard concept, a real-world scenario that shows why it matters
beats an abstract warning.

**Visual briefs.**
- Quote the narration phrase each visual beat syncs to, in order. `/video`
  times the beats from those phrases, and each highlight lands on the first
  word of its quoted phrase. One highlight at a time.
- The screen shows what the narration can't say well (the command, the
  output, the diagram); the narration explains why. Never put a narration
  sentence on screen, and never have the narration read a whole on-screen
  string aloud.
- On-screen words other than terminal content are keyword labels of one to
  four words, placed beside what they name. At most one verdict pill per
  scene.
- Integrated description: every on-screen fact the explanation depends on
  (a value, a highlight, what connects to what, a check or cross verdict) is
  named in the narration by its meaning, not read verbatim. "The listing
  reports zero bytes" covers the whole `ls -l` line on screen. This is how
  the videos meet WCAG 1.2.5 with no separate audio description or
  transcript, so a beat with an unspoken label, value, or verdict is a miss.
- An embedded video opens on content at frame 0 (the output the learner just
  saw, redrawn), not on a title card; the lab page already shows the title.
  A standalone video opens on its title card.
- Use patterns the repo already renders well: terminal or console type-on
  (any prompt), line-by-line code or config builds, before/after contrasts,
  check and cross comparisons, stacked-layer diagrams (directory entry,
  inode, data blocks). See CLAUDE.md "Style & motion conventions".
- GUI-heavy topics still get motion graphics: diagram the concept instead of
  redrawing dialogs.
- One or two scenes, one focal element at a time, centered. No music, and
  nothing flashes more than three times in any one second.

**Before saving,** run the unslop pass over each narration body. Its "Course
content" exceptions matter: the standalone closing line stays, and the
spoken command forms above win over its compression rule. Visual briefs are
out of scope.

## GIF

No narration and no audio. The outline still calls it a GIF, but it is
delivered as a muted, looping MP4 with player controls and a PNG poster of
the finished state (CLAUDE.md "GIFs"), so it can be paused. The body is one
`## Loop spec` section that `/video` builds from directly:

```markdown
## Loop spec

- **Shows:** <the mechanic, in one sentence: typing `cd /us` and pressing Tab>
- **Length:** <5-15 s total, including the hold>
- **Canvas:** 1280x720, flat dark background (no texture)
- **Beats (seconds):**
  - 0.0 empty prompt `labuser@lab:~$ ` with cursor
  - 0.5 type `cd /us` (about 12 characters per second)
  - 1.4 key badge "Tab" appears under the cursor
  - 1.6 line completes to `cd /usr/`
  - 2.0-5.5 hold the finished line so it can be read
  - 5.5-6.0 fade back to the empty prompt (frame 0 again)
- **Text on screen:** <every string, copy-accurate, with the platform prompt>
- **Alt text:** <every key pressed and the visible result: Typing cd /us and
  pressing Tab completes the line to cd /usr/>
- **Loop point:** the last frame matches frame 0
```

Rules: show mechanics only (where to click, what to type, how to read one
dense line), never explanation. Keep keystrokes and output copy-accurate on
the platform baseline. Key presses that print nothing (Tab, Enter, Ctrl+C)
get a small labeled badge so a silent loop still shows them.
- **Hold** the finished state 1.5 s plus 0.3 s per word of new text the
  learner has to read, and at least 3 s for a dense-line read (an `ls -l`
  decode). The hold's first frame is the poster.
- **Alt text** becomes the player's `aria-label`: it names every key pressed
  and the visible result, in under about 155 characters, and never starts
  with "GIF of" or "Video of" (F9). Every `Text on screen` string except the
  prompt appears in it; a string too long for it (a full output line) is
  marked `(step text)` in `Text on screen`, and `/lab` puts it in the step
  text instead.
- **No flashing:** nothing flashes more than three times in any one second.
  A cursor blinking at about once a second is fine.

## Reference card

A static image for lookup, shown inline at the module step that first
needs it, with a text version under it built from this layout. The body is
one `## Card layout` section:

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
