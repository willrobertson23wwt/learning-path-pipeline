---
name: toolkit-review
description: Review a learning path's code against the shared lp-toolkit package and the template, find what the path built or fixed that other paths could use (repeated helpers and doodles, stand-ins for toolkit pieces, workarounds that point at a missing option, edited copies of toolkit or template files), and, for the candidates the user approves, add them to lp-toolkit with a version bump and tag (and template fixes to learning-path-pipeline). Run from a learning-path folder. /closeout runs it on a whole-path closeout; run it any time, e.g. after a path's first video. Only when the user explicitly invokes /toolkit-review.
argument-hint: "[media-id ...]"
disable-model-invocation: true
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop. This skill reads a path and writes to
the toolkit, never the other way round.

A path's code is where the toolkit improves: a doodle drawn for one video,
a fix found in a still, an option added under deadline. If it stays in the
path, the next path builds it again. This skill finds those pieces and,
with the user's approval, moves them into `lp-toolkit`, so every path gets
them. `$ARGUMENTS` limits the review to some media IDs; with none, it
reviews the whole path.

## Where things are

- **The path:** this folder. Its own code is `src/` (compositions and
  `src/components/<media-id>/`), `scripts/`, `manim/`, and `.claude/`.
  `src/ExampleCh1.tsx`, `src/components/example-ch1/` and `src/Chapter.tsx`
  came from the template; skip them unless the path changed them.
- **The toolkit:** `../lp-toolkit` (clone
  `https://github.com/willrobertson23wwt/lp-toolkit` there if it's missing).
  Its rules are its `CLAUDE.md` and `README.md`; read both first. The
  version this path uses is the tag in `package.json`.
- **The template:** `../learning-path-pipeline`, for the files a path got
  by copy (`scripts/`, `manim/_kit/`, `.claude/`, `CLAUDE.md`'s shared
  sections).

Pull both checkouts first (`git -C ../lp-toolkit pull`, and the same for
the template), so you compare against their current versions, not the
ones this path started from.

## Steps

1. **Gather candidates.** Read the path's code and history, and list
   every piece that could belong in the toolkit or template:
   - **Repeated code:** a helper, doodle, stroke builder, easing or layout
     function defined in two or more compositions (or the same idea written
     twice with different names).
   - **Stand-ins:** local code doing what a toolkit piece already does (a
     hand-built terminal panel, a copied palette hex, its own narration
     split or ground). These usually go the other way: the path should use
     the toolkit. List them as "use the toolkit" findings, not promotions.
   - **Workarounds:** code that wraps or nudges a toolkit piece to get
     something it can't do (offsetting `HandText` to fix centering,
     measuring twice, overriding a style on every call). Each one points
     at a missing option.
   - **Path-wide settings:** values passed to the same toolkit prop on
     nearly every call, or `configureHand`-style defaults. These become a
     setting if the toolkit lacks one.
   - **Copied files:** an older path may still have its own copy of the
     toolkit (`src/components/sketch/`, `terminal/`, `theme.ts`,
     `MixTrack.tsx`, `scripts/beats.mjs`, ...). Diff each against
     `../lp-toolkit/src/` and `bin/`. Every difference is a candidate.
   - **Template drift:** diff `scripts/`, `manim/_kit/` and `.claude/`
     against the template. A fix in a path's copy of a skill, agent,
     reference or lab script belongs in the template.
   - **Lessons:** `git log` for fix commits ("fix", "found in stills",
     "clips", "overlap"), and anything this path added to `CLAUDE.md`'s
     "Lessons learned" or the platform profile that applies to every path.
2. **Sort each candidate into one of four outcomes**:
   - **Promote:** generic, and another path would plausibly use it.
   - **Make it a setting:** this path's look or preference. The toolkit
     gets the option, with the current look as its default, and the path
     keeps its value.
   - **Use the toolkit:** the toolkit already has it, so the path should
     switch over.
   - **Leave local:** specific to this topic (a drawing of this course's
     own subject, a one-off layout).

   For each one, record where it is (`file:line`, every place it's
   used), what a toolkit version would look like (name, entry point
   such as `lp-toolkit/sketch`, signature, default), and whether adding
   it would change the look of anything that already exists.
3. **Show the user the list and stop.** One table per outcome, most
   useful first, each row a line or two in plain words (what it is, where
   it came from, what changes). Say which version bump the approved set
   would need (see below). Ask which to take. Nothing goes into the
   toolkit or template without a yes for that row.
4. **Do the approved promotions and settings** in `../lp-toolkit`:
   - Link it into this path: `npm i ../lp-toolkit`, then `npm run watch`
     in the toolkit (or `npm run build` after each change).
   - Add each piece, following the toolkit's style and `CLAUDE.md`
     rules: nothing path-specific, the template's look as every default,
     exported from the right entry point, and a short comment saying
     where it came from (path and date).
   - In this path, replace the local copy with the toolkit import, so the
     path proves the toolkit version works. Keep the path's values as
     settings.
   - Check: `npm run typecheck` in the toolkit, `npx tsc --noEmit` here,
     and stills (`npx lp-stills`) at frames where each replaced piece is on
     screen. They must match the path's approved look. If this path's
     final renders exist, compare at the same frames.
   - Note each new piece where builders will look for it: a line in
     `.claude/references/sketch-style.md` (in the template), or in the
     toolkit's `README.md` for a non-sketch piece.
5. **Do the approved "use the toolkit" switches** in this path, with the
   same stills check. Do this only if the path is still in progress. A
   delivered path's renders stay as they shipped, so list these instead
   of making them.
6. **Do the approved template fixes** in `../learning-path-pipeline` on a
   branch, one commit per fix, with the same care as any template change
   (it reaches every new path).
7. **Release.** Bump the toolkit's `version`:
   - **patch** for a fix that moves no pixels;
   - **minor** for a new piece or option whose default keeps today's
     look;
   - **major** for a change that makes a path change its code or moves
     pixels in existing compositions.

   Commit, tag `vX.Y.Z`, and show the user the commit and tag. Ask before
   pushing, then push `main` with `--tags`. After the push:
   - point this path's `package.json` at the new tag (`npm i
     github:willrobertson23wwt/lp-toolkit#vX.Y.Z`, which replaces the
     link), and rerun the typecheck and stills;
   - offer to move the template to the same tag, on its branch with the
     template fixes, so new paths start on it.
8. **Report** what was promoted (with its new name and entry point), what
   became a setting, what was switched, what was left local and why, the
   new tag, and which other in-progress paths could move to it. Don't move
   other paths yourself.

## Rules

- A finished path (linux-intermediate, or any path whose renders have been
  handed off) is read-only: harvest from it, never change it.
- Promotion never changes how a delivered video looks. If a fix would
  change existing pixels, it's a major version, and paths move to it by
  choice.
- Code goes into the toolkit generalized, not pasted: no course names, no
  media IDs, no hard-coded positions of one scene.
- One review, one toolkit release. Several approved changes go out
  together as one version.
