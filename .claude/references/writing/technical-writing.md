# Technical writing research for the lab-first pipeline

Accessed 2026-09-23. Sources are numbered [S1] to [S53] and listed in section 4.

## 1. Summary

1. The current rules are strong on AI tells, command accuracy, and lab structure. They are thin on procedure grammar (goal-first steps, result lines, error recovery), accessibility, and global English.
2. Four accessibility conflicts matter most. Output shown as screenshots, reference cards shown only as images, and looping GIFs that can't be paused all conflict with WCAG 2.2 (1.4.5 and 2.2.2) and with Red Hat, DigitalOcean, and Google guidance. The topology image's alt text is the single word "environment".
3. Embedded micro-videos have captions but no text alternative. The scripts rule that keeps paths out of the narration leaves blind learners without those strings, unless the page or a transcript carries them (WCAG 1.2.5).
4. Every major guide agrees on these procedure rules: state the goal before the action ("To list inode numbers, run:"), use one action per step, put the result right after it, and give error information at the error-prone step (Google, Microsoft, Red Hat, and the minimalism research).
5. Outline goals use "Understand ...". Objective-writing guidance (Mager/ABCD, CDC) rejects non-observable verbs, and the template and worked example both use one.
6. Voice: use "you" and not "we" or "let's" (Microsoft, Google; Diataxis disagrees). Use common negative contractions. Extend the banned minimizers beyond "simply" to "just", "easy", "obviously", "of course", and "please".
7. Global English: add a short list of ambiguous words (since, while, once, may, e.g., i.e., via) and ban idioms and noun stacks. Target 25 words or fewer per sentence.
8. Hints: use a two-level "point, then bottom-out" ladder, and keep the answer reachable. Learners skip straight to the answer on most steps, and a weak first hint lowers later hint use.
9. Rendering bug: the predict prompt's lettered options (`a.` `b.`) aren't Markdown list syntax, so they run together into one paragraph.

## 2. Findings by research question

### RQ1. Procedure writing

**F1.1 Goal or condition before the action.** Start a step with its purpose when the purpose isn't obvious: "To <goal>, <action>." Put the location first too: "In the **web01 tab**, run ...". Sources: Google procedures [S1]; Microsoft step-by-step [S18]. The Federal Plain Language Guidelines say to put the main idea before conditions [S35, p. 55]. The same page carves out an exception: "If an exception or condition is just a few words, and seeing it first will avoid misleading users, put it at the beginning". Those sources therefore agree for short conditions in steps. DigitalOcean says to "first explain what it does or why" before a command [S31]. Recommendation: purpose first. guide-format.md now says "a sentence of purpose before or after it". Change that to "before".

**F1.2 One action per step, with a narrow exception.** Use one step per action. Short actions in the same place can share a step (Google [S1], Microsoft [S18]). Red Hat puts it as "Each step describes one action written in the imperative form" and "Use a single command per code block" [S24, S25]. For labs, that means one copyable command block per step. Combine only when no output needs checking between the commands.

**F1.3 Imperative mood, and a complete sentence per step.** "Make sure that the first sentence in a procedural step includes an imperative verb" [S1]. Microsoft asks for complete sentences with a capital and a period [S18]. Use "run", not "execute" [S16].

**F1.4 Result right after the action, in the same step.** "State the action first and the result second. Keep the result in the same paragraph" [S1]. Van der Meij and Gellevij's four-component model of a procedure has goals, prerequisite states, unwanted states (warnings and problem-solving information), and actions paired with reactions [S33]. Diataxis says every tutorial step "should produce a comprehensible result, however small" [S26]. Introduce output with "The output is similar to the following" and mark omitted output with `...` on its own line [S2]. For values that vary (PIDs, timestamps, inode numbers), say which values will differ.

**F1.5 Verification at the end of a task.** Red Hat's procedure module has an optional Verification section: expected output, or an action that confirms success [S25]. DigitalOcean ends each step with a transition sentence saying what the reader accomplished [S31]. The lab's `## Check Your Work` and "What You Have Learned" already cover this at module level.

**F1.6 Error information at the error-prone step.** Minimalism's third principle is "Include error recognition and recovery activities in the instruction" [S29, S30]. Lazonder and van der Meij (1995) found learners spend at least 30% of their time on errors. Just-in-time error information raised efficiency, kept self-efficacy high, and improved error-management skill [S32]. Put the fix next to the step where the error happens, not in a troubleshooting section at the end. Red Hat keeps Troubleshooting sections "short" and rarely used [S25]. The rule: when a step has a likely failure (typo in a path, missing `sudo`, the wrong tab), add one line under it, "If you see `<exact error>`, <cause>. <fix>." Keep this separate from the portal-check failure paragraph, which already exists.

**F1.7 Optional steps.** Start the step with "Optional:" and a colon, not a parenthetical [S1]. Google headings allow the same "Optional:" prefix [S12]. The worked example's "Step 4 (stretch, no hint)" is the parenthetical form.

**F1.8 Sub-steps and single steps.** Sub-steps use lowercase letters [S1]. A single-step procedure is a bullet, not a numbered list [S1, S18, S24]. Recommendation: avoid sub-steps in labs. Python-Markdown and mkdocs don't render lettered sub-lists without extensions, so split the step instead.

