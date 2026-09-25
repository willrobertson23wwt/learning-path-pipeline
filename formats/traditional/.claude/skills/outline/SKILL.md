---
name: outline
description: Plan a traditional video course with the user, step by step, from a research survey of how the topic is taught elsewhere (comparable video courses, certification objectives, vendor docs), and save it to courses/<slug>/outline.md with its modules, globally numbered videos, each video's 2-4 chapters (key points and visual moments), and a closing lab per module. Use whenever the user wants to start, plan, scope, or restructure a course or learning path on a topic, e.g. "/outline PowerShell Fundamentals" or "let's plan a Cisco routing path". Stage 1 of the pipeline; it never writes scripts.
argument-hint: <course topic>
---

Plan a traditional learning path together with the user. `$ARGUMENTS` is
the topic (e.g. `/outline PowerShell Fundamentals`). If none was given, ask.
Follow `.claude/house-style.md`, including the repo check, and write the
outline copy (the course goal, video and lab goals, lab page titles) to
`.claude/style-guide.md`.

A traditional path is a video course with hands-on labs: modules of
narrated videos, each video split into chapters the user cuts between
screencast footage in Premiere, an article with every video, and a closing
lab per module. Read `.claude/house-style.md` "Traditional course design"
before anything else: its rules decide what goes where. The worked
example, `linux-intermediate-path.md` at the template root (it travels into
every new path), is the approved outline of a finished course; match its
shape, not its content. Two things in it are older than the current rules
and aren't to be copied: callbacks that name a video or module number
("video 25's rule", "the module 4 reflex"), and chapter titles in sentence
case (chapter titles are Title Case now, because they print on the
chapter's title card).

The result is one file, `courses/<slug>/outline.md`, where `<slug>` is a
short kebab-case form of the topic. Every later stage is built from it, so
the user shapes it at each step below instead of reviewing a finished
draft.

**Nothing about the path's size is fixed.** Modules typically hold 4-6
videos and a path typically has 4-6 modules, but the real counts come from
the research and the user's choices. Size follows what the topic and
audience need.

Use `AskUserQuestion` for discrete choices (a shape, whether to include the
intro and review videos, one topic at a time when there are only a few).
For longer lists, show a numbered table and let the user answer in free
text ("keep 1-4 and 7, drop 5, move 6 into Module 2"). Never move to the
next step until the user has answered the current one. The first time you
use a pipeline term with the user ("chapter 0", "visual moment", "module
page"), explain it in one plain sentence.

## 1. Scope

Pick the slug and start the `researcher` agent in `outline` mode right away,
in the background, with the slug and topic (see "Research briefs" in
`.claude/house-style.md` for reuse and skipping). It surveys comparable
video courses, certification objectives, and vendor docs, and writes
`courses/<slug>/research/outline.md`.

While it runs, ask the user what the research can't answer:

- **Audience:** who it's for and what they can already do. This becomes the
  frontmatter `audience` line and sets where the first video starts.
- **Outcome:** what a learner can do at the end, and any certification or
  job role it lines up with.
- **Environment:** the lab image and how learners reach it, if the platform
  profile doesn't settle it.
- **Intro and review videos:** whether the path gets a marketing-style
  intro video (about 1 min, video 0) and a review video after the last
  module. Both are optional and single-chapter.
- **Constraints:** a time budget if they have one, and anything that must or
  must not be covered.

Pass anything that changes the research (a different audience level, a
certification to align to) to the researcher with `SendMessage` while it is
still running.

## 2. Research findings

When the brief lands, present it as decisions, not a report dump:

- **Suggested shapes.** The brief's two or three options, each with its
  module count, videos per module, chapters per video, one lab per module
  with its module pages, the total video runtime, and which surveyed
  courses it's sized like. Ask the user to pick one or describe their own.
- **Topics.** The coverage matrix as a numbered table: core, common, and
  differentiator topics, how many surveyed sources cover each, the exam
  weight where one applies, and the brief's recommendation. Ask which to
  include.
- **Order.** The brief's suggested sequence and the dependencies behind it
  (what has to be taught before what). Each video builds on the one before
  it, so an ordering problem found now is cheap.
- **Demonstrable beats.** For each chosen topic, the command, before and
  after contrast, or failure mode the brief found that shows the idea on
  screen. These become the chapters' key points and visual moments.
- **Running examples.** The brief's candidates for one realistic artifact
  per module that the videos grow and the lab finishes (a script, a
  service, a host's network setup).
- **Capstone video candidates.** Ways the final core video could assemble
  the course's concepts into one realistic artifact.
- **Lab candidates.** For each module, a realistic task that exercises what
  its videos taught, split into 2-4 module pages with their natural
  checkpoints.
- **Outdated practices** the brief found, so the user can confirm they're
  left out or taught only as what's being replaced.

For a restructure of an existing outline, lead with the brief's gap
analysis instead and ask which changes to make. Converting a lab-first
outline: each lab becomes a module, the core idea behind each of its
predict steps and micro-videos becomes a video or a chapter, and the lab
itself becomes the module's closing lab.

## 3. Skeleton

Propose the path without key points or visual moments:

- The course goal, in two or three sentences.
- The intro video, if the user wants one: its title and the promise it
  makes.
- Each module: its name, its running example, and its videos in order.
  Each video gets its global number, a Title Case title, a one-line goal,
  its chapter titles with a rough narration length each, and its estimated
  runtime.
- Each module's lab: its title, a one-line goal, and its module pages. A
  lab has 2-4 module pages, each titled in the imperative ("Schedule the
  Rotation"), about 10 to 20 minutes, and ending on a working state. Only
  the page count varies between labs.
- The capstone video, which is the final core video of the last module.
- The review video, if the user wants one.

Show it as the course-overview table (see the template) plus a line per
video with its chapter titles, and a line per lab with its pages. Ask for
changes and revise until the user approves it. This is the cheapest point
to move things around.

## 4. Full draft

Expand the approved skeleton into the template below, chapter by chapter.
Use the brief's demonstrable beats for the visual moments and its learner
pain points and misconceptions for the failure beats. Then check the draft
against the design rules and fix what fails:

- **One capability per video.** Each video's goal is one thing the learner
  can do, with an observable verb (P9): write, build, diagnose, fix,
  choose, read, compare. Never "understand", "know", or "learn".
- **Each chapter is one beat of that capability**, 60 to 120 seconds of
  narration, and a video has 2-4 of them. Its title works on its own on a
  title card.
- **Runtime.** A video's 4-6 minutes is its chapters' narration (about
  550-850 words at 140 wpm); chapter 0 and the user's screencasts between
  chapters add to the finished video. A video runs past 6 minutes only when
  the topic needs it; say so in its heading instead of compressing the
  explanation. A simple topic isn't padded.
- **Order.** Every video builds on the one before it, and nothing is used
  before it's taught. Videos are numbered globally: Module 2 continues where
  Module 1 left off.
- **Show it.** Every key point suggests something showable, and every
  chapter has at least one visual moment. A visual moment says what the
  viewer sees change (a table filling, a wrong value crossed out and
  corrected, two lanes compared), not how it's built. The video designer
  turns it into a shot list, and the user's screencast carries the live
  demo between chapters.
- **Callbacks name the concept**, never a video, module, or lab number:
  "the status-vs-data rule from the functions video". They stay within
  this course; never reference the user's other courses.
- **Hand-offs.** A module's last video hands off to its lab by the lab's
  title, in its last chapter's key points. No video teases the next video;
  each ends self-contained.
- **Capstone video last.** The final core video is a "putting it together"
  capstone that assembles the course's concepts into one realistic
  artifact, and it lands the course.
- **Labs.** Each module closes with a `**Lab:**` entry. The lab exercises
  that module's skills (plus reasonable prerequisites from earlier
  modules), its goal names an end state the learner can see, and its page
  times add up to the lab's time. `/lab` writes one module page per entry,
  in order.
- **Placeholders** (IPs, hostnames, IDs) follow the platform profile.

Apply the unslop pass to the course goal, video and lab goals, and lab page
titles. Key points and visual moments are working notes for `/scripts` and
the video designer: keep them terse, but they follow the house rules too
(no em dashes, no emojis). Save with `status: draft`, then run
`prose-checker` on the saved outline (tell it to check the course goal,
the `**Goal:**` lines, and the lab entries, and to leave titles in Title
Case) and fix its FIX findings.

Report the file path, the counts (modules, videos, chapters, labs), the
total estimated runtime and narration time, and a short **From research**
list: each brief recommendation the user declined, so the choice is on
record. Then stop. The user flips `status` to `approved` when they're happy
with it.

## Chapter IDs

Every chapter gets a stable ID from the outline, so later stages can target
it (`/scripts`, `/audio`, `/video`, `/article`, and `/closeout` all key on
video numbers and chapter IDs). `N` is the global video number and `M` the
chapter number within the video, both unpadded (`li-v6-ch1`); the scripts
folders zero-pad the video number (`scripts/06-<video-slug>/`).

| Item | Folder ID | Composition ID |
|---|---|---|
| Chapter M of video N | `<prefix>-vN-chM` | `<Prefix>V<N>Ch<M>` |
| Chapter 0 of video N | `<prefix>-vN-intro` | none (narration only) |
| Intro video (video 0) | `<prefix>-intro` | `<Prefix>Intro` |
| Review video | `<prefix>-review` | `<Prefix>Review` |

Chapter 0 isn't listed in the outline. `/scripts` writes it for every video
from the video's goal: 30 to 45 seconds that play over the user's custom
intro footage, with audio but no composition. Chapter 1 starts teaching
right away because of it. The intro and review videos are one chapter each.
The review video takes the next global number after the last core video, so
its scripts folder sorts last.

The `- **Description:**` line under a video (under 30 words, for the
platform catalog and the article) is left out of a new outline. `/video`
adds it when it delivers the video; the worked example shows it filled in
because that course is finished.

## Template

```markdown
---
slug: powershell-fundamentals
prefix: ps        # chapter folders ps-vN-chM, composition IDs PsV<N>Ch<M>
title: PowerShell Fundamentals
audience: <one line: who it's for and what they can already do>
status: draft     # the user flips this to approved after review
---

# PowerShell Fundamentals

## Course goal
<2-3 sentences: what the learner can do after finishing>

## Course overview

| Module | Videos | Chapters | Lab | Runtime |
|---|---|---|---|---|
| Intro | 0 | 1 | n/a | 1 min |
| 1. <Module name> | 1-5 | 14 | <Lab Title> | 25 min |
| Review | <N> | 1 | n/a | 2 min |

About <N> minutes of video (<N> minutes of narration) and <N> labs.

## Introduction

### 0. <Course Title> (about 1 min)
- **Goal:** <what the intro promises the learner>
- **Key points:** <the outcome, who it's for, what the labs let them do>

## Module 1 - <Module name>

<One line: the module's running example, if it has one.>

### 1. <Video Title> (4-6 min)
- **Goal:** <the one thing the learner can do after this video, with an
  observable verb>

#### 1.1 <Chapter Title> (~90 s narration)
- **Key points:** <2-3 bullets or a short run-on list: this chapter's
  content beats, with the exact commands, flags, and failure modes>
- **Visual moments:** <1-2 bullets: what the viewer sees change, the
  contrast or failure the picture shows>

#### 1.2 <Chapter Title> (~110 s narration)
- **Key points:** ...
- **Visual moments:** ...

**Lab:** <Lab Title>
- **Goal:** <what the learner builds or fixes, and the end state they can
  see>
- **Modules:** 1. <Imperative Title> (15 min); 2. <Imperative Title>
  (15 min)

## Course review

### <N>. <Title> (~120 s narration)
- **Goal:** <what the learner can now do, across the whole course>
- **Key points:** <the course's big ideas, named by concept>
```

The Introduction and Course review sections appear only when the user
chose those videos.

## Style

Keep titles short, skill-shaped, and in Title Case per the style guide's
M8 ("Functions and Return Values", "Quote Your Arrays", not "Understanding
How to Pass Arguments to Your Scripts"). That covers video titles, chapter
titles, and lab titles. A title keeps one form everywhere it appears: the
outline, the chapter's title card, the composition, the article, and the
lab page. Lab page titles are imperative and Title Case, in the form the
real labs use ("Fix the Address", "Schedule the Rotation"). Durations take
a space before the unit (M5): "(~90 s narration)", "(4-6 min)", "(15 min)". Ranges
read "60 to 120 seconds" in sentences and "60-120 s" in labels and tables
(M3). Code in key points keeps its exact syntax in backticks; phonetic
spellings for the voice come later, in `/scripts`. Placeholders follow the
platform profile.
