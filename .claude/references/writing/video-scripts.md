# Research: writing scripts for technical training media

Scope: narration, on-screen text, and silent GIF specs for the lab-first template
(`.claude/skills/scripts/SKILL.md`, `script-linter`, `captions.mjs`, and neighbors).
Researched 2026-09-23. All URLs in the Sources section.

## 1. Summary

1. Most of the current scripts skill holds up: open on the observed result, one idea, hand back, about 140 wpm, flowing sentences, spoken command forms, syntax on screen. Mayer, Kapur, Guo, Brame, and broadcast guidance all support it.
2. The biggest compliance gap is the GIFs. A 5-15 s GIF that auto-plays and loops forever fails WCAG 2.2.2 (Level A) unless the page gives a pause, stop, or hide control. A plain markdown `![alt](x.gif)` gives none.
3. Micro-videos show meaningful visuals, so WCAG 1.2.5 (AA) needs audio description unless the narration already conveys every important visual fact. The lightest fix is "integrated description": write the narration so it names each on-screen fact the explanation depends on. A descriptive transcript under each video is a cheap optional extra.
4. Productive-failure research says the explanation should build on the learner's likely wrong answer. Add an explicit "name the expectation, then refute it" beat, and forbid a video from answering the next predict step.
5. The ElevenLabs model the code actually uses (`eleven_multilingual_v2` by default) is not the one the docs assume (`eleven_v3`). Pause, pronunciation, and emphasis controls differ by model. The v3 character limit is now 5,000, not 3,000.
6. `captions.mjs` needs a minimum cue duration, a reading-rate check, linguistic line breaks, and commands kept whole on one line. Its 700 ms pause break almost never fires because `generate-audio.mjs` trims internal silences to 0.45 s. Captions built from whisper base.en text will mishear technical terms. Taking the text from the script and only the timings from whisper fixes that.
7. Word budgets should subtract visual holds and the end buffer. The linter's +20% tolerance (168 wpm) is above the DCMP 160 wpm ceiling for adult educational captions.

## 2. Findings by research question

### Q1. Structure

**1a. Embedded micro-video (30-90 s) after a failed or surprising prediction.**

The evidence:
- Productive failure only works when instruction comes after the attempt and builds on it. Sinha and Kapur's 2021 meta-analysis (53 studies, 166 comparisons) found g = 0.36 for problem solving followed by instruction over the reverse order, and larger effects when designs were high-fidelity. Loibl, Roll and Rummel (2017) found problem solving before instruction helps "only if" the instruction uses contrasting cases or builds on student solutions: the teacher works through typical wrong solutions before the canonical one.
- Refutation beats plain exposition in multimedia. In Muller et al. (2008), with 364 students, videos that stated a common misconception and refuted it produced more learning than a clear exposition of the same content.
- Explanatory feedback beats corrective feedback for novices (Moreno 2004, higher transfer and lower load in two experiments). Saying "that's wrong, here's the answer" is weaker than explaining why.
- Signaling works best in moderation (Stull and Mayer 2007, cited in Mayer and Fiorella 2014). One orienting sentence is enough.

Rule (testable), a five-beat skeleton:
1. **Observe** (1 sentence, 0-6 s): restate the result the learner just saw, over the redrawn output at frame 0. This also serves as the one line of setup for someone who skipped the step.
2. **Name the expectation** (1 sentence): say what most people predict and why that's reasonable, e.g. "If you expected the sizes to match, that's the right instinct for an ordinary file." This is the refutation beat that the PF and refutation studies call for. The current skill does not require it.
3. **Model** (about 60-70% of the words): one mechanism, built visually in sync, with at most one analogy.
4. **Payoff** (1-2 sentences): replay the surprise through the model ("So ls reports what's stored on disk, which is nothing, and wc reads what the kernel generates on the spot").
5. **Hand back** (1 sentence): a concrete next action in the lab. The video must **not** give away the answer to the next predict prompt. Lab 3's Step 3 in `linux-filesystem-path.md` asks the learner to predict with the model, and a video that answers it takes away the attempt the research depends on.

**1b. Briefing (2-3 min).**

The evidence:
- Pre-training (Mayer 2017: d = 0.46) means giving the names and characteristics of key concepts before the main lessons. That is the briefing's job.
- Verbal signaling helps: an outlining sentence that lists the main steps, plus heading sentences before each section. Mayer and Fiorella (2014) report this helped transfer, and that heavy signaling did not.
- Guo et al. (2014) found median engagement falls off past 6 minutes. A 2-3 minute briefing is well inside that. Lagerstrom et al. (2015) argue the 6-minute rule is a myth in for-credit courses. That dispute doesn't matter at this length.

Rule (testable):
1. Title card, then one or two sentences on a real scenario that shows the stakes. No welcome.
2. One outlining sentence naming the 3-4 mental models, used once.
3. One scene per model. Each opens with a heading sentence that names the model and runs about 60-90 words. The key term appears on screen as a keyword label.
4. A pointer to the reference card that holds the lookup material.
5. A hand-off naming the first lab's first action, then the mandated close.

### Q2. Words per minute, budgets, pacing, pauses

