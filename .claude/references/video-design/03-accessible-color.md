# Accessible color and legibility for narrated instructional video (WCAG 2.2)

Research brief, 2026-09-24. Scope: color, contrast, legibility, motion, and timing rules for the path's micro-videos, briefing, GIFs, and reference cards. The course instruction is "follow the WCAG guidelines for color use"; this brief turns that into checkable rules and measures the current palette against them.

WCAG applies to video frames because text drawn into a frame is an "image of text", which 1.4.3 covers explicitly (Understanding 1.4.3). Contrast is computed from the specified colors, not from anti-aliased pixels, and is never rounded: 4.499:1 fails 4.5:1.

## Update 2026-09-25: the WWT palette on navy (current)

The course switched to the WWT design-system palette on a navy ground,
with hand-drawn marker lettering. The rules below still hold; the palette
measurements further down (cyan, green, amber, the paper and charcoal
grounds) are history. Current numbers, WCAG ratio against the navy sheet's
lightest point (#1D1E48, behind the drawing):

| Role | Token | Contrast | Use |
|---|---|---|---|
| main marker | gray-50 #F6F7F8 | 14.7 | lines, lettering |
| secondary | navy-25 #C7C7D1 | 9.4 | labels |
| ghost | navy-50 #8E8FA4 | 5.0 | superseded content |
| accent A | blue-50 #66B6F2 | 7.2 | network / focus |
| accent B | orange-50 #FDA38B | 8.1 | host / the other side |
| key | gold #FFC601 | 10.0 | the prefix, the reveal |
| problem | red-50 #F57E7F | 6.1 | always with a cross or the word |
| success | positive #1E9E62 | 4.6 | thick strokes and checks only |

Full-strength brand colors on navy: orange #FA4616 4.5, blue #0086EA 4.2,
red #EE282A 3.7, magenta #E31C79 3.5; fills and thick strokes only.

Color vision (Machado 2009 simulation): blue-50 and orange-50 stay apart
under deuteranopia and protanopia (periwinkle vs khaki) and under
tritanopia (cyan vs pink). Their luminance ratio is only 1.13, so rule 6
applies: brightness is not the second cue. Orange-50 and red-50 both
become khaki under red-green deficiencies (luminance ratio 1.32), which is
why red never carries meaning without its cross.

## Design rules this supports

1. Give every piece of text at least 4.5:1 contrast against the color directly behind it, measured against the lightest patch of any texture it crosses. (1.4.3)
2. Treat all on-screen text as normal-size text for contrast. The 3:1 large-text allowance needs 24 CSS px (18 pt) or 18.5 CSS px bold (14 pt); in an 800 px wide embedded player that is 58 px (45 px bold) in the 1920x1080 source, larger than almost anything the course draws. (1.4.3, pixel math below)
3. Aim for 7:1 on body text and narration-parallel text; accept 4.5:1 only for short colored labels. (1.4.6, AAA, advisory)
4. Give every line, border, arrow, icon, and fill boundary that a learner needs in order to understand the picture at least 3:1 against every adjacent color. Pale fills may stay pale if a 3:1 border carries the edge. (1.4.11)
5. Never let color alone carry a meaning. Every color-coded distinction (network/host, pass/fail, before/after) also gets a word label, a drawn glyph, a position, or a line style, and that cue stays visible whenever the color does. (1.4.1; techniques G14, G111)
6. Do not count brightness as the second cue in this palette: no pair of palette colors reaches the 3:1 luminance difference 1.4.1 accepts as a non-hue cue (see the pair table).
7. Keep backgrounds dark gray, never pure black, and body text off-white (87-92% white), never pure white on pure black, to limit halation. About 40% of adults have astigmatism. (Material Design dark theme; Hashemi et al. 2018)
8. Never render text below 50% white on the course backgrounds; 46-48% is where it drops under 4.5:1. (1.4.3, measured below)
9. Draw colored strokes at least 2 px wide at 1080p (the hand-drawn style uses 4-8 px marker lines). Compressed video halves color resolution, so 1 px saturated lines bleed and lose contrast. (engineering note, not a WCAG number)
10. Caption every narrated video with synchronized, accurate captions, and keep essential graphics out of the bottom 15% where captions render. (1.2.2; MAUR CC-5 and VP-5 require captions not to cover important content, positioned at least 1/12 of the frame height above the bottom)
11. Narrate every command, value, and label the learner needs from the picture, so the soundtrack is the audio description and no separate description track is needed. (1.2.5: "if all of the important information in the video track is already conveyed in the audio track, no additional audio description is necessary")
12. Give every silent GIF a text alternative that lists each keystroke and its visible result. (1.2.1, video-only)
13. Autoplaying loops that run past 5 s beside the lab text need a visible pause control. (2.2.2)
14. Nothing flashes more than three times in any one second, at any size, in any color; treat saturated red (DANGER) as highest risk. A cursor blinking about once a second is fine. (2.3.1: a flash is a luminance change of 10% or more where the darker state is below 0.80; the small-area exemption is 25% of a 10-degree visual field, 341x256 px at 1024x768, judged at the largest size a viewer may watch)
15. Keep motion eased and purposeful; no parallax drift, camera shake, or decorative zoom. (2.3.3, AAA, protects people with vestibular disorders)
16. Leave text that is not narrated on screen for at least 0.33 s per word (180 wpm), never less than 5/6 s, and for dense strings at most 15-20 characters per second. The house rule of 1.5 s plus 0.3 s per word meets this. (BBC subtitle guidelines 160-180 wpm; Netflix 20 cps adult, 5/6 s minimum event, 7 s maximum)
17. Set on-screen text no smaller than 40 px (terminal monospace 34 px) at 1080p, so it lands near 16 CSS px when the player is ~800-960 px wide; nothing below 28 px. (derived from 1.4.3 sizing and the BBC 8%-of-height caption line; see pixel math)

## How the numbers were computed

WCAG 2.2 relative luminance, per channel (C = value/255):

```
c_lin = C/12.92                     if C <= 0.04045
c_lin = ((C + 0.055)/1.055)^2.4     otherwise
L  = 0.2126 R_lin + 0.7152 G_lin + 0.0722 B_lin
CR = (L_lighter + 0.05) / (L_darker + 0.05)
```

Translucent colors are composited in encoded sRGB, the way a browser or video renderer blends by default: `C = a*F + (1 - a)*B`.

Worked example, ACCENT #00C2FF on paper rgb(42,42,42): G = 194/255 = 0.7608, linear 0.5395; B = 1.0; R = 0. L = 0.7152(0.5395) + 0.0722(1.0) = 0.4580. Paper: 42/255 = 0.1647, linear 0.02315 = L. CR = (0.4580 + 0.05)/(0.02315 + 0.05) = 6.94.

Backgrounds measured at both ends of the texture range:

| Surface | Composited RGB | L |
|---|---|---|
| Paper, dark end | 38, 38, 38 | 0.01938 |
| Paper, light end | 42, 42, 42 | 0.02315 |
| Panel rgba(13,22,38,0.92) over paper 38 | 15.0, 23.3, 38.0 | 0.00865 |
| Panel over paper 42 | 15.3, 23.6, 38.3 | 0.00883 |

## Palette measurements

### Text and graphics on the course surfaces

Thresholds: 1.4.3 AA 4.5:1 (normal text), 1.4.6 AAA 7:1, 1.4.11 3:1 (graphics). "Worst" is the lowest of the four surfaces.

| Color | L | Paper 38 | Paper 42 | Panel | Worst | 1.4.3 AA | 1.4.6 AAA | 1.4.11 |
|---|---|---|---|---|---|---|---|---|
| ACCENT #00C2FF | 0.458 | 7.32 | 6.94 | 8.64-8.66 | 6.94 | Pass | Panel only | Pass |
| SUCCESS #3DD68C | 0.510 | 8.07 | 7.65 | 9.52-9.54 | 7.65 | Pass | Pass | Pass |
| WARNING #E8A13A | 0.430 | 6.91 | 6.55 | 8.15-8.18 | 6.55 | Pass | Panel only | Pass |
| DANGER #FF5C5C | 0.297 | 5.00 | 4.74 | 5.90-5.91 | 4.74 | Pass, thin margin | Fail | Pass |
| White 92% | 0.855 on paper 42 | 13.00 | 12.37 | 15.17-15.21 | 12.37 | Pass | Pass | Pass |
| White 60% | 0.401 on paper 42 | 6.38 | 6.16 | 7.01-7.02 | 6.16 | Pass | Panel only, by 0.01 | Pass |

Texture headroom: DANGER text drops below 4.5:1 once the paper reaches gray 46, only 4 levels above the measured light end. ACCENT holds to gray 70, WARNING to 67, white 60% to 72. White 92% on paper is rgb(238) on rgb(42), 12.4:1, well short of the 21:1 of pure white on black, so it passes comfortably without the halation extreme.

### Cells

| Cell | Fill RGB (over panel / paper 42) | Fill vs surround | White 92% digits vs fill | Full-color border vs surround / vs fill |
|---|---|---|---|---|
| ACCENT 20% | 12,58,82 / 34,72,85 | 1.46-1.48 | 8.62-10.52 | 6.94-8.66 / 4.76-5.88 |
| SUCCESS 20% | 25,62,59 / 46,76,62 | 1.52-1.53 | 8.28-10.26 | 7.65-9.54 / 5.02-6.30 |
| Neutral: white 5% fill, 12% stroke | 27,35,49 / 53,53,53 | fill 1.13-1.16; stroke 1.41-1.46 | 10.71-13.53 | stroke vs fill 1.25-1.26 |

- Digits in every cell pass 1.4.3 AA and AAA.
- The 20% tinted fills fail 1.4.11 as edges (about 1.5:1). A fill at that alpha only works as a secondary cue behind a 3:1 border or label. Raising the fill to 3:1 needs 47-54% alpha, and on bare paper that drops the white digits to 4.2-4.3:1, a 1.4.3 failure. A border is the better fix.
- The neutral cell's 12% stroke fails 1.4.11 (1.41-1.46). That is acceptable only where the cell edge is pure grouping and the digits carry all the meaning. Where the edge itself means something (a bit boundary, an octet, a table the learner must read across), the stroke needs at least 34% white for 3:1; 40% gives margin (3.59-3.81 vs surround, 3.09-3.36 vs the 5% fill).

## Color vision deficiency analysis

**Prevalence.** Red-green deficiency affects about 8% of men and 0.4% of women of European descent, and 4-6.5% of men of Chinese and Japanese descent (Birch 2012). Among the 8%: about 1% protanopes, 1% deuteranopes, 1% protanomalous, 5% deuteranomalous. Tritan deficiency is rare, on the order of 1 in 30,000-50,000 (Colour Blind Awareness). A path with a few hundred learners should expect some red-green-deficient viewers in almost every cohort.

**Which hues collapse.** Protan and deutan viewers lose the red-green axis: red, orange, yellow, and green converge on a band of tans and olives, differing mostly in lightness. Protans also see red as darker. Blue versus yellow survives. Tritans lose the blue-yellow axis: blue and green converge, and so do violet and red.

**Method.** Protanopia and deuteranopia were simulated two ways: Machado, Oliveira and Fernandes (2009) at severity 1.0, and Viénot, Brettel and Mollon (1999), both applied to linear RGB (the DaltonLens review notes that skipping sRGB linearization invalidates results). Viénot projection, derived here from the paper's LMS matrix with the plane through black, blue (0,0,1), and yellow (1,1,0): protan L' = 2.02344M - 2.52581S; deutan M' = 0.49421L + 1.24827S. Tritanopia uses Machado 2009 only; DaltonLens recommends Brettel 1997 for tritan work, so treat the tritan column as indicative. Distance is CIEDE2000 (ΔE00) between simulated colors. Working thresholds for label- and line-sized marks, informed by the finding that small marks need larger differences (Stone, Szafir and Setlur 2014; Szafir 2018): 20 or more is clearly distinct, 10-20 is risky, under 10 is confusable. These thresholds are a judgment call, not a standard.

Machado severity-1.0 matrices (linear RGB, rows R', G', B'):

```
protan  [0.152286 1.052583 -0.204868; 0.114503 0.786281 0.099216; -0.003882 -0.048116 1.051998]
deutan  [0.367322 0.860646 -0.227968; 0.280085 0.672501 0.047413; -0.011820 0.042940 0.968881]
tritan  [1.255528 -0.076749 -0.178779; -0.078411 0.930809 0.147602; 0.004733 0.691367 0.303900]
```

### Simulated colors (sRGB 0-255)

| Color | Normal | Protan (Machado) | Protan (Viénot) | Deutan (Machado) | Deutan (Viénot) | Tritan (Machado) |
|---|---|---|---|---|---|---|
| ACCENT | 0,194,255 | 162,191,255 | 184,184,255 | 133,172,254 | 166,166,255 | 0,211,215 |
| SUCCESS | 61,214,140 | 212,197,135 | 204,204,139 | 193,184,145 | 186,186,143 | 0,212,195 |
| WARNING | 232,161,58 | 186,165,43 | 171,171,59 | 202,182,61 | 186,186,50 | 253,143,140 |
| DANGER | 255,92,92 | 135,126,91 | 126,126,93 | 176,161,88 | 163,163,83 | 255,54,94 |

### Pair distances (ΔE00, then luminance ratio)

| Pair | Normal | Protan M / V | Deutan M / V | Tritan M | Verdict |
|---|---|---|---|---|---|
| ACCENT vs SUCCESS (network vs host) | 41.0 / 1.10 | 42.5 / 47.6 | 40.8 / 45.5 | **7.2** | Distinct for red-green CVD; confusable for tritans; no brightness cue |
| SUCCESS vs DANGER (pass vs fail) | 73.5 / 1.61 | 22.4 / 24.3 | **10.3 / 10.7** | 73.0 | Risky for deutans, the largest CVD group |
| WARNING vs DANGER | 32.3 / 1.38 | 19.4 / 20.2 | **8.8 / 9.0** | 15.3 | Confusable for deutans |
| SUCCESS vs WARNING | 42.8 / 1.17 | 12.7 / 12.1 | 14.1 / 14.6 | 58.8 | Risky for protans and deutans |
| ACCENT vs WARNING | 52.8 / 1.06 | 50.8 / 55.6 | 54.8 / 61.8 | 54.8 | Distinct for all |
| ACCENT vs DANGER | 61.0 / 1.46 | 41.9 / 44.6 | 49.2 / 55.3 | 67.3 | Distinct for all |

**Answer to the network-vs-host question.** Yes, ACCENT cyan and SUCCESS green stay distinguishable under both deuteranopia and protanopia. Cyan simulates as a light periwinkle blue (Machado deutan 133,172,254) and green as a khaki (193,184,145): a blue-versus-yellow difference that red-green dichromats keep, with ΔE00 over 40 in both models. The pair does fail two other ways. Under tritanopia both become teal (0,211,215 vs 0,212,195; ΔE00 7.2). And the two colors have almost the same luminance (1.10:1), so a monochrome display, a grayscale print of a card, or low-vision viewing loses the distinction entirely. Since 1.4.1 forbids color as the only cue anyway, the pairing needs a second cue.

The larger risk is elsewhere: **pass/fail (SUCCESS vs DANGER) and warning/danger are the pairs deuteranopes are most likely to confuse**, and no hex adjustment within these color families fixes it. Tested pinker and lighter reds (#FF6680 to #FF7A85) all pull closer to SUCCESS under deutan simulation (ΔE00 3-8). Using brightness instead would need SUCCESS near white once DANGER keeps its 4.5:1 text contrast. The fix is a second cue, not a new color.

**Reference palettes.** Okabe-Ito and Paul Tol's schemes are designed for CVD safety but tuned for white paper. Measured on paper rgb(42): Okabe-Ito yellow 10.85, orange 6.37, sky blue 6.22, reddish purple 4.69, bluish green 4.20, vermillion 3.71, blue 2.77; Tol bright cyan 7.82, grey 7.48, yellow 7.35, red 4.65, green 3.17, blue 3.05, purple 2.36. On a dark background only their light members qualify as text colors, and the dark blues and purples fail even 1.4.11. Borrow their structure (distinct hues spread across blue-yellow as well as red-green), not their hex values.

## Recommended palette changes

Keep the family. ACCENT, SUCCESS, and WARNING stay as they are: all pass 1.4.3 AA and 1.4.11 on every surface.

1. **DANGER #FF5C5C to #FF6666.** ΔE00 2.0 from the current red, so it reads as the same color. Contrast rises from 4.74 to 5.02 on paper and 5.90 to 6.24 on panels, and texture headroom grows from gray 45 to gray 49. Trade-off: deutan distance to SUCCESS drops from 10.3 to 8.6, but that pair already relies on rule 5, so the gain in text contrast is the one that counts. If the hex must not change, set DANGER text only on panels (5.90:1).
2. **Tinted cells: keep the 20% fill, add a 2 px border in the full color.** The border measures 6.94-9.54:1 against the surround and 4.76-6.30:1 against the fill, passing 1.4.11 in both directions; the white digits stay at 8-10:1.
3. **Neutral cells: stroke 12% white to 40% white** wherever the cell edge carries meaning. 12% (1.4:1) may stay only for pure grouping.
4. **White 60% stays the floor for secondary text** (6.16:1 worst case). Nothing below 50%. Keep white 92% for body text.
5. **Required second cues, always on screen with the color:**
   - Network vs host: a word label ("network", "host") on a bracket above or below each span, plus a fixed position (network always left). Optionally draw the host span's bracket dashed.
   - Pass vs fail: a drawn check or cross glyph plus a word ("OK", "denied", "failed"). Keep the glyph shapes distinct in silhouette.
   - Warning vs danger: a different glyph shape for each (triangle vs octagon or cross) plus the word.
   - Highlights and before/after: add an underline, outline, or position change; a hue shift alone is not enough.
6. **Check every new color pair** with the two tables above: 4.5:1 text, 3:1 graphics, and ΔE00 of at least 20 under both protan and deutan simulation, or a mandatory second cue.

## Pixel math for "large text" in a 1920x1080 frame

Large text is 18 pt = 24 CSS px, or 14 pt bold = 18.5 CSS px (1 pt = 1.333 px). A frame shown in a player W CSS px wide is scaled by W/1920.

| Player width (CSS px) | Scale | Source px for large | Large bold | 16 CSS px body |
|---|---|---|---|---|
| 640 | 0.333 | 72 | 56 | 48 |
| 800 | 0.417 | 58 | 45 | 38 |
| 960 | 0.500 | 48 | 37 | 32 |
| 1280 | 0.667 | 36 | 28 | 24 |
| 1920 (full screen) | 1.000 | 24 | 19 | 16 |

The lab guide sits beside a browser terminal, so the embedded player is usually 700-960 px wide. Plan for 800 px. For comparison, BBC subtitles set a line height of 8% of the video height, about 86 px at 1080p.

## References

- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/
- W3C. Understanding SC 1.4.1 Use of Color. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- W3C. Understanding SC 1.4.3 Contrast (Minimum). https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C. Understanding SC 1.4.6 Contrast (Enhanced). https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html
- W3C. Understanding SC 1.4.11 Non-text Contrast. https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- W3C. Understanding SC 1.2.1 Audio-only and Video-only (Prerecorded). https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html
- W3C. Understanding SC 1.2.2 Captions (Prerecorded). https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
- W3C. Understanding SC 1.2.5 Audio Description (Prerecorded). https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html
- W3C. Understanding SC 2.2.2 Pause, Stop, Hide. https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- W3C. Understanding SC 2.3.1 Three Flashes or Below Threshold. https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- W3C. Understanding SC 2.3.3 Animation from Interactions. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- W3C. Media Accessibility User Requirements (Working Group Note, 2015). https://www.w3.org/TR/media-accessibility-reqs/
- BBC. Subtitle Guidelines (160-180 wpm, 0.33 s/word, 8% line height, white/yellow/cyan/green on black). https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/ (the page could not be retrieved during this research; figures were cross-checked against secondary summaries, e.g. https://www.clevercast.com/bbc-subtitling-guidelines/)
- Netflix. English (USA) Timed Text Style Guide (42 characters per line, 20 cps adult, 17 cps children). https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide
- Netflix. Timed Text Style Guide: General Requirements (5/6 s minimum, 7 s maximum, avoid on-screen text). https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements
- Birch, J. (2012). Worldwide prevalence of red-green color deficiency. JOSA A 29(3), 313-320. https://opg.optica.org/josaa/abstract.cfm?uri=josaa-29-3-313
- Colour Blind Awareness. Types of colour blindness. https://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/
- Machado, G. M., Oliveira, M. M., Fernandes, L. A. F. (2009). A physiologically-based model for simulation of color vision deficiency. IEEE TVCG 15(6), 1291-1298. https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
- Viénot, F., Brettel, H., Mollon, J. D. (1999). Digital video colourmaps for checking the legibility of displays by dichromats. Color Research and Application 24(4), 243-252. https://doi.org/10.1002/(SICI)1520-6378(199908)24:4%3C243::AID-COL5%3E3.0.CO;2-3
- Burrus, N. DaltonLens: review of open-source color blindness simulations (linearization, method choice). https://daltonlens.org/opensource-cvd-simulation/
- Okabe, M., Ito, K. Color Universal Design. https://jfly.uni-koeln.de/color/
- Tol, P. Colour schemes (bright, vibrant, muted, light). https://sronpersonalpages.nl/~pault/
- Stone, M., Szafir, D. A., Setlur, V. (2014). An engineering model for color difference as a function of size. https://graphics.cs.wisc.edu/Papers/2014/SAS14/2014CIC_48_Stone_v3.pdf
- Szafir, D. A. (2018). Modeling color difference for visualization design. IEEE TVCG. https://cmci.colorado.edu/visualab/VisColors/
- Sharma, G., Wu, W., Dalal, E. (2005). The CIEDE2000 color-difference formula. https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/
- Google. Material Design: Dark theme (#121212 surface, 87/60/38% white text). https://m2.material.io/design/color/dark-theme.html
- Piepenbrock, C., Mayr, S., Mund, I., Buchner, A. (2013). Positive display polarity is advantageous for both younger and older adults. Ergonomics 56(7). https://pubmed.ncbi.nlm.nih.gov/23654206/
- Hashemi, H., et al. (2018). Global and regional estimates of prevalence of refractive errors (astigmatism 40.4% in adults). J Curr Ophthalmol. https://pubmed.ncbi.nlm.nih.gov/29564404/
