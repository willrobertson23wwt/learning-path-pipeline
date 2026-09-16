---
name: article
description: Write a video's companion article — a self-contained written alternative so a student can read the lesson instead of watching it
---

Write the companion article for one video or an inclusive range of videos.
`$ARGUMENTS` is the course slug and a video number or range (e.g.
`/article powershell-fundamentals 3` or `/article powershell-fundamentals 1-5`).

**Guard:** course content never lives in the template repo
(`remotion-training-graphics` in package.json).

## Purpose

Every video gets an article so the student can choose: watch the video or
read the article. The article must therefore be **self-contained** — a
reader who never opens the video misses nothing the video teaches. It is
not marketing copy and not a summary; it is the same lesson in written
form.

## Input

- `courses/<slug>/scripts/NN-<video>/MM-*.md` — the reviewed chapter
  scripts are the source of truth. The narration prose is the teaching
  voice and ordering; the visual briefs hold the exact commands, file
  contents, and outputs the video shows on screen.
- `courses/<slug>/outline.md` — the video's `**Description:**` line (for
  frontmatter) plus goal and key points as a coverage checklist.

Scripts must already exist and be reviewed; if they're missing, stop and
point at `/scripts`.

## Output

One file per video:

```
courses/<slug>/articles/NN-<video-slug>.md
```

(same NN and slug as the video's scripts folder), with frontmatter:

```markdown
---
video: 1
title: Functions and Return Values
description: <the outline's under-30-word description, verbatim>
---
```

## Writing rules

- **Translate spoken to written.** Narration is written for the ear
  ("dollar one", "cleanup dot S H", "ess ess", "Get Child Item", "show
  I P route"); the article uses real syntax: `$1`, `cleanup.sh`, `ss`,
  `Get-ChildItem`, `show ip route`. Never copy phonetic spellings in.
- **Turn visual moments into markdown.** What the video shows as motion
  graphics becomes fenced code blocks (with language tags), terminal
  transcripts showing real output, small tables, or ✗/✓ before-and-after
  pairs. Every command a chapter's visual brief shows must appear in the
  article, copy-accurate.
- **Structure:** H1 title, then a short intro (adapted from `00-intro.md`,
  minus the video-only framing like "in this video"), one H2 section per
  chapter in order (reader-facing headings, not necessarily the chapter
  titles), and a closing `## Key takeaways` bullet list. No "thank you for
  watching" — that's the video close, not the article's.
- **Length:** roughly 800-1,200 words for a 4-6 minute video — reading
  should take about as long as watching. Complex topics may run longer;
  don't pad simple ones (the same depth-beats-runtime rule as videos).
- **Voice:** the same teacher as the narration — second person, direct,
  contractions fine, one idea per paragraph, concrete failures over
  abstract warnings. No em-dashes (house style). Keep the course's
  callbacks ("the PATH lesson from the scheduling video") where the
  narration has them, described by concept, never by video number; drop
  beat-level stage directions entirely.
- **Placeholders:** same discipline as the videos — reserved/fictional
  IPs, hostnames, CVEs, tenant IDs and serial numbers only.
- **Code block language tags** follow the platform profile in CLAUDE.md
  (`bash`, `powershell`, `text` for device CLIs, `yaml`/`json`/`ini` for
  config files).
- **Unslop pass before saving:** run
  `.claude/skills/unslop/SKILL.md` over the finished article as the last
  step. For articles every rule applies in full (real syntax, whole
  sentences, no arrows in prose); keep the Title Case H1 and sentence-case
  H2s, per that skill's exceptions.

Articles are git-tracked course assets (not `deliverables/`). After
writing a batch, report the file paths and word counts for review.
