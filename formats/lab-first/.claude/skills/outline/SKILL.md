---
name: outline
description: Plan a lab-first learning path with the user, step by step, from a research survey of how the topic is taught and practiced elsewhere, and save it to courses/<slug>/outline.md with its media inventory (GIFs, micro-videos, reference cards, predict prompts). Use whenever the user wants to start, plan, scope, or restructure a course or learning path on a topic, e.g. "/outline PowerShell Fundamentals" or "let's plan a Cisco routing path". Stage 1 of the pipeline; it never writes scripts.
argument-hint: <course topic>
---

Plan a lab-first learning path together with the user. `$ARGUMENTS` is the
topic (e.g. `/outline PowerShell Fundamentals`). If none was given, ask.
Follow `.claude/house-style.md`, including the repo check, and write the
outline copy (goals, steps, predict prompts, the capstone scenario) to
`.claude/style-guide.md`.

In a lab-first path the labs are the course, and short media sits inside
the lab steps. Read `.claude/house-style.md` "Lab-first design" before
anything else: its rules and media types decide what goes where. The worked
example, `linux-filesystem-path.md` at the template root (it travels into
every new path), shows a finished plan; match its shape.

The result is one file, `courses/<slug>/outline.md`, where `<slug>` is a
short kebab-case form of the topic. Every later stage is built from it, so
the user shapes it at each step below instead of reviewing a finished
draft.

**Nothing about the path's size is fixed.** How many labs, GIFs, videos, and
cards it has comes from the research and the user's choices. Size follows
what the topic and audience need.

Use `AskUserQuestion` for discrete choices (a shape, a guidance ladder, one
topic at a time when there are only a few). For longer lists, show a
numbered table and let the user answer in free text ("keep 1-4 and 7, drop
5, move 6 into Lab 2"). Never move to the next step until the user has
answered the current one.

## 1. Scope

Pick the slug and start the `researcher` agent in `outline` mode right away,
in the background, with the slug and topic (see "Research briefs" in
`.claude/house-style.md` for reuse and skipping). It surveys comparable
learning paths, hands-on lab platforms, certification objectives, and vendor
docs, and writes `courses/<slug>/research/outline.md`.

While it runs, ask the user what the research can't answer:

- **Audience:** who it's for and what they can already do.
- **Outcome:** what a learner can do at the end, and any certification or
  job role it lines up with.
- **Environment:** the lab image and how learners reach it, if the platform
  profile doesn't settle it.
- **Constraints:** a time budget if they have one, and anything that must or
  must not be covered.

Pass anything that changes the research (a different audience level, a
certification to align to) to the researcher with `SendMessage` while it is
still running.

## 2. Research findings

When the brief lands, present it as decisions, not a report dump:

- **Suggested shapes.** The brief's two or three options, each with its lab
  count, module pages per lab, how the guidance ladder maps onto the labs,
  total time, the media inventory (GIFs, micro-videos, cards), and total
  video time as a share of the path. Ask the user to pick one or describe
  their own.
- **Topics.** The coverage matrix as a numbered table: core, common, and
  differentiator topics, how many surveyed sources cover each, and the
  brief's recommendation. Ask which to include.
- **Surprise moments.** The brief's productive-failure candidates: behavior
  that contradicts what a learner would predict. Each is a candidate predict
  step followed by a micro-video. Ask which to use.
- **Module pages per lab.** The brief's suggested module split for each
  lab: how many module pages, the scope of each, and the natural
  checkpoints and comparable labs it's based on.
- **Reference-card and GIF candidates.** Lookup-heavy material for cards;
  click-path or keystroke mechanics for GIFs.
- **Capstone scenario ideas** from real breakages learners meet on the job.
- **Outdated practices** the brief found, so the user can confirm they're
  left out or taught only as what's being replaced.

For a restructure of an existing outline, lead with the brief's gap
analysis instead and ask which changes to make. Converting a video-first
outline: each video's core idea becomes a lab section with a predict step
and a micro-video after it; its reference material becomes a card.

## 3. Skeleton

Propose the path without steps:

- Module 0: the briefing's mental models.
- Each lab: title, goal, guidance level, time, the surprise it's built
  around, its media counts, and its module list. Only the number of module
  pages varies between labs. Each module gets a title in the imperative
  ("Fix the Address"), one line of scope, and a time. A module is one
  layer or one fault, about 10 to 20 minutes, and ends on a working state.
  Start from the brief's suggested split.
- The reference cards, each placed at the module step that first needs it.
- The capstone: the scenario, its problems, the seeded state behind each
  one, and its module list. It's its own lab repo that reads like any other
  lab but as a challenge, with each problem's solution collapsed under it
  and all the solutions on a `solutions.md` page after the last module.

Show it as the path-overview table plus a line per lab and its modules. Ask
for changes and revise until the user approves it. This is the cheapest
point to move things around.

## 4. Full draft

Expand the approved skeleton into the template below, step by step. Use the
brief's learner pain points and misconceptions for the predict prompts and
the capstone's seeded problems. Then check the draft against the design
rules and fix what fails:

- Every micro-video follows a predict or a try step. The briefing is the
  only video before hands-on work.
- Every GIF sits right before the step it helps with, and is silent
  mechanics, not explanation.
- Anything a learner will look up again is on a reference card, not in a
  video, and each card sits at the step where it's first needed.
- Every lab has a module list, each module ends on a working state, and
  the module times add up to the lab's time. `/lab` writes one module page
  per entry, in order.
- Each lab's steps match its guidance level (no exact commands for known
  tasks in a goal-plus-hint lab; exact commands and expected output in a
  fully guided one).
- Every goal uses an observable verb (P9): explain, create, find, fix,
  predict, compare, restore. Never "understand", "know", or "learn".
