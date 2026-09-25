---
name: new-path
description: Scaffold a new learning-path project (its own git repo, a sibling folder) from the learning-path-pipeline template in one of two formats, traditional (narrated videos of 2-4 chapters, an article per video, a closing lab per module) or lab-first (the labs are the course, with GIFs, micro-videos and reference cards embedded in their steps); fill in its CLAUDE.md platform profile and smoke-test the render. Run only from the template, and only when the user explicitly invokes /new-path.
argument-hint: <learning-path topic>
disable-model-invocation: true
---

Scaffold a standalone learning path. `$ARGUMENTS` is the topic (e.g.
`/new-path Linux Filesystem`). The new folder is created as a SIBLING of the
template: `../<slug>/` (short kebab-case slug from the topic).

The template (`learning-path-pipeline`, its `package.json` `name`) holds
everything a path needs:

- **Shared by both formats:** the Remotion runtime (`package.json`,
  `package-lock.json`, `tsconfig.json`, `remotion.config.ts`, `src/` with
  the hand-drawn toolkit `src/components/sketch/`, its lettering
  `src/assets/hand/`, the WWT palette in `theme.ts` and `tailwind.css`,
  `MixTrack.tsx`, `ManimLayer.tsx`, and the `ExampleCh1` example; `public/`),
  `manim/_kit/`, `pixi.toml`, `pixi.lock`, `.gitattributes`, `.gitignore`,
  `scripts/`, `.env.example`, `CLAUDE.md` and `.claude/house-style.md` with
  their FORMAT slots, and the rest of `.claude/` (shared skills, agents,
  references, the hand-drawn worked example in
  `.claude/references/examples/li-v6-ch1-hd/`).
- **Per format, in `formats/<format>/`:** the skills and agent variants that
  differ (`/outline`, `/scripts`, `/audio`, `/video`, `/article`,
  `/produce`, `/lab`, and the `researcher`, `script-linter` and
  `article-writer` agents), the format's worked example
  (`linux-intermediate-path.md` or `linux-filesystem-path.md`), and the
  fragments that fill the slots. `scripts/apply-format.mjs` lays them on.

The template never gets course content; all content work happens in the
scaffolded folder.

## Steps

1. Check you're in the template: `package.json`'s `name` is
   `learning-path-pipeline` and `formats/` exists. Otherwise stop: this
   isn't the template.
2. **Ask the format** (one question, with these two options, unless the
   user already said):
   - **Traditional:** a video course. Modules of 4-6 narrated videos (4-6
     min each, 2-4 chapters cut between the user's screencasts in
     Premiere), an article with every video, and a closing lab per module.
     Worked example: Linux Intermediate.
   - **Lab-first:** the labs are the course. A briefing video, then labs
     with fading guidance, each step embedding what it needs (a GIF, a
     30-90 s micro-video after a predict step, a reference card), and a
     challenge capstone. Worked example: `linux-filesystem-path.md`.
   Both make their videos the same way (hand-drawn, the sound engineer's
   mix, the designer's shot lists).
3. If `../<slug>` already exists, stop and ask.
4. Create `../<slug>/` and copy the template into it, except `.git/`,
   `node_modules/`, `out/`, `whisper.cpp/`, `courses/`, `labs/`,
   `deliverables/`, `archives/`, `.pixi/`, `.tinytex/`, `public/manim/`,
   `public/audio/`, `manim/media/`, `README.md`, `formats/` (applied in the
   next step), and `.claude/skills/new-path/` (scaffolding stays in the
   template).
5. Apply the format: `node scripts/apply-format.mjs <traditional|lab-first>
   ../<slug>`. It copies that format's files over the shared ones and fills
   every FORMAT slot in `CLAUDE.md` and `.claude/house-style.md`, and fails
   without changing anything if a slot or fragment is missing. Check its
   output lists the seven skills and three agents.
6. Check the copied `.gitignore` covers `node_modules/`, `whisper.cpp/`,
   `out/`, `deliverables/`, `archives/`, `.env`, `*.16khz.wav`, `labs/`,
   `.pixi/*` (with `!.pixi/config.toml`), `.tinytex/`, `public/manim/`,
   `/media/`, `manim/media/`, `__pycache__/`, and `public/audio/`, and add
   any that are missing.
7. In the copy, set `package.json`'s `"name"` and `pixi.toml`'s `name` to
   the slug.
8. Edit the copy's `CLAUDE.md`: replace the `# <Learning Path Name>` title
   with the topic, delete the HTML comment block under it, and fill in the
   **Platform profile** section from what the user told you (ask for
   anything you cannot infer: shell/prompt, elevation model, lab environment
   default, the course prefix). Leave every other section as is.
9. Copy `.env` from the template if present (gitignored, local
   convenience); otherwise remind the user to create it from
   `.env.example`.
10. `npm install` (Node PATH setup per CLAUDE.md; the drawing libraries are
    already pinned in `package.json`), then `npx tsc --noEmit` and
    `npx remotion still ExampleCh1 out/smoke.png --frame=300` to verify the
    scaffold builds and renders.
11. **Manim toolchain: not now.** Narrated videos are drawn in Remotion, so
    a new path doesn't need Manim. `/video` asks the user before running
    `scripts/setup-manim.sh` (about 2 GB) the first time a shot list needs
    an exact plot or diagram. Tell the user it's there.
12. **Carry the user's notes over.** Claude's memory is kept per folder, so a
    new folder starts empty. Copy every file in this template's memory
    folder, `~/.claude/projects/<encoded template path>/memory/`, into
    `~/.claude/projects/<encoded new path>/memory/`. The encoded path is the
    folder's absolute path with every character other than a letter, digit,
    or `-` replaced by `-` (this template's is
    `-Users-robewill-ClaudeCode-learning-path-pipeline`; `ls
    ~/.claude/projects/` shows the pattern). Create the folder if it's
    missing. Keep `MEMORY.md` as the index. Don't overwrite a file that's
    already there; tell the user which notes you copied.
13. `git init -b main`, initial commit ("Scaffold <title> learning path
    (<format>)").
14. Tell the user: `cd ../<slug>`, open a new Claude Code session there, and
    run `/outline <topic>`. The skills and agents came along in `.claude/`,
    the format's rules are in its CLAUDE.md and house style, and the notes
    are in Claude's memory for that folder.
