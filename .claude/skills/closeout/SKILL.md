---
name: closeout
description: Close out a finished learning path or a range of its labs (lab-first) or videos (traditional). Bundles the deliverables (MP4s, captions, chapter 0 MP3s, GIFs, card PNGs), narration, transcripts, scripts, articles, and research briefs into one verified, dated zip under archives/, then deletes the multi-GB out/ renders only after explicit confirmation. Only when the user explicitly invokes /closeout.
argument-hint: <course-slug> [first-last]
disable-model-invocation: true
---

First do the repo check in `.claude/house-style.md` ("Where content
lives"): in a template folder, stop.

Close out a finished learning path (or the part of it that has shipped).
`$ARGUMENTS` is the course slug, optionally followed by an inclusive range:
labs in a lab-first path (`/closeout linux-filesystem 1-3`), videos in a
traditional one (`/closeout linux-intermediate 6-10`). Path-level media (the
briefing, or the intro and review videos) goes in only on a whole-path
closeout. In a lab-first path a card goes with the lab whose scripts folder
holds its spec, the lab that first shows it. The work is done by `scripts/closeout.mjs`;
this skill wraps it with the checks and the one confirmation that matter.

## What gets archived

Into `archives/<slug>[-vA-B]-<YYYYMMDD>.zip` (gitignored; A-B is the range), repo-relative
paths preserved, plus a `MANIFEST.txt` with sha256 and size per file:

- `deliverables/<media-id>.*`: the MP4s and VTT captions, plus a
  traditional video's chapter 0 MP3, or a lab-first path's GIFs and card
  PNGs.
- `public/chapters/<media-id>/`: `narration.mp3`, `narration.transcript.json`,
  and `narration.vtt`, the source narration and the timings the beat tables
  came from.
- `courses/<slug>/scripts/NN-*/`, `courses/<slug>/articles/` (every video's
  in a traditional path; standalone videos' in a lab-first one), and
  `courses/<slug>/research/` (per-lab briefs in range, every per-module
  brief, and the outline and capstone briefs on a whole-path closeout):
  small, git-tracked, included so the zip is self-contained.
- `courses/<slug>/outline.md` and `caption-map.json` on a whole-path
  closeout.
- `out/` renders for the range ONLY with `--renders` (they are the
  multi-GB working copies; the deliverable is already in `deliverables/`).

Lab repos (`labs/`) are not archived; each publishes to its own GitHub repo.

## Steps

1. Preconditions, before touching anything:
   - Every lab or video in scope has an entry in CLAUDE.md's Course Status,
     and every item the outline lists for it has its deliverables in
     `deliverables/` (a video's or chapter's MP4 and VTT, a chapter 0 MP3
     and VTT, a GIF, a card PNG). If one is
     missing there but present in `out/`, stop and say so; copy first, then
     close out.
   - `git status` is clean for `courses/<slug>/` (specs, articles, and
     briefs committed). If not, tell the user what is uncommitted and stop.
2. Dry run and show the plan:
   `node scripts/closeout.mjs <slug> [A-B] --dry-run`
   (Node PATH setup per `.claude/house-style.md`). Check the count against
   the outline for the scope: two files per video or chapter (MP4 and VTT),
   two per chapter 0 (MP3 and VTT), one per GIF, one per card. Flag gaps.
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
  PowerShell 5 caps at 2 GB, which is why the script does not use it.
- `archives/` is gitignored; never commit a zip.
- Re-running on the same day overwrites that day's zip for the same range.
