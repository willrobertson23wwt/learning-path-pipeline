# li-v6 mix sheet: the hand-drawn chapter (excerpt)

From the sandbox course repo's courses/linux-intermediate/sound/li-v6.md; the earlier Manim rounds are in ../li-v6-ch1/mix-sheet.md.

## Chapter 1, hand-drawn test (li-v6-ch1-hd) - refit 2026-09-25, round 2

The same recorded narration and the same approved sound (track, both effects, their gains,
house rules), refitted to the hand-drawn picture's holds. No downloads, no Epidemic edits.
Composition **2690 frames (89.667 s)**. Scripts in `out/li-v6-ch1-hd/sound/`: `timeline.py`
(beats.json + cut table + silencedetect on the mastered voice), `build_mix_hd.py` (+
`trim_hd.json` `{"ra": -0.2}`, `bumps.json`), `sim_hd.py`, `measure_hd.py`, `sweep_hd.py`,
`analyze_track.py`, `kmeter.py`. Envelope points: `envelope_hd.json`; build report
`build_mix_hd.report.json`; results `sim.results.json`. Round 1 outputs kept in `round1/`.

**Why round 2:** in round 1 (reveal hold 2.4 s, 2714 frames) the reveal's speech gap measured
47.754-50.962 (3.21 s), because the voice's own break after "left" is about 0.8 s: the result
sat 2.2 s after the divider rested at 48.79. The user's rule is run time + about 1 s, so the
main thread set hold4Reveal to 1.6 s (gap 2.41 s, result sits about 1.4 s). Everything up to
and including the divider rest is unchanged; everything after the reveal is 0.8 s earlier.
To refit: rerun `timeline.py`, then `build_mix_hd.py trim_hd.json` (the reveal ease ends on
the gap end automatically), re-sweep the hold corrections after the change, simulate, measure.

### Timeline (from timeline.py)
- Cut table (narration s): 8.433, 15.167, 35.767, 45.0, 58.6, 75.0 (the last new: silence
  74.751-75.277 on the mastered voice). Holds 1.0 (lead-in) / 1.1 / 0.4 / 0.4 / **1.6** / 1.0 / 1.0.
- Narration Sequence starts (frames): 30, 316, 530, 1160, 1485, 1923, 2445 (trimBefore 0, 253,
  455, 1073, 1350, 1758, 2250); matches the code.
- Speech gaps (composition s; silencedetect -43.8 dB on the voice = -45 dB on the mp3): first
  word 1.118; hold1Machine 9.254-11.298 (2.04 s); hold2Parts 17.094-18.296 (1.20); hold3Reading
  37.789-39.155 (1.37); **hold4Reveal 47.754-50.162 (2.41)**, "Now" at 50.162; hold5Story
  62.808-64.853 (2.05); hold6Blocked 80.251-81.777 (1.53); last word ends 87.785; end 89.667.
- Divider rest: cReveal 46.99 + 1.8 = 48.79, frame 1464 (48.800) by ceil (never early).

### Music fit
| Chapter | Music in-point (track) | Out-point | Edits | Frame 0 action |
|---|---|---|---|---|
| li-v6-ch1-hd (round 2) | **8.780 s** (sample 421,440) | 98.447 s (sample 4,725,440) | none: one straight excerpt, 89.667 s, bass entry (track 57.580) on comp **48.800**, frame 1464, the divider rest | silent 0-3.80 (title), eased fade-in 3.80-4.40 over the title's fade to bed; no tail fade (still sounding, -50.9 dBFS RMS in the last frame) |

- No edit was needed for the shorter reveal: the music is continuous and only the picture
  after the reveal moved, so the one change is the reveal's ease-down, now finished by "Now"
  (50.162) instead of 50.962. Round 1 used the same in-point (out-point 99.247).
- Audible music runs 3.80-89.67 (85.87 s) = track 12.58-98.45, all inside the file's 203 s.
- Hold 5 still needs no edit. The track's own phrase end falls in the gap: the music dips to
  -50.9 momentary at 63.6 (the wipe runs 63.04-63.64), and a strong onset at track 73.17 =
  **comp 64.39** starts the next phrase 0.46 s before "One" (64.853), so scene D starts
  on it. The gap reads flat (-0.40 dB vs its surroundings).
- The bar grid from the bass entry (3.200 s bars) has a downbeat at comp 87.20; the chapter
  ends 0.73 s before the next one, mid-bar, still playing, for the Premiere crossfade.

