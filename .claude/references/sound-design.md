---
mode: reference
subject: Sound design for narrated technical explainers (music bed, sound effects, holds)
baseline: WCAG 2.2; ITU-R BS.1770-5; EBU R 128 v5.0; H.264 + AAC-LC MP4 for a web course player and YouTube-style platforms; ElevenLabs eleven_v3 narration; Remotion per-frame volume; ffmpeg with loudnorm only
researched: 2026-09-24
sources: 73
---

# Sound Design for Narrated Explainers: research brief

## Summary

- **One target:** master every video, chapter, and micro-video to **-16 LUFS integrated (±0.5 LU)**, **true peak -1.5 dBTP before encoding and -1.0 dBTP or lower on the decoded AAC**. Web course players don't normalize, YouTube only turns loud uploads down, and -16 LUFS sits at the top of the AES and Apple speech windows [13][16][17][21].
- **Music under speech: at least 20 LU below the voice stem (house target 22 LU).** That's the WCAG 1.4.7 number [1]. It's far stricter than broadcast practice (a 4 LU floor, about 10 LU preferred by listeners [23][24]), and it fits "very low". 1.4.7 formally covers audio-only content, so for video it's a house rule, not a conformance requirement [1].
- **Holds:** lift the bed about 10 dB, to about 12 LU below voice, only in gaps of 1.5 s or more, and never above voice minus 8 LU. Duck with scripted curves driven by the transcript, not a sidechain compressor.
- **Evidence on music is mixed.** Moreno and Mayer found that a bland instrumental loop hurt retention and transfer even though it didn't mask the narration [42]. Seductive-detail meta-analyses find small harms [44][45]. A 2023 meta-analysis found a small benefit (d = 0.31), mostly from music played *before* testing, not under narration [47]. Treat the bed as a cost you keep small.
- **Pick calm tracks:** instrumental, sustained (legato), sparse, slow to moderate tempo, no lead line in 1-4 kHz. Lyrics, fast-and-loud tracks, and staccato changing-state textures are the most disruptive [51][53][54][55]. The 1-4 kHz octave bands carry about 72% of speech-intelligibility weight [41].
- **Sound effects:** 2-4 per chapter, only on visual events, never over a spoken word, one meaning per sound across the series. Onset on the event frame, never early [57][58][59][72].
- **Captions:** don't caption the bed under speech. Add one bracketed music cue only for a music-only stretch of 5 s or more. Caption an effect only if it carries meaning the picture and narration don't [3][61][62][63].
- **Measure with `loudnorm` only:** use a two-pass JSON measurement per stem and per slice (`-ss`/`-t`). Normalize with gain only (linear mode, or computed gain). Never use dynamic mode on a mix: it re-rides the music curves and outputs 192 kHz [35][37].
- **Repo conflict (resolved 2026-09-24):** the user decided every narrated video gets a very low bed and sparse effects. CLAUDE.md, `writing/video-scripts.md` and `video-design/01-instructional-evidence.md` now point here; the coherence evidence above is why the bed stays at -22 LU and the effects stay few.

## Rules