The numbers:
- Guo et al. (2014) measured edX speaking rates from 48 to 254 wpm, mean 156 wpm (sd 31). Engagement rose with rate, but they note rate stands in for enthusiasm and they "recommend not to force instructors to speak faster." Brame (2016) turns that into "185-254 wpm with enthusiasm". That describes human lecturers in slide lectures, not a TTS voice over dense terminal content.
- Broadcast guidance uses about 3 words per second (180 wpm) for scripted talk: a 30 s voice report is about 90 words (Media Helping Media, journalism.university, BBC training practice as reported there).
- The DCMP Captioning Key caps caption presentation for educational media at 130 wpm (lower level), 140 wpm (middle level), and 160 wpm (upper level). Verbatim narration captions inherit the narration rate, so narration for adult learners should stay at or below about 160 wpm.
- Murphy et al. (2022) found little comprehension cost up to 2x playback. Learners who find narration slow can speed it up, but narration that's too fast can't be slowed without degrading it.
- Pauses: Fiorella and Mayer (2018) list "inserting pauses throughout the video" among the features that did not improve learning. edX producers edit out pauses because learners can pause the video themselves (Guo et al.).

Rules:
- Keep **140 wpm** as the budget rate for embedded micro-videos. Allow 150 wpm for the briefing. Treat **160 wpm as the ceiling** (DCMP). This conflicts with the linter's "more than 20% off" band, which allows up to 168 wpm.
- Budget the words against speaking time, not clip length: `words = 140/60 x (length - END_BUFFER_SECONDS - 1.0 x scene changes)`. A 90 s embedded video with two scene changes gets about 140/60 x 86 = 200 words, not 210. A 60 s video with one scene change gets about 133.

| length | speaking time (1 scene change + 2 s end) | words at 140 wpm |
|---|---|---|
| 30 s | 27 s | 63 |
| 45 s | 42 s | 98 |
| 60 s | 57 s | 133 |
| 75 s | 72 s | 168 |
| 90 s (2 changes) | 86 s | 200 |
| Briefing 150 s (4 changes, standalone tail 2 s) | 144 s | 336 (at 150 wpm: 360) |

- After `/audio`, compute each take's actual wpm from the transcript (word count / speaking seconds) and report it. Flag anything above 165 or below 120. Record the voice's measured rate in the platform profile so later budgets use it.
- Pauses in the audio come from paragraph breaks only. Longer holds belong in Remotion: split the narration `<Audio>` at a paragraph boundary, as "Lessons learned" already describes. Keep scene-change holds to about 1 s, where there is new on-screen text to read. That is a partial conflict with CLAUDE.md "Pause between ideas" (1-2 s at every idea). See Q9.

### Q3. Writing for the ear

Sources: NPR Training (2025) says ears handle one fact or idea per sentence, keep sentences short with few dependent clauses, give attribution before the claim, and round numbers with one per sentence. Media Helping Media says hearers get one pass, use commas and periods only, drop semicolons and colons, give phonetic spellings for hard names, and read aloud. TechSmith says to narrate the consequence or the reason, not the button ("Opening File saves your current workspace settings" rather than "click File"), and to run a table read.

Rules (testable):
- **One idea per sentence, in full clauses, about 8-20 words.** This squares NPR's "short" with this repo's finding that runs of fragments sound choppy on eleven_v3. Flag sentences over 25 words and runs of 3 or more fragments under 6 words.
- **Front-load.** Put the subject and the key term early. No clause before the subject that's longer than about 5 words ("When you, after creating the link, remove..." is out).
- **Repeat the key term; never cycle synonyms.** This matches unslop rule 11. For the ear, repetition is how the listener tracks the idea.
- **Signpost** with plain transitions ("First", "Now", "So", "That's why"). Use at most one outlining sentence per video.
- **Say what a command does before its syntax, and say the syntax only when it is the lesson.** The learner has just typed it, and the lab step shows it. "The long listing" usually beats "L S dash L". This extends the current rule, which already puts syntax in the visual brief.
- **Spoken forms** (write them this way in the script, matching the caption map):
  - Flags: "dash L", "dash capital R"; for long options, "dash dash all".
  - Symbols: "pipe", "tilde", "greater-than", "dollar sign". Better still, name the meaning: "redirect it into a file".
  - Paths: say them only when the path is the lesson, then "slash et cetera slash hostname". Otherwise name the role ("the hostname file").
  - IP addresses: name the role ("the gateway address") and show the digits. When the digits matter, "one ninety-two dot zero dot two dot ten".
  - Ports and versions: "port four forty-three", "twenty-four oh four".
  - Octal modes: digit by digit ("seven five zero"), because each digit is one permission group.
  - Keys: "Control C", "the Tab key".
  - Numbers: write every number as words, read the way you want it said. Round when exactness isn't the point (NPR). ElevenLabs recommends writing numbers, symbols, and shortcuts out in spoken form (Q5).
- **Heteronyms and homophones.** TTS guesses from context and sometimes guesses wrong. Rewrite around: "read" (present or past), "live", "lead", "record", "object", "content", "close", "minute", "invalid", "wind", "tear". For platform words with two spoken forms ("route": root or rowt; "cache"; "etc"; "char"), pick one per path and put it in the TTS phonetic list.
- **No ALL-CAPS for emphasis.** In ElevenLabs, capitals increase stress. Acronyms that should be spelled out are safer with spaces ("D N S") until a take proves otherwise.

### Q4. Narration-to-visual alignment

Evidence (Mayer 2017 effect sizes; Mayer and Fiorella 2014 chapter):
- Coherence (d = 0.86, 23 of 23 tests): cut extraneous material, including music and decorative clips. Brame calls this "weeding".
- Signaling (d = 0.41, 24 of 28 tests): cues that highlight organization. Strongest for low-knowledge learners, with complex displays, and when used sparingly.
- Redundancy (d = 0.86, 16 of 16 tests): graphics plus narration beats graphics plus narration plus the same words on screen. Boundary conditions: the effect disappears or reverses for experienced learners, for **short** on-screen text, and when there are no graphics. Mayer and Johnson (2008) found 2-3 printed words next to the matching part of the diagram improved retention, not transfer.
- Spatial contiguity (d = 1.10, 22 of 22 tests): put words next to what they label.
- Temporal contiguity (d = 1.22, 9 of 9 tests): show the animation and the narration that goes with it at the same time, not one after the other.
- Modality (d = 0.72): explain graphics with spoken words rather than printed text.

