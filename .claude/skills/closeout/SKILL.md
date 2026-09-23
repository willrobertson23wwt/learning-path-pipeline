---
name: closeout
description: Close out a finished lab-first path or a range of its labs. Bundles the deliverables (MP4s, captions, GIFs, card PNGs), narration, transcripts, media specs, articles, and research briefs into one verified, dated zip under archives/, then deletes the multi-GB out/ renders only after explicit confirmation. Only when the user explicitly invokes /closeout.
argument-hint: <course-slug> [first-last]
disable-model-invocation: true
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Close out a finished learning path (or the labs of it that have shipped).
`$ARGUMENTS` is the course slug, optionally followed by an inclusive lab
range (e.g. `/closeout linux-filesystem`, `/closeout linux-filesystem 1-3`).
Path-level media (the briefing, Module 0 cards) goes in only on a whole-path
closeout. The work is done by `scripts/closeout.mjs`;
this skill wraps it with the checks and the one confirmation that matter.

## What gets archived

Into `archives/<slug>[-vA-B]-<YYYYMMDD>.zip` (gitignored; A-B is the lab range), repo-relative
paths preserved, plus a `MANIFEST.txt` with sha256 and size per file:

- `deliverables/<media-id>.*`: the MP4s, VTT captions, GIFs, and card PNGs.
- `public/chapters/<media-id>/`: `narration.mp3`, `narration.transcript.json`,
  and `narration.vtt`, the source narration and the timings the beat tables
  came from.
- `courses/<slug>/scripts/NN-*/`, `courses/<slug>/articles/` (standalone
  videos only; embedded ones have none), and `courses/<slug>/research/`
  (per-lab briefs in range; the outline and capstone briefs on a whole-path
  closeout): small, git-tracked, included so the zip is self-contained.
- `courses/<slug>/outline.md` and `caption-map.json` on a whole-path
  closeout.
- `out/` renders for those labs ONLY with `--renders` (they are the
  multi-GB working copies; the deliverable is already in `deliverables/`).

Lab repos (`labs/`) are not archived; each publishes to its own GitHub repo.

## Steps

1. Preconditions, before touching anything:
   - Every lab in scope has an entry in CLAUDE.md's Course Status, and every
     media item the outline lists for it has its deliverables in
     `deliverables/` (a video's MP4 and VTT, a GIF, a card PNG). If one is
     missing there but present in `out/`, stop and say so; copy first, then
     close out.
   - `git status` is clean for `courses/<slug>/` (specs, articles, and
     briefs committed). If not, tell the user what is uncommitted and stop.
2. Dry run and show the plan:
   `node scripts/closeout.mjs <slug> [A-B] --dry-run`
   (Node PATH setup per `.claude/house-style.md`). Sanity-check the count against
   the outline's production inventory for the labs in scope: two files per
   video (MP4 and VTT), one per GIF, one per card. Flag gaps.
3. Build and verify the zip: `node scripts/closeout.mjs <slug> [A-B]`.
   The script lists the archive back and fails if any file is missing.
   Report the zip path, entry count and size.
4. Reclaiming disk is a separate, explicit step. Show the user the size the
   dry run reported for `out/` and ask whether to delete those renders. Only
   on a clear yes run
   `node scripts/closeout.mjs <slug> [A-B] --purge-renders --yes`
   (`--yes` skips the script's own prompt because the user just answered it
   here). Never delete `deliverables/` or `public/chapters/`, by script or by
   hand: they are the only copies of the delivered media and source
   narration.
5. Suggest where the zip goes (the team share or the course's archive
   bucket) and note the manifest path so the receiver can verify hashes.
   Do not upload anywhere yourself.

## Notes

- Zipping uses the `tar` bundled with macOS and Windows 10+ (bsdtar, zip64),
  so no extra tools and no 4 GB limit. `Compress-Archive` on Windows
  PowerShell 5 caps at 2 GB — that is why the script does not use it.
- `archives/` is gitignored; never commit a zip.
- Re-running on the same day overwrites that day's zip for the same range.
