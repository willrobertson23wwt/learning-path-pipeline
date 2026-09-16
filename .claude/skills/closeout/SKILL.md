---
name: closeout
description: Close out a finished course or a range of its videos — bundle the deliverable MP4s, narration, scripts and articles into one verified, dated zip and reclaim the render disk space
---

Close out a finished learning path (or the videos of it that have shipped).
`$ARGUMENTS` is the course slug, optionally followed by an inclusive video
range (e.g. `/closeout powershell-fundamentals`, `/closeout
powershell-fundamentals 1-5`). The work is done by `scripts/closeout.mjs`;
this skill wraps it with the checks and the one confirmation that matter.

## What gets archived

Into `archives/<slug>[-vA-B]-<YYYYMMDD>.zip` (gitignored), repo-relative
paths preserved, plus a `MANIFEST.txt` with sha256 and size per file:

- `deliverables/<prefix>-vN-*.mp4` — the MP4s handed to the editor.
- `public/chapters/<prefix>-vN-*/narration.mp3` + `narration.transcript.json`
  — the source narration the editor also syncs against, and the timings
  the beat tables came from.
- `courses/<slug>/scripts/NN-*/` and `courses/<slug>/articles/NN-*.md` —
  small, git-tracked, included so the zip is self-contained.
- `courses/<slug>/outline.md` on a whole-course closeout.
- `out/` renders for those videos ONLY with `--renders` (they are the
  multi-GB working copies; the deliverable is already in `deliverables/`).

## Steps

1. Preconditions, before touching anything:
   - Every video in scope has an entry in CLAUDE.md's Course Status and its
     MP4s in `deliverables/`. If a chapter's MP4 is missing there but present
     in `out/`, stop and say so — copy first, then close out.
   - `git status` is clean for `courses/<slug>/` (scripts and articles
     committed). If not, tell the user what is uncommitted and stop.
2. Dry run and show the plan:
   `node scripts/closeout.mjs <slug> [A-B] --dry-run`
   (nvm PATH export on macOS per CLAUDE.md). Sanity-check the count against
   the outline: chapters per video × videos in scope should match the
   deliverable count. Flag gaps.
3. Build and verify the zip: `node scripts/closeout.mjs <slug> [A-B]`.
   The script lists the archive back and fails if any file is missing.
   Report the zip path, entry count and size.
4. Reclaiming disk is a separate, explicit step. Show the user the size the
   dry run reported for `out/` and ask whether to delete those renders. Only
   on a clear yes run
   `node scripts/closeout.mjs <slug> [A-B] --purge-renders --yes`
   (`--yes` skips the script's own prompt because the user just answered it
   here). Never purge `deliverables/` or `public/chapters/` — the script
   does not, and neither should you by hand.
5. Suggest where the zip goes (the team share or the course's archive
   bucket) and note the manifest path so the receiver can verify hashes.
   Do not upload anywhere yourself.

## Notes

- Zipping uses the `tar` bundled with macOS and Windows 10+ (bsdtar, zip64),
  so no extra tools and no 4 GB limit. `Compress-Archive` on Windows
  PowerShell 5 caps at 2 GB — that is why the script does not use it.
- `archives/` is gitignored; never commit a zip.
- Re-running on the same day overwrites that day's zip for the same range.
