---
name: article
description: Write the companion article for a standalone video in a lab-first path (the briefing, or any video the outline marks standalone), a self-contained written version built from its reviewed script so a student can read instead of watch. Writes courses/<slug>/articles/<media-id>.md. Use when the user asks for an article, written version, reading alternative, or text lesson for a standalone video, e.g. "/article linux-filesystem lf-briefing". Embedded micro-videos and GIFs never get one. /video and /produce call it for each standalone video they deliver.
argument-hint: <course-slug> <media-id ... | all>
---

Write the companion article for one or more standalone videos
(`/article linux-filesystem lf-briefing`, or `all` for every standalone
video in the outline). Follow `.claude/house-style.md`, including the repo
check.

**Only standalone videos get an article.** A standalone video is watched on
its own, away from any lab: the briefing, and any video the outline marks
`standalone`. Embedded micro-videos and GIFs don't need one, because the lab
page around them is already the written lesson. If asked for an embedded
item, say so and stop; if the user still wants one, they mark the video
`standalone` in the outline first.

The article is the same lesson in written form, not a summary or marketing
copy. A reader who never opens the video should miss nothing it teaches.

**Several run in parallel.** For more than one video, first make sure each
has its `- **Description:**` line in the outline (write any that are
missing, from the script). Then launch one `article-writer` agent per video,
all in one message, and collect their reports. Each writes only its own
file, and none edits the outline. For a single video, write it here or with
one `article-writer`.

**Every article gets a `prose-checker` pass** once it's saved (one checker
per article, in parallel for several). Send its FIX findings to that
article's writer with `SendMessage`, or fix them yourself if you wrote it.

## Inputs

- The video's spec, `courses/<slug>/scripts/NN-*/<media-id>.md`, the source
  of truth. The narration gives the teaching voice and order; the visual
  brief holds the exact commands, file contents, and outputs shown on
  screen. If it's missing, stop and point at `/scripts`.
- `courses/<slug>/outline.md`: the video's `**Description:**` line for the
  frontmatter, plus what the outline says it covers, as a checklist. For the
  briefing, that is Module 0's mental models and the reference cards it
  introduces.
- `courses/<slug>/research/`, if a brief covers the video, as a fact check
  only. The article teaches what the video teaches, so it takes no new
  topics from the brief. If the brief shows a script fact is wrong, keep the
  article consistent with the video and report the conflict so the user can
  fix both. No new research runs here.

## Output

`courses/<slug>/articles/<media-id>.md`:

```markdown
---
id: lf-briefing
title: One Tree, Everything Hangs Off It
description: <the outline's under-30-word description, verbatim>
---
```

Then an H1 title, a short intro (minus video framing like "in this video"),
one H2 per idea in the order the video teaches them (reader-facing
headings), and a closing `## Key takeaways` bullet list. For the briefing,
end by pointing the reader at the first lab. No "thank you for watching";
that belongs to the video.

## Writing

- **Spoken becomes written.** Narration uses spoken forms ("dollar one",
  "cleanup dot S H", "ess ess", "Get Child Item"). The article uses real
  syntax: `$1`, `cleanup.sh`, `ss`, `Get-ChildItem`. Never carry a phonetic
  spelling over.
- **Visuals become markdown.** Motion graphics turn into fenced code blocks,
  terminal transcripts with real output, small tables, or before-and-after
  pairs labeled in words. Every command the visual brief shows appears in
  the article, copy-accurate. A reference card the video introduces becomes
  a table or links to the card image.
- **Length:** about as long to read as the video is to watch (the briefing,
  at about 2-3 minutes, is roughly 400-600 words). Don't pad.
- **Voice:** the same teacher as the narration: second person, direct, one
  idea per paragraph, concrete failures over abstract warnings. Drop
  beat-level stage directions.
- **Before saving,** run the unslop pass with every rule applied in full (real
  syntax, whole sentences, no arrows in prose). Keep the Title Case H1 and
  sentence-case H2s.

Articles are git-tracked course assets, not `deliverables/`. After a batch,
report each file's path and word count.