**F1.9 Procedure length.** Microsoft says "Try to fit all the steps on the same screen" [S18]. No source gives a hard number. My recommendation: split a `##` step group that runs past about 8 steps.

**F1.10 Step groups get context.** Each step group starts with a sentence on what it does and why. Don't "start or end steps with contextless instructions, commands, or output" [S31]. Don't make the intro sentence repeat the heading [S18].

**F1.11 No alternatives in guided labs.** Diataxis: "Ignore options and alternatives" in tutorials [S26]. The faded labs work like Diataxis how-to guides, where conditional imperatives fit: "If you want x, do y" [S27]. Recommendation: fully guided labs show one way. Name an alternative only when the portal check accepts it.

### RQ2. Formatting commands, output, placeholders, UI, keys, paths

**F2.1 Command and output in separate blocks.** Google [S2], Red Hat [S24] ("makes it possible for the copy button in code blocks to work correctly"), and DigitalOcean [S31] all say this. The current rule (output in `text` blocks while drafting) already does it.

**F2.2 Output as screenshots conflicts with accessibility guidance.** guide-format.md says published output is "a rendered terminal screenshot, never a fenced `text` block", because the ATC site adds a copy button to every block. Every source disagrees:
- DigitalOcean: "Don't use images for screenshots of code, configuration files, output, or anything that can be copied and pasted" [S31].
- Red Hat: "Avoid using images of text instead of actual text" [S24].
- WCAG 1.4.5 Images of Text (Level AA): use real text when the technology can present it. A screenshot used only as a stand-in for readable text fails this criterion [S40].
- Google: use screenshots sparingly [S9].

Material for MkDocs can turn off the copy button on one block with `{ .text .no-copy }` [S47]. Recommendation: check whether the ATC renderer supports `.no-copy` (attr_list). If it does, publish output as text blocks without a copy button and drop the screenshots. If it doesn't, keep the screenshots, but make each alt text quote the output lines the learner must match, and keep the "what to look for" sentence in the prose.

**F2.3 No prompt inside a copyable command block.** DigitalOcean says don't put the prompt in the block [S31]. Google makes the prompt optional, says to be consistent, and says "Don't show the current directory path before the prompt" [S2]. Red Hat shows `$` or `#`, but says not to rely on the prompt alone to show privilege; state it in the text [S24]. Killercoda keeps copyable and non-copyable blocks apart [S49]. Recommendation: no prompt in the block. The step text names the host tab, the mode (IOS `configure terminal`, an elevated PowerShell), and the privilege, because the block no longer shows them.

**F2.4 Placeholders: sources disagree.** Google uses `UPPER_SNAKE_CASE` with "Replace X with ..." after the block [S4]. Red Hat uses `<value_name>`, lowercase and italic [S24]. Microsoft uses angle brackets for code placeholders [S20]. DigitalOcean uses highlighted `your_server_ip` [S31]. Recommendation for labs: the environment is fixed, so write the real values (`labuser`, the SETUP.md hostname) and use no placeholders. That keeps commands copy-accurate. When a placeholder can't be avoided (the learner's own choice of name), use Google's `UPPER_SNAKE` form and put "Replace `NAME` with ..." directly under the block. Angle brackets are shell redirection in bash and a reserved operator in PowerShell, so a pasted `<name>` fails with a confusing error. Never use `x` or `xxx` [S4].

**F2.5 UI element names.** Bold the label, match its capitalization, and leave the element type out unless it's needed ("click **Save**", not "click the **Save** button"). Use "select" and "enter". Don't use "hit" [S5, S16, S19]. Write menu paths as **File > Open** [S5]. Microsoft warns that screen readers may skip the `>` [S18]. Don't use a trailing ellipsis from a button name [S5, S19]. Red Hat: "use 'enter' as opposed to 'type'", with the entered text in monospace [S24].

**F2.6 Keys.** Google uses `<kbd>` and spells out modifiers (Control+S) [S5]. Microsoft uses bold Ctrl+Alt+Del with no spaces around the plus [S19]. Recommendation: follow Microsoft (Ctrl+C, Ctrl+X), because terminal keys are labeled Ctrl and learners see "^C" on screen. Use `<kbd>` or `++ctrl+c++` if the ATC site enables pymdownx.keys. Otherwise use bold.

**F2.7 File names and paths.** Use code font and add the word "file": "In the `build.sh` file" [S15]. Name file types, not extensions ("a YAML file", not "a `.yaml` file") [S15].

**F2.8 Don't use commands or abbreviations as verbs.** "Use SSH to log in", not "ssh into" [S14]. "Extract", not "untar" [S16].

**F2.9 Error messages in prose.** Microsoft puts quoted error messages in quotation marks [S19]. In terminal labs the string is literal output, so code font (`No such file or directory`) is the consistent choice. Keep the exact case and wording.

### RQ3. Conceptual writing inside tutorials