Delivered (both 48 kHz/24-bit stereo, 4,304,000 samples = 2690 frames, envelope baked per
sample): `public/audio/li-v6-hd/li-v6-ch1-hd.music.mix.wav` (with the reveal lift) and
`li-v6-ch1-hd.music.bed.wav` (lift off). Plain excerpt (build input only):
`out/li-v6-ch1-hd/sound/li-v6-ch1-hd.music.wav`. Effects: `public/audio/li-v6-hd/sfx-chapter-open.wav`
and `sfx-boundary-seat.wav`, byte copies of the approved v3 processed files. Voice: unchanged,
`public/audio/li-v6/li-v6-ch1.voice.wav` (-16.01 LUFS, -1.78 dBTP).

### Gain curve (bed target -50.01 LUFS = voice -34)
Section loudness measured on the excerpt: -24.37 intro, -18.99 after the melody, -16.91 late
B, -14.55 after the bass (8 s from "Now"), -11.75 late D.

| Segment | Time (s) | Target | Gain dB | Ramp | Reason |
|---|---|---|---|---|---|
| title | 0-3.80 | silent | -inf | - | house rule 1 |
| fade-in | 3.80-4.40 | to bed | -inf to -25.64 | eased (amplitude) 0.6 s | on the title's own fade-out |
| bed, intro | 4.40-15.52 | -50 | -25.64 | - | measured -24.37 |
| hold 1 correction | down 6.25-9.25, flat through hold 1, back 11.30-14.30 | -50 | -0.5 bump | 3 s eased, under speech | a louder phrase of the track in hold 1 |
| melody compensation | 15.52-21.52 | -50 | -25.64 to -31.02 | eased 6 s on the swell (~18.5) | crosses hold 2 slowly (env moves 1.5 dB inside it; level flat, -0.60 dB) |
| bed, scenes B-C | 21.52-44.20 | -50 | -31.02 to -33.10 linear | - | the track's build |
| hold 3 correction | down 34.79-37.79, flat through hold 3, back 39.16-42.16 | -50 | -1.25 bump | 3 s eased, under speech | the gap sat +1.5 dB over its quiet before-window |
| dip compensation | up 43.20-46.20, held to 48.80 | -50 | +4.0 (to -29.10) | eased 3 s, under speech | the track's own dip before the bass |
| **reveal (hold 4)** | gain held -29.10 through the bass entry (48.80), then eased down 48.80-50.16 to -35.46 | slight lift from the bass itself | -29.10 to -35.46 | eased 1.36 s, done by "Now" 50.162 | house rule 4: the bass supplies the rise (bed -51.0 at 48.0, -48.5 momentary at 49.2-49.4, back to -51.2 at 50.2); no extra up-ramp |
| bed after the reveal | 50.16-87.79, held to the end | -50 | -35.46 to -38.26 linear | - | post-bass build (the swell's last 1 dB, 50.2-51.0, stays under speech at -51.2 to -50.5) |
| hold 5 correction | up 59.81-62.81, flat through hold 5, back 64.85-67.85 | -50 | +0.5 bump | 3 s eased, under speech | the track's phrase-end dip in hold 5 |
| hold 6 correction | up 77.25-80.25, flat through hold 6, back 81.78-84.78 | -50 | +0.75 bump | 3 s eased, under speech | the track softens in hold 6, louder after it |
| holds 1, 2, 3, 5, 6 and tail | - | flat | bed (with the corrections above) | no lifts | house rule 3 |

The reveal differs from v3 because the excerpt rises 6.5 dB by itself across it (-21.8
momentary before the bass, -15.0 by 51.0). v3's 0.8 s up-ramp to a plateau gain measured over
the swell would have come out under the pre-gap gain and dipped the music just before the
bass. So the gain holds through the entry and only shaves the swell: the level rises about
2.5 dB over 0.6 s after the entry and falls back over 0.8 s (49.4-50.2), the house 0.8 s shape.
The envelope's 6.4 dB, 1.36 s ease sits inside the gap but is inaudible as a ramp because it
cancels the bass swell. Lift-off variant (bed file): one even ease -29.10 to -35.46 over
48.00-50.16. Hold corrections were re-swept after the change (`sweep_hd.py`): holds 1 and 3
kept their corrections; hold 5 +0.5 and hold 6 +0.75 are the new ones (hold 6 read -0.98 dB
vs its surroundings without it).

### Effect cues (vocabulary gains; the v3 table above predates the 5 dB cut)
| Cue | Frame | Event on screen | Sound | Gain | Momentary (sim) | Gap or overlap |
|---|---|---|---|---|---|---|
| 1 | 0 (`at: 0`) | `titleIn`: the title letters itself on | `chapter-open` | -11.7 dB (plays at 0.26) | -32.04 LUFS (voice -15.9) at 0.50 s | audible 0.006-0.616; first word 1.118 |
| 2 | 1449 (`at: 48.300`) | divider comes to rest, frame 1464 (48.800) | `boundary-seat` | -13.8 dB (plays at 0.20, -13.98) | -33.13 LUFS (voice -17.0) at 48.95 | audible 48.54-48.97 inside the gap 47.754-50.162; sample peak 48.803 (0.1 frame after the rest) |

No other effects: the wipes (63.04, 88.37), the red cross and hold 6 are silent, and there
are no drawing sounds.

### Measurements (round 2, simulated stems, `sim_hd.py` + `measure_hd.py`, 2026-09-25)
Voice via the Sequence segments with 2-frame ramps; music at gainDb 0; effects at Remotion's
0.01-rounded volume.
| Check | Value | Target | Result |
|---|---|---|---|
| voice stem integrated / TP | -16.09 / -1.78 | -16 +/-0.5, TP <= -1.5 | PASS |
| bed (music_bed from 4.40 s) | -50.14 LUFS = voice -34.05 | voice -34 +/-1 | PASS |
| music_full from 4.40 s | -50.11 = voice -34.02 | voice -34 +/-1 | PASS |
| loudest 3 s speech window, music re voice | -32.19 (at 18.30, the melody swell) | not above voice -31 | PASS |
| quietest 3 s speech window | -36.55 (at 34.30) | info | spread 4.4 LU |
| worst 3 s window voice - music | 29.54 LU (at 14.05) | >= 20 | PASS |
| hold1 / hold2 / hold3 / hold5 / hold6 vs surrounding bed | +0.60 / -0.60 / +0.90 / -0.40 / -0.58 dB | within +/-1 | PASS |
| same holds vs nominal bed | +0.43 / +0.81 / -0.29 / +0.08 / +0.18 dB | within +/-1.5 | PASS |
| reveal lift 48.80-49.36 vs surrounding / nominal bed | +2.26 / +1.63 dB | <= +3 | PASS |
| reveal momentary max | -48.32 = nominal bed +1.77 dB (at 49.35) | <= +3 | PASS |
| music before 3.80 s | silent (no sample); mix = voice + chapter-open only | silent | PASS |
| music at bed by 4.40 s | -0.54 dB | about bed | PASS |
| tail 87.79-89.67 vs bed before it | -0.32 dB (+0.06 vs nominal) | flat, no lift | PASS |
| music in last frame | -50.9 dBFS RMS | still sounding | PASS |
| chapter-open / boundary-seat momentary max | voice -15.9 / -17.0 LU | voice -16 to -17 | PASS |
| boundary-seat peak vs divider rest | 48.803 vs 48.800 | on the rest, <= 2 frames late | PASS |
| sfx under a spoken word | 0 blocks | 0 | PASS |
| music max momentary / short-term | -47.05 / -48.21 | ceiling voice -8 (-24) | PASS |
| true peak: music_full / music_bed / sfx | -34.73 / -34.73 / -14.39 dBTP | <= -1.5 | PASS |
| mix integrated / TP / LRA | -16.13 / -1.73 / 5.8 | -16 +/-0.5, TP <= -1.5 | PASS |
| mix AAC 320k round trip | -16.14 / -1.73 | -16 +/-0.5, TP <= -1.0 | PASS |
| mono downmix | voice-music gap +1.60 LU | must not shrink | PASS |

Round 1 (2714 frames) also passed every line; its reveal lift was +2.50 / +1.95 dB and its
results are in `round1/sim.results.json`.

- Final MP4: not measured yet (the main thread renders). If it reads outside -16 +/-0.5, apply
  a gain-only pass (loudnorm `linear=true` / `normalization_type` linear) of exactly
  -16 - measured; don't re-ride the mix.
- Caption cues: none (no music-only stretch of 5 s or more).
- Listen for: the reveal (the bass arriving with the whoosh at 48.8, peaking slightly at
  49.2-49.4, settled by "Now" at 50.16: check that the shortened ease doesn't read as the
  music pulling away); hold 5's phrase change at 64.4, after the wipe and just before
  "One"; hold 3, which measures +0.9 dB over its quieter before-window but -0.3 dB against
  the nominal bed.
