# Mix sheet: li-v6 (Addressing and Subnetting)

## Video
- Chapters / compositions: li-v6-ch1 (`LiV6Ch1Manim`), li-v6-ch2, li-v6-ch3; fps: 30. The
  user's custom intro (li-v6-intro) has no music (user decision 2026-09-24).
- **One track per chapter** (user decision 2026-09-24, overrides sound-design.md rule 10):
  chapters are joined in Premiere with a standard audio crossfade, and the change of track
  is meant as a break. Each chapter's music is still sounding on its last frame (the video's
  last chapter may end on its track's real ending). No key or tempo continuity across
  chapters. The effect vocabulary IS shared: `courses/linux-intermediate/sound/vocabulary.md`.

### House rules for the rest of the course (user, after the li-v6-ch1 listen, 2026-09-24)
These override the sound-design.md cheat sheet wherever they differ.
1. **Title silent apart from the effect.** No music under a chapter title: only
   `chapter-open` at frame 0. The music starts as the title leaves, faded in (eased) over the
   title's own fade-out (li-v6-ch1: 2.4-3.0 s), at bed level when the fade ends. Narration
   that starts under the title has no music under it.
2. **Bed at voice -34 LU, the equivalent of the user's -40 dB in Premiere on a typically
   mastered track** (-40 dB on a -13.6 LUFS track = -53.6 LUFS against raw -20.17 narration,
   a 33.5 LU gap). Against the -16 LUFS voice: about -50 LUFS. Flat: slow, inaudible gain
   compensation (ramps of 3 s or more, placed under speech, never a ramp confined inside a
   gap) so the track's own build never makes the bed creep up. No 3 s speech window louder
   than voice -31.
3. **No lifts in normal holds** (scene-change or reading pauses of about 1-2 s), and no tail
   lift: the bed stays flat through them, within +/-1 dB of the surrounding bed.
4. **Only a slight lift, +3 dB or less over the bed, and only in key-animation holds of about
   2.5 s or more** (the reveal): eased, 0.8 s up / 0.8 s down, finished by the next word,
   counting any musical change (a bass entry) inside it.
5. Effects keep their vocabulary levels (voice -11/-12 momentary); they now sit well above
   the bed, which the user likes.
6. **Bake the music envelope into the delivered file** and play it with `gainDb: 0`: Remotion
   quantizes `<Audio>` volume to 0.01 steps (measured on the li-v6-ch1 v2 render: a wanted
   0.0153 played as 0.0100, and a slow ramp crossing 0.015 jumped 6 dB). At a -34 LU bed the
   per-frame gains are 0.01-0.05, so MixTrack envelopes are unusable there. Effect gains
   (0.46, 0.36) round by under 0.1 dB and may stay in mix.json.
- Joint advice for the editor: fade only the OUTGOING chapter in the crossfade; the
  incoming chapter should play at full level from its first frame so its `chapter-open`
  whoosh (0.015-0.71 s) is not dimmed.
- Voice: every chapter's narration is mastered to a **stereo dual-mono** 48 kHz/24-bit WAV at
  -16 LUFS measured as stereo (BS.1770 sums channels, so a mono file at -16 would read about
  -13 once duplicated to L/R). TP <= -1.5 dBTP.
- Carve: none (EQ not needed; the bed sits 34 LU under the voice).
- Effect vocabulary used: `chapter-open` (ch1 frame 0), `boundary-seat` (ch1 divider rest).

## Chapter 1 (li-v6-ch1) - built 2026-09-24; v3 refit to shortened holds the same day

### Music
- **The Sun Might Rise in the West**, Jakob Ahlbom (composer/producer/artist), Epidemic Sound,
  ID `6c6217ba-5697-4b7d-9cdc-d4f79cdbbf7c`. License: Epidemic Sound subscription (connected
  account), full-mix WAV downloaded 2026-09-24 via DownloadRecording (FULL, WAV); Epidemic
  filename `ES_The Sun Might Rise in the West - Jakob Ahlbom.wav`. Source kept at
  `public/audio/li-v6/source/es-sun-might-rise-in-the-west.wav` (48 kHz/24-bit stereo, 203.372 s).
