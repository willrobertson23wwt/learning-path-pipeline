---
name: new-path
description: Scaffold a new learning-path folder (its own git repo) from this pipeline template
---

Scaffold a standalone Remotion project for a new learning path. `$ARGUMENTS` is
the learning-path topic (e.g. `/new-path PowerShell Fundamentals`). Run from
the pipeline template repo (`learning-path-pipeline` in package.json); the new
folder is created as a SIBLING: `../<slug>/` (short kebab-case slug from the
topic).

This template repo holds the instructions, toolkit, skills, and one worked
example only — never add course content here. All content work happens in the
scaffolded learning-path folder.

## Steps

1. If `../<slug>` already exists, stop and ask.
2. Create `../<slug>/` and copy everything from this repo EXCEPT: `.git/`,
   `node_modules/`, `out/`, `whisper.cpp/`, `README.md`, and
   `.claude/skills/new-path/` (scaffolding stays in the template). Keep the
   worked example (`src/ExampleCh1.tsx`, `src/components/example-ch1/`,
   `public/chapters/example-ch1/`, `src/chapters/example-generic/`) — it is
   the smoke test for a fresh install and the pattern reference the skills
   point at; the course deletes it once it has chapters of its own.
3. In the copy, set `package.json`'s `"name"` to the slug.
4. Edit the copy's `CLAUDE.md`: replace the `# <Learning Path Name>` title with
   the topic, delete the HTML comment block under it, and fill in the
   **Platform profile** section from what the user told you (ask for anything
   you cannot infer: shell/prompt, elevation model, lab environment default).
   Leave every other section as is.
5. Copy `.env` from this repo if present (gitignored, local convenience);
   otherwise remind the user to create it from `.env.example`.
6. `npm install` (nvm PATH export per CLAUDE.md), then `npx tsc --noEmit` and
   `npx remotion still ExampleCh1 out/smoke.png --frame=300` to verify the
   scaffold builds and renders.
7. `git init -b main`, initial commit ("Scaffold <title> learning path from
   learning-path-pipeline").
8. Tell the user: `cd ../<slug>`, open a new Claude Code session there, and run
   `/outline <topic>`. The pipeline skills came along in `.claude/skills/`.
