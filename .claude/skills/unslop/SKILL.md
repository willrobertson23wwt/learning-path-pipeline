---
name: unslop
description: Cut AI tells from learner-facing prose (narration scripts, articles, lab guides, outline copy). Run on a file with /unslop <path>; /scripts, /article, /lab and /outline apply it automatically before saving.
---

# Unslop

Edit text to remove AI patterns. Adapted from
https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md
(rules 3-33 below are that file's, verbatim; rule numbers are stable ids, and a
removed rule leaves a gap). The "Course content" section at the end says how the
rules apply to this repo's writing and lists the exceptions.

`$ARGUMENTS`, when given, is one or more file paths to edit in place. With no
arguments, apply the pass to the prose you are about to save.

## Process

1. Scan for the patterns below.
2. Rewrite. Preserve meaning, match intended tone.
3. Self-audit: "What makes this obviously AI generated?" Fix remaining tells.

## Patterns to detect and fix

### Content

3. **Superficial -ing phrases.** "highlighting...", "ensuring...", "reflecting...", "showcasing...", "fostering...". Delete or expand with real sources.
5. **Vague attributions.** "Experts believe", "Industry reports suggest", "Some critics argue". Name the source or delete.

### Language

7. **AI vocabulary.** Additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry (abstract), testament, underscore, vibrant. Replace with plain words.
8. **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Just say "is" or "has".
9. **"Not just X, but Y."** State the point directly instead.
10. **Rule of three.** Forcing ideas into groups of three. Use the natural number.
11. **Synonym cycling.** Protagonist, main character, central figure, hero all in one paragraph. Pick one, repeat it.
12. **False ranges.** "from X to Y" where X and Y aren't on a meaningful scale. List topics directly.

### Style

13. **Em dash overuse.** Avoid em dashes entirely. Use periods or commas only (no parentheses, no en dashes, no hyphen-as-dash substitutes). If a thought needs separation, end the sentence or use a comma.
14. **Colon overuse.** Colons are fine before a list or example. Not as mid-sentence connectors. "If you're coming from traditional automation: instead of registering event handlers, you describe conditions" adds nothing with the colon. Rewrite to let the point stand on its own without comparison framing. "Describing when the scheduler should fire works best as plain English." Same meaning, no crutch punctuation.
15. **Boldface overuse.** Don't bold every proper noun or acronym.
16. **Inline-header lists.** The tell is a bold label and colon that restates the line: "**Performance:** Performance improved...". Convert those to prose. A bold lead-in that ends in a period, names the item, and is followed by genuinely new detail ("**Schema in TypeScript.** Tables live in one file.") is fine, not a tell.
17. **Title case headings.** Use sentence case.
18. **Decorative emojis.** Remove from headings and bullets.
19. **Curly quotes.** Replace with straight quotes.

### Communication artifacts

20. **Chatbot phrases.** "I hope this helps!", "Let me know if...", "Of course!", "Certainly!", "Found the smoking gun!" Remove.
22. **Sycophantic tone.** "Great question! You're absolutely right!" Respond directly.

### Filler

23. **Filler phrases.** "In order to" becomes "To". "Due to the fact that" becomes "Because". "It is important to note that" gets deleted.
24. **Excessive hedging.** "could potentially possibly be argued that it might" becomes "may".
25. **Generic conclusions.** "The future looks bright." State specific plans or facts.

### Jargon

26. **Abstract metaphor nouns.** Substrate, wedge, vector, locus, vantage, nexus, primitive (as noun), harness (as metaphor), surface (as in "API surface"), bedrock, scaffolding (as metaphor), modality, paradigm, gold-plating, ratchet (as metaphor), evacuate (for moving code), endgame, north star, flywheel. These read as technical but usually have a plainer concrete word. "Substrate" becomes "base". "Wedge in" becomes "add". "Vector" becomes "way" or "method". "Gold-plating" becomes "more than the job needs". "Ratchet" becomes the mechanism's real name or "a limit that only tightens". "Evacuate" becomes "move out". "Endgame" becomes "the last phase". Pick the concrete word.

### Plain speech