**F3.1 How much "why": sources disagree.** Diataxis says "A tutorial is not the place for explanation" and to "Ruthlessly minimise explanation", pointing out what to notice instead [S26]. DigitalOcean says "Every command should have a detailed explanation" [S31]. Minimalism says to minimize passive reading and to "separate conceptual and background information from procedural tasks" [S24, S30]. The house 4C/ID rule already resolves this: supportive "why" goes in the briefing, micro-videos, and cards, and procedural help goes at the step. Recommendation: one sentence of purpose per new command (before it) and one "what to notice" sentence after the output. Anything longer goes in a note or the video. The worked example follows this.

**F3.2 Lead with the point.** Put the most important information first. Start headings with the words that carry the meaning: "if users see only the first 2 words, they should still get the gist" [S53]. The Federal Plain Language Guidelines say to open paragraphs with a topic sentence [S35]. Write the Docs: headings "should be descriptive and concise" [S28].

**F3.3 Paragraph and sentence length.** FPLG: "no more than 150 words in three to eight sentences", never over 250, and an occasional one-sentence paragraph is fine [S35]. Google accessibility: "Aim for sentences under 26 words" [S10]. For a lab page read beside a terminal, I recommend paragraphs of 5 sentences or fewer.

**F3.4 Headings.** Google, Microsoft, and Red Hat use sentence case [S12, S18, S24]. The WWT Title Case exception is a deliberate platform choice. Keep it and note that it's a known departure. For task headings, use the imperative ("Create a hard link"). Red Hat now says "Do not use gerunds", and Google says the same [S12, S24]. DigitalOcean's gerund step headings ("Installing Nginx") are the outlier [S31]. Headings run 3 to 11 words [S24]. Don't open a heading with "Understanding" [S24]. Don't put code or links in headings, and don't skip heading levels [S12].

**F3.5 Admonitions.** Red Hat: keep them few, and "Do not include procedures in an admonition". A NOTE is optional advice. IMPORTANT is information users must not ignore. A WARNING covers data loss or damage and explains the problem, the cause, and the fix [S24]. guide-format.md uses `!!! note` for "gotchas". A gotcha that makes the step fail belongs in the step itself, or in a `!!! warning` placed before the step. lab-learner already flags a note that is really a required step.

### RQ4. Hints, troubleshooting, and goal-only tasks

**F4.1 Testable goals.** A learning objective names an observable behavior, the condition, and the degree (ABCD, after Mager). Avoid "understand", "know", and "learn" [S52]. The outline template ("what the learner can do and understand by the end") and the worked example ("Goal: Understand what a filename really is") both break this. Recommended goal form: "Explain why a hard link survives deletion and a symlink doesn't." Or, for a task: "Make `run.sh` executable by you and your group, not by others."

**F4.2 Goal-only steps need one defensible end state.** For the check scripts, Instruqt's lesson is not to make them "too complex or specific", because learners reach correct states the script rejects [S48]. Lab-review already tests alternate correct solutions. Writing rule: a goal-only step names the object (exact path or host), the end state, any constraint ("leave `/etc` unchanged"), and how learners can check their own work. The goal must match the portal check's pass condition. If two careful learners could build different end states from the same words, rewrite the goal.

**F4.3 Progressive hints: point, then bottom-out.** Tutoring systems order hints as pointing (where to look), teaching (the principle), and bottom-out (the answer). Keep a bottom-out hint reachable so stuck learners can continue [S50]. Aleven and Koedinger found students skipped straight to bottom-out hints on 82% to 89% of steps (reported in [S50]). Price et al. found the quality of the first few hints predicts later hint use [S50]. Aleven et al. (2016) found help-seeking feedback changed hint use but not learning outcomes [S51]. Recommendation: two collapsed levels. "Hint" names the tool or where to look. "Answer" gives the exact command. Make the first hint specific enough to act on, because a vague first hint teaches learners to skip hints. Guidance fading still decides which levels a lab shows.

**F4.4 Fail messages.** Instruqt check scripts return a fail message naming what's missing, for example "There is no directory named instruqt, did you create it?" [S48]. If the WWT portal shows check output, each SETUP.md check row should carry that message. The page's "if it fails" sentence already covers part of this.

### RQ5. Accessibility

**F5.1 Looping GIFs conflict with WCAG 2.2.2 (Level A).** Moving content that "starts automatically", "lasts more than five seconds", and "is presented in parallel with other content" needs a way to pause, stop, or hide it [S38]. House GIFs run 5 to 15 s and loop forever with no control. ASU's guide gives three options: a play button, a pause button, or looping for under 5 s [S46]. Google says "Don't use animated GIFs" and recommends MP4 [S9]. Recommendation: deliver the GIF-type item as a muted looping MP4 with visible controls (`<video autoplay loop muted playsinline controls>`), or as a GIF behind a click-to-play wrapper. It stays a short silent loop for design purposes. This changes house-style.md, guide-format.md, CLAUDE.md, and `/video`.

**F5.2 Alt text for a terminal GIF.** Describe the action and the end state. Quote the typed text and resulting text verbatim, because it's text in an image [S45]. Don't start with "Image of" or "GIF of". Stay under about 155 characters [S9]. Don't repeat the step text word for word [S44, S45]. The current example, "Typing cd /us and pressing Tab completes it to /usr/ (8 s loop)", meets all of this. Keep it as the model. The loop length can stay in the visible label instead of the alt text.