- Key E-flat major, 75 BPM, bar 3.200 s (96 frames). Tags: ambient, floating, hopeful, no
  vocals. Stems: melody, instruments, bass (no drums).
- Source loudness: -13.5 LUFS integrated, 0.0 dBTP, LRA 14.5 (short-term -24 in the intro
  rising to -11.5 by track 96 s).
- Sections found on the downloaded file: bass entry onset **track 57.580 s** (low band
  < 120 Hz jumps from -68 to -32 dB between 57.575 and 57.595, then swells for ~2 s); the
  melody's loudness rise is at track ~27.1 s (comp ~19.4, under speech); the track's own dip
  before the bass is track 53-57.5 (comp 45.4-49.9).

| Chapter | Music in-point (track) | Out-point | Edits | Frame 0 action |
|---|---|---|---|---|
| li-v6-ch1 (v3) | 10.080 s (sample 483,840) | 96.650 s (sample 4,639,200) | none: one straight excerpt, 86.570 s, so the bass entry (track 57.580) lands on comp **47.500**, the divider rest (cReveal 45.69 + reveal_s 1.8 = 47.49, frame 1425) | silent 0-2.4 s (title), eased fade-in 2.4-3.0 s to bed; no tail fade (still sounding, -51.4 dBFS RMS in the last frame) |

(v1/v2 used in-point 7.680 for the old timeline, bass on 49.900 / frame 1497.)

Delivered: `public/audio/li-v6/li-v6-ch1.music.wav` (the plain excerpt, 48 kHz/24-bit stereo,
4,155,360 samples; build input) and the two **baked** files the composition plays:
`li-v6-ch1.music.mix.wav` (envelope with the reveal lift) and `li-v6-ch1.music.bed.wav`
(same, lift off, for the bed stem), both 48 kHz/24-bit, envelope applied per sample.
Unused rest of the track (98.45-203.37 s) is free, but chapters 2-3 use other tracks.

### Voice
- `public/audio/li-v6/li-v6-ch1.voice.wav` from `public/chapters/li-v6-ch1/narration.mp3`
  (pass 1: -20.17 LUFS, -1.07 dBTP, LRA 4.4). Chain: aresample 48000 (filter_size 64),
  +1.2 dB, `alimiter` limit 0.8128 (-1.8 dBFS), attack 1 ms, release 50 ms, asc, latency=1,
  pan to dual-mono stereo, pcm_s24le. Script: `out/li-v6-ch1/sound/master-voice.sh`.
- Result: **-16.01 LUFS (stereo), -1.78 dBTP, LRA 4.3**. Max limiter gain reduction 1.92 dB,
  active (> 0.1 dB) in 1.2% of 10 ms blocks. Timing: 3,909,120 samples, identical to the
  source at 48 kHz, cross-correlation lag 0 samples. Same cut table (kit.ts CUTS_NARR_SEC).

### Gain curve (v3, 2026-09-24)
**Why v3:** the user found the pauses too long where nothing moves, so holds 1, 2, 3 and 5
went from 1.0 to 0.2 s and the reveal hold from 2.5 to 1.5 s (chapter now 2597 frames,
86.567 s; narration cut points unchanged, only the Sequence starts moved: frames 30, 289,
497, 1121, 1443, 1857). The excerpt, envelope and boundary-seat were refitted; house rules
unchanged.

Built by `out/li-v6-ch1/sound/build_mix_v3.py` (+ `trim_v3.json`: reveal -0.5) from measured
section loudness (-24.37 intro, -18.99 after the melody, -16.91 late B, -14.55 after the bass,
-11.80 late D), then baked per sample. Every time comes from `timeline.py` (beats.json + the
kit cut table + measured narration silences). Envelope points: `envelope_v3.json`.
Speech gaps (composition s): first word 1.118; hold1 9.254-10.398; hold2 16.194-17.196; hold3
36.689-37.855; hold4 (reveal) 46.454-48.762 (2.31 s); hold5 61.408-62.653; last word ends
84.585; end 86.567. Voice -16.01; bed target -50.0 LUFS (voice -34).

