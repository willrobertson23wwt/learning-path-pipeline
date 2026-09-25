---
name: scripts
description: Write the per-chapter narration scripts for an approved traditional outline, each with a visual brief for the hand-drawn video designer, plus the chapter 0 intro narration every video opens with, under courses/<slug>/scripts/NN-<video-slug>/MM-<chapter-slug>.md. Use whenever the user wants narration, voiceover text, or chapter scripts written or rewritten for a path or one video, e.g. "/scripts linux-intermediate 3" or "redo the scripts for the arrays video". Stage 2 of the pipeline; it never generates audio.
argument-hint: <course-slug> [video | first-last]
---

Write the chapter scripts for a traditional path. `$ARGUMENTS` is the
course slug, optionally followed by a video number or inclusive range
(`/scripts linux-intermediate`, `... 3`, `... 21-24`; `0` is the path's
intro video). Follow `.claude/house-style.md`, including the repo check in
"Where content lives", and its "Traditional course design" section: a
video teaches one capability, and each chapter covers one beat of it.

Read `courses/<slug>/outline.md` first. If its frontmatter still says
`status: draft`, point that out and ask the user to confirm it's approved
before writing anything. Every video in range gets one file per chapter the
outline lists, plus a chapter 0 (`00-intro.md`); write nothing the outline
doesn't list. If something in the outline is unclear (a chapter's scope, a
length, whether the path has an intro or review video), ask, and say what
you would otherwise assume.

The first time you use a pipeline term with the user, explain it in a plain
sentence: a **chapter 0** is the short narration that plays over the
user's own intro footage; a **visual brief** is your suggestion of what the
viewer sees, which the video designer may use or set aside; a **hold** is
a pause the video build cuts into the narration so a picture can land.

If a chapter in range already has `public/chapters/<folder>/narration.mp3`,
say so before rewriting it: changing its narration means a new take, and
ElevenLabs usage is limited (see `/audio`).

**Research first.** Each module has one brief,
`courses/<slug>/research/module-N-<module-slug>.md` (N is the module
number), shared with `/lab` for that module's closing lab (see "Research
briefs" in `.claude/house-style.md`). For each module in range that needs
one, launch the `researcher` agent in `module` mode, all in one message when
there are several. Verified syntax, defaults, and output shapes go into the
visual briefs exactly; the brief's misconceptions and common mistakes
sharpen what each chapter explains and give it its concrete failure stories.
If the brief contradicts the approved outline on scope, write the chapter
as outlined and raise the conflict in your report. The path intro needs no
research; the review video reuses the module briefs.

When the scripts are written, run the `script-linter` agent on the slug and
range and, in parallel, `prose-checker` on the saved files. Fix their
BLOCKING and FIX findings and include any remaining NOTEs in your report.
Then stop. The user reviews and edits the scripts before `/audio`, because
every generated minute of narration costs ElevenLabs credits.

## Files

```
courses/<slug>/scripts/NN-<video-slug>/00-intro.md
courses/<slug>/scripts/NN-<video-slug>/MM-<chapter-slug>.md
courses/<slug>/scripts/00-path-intro/01-full.md      # the path intro video, if the outline has one
courses/<slug>/scripts/NN-review/01-full.md          # the review video, if the outline has one
```

NN is the video's global number, zero-padded (`01-functions-and-return-values/`);
MM is the chapter's number within the video (`03-return-values-done-right.md`).
Slugs come from the outline's video and chapter titles.

Frontmatter drives `scripts/generate-audio.mjs` (it selects by `video` and
writes to `folder`):

```markdown
---
video: 1
chapter: 3
title: Return Values Done Right
folder: li-v1-ch3     # audio lands in public/chapters/<folder>/narration.mp3
---
```

`folder` is the chapter ID from the outline, with the video number
unpadded:

| File | `chapter` | `title` | `folder` |
|---|---|---|---|
| A video's chapter M | M | the outline's chapter title | `<prefix>-vN-chM` |
| A video's `00-intro.md` | 0 | `Intro` | `<prefix>-vN-intro` |
| The path intro (`video: 0`) | 1 | the outline's title | `<prefix>-intro` |
| The review video | 1 | the outline's title | `<prefix>-review` |

The prefix comes from the outline's frontmatter. The same ID names the
chapter's audio folder, its composition (`<Prefix>V<N>Ch<M>`), and its
deliverable, so it must match the outline exactly. The path intro and the
review video are one chapter each and get no chapter 0.

The body is the narration, exactly as the voice should read it, then the
brief. `generate-audio.mjs` sends everything above the heading to
ElevenLabs, and `captions.mjs` builds the captions from the same text.

```markdown
<Narration as plain prose paragraphs, only words to be spoken.>

## Visual brief

<What the viewer sees, per narration phrase.>
```

## Word budget