**F5.3 Alt text for output screenshots.** If screenshots stay (F2.2), the alt text must carry the lines the learner compares against, verbatim. "Terminal output of ls -l" is not enough [S40, S45].

**F5.4 Diagrams need a short alt plus a long description.** A diagram the text relies on needs a short alt that identifies it and a long description nearby [S43]. guide-format.md's `![environment](./media/environment/lab-topology.svg)` has "environment" as its alt text. Recommendation: alt names the devices and addresses briefly, and the Device Access Information table serves as the long description.

**F5.5 Reference cards are images of text.** Red Hat names "a screen capture image of an informational table" as a failure [S24]. WCAG 1.4.5 applies [S40]. The Reference Cards page shows only `![<card title>](...)`. Recommendation: put the card's content under each image as a Markdown table or list, collapsed if needed, taken from the card's `## Card layout`.

**F5.6 Videos need all visual information in audio or in text.** Audio description isn't needed when "all of the important information in the video track is already conveyed in the audio track" [S39]. The scripts skill tells narration to leave paths out and show them only on screen. That's right for TTS, but it leaves the exact strings visual-only. Recommendation: put a collapsed "Transcript" under each embedded video, built from the narration with the visual brief's on-screen strings added. Or make sure the adjacent step text already contains every string the video shows.

**F5.7 Link text and directional language.** Link text should make sense out of context. Don't use "click here" [S10, S11, S28]. Put the important words first [S11]. Don't write "above", "below", or "right-hand side". Write "the previous step" or "the following output" [S10, S24].

**F5.8 Color and sensory cues.** Don't use color as the only means of conveying information [S42]. In prose, "the line in green" or "the red text" needs a text marker too: quote the string.

**F5.9 Tables.** Use a header row. Don't merge cells or use tables for layout [S10]. Markdown tables comply if the header cells aren't empty.

**F5.10 Reading level.** WCAG 3.1.5 (AAA) targets lower secondary level (grades 7 to 9), with proper names excluded [S41]. ISO 24495-1 defines plain language by outcome: readers can find, understand, and use the information, under four principles (relevant, findable, understandable, usable) [S37]. Recommendation: no hard grade target for IT professionals. Enforce the 25-word sentence cap (F3.3), define abbreviations on first use [S14], and treat lab-learner as the "understandable and usable" test.

### RQ6. Global English

**F6.1 Structure.** Use short sentences in subject, verb, object order. Keep "that", "who", and articles [S7, S21]. Stack at most two nouns before a noun [S7]. Link at most two or three clauses with and, or, or but [S21]. Place "only" right next to what it modifies [S21].