| Segment | Time (s) | Target | Gain dB | Ramp | Reason |
|---|---|---|---|---|---|
| title | 0-2.4 | silent | -inf | - | house rule 1 |
| fade-in | 2.4-3.0 | to bed | -inf to -25.64 | eased (amplitude) 0.6 s | with the title/loop fade-out |
| bed, pad intro | 3.0-14.22 | -50 (voice -34) | -25.64 | - | measured -24.37 |
| hold 1 phrase correction | down 6.25-9.25, flat through hold 1, back 10.40-13.40 | -50 | -1.5 bump | 3 s eased, under speech | a louder phrase of the track lands in hold 1 |
| melody compensation | 14.22-20.22 | -50 | -25.64 to -31.02 | eased 6 s centred on the melody swell (~17.2) | crosses hold 2 slowly |
| bed, scenes B-C | 20.22-42.90 | -50 | -31.02 to -33.10 linear | - | follows the track's build |
| hold 3 correction | down 33.69-36.69, flat through hold 3, back 37.86-40.86 | -50 | -1.75 bump | 3 s eased, under speech | a track downbeat just before hold 3 |
| dip compensation | up 41.9-44.9, held to 46.70 | -50 | +4.0 (to -29.10) | eased 3 s, under speech | the track's own dip before the bass |
| **reveal (hold 4)** | up 46.704-47.504, plateau to 47.962, down 47.962-48.762 | bed +1.5/+2.0, counting the bass | -29.10 to -29.46 / -28.96, down to -35.46 | 0.8 s up / 0.8 s down, done by "Now" 48.762 | house rule 4; the bass entry at 47.500 supplies the rise |
| bed after the reveal | 48.762-84.585, held to the end | -50 | -35.46 to -38.21 linear | - | post-bass build |
| hold 5 correction | up 58.41-61.41, flat through hold 5, back 62.65-65.65 | -50 | +0.75 bump | 3 s eased, under speech | the track softens in hold 5 |
| holds 1, 2, 3, 5 and tail | - | flat | bed (with the corrections above) | no lifts | house rule 3 |

Corrections were chosen by `sweep_v3.py` on the simulated stem (gap vs its 3 s surroundings
and vs the nominal bed). Note: the reveal gap is now 2.31 s, a little under the rule-4 "about
2.5 s" guide; the slight lift was kept as the coordinator asked.

History: v2 (bed -34, same rules, old 2.5/1.0 s holds, in-point 7.680) and v1 (breaths, bed
-25, title music) are kept as `build_mix_v2.py` / `build_mix_v1.py`, stems in `stems_v2/`,
`stems_v1/`, and the v2 audio/mix files in `out/archive/li-v6-ch1-holds-v1/sound-v2/`.

### Effect cues
| Cue | Frame | Event on screen | Sound | Gain | Momentary (sim) | Gap or overlap |
|---|---|---|---|---|---|---|
| 1 | 0 (`at: 0`) | `titleIn`: title over the fluid loop | `chapter-open` | -6.7 dB | -27.04 LUFS (voice -10.9) at 0.50 s | gap 0-1.118; file ends 0.80 s |
| 2 | 1410 (`at: 47.000`) | `cReveal` end: divider rests at x 928 (45.69 + 1.8 = 47.49, frame 1425) | `boundary-seat` | -8.8 dB | -27.95 LUFS (voice -11.9) | gap 46.454-48.762; audible 47.33-47.65, peak 47.500 (measured on the render), cut 47.540 (1 frame late, never early) |

