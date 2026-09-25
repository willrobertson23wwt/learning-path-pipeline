---
name: article
description: Write the companion article for a video in a traditional path, a self-contained written version of the whole video (chapter 0's opening and every chapter, in order) built from its reviewed chapter scripts, so a student can read the lesson instead of watching it. Writes courses/<slug>/articles/NN-<video-slug>.md. Use when the user asks for an article, written version, reading alternative, or text lesson for a video or a range of videos, e.g. "/article linux-intermediate 3" or "/article linux-intermediate 1-5". /video and /produce call it for every video they deliver.
argument-hint: <course-slug> <video-number | first-last | all>
---

Write the companion article for one video, an inclusive range
(`/article linux-intermediate 1-5`), or `all` for every video in the
outline. Follow `.claude/house-style.md`, including the repo check, and
write to `.claude/style-guide.md`: its voice, global English, mechanics, and
formatting rules apply in full, and its procedure rules apply wherever the
article walks through commands.

**Every video gets an article,** the review video included, so a learner can
choose to watch the video or read the article. The path's intro video (video
0, the one-minute trailer) teaches nothing, so it gets none unless the user
asks; say so in the report when a batch skips it.

The article is the same lesson in written form, not a summary or marketing
copy. A reader who never opens the video should miss nothing it teaches.

**Several run in parallel.** For more than one video, first make sure each
has its `- **Description:**` line in the outline (write any that are
missing, from the video's scripts). Then launch one `article-writer` agent
per video, all in one message, and collect their reports. Each writes only
its own file, and none edits the outline or `caption-map.json`. For a single
video, write it here or with one `article-writer`.

**Every article gets a `prose-checker` pass** once it's saved (one checker
per article, in parallel for several). Send its FIX findings to that
article's writer with `SendMessage`, or fix them yourself if you wrote it.

## Inputs

- The video's chapter scripts, `courses/<slug>/scripts/NN-<video-slug>/`,
  the source of truth: `00-intro.md` (chapter 0, the narration over the
  user's intro footage) and then `01-*.md`, `02-*.md`, and so on, in order.
  A one-chapter video (the review) has no chapter 0: its only script is
  `01-full.md`, and the article's opening comes from its first paragraph.
  The narration gives the teaching voice and order; each chapter's visual
  brief holds the exact commands, file contents, and outputs shown on
  screen. If a chapter script is missing, stop and point at `/scripts`.
- `courses/<slug>/outline.md`: the video's title, its `**Description:**`
  line for the frontmatter, and its goal plus each chapter's key points and
  visual moments, as a coverage checklist.
- `courses/<slug>/caption-map.json` and the TTS phonetic list in CLAUDE.md's
  platform profile: the map from every spoken form in the narration to its
  real syntax.
- CLAUDE.md's platform profile: the fenced-block language tag, the
  output-trimming rule, and the placeholder conventions.
- `courses/<slug>/research/`, if the module's brief exists, as a fact check
  only. The article teaches what the video teaches, so it takes no new
  topics from the brief. No new research runs here.

**The screencast is not in the scripts.** Between chapters the user cuts in
screencast footage they record themselves. Where the outline or a visual
brief says what a screencast segment shows and gives its commands exactly,
the article includes them at that point in the lesson. Where it only hints
("demo the fix live"), don't invent the demo: leave it out and list it in
the report, so the user can supply the commands.

**Copy accuracy wins over the video.** The article teaches the video's
topics in the video's order, but every command, flag, and output line in it
must work as written on the platform. When a script shows something that
wouldn't (a missing `sudo`, output the command doesn't print, a wrong flag),
write the accurate version, add a sentence only if the learner needs the
reason ("Without `sudo`, the Process column is empty for other users'
sockets"), and report the difference so the user can fix the script and the
video. This covers only correcting what the video already teaches; a new
topic still stays out.

## Output

`courses/<slug>/articles/NN-<video-slug>.md`, with the same `NN` and slug as
the video's scripts folder:

```markdown
---
video: 7
title: "The ip Suite: Interfaces and Addresses"
description: <the outline's under-30-word description, verbatim>
---
```

Quote the title when it contains a colon, or the YAML breaks.

Then:

- An H1 title: the video's title from the outline, in Title Case.
- A short intro adapted from chapter 0's narration, minus the video
  framing ("in this video", "let's get into it", "by the end of this
  video").
- One H2 per chapter, in chapter order, with reader-facing headings (not
  necessarily the chapter titles).
- A closing `## Key takeaways` bullet list.

When the video's last chapter hands off to the module's lab, end the last
section with one sentence naming the lab by its title. No "thank you for
watching"; that line belongs to the video.

## Writing

- **Spoken becomes written.** Narration uses spoken forms ("dollar one",
  "cleanup dot S H", "ess ess", "Get Child Item"). The article uses real
  syntax: `$1`, `cleanup.sh`, `ss`, `Get-ChildItem`. Translate every one
  with `caption-map.json` and never carry a phonetic spelling over. When
  the narration has a spoken form the map doesn't list, work out the real
  syntax from the visual brief, and report the missing entry so the main
  thread can add it (the map feeds every chapter's captions).
- **Visuals become markdown.** Motion graphics turn into fenced code blocks,
  real output, small tables, or before-and-after pairs labeled in words. A
  comparison card or a labeled diagram becomes a small table with a header
  row. Every command a chapter's visual brief shows appears in the article,
  copy-accurate.
- **Commands and output.** A command and its output go in separate blocks:
  the command alone (no prompt) in a block tagged with the platform's shell,
  then the output in a `text` block, introduced with "The output is similar
  to the following:" when values vary (PIDs, timestamps, inode numbers).
  Trim shown output by the platform profile's output-trimming rule: keep
  the command as taught and cut only the output rows the lesson doesn't
  need. Whole files the video writes appear whole, tagged with their
  language.
- **Lead with the point.** The first sentence under each H2 states that
  section's idea, and the rest of the section supports it. Headings start
  with their information-carrying words, so a reader who sees only the
  first two still gets the gist: "Names point to inodes", not "A closer
  look at what a filename is".
- **Length:** about as long to read as the video is to watch, roughly
  800-1,200 words for a 4-6 minute video. A genuinely complex topic may run
  longer; don't pad a simple one.
- **Voice:** the same teacher as the narration: second person, never "we"
  (V1), direct, contractions fine, one idea per paragraph, concrete failures
  over abstract warnings. Drop beat-level stage directions and anything
  that only makes sense on screen ("watch this line light up").
- **Cross-references describe the concept.** Keep the course's callbacks
  and forward references where the narration has them, naming the topic
  ("the cron PATH lesson", "the error-handling video"), never a video
  number, and never another course.
- **Placeholders:** the platform profile's reserved and fictional IPs,
  hostnames, CVEs, and IDs only, the same values the video shows.
- **Before saving,** run the unslop pass (`.claude/skills/unslop/SKILL.md`)
  with every rule applied in full (real syntax, whole sentences, no arrows
  in prose). Keep the Title Case H1 and sentence-case H2s.

Articles are git-tracked course assets, not `deliverables/`. After a batch,
report each file's path and word count, every copy-accuracy correction
(what the script showed and what the article says), every spoken form
missing from `caption-map.json`, and every screencast segment left out for
lack of exact commands.