Rules (testable):
- **The screen shows what the narration can't say well:** the command, the output, the diagram. The narration explains why. Never put a narration sentence on screen, and never have the narration read a full on-screen string verbatim.
- **On-screen words that aren't terminal content are keyword labels of 1-4 words,** placed next to the thing they label. Allow at most one verdict pill per scene. This matches the CLAUDE.md "fewer Pill containers" rule and now has a source.
- **One highlight at a time, landing on the word that names it.** Each visual beat's quoted phrase marks when the highlight appears. Aim to have it land within about 0.3 s of the phrase's first word. That tolerance is practice, not a published threshold.
- **No music bed** in path media (coherence). The Lab Drop promo is separate.
- **Keep the caption area clear.** WebVTT renders at the bottom of the frame, and DCMP and BBC say captions must not cover essential picture information. Keep essential text out of the bottom 15% of the frame in videos.

### Q5. ElevenLabs script craft (current docs, fetched 2026-09-23)

| Control | eleven_v3 | eleven_multilingual_v2 (repo default) | eleven_flash_v2 / v2.5 |
|---|---|---|---|
| Max characters per request | 5,000 | 10,000 | 40,000 (v2.5) |
| SSML `<break time="x.xs"/>` | Not supported | Supported, up to 3 s; many breaks cause instability | Supported |
| Audio tags (`[pause]`, `[slows down]`, `[emphasized]`) | Supported; can be read aloud by mistake | Not supported (read as text) | Not supported |
| Pauses without tags | Ellipses, dashes, line or paragraph breaks | Punctuation, paragraph breaks | Same |
| Emphasis | Capitals add stress; punctuation | Capitals add stress | Same |
| Inline IPA `/.../` | Native; about 80-90% consistent | No | No |
| Pronunciation dictionary: phoneme rules | Yes | No (skipped) | flash_v2 yes |
| Pronunciation dictionary: alias rules | Yes | Yes | Yes |
| `apply_text_normalization` | `auto` / `on` / `off`, default `auto` | Same; best number handling | Off by default on Flash v2.5 |
| `voice_settings.speed` | Docs mention audio tags for pace | 0.7-1.2, default 1.0 | 0.7-1.2 |
| Stability | Creative / Natural / Robust; Robust is most consistent and least responsive to tags | 0-1 slider, default 0.5 | 0-1 slider |

Other documented points:
- Very short prompts give inconsistent output. ElevenLabs suggests prompts longer than 250 characters, which a 30 s script (about 400 characters) clears.
- Professional Voice Clones are "not fully optimized" for v3.
- Up to 3 pronunciation dictionaries per request. PLS rules are case-sensitive.
- `seed` gives best-effort determinism.
- `previous_text` / `next_text` improve continuity when splitting a take.

Rules (testable):
- **Write model-neutral narration:** no SSML, no audio tags, no inline IPA, no ellipses, no all-caps emphasis. The current skill already bans "[pause]". Keep that ban, because the default model would speak it aloud. The inline-IPA ban also keeps slashes out of narration, which the linter already requires.
- **Pronunciation stays as respelling** (the TTS phonetic list plus `caption-map.json`). It works on every model and a reviewer can see it. Optional upgrade: move the list into an ElevenLabs pronunciation dictionary with **alias** rules (supported on all models). The script could then keep real words, and captions built from the script would need no map. Phoneme rules only work on v3 and flash_v2.
- **Numbers as words** in the narration. Don't rely on `apply_text_normalization`, since its behavior varies by model.
- **Pin the model.** `generate-audio.mjs` defaults to `eleven_multilingual_v2`, and `.env.example` sets no `ELEVENLABS_MODEL_ID`. The v3-specific advice in CLAUDE.md and the skill therefore doesn't apply to a default setup. Pick one model per path, record it in the platform profile, and send a fixed `seed` so a retake after a one-word edit sounds like the approved take.
- **Stability** for narration: Robust (v3), or at least 0.5 (v2). Consistency matters more than expressiveness for teaching, and "Creative" is "prone to hallucinations".
- **Listen for human-likeness errors** (wrong stress, mangled terms). In the voice-principle evidence below, the one negative study and the 2026 study both tie weaker outcomes to voices perceived as less human.

**Voice principle, current evidence.** Mayer (2017) gives the voice principle d = 0.74, based on older machine voices. With modern TTS:
- Craig and Schroeder (2017, 2019): no difference from a recorded human in learning, perceptions, or efficiency.
- Dinçer (2022): no difference in learning or cognitive load.
- Chiou, Schroeder and Craig (2020): voice quality affected trust but not learning.
- Siegle et al. (2024): synthetic voices produced significantly lower retention, transfer, and perceptions.
- The 2026 study in Education and Information Technologies: no direct effect of voice on retention; lower perceived human-likeness reduced motivation and, through it, retention.

Recommendation: modern TTS is acceptable. Choose the most natural voice available, keep the listen-first review stop in `/audio`, and fix any line that sounds robotic. TechSmith suggests labeling AI narration in learner-facing training. That's a choice for the user, not a WCAG rule.

### Q6. Silent GIF design