### Measurements (v3 rendered stems, 2026-09-24: `LiV6Ch1Manim`, 2597 frames, baked music, 48 kHz 16-bit WAV in `out/li-v6-ch1/sound/stems/`; `measure_v3.py`; simulation identical)
| Check | Value | Target | Result |
|---|---|---|---|
| voice stem integrated / TP | -16.09 / -1.78 | -16 +/-0.5, TP <= -1.5 | PASS |
| bed (music_bed from 3.0 s) | -50.26 LUFS = voice -34.17 | voice -34 +/-1 | PASS |
| loudest 3 s speech window, music re voice | -32.23 (at 17.20 s, the melody swell) | not above voice -31 | PASS (1.2 LU margin) |
| quietest 3 s speech window | -36.61 (at 32.95 s) | info | spread 4.4 LU |
| worst window voice - music (rule 4) | 29.47 LU | >= 20 | PASS |
| hold1 / hold2 / hold3 / hold5 vs surrounding bed | +0.31 / -0.72 / +0.56 / -0.53 dB | within +/-1 | PASS (hold 2 sits 0.65 dB over the nominal bed; its after-window is the hot melody swell) |
| reveal plateau 47.50-47.96 vs surrounding bed / vs nominal bed | +2.54 / +1.89 dB | <= +3 | PASS |
| reveal momentary max | -47.20 LUFS = bed +2.89 dB (at 48.10 s) | slight | PASS |
| music before 2.4 s | silent; mix = voice + chapter-open only | silent | PASS |
| music at bed by 3.0 s | -0.09 dB | about bed | PASS |
| tail 84.59-86.57 vs bed before it | -0.29 dB; last frame -51.4 dBFS RMS | flat, still sounding | PASS |
| bass onset / boundary-seat peak on the render | 47.515 (low band +20 dB threshold) / 47.500 s | divider rest 47.49-47.50 | PASS |
| chapter-open / boundary-seat momentary max | -27.04 / -27.95 LUFS (voice -10.9 / -11.9) | unchanged | PASS |
| sfx under a spoken word | 0 | 0 | PASS |
| music max momentary / short-term | -47.04 / -48.21 | ceiling voice -8 | PASS |
| mix.wav integrated / TP / LRA | -16.12 / -1.75 / 5.6 | -16 +/-0.5, TP <= -1.5 | PASS |
| mix.wav AAC 320k round trip | -16.13 / -1.75 | -16 +/-0.5, TP <= -1.0 | PASS |
| mono downmix | voice-music gap +1.62 LU | must not shrink | PASS |

- Voice stem re-rendered for v3 (new Sequence starts); level unchanged.
- Render vs simulation: identical (baked envelope; voice segments within 16 samples).
- Designer's times vs measured: the hold-4 ease-back is at "Now" (52.162), not the nominal
  51.2; the melody entry is at comp ~19.4 (under speech), not 17.9.
- normalization_type on final pass: none needed (rendered mix -16.16, inside the window);
  measure the final MP4 decode when it exists.
- Caption cues added: none (music-only stretches are all under 5 s).
- Mono check: rendered pass (+1.63 LU); user listened (v1) and approved the direction for v2.