27. **Say what it does, not how it feels.** "the database stays close at hand", "SQL you can read", "types that follow your schema" name a feeling. The fix names the mechanism or a number: "`.toSQL()` returns the exact string sent to the database", "a column rename fails the build". Ask what the sentence tells the reader to do or know, then write that. If you can't restate it as a concrete instruction, fact, or number, cut it. One more check: if the sentence could appear unchanged in another project's docs, it says nothing about this one. Cut it.
28. **Shorten or split dense sentences.** If the reader has to backtrack to parse a sentence, break it in two or drop clauses. One idea per sentence.
29. **Active voice.** Prefer it. Catch "is/are/was/were + past participle" and name the actor: "queries are validated" becomes "the compiler validates queries", "the file is parsed by the loader" becomes "the loader parses the file". Passive is fine only when the actor is unknown or genuinely doesn't matter.
30. **Cut adverbs, or use a stronger verb.** "runs quickly" becomes "is fast" or the number. "significantly improves" becomes the measured delta. An adverb propping up a weak verb means the verb is wrong.
31. **Prefer the plain word.** "utilize" becomes "use", "leverage" becomes "use", "facilitate" becomes "help", "numerous" becomes "many", "in the event that" becomes "if". The fancier synonym is rarely clearer.
32. **Mannered prose.** Metaphor or flourish where a literal phrase exists: aphorisms ("wire it or delete it"), rhetorical fragments for effect, personified code ("the plan holds it"), figurative verbs ("rides along", "stands on"), stock framing phrases. "A dial worth turning" becomes "a parameter worth varying". Say what you mean. Rule 26 covers the metaphor nouns.
33. **Over-compression.** Dropped articles, verbless fragments, symbol-speak, and abbreviations that make the reader decode instead of read. "Parser rejects bad date → exit 2, no write" becomes "The parser rejects a bad date, exits with code 2, and writes nothing." Write whole sentences with their articles and verbs, and spell out arrows and abbreviations.

## Course content: where the pass applies, and the exceptions

The pass runs on prose a learner reads or hears. Apply it to:

- the narration body of every video and briefing spec
  (`courses/<slug>/scripts/**/*.md`, above `## Visual brief`),
- the text on reference cards (the `## Card layout` content),
- articles for standalone videos (`courses/<slug>/articles/*.md`),
- lab guides (`labs/<slug>/module-*.md`, `environment.md`, `reference.md`,
  `description.md`), including predict prompts, reveals, and hints,
- the path page (`courses/<slug>/path-page.md`),
- outline goals, steps, predict prompts, and descriptions
  (`courses/<slug>/outline.md`).

Do not apply it to visual briefs, GIF loop specs, `SETUP.md`, beat tables,
code, commands, or command output. Those are specs and literal text, and a
check or cross mark or an arrow in a visual brief is a rendering instruction,
not a tell.

Exceptions, because the house rules for these already decide the matter:

- **Rule 20 does not touch the mandated video close.** Every standalone
  video ends with exactly "Hope you found this helpful and I'd like to thank
  you for watching." Keep it. (Embedded micro-videos have no close.) Likewise keep the lab's closing
  "Congratulations. You have completed the ... lab" paragraph.
- **Rule 33 yields to the TTS rules in `/scripts`.** Narration is written for
  the ear on purpose: spoken command forms ("run chmod plus x"), phonetic
  spellings ("ess ess", "et cetera slash resolv dot conf"), numbers written
  as words the way the voice should say them, and spoken symbol and flag
  names ("pipe", "dash L"). Those stay. In articles the opposite holds
  and rule 33 applies in full: real syntax, whole sentences, no arrows.
- **Rule 17 applies to section headings, not titles.** Video, lab, card, and
  article H1 titles keep their established Title Case (they are names, and
  they match the outline and Root.tsx). Article H2/H3 headings use sentence
  case, as the existing articles already do. Lab guides are exempt entirely:
  their `## Opening a Terminal ...` / `## What You Have Learned` headings follow
  the WWT lab format the `/lab` skill matches.
- **Rules 27, 30 and 32 must not flatten the teaching.** The narration voice
  is a teacher explaining to someone new to the idea, so a concrete failure
  story, a short rhetorical setup before a reveal, or an intentional repeat of
  the key phrase is the lesson, not decoration. Cut flourish that only sounds
  good; keep the beat that makes the concept land. When in doubt, restate the
  sentence as a fact the learner can act on, and keep it if it survives.
- **Rule 18 is stricter here.** No emojis anywhere, not only in headings
  and bullets: learner prose, on-screen text, and outlines alike.
- **Rule 33 relaxes on reference cards.** A card is lookup material: short
  labels and table fragments ("owner, group, other") are the point. The other
  rules still apply to its text.
- **Rule 13 is already house style.** No em dashes or en dashes anywhere.
  Fix any that slip in, in prose and in on-screen text alike. Its "no
  parentheses" means no parentheses wrapped around a clause an em dash used
  to set off; parentheses for asides, abbreviations, lengths, and labels
  ("Video (75 s, optional)") are fine (style guide M2).
- **Rule 24 rewrites hedges to "might" or "can", not "may".** "may" means
  permission (style guide V7).
- **Rule 32 also covers software that perceives or wants.** The kernel doesn't
  "see" a device and the shell doesn't "want" a path (style guide V6). Plain
  function verbs are fine: returns, prints, shows, detects, rejects.

This pass is for AI tells. Mechanics (numbers, units, ranges, capitalization,
lists), formatting, word choice for global readers, and inclusive terms are
in `.claude/style-guide.md`; `prose-checker` checks both.

When `/scripts`, `/article`, `/lab` or `/outline` run this pass, do it as the
last step on each file before saving, and do not report the pass unless it
changed meaning or you were unsure whether an exception applied.
