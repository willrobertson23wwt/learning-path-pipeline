# Sound vocabulary: Linux Intermediate

One line per sound: name, file, gain, the one meaning it carries. Same file, same gain,
same meaning every time (sound-design.md rules 12-14). Gains are MixTrack `gainDb` on the
delivered 48 kHz file and put the sound at the listed momentary loudness against a
-16 LUFS voice. Never reuse a sound for another meaning; add a new line instead.

| Name | File (public/) | Gain | Momentary | Meaning | Placement rule |
|---|---|---|---|---|---|
| `chapter-open` | `audio/li-v6/sfx-chapter-open.wav` (Epidemic `073cf199-3d1b-4a67-9128-a5abd13870ff`, "Designed, Whoosh, Soft Airy", 96 kHz source, head trimmed 0.100 s, 48 kHz) | -11.7 dB | -32 LUFS (voice -16) | A chapter begins. | Chapter title cards only, `at: 0` (frame 0). Audible from 0.015 s, peak 0.28 s, file ends 0.80 s: must finish before the first word. |
| `boundary-seat` | `audio/li-v6/sfx-boundary-seat.wav` (Epidemic `14f0f3a4-cc2b-4d8b-b453-49fd070c591d`, "Swooshes, Whoosh, Short, Deep Reversed, Dry", 96 kHz source, 48 kHz) | -13.8 dB | -33 LUFS (voice -17) | The network/host boundary moved. | Only when the prefix divider comes to rest at a new prefix, never for other motion. Rising reversed whoosh, no impact (user: nothing startling). Peak at 0.500 s into the file, cut (-20 dB) at 0.540 s: set `at` = rest time - 0.500 s, rounded to the frame, so the peak lands on the rest frame and the cut 1 frame later. Only inside a speech gap. |

Not yet in the vocabulary (add when a chapter needs one, with 2 candidates): a "blocked"
sound (li-v6-ch1 left the red cross silent because it lands under speech), a "confirm"
sound.


Levels lowered 5 dB on 2026-09-24 after the user's headphone listen: effects sit at about voice -16 to -17 momentary so nothing is jarring on headphones.