### What the next engineer needs (chapter 2)
- Apply the house rules above: silent title with `chapter-open` at frame 0 (-6.7 dB), music
  faded in over the title's fade-out, bed at voice -34 flat with slow measured compensation,
  no lifts in normal holds or the tail, at most +3 dB in a key-animation hold of about 2.5 s
  or more (counting the music's own change there), `boundary-seat` (-8.8 dB) whenever the
  divider settles at a new prefix.
- Bake the music envelope into the delivered file (gainDb 0 in mix.json); keep a bed variant
  for the bed stem.
- Master the voice the same way (stereo dual-mono), measure the gaps with silencedetect, not
  whisper word ends. Tooling to copy: `out/li-v6-ch1/sound/timeline.py` (derives every time from beats.json),
  `build_mix_v3.py`, `sim_v3.py`, `measure_v3.py`, `sweep_v3.py`, `master-voice.sh`. When holds
  change, only beats.json changes: rerun timeline.py, re-pick the in-point from the new
  divider rest, rebuild, re-sweep the hold corrections.
- Check each hold against its surrounding 3 s AND the nominal bed: a phrase downbeat of the
  track landing in a gap (ch1 hold 3) needs a slow correction outside the gap.

## Chapters 2-3: lo-fi shortlist (user likes lo-fi; not downloaded, shot lists not written yet)
All tagged no vocals; all have DRUMS/BASS/INSTRUMENTS/MELODY preview stems. DownloadRecording
offers FULL/BASS/DRUMS/INSTRUMENTS (no MELODY; `bundle` unverified). To lower drums under
speech: FULL minus a phase-inverted DRUMS stem, only if a null test passes. Drum level =
DRUMS stem below the full mix. Each chapter must start mid-track (already playing) and end
still sounding (ch3 may use its track's real ending for the video close).

| Track (ID) | BPM, key, length | Character | Drums | Preview |
|---|---|---|---|---|
| Fragile Stevie, Jobii (`a344f5ee-8467-39b3-9ebe-6d25ce646459`) | 60, G major, 2:46.5 | smooth; 2-bar drop at 96-104, melody enters 104, drums soften from 128 | ~10 dB under | https://audiocdn.epidemicsound.com/lqmp3/01KJZENW966XJDRA3F3PV654TM.mp3 |
| Lost in the Woods, Guustavv (`1957f9f2-e97a-41d8-9301-40006304bc8a`) | 73, C major, 2:30.2 | softest drums found; drumless 66-92 and 118-145 | ~17 dB under | https://audiocdn.epidemicsound.com/lqmp3/01KK31EBCDKRP8XXJ604A213DS.mp3 |
| Sleeping Dragon, Ecobel (`cd87743e-07c6-46c2-8dfc-8232182f3929`) | 64, D-flat major, 2:40 | keys-led, sentimental; drumless 0-34, 68-82, 101-end | ~9 dB under; keys melody up front | https://audiocdn.epidemicsound.com/lqmp3/01KK28P7PX1K1HJTAR86D4E2DH.mp3 |
| Sunrise in El Born, Matt Large (`00f3638d-acdf-4e57-b45f-c252a9d8197f`) | 68, D minor, 3:53 | warm, steady, darker; drums out 169-191 | ~8 dB under | https://audiocdn.epidemicsound.com/lqmp3/01KK39MMAW1XQ3H3T53CHR293Q.mp3 |
| Calm Cadence, Chill Cole (`3dbc5971-c4bd-406f-a7de-0fdcd59551d2`) | 60, B-flat minor, 2:42 | mellow, even; drumless intro 0-16 and outro 144-162 | ~10 dB under | https://audiocdn.epidemicsound.com/lqmp3/01KJT2WGRQ6W3ZC0E9EG3JKRKX.mp3 |
| Head in the Clouds, Mizlo (`c0c8990e-57a7-453e-8fe2-a67ed390021f`) | 60, A-flat major, 3:00 | dreamy; 32 s drumless breakdown 80-112 | ~6 dB under (loud; lower drums) | https://audiocdn.epidemicsound.com/lqmp3/01KTENHSZWQ66EAA3GT4H2F5ZR.mp3 |
| Sweet Dreams, Mizlo (`66576be1-ccfd-44c1-805d-fd72982a51c6`) | 60, B-flat major, 2:44 | soft intro to 16, melody enters 80, 16 s phrases | ~7 dB under | https://audiocdn.epidemicsound.com/lqmp3/01KTH8G1P447J4XS6XKDK5WM3X.mp3 |
| Last Minute Study, Matt Large (`e09aec6a-5e1a-4a64-b2d0-82a3415a0e3c`) | 78, key not listed, 3:58 | busiest; 2-bar breaks at 37-49, 92-98, 148, 191 | ~5 dB under | https://audiocdn.epidemicsound.com/lqmp3/01KK57PRH23BBPW7V5WRXVGSYV.mp3 |

Section times above are from Epidemic waveform data (first downbeat assumed at 0.0 s);
confirm on the downloaded file, as ch1's bass entry moved 20 ms.