A chapter's outline length (`#### 1.3 Return Values Done Right (~110 s narration)`)
is its narration time, the time the voice speaks. Budget words from it at
140 words per minute, or the platform profile's **Measured narration rate**
once the path has an approved take: 110 s is about 255 words. 160 wpm is the
ceiling (the DCMP rate for adult educational captions, which inherit the
narration's rate), and the linter flags anything faster as FIX. Stay inside
150-300 words per chapter either way.

The chapter's running time is longer than its narration, and the words
don't shrink to make room: the title card draws itself on for about 1 s
before the first word, each still-frame hold adds about 0.2 s over the
voice's own sentence break, each key-animation hold adds the animation's run
time plus about 1 s less the break the voice already leaves there, and the
chapter ends on about 2 s of ground for the editor's transition. A 110 s
chapter with two still holds and one key-animation hold runs about 115 s.
Give each chapter's running time in the report, not the brief. A video's
chapters total 550-850 words, its 4-6 minutes of narration; the screencasts
between chapters and chapter 0 add to the finished video, and the linter
checks the total against the outline's chapter lengths.

## What each chapter does

**Chapter 0** is the voice track for the user's custom intro footage. It
gets audio and captions but no composition. In 60-100 words it says what
the video covers and why it matters to the learner, then hands off into the
lesson ("let's get into it"). Its visual brief is one line:

```markdown
## Visual brief

No composition. The narration above is the voice track for the user's
custom intro footage.
```

**Chapter 1 starts teaching at once.** Chapter 0 has already introduced the
video, so chapter 1 has no welcome, no "in this video we'll", and no topic
preamble: it opens on the first beat. Its first sentence plays while the
chapter's title card is still up, so make it one that needs no picture: the
problem, the question, or the stakes the chapter answers.

**Later chapters pick up mid-thought.** No re-introductions and no
"welcome back". Each still opens on its own title card, and the change of
music at the chapter boundary already marks the break, so the first
sentence can simply carry on.

**End each chapter at a natural hand-off.** The user usually cuts
screencast demo footage in between chapters, so where it fits, a chapter
ends on a line that leads into the demo ("let's try that on the lab
server"). The chapter's picture then clears to the bare ground for about
2 s while its music keeps sounding.

**The video's last chapter closes the video.** It ends with exactly:
"Hope you found this helpful and I'd like to thank you for watching." That
line appears in no other chapter, not in chapter 0, and not in the path
intro. No teaser for the next video ("next up..."): a video ends
self-contained. Forward references between the chapters of one video are
fine. The review video ends with the close too.

**The capstone video** (the final core video) assembles the course's
concepts into one realistic artifact. Its callbacks name each concept
("the error-handling video"), never a video or module number.

**The path intro video** is a marketing-style hook of about 150 words: who
the path is for, what the learner will be able to do by the end, and that
every module closes with a hands-on lab. No close line.

**The review video** walks back through the path's capabilities in the
order they were taught, naming each by its concept, and ends with the
close.

**Every video ships with an article** that `article-writer` builds from
these scripts, so the visual briefs carry the real syntax the article
needs: every command, flag, and output line the narration describes, exact.

## Writing for the ear

Listeners get one pass. The voice and global-English rules in
`.claude/style-guide.md` apply (V1-V7, G2-G7); its "Narration exemptions"
replace the number, symbol, and formatting rules. The research behind the
rules below is in `.claude/references/writing/video-scripts.md`; it was
written for lab-first micro-videos, so for a traditional chapter use its
ear-writing, rate, and caption findings, not its video structures.

- Prose paragraphs only: no markdown, lists, headings above the brief, or
  stage directions.
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
  chapter.
- Say what a command does before its syntax, and speak the syntax only when
  it is the lesson. When the syntax is spoken, say it the way it's spoken
  and put the exact form in the visual brief: "run chmod plus x on the
  file" with `chmod +x hello.sh` on screen; "run Get Service with the Name
  parameter" for `Get-Service -Name spooler`; "show I P route" for
  `show ip route`.
- Spoken forms, written this way in the narration and matched in the
  caption map:

  | On screen | In the narration |
  |---|---|
  | Flags `-l`, `-R`, `--all` | "dash L", "dash capital R", "dash dash all" |
  | Symbols `\|`, `~`, `>`, `$` | "pipe", "tilde", "greater-than", "dollar sign"; better, the meaning ("redirect it into a file") |
  | A path | its role ("the lab user's scripts folder"); only when the path is the lesson, once, phonetically ("slash et cetera slash hostname") |
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
- No em dashes or en dashes; use commas, periods, or separate sentences.
- Start a new paragraph at each scene change, and end a sentence right
  before and after any key animation the viewer should watch in silence.
  `/video` makes each hold by splitting the narration at a sentence
  boundary, so write sentences that make sense on either side of a gap;
  the music bed fills it.

**Teaching voice.** Conversational, direct, second person; contractions
are fine. One idea per paragraph. Explain like an expert teacher talking to
someone new to this concept, even in an advanced path: a learner can be
experienced overall and new to the idea a chapter teaches. Prefer a
concrete failure ("here's what happens if you skip the quotes") over an
abstract warning. For a genuinely hard concept, a real-world scenario that
shows why it matters beats its mechanics alone; don't force one onto every
concept.

## Visual brief

The brief is a suggestion for the video designer, who designs each chapter
in the course's hand-drawn style: marker line art, hand lettering and small
doodles drawn on stroke by stroke as the narrator speaks, on the navy
ground (`.claude/references/video-design.md` "The course's visual
language"). The designer may use it or set it aside. Write it in what the
viewer sees, never in tools: no component, library, or engine names.

- **Open on the title card.** First line: the title card's two strings, the
  chapter title and `Chapter M · <Video title>`, lettered over the title
  light, and the phrase it leaves on.
- **Quote the narration phrase each beat lands on, in order.** `/video`
  times the beats from those phrases, and each change lands on the first
  word of its quoted phrase. Quote the narration verbatim, and don't reuse
  the previous beat's words (the beat search runs forward from the last
  match). One change at a time.
- **Scenes.** One or two per chapter (`Scene A, <what the sheet holds>:`),
  one idea per sheet, centered. A scene change is a clean sheet: the drawing
  is wiped off in one soft sweep and the next starts on empty ground.
- **Mark every hold** on its own line, with its kind and the sentence it
  follows: `Hold (still) after "...the host on that network.": a breath on
  the finished frame.` or `Hold (key animation) after "...the split moves
  left.": the divider slides two octets left, then the result sits.` At
  most one reveal per chapter, and it is the only key animation that gets a
  long hold.
- **End on the ground.** A chapter that isn't the video's last ends with
  one sheet wipe to the bare ground (about 2 s, music still sounding). The
  video's last chapter ends on "thank you for watching": the sheet is wiped
  and "Thank You for Watching!" letters on.
- **Show what the narration can't say well:** the command, the output, the
  diagram. Never put a narration sentence on screen, and never have the
  narration read a whole on-screen string aloud. Everything on screen other
  than commands and output is a keyword label of one to four words, beside
  what it names.
- **Integrated description.** Every on-screen fact the explanation depends
  on (a value, a highlight, what connects to what, a check or cross verdict)
  is named in the narration by its meaning, not read verbatim. This is how
  the videos meet WCAG 1.2.5 with no separate audio description.
- **Copy-accurate.** Commands and output exactly as on the platform
  baseline, with the prompt from the platform profile, output trimmed by
  its output-trimming rule, and reserved or fictional placeholders only.
- **Reach for the designer's vocabulary** where it fits, by name: a
  persistent anchor, change in place, build up piece by piece, a doodle
  that thinks, cue then change, a check and cross contrast, the reveal
  (`.claude/references/video-design.md` "Signature moves").
- **Keep essential text out of the bottom 15% of the frame;** captions
  render there. Nothing flashes more than three times in any one second.
- **GUI-heavy topics** still get drawings: diagram the concept, and leave
  the real screens to the user's screencast between chapters.
- Leave music and effects to the sound engineer.

A brief for a chapter looks like this:

```markdown
## Visual brief

Title card: "Return Values Done Right" with "Chapter 3 · Functions and
Return Values", lettered over the title light; it leaves with the light on
"Bash gives you".

Scene A, the two channels:
1. On "two separate channels": two lanes drawn one above the
   other, lettered `status` and `data`.
2. On "right inside a condition": `if check_disk_space; then` builds up in
   the status lane; a `0` and a check are written beside it.
- Hold (still) after "every Linux command already behaves.": a breath on
  the two lanes, then the sheet is wiped.

Scene B, the wraparound bug:
3. On "right up until the day there are three hundred files": `return
   "$count"` is lettered; a counter beside it climbs to 300.
- Hold (key animation) after "forty four.": the counter rolls past 255 and
  lands on 44, a red cross beside `count=44`.
4. On "Have the function echo its result": `return` is struck through and
   `echo "$count"` written above it; `count=$(count_logs /var/log)` builds
   up underneath, and 300 is written in the data lane in the same color.
5. On "thank you for watching": the sheet is wiped and "Thank You for
   Watching!" letters on.
```

## Before saving

Run the unslop pass (`.claude/skills/unslop/SKILL.md`) over each narration
body. Its "Course content" exceptions matter: the video close line stays,
and the spoken command forms and phonetic spellings above win over its
compression rule. Visual briefs are out of scope. Then run the linter and
the prose checker as described at the top.

## Report

For each video: the files written, each chapter's word count, character
count, and holds against its budget, the video's chapter total, and chapter
0's count. Then any outline or research conflicts, the entries added to
`caption-map.json` and the phonetic list, the linter's and checker's
remaining NOTEs, and which chapters already had audio. Stop; `/audio` runs
only when the user asks.