- Every goal-only step (goal plus hint onward, and every capstone problem)
  has one defensible end state (P10): it names the object (the exact path or
  host), an end state the learner can see in the terminal, and any
  constraint.
- The capstone adds no new videos and links back to earlier ones. Each
  problem has its full solution collapsed under it, and `solutions.md`
  repeats them all.
- Total video time stays at or under about 20% of the path's time.
- Media lengths are within range (GIF 5-15 s, micro-video 30-90 s).

Apply the unslop pass to goals, steps, predict prompts, and the capstone
scenario. Save with `status: draft`, then run `prose-checker` on the saved
outline and fix its FIX findings.

Report the file path, the production inventory, the total video time
against total path time, and a short **From research** list: each brief
recommendation the user declined, so the choice is on record. Then stop.
The user flips `status` to `approved` when they're happy with it.

## Media IDs

Every media item gets a stable ID in the outline, so later stages can target
it (`/scripts`, `/audio`, `/video`, `/lab`, and `/closeout` all key on them):

| Item | Folder ID | Composition ID |
|---|---|---|
| Briefing | `<prefix>-briefing` | `<Prefix>Briefing` |
| Micro-video K in lab N | `<prefix>-lN-vK` | `<Prefix>L<N>V<K>` |
| GIF K in lab N | `<prefix>-lN-gK` | `<Prefix>L<N>G<K>` |
| Reference card | `<prefix>-card-<name>` | `<Prefix>Card<Name>` |

The capstone has no media of its own; its links reuse earlier IDs.

**Standalone videos.** The briefing is standalone: learners watch it on its
own, before any lab. Mark any other video `standalone` only if it will also be
published outside its lab. A standalone video gets a `- **Description:**`
line (under 30 words) under it and a companion article (`/article`), and it
keeps the video close. Embedded videos and GIFs get neither; the lab page is
their written context.

## Template

```markdown
---
slug: linux-filesystem
prefix: lf        # media folders lf-l3-v1, composition IDs LfL3V1
title: The Linux Filesystem
audience: <who it's for and what they can already do>
environment: <lab image and access, from the platform profile>
total_time: <about N hours>
status: draft     # the user flips this to approved after review
---

# The Linux Filesystem

## Path goal
<2-3 sentences: what the learner can do after finishing>

## Path overview

| # | Lab | Guidance level | Modules | Time | Media |
|---|---|---|---|---|---|
| 0 | Briefing | None | n/a | 5 min | Briefing video (2:30) |
| 1 | <title> | Full commands and expected output | 2 | 30 min | 2 GIFs, 1 video, Filesystem Map card |
| C | Capstone: "<scenario>" | Goals only | 2 | 30 min | links back only |

## Module 0: Briefing

**Briefing video `lf-briefing` (2:30, standalone): <title>.** Supportive
information, the only video before hands-on work.
- **Description:** <under 30 words, for the platform catalog and the article>
- <mental model>

## Lab 1: <Title> (<guidance level>)

> **Goal:** <what the learner can do by the end, as an observable verb:
> "Explain why a hard link survives deletion and a symlink doesn't.">

**Time:** <N min>
**Lab repo:** <lab-slug>

**Modules:**

| # | Module | Scope | Time |
|---|---|---|---|
| 1 | <Imperative Title, e.g. "Fix the Address"> | <one line: the layer or fault, and the working state it ends on> | <N min> |

### Module 1: <Imperative Title>

1. <step, with commands and expected output as the guidance level allows>
2. **Reference card `lf-card-fhs-map`: <title>.** <what it shows>. Inline
   here, at the first step that needs it, image plus text version.
3. **GIF `lf-l1-g1` (8 s): <title>.** <what it shows>.
   <the step it precedes>
4. **Predict:** <question> (<options, if multiple choice>)
   <the command that tests it>
   <details><summary>Reveal</summary> <the answer> </details>
5. **Video `lf-l1-v1` (60 s): <title>.** <the one idea, and which surprise
   it explains> (mark `optional` or `standalone` in the parentheses when
   they apply: `(45 s, optional)`)

## Capstone: "<scenario>" (goals only)

**Lab repo:** <capstone-slug>

> <the scenario as the learner reads it, with numbered problems>

| Problem | Seeded state | Module |
|---|---|---|
| <1> | <what's broken on the box> | <N> |

**Modules:** <the module list, as for a lab>, then `solutions.md` with the
full solution to every problem.

Rewatch links: <media IDs>. Each problem has one collapsed hint inline;
the full answers are on `solutions.md`.

## Production inventory

| Asset | Count | Length each | IDs |
|---|---|---|---|
| Briefing video | 1 | 2:30 | lf-briefing |
| Micro-videos | | | |
| GIFs | | | |
| Reference cards | | n/a | |

About <N> minutes of video for about <N> hours of learning.
```

## Style

Keep titles short, skill-shaped, and in Title Case per the style guide's
M8 ("Inodes and Links", "Absolute vs. Relative Paths", not "Understanding
How Filenames Point to Inodes"). Module titles are imperative and Title
Case, in the form the real labs use ("Fix the Address", "Confirm the
Listener and Capture the Wire"). A title keeps one form everywhere it
appears. Durations take a space before the unit (M5): "(8 s)", "(60 s)",
and m:ss for the briefing. Ranges read "30 to 90 seconds" in sentences and
"30-90 s" in labels and tables (M3). Predict prompts are real questions
with one defensible answer. A goal-only step or capstone problem names the
object, an end state the learner can see, and any constraint:
"Point the `/opt/app/current` symlink at the newest release in `/opt/app`,
and leave the release directories unchanged." Placeholders follow the
platform profile.