Evidence:
- Animation beats static pictures most for procedural-motor knowledge. Höffler and Leutner (2007): d = 1.06 for procedural-motor, 0.37 overall.
- The "human movement effect" (Castro-Alonso, Ayres, Paas) reduces the transient-information cost for manipulation tasks. Keystrokes and clicks are the right content.
- WCAG 2.2.2 Pause, Stop, Hide (Level A): content that (1) starts automatically, (2) lasts more than 5 seconds, and (3) sits in parallel with other content needs a mechanism to pause, stop, or hide it. Technique G152 makes a GIF compliant only if it stops animating within 5 s.
- WCAG 1.2.1 (Level A) counts animated images as video-only. They need an equivalent text alternative, unless the GIF is a media alternative for text on the page "and is clearly labeled as such".
- WCAG 2.3.1: no more than three flashes in any one second.

Rules (testable):
- **Pause control (conflict).** Deliver each loop in a way that either doesn't start automatically or can be paused. Lightest options that work in mkdocs:
  - (a) Render the loop as a muted MP4 (also much smaller than a GIF) and embed it as `<video muted loop playsinline controls preload="metadata" poster="...png">`. Without `autoplay` it starts on click; with `autoplay` the controls provide the pause.
  - (b) Keep the GIF, but wrap it in `<details><summary>Show the loop: Tab completion (8 s)</summary> ... </details>`. It then starts on user action and closing it hides it.

  Recommend (a) with `autoplay` omitted. The plain `![alt](x.gif)` in `guide-format.md` and "loops forever" in CLAUDE.md fail 2.2.2.
- **Poster frame.** Frame 0, or the finished state, should read as a meaningful still, because it is what a paused, reduced-motion, or not-yet-played viewer sees. For a loop, the finished state is the better poster.
- **Text alternative is equivalent** (1.2.1). The alt text or caption lists the exact keys and the visible result, e.g. "Typing cd /us and pressing Tab completes the line to cd /usr/ (8 s loop)". The current `guide-format.md` example already does this. Make it a rule: every string and key in `Text on screen` appears in the alt text or in the step text directly below.
- **Reading time for labels.** Hold the finished state at least 1.5 s, plus 0.3 s per word of new text the learner has to read. BBC uses 0.3 s per word as the subtitle minimum. Hold 3 s or more for "read this dense line" GIFs such as the `ls -l` decode. Typing speed stays at about 12 characters per second, as now.
- **Loop length 5-15 s** stays. Never flash a highlight faster than 3 times per second. A cursor blinking at about 1 Hz is fine.
- **No captions needed** (no audio). Key badges cover the silent keys, as now.

### Q7. Captions

| Setting | DCMP | Netflix (English) | BBC | captions.mjs now |
|---|---|---|---|---|
| Characters per line | 32 | 42 | 68% of 16:9 width (about 37) | 42 |
| Lines per cue | 2 preferred | 2 max; one line if it fits | 2 (3 if nothing important hidden) | 2 |
| Reading rate | 130/140/160 wpm (lower/middle/upper educational) | 20 cps adult, 17 cps children | 160-180 wpm, about 0.33 s per word | not checked |
| Minimum cue duration | 40 frames (about 1.33 s) | 5/6 s | about 0.3 s per word | none |
| Maximum cue duration | 6 s | 7 s | editorial | 5.5 s (fine) |
| Gap between cues | not stated | 2 frames minimum | not checked | 0 (end = next start) |
| Line breaks | never break a modifier from its word, a preposition from its object, or a name; never after a conjunction; never end one sentence and start another on one line | break after punctuation, before conjunctions and prepositions; bottom-heavy pyramid | break at punctuation or natural linguistic points | greedy fill, no linguistic rules |

Rules (testable), with the current values:
- `MAX_LINE 42`: keep (Netflix). BBC's 37 and DCMP's 32 are for TV. In a lab page the player scales the caption font with the video.
- `MAX_LINES 2`: keep.
- `MAX_CUE_SECONDS 5.5`: keep.
- **Add `MIN_CUE_SECONDS = 1.0`.** Extend a short cue's end into the following gap, or merge it into the next cue if the result still fits 2 lines. A one-sentence hand-back like "Head back and try it." can come out shorter than Netflix's 0.83 s.
- **Add a reading-rate warning** above 20 cps (Netflix adult) per cue. Report the file's average wpm against the DCMP 160 wpm ceiling.
- **Line breaks:** balance two lines, prefer a break after punctuation, never end line 1 on an article, preposition, or conjunction (a, an, the, to, of, in, on, and, or, but), and prefer a bottom-heavy shape.
- **Commands and paths stay whole.** Treat each caption-map replacement (and any token containing `/`, `-`, or `.`) as unbreakable when wrapping. Give a command its own line when it fits.
- **Size cues after mapping.** `applyMap` currently runs after cue sizing, so a replacement longer than its spoken form can produce a third line.
- **Leave a 2-frame gap** (about 70-80 ms) before the next cue instead of ending exactly at `next.from`.
- **`PAUSE_BREAK_MS 700` is almost dead code.** `generate-audio.mjs` shortens any internal silence of 0.6 s or more to 0.45 s, so 700 ms word gaps are rare unless `--no-trim` was used. Either lower it to about 400 ms and apply it only at a comma or clause boundary, or remove it and rely on sentence ends.
- **Sentence-end cue breaks** match DCMP ("never end a sentence and begin a new sentence on the same line"). Keep them. Two very short sentences may share a cue on separate lines.
- **Caption text should come from the script, not from whisper.** `transcribe.mjs` uses whisper `base.en`, which mishears technical words. The caption map only fixes spoken forms whisper happens to spell exactly as the script does ("ess ess" may come back as "SS"). Aligning the script's own words, after caption-map mapping, to whisper's word timings gives 99%-accurate text by construction, which caption quality guidance (FCC and DCMP "accurate") expects. The manual "read the .vtt against the script" step then becomes a check.
- **How to caption code:** real syntax, exact case, no backticks or markdown (players render them literally). Caption only what's spoken. If the narration says "the long listing option", the caption says that, not `-l`.