**House mix (the user's listen on li-v6-ch1, 2026-09-24). Where these differ from the numbered rules and the cheat sheet below, these win.**
- **The title is silent apart from its effect.** The music starts as the title card leaves, fading in over the title's own fade-out, so the first narration line may run with no music under it.
- **The bed sits at voice minus 34 LU**, flat: the equivalent of the user's usual -40 dB of music gain in Premiere on a typically mastered (about -14 LUFS) track under raw ElevenLabs narration (about -20 LUFS). A bed at voice minus 25 was distracting.
- **No lifts in normal holds** (scene-change holds of about 1-2 s) and none in the tail. The bed stays level to the last frame.
- **Only a slight lift, +3 dB or less, eased, in a key-animation hold of about 2.5 s or more** (the reveal). If the music's own arrangement already swells there, count that swell in the +3 dB.
- **Effects sit at voice minus 16-17 LU momentary** (about -32 to -33 LUFS against a -16 voice), not the -10 to -14 in the numbered rules: at -11/-12 the user found them too present on headphones. They still sit well above the bed.
- **Bake the music envelope into the file.** Remotion rounds `<Audio>` volume to steps of 0.01, which at bed gains of 0.01-0.05 means errors of up to ±3.5 dB and audible 6 dB jumps (found on li-v6-ch1). Apply the music envelope offline, per sample, and play the file at volume 1 (`gainDb: 0`). Effects at gains of about 0.3 or more are fine left in mix.json.
- **Slow, inaudible gain compensation is fine and expected.** It keeps a track that builds at a steady level under the voice. Move it over several seconds, never inside a short gap.


1. Master each deliverable to **-16.0 LUFS integrated, ±0.5 LU**, measured per BS.1770-5 over the whole file [12][13][16][17][5].
2. Keep true peak at or below **-1.5 dBTP** in the pre-encode mix and at or below **-1.0 dBTP** measured on the decoded MP4 [5][11][13][14][17][18].
3. Report loudness range. Expect **4-10 LU**; investigate anything over 12 LU [9][10].
4. Keep music under speech at least **20 LU** below the voice stem. Aim for **22 LU** [1][2].
5. Never let music rise above **voice minus 8 LU**, including titles, holds, and tails. Holds default to **voice minus 12 LU** [23][27].
6. Duck with volume curves scripted from transcript word times. Start the down-ramp **0.3 s** before the first word and reach bed level at word onset. Start the up-ramp **0.25 s** after the last word ends and run it for **0.8 s** [27][29].
7. Lift only in gaps of **1.5 s or more**. Shorter gaps stay at bed level [29].
8. Interpolate gain in dB with eased curves, evaluated per frame, then convert to linear amplitude [59].
9. Choose instrumental music with no vocals, a sustained texture, **60-100 BPM**, low arousal, and no lead melody in **1-4 kHz** [41][51][53][54]. The user likes lo-fi: prefer lo-fi with soft, brushed, or sparse drums, and lower a drums stem under speech if a loop reads as busy.
    Effects stay soft: swells and whooshes, never clunks, impacts, or bright chimes (user, 2026-09-24).
10. **House choice (user, 2026-09-24): a different track for each chapter** of a multi-chapter video; the change of track marks the chapter break, and the editor joins chapters in Premiere with a standard audio crossfade. So every chapter but the last ends with its music still sounding at its last frame, and every chapter opens with music already playing. Cut on bar lines. (The research default was one track or one family per video [71].)
11. Make music edits on bar lines at zero crossings, with **10-50 ms** crossfades [31][34].
12. Use at most **2-4 sound effects per chapter**, each **1 s or shorter**, at momentary loudness about **10-14 LU below voice**. Place them in gaps, never under a word [1][23].
13. Land each effect's onset on the event frame, or up to **2 frames (67 ms at 30 fps)** late. Never land it early [72].
14. Give each sound one meaning across the series, and keep a written vocabulary of them [58][59].
15. Never carry information in sound alone. The narration and the picture carry it [3][62].
16. No sudden loud sounds. Give every music start a fade-in of at least **50 ms**, and keep every element's short-term level at or below **voice +3 LU** [6][66].
17. Caption music only for a music-only stretch of **5 s or more**. Caption effects only when they carry meaning [61][62][63].
18. Keep the mix mono-safe. Keep the voice centered, and check a mono downmix [64].
19. Normalize by gain only, never by dynamic loudnorm [35][37].
20. Deliver **AAC-LC, 48 kHz, stereo, 256-320 kbps** [19][39].
21. Record every video in the mix sheet: track, license, edits, gains, effect cues, and measurements [69][70].

## 1. Loudness targets for web and e-learning video

**Standards (confirmed).** BS.1770-5 (November 2023) defines K-weighted, gated loudness and true peak [12]. Integrated loudness uses 400 ms blocks with 75% overlap, an absolute gate at -70 LUFS, and a relative gate 10 LU below the ungated average. True peak uses oversampling to catch inter-sample peaks [12] [via search excerpt]. EBU Tech 3341 v4.0 defines momentary (0.4 s, ungated), short-term (3 s), and integrated readings [8]. Tech 3342 defines loudness range (LRA) from the distribution of short-term values [9]. EBU R 128 v5.0 (2023) sets broadcast at **-23 LUFS ±0.5 LU**, with a maximum of **-1 dBTP** [5].

**Streaming and web.** EBU R 128 s2 v3.0 (2023) accepts an interim streaming range of **-20 to -16 LUFS** [7] [via search excerpt]. AES TD1004 (2015) sets a stream window of **-16 to -20 LUFS** with **-1 dBTP** maximum [13]. TD1008 (2021) supersedes it and sets **-18 LUFS for speech** and **-16 for music**, because speech measured at equal LUFS sounds 2-3 dB louder [14][15]. AES TD1006 (the OTT/online video guidelines) sets **-24 LKFS** as standard and **-16 LKFS** as maximum, measured on the dialog anchor for long-form content [16]. Apple Podcasts asks for **-16 LKFS ±1 dB, true peak -1 dBFS** (BS.1770-5) [17]. Spotify normalizes to **-14 LUFS** and recommends **-1 dBTP** (**-2 dBTP** for loud masters) [18]. Netflix uses **-27 LKFS** dialog-gated with **-2 dBTP** for long-form drama [22] [via search excerpt]. That target doesn't suit short web explainers.

**What platforms do.** YouTube publishes no loudness target. Measurements show it turns uploads louder than about **-14 LUFS** down and never turns quieter ones up (likely: [21], a mastering engineer's analysis, is corroborated by others). YouTube's "Stable volume" is on by default on supported devices. It "continuously" adjusts level, so it can raise a quiet bed in holds (confirmed [20]). A course web player normally applies no normalization, so the file plays at its mastered level.

**Where these videos play: Vimeo** (user, 2026-09-24). Vimeo publishes no loudness target and no playback normalization has been documented, so a video plays at its uploaded level. Web guidance for Vimeo is -16 to -14 LUFS with -1 dBTP or lower ([Youlean table](https://youlean.co/loudness-standards-full-comparison-table/), [Voicemachine](https://www.voicemachine.com/post/how-to-deliver-loudness-correct-web-videos-without-being-a-sound-engineer)). Holding every chapter at the same target is what keeps the course level.

**Choice: -16 LUFS integrated, -1.5 dBTP pre-encode.** That's the top of the AES speech window and matches Apple and the AES maximum for online video [13][16][17]. On YouTube it plays about 2 dB under -14 LUFS content, which is acceptable for speech. -23 LUFS is too quiet for laptops and phones with no normalization, and -14 LUFS gives up headroom for no gain on a player that doesn't normalize. Keep every chapter and micro-video within ±0.5 LU so the series plays at one level [5].

## 2. Speech vs music levels

**WCAG 1.4.7 (AAA).** For prerecorded audio-only speech, background sounds must be absent, able to be turned off, or at least **20 dB lower** than the speech, apart from occasional sounds of 1-2 s [1]. The Understanding page calls this about "four times quieter" and gives no measurement method [1]. Technique G56 measures dB(A) for background and foreground and checks the difference is 20 or more [2]. For stems in a mix, the practical equivalent is the **difference in integrated loudness between the voice stem and the music stem during speech**. LU and K-weighting stand in for dB(A): the numbers are close but not identical (likely). The criterion is scoped to audio-only content [1], so for these videos it's a house rule.

**Broadcast and podcast practice.** The UK DPP sets a floor of **4 LU** speech-to-background [24]. Torcoli et al. (22 listeners) recommend at least **10 LU** for commentary over music and **15 LU** over ambience. Non-experts wanted about **4 LU more** than experts [23]. Preferences vary widely between listeners (interquartile range about 5.7 LU) [25], and listeners over 65 prefer larger differences [26]. NPR mixes voices at **-24 LUFS short-term** and fits music around them by ear [27][28]. At 20-22 LU the bed sits well below every published broadcast preference, which is the point of "very low".

**Ducking.** A sidechain compressor reacts to the voice after it starts. FFmpeg's `sidechaincompress` defaults to a **20 ms attack and 250 ms release** [36], so it trails the first syllable and can pump between words. Tools that write keyframes are gentler. Audacity's Auto Duck defaults to **-12 dB, 0.5 s fades, and a 1 s maximum pause** before lifting [29]. Premiere's auto-duck recommends slower fades under voice-over [32] [via search excerpt]. Here the transcript gives exact word times, so script the curve with look-ahead: the bed is already down when the first word lands, and nothing rides between syllables. How much to duck isn't a separate setting. The bed's resting level already meets rule 4, so "ducking" means holding the bed low and lifting it in holds.

**Lifting in holds.** Radio "posts" bring music to full level between voice segments. NPR fades 1-2 dB during the last seconds of a post, dips quickly under the first word, and settles the rest over a few seconds [27] [via search excerpt]. For a learning bed, lift about **+10 dB** (to about voice minus 12 LU) in holds of 2-3 s, a smaller lift (+4 to +6 dB) in 1.5-2 s holds, and none in shorter gaps [29]. Use a **0.8 s** rise so the lift reads as the music breathing rather than a jump, and a **0.3 s** fall that finishes at the next word onset.

**Frequency carving.** The ANSI S3.5 speech intelligibility index weights the 1, 2, and 4 kHz octave bands at 0.237, 0.265, and 0.214, about 72% of the total [41]. A broad cut of **3-4 dB centered near 2-2.5 kHz** on the music stem clears space for consonants. At a 22 LU offset the masking benefit is small, so choosing a track with a sparse midrange matters more. Carve once, offline, per track, only if the ffmpeg build has an EQ filter (open question). Mix engineers routinely give the same advice (likely); no study tests it for learning beds.

## 3. Music choice and editing for learning

**Evidence.**
- Moreno and Mayer (2000) added a 20 s instrumental loop ("synthesized and bland"), sound effects, or both to narrated animations. Music hurt retention and transfer, both together hurt most, and effects alone hurt in 1 of 2 experiments. Neither masked the narration [42]. The harm came from attention and working memory, not audibility.
- Seductive-detail meta-analyses: Rey (2012) found small-to-medium harm to retention and medium harm to transfer [43]. Sundararajan and Adesope (2020) found g = -0.33 [44]. Cheng and Wang (2026, 50 studies) found g = -0.16, mediated by extraneous load [45]. Noetel et al.'s overview reports the coherence benefit at g = 0.33 [46].
- Pro-music evidence: de la Mora Velasco et al. (2023, 47 studies) found d = 0.31 for background music. Their largest effect was for music played before assessment, and they argue against blanket bans [47]. Their 2020 review found inconsistent results and few multimedia studies [48]. A design-based study found music and effects raised engagement and motivation in instructional videos, and warned about overload [49].
- Moderators: Kämpfe et al. (2011) found an overall null effect that masks harm to reading and memory and a benefit to mood [50]. Fast, loud music disrupted reading comprehension, and slow or quiet music didn't [51]. Mood and arousal effects are real but indirect [52]. Vocal music disrupts verbal memory more than instrumental music [53]. Staccato (changing-state) music disrupts more than legato [54]. Noise, speech, and music all have small reliable costs for reading [55]. Learners with low working memory were hurt most [56].

**What fits.** Instrumental only. A sustained pad or soft piano with slow harmonic motion. **60-100 BPM**, low dynamics, no drum fills or risers under speech, and no lead line in the 1-4 kHz vocal range [41][51][53][54]. Avoid tracks whose identity comes from a hook: a memorable melody competes with the narration for attention.

**Editing to picture.**
- Measure the track's BPM and compute bar length: at 30 fps, one 4/4 bar at 90 BPM lasts 2.667 s, or 80 frames.
- Cut to length by removing whole bars or phrases, joined at zero crossings with 10-50 ms crossfades (`acrossfade` exists in ffmpeg) [31][34]. Premiere's Remix does the same automatically and usually lands within 1 s of the target [33] [via search excerpt].
- Place a section change or build on the chapter's reveal hold, so the music lifts where the picture lands. Slide the track so a downbeat falls on the reveal frame.
- Loop only at phrase ends, with an equal-power crossfade.

**Opening and closing.**
- Standalone video: start the music at frame 0 with the title card, at about voice minus 10 LU, with a 0.3-0.5 s fade-in. Settle it to bed level 0.3 s before the first word.
- Standalone close: end on a resolved phrase or fade over the 2 s end buffer, reaching silence on the last frame, so the audio tail matches the backdrop-only frames Premiere needs.
- Embedded micro-video: start at bed level (content is on screen from frame 0). Fade out across the final 1.5-2 s hold so the player doesn't stop mid-note.

## 4. Sound effects in explainers

- **When effects help:** confirming a completed action (a check mark drawing in), marking a scene transition, and landing the chapter's one reveal. Coordinated cues help when they fire on the same element at the same moment as a visual cue. Single-channel cueing is unreliable [57]. Material Design keeps frequent sounds short and understated, keeps rare "hero" sounds for real moments, and warns that overuse dilutes them [59] [via search excerpt].
- **When they distract:** every entrance of every element, typing sounds under narration, whooshes on each bullet, anything under a spoken word. Effects alone hurt transfer in Moreno and Mayer's second experiment [42].
- **Level:** momentary loudness about voice minus 10 to 14 LU when the effect sits in a gap. If one must overlap speech, keep it at bed level and under 1-2 s (the 1.4.7 exception) [1].
- **Layering:** one layer per event. At most, add a soft low body under a short transient, then check the combined level.
- **Timing:** audio-early error is detectable at about 45 ms and audio-late at about 125 ms [72]. Put the onset on the event frame or 1-2 frames after it.
- **Vocabulary:** earcons work as families built from related motifs [58]. Fix a small set (for example "confirm", "transition", "reveal", "error"), use the same file at the same gain every time, and never reuse a sound for a different meaning.

## 5. Continuity across a multi-chapter video and a series

- **House choice overrides this:** one different track per chapter, crossfaded in Premiere (rule 10). The research default follows.
- **One track per video.** Run a single track across all 3 chapters, continuing from where the last chapter stopped, or use a family of related tracks from the same composer or pack in the same or adjacent keys. Harmonic-mixing practice treats the same key, a fifth up or down, or the relative major or minor as clash-free [71] [via search excerpt]. Keep tempi within about ±5 BPM (practice).
- **Chapter boundaries.** If chapters render as separate files joined in Premiere, end chapter N on a bar line and start chapter N+1 on the next bar of the same track, at the same gain, so a straight cut or a short crossfade is seamless. If they're one composition, don't dip the music at the boundary. Let the boundary hold be a lift.
- **Series identity.** Use one bed family and one effect vocabulary for the course. Sonic branding research reports better recognition and affect from consistent sound [60], but that's marketing evidence, not learning evidence.
- **Record-keeping.** Music cue sheets record, per cue: cue number, title, composer, publisher, performing-rights society, usage type, timecode in and out, and duration [69] [via search excerpt]. Envato licenses cover a single specified use. Downloading creates the license, a certificate is the proof for a YouTube Content ID dispute, and a new project needs a new license [70].

## 6. Accessibility beyond 1.4.7

- **Hearing loss.** WHO counts over 1.5 billion people with some hearing loss, 430 million of them moderate or worse [67] [via search excerpt]. Some listeners need a much better signal-to-noise ratio: normal listeners reach 50% words at about +2 dB SNR, while listeners with hearing loss often need several dB more [68]. Hearing aids and older listeners favor large speech-to-background differences [1][26]. Game accessibility guidance cites background noise clashing with speech as a common reason people turn subtitles on [65]. The course player plays one mixed track, so it can't offer a separate music control the way games do [64]. A low fixed bed is the only lever, which supports the 20 LU rule. Keep the voice centered and the mix mono-safe for single-sided hearing loss [64].
- **Captions.** WCAG 1.2.2 captions include non-dialogue audio "needed to understand the program content" [3]. The DCMP Captioning Key captions effects needed for understanding or enjoyment, uses a music icon for nonessential background music, and skips music under 5 s [62]. Netflix captions plot-pertinent effects unless the picture implies them [61]. BBC guidance doesn't label unknown incidental mood music unless it's needed [63] [via search excerpt]. For this course: no caption for the bed under speech, one `[calm instrumental music]` cue for a music-only title of 5 s or more, and no effect captions, because the effects duplicate on-screen events the narration already names.
- **Sudden sounds.** Unexpected loud sounds distress some autistic people and people with hyperacusis [66] [via search excerpt]. EBU caps short-form maximum short-term loudness at **+5 LU** over target [6]. Apply the same idea here: nothing exceeds voice +3 LU short-term, no hard starts, and no impacts, stings, or risers.
- **Audio control.** Audio that autoplays for more than 3 s needs a pause or independent volume control (1.4.2, Level A) [4]. Keep narrated media click-to-play, which the course player's controls cover.

## 7. Practical measurement with ffmpeg loudnorm

The filter prints JSON with `input_i`, `input_tp`, `input_lra`, `input_thresh`, `output_*`, `normalization_type`, and `target_offset` [35][37]. Its defaults are I -24, LRA 7, TP -2, so always pass targets [35]. Linear mode engages only if you supply all four measured values, `measured_LRA` is nonzero, the gain doesn't push true peak past `TP`, and `measured_LRA` is at or below the `LRA` target. Otherwise it silently falls back to dynamic mode, which limits, rides the level, and outputs 192 kHz [35]. Linear mode applies gain only, with no limiter [35]. The author tells users to resample after the filter [37].

**Pass 1 (any file or stem):**

```bash
ffmpeg -hide_banner -nostats -i voice.wav \
  -af loudnorm=I=-16:TP=-1.5:LRA=20:print_format=json -f null -
```

**Stems.** Render stems from the same composition with props that mute the other layers: `voice.wav`, `music_bed.wav` (hold lifts disabled, so the bed stays at its under-speech gain), `music_full.wav`, and `sfx.wav`. Remotion renders WAV audio-only [73].
- **20 LU check:** `input_i(voice) - input_i(music_bed)` must be at least 20. Also slice the longest speech runs into 3 s windows (`-ss <start> -t 3` placed before `-i`, which needs no extra filters), and check that the difference is at least 20 in every window. This stands in for the short-term comparison Torcoli et al. use [24].
- **Holds and effects:** slice `music_full.wav` over each hold and `sfx.wav` over 1 s windows around each cue. The gate discards silent blocks, so a slice's `input_i` approximates the event's loudness. Files shorter than 400 ms give no block, so always measure a window at least 1 s long [12].

**Gain staging.**
- Library tracks are often mastered near -10 to -14 LUFS. At -12 LUFS, a -38 LUFS bed needs -26 dB (volume 0.050), and a -28 LUFS hold needs -16 dB (0.158).
- Remotion volume runs 0-1, and going above 1 needs the Web Audio API [38][40]. Bring the narration to -16 LUFS before mixing with a linear loudnorm pass (set `LRA` at or above the measured value). If true peak blocks linear mode, accept light dynamic limiting on the voice stem only, then resample to 48 kHz.

**Final mix.** Render the mix to WAV, measure it, and apply `volume` (or a linear loudnorm pass) by `-16 - input_i`. Confirm `"normalization_type" : "linear"`, then mux with the video:

```bash
ffmpeg -i video.mp4 -i mix_norm.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 320k -ar 48000 final.mp4
```

Re-measure `final.mp4`. Its `input_tp` reflects the decoded AAC, so check `input_i` is -16 ±0.5 and `input_tp` is -1.0 or lower. AAC encoding can add inter-sample overs, which is why AES, Apple, and Spotify ask for -1 dBTP or lower at codec input. EBU notes that lossy distribution chains may need -2 to -3 dBTP [11][14][17][18]. Remotion's default audio bitrate is 320 kbps [39] [via search excerpt]. YouTube recommends AAC-LC at 48 kHz and 384 kbps stereo [19]. For a mono check, downmix with `-ac 1` and listen for phase loss.

## Mix sheet template

```markdown
# Mix sheet: <media-id> (<video title>)

## Video
- Chapters / compositions: <ids>; fps: 30
- Music: <track title>, <composer/publisher>, library item ID <id>,
  license <certificate/code, project name, date>, key <e.g. D minor>, BPM <n>,
  bar length <s / frames>, source loudness <input_i LUFS, input_tp dBTP>
- Carve: <none | EQ settings>
- Effect vocabulary used: <name -> file, gain, meaning>

## Per chapter
| Chapter | Music in-point (track time) | Out-point | Edits (bar cuts, crossfades) | Frame 0 action |
|---|---|---|---|---|

### Gain curve
| Segment | Frames | Target LUFS | Gain dB / volume | Ramp (frames, curve) | Reason |
|---|---|---|---|---|---|
| bed under speech | | -38 | | | |
| hold at <s> (<n> s) | | -28 | | up 24 / down 9 | reveal |

### Effect cues
| Cue | Frame | Event on screen | Sound | Gain | Momentary (slice) | Gap or overlap |
|---|---|---|---|---|---|---|

### Measurements (loudnorm JSON)
| Stem / file | input_i | input_tp | input_lra | Check |
|---|---|---|---|---|
| voice | | | | -16 ±0.5 |
| music_bed | | | | voice - bed >= 20 (target 22) |
| worst 3 s window diff | | | | >= 20 |
| each hold slice | | | | <= voice - 8 |
| final.mp4 (decoded) | | | | -16 ±0.5, TP <= -1.0 |

- normalization_type on final pass: <linear>
- Caption cues added: <none | [calm instrumental music] at 00:00>
- Mono check: <pass/notes>; listened on: <headphones, laptop speakers>
```

## Levels cheat sheet

Referenced to a -16 LUFS master. LU offsets are relative to the voice stem's integrated loudness.

| Element | Level | Offset | How measured |
|---|---|---|---|
| Voice stem | -16 LUFS integrated | 0 | loudnorm on voice stem |
| Music under speech | -38 LUFS (limit -36) | -22 (limit -20) | bed stem, integrated and each 3 s speech window |
| Music in holds of 2 s or more | -28 LUFS (range -26 to -30) | -12 | slice over the hold |
| Music in holds of 1.5-2 s | -32 to -34 LUFS | -16 to -18 | slice |
| Music, standalone title before first word | -26 LUFS | -10 | slice |
| Music ceiling anywhere | -24 LUFS | -8 | slices |
| Sound effect in a gap | -26 to -30 LUFS momentary | -10 to -14 | 1 s slice of sfx stem |
| Sound effect over speech (avoid) | -36 LUFS or lower, 2 s or shorter | -20 | slice |
| Final integrated | -16.0 LUFS ±0.5 | | decoded final.mp4 |
| True peak | -1.5 dBTP pre-encode; -1.0 dBTP or lower decoded | | loudnorm input_tp |
| Loudness range | 4-10 LU expected; review over 12 | | input_lra |
| Ramps (30 fps) | down 9 frames ending at word onset; up 24 frames starting 8 frames after last word | | mix.json |

## Where the evidence is weak

- **No study tests a music bed at 20 dB or more below narration.** Moreno and Mayer didn't report the relative level [42], and most pro-music studies used music during reading or before tests [47][50][51]. Whether a bed at -22 LU is neutral for learning is unknown. The design bet is that it keeps the motivational benefit [49] at minimal cost.
- **The 20 dB figure comes from hearing-aid research for audio-only content** [1]. No perceptual study maps it to LUFS, and dB(A) vs K-weighted LU is an approximation.
- **Ducking times, hold lifts, and effect levels come from tools and practice** [27][29][32], not from controlled studies on learning.
- **Frequency carving** is standard mix-engineer advice. The SII weights [41] explain why it should work, but no study tests it for learning beds.
- **YouTube's -14 LUFS** is measured behavior, not a published spec [21]. Stable volume may lift a quiet bed in holds, and its behavior isn't documented [20].
- **Sonic identity** evidence is marketing research [60], not learning research.
- **Several primary PDFs (EBU R 128 s2, Tech 3343/3344, AES TD1004/1008, BS.1770-5) couldn't be text-fetched.** Their figures come from the publication pages and search excerpts. Check them against the PDFs before quoting them in learner-facing material.

Open questions, answered 2026-09-24 on the pilot machine: Remotion's bundled ffmpeg has only `loudnorm`, `volume`, `amix`, `atrim` and a few others, but the project's pixi environment ships ffmpeg 9.0.2 with `ebur128`, `acrossfade`, `afade`, `equalizer` and `alimiter`, so use that one. Remotion renders audio at 48 kHz. The li-v6-ch1 ElevenLabs narration measured -20.2 LUFS with -1.1 dBTP peaks, so reaching -16 LUFS / -1.5 dBTP needs about 4.6 dB of peak limiting on the voice stem; gain alone falls back to dynamic mode.

## Sources

1. W3C. (2025, September 16). *Understanding SC 1.4.7: Low or no background audio* (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html (accessed 2026-09-24)
2. W3C. (2026, August 10). *G56: Mixing audio files so that non-speech sounds are at least 20 decibels lower than the speech audio content* [Technique]. https://www.w3.org/WAI/WCAG22/Techniques/general/G56 (accessed 2026-09-24)
3. W3C. (2026, August 10). *Understanding SC 1.2.2: Captions (prerecorded)* (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html (accessed 2026-09-24)
4. W3C. (2025, September 16). *Understanding SC 1.4.2: Audio control* (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html (accessed 2026-09-24)
5. EBU. (2023). *R 128: Loudness normalisation and permitted maximum level of audio signals* (v5.0). https://tech.ebu.ch/publications/r128 (accessed 2026-09-24)
6. EBU. (n.d.). *R 128 s1: Loudness parameters for short-form content* [via search excerpt]. https://tech.ebu.ch/docs/r/r128s1.pdf (accessed 2026-09-24)
7. EBU. (2023). *R 128 s2: Loudness in streaming* (v3.0) [via search excerpt]. https://tech.ebu.ch/docs/r/r128s2.pdf (accessed 2026-09-24)
8. EBU. (2023). *Tech 3341: Loudness metering, 'EBU mode'* (v4.0). https://tech.ebu.ch/publications/tech3341 (accessed 2026-09-24)
9. EBU. (n.d.). *Tech 3342: Loudness range* [via search excerpt]. https://tech.ebu.ch/docs/tech/tech3342.pdf (accessed 2026-09-24)
10. EBU. (2023). *Tech 3343: Guidelines for production of programmes in accordance with R 128* (v4.0) [via search excerpt]. https://tech.ebu.ch/publications/tech3343 (accessed 2026-09-24)
11. EBU. (n.d.). *Tech 3344: Guidelines for distribution and reproduction in accordance with R 128* [via search excerpt]. https://tech.ebu.ch/docs/tech/tech3344.pdf (accessed 2026-09-24)
12. ITU-R. (2023). *BS.1770-5: Algorithms to measure audio programme loudness and true-peak audio level* [gating details via search excerpt]. https://www.itu.int/rec/R-REC-BS.1770 (accessed 2026-09-24)
13. AES. (2015). *TD1004.1.15-10: Recommendation for loudness of audio streaming and network file playback* [via search excerpt]. https://aes.org/wp-content/uploads/2024/01/AESTD1004_1_15_10.pdf (accessed 2026-09-24)
14. AES. (2021). *TD1008.1.21-9: Recommendations for loudness of internet audio streaming and on-demand distribution* [via search excerpt]. https://aes.org/wp-content/uploads/2024/01/20210924_TD1008_v3.13.pdf (accessed 2026-09-24)
15. Shepherd, I. (2021, October 1). *Streaming loudness: AES recommendations 2021*. Production Advice. https://productionadvice.co.uk/td1008/ (accessed 2026-09-24)
16. Yeary, J. (2017, October 19). *Guidelines for streaming loudness* [AES TD1006]. TV Technology. https://www.tvtechnology.com/opinions/guidelines-for-streaming-loudnesss (accessed 2026-09-24)
17. Apple. (n.d.). *Audio requirements*. Apple Podcasts for Creators. https://podcasters.apple.com/support/893-audio-requirements (accessed 2026-09-24)
18. Spotify. (n.d.). *Loudness normalization*. Spotify for Artists. https://support.spotify.com/us/artists/article/loudness-normalization/ (accessed 2026-09-24)
19. Google. (n.d.). *YouTube recommended upload encoding settings*. YouTube Help. https://support.google.com/youtube/answer/1722171 (accessed 2026-09-24)
20. Google. (n.d.). *Control video volume on your device* [Stable volume]. YouTube Help. https://support.google.com/youtube/answer/14106294 (accessed 2026-09-24)
21. Shepherd, I. (2017, September 29). *YouTube stats for nerds: Exact volume normalization values*. Production Advice. https://productionadvice.co.uk/stats-for-nerds/ (accessed 2026-09-24)
22. Netflix. (n.d.). *Netflix sound mix specifications & best practices* (v1.6) [via search excerpt]. https://partnerhelp.netflixstudios.com/hc/en-us/articles/360001794307 (accessed 2026-09-24)
23. Torcoli, M., Freke-Morin, A., Paulus, J., Simon, C., & Shirley, B. (2019). Preferred levels for background ducking to produce esthetically pleasing audio for TV with clear speech. *Journal of the Audio Engineering Society, 67*(12), 1003-1011. https://doi.org/10.17743/jaes.2019.0052 (accessed 2026-09-24)
24. Torcoli, M., et al. (2024). *Speech loudness in broadcasting and streaming* (arXiv:2405.17364). https://arxiv.org/abs/2405.17364 (accessed 2026-09-24)
25. Resti, L., Strauss, M., Torcoli, M., Habets, E., & Edler, B. (2023). *Predicting preferred dialogue-to-background loudness difference in dialogue-separated audio* (QoMEX; arXiv:2305.19100). https://arxiv.org/abs/2305.19100 (accessed 2026-09-24)
26. Straninger, D. (2020). *Dialogue enhancement in object-based audio: Evaluating the benefit on people above 65* (arXiv:2006.14282). https://arxiv.org/abs/2006.14282 (accessed 2026-09-24)
27. NPR Training. (2025, May 31). *The producer's handbook to mixing audio stories* [via search excerpt]. NPR. https://www.npr.org/sections/npr-training/2025/05/31/g-s1-67902/the-producers-handbook-to-mixing-audio-stories (accessed 2026-09-24)
28. Byers, R. (2021, August 24). *The audio producer's guide to loudness*. Transom. https://transom.org/2021/the-audio-producers-guide-to-loudness/ (accessed 2026-09-24)
29. Audacity Team. (n.d.). *Auto Duck* [Manual]. https://manual.audacityteam.org/man/auto_duck.html (accessed 2026-09-24)
30. Audacity Team. (n.d.). *Tutorial: Mixing a narration with background music* [Manual]. https://manual.audacityteam.org/man/tutorial_mixing_a_narration_with_background_music.html (accessed 2026-09-24)
31. Audacity Team. (n.d.). *At zero crossings* [Manual]. https://manual.audacityteam.org/man/select_menu_at_zero_crossings.html (accessed 2026-09-24)
32. Adobe. (n.d.). *Automatically duck audio in Premiere* [via search excerpt]. https://helpx.adobe.com/premiere/desktop/add-audio-effects/adjust-volume-and-levels/automatically-duck-audio.html (accessed 2026-09-24)
33. Adobe. (n.d.). *Remix audio to match video duration in Adobe Premiere* [via search excerpt]. https://helpx.adobe.com/premiere/desktop/add-audio-effects/advanced-audio-techniques/remix-audio-in-audition-to-match-video-duration.html (accessed 2026-09-24)
34. FFmpeg. (n.d.). *FFmpeg filters documentation* (acrossfade, sidechaincompress, loudnorm). https://ffmpeg.org/ffmpeg-filters.html (accessed 2026-09-24)
35. FFmpeg. (n.d.). *af_loudnorm.c* (master) [Source code]. GitHub. https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/af_loudnorm.c (accessed 2026-09-24)
36. FFmpeg. (n.d.). *af_sidechaincompress.c* (master) [Source code]. GitHub. https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/af_sidechaincompress.c (accessed 2026-09-24)
37. Swanson, K. (2016, April 4). *loudnorm* [Blog post by the filter's author]. k.ylo.ph. http://k.ylo.ph/2016/04/04/loudnorm.html (accessed 2026-09-24)
38. Remotion. (n.d.). *Controlling volume*. https://www.remotion.dev/docs/audio/volume (accessed 2026-09-24)
39. Remotion. (n.d.). *npx remotion render* [audio bitrate default via search excerpt]. https://www.remotion.dev/docs/cli/render (accessed 2026-09-24)
40. Remotion. (n.d.). *<Audio>* (@remotion/media) [via search excerpt]. https://www.remotion.dev/docs/media/audio (accessed 2026-09-24)
41. SII R package. (n.d.). *sii: Compute ANSI S3.5-1997 speech intelligibility index* (SII 1.0.3.1) [R package documentation; octave-band importance values from ANSI S3.5-1997]. RDocumentation. https://www.rdocumentation.org/packages/SII/versions/1.0.3.1/topics/sii (accessed 2026-09-24)
42. Moreno, R., & Mayer, R. E. (2000). A coherence effect in multimedia learning: The case for minimizing irrelevant sounds in the design of multimedia instructional messages. *Journal of Educational Psychology, 92*(1), 117-125. https://doi.org/10.1037/0022-0663.92.1.117 (accessed 2026-09-24)
43. Rey, G. D. (2012). A review of research and a meta-analysis of the seductive detail effect. *Educational Research Review, 7*(3), 216-237. https://doi.org/10.1016/j.edurev.2012.05.003 (accessed 2026-09-24)
44. Sundararajan, N., & Adesope, O. (2020). Keep it coherent: A meta-analysis of the seductive details effect. *Educational Psychology Review, 32*, 707-734. https://doi.org/10.1007/s10648-020-09522-4 (accessed 2026-09-24)
45. Cheng, C., & Wang, Z. (2026). Seductive details, cognitive load, and learning outcomes: A multi-level meta-analysis and MASEM. *Educational Psychology Review*. https://doi.org/10.1007/s10648-025-10099-z (accessed 2026-09-24)
46. Noetel, M., Griffith, S., Delaney, O., Harris, N. R., Sanders, T., Parker, P., del Pozo Cruz, B., & Lonsdale, C. (2022). Multimedia design for learning: An overview of reviews with meta-meta-analysis. *Review of Educational Research, 92*(3), 413-454. https://doi.org/10.3102/00346543211052329 (accessed 2026-09-24)
47. de la Mora Velasco, E., Chen, Y., Hirumi, A., & Bai, H. (2023). The impact of background music on learners: A systematic review and meta-analysis. *Psychology of Music, 51*(6), 1598-1626. https://doi.org/10.1177/03057356231153070 (accessed 2026-09-24)
48. de la Mora Velasco, E., & Hirumi, A. (2020). The effects of background music on learning: A systematic review of literature to guide future research and practice. *Educational Technology Research and Development, 68*, 2817-2837. https://doi.org/10.1007/s11423-020-09783-4 (accessed 2026-09-24)
49. de la Mora Velasco, E., & Hirumi, A. (2021). Improving instructional videos with background music and sound effects: A design-based research approach. *Journal of Formative Design in Learning*. https://doi.org/10.1007/s41686-020-00052-4 (accessed 2026-09-24)
50. Kämpfe, J., Sedlmeier, P., & Renkewitz, F. (2011). The impact of background music on adult listeners: A meta-analysis. *Psychology of Music, 39*(4), 424-448. https://doi.org/10.1177/0305735610376261 (accessed 2026-09-24)
51. Thompson, W. F., Schellenberg, E. G., & Letnic, A. K. (2012). Fast and loud background music disrupts reading comprehension. *Psychology of Music, 40*(6), 700-708. https://doi.org/10.1177/0305735611400173 (accessed 2026-09-24)
52. Thompson, W. F., Schellenberg, E. G., & Husain, G. (2001). Arousal, mood, and the Mozart effect. *Psychological Science, 12*(3), 248-251. https://doi.org/10.1111/1467-9280.00345 (accessed 2026-09-24)
53. Salamé, P., & Baddeley, A. (1989). Effects of background music on phonological short-term memory. *Quarterly Journal of Experimental Psychology, 41A*(1), 107-122. https://doi.org/10.1080/14640748908402355 (accessed 2026-09-24)
54. Schlittmeier, S. J., Hellbrück, J., & Klatte, M. (2008). Does irrelevant music cause an irrelevant sound effect for auditory items? *European Journal of Cognitive Psychology, 20*(2), 252-271. https://doi.org/10.1080/09541440701427838 (accessed 2026-09-24)
55. Vasilev, M. R., Kirkby, J. A., & Angele, B. (2018). Auditory distraction during reading: A Bayesian meta-analysis of a continuing controversy. *Perspectives on Psychological Science, 13*(5), 567-597. https://doi.org/10.1177/1745691617747398 (accessed 2026-09-24)
56. Lehmann, J. A. M., & Seufert, T. (2017). The influence of background music on learning in the light of different theoretical perspectives and the role of working memory capacity. *Frontiers in Psychology, 8*, 1902. https://doi.org/10.3389/fpsyg.2017.01902 (accessed 2026-09-24)
57. Xie, H., Wang, F., Mayer, R. E., & Zhou, Z. (2019). Coordinating visual and auditory cueing in multimedia learning. *Journal of Educational Psychology, 111*(2), 235-255. https://doi.org/10.1037/edu0000285 (accessed 2026-09-24)
58. Blattner, M. M., Sumikawa, D. A., & Greenberg, R. M. (1989). Earcons and icons: Their structure and common design principles. *Human-Computer Interaction, 4*(1), 11-44. https://doi.org/10.1207/s15327051hci0401_1 (accessed 2026-09-24)
59. Google. (n.d.). *Applying sound to UI* (Material Design 2) [via search excerpt]. https://m2.material.io/design/sound/applying-sound-to-ui.html (accessed 2026-09-24)
60. Spence, C. (2024). Sonic branding: A narrative review at the intersection of art and science. *Psychology & Marketing*. https://doi.org/10.1002/mar.21995 (accessed 2026-09-24)
61. Netflix. (2025, December 19). *English (USA) timed text style guide*. Netflix Partner Help Center. https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide (accessed 2026-09-24)
62. DCMP. (n.d.). *Captioning key: Sound effects and music*. https://dcmp.org/learn/602-captioning-key---sound-effects-and-music (accessed 2026-09-24)
63. BBC. (2024). *Subtitle guidelines* (v1.2.3) [via search excerpt]. https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/ (accessed 2026-09-24)
64. Microsoft. (2026, June 17). *Xbox accessibility guideline 105*. Microsoft Learn. https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/105 (accessed 2026-09-24)
65. Game Accessibility Guidelines. (n.d.). *Keep background noise to a minimum during speech*. https://gameaccessibilityguidelines.com/keep-background-noise-to-minimum-during-speech/ (accessed 2026-09-24)
66. Game Accessibility Guidelines. (n.d.). *Avoid any sudden unexpected movement or events* [via search excerpt]. https://gameaccessibilityguidelines.com/avoid-any-sudden-unexpected-movement-or-events/ (accessed 2026-09-24)
67. World Health Organization. (2021). *World report on hearing* [via search excerpt]. https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss (accessed 2026-09-24)
68. Killion, M. C., Niquette, P. A., Gudmundsen, G. I., Revit, L. J., & Banerjee, S. (2004). Development of a quick speech-in-noise test for measuring signal-to-noise ratio loss in normal-hearing and hearing-impaired listeners. *Journal of the Acoustical Society of America, 116*(4), 2395-2405 [via search excerpt]. https://doi.org/10.1121/1.1784440 (accessed 2026-09-24)
69. ASCAP. (n.d.). *Cue sheet corner* [via search excerpt]. https://www.ascap.com/help/royalties-and-payment/cue-sheets (accessed 2026-09-24)
70. Envato. (2026, January 28). *How Envato licensing works*. https://elements.envato.com/learn/how-envato-licensing-works (accessed 2026-09-24)
71. Mixed In Key. (n.d.). *Harmonic mixing guide* [via search excerpt]. https://mixedinkey.com/harmonic-mixing-guide/ (accessed 2026-09-24)
72. ITU-R. (1998). *BT.1359-1: Relative timing of sound and vision for broadcasting* [via search excerpt]. https://www.itu.int/rec/R-REC-BT.1359 (accessed 2026-09-24)
73. Remotion. (n.d.). *Exporting audio*. https://www.remotion.dev/docs/audio/exporting (accessed 2026-09-24)
