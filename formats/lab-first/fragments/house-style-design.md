## Lab-first design

Every path made from the lab-first template follows these rules. The worked
example, `linux-filesystem-path.md`, applies each one. None of them fixes how
many labs, videos, GIFs, or cards a path has; the outline decides that.

- **Practice first (doer effect, Koedinger).** Practice teaches about six
  times as much as watching. At least 80% of a learner's time is at the
  terminal or console, and there are no standalone lecture modules.
- **Supportive versus procedural information (4C/ID).** Mental models ("one
  tree", "names point to inodes") go in the briefing and on reference cards.
  How-to help (a GIF, a command hint) sits at the step that needs it.
- **Predict, then try, then watch (productive failure, Sinha & Kapur).** At
  a conceptual moment, the learner commits to a prediction, runs the command,
  and only then gets the explainer video. The video never comes before the
  attempt.
- **Short, single-purpose media (Höffler & Leutner; Guo).** GIFs run 5 to
  15 seconds, loop, and have no audio. They're delivered as muted MP4 loops
  that autoplay with a pause control (WCAG 2.2.2), not as .gif files.
  Micro-videos run 30 to 90 seconds, cover one idea, and have pause, scrub,
  and captions. The briefing is the one longer video (about 2 to 3
  minutes) and the only one before hands-on work.
- **No transient reference (transient information effect).** Anything
  learners look up repeatedly (a directory map, a permission-bits table) is
  a static reference card, never a video. The card sits inline in the
  module step where it's first needed, as its image plus a text version
  from the card layout. There is no separate reference page.
- **Guided for novices (Kirschner et al.).** Early labs give exact commands
  and expected output.
- **Fade the guidance (Kalyuga, expertise reversal).** Guidance drops lab by
  lab, down this ladder: full commands and expected output; full commands
  with predict prompts; new commands given, goals for known ones; goal plus
  hint; goal plus collapsed hint; goals only. Every video is optional and
  labeled with its length.
- **Labs are split into module pages.** Only the number of module pages
  varies between labs, and the outline sets it per lab from the
  researcher's suggestion. Each module is one layer or one fault, about 10
  to 20 minutes, titled in the imperative ("Fix the Address"), and ends on
  a working state. The final module closes the lab with its Workflow
  Summary and Congratulations; there is no conclusion page. A lab with more
  than one device adds a `_quickref_passwords.md` page (Device, Management
  IP, Method(s), Username, Password).
- **Capstone for transfer.** The capstone is its own lab repo in the
  standard file set and reads like any other lab, but as a challenge:
  goals instead of walk-through steps, on a pre-seeded broken system. Each
  problem's full solution sits collapsed inline under it, and a
  `solutions.md` page after the last module holds all the solutions in one
  place. No other lab has a solutions
  page. It adds no new videos; it links back to earlier ones ("Rewatch:
  inodes (90 s)").
- **No automated checks yet.** The ATC lab portal can't run automated
  checks, so labs have none: a lab ends on its last step and its summary.
  Revisit this when the portal can.

**Media types.** Outlines and lab drafts label each item with a bold word
at the start of its step (`**GIF (8 s): Tab Completion.**`,
`**Predict:**`), never with an emoji or symbol. The title after the colon is the item's
Title Case title from the outline, and the label ends with a period.

| Label | Item | Placement |
|---|---|---|
| GIF | 5-15 s, silent loop (muted MP4 with a pause control); shows where to click or what to type | Before the step that needs it |
| Video | 30-90 s, narrated, one idea; explains why | After a predict or try step |
| Briefing video | The one longer video, about 2-3 minutes | Before the first lab |
| Reference card | Static reference for lookup | Inline at the module step that first needs it, image plus text version |
| Predict | Learner commits (multiple choice or free text) before running | Before the command it tests, with a collapsed reveal |
