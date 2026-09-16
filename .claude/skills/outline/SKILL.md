---
name: outline
description: Generate a learning-path outline for a new video course
---

Create the outline for a new IT-training video course. `$ARGUMENTS` is the course
topic (e.g. `/outline PowerShell Fundamentals`). If no topic was given, ask for one.

**Guard:** course content never lives in the template repo. If the current
project is `remotion-training-graphics` (check the `name` in package.json),
stop and tell the user to run `/new-path <topic>` there first, then run
`/outline` inside the new learning-path folder.

## Output

Write a single file: `courses/<slug>/outline.md`, where `<slug>` is a short
kebab-case slug derived from the topic (e.g. `powershell-fundamentals`).
Then STOP — do not generate scripts. The user reviews and edits the outline first.

Use this exact structure:

```markdown
---
slug: powershell-fundamentals
prefix: ps        # short prefix: audio folders ps-vN-chM, composition IDs PsV<N>Ch<M>
title: PowerShell Fundamentals
audience: <one line — who this course is for and assumed prior knowledge>
status: draft     # user flips to approved after review
---

# PowerShell Fundamentals

## Course goal
<2-3 sentences: what the learner can do after finishing>

## Module 1 - <Module name>

### 1. <Video title> (4-6 min total)
- **Goal:** <the one thing the learner takes away from this video>

#### 1.1 <Chapter title> (~60-120 s narration)
- **Key points:** <2-3 bullets covering this chapter's content beats>
- **Visual moments:** <1-2 bullets — terminal demos, diagrams, contrasts that
  the motion graphics will build (this feeds the visual brief later)>

**Lab:** <Lab title — authored separately, not a pipeline video>
```

## Content hierarchy (match the existing courses)

- A **learning path** is organized into **modules** (typically 4-6), each with
  4-6 videos and a closing hands-on **lab** (labs are authored separately, not
  produced by this pipeline — list them by title only). Number videos GLOBALLY
  across modules (Module 2 continues where Module 1 left off) — the global
  video number drives the `scripts/NN-*/` folders and `<prefix>-vN-chM` audio
  folders. An optional marketing-style **Intro** (~1 min) is video 0.
- A **video** is 4-6 minutes long and broken into 2-4 **chapters**. Each
  chapter is a separate narration segment (its own ElevenLabs request, its own
  MP3, its own overlay composition) of roughly 60-120 seconds; the rest of the
  video's runtime is screencast footage the user records. Intro and review
  videos are a single chapter each.
- Each video teaches ONE capability and builds on the previous video; each
  chapter within it covers one beat of that capability. Plant forward
  references where natural (e.g. "we'll handle failures in the error-handling
  video") — the existing courses use these callbacks heavily.
- **Courses are standalone.** Never reference the user's other courses
  ("as you saw in the intro course...") — students may skip prerequisites, and
  a dangling callback confuses them. Callbacks and forward references stay
  WITHIN the course being outlined.
- The final core video should be a "putting it together" capstone that
  assembles the course's concepts into one realistic artifact.
- Prefer concrete, demonstrable beats (commands, before/after contrasts,
  failure modes) over abstract theory — every key point should suggest
  something showable on screen.
- The learner has access to a hands-on lab; chapters can reference extending
  the demo in the lab.

## Style

- Never use em-dashes anywhere in the outline.
- Run the `.claude/skills/unslop/SKILL.md` pass over the descriptions and
  goals before saving; titles keep Title Case.
- Keep titles short and skill-shaped ("Script Arguments", not "Understanding
  How to Pass Arguments to Your Scripts").
