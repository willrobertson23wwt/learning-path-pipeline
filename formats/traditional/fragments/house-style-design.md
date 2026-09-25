## Traditional course design

Every path made in the traditional format follows these rules. The worked
example is linux-intermediate (finished and posted; its outline is
`linux-intermediate-path.md`). None of them fixes how many modules, videos,
or labs a path has; the outline decides that.

- **Watch, read, then practice.** Each module teaches through narrated
  videos and closes with a hands-on lab that exercises what those videos
  taught. Every video ships with a companion article, so a learner can read
  the lesson instead of watching it.
- **One capability per video.** A video teaches one thing the learner can
  do, in 4-6 minutes, and builds on the one before it. Each chapter (60-120 s
  of narration) covers one beat of that capability. A genuinely complex
  topic may run longer; depth beats runtime, and a simple one isn't padded.
- **Show it.** Prefer concrete, demonstrable beats (commands, before and
  after contrasts, failure modes) over abstract theory: every key point
  suggests something showable, either in the hand-drawn chapter or in the
  user's screencast between chapters.
- **Signal and segment (Mayer; Spanjers et al.).** Chapters are the
  segments: each opens on its title card, and the change of music at each
  chapter boundary (a different track per chapter, crossfaded in Premiere)
  marks the break. Designer-inserted pauses sit at meaningful boundaries
  inside a chapter.
- **Standalone courses.** Never reference the user's other courses; learners
  may skip prerequisites. Callbacks and forward references stay within the
  course, and describe the concept ("the error-handling video"), never a
  video number.
- **Capstone video.** The final core video is a "putting it together"
  capstone that assembles the course's concepts into one realistic artifact.
- **Labs are split into module pages.** A module's lab is its own WWT lab
  repo with the standard page set; only the number of module pages (2-4,
  each 10-20 minutes, titled in the imperative, ending on a working state)
  varies. The final module page closes the lab with its Workflow Summary and
  Congratulations; there is no conclusion page.
- **No automated checks yet.** The ATC lab portal can't run automated
  checks, so labs have none: a lab ends on its last step and its summary.
