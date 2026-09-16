---
name: scripts
description: Generate narration scripts + visual briefs from an approved course outline
---

Generate the per-chapter narration scripts for a course. `$ARGUMENTS` is the
course slug (e.g. `/scripts powershell-fundamentals`). Optionally a video number
follows the slug to (re)generate just that video's chapters
(e.g. `/scripts powershell-fundamentals 3`).

**Guard:** course content never lives in the template repo. If the current
project is `learning-path-pipeline` (check the `name` in package.json),
stop and point the user at `/new-path`.

## Input

Read `courses/<slug>/outline.md`. If its frontmatter still says `status: draft`,
point that out and ask the user to confirm the outline is approved before writing
anything.

## Output

A course is videos (4-6 min each); a video is 2-4 chapters; **each chapter is
one script file and becomes one ElevenLabs request / one narration MP3 / one
overlay composition**. Write:

```
courses/<slug>/scripts/NN-<video-slug>/MM-<chapter-slug>.md
```

(NN = video number zero-padded, MM = chapter number within the video, e.g.
`01-first-script/01-hello-world.md`.) Every video ALSO gets a chapter 0:
`00-intro.md`, the narration for the video's intro segment (the user supplies
custom intro footage, so this chapter gets audio but NO Remotion work — its
"Visual brief" section just says the custom intro video covers it). Then STOP —
do not generate audio. The user reviews and edits the scripts first.

Use this exact structure (the frontmatter drives `scripts/generate-audio.mjs`):

```markdown
---
video: 1
chapter: 1
title: Hello World
folder: ps-v1-ch1     # audio lands in public/chapters/<folder>/narration.mp3
---

<The narration, as plain prose paragraphs. This exact text is sent to
ElevenLabs, so it must contain ONLY words to be spoken aloud.>

## Visual brief

<Everything below this heading is stripped before text-to-speech. Describe the
motion graphics per narration beat: what appears, when, contrasts, terminal
content. Quote the narration phrase each visual should sync to.>
```

Folder naming: `<prefix>-vN-chM` (prefix from the outline frontmatter); a
video's intro chapter uses `<prefix>-vN-intro`. A course-level marketing intro
video is a single chapter with `folder: <prefix>-intro`; the review video is a
single chapter with `folder: <prefix>-review`.

## Narration rules (the text is spoken by a cloned voice — write for the ear)

- A chapter is 60-120 seconds at ~140 words per minute, so **150-300 words**.
  A full video's chapters should total 550-850 words. The intro video is ~150
  words. Count and stay in range — each chapter must also stay under 2,900
  characters (the eleven_v3 per-request limit).
- **The chapter 0 intro** is what plays over the user's custom intro footage:
  60-100 words (~30-45s) saying what the video covers and why it matters,
  ending on a hand-off into the lesson ("let's get into it"). Because the
  intro does that job, chapter 1 starts teaching immediately: no welcome, no
  "in this video we'll", no topic preamble — dive into the first beat. Later
  chapters pick up mid-thought (no re-introductions).
- **Every video's last chapter ends with exactly:** "Hope you found this helpful
  and I'd like to thank you for watching." — and its visual brief ends with a
  big centered "Thank You for Watching!" closing the video. Do NOT close with a
  teaser for the next video ("next up …") — videos must end self-contained.
  Forward references WITHIN a video's chapters are fine.
- Between chapters the user typically inserts screencast demo footage — end a
  chapter at a natural hand-off ("let's try that") where it fits.
- Conversational, direct, second person. Short sentences. Contractions are fine.
- Never use em-dashes. Use commas, periods, or separate sentences.
- No stage directions, no "[pause]", no markdown formatting, no bullet lists
  in the narration body — prose paragraphs only.
- Write commands the way they should be SPOKEN, then show the exact syntax in
  the visual brief. E.g. narration says "run chmod plus x on the file" while
  the visual brief shows `chmod +x hello.sh`; "run Get Service with the Name
  parameter" while the brief shows `Get-Service -Name spooler`; "show I P
  route" while the brief shows `show ip route`. Avoid narrating
  punctuation-heavy strings that a TTS voice will mangle.
- **Check the TTS phonetic list** in CLAUDE.md's platform profile (bare short
  names the voice mangles, e.g. `ss` → "ess ess", `sh` → "S H") and write every
  mention that way. When a retake exposes a new one, add it to the list.
- **Filesystem paths, registry keys, URLs and long identifiers almost never
  belong in narration** — TTS reads `/home/labuser/scripts`,
  `HKLM\SYSTEM\CurrentControlSet` and `GigabitEthernet0/0/1` badly. Describe
  the location instead ("the lab user's scripts folder", "your home
  directory", "the system log directory", "the first gigabit interface") and
  put the exact string in the visual brief so it appears on screen. A spoken
  path is allowed only when the path itself IS the lesson (e.g. teaching
  `/etc/resolv.conf`), and then keep it short, say it once, and write it out
  phonetically ("et cetera slash resolv dot conf") so the voice lands it.
- **Sentence rhythm for eleven_v3:** short, comma-fragmented sentences read
  choppy (word, word, pause). Write flowing sentences of normal length.
- Teach one idea per paragraph. Prefer a concrete failure ("here's what happens
  if you skip the quotes") over an abstract warning.
- **Write like an expert teacher explaining to someone with little to no
  experience** with the concept at hand — this holds even in intermediate/advanced
  learning paths, since a learner can be experienced overall but new to the specific
  idea a chapter is teaching. For genuinely complex topics, ground the explanation
  with a real-world scenario showing why the concept matters in practice, not just
  its mechanics. Don't force this on every concept — reserve it for the ones that
  are actually hard to grasp from the mechanics alone.
- **Callbacks describe the concept, never the video number.** Learners skip
  around and the platform doesn't number videos the way the outline does:
  "the PATH lesson from the scheduling video", not "back in video 5".
- **Unslop pass before saving:** run
  `.claude/skills/unslop/SKILL.md` over each chapter's narration body as the
  last step. Its "Course content" section lists the exceptions that matter
  here: the mandated closing line stays, and the spoken/phonetic command forms
  above win over its over-compression rule. Visual briefs are not in scope.

## Visual-brief rules

- Every visual beat must quote the narration phrase it syncs to, in order.
- Favor the patterns the repo already renders well: terminal/console type-on
  (any prompt: bash, PowerShell, device CLI), line-by-line code or config
  builds, before/after contrasts, ✓/✗ comparisons, reference-card grids,
  stacked-layer diagrams, closing checklists. See CLAUDE.md "Style & motion
  conventions". GUI-heavy topics still get a motion-graphics chapter: diagram
  the concept (a settings hierarchy, a policy flow, a topology) rather than
  redrawing dialogs — the screencast footage between chapters shows the real
  UI.
- 1-2 scenes per chapter, one focal element at a time, centered.
