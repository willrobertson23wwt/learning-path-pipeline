---
name: new-path
description: Scaffold a new lab-first learning-path project (its own git repo, a sibling folder) from a template, fill in its CLAUDE.md platform profile, and smoke-test the render. Run only from a template (learning-path-pipeline, or the lab-first template folder with TEMPLATE.md), and only when the user explicitly invokes /new-path.
argument-hint: <learning-path topic>
disable-model-invocation: true
---

Scaffold a standalone lab-first learning path. `$ARGUMENTS` is the topic
(e.g. `/new-path Linux Filesystem`). The new folder is created as a
SIBLING of the template you run this from: `../<slug>/` (short kebab-case
slug from the topic).

A new path needs two things, and there are two templates that hold them:

- **The skill set:** `CLAUDE.md`, `.claude/` (skills, agents, house style),
  `scripts/`, `.env.example`, and the worked example
  `linux-filesystem-path.md`.
- **The Remotion runtime:** `package.json`, `package-lock.json`,
  `tsconfig.json`, `remotion.config.ts`, `.gitignore`, `src/` (the toolkit
  and the `ExampleCh1` worked example), and `public/` (backgrounds and the
  example chapter's audio).

`learning-path-pipeline` (its `package.json` `name`) holds both. The
lab-first template folder (the one with `TEMPLATE.md`) holds only the skill
set, and takes the runtime from `learning-path-pipeline`. Neither template
ever gets course content; all content work happens in the scaffolded
folder.

## Steps

1. Work out where you are:
   - `package.json` names `learning-path-pipeline`: both parts come from
     this folder.
   - `TEMPLATE.md` is present: the skill set comes from this folder, and the
     runtime from `${LEARNING_PATH_PIPELINE:-../learning-path-pipeline}`,
     which must have a `package.json` named `learning-path-pipeline`. If it
     isn't there, stop and ask the user where it is.
   - Neither: stop. This isn't a template.
2. If `../<slug>` already exists, stop and ask.
3. Create `../<slug>/` and copy the runtime files listed above.
4. Copy the skill set on top (it wins where both have a file). From
   whichever folder you copy, never copy `.git/`, `node_modules/`, `out/`,
   `whisper.cpp/`, `courses/`, `labs/`, `deliverables/`, `archives/`,
   `README.md`, `TEMPLATE.md` (the template marker; a copy that keeps it
   blocks every content skill), or `.claude/skills/new-path/` (scaffolding
   stays in the template).
5. Check the copied `.gitignore` covers `node_modules/`, `whisper.cpp/`,
   `out/`, `deliverables/`, `archives/`, `.env`, `*.16khz.wav`, and `labs/`,
   and add any that are missing.
6. In the copy, set `package.json`'s `"name"` to the slug.
7. Edit the copy's `CLAUDE.md`: replace the `# <Learning Path Name>` title
   with the topic, delete the HTML comment block under it, and fill in the
   **Platform profile** section from what the user told you (ask for
   anything you cannot infer: shell/prompt, elevation model, lab environment
   default, the course prefix). Leave every other section as is.
8. Copy `.env` from either template if present (gitignored, local
   convenience); otherwise remind the user to create it from
   `.env.example`.
9. `npm install` (Node PATH setup per CLAUDE.md), then `npx tsc --noEmit` and
   `npx remotion still ExampleCh1 out/smoke.png --frame=300` to verify the
   scaffold builds and renders.
10. `git init -b main`, initial commit ("Scaffold <title> learning path").
11. Tell the user: `cd ../<slug>`, open a new Claude Code session there, and
    run `/outline <topic>`. The skills and agents came along in `.claude/`.