### Q8. Accessibility for micro-videos and the briefing

- 1.2.2 Captions (A): required. Already delivered as a `default` track.
- 1.2.3 (A): audio description **or** a full text alternative. 1.2.5 (AA): audio description is required, unless "all of the important information in the video track is already conveyed in the audio track".
- The "media alternative for text" exception does not apply, because the videos explain things the page doesn't say.
- W3C WAI calls **integrated description** the approach that works well for instructional videos: "When writing the script, make sure all relevant visual information is included", and "all text in the video should be included in the main audio (integrated description) or in the separate description."
- Descriptive transcripts are the Level A route for video-only content and support AAA 1.2.8 and deafblind users. They are not a substitute for AA audio description.
- 1.4.2: never autoplay narrated media. `guide-format.md` uses `controls` without `autoplay`, which is compliant.

Lightest compliant approach for this pipeline:
1. **Integrated description in the narration.** Every on-screen fact the explanation depends on (the output value, what's highlighted, what connects to what, a check or cross verdict) is named at the meaning level in the narration. It doesn't have to be read verbatim.

   This is how integrated description and the redundancy principle fit together. The narration says "ls reports zero bytes", and the screen shows the full `ls -l` line. Exact strings the learner just typed are also in the lab step's text.

   Linter check: each visual beat that introduces a label, value, or verdict has a matching spoken mention.
2. **Optional descriptive transcript** under each video: a collapsed `<details><summary>Transcript</summary>` with the narration (caption-map applied) and bracketed visual descriptions from the brief. `/lab` or `/video` can generate it from the spec at almost no cost. Recommend it for the briefing at least, since the briefing is also standalone.
3. GIFs: see Q6 (2.2.2 control and an equivalent alt text).

### Q9. Where current rules conflict with the research

1. **GIF autoplay loops** (CLAUDE.md "GIFs ... loops forever"; `guide-format.md` inline `![]()` GIF): fail WCAG 2.2.2. **Conflict.**
2. **Linter wpm tolerance of 20%** allows 168 wpm, above DCMP's 160 wpm ceiling for adult educational captions. **Conflict (minor).**
3. **Word budget ignores holds and end buffer** (skill: "a micro-video is roughly 70-210 words"). A 90 s clip with holds and a 2 s tail has about 86 s of speech. **Conflict (minor).**
4. **Character limit** (skill "2,900 characters, the eleven_v3 per-request limit"; `generate-audio.mjs` comment "eleven_v3 allows 3k"). ElevenLabs now lists 5,000. **Stale.** It isn't binding at these lengths (a 420-word briefing is about 2,400 characters).
5. **Model assumption.** CLAUDE.md and the skill describe eleven_v3 behavior, but the code defaults to `eleven_multilingual_v2` and `.env.example` sets no model. **Conflict.** Side finding: `.env.example` names `ELEVEN_LABS_API_KEY` / `ELEVEN_LABS_VOICE_ID`, but `generate-audio.mjs` reads `ELEVENLABS_API_KEY` / `ELEVENLABS_VOICE_ID`. A `.env` copied from the example fails.
6. **"Pause between ideas: hold 1-2 s"** (CLAUDE.md). Fiorella and Mayer (2018) found inserted pauses don't improve learning, and edX removes pauses. If the narration keeps talking during a visual hold, temporal contiguity also suffers. **Partial conflict.** Keep about 1 s holds only at scene changes with new text to read, and create them by splitting the audio.
7. **`captions.mjs`:** no minimum duration, no reading-rate check, greedy line breaks, commands can wrap mid-token, mapping applied after sizing, zero gap between cues, and a pause break that the silence trim makes unreachable. **Conflicts** with DCMP and Netflix.
8. **Captions from whisper text** rather than script text. **Conflict** with caption accuracy practice.
9. **Accessibility (AA 1.2.5)** is not addressed anywhere. The rule that paths and identifiers stay out of the narration is fine as long as the narration still names what they mean. **New requirement, not a direct conflict.**
10. **No "name the expectation" beat, and nothing stops a video from answering the next predict step.** Loibl et al. and Muller et al. support adding both. **Gap.**

Rules the research confirms: open on what the learner saw; no welcome or "in this video"; one idea; hand back; works without the predict step; flowing sentences; spoken command forms with syntax on screen; phonetic list plus caption map; syntax out of the narration; second person (personalization, d = 0.79); captions on every video; 5-15 s GIFs, mechanics only, badges for silent keys, a 1.5 s minimum hold, loop back to frame 0; cards for lookup (transient information effect); 42 characters, 2 lines, 5.5 s maximum.

## 3. Recommendations mapped to files

| Rule | Target file | Status | Proposed wording or setting |
|---|---|---|---|
| Five-beat micro-video skeleton: observe, name the expectation, model, payoff, hand back | scripts skill ("An embedded micro-video explains one surprise") | new (extends) | Add after the bullets: "Second sentence names what most learners expect and why it's reasonable, then the model replaces it. Replay the surprise through the model before handing back." |
| Never answer the next predict prompt | scripts skill; script-linter "place in the lab" | new | "The narration must not state the outcome of any predict prompt that comes later in the same lab. Linter: read the outline's later predict steps in that lab; a narration sentence stating their answer is FIX." |
| Briefing structure: scenario, one outlining sentence, one scene per model with a heading sentence, card pointer, hand-off, close | scripts skill ("Standalone videos") | new (extends) | "Open with a real scenario in one or two sentences. Name the three or four models once in one sentence, then give each its own scene opening with a sentence that names it. Point to the reference card, then name Lab 1's first action." |
| Word budget subtracts holds and tail | scripts skill ("Length"); script-linter word count | conflicts | "Budget 140 wpm against speaking time: length minus 2 s end buffer minus about 1 s per scene change (a 90 s video with two scene changes is about 200 words, a 60 s video about 133)." |
| 160 wpm ceiling | script-linter; audio skill step 4 | conflicts | Linter: "flag effective rate above 160 wpm as FIX, below 115 as NOTE" (replaces symmetric 20%). Audio: "report measured wpm per take; above 165 is a retake candidate." |
| Record the voice's measured wpm | CLAUDE.md platform profile | new | Add a line: "**Measured narration rate:** <N> wpm on <model>/<voice> (from the first approved take)." |
| One idea per sentence, 8-20 words, front-loaded | scripts skill ("Writing for TTS") | new (refines) | "One idea per sentence, in full clauses, usually 8-20 words, subject and key term first. No sentence over 25 words." Linter NOTE for sentences over 25 words. |
| Say what a command does before its syntax; speak syntax only when it is the lesson | scripts skill | new (refines) | "The learner just typed it and the page shows it. Name the effect ('the long listing') and speak syntax only when the syntax is the point." |
| Spoken forms for flags, symbols, IPs, ports, versions, octal, keys, numbers as words | scripts skill; CLAUDE.md platform profile (phonetic list examples) | new | Add the Q3 list as a short table in the skill. Linter: any digit in the narration is FIX ("write numbers as words the way the voice should say them"). |
| Heteronym check | script-linter | new | NOTE on: read, live, lead, record, object, content, close, minute, invalid, wind, tear, and any platform word listed with two readings. |
| No ellipses, no ALL-CAPS emphasis, no SSML, no audio tags, no inline IPA | scripts skill; script-linter "things that break TTS" | new (extends the "[pause]" ban) | Linter FIX on `...`, `<break`, `[word]` tags, `/ipa/`, and all-caps words not on the path's acronym list. |
| Pin the model; model-specific notes | CLAUDE.md platform profile; `.env.example`; audio skill | conflicts | Profile line: "**TTS model:** eleven_multilingual_v2 (or eleven_v3), stability <x>, seed <n>." Add `ELEVENLABS_MODEL_ID=` to `.env.example` and fix its variable names to `ELEVENLABS_API_KEY` / `ELEVENLABS_VOICE_ID`. |
| v3 character limit is 5,000 | scripts skill ("Length"); `generate-audio.mjs` MAX_CHARS comment | stale | "Each file stays under 2,900 characters (a safe margin under eleven_v3's 5,000-character limit)." Or raise MAX_CHARS for v3 to 4,900. |
| Optional pronunciation dictionary with alias rules | audio skill; CLAUDE.md platform profile | new (optional) | "If the phonetic list grows past about 20 entries, consider an ElevenLabs pronunciation dictionary with alias rules (all models) passed via `pronunciation_dictionary_locators`; phoneme rules only on eleven_v3 and flash_v2." |
| Screen shows, narration explains; labels 1-4 words, next to their target | scripts skill ("Visual briefs"); CLAUDE.md style | new (codifies) | "On-screen words other than terminal content are keyword labels of one to four words placed beside what they name. Never put a narration sentence on screen, and never read a whole on-screen string aloud." |
| One highlight at a time, timed to its phrase | scripts skill ("Visual briefs") | already covered (quoted phrases); refine | Add: "each highlight lands on the first word of its quoted phrase." |
| No music bed | CLAUDE.md style | new | "No background music in path media (coherence principle); music is only for `/labdrop`." |
| Caption safe area | CLAUDE.md style; stills-reviewer | new | "Keep essential text out of the bottom 15% of a video frame; captions render there." |
| Scene-change holds about 1 s, made by splitting audio | CLAUDE.md "Pause between ideas" | partial conflict | "Hold about 1 s at a scene change where new text must be read, created by splitting the narration audio at the paragraph boundary so narration and visuals stay in sync. Don't add pauses elsewhere." |
| Integrated description | scripts skill ("Visual briefs"); script-linter visual brief checks | new | Skill: "Every on-screen fact the explanation depends on (a value, a highlight, a verdict) is named in the narration by its meaning." Linter NOTE: a beat introducing a label, value, or verdict with no spoken mention. |
| Descriptive transcript under each video (optional; recommended for the briefing) | lab guide-format.md; `/video` or `/lab` | new | Add below the `<video>`: `<details><summary>Transcript</summary>` with narration (caption-map applied) and bracketed visual descriptions from the brief. |
| GIF pause control (WCAG 2.2.2) | lab guide-format.md (GIF); CLAUDE.md GIFs; video skill deliverables | conflicts | Deliver loops as muted MP4 with a PNG poster: `<video muted loop playsinline controls preload="metadata" poster="./media/module-1/lf-l1-g1.png" src="./media/module-1/lf-l1-g1.mp4" aria-label="..."></video>`, no autoplay. Or wrap the GIF in `<details><summary>Show the loop: ... (8 s)</summary>`. |
| GIF alt text is equivalent | lab guide-format.md; script-linter GIF checks | already covered (example); make it a rule | "The alt text names every key pressed and the visible result. Linter: each `Text on screen` string appears in the loop spec's proposed alt text." Add an `Alt text:` field to the loop spec. |
| GIF label reading time | scripts skill (GIF rules); script-linter | new (refines 1.5 s) | "Hold the finished state 1.5 s plus 0.3 s per word of new text; 3 s minimum for a dense-line read." |
| No flashing faster than 3 per second | CLAUDE.md GIFs | new | "No highlight flashes more than three times in any one second (WCAG 2.3.1)." |
| MAX_LINE 42, MAX_LINES 2, MAX_CUE_SECONDS 5.5 | captions.mjs | already covered | Keep. |
| Minimum cue duration | captions.mjs | new | `const MIN_CUE_SECONDS = 1.0;` extend into the gap or merge with the next cue. |
| Reading-rate warning | captions.mjs; audio skill step 4 | new | Warn per cue above 20 cps; print file average wpm. |
| Linguistic, balanced line breaks | captions.mjs `lineWrap` | conflicts | Balanced 2-line split; prefer after punctuation; never end line 1 on a/an/the/to/of/in/on/at/for/and/or/but. |
| Commands and paths never wrap | captions.mjs | new | Replace spaces inside mapped values and in tokens with `/`, `-`, `.` by non-breaking spaces before wrapping. |
| Size cues after mapping | captions.mjs | conflicts (bug) | Apply the map to word text before cue building, or measure `lineWrap(applyMap(text))` in the `tooLong` check. |
| 2-frame gap between cues | captions.mjs | new | `end = next ? Math.min(next.from - 80, c.to + 800) : c.to + 800`. |
| PAUSE_BREAK_MS unreachable after trim | captions.mjs; generate-audio.mjs trim constants | conflicts (interaction) | Lower to 400 ms and apply only after a comma, or drop it. Document the interaction in both files. |
| Caption text from the script, timings from whisper | captions.mjs; audio skill step 3 | new (recommended) | Add `--script courses/<slug>/scripts/NN-*/<id>.md`: align script words to transcript words in order, apply the map to the script text, and warn where alignment fails. |
| Captions show only what is spoken, in real syntax, no markdown | audio skill; captions.mjs header comment | already covered (map); refine | "No backticks or markdown in cues; real syntax only for words actually spoken." |
| Voice choice and listen-first review | audio skill step 4 | already covered | Add one line: "Retake any line that sounds unnatural. Lower perceived human-likeness reduced motivation and retention in 2024-2026 studies." |
| Label AI narration (optional) | house-style.md or lab guide-format.md | new (user decision) | Optional line under the video label: "Narration uses a synthetic voice." |
| Unslop exceptions for ear-writing | unslop "Course content" | already covered | Add to the Rule 33 exception: "numbers written as words and spoken symbol names ('pipe', 'dash L') stay." |

## 4. Sources (all accessed 2026-09-23)

Multimedia learning and video research
- Mayer, R. E. (2017). Using multimedia for e-learning. Journal of Computer Assisted Learning, 33(5). Abstract with effect sizes: https://eric.ed.gov/?id=EJ1153516 (DOI https://onlinelibrary.wiley.com/doi/abs/10.1111/jcal.12197)
- Mayer, R. E., and Fiorella, L. (2014). Principles for reducing extraneous processing in multimedia learning: coherence, signaling, redundancy, spatial contiguity, and temporal contiguity principles. Cambridge Handbook of Multimedia Learning, 2nd ed. PDF: https://edtechuvic.ca/wp-content/uploads/sites/11/2022/09/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles.pdf
- Mayer, R. E. (2024). The past, present, and future of the cognitive theory of multimedia learning. Educational Psychology Review, 36:8. https://link.springer.com/article/10.1007/s10648-023-09842-1 (ERIC record https://eric.ed.gov/?id=EJ1407410)
- Mayer, R. E., and Johnson, C. I. (2008). Revising the redundancy principle in multimedia learning. Journal of Educational Psychology. https://eric.ed.gov/?id=EJ796353
- Fiorella, L., and Mayer, R. E. (2018). What works and doesn't work with instructional video. Computers in Human Behavior, 89. https://www.sciencedirect.com/science/article/abs/pii/S0747563218303376
- Guo, P. J., Kim, J., and Rubin, R. (2014). How video production affects student engagement: an empirical study of MOOC videos. L@S 2014. https://pg.ucsd.edu/publications/edX-MOOC-video-production-and-engagement_LAS-2014.pdf
- Brame, C. J. (2016). Effective educational videos: principles and guidelines for maximizing student learning from video content. CBE Life Sciences Education, 15(4), es6. https://pmc.ncbi.nlm.nih.gov/articles/PMC5132380/
- Lagerstrom, L., Johanes, P., and Ponsukcharoen, U. (2015). The myth of the six-minute rule. ASEE. https://peer.asee.org/the-myth-of-the-six-minute-rule-student-engagement-with-online-videos
- Murphy, D. H., et al. (2022). Learning in double time. Applied Cognitive Psychology. https://onlinelibrary.wiley.com/doi/abs/10.1002/acp.3899
- Höffler, T. N., and Leutner, D. (2007). Instructional animation versus static pictures: a meta-analysis. Learning and Instruction, 17(6). https://www.sciencedirect.com/science/article/abs/pii/S0959475207001077
- Castro-Alonso, J. C., Ayres, P., and Paas, F. (2014). Dynamic visualisations and motor skills. Handbook of Human Centric Visualization. https://link.springer.com/chapter/10.1007/978-1-4614-7485-2_22

Productive failure, refutation, feedback
- Sinha, T., and Kapur, M. (2021). When problem solving followed by instruction works: evidence for productive failure. Review of Educational Research, 91(5). https://journals.sagepub.com/doi/10.3102/00346543211019105
- Loibl, K., Roll, I., and Rummel, N. (2017). Towards a theory of when and how problem solving followed by instruction supports learning. Educational Psychology Review, 29(4). https://link.springer.com/article/10.1007/s10648-016-9379-x
- Muller, D. A., Bewes, J., Sharma, M. D., and Reimann, P. (2008). Saying the wrong thing: improving learning with multimedia by including misconceptions. Journal of Computer Assisted Learning, 24(2). https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1365-2729.2007.00248.x
- Moreno, R. (2004). Decreasing cognitive load for novice students: effects of explanatory versus corrective feedback in discovery-based multimedia. Instructional Science, 32. https://link.springer.com/article/10.1023/B:TRUC.0000021811.66966.1d

Voice principle and TTS
- Craig, S. D., and Schroeder, N. L. (2017). Reconsidering the voice effect when learning from a virtual human. Computers and Education. https://www.sciencedirect.com/science/article/abs/pii/S0360131517301653
- Craig, S. D., and Schroeder, N. L. (2019). Text-to-speech software and learning: investigating the relevancy of the voice effect. Journal of Educational Computing Research. https://journals.sagepub.com/doi/10.1177/0735633118802877
- Dinçer, N. (2022). The voice effect in multimedia instruction revisited: does it still exist? https://www.ijopr.com/article/the-voice-effect-in-multimedia-instruction-revisited-does-it-still-exist-12116
- Chiou, E. K., Schroeder, N. L., and Craig, S. D. (2020). How we trust, perceive, and learn from virtual humans: the influence of voice quality. Computers and Education, 146. https://www.sciencedirect.com/science/article/abs/pii/S0360131519303094
- Siegle, R. F., et al. (2024). The voice quality of pedagogical agent impacts learning and agent perceptions. Journal of Computer Assisted Learning, 40(5). https://onlinelibrary.wiley.com/doi/10.1111/jcal.13027 (abstract via https://www.semanticscholar.org/paper/The-voice-quality-of-pedagogical-agent-impacts-and-Siegle-Craig/a13de6e28e9a1fe64a68f9e1c6be0ebba6cad4fb)
- Real versus AI-generated instructors and human versus synthetic voices in educational videos (2026). Education and Information Technologies. https://link.springer.com/article/10.1007/s10639-026-14085-y

Script and broadcast writing
- TechSmith. How to write a script for a video. https://www.techsmith.com/blog/how-to-write-script-for-video/
- TechSmith. Tutorial videos without a mic or camera. https://www.techsmith.com/blog/create-a-tutorial-video-without-a-mic-or-camera/
- TechSmith Academy. Basics: writing and using scripts. https://www.techsmith.com/learn/tutorials/academy/basics-writing-and-using-scripts/
- NPR Training (2025). Campfire tales: the essentials of writing for radio. https://www.npr.org/sections/npr-training/2025/05/31/g-s1-65875/campfire-tales-the-essentials-of-writing-for-radio (fetch timed out; content from the search index summary)
- Media Helping Media. Quick guide: writing a radio news script. https://mediahelpingmedia.org/quick-guides/writing-a-radio-news-script/
- Journalism University. Scripting for radio (three words a second, 90 words per 30 s). https://journalism.university/broadcast-and-online-journalism/scripting-radio-engaging-broadcasts-blueprint/

ElevenLabs documentation
- Best practices (prompting, pauses, pronunciation, normalization, speed): https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices
- Prompting guide: https://elevenlabs.io/docs/best-practices/prompting
- Eleven v3 prompting: https://elevenlabs.io/docs/best-practices/prompting/eleven-v3
- Text normalization: https://elevenlabs.io/docs/best-practices/prompting/normalization
- Models (character limits, status): https://elevenlabs.io/docs/models
- Text-to-speech API (voice_settings, seed, apply_text_normalization, pronunciation_dictionary_locators): https://elevenlabs.io/docs/api-reference/text-to-speech/convert
- Pronunciation dictionaries guide (phoneme vs alias, model support): https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries
- Eleven v3 audio tags, delivery control: https://elevenlabs.io/blog/eleven-v3-audio-tags-precision-delivery-control-for-ai-speech

Accessibility and captioning
- WCAG 2.2 Understanding 1.2.1 Audio-only and Video-only: https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html
- WCAG 2.2 Understanding 1.2.2 Captions (Prerecorded): https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
- WCAG 2.2 Understanding 1.2.5 Audio Description (Prerecorded), including the 1.2.3 comparison: https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html
- WCAG 2.2 Understanding 1.4.2 Audio Control: https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html
- WCAG 2.2 Understanding 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- WCAG Technique G152 (animated GIF stops within 5 s): https://www.w3.org/WAI/WCAG22/Techniques/general/G152
- W3C WAI, Description of visual information: https://www.w3.org/WAI/media/av/description/
- W3C WAI, Transcripts: https://www.w3.org/WAI/media/av/transcripts/
- DCMP Captioning Key, presentation rate: https://dcmp.org/learn/captioningkey/601
- DCMP Captioning Key, text and line division: https://dcmp.org/learn/captioningkey/597
- DCMP Captioning Key, print version (durations): https://dcmp.org/captioningkey/print
- Netflix English (USA) Timed Text Style Guide: https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide
- Netflix Timed Text Style Guide, general requirements: https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements
- BBC subtitle guidelines. Primary site not reachable from this environment (https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/). Figures taken from the summary at https://www.clevercast.com/bbc-subtitling-guidelines/ and https://www.closedcaptioncreator.com/blog/articles/subtitle-reading-speed.html. Verify against the BBC page before adopting any BBC-specific number.

Repo files read: `.claude/skills/scripts/SKILL.md`, `.claude/agents/script-linter.md`, `.claude/house-style.md`, `.claude/skills/unslop/SKILL.md`, `.claude/skills/audio/SKILL.md`, `.claude/skills/lab/references/guide-format.md`, `scripts/captions.mjs`, `scripts/generate-audio.mjs`, `scripts/transcribe.mjs`, `.env.example`, `CLAUDE.md`, `linux-filesystem-path.md`.