**F6.2 Ambiguous words.** "since" becomes "because" [S16]. "while" for contrast becomes "although" [S16]. "e.g." and "i.e." become "for example" and "that is" [S14, S16]. Drop "via" [S16]. "may" means permission; for possibility use "might" or "can" [S16]. Watch -ing and -ed words that could be noun, adjective, or verb [S21]. "once" as "after" is ambiguous (inference from the same logic; Google's entry covers the related term "nonce").

**F6.3 Phrasal verbs, idioms, humor.** Replace a phrasal verb with a single verb where one exists. "Set up" and "log in" are fine [S7]. Don't use idioms, colloquialisms, culture-specific references, or humor [S7, S21]. Tech idioms like "under the hood", "out of the box", "spin up", and "sanity check" [S16] count.

**F6.4 One term per concept.** "Use one word for a concept, and use it consistently" [S21]. Unslop rule 11 covers synonym cycling already. Also avoid using one word for two concepts, such as "check" for both the portal check and a learner's own verification.

### RQ7. Voice and tone

**F7.1 Second person, not "we": sources disagree.** Microsoft: "Avoid plural first person (we, us)" [S23]. Google bans "let's" [S6]. Diataxis recommends first-person plural in tutorials [S26], and DigitalOcean allows "we" [S31]. Recommendation: use "you". In WWT material "we" reads as WWT, and the article skill already says second person.

**F7.2 Contractions: sources disagree.** Google recommends negative contractions ("it's harder to misread don't as do") [S8]. Microsoft uses common contractions, but never noun plus verb, and never ambiguous ones like "it'll" or "they'd" [S22]. Red Hat avoids contractions in product docs and allows them in conversational content [S24]. lab-review lists "piled-up contractions" as a tell. Recommendation: allow don't, isn't, can't, it's, and you're. Ban noun plus verb ("the file's ready"), 'd, and 'll. Keep the "piled-up" check as a density judgment, not a ban.

**F7.3 Minimizers and filler.** Remove "simply", "easy", "easily", and "just" [S16] ("What might be simple for you might not be simple for others"). Google also bans "quickly" in procedures, "please" in instructions, and "please note" [S6, S16]. DigitalOcean's current guide bans "obviously" and "straightforward", but the mirror I read doesn't contain that list, so treat that part as unverified. Unslop and prose-checker cover only "simply", "exactly", "actually", and "genuinely".

**F7.4 Present tense.** "Use present tense for statements that describe general behavior". Use "will" only for real future events, and don't use hypothetical "would" [S13]. digital.gov says the same [S36].

**F7.5 Mistakes and encouragement.** Frame problems by condition, not blame: "If the output shows `644`, the file isn't executable yet" rather than "You forgot to ...". Microsoft's own example: "That didn't work. Try again." [S23]. No exclamation marks and no cuteness [S6]. Diataxis builds confidence through visible results, not praise [S26]. The mandated closing paragraph is the only congratulation.

### RQ8. What a technical editor would flag in the current files

1. **Predict options don't render as a list** (guide-format.md "Predict"). `a. It gets deleted` on consecutive lines is not Markdown list syntax, so the options join into one paragraph. Use a bulleted list with the letters in the text (`- a. It gets deleted`) or separate lines with a blank line between them. Verify on the ATC renderer.
2. **Output screenshots, image-only cards, looping GIFs, and topology alt text** (F2.2, F5.1, F5.4, F5.5).
3. **"Understand" goals** in the outline template and the worked example (F4.1).
4. **Worked example inconsistencies** (`linux-filesystem-path.md`, outside the target list). Lab 1 expects `/home/student`, while the platform default is `labuser`. Lab 3 steps 1 and 2 ask the learner to predict after the command block has already run. Lab 2 step 4 and Lab 4 step 4 give the answer inline instead of in a collapsed reveal. "Step 4 (stretch, no hint)" should be "Optional:".
5. **Unslop rule 24** rewrites hedging to "may". Google reserves "may" for permission (F6.2), so "might" is the better target.
6. **No placeholder, UI, key, or path formatting rules** anywhere (F2.4 to F2.7).
7. **No error-recovery lines** at error-prone steps (F1.6).
8. **Notes used for gotchas** (F3.5).
9. **No link-text or directional-language rule** (F5.7).
10. **No platform-authoring source exists for Microsoft Learn exercises or AWS Workshop Studio writing style.** Microsoft Learn training modules don't take outside contributions, and the Workshop Studio docs I reached have no concrete writing rules. Instruqt and Killercoda document mechanics (check scripts, fail messages, copy and exec blocks), not prose style [S48, S49].

## 3. Recommendations mapped to files

Status: **new** (no current rule), **covered** (already in the files, refinement only), **CONFLICT** (contradicts a current rule; left unresolved for the user).

| # | Rule | Target file | Status | Proposed wording |
|---|---|---|---|---|
| 1 | Purpose before the command | guide-format.md, Module pages | CONFLICT (current text allows "before or after") | "Every command gets a sentence of purpose before it, goal first: 'To list inode numbers with their names, run:'. The sentence after the output says what to notice." |
| 2 | Location before action | guide-format.md, House rules | covered (tab names) | Add: "Put the place first: 'In the **web01 tab**, run ...', 'In the `/etc/ssh/sshd_config` file, find ...'." |
| 3 | One command block per step | guide-format.md, Module pages | covered | Add: "Combine actions in one step only when they happen in the same place and nothing needs checking between them." |
| 4 | Result right after the action, variable values named | guide-format.md, Command output | new | "Introduce output with 'The output is similar to the following:' when values vary, and name them: 'Your inode numbers differ.' Mark cut output with `...` on its own line." |
| 5 | Error line at error-prone steps | guide-format.md, Module pages | new | "Where a step commonly fails (a mistyped path, missing `sudo`, the wrong tab), add one line under it: 'If you see `Permission denied`, you ran it without `sudo`. Run it again with `sudo`.' Name the exact error text." |
| 6 | Label deliberate failures | guide-format.md, Module pages | new | "When a step fails on purpose outside a predict prompt, say so first and show the exact error: 'This command fails. Read the error it prints.'" |
| 7 | Optional steps | guide-format.md, Lab-first pages | CONFLICT (worked example uses "(stretch, no hint)") | "Start an optional or stretch step with `**Optional:**`. Nothing after it may depend on it." |
| 8 | No sub-steps | guide-format.md, Module pages | new | "Don't nest sub-steps. Split them into numbered steps. A group with one step uses a bullet, not a number." |
| 9 | Step-group intro sentence | guide-format.md, Module pages | new | "Open each `##` step group with one sentence on what it does and why. Don't repeat the heading." |
| 10 | No alternatives in guided labs | guide-format.md, Guidance levels | new | "In the first two guidance levels, show one way to do each task. Mention an alternative only if the portal check accepts it." |
| 11 | Warnings before destructive steps; no required steps in notes | guide-format.md, Module pages | CONFLICT (notes are listed for "gotchas") | "A gotcha that makes a step fail goes in the step or in a `!!! warning` placed before it, with problem, cause, and fix. Notes hold optional context only and never contain a step." |
| 12 | Output as real text, not screenshots | guide-format.md, Command output | CONFLICT (current rule mandates screenshots) | "If the ATC renderer supports `{ .text .no-copy }`, publish output as text blocks without a copy button. Otherwise every output screenshot's alt text quotes, verbatim, the lines the learner must match." |
| 13 | No prompt in copyable blocks; state host, mode, privilege | guide-format.md, House rules | covered (implicit) | "Command blocks hold the command only, no prompt. The step text names the tab, the mode (`configure terminal`, elevated PowerShell), and whether `sudo` is needed." |
| 14 | Placeholders | house-style.md, Learner-facing prose; guide-format.md | new | "Use the lab's real values (`labuser`, the SETUP.md hostname), not placeholders. If a value is the learner's choice, write it as `UPPER_SNAKE` and put 'Replace `NAME` with ...' under the block. Never use `<name>`, which bash and PowerShell treat as an operator." |
| 15 | UI element names | guide-format.md, House rules | new | "Bold UI labels exactly as they appear and leave out the element type: 'select **Save**'. Write menu paths as **File > Open**. Use 'select' and 'enter'; never 'hit' or 'click on'." |
| 16 | Keys | guide-format.md, House rules | new | "Write keys as they're labeled, in bold: **Tab**, **Enter**, **Ctrl+C**, no spaces around the plus. Use `<kbd>` if the site styles it." |
| 17 | File paths | house-style.md, Learner-facing prose | new | "Put file and directory names in code font and name the thing: 'the `/etc/hostname` file', 'the `~/linklab` directory'." |
| 18 | No command names as verbs | unslop, Course content; prose-checker | new | "Don't use a command or protocol as a verb ('ssh into', 'grep for', 'chmod it'). Write 'connect with SSH', 'search with `grep`', 'change its mode with `chmod`'." |
| 19 | Looping GIFs need pause control | house-style.md, Media types; guide-format.md, GIF; CLAUDE.md; /video | CONFLICT (GIFs loop forever with no control) | "A loop longer than 5 seconds needs a pause control (WCAG 2.2.2). Deliver loops as muted MP4 `<video autoplay loop muted playsinline controls>`, or behind a click-to-play." |
| 20 | GIF alt text formula | guide-format.md, GIF | covered | "Alt text gives the action and end state with the typed text verbatim, under 155 characters, and never starts with 'GIF of' or 'Image of'." |
| 21 | Topology alt text | guide-format.md, environment.md | CONFLICT (alt is "environment") | "`![Lab topology: one Ubuntu 24.04 VM, ubuntu-lab, 192.0.2.10, on the management network](./media/environment/lab-topology.svg)`. The Device Access Information table is the long description." |
| 22 | Card text alternative | guide-format.md, Reference cards | CONFLICT (image only) | "Under each card image, give its content as a Markdown table or list from the card's `## Card layout`, so the card isn't an image of text only." |
| 23 | Video transcript | guide-format.md, Video; scripts skill (outside list) | CONFLICT (scripts keeps paths off the audio, and no text alternative exists) | "Under each video, add a collapsed `<details><summary>Transcript</summary>` built from the narration, with every on-screen command and path from the visual brief written in real syntax." |
| 24 | Link text and directional words | house-style.md, Learner-facing prose | new | "Link text names the destination and makes sense alone; never 'here' or 'this page'. Don't write 'above', 'below', or 'on the right'. Write 'the previous step' or 'the following output'." |
| 25 | Color never alone | house-style.md, Learner-facing prose | new | "Never point at something by color alone ('the green line'). Quote the string instead." |
| 26 | Tables | guide-format.md, Module pages | new | "Every table has a header row with no empty cells, no merged cells, and no layout use." |
| 27 | Sentence and paragraph length | unslop, rule 28; prose-checker | new (numeric cap) | "Flag lab and article sentences over 25 words, and paragraphs over 5 sentences. Narration is exempt; the TTS rule wants flowing sentences." |
| 28 | Global English word list | house-style.md, Learner-facing prose; prose-checker | new | "Write for non-native readers: keep 'that' and articles; 'because' not 'since'; 'although' not 'while' for contrast; 'after' not 'once'; 'for example' not 'e.g.'; 'that is' not 'i.e.'; no 'via'; 'run' not 'execute'; no idioms ('under the hood', 'out of the box', 'spin up'); at most two nouns stacked before a noun." |
| 29 | "may" for possibility | unslop, rule 24 | CONFLICT (rule 24 rewrites hedges to "may") | Change the example to: "... becomes 'might'. Use 'may' only for permission." |
| 30 | Minimizers | unslop, rule 23 or Course content; lab-review step 6 grep; prose-checker | covered in part ("simply") | "Delete 'just', 'simply', 'easy', 'easily', 'obviously', 'of course', 'quickly', 'straightforward', and 'please'. What is easy for the author isn't easy for the learner." Add `just\|easy\|easily\|obviously\|of course\|quickly\|straightforward\|please` to the lab-review grep. |
| 31 | "you", not "we" or "let's" | house-style.md, Learner-facing prose | new | "Address the learner as 'you'. Don't use 'we', 'us', or 'let's'; in WWT material 'we' reads as WWT." |
| 32 | Contractions | house-style.md; lab-review step 4 | CONFLICT (lab-review treats contractions as a tell) | "Use common contractions (don't, isn't, can't, it's, you're). Never noun plus verb ('the file's ready'), and never 'd or 'll. 'Piled-up' means several per sentence, not any use." |
| 33 | Present tense | house-style.md, Learner-facing prose | new | "Describe behavior in the present tense ('`ls` lists'), not 'will'. Use 'will' only for something that happens later in the lab." |
| 34 | No blame, no praise | house-style.md, Learner-facing prose | new | "Describe problems by what's on screen, not by what the learner did wrong: 'If the mode shows `644`, the file isn't executable yet.' No exclamation marks and no praise; the closing Congratulations paragraph is the only one." |
| 35 | Observable goals | outline SKILL.md, Template and Style; linux-filesystem-path.md | CONFLICT (template says "can do and understand"; example says "Understand what a filename really is") | "Goals use an observable verb (explain, create, find, fix, predict, compare), never 'understand', 'know', or 'learn'. Example: 'Explain why a hard link survives deletion and a symlink doesn't.'" |
| 36 | Goal-only task anatomy | guide-format.md, Guidance levels; outline SKILL.md | new | "A goal-only step names the object (exact path or host), the end state, any constraint ('leave `/etc` unchanged'), and how learners can check it themselves. The words match the portal check's pass condition." |
| 37 | Ambiguous goals | lab-learner.md, Walk | new | "Could two careful learners read this goal and build different end states? If yes, report CLARIFY, or BLOCKING if the portal check would fail one of them." |
| 38 | Two-level hints | guide-format.md, Hints; lab SKILL.md, capstone | new (extension) | "Collapsed hints come in two levels: 'Hint' names the tool or where to look, and 'Answer' gives the exact command. Make the first hint specific enough to act on." |
| 39 | Fail message per portal check | lab skill references/internal-docs.md, Portal checks | new | "Add a `Fail message` column: one sentence naming the unmet condition, e.g. '`run.sh` is not executable by the group.'" |
| 40 | Task headings | guide-format.md, House rules | covered (Title Case); new (form) | "Task headings start with an imperative verb ('Create a Hard Link'), 3 to 11 words, no gerunds, no 'Understanding', no code. WWT Title Case stays, a known departure from the Google, Microsoft, and Red Hat sentence-case rule." |
| 41 | Predict options render | guide-format.md, Predict | CONFLICT (current markup renders as one paragraph) | "Write options as a bulleted list, `- a. It gets deleted`, so each renders on its own line." |
| 42 | Front-loading in articles | article SKILL.md, Writing | new | "The first sentence under each H2 states that section's idea. Headings start with their information-carrying words." |
| 43 | Articles show output as text | article SKILL.md, Writing | covered ("terminal transcripts with real output") | Add: "Put commands and output in separate blocks, output introduced with 'The output is similar to the following:'." |
| 44 | lab-learner reads alt text | lab-learner.md, Walk | new | "Read every image's alt text as if the image failed to load. Flag any step you couldn't complete from the alt text and prose alone." |
| 45 | lab-learner checks recovery | lab-learner.md, Walk | new | "At each step, ask: if this fails, does the page tell me what the failure looks like and what to do? Flag likely failures with no recovery line." |
| 46 | prose-checker flags new rules | prose-checker.md, What to flag | new | Add: "minimizers (rule 30 list), 'we' or 'let's', directional words ('above', 'below'), 'e.g.', 'i.e.', 'via', 'since' meaning because, 'while' meaning although, 'may' for possibility, commands used as verbs, sentences over 25 words, link text 'here'." |
| 47 | Worked example fixes | linux-filesystem-path.md (outside list) | CONFLICT (breaks its own rules) | "`/home/student` becomes `/home/labuser`; Lab 3 predict prompts move before their command blocks; Lab 2 step 4 and Lab 4 step 4 answers move into collapsed reveals; 'Step 4 (stretch, no hint)' becomes 'Optional:'; the Lab 3 goal gets an observable verb." |

## 4. Sources

All accessed 2026-09-23.

- [S1] Google developer documentation style guide, Procedures. https://developers.google.com/style/procedures
- [S2] Google, Document command-line syntax. https://developers.google.com/style/code-syntax
- [S3] Google, Code samples. https://developers.google.com/style/code-samples
- [S4] Google, Placeholders. https://developers.google.com/style/placeholders
- [S5] Google, UI elements and interaction. https://developers.google.com/style/ui-elements
- [S6] Google, Voice and tone. https://developers.google.com/style/tone
- [S7] Google, Write for a global audience. https://developers.google.com/style/translation
- [S8] Google, Contractions. https://developers.google.com/style/contractions
- [S9] Google, Images. https://developers.google.com/style/images
- [S10] Google, Accessible documentation. https://developers.google.com/style/accessibility
- [S11] Google, Link text. https://developers.google.com/style/link-text
- [S12] Google, Headings and titles. https://developers.google.com/style/headings
- [S13] Google, Tense. https://developers.google.com/style/tense
- [S14] Google, Abbreviations. https://developers.google.com/style/abbreviations
- [S15] Google, Filenames and file types. https://developers.google.com/style/filenames
- [S16] Google, Word list. https://developers.google.com/style/word-list
- [S17] Google, Lists. https://developers.google.com/style/lists
- [S18] Microsoft Writing Style Guide, Writing step-by-step instructions. https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions
- [S19] Microsoft, Formatting text in instructions. https://learn.microsoft.com/en-us/style-guide/procedures-instructions/formatting-text-in-instructions
- [S20] Microsoft, Formatting developer text elements. https://learn.microsoft.com/en-us/style-guide/developer-content/formatting-developer-text-elements
- [S21] Microsoft, Global communications writing tips. https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips
- [S22] Microsoft, Use contractions. https://learn.microsoft.com/en-us/style-guide/word-choice/use-contractions
- [S23] Microsoft, Person. https://learn.microsoft.com/en-us/style-guide/grammar/person
- [S24] Red Hat supplementary style guide for product documentation (sections: Commands in code blocks, User-replaced values, Commands requiring root privileges, Admonitions, Contractions, Minimalism, Titles and headings, Screenshots, Text entry, Accessibility). https://redhat-documentation.github.io/supplementary-style-guide/
- [S25] Red Hat modular documentation reference guide (procedure module). https://redhat-documentation.github.io/modular-docs/
- [S31] DigitalOcean's Technical Writing Guidelines. https://www.digitalocean.com/community/tutorials/digitalocean-s-technical-writing-guidelines (the live page renders by script, so the text was read from the mirror https://github.com/opendocs-md/do-tutorials/blob/master/md/en/digitalocean-s-technical-writing-guidelines.md, which may lag the live version)
- [S26] Diataxis, Tutorials. https://diataxis.fr/tutorials/
- [S27] Diataxis, How-to guides. https://diataxis.fr/how-to-guides/
- [S28] Write the Docs, Documentation principles. https://www.writethedocs.org/guide/writing/docs-principles/
- [S29] Minimalism (J. Carroll), InstructionalDesign.org. https://www.instructionaldesign.org/theories/minimalism/
- [S30] van der Meij, H. and Carroll, J. M. (1995). Principles and heuristics for designing minimalist instruction. Technical Communication 42(2). ERIC record: https://eric.ed.gov/?id=EJ504916
- [S32] Lazonder, A. W. and van der Meij, H. (1995). Error-information in tutorial documentation. International Journal of Human-Computer Studies 42(2), 185-206. https://www.sciencedirect.com/science/article/abs/pii/S1071581985710099
- [S33] van der Meij, H. and Gellevij, M. (2004). The four components of a procedure. IEEE Transactions on Professional Communication 47(1), 5-14. https://research.utwente.nl/en/publications/the-four-components-of-procedures/
- [S34] Eiriksdottir, E. and Catrambone, R. (2011). Procedural instructions, principles, and examples. Human Factors 53(6), 749-770. https://journals.sagepub.com/doi/abs/10.1177/0018720811419154 (abstract only; cited for the performance versus learning trade-off in instruction design)
- [S35] Federal Plain Language Guidelines, March 2011, Rev. 1 May 2011 (short sentences, short paragraphs, main idea before conditions). https://digitalgovernmenthub.org/wp-content/uploads/2022/07/FederalPLGuidelines.pdf
- [S36] digital.gov, Writing for understanding (plain language). https://digital.gov/guides/plain-language/writing (plainlanguage.gov/guidelines now redirects to https://digital.gov/guides/plain-language)
- [S37] ISO 24495-1:2023, Plain language, Part 1: Governing principles and guidelines. https://www.iso.org/standard/78907.html (the ISO page returned 403; the principles were read at https://www.iplfederation.org/iso-standard/)
- [S38] W3C, Understanding SC 2.2.2 Pause, Stop, Hide. https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- [S39] W3C, Understanding SC 1.2.5 Audio Description (Prerecorded). https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html
- [S40] W3C, Understanding SC 1.4.5 Images of Text. https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html
- [S41] W3C, Understanding SC 3.1.5 Reading Level. https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html
- [S42] W3C, Understanding SC 1.4.1 Use of Color. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- [S43] W3C WAI Images tutorial, Complex images. https://www.w3.org/WAI/tutorials/images/complex/
- [S44] W3C WAI Images tutorial, Informative images. https://www.w3.org/WAI/tutorials/images/informative/
- [S45] Section508.gov, Authoring meaningful alternative text. https://www.section508.gov/create/alternative-text/
- [S46] Arizona State University Digital Accessibility, Accessible images: animation guidelines. https://accessibility.asu.edu/articles/animation
- [S47] Material for MkDocs, Code blocks (per-block `.no-copy`). https://squidfunk.github.io/mkdocs-material/reference/code-blocks/
- [S48] Instruqt Docs, Challenge check scripts and fail messages. https://docs.instruqt.com/sandboxes/lifecycle-scripts/add-a-script-to-check-challenge-execution
- [S49] Killercoda, Creators documentation (verification scripts, copy and exec code blocks). https://killercoda.com/creators
- [S50] Price, T. W., Zhi, R. and Barnes, T. (2017). Hint generation under uncertainty: the effect of hint quality on help-seeking behavior. AIED 2017. https://isnap.csc.ncsu.edu/home/public/papers/PriceAIED2017.pdf (source for point, teach, and bottom-out hint levels, and for Aleven and Koedinger's 82% to 89% bottom-out figure)
- [S51] Aleven, V., Roll, I., McLaren, B. M. and Koedinger, K. R. (2016). Help helps, but only so much. International Journal of Artificial Intelligence in Education 26(1), 205-223. https://eric.ed.gov/?id=EJ1091255
- [S52] CDC, Design training: learning objectives (ABCD model, verbs to avoid). https://www.cdc.gov/training-development/php/about/design-training-learning-objectives.html
- [S53] Nielsen Norman Group, F-shaped pattern of reading on the web. https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
