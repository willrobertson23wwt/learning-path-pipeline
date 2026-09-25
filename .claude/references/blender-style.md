# Blender house style

Research brief, 2026-09-24. The rulebook for `blender-builder`: 3D assets and
short animations of IT hardware (servers, switches, cables, laptops, storage)
rendered as transparent PNG sequences and layered into the course's flat 2D
motion graphics (Remotion's hand-drawn videos, where a 3D asset appears as a
card, and Manim). Target: Blender 5.2 LTS (installed
locally, build 2026-07-14); the 4.x differences that matter are noted.
Numbers in brackets are references at the end. "Tested" means measured in
this session with `blender -b --factory-startup` on an Apple M4 Pro [T].

## Rules

1. Set View Transform to **Standard**, Look **None**, Exposure 0, Gamma 1,
   Curves off. Factory default is AgX, which rendered emission #00C2FF as
   #6AADC9; Standard returned #00C2FF exactly. [T][1]
2. Set **Dither to 0** (`render.dither_intensity = 0`). The default 1.0 adds
   noise that spread one flat color across 5 distinct values. [T][2]
3. Keep the working color space at **Linear Rec.709** (the default). Blender
   5.0 added ACEScg and Rec.2020 working spaces, which change what a given
   RGB number means. [3]
4. Enter palette colors as hex, or in Python via
   `Color(srgb).from_srgb_to_scene_linear()`. Hex fields are sRGB and
   gamma-corrected; the RGB sliders may be linear. [4][5]
5. Any surface that must show an exact palette hex ends in an **Emission**
   shader (or Principled Emission) at Strength 1.0. Lit BSDF surfaces never
   match a hex exactly. [6]
6. Render with **EEVEE** (`BLENDER_EEVEE`; `BLENDER_EEVEE_NEXT` in 4.2-4.4).
   Use Cycles only when a shot needs something EEVEE cannot do, and say
   why. [7][T]
7. Output **PNG, RGBA, 8-bit, Film > Transparent on**, 1920x1080 at 100%,
   30 fps with `fps_base` 1.0. PNG stores **straight** alpha. [8][9][10][T]
8. Motion blur **off**. The 2D layers don't blur, so blurred 3D won't
   match them. [11]
9. Model at real size in metric units, scale applied (1,1,1) before any
   Bevel, Solidify, or Array. [12][13]
10. Build every model from a reference sheet of sourced dimensions.
    [house rule]
11. Vendor photos and CAD are modeling references only: never rendered,
    textured, or shipped. No vendor logos unless the user asks. [house
    rule; CLAUDE.md placeholder conventions]
12. Bake no readable text into renders. Labels and port numbers go in the
    2D layer, where they stay sharp and meet contrast rules. [14]
13. Every silhouette edge that carries meaning reaches **3:1 against the
    background**: at least gray 115 (#737373) against the rgb(42) light end
    of the paper texture. Use a rim light, a light outline, or a light body
    tone. [14][15]
14. Lines are at least **2 px** wide at 1080p. [14]
15. Keyframes use Bézier or eased interpolation, never Linear, except a
    constant-speed turntable. Overshoot (Back) at most once per shot, for
    the key moment. [16][17]
16. Camera moves only when the narration asks the viewer to look somewhere
    new. The default is a locked-off camera. No drift, shake, fast orbit,
    or zoom for its own sake. [17][18]
17. Frame range = the beat window. Keyframe times come from the item's
    beat list, converted as `frame = round(seconds × 30)`. Never hard-code
    a time. [house rule; manim-style.md]
18. Nothing flashes more than three times in any one second. [19]
19. Render from the command line and put the output path before `-a`.
    Arguments run in order. [20]

## 1. Subject research before modeling

**Sources, most trusted first.**

1. **Standards** fix the numbers everything else must fit. EIA-310: 1U =
   1.75 in = 44.45 mm; front panel 19 in = 482.6 mm wide; rail opening at
   least 17.75 in (450 mm); mounting-hole rows 465.1 mm apart; holes spaced
   1/2-5/8-5/8 in per U. [21][22] An 8-position modular (RJ45) plug is about
   0.460 in (11.68 mm) wide under FCC Part 68 / IEC 60603-7. [23][24]
2. **Vendor spec sheets and technical guides** give overall dimensions per
   model. Example: Dell PowerEdge R660 (1U) is 42.8 mm high, 482 mm wide
   including ears, and 822.88 mm deep with bezel (809.04 mm without). [25]
   A 1U chassis is shorter than 44.45 mm to leave clearance, and depths
   vary by model, so read the sheet. Don't assume a "standard depth".
3. **Orthographic product photos** (front, rear, top) from the vendor's
   product page or datasheet give port layout and bezel proportions.
   Scale them to a known dimension (panel width, 1U height).
4. **CAD/STEP downloads.** TraceParts hosts supplier-certified STEP files
   for some network gear. GrabCAD models are community uploads: unverified,
   each with its own license. Cisco does not publish 3D CAD for its
   switches. [26][27][28] Blender does not read STEP natively; importer
   extensions exist (e.g. STEP Importer on extensions.blender.org). [29]
   Treat CAD as a dimension check and retopologize. Tessellated CAD is
   heavy and shades badly.
5. **Service-manual and teardown photos** for internals. Their exploded
   diagrams also give the removal order.

**Reference sheet.** Each asset gets `blender/<media-id>/<asset>/reference.md`, a
table with one row per dimension: part, value in mm, source (URL or
document plus page), date accessed, and confidence (`spec` from a
datasheet or standard, `derived` scaled from a photo, `estimated`).
Anything `estimated` is visible in the model only where precision doesn't
matter, and the hand-off lists it.

**Reference images in Blender.** Add > Image > Reference (an image empty)
per view, aligned to the matching orthographic axis. Set Opacity about
0.3-0.5 and Depth *Front* while tracing. Enable *Only Axis Aligned* so the
image disappears when you orbit, and turn off *Show in Perspective*. For
front/back photo pairs, set *Side* so each shows only from its own
direction. [30] Scale each empty until a known feature (panel width
482.6 mm) matches the grid. Keep references in a `REF` collection excluded
from render.

**Units.** Scene > Units: Metric, Unit Scale 1.0, Length millimeters.
Model in true size, then apply scale (Ctrl+A). [12][13]

**Licensing etiquette.** Keep photos and CAD in `refs/` with their
sources, never in `public/`, deliverables, or a render. Tracing proportions
from a photo is normal reference practice; copying its pixels is not.
Model generic, unbranded hardware: the course teaches concepts, not SKUs.

## 2. Modeling for explainers

- **Detail follows the narration.** Model at full detail only what the
  narration names or the viewer must find (the port, the drive bay, the
  latch). Everything else stays simple: a block with correct proportions
  and a few defining features. Extra detail competes for attention
  (coherence principle, `.claude/references/video-design.md`).
- **Stay non-destructive.** Build the chassis from a few primitives. Use
  Bevel (Limit Method *Angle*, 1-3 segments, *Harden Normals*), Array for
  repeated ports, vents, and drive bays, and Mirror for symmetric bezels.
  Leave modifiers live until delivery. [31][32]
- **Hard-surface.** Bevel every visible edge; a perfectly sharp edge
  aliases and reads as CG. Weighted Normal on large flat panels. Model
  ports as separate inset objects (or a Boolean applied late).
- **Smooth shading.** Since 4.1, auto smooth is a *Smooth by Angle*
  modifier, not a mesh setting. Add it (about 30°) to every beveled
  object. [33]
- **Naming and collections** (Blender Studio convention [34]): prefixes
  `GEO-`, `LGT-`, `CAM-`, `HLP-` (empties, not rendered), `TMP-`; words in
  `lower_underscore_case`, `-` between parts: `GEO-server_1u-bezel`,
  `GEO-server_1u-port.003`. Collections: `REF` (not rendered), `GEO`,
  `LGT`, `CAM`, one sub-collection per part that animates separately.
  Materials: `MAT-body`, `MAT-accent_blue`.
- **Keep it light.** A 1U server needs thousands of faces, not millions.
  Instance repeated parts (Array, linked duplicates).

## 3. A look that fits flat 2D motion graphics

**Target look:** matte, flat-shaded forms in a limited palette, with a crisp
light edge, sitting on the dark textured backdrop like the 2D panels.

**Shading, in order of preference:**

1. **Toon ramp (EEVEE only):** Diffuse BSDF → *Shader to RGB* → Color Ramp
   set to *Constant* with 2-3 stops, each an exact hex → Emission at
   Strength 1. Lighting sets which stop each area gets, and the pixels
   are palette colors. Shader to RGB does not work in Cycles and misbehaves
   in render passes. [35]
2. **Pure emission (flat):** one Emission color per part, no lighting, with
   form carried by outlines. The most exact output, and the most
   diagram-like.
3. **Matte Principled** (Roughness 0.6-0.8, Specular low, no metallic
   gloss) only when a shot needs real shading. Its pixels won't be palette
   hex, so the palette appears only on emission accents.

**Palette** (the WWT design system since 2026-09-25; linear values for
Python; sRGB hex in the UI):

| Role | Hex | Linear Rec.709 |
|---|---|---|
| Focus / accent A, WWT blue-50 | #66B6F2 | 0.1329, 0.4678, 0.8879 |
| Accent B, WWT orange-50 | #FDA38B | 0.9823, 0.3663, 0.2582 |
| Key / warning, WWT gold | #FFC601 | 1.0000, 0.5647, 0.0003 |
| Problem, WWT red-50 | #F57E7F | 0.9131, 0.2086, 0.2122 |
| Success, WWT positive (thick only) | #1E9E62 | 0.0130, 0.3419, 0.1221 |
| Line / marker, WWT gray-50 | #F6F7F8 | 0.9216, 0.9301, 0.9387 |
| Minimum edge tone vs navy | #8E8FA4 | 0.2705, 0.2747, 0.3712 |

Bodies are neutral grays, and a saturated color marks what the narration is
about right now (`video-design.md`: grey is the default, color is for
focus). Real hardware is black, but a near-black chassis disappears on the navy
ground. Lighten the body, or guarantee a #8E8FA4-or-lighter rim or outline
around it; a card behind the asset (navy-ink, 2 px border at white 30-40%)
also works. [14][15] Every color keeps one meaning for the
whole series, and color never carries meaning alone (pair it with a
position, shape, or label). [14]

**Outlines:**

- **Freestyle** (View Layer > Freestyle): edge types Silhouette, Crease,
  Border, and Contour. Thickness is in pixels; use 2-3 px. *As Render Pass*
  writes the lines to a separate pass. It runs on the CPU after the render:
  measured 0.88 s per frame against 0.27 s without it. Enable *View Map
  Cache* when only the camera is static. [36][37][T]
- **Line Art** (Grease Pencil modifier): lines from a scene, collection, or
  object, visible in the viewport, can be baked per frame, and output to
  its own *Grease Pencil* pass. Each Line Art modifier recomputes
  occlusion, so use one per shot. [38][39]
- **Inverted hull:** Solidify with *Flip Normals* and a Material Index
  Offset to a backface-culled emission material. It's the cheapest and
  works in any engine, but line width scales with distance and it misses
  interior creases. Use it for simple silhouettes only. [40]

The EEVEE NPR project (custom shading nodes, per-material filters) is in
development in 2026. Check the release notes before building a new look.
[41][42]

**Lighting for readability on dark:**

- Key light 30-45° above and to one side, fill on the other side about a
  third as strong, and a **rim light** behind and above that draws the
  light edge separating the object from the background. [43]
- World: dark neutral gray, low strength. Under Film Transparent it still
  lights the scene but isn't rendered.
- No ground shadow unless the 2D layer draws a floor.

## 4. Color management, the key gotcha

**What changes the hex.** A view transform maps scene-linear values to the
display. Standard "does no extra conversion besides the conversion for the
display" and is the one for non-photorealistic work. AgX (default since
4.0) and Filmic (deprecated) tone-map and desaturate bright colors, and
Khronos PBR Neutral also shifts them. [1][44] Tested on emission #00C2FF:
Standard gave (0,194,255), AgX (106,173,201), and Khronos PBR Neutral
(35,184,240). [T]

**Getting exact hex into sRGB PNGs:** Rules 1-5, plus Output > Color
Management left on *Follow Scene*. [45] Verify by rendering one frame and
reading pixel values in the Image Editor or with Python; the eyedropper is
reliable only under Standard. [46] Only interior pixels are exact;
anti-aliased edges blend with alpha by design.

**Emission vs Principled.** Emission ignores lights, so its pixel equals its
color. Principled output is base color × lighting and hits the palette only
by accident: use it for neutral body shading only. [6]

**Alpha.** Blender renders and composites in premultiplied alpha, and writes
PNG as straight (unassociated) alpha, per the PNG spec. [8][9][47] Tested: a
50% transparent #00C2FF region stored RGB (0,194,255) with alpha below 255,
so the color was not darkened, which is straight alpha. [T] Downstream, load
the PNGs as straight alpha. Browsers and Remotion's `<Img>` do this by
default. Never premultiply a second time (the Manim pipeline's dark-fringe
bug, `manim-style.md`). Emissive effects with no coverage (glows, bloom)
cannot be stored in straight alpha. Skip them, or draw them in 2D.

## 5. Animation practice for explainers

- **Easing.** Default Bézier for every key. Entrances decelerate in and
  exits accelerate out. Scale duration to distance: small nudges 0.3-0.5 s
  (9-15 frames), large moves 0.8-1.5 s (24-45 frames). Use the Back easing
  (overshoot) at most once, on the insight moment. Linear only for a
  constant turntable spin. [16][17]
- **Calm camera.** Locked off by default. Allowed: a slow push-in to a part
  the narration names, a partial orbit (about 30° over 2 s or more) to
  reveal a hidden face, a turntable at 10-15 s per revolution when the
  whole object is the subject. These numbers are house starting values,
  not a standard. WCAG 2.3.3 covers interaction-triggered motion (AAA), but
  its vestibular concern applies to video too: no full-frame spins, fast
  parallax, or zoom bursts. [18][17]
- **Exploded views and assembly.** Move each part out along the direction
  it is actually removed (a drive slides out of its bay, a DIMM lifts off
  its slot), in reverse assembly order, one part or group at a time, far
  enough that nothing overlaps. Keep parent-child hierarchy so sub-parts
  travel with their parent. [48] Hold the exploded state still while the
  narration explains it, then reassemble by the same paths.
- **Timing to beats.** Scene fps 30, `fps_base` 1.0 (not 29.97). For a
  window from beat `a` to beat `b`: `frame_start = 0`,
  `frame_end = round((b - a) × 30) - 1`, and record the absolute offset
  `round(a × 30)` for the Remotion `<Sequence from>`. Place every keyframe
  on an integer frame from `round((t - a) × 30)`. Motion settles at least
  30 frames before the window ends if text will be read over it.
- **One camera per series.** A shared `CAM-main` in a template `.blend`:
  50-85 mm on a 36 mm sensor (longer lenses flatten perspective, as in
  product photography), or orthographic for a technical-illustration look
  (true isometric: rotation X 54.736°, Z 45°). Append it into every shot;
  never change the lens within a video.

## 6. Rendering

**Engine.** EEVEE is a rasterizer and suits this style: deterministic,
fast, and the only engine with Shader to RGB. Measured at 1080p with 32
samples: 0.27-0.48 s per frame, 0.88 s with Freestyle. Cycles with 64
samples and OpenImageDenoise on the M4 Pro GPU: about 4.5 s per frame after
a one-time Metal kernel compile of about 75 s. [T] Budget: a 10 s shot (300
frames) should render in under 5 minutes. If it doesn't, simplify the
scene before raising the limit.

**Samples and denoising.** EEVEE Render Samples 32 is enough for antialiasing
flat materials, and 64 when soft shadows band. [49] In Cycles, turn on the
Noise Threshold (adaptive sampling) and denoise. Per-frame denoising of a
noisy animation shimmers, so raise samples until the undenoised frame is
nearly clean. Flat emission scenes need very few. [50] Film Filter Size
stays at 1.5 px (default); lower is crisper but aliases thin lines. [8]

**Output settings** (Python names):

```python
r = scene.render
r.engine = 'BLENDER_EEVEE'
r.resolution_x, r.resolution_y, r.resolution_percentage = 1920, 1080, 100
r.fps, r.fps_base = 30, 1.0
r.film_transparent = True
r.dither_intensity = 0.0
r.use_motion_blur = False
r.image_settings.file_format = 'PNG'
r.image_settings.color_mode = 'RGBA'
r.image_settings.color_depth = '8'
r.image_settings.compression = 15
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'
scene.view_settings.exposure, scene.view_settings.gamma = 0.0, 1.0
r.filepath = '//../../public/blender/<media-id>/<shot>/####'
```

`#` sets zero padding: `####` writes `0000.png` from frame 0, the names ManimLayer reads.
[20] (Proposed layout: sources in `blender/<media-id>/<shot>.blend`,
frames in `public/blender/<media-id>/<shot>/`, alongside
`public/manim/<id>/`.)

**Layers and passes.** Enable only the passes you need
(View Layer > Passes). Freestyle *As Render Pass*, or Line Art's Grease
Pencil pass, separates lines from fills. Write extra passes as PNG
sequences with a compositor File Output node, since `-a` saves only the
composite. [37][39] For 2D elements that must sit between 3D parts, render
the front part as its own view layer, or mark the occluder *Holdout*. Pass
names changed in 5.0 (`Z` to `Depth`, `IndexMA` to `Material Index`), so
update scripts written for 4.x. [51]

**Command line:**

```bash
B=/Applications/Blender.app/Contents/MacOS/Blender
$B -b blender/<id>/<shot>.blend -o //../../public/blender/<id>/<shot>/#### -F PNG -a
$B -b <file>.blend -o <path>/#### -F PNG -s 0 -e 89 -a     # a frame range
$B -b <file>.blend -o <path>/#### -f 45                     # one still for review
```

`-o`, `-F`, `-s`, and `-e` must come before `-a` or `-f`, because
arguments run in order. [20][52] Render stills at each beat first for
review, then the full range.

## 7. Pitfalls

- **Scale.** Unapplied scale gives uneven bevels and wrong Solidify and
  Array offsets; wrong units (mm typed as m) break clip distances and
  light falloff. Check N-panel Dimensions against the reference sheet.
  [12][13]
- **Normals.** Flipped faces render dark or vanish with backface culling.
  Run Mesh > Normals > Recalculate Outside and check the Face Orientation
  overlay. Shading streaks on large flat faces come from smooth shading
  without bevels, fixed by Smooth by Angle plus Weighted Normal. Booleans
  leave n-gons that shade badly: apply them and clean up the mesh.
- **Color shift.** AgX default, dither 1.0, a non-default working space,
  Output set to *Override*, or a Look left on. Check all five before any
  render. [T][1][2][3]
- **Flicker.** Cycles noise with an animated seed and per-frame denoising,
  or EEVEE soft shadows at low samples. Raise samples or use emission.
  Freestyle lines can pop on and off at crease-angle thresholds as the
  camera moves. Mark edges explicitly (Edge Mark) instead of relying on
  Crease Angle. [36]
- **Motion blur on transparent layers.** Blur smears color into
  semi-transparent pixels the unblurred 2D layers don't match, and EEVEE's
  post-process blur can bleed background into foreground. [11]
- **Thin lines and aliasing.** Lines under 2 px, vent grilles, and pin
  rows shimmer in motion. Thicken, simplify, or cut them. [14]
- **Alpha mismatch.** Edge fringes mean a consumer premultiplied the
  straight PNG again. [9][47]
- **Frame-rate drift.** 24 or 29.97 fps puts every key off its beat.
- **Argument order.** `-a` before `-o` renders to the path saved in the
  file. [52]

## Hand-off checklist

For each shot, `blender-builder` delivers:

- [ ] Frames: `public/blender/<media-id>/<shot>/<shot>_0000.png` ...
      contiguous, count = window length in frames, frame 0 = window start.
- [ ] A shot note (`blender/<media-id>/<shot>.md`) giving the beat window
      (`a`, `b` in seconds), the absolute start frame `round(a × 30)`, and
      the frame count.
- [ ] 1920x1080, 30 fps, PNG RGBA 8-bit, **straight alpha**, Film
      Transparent.
- [ ] Color: working space Linear Rec.709, View Standard, Look None,
      Exposure 0, Gamma 1, Dither 0, Output *Follow Scene*. Palette pixels
      verified on one frame (sampled values listed in the note).
- [ ] Engine, samples, and measured seconds per frame.
- [ ] Separate passes (lines, holdout layers), if any, each as its own
      sequence with the same naming.
- [ ] Camera: name, focal length or ortho scale, unchanged across shots
      of the video.
- [ ] Stills at each beat for `stills-reviewer`, and a check that
      meaningful edges reach 3:1 (#737373 or lighter) against gray 42.
- [ ] `refs/refsheet.md`: every dimension with value, source URL or
      document and page, date accessed, and confidence. Estimated values
      flagged.
- [ ] The `.blend` source with named collections and live modifiers.
      No reference images packed into it, and no vendor photos, CAD, or
      logos in the frames.

## References

- [T] Tests run in this session, 2026-09-24: Blender 5.2.0 LTS,
  `--factory-startup`, Apple M4 Pro. Emission #00C2FF under each view
  transform with dither 0 and 1; PNG alpha readback; 1080p EEVEE, Freestyle,
  and Cycles timings on a beveled 1U chassis with a 24-port array.
1. Blender Manual 5.2, Displays and Views. https://docs.blender.org/manual/en/latest/render/color_management/displays_views.html
2. Blender Manual, Post Processing (Dither). https://docs.blender.org/manual/en/latest/render/output/properties/post_processing.html ; API `RenderSettings.dither_intensity` (default 1.0). https://docs.blender.org/api/current/bpy.types.RenderSettings.html
3. Blender 5.0 Release Notes, Color Management. https://developer.blender.org/docs/release_notes/5.0/color_management/
4. Blender Manual, Color Picker (hex is gamma-corrected sRGB). https://docs.blender.org/manual/en/latest/interface/controls/templates/color_picker.html
5. Blender Python API, mathutils `Color.from_srgb_to_scene_linear`. https://docs.blender.org/api/current/mathutils.html
6. Blender Manual, Emission shader (Strength 1.0 gives the exact input color). https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/emission.html
7. Blender 5.0 Release Notes, Python API (`BLENDER_EEVEE_NEXT` to `BLENDER_EEVEE`). https://developer.blender.org/docs/release_notes/5.0/python_api/
8. Blender Manual, EEVEE Film (Filter Size, Transparent). https://docs.blender.org/manual/en/latest/render/eevee/render_settings/film.html
9. Blender Manual, Image Settings (Straight vs Premultiplied; PNG straight). https://docs.blender.org/manual/en/latest/editors/image/image_settings.html
10. Blender Manual, Supported Graphics Formats. https://docs.blender.org/manual/en/latest/files/media/image_formats.html
11. Blender Manual, EEVEE Motion Blur. https://docs.blender.org/manual/en/latest/render/eevee/render_settings/motion_blur.html ; Blender 5.2 EEVEE release notes. https://developer.blender.org/docs/release_notes/5.2/eevee/
12. BlendKit, Why applying scale (and rotation) matters. https://www.blendkit.com/docs/tutorials/most-common-upload-problems/why-applying-scale-matters/
13. CG Cookie community, Why are bevels so huge. https://cgcookie.com/community/13306-why-are-bevels-so-huge
14. Course brief, `.claude/references/video-design/03-accessible-color.md` (paper rgb 38-42, 2 px strokes, color never alone) and `.claude/references/video-design.md`.
15. W3C, Understanding SC 1.4.11 Non-text Contrast. https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ; SC 1.4.3. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
16. Blender Manual, F-Curve Properties (Interpolation, Easing, Back). https://docs.blender.org/manual/en/latest/editors/graph_editor/fcurves/properties.html
17. Course brief, `.claude/references/video-design/02-motion-craft.md`.
18. W3C, Understanding SC 2.3.3 Animation from Interactions. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
19. W3C, Understanding SC 2.3.1 Three Flashes or Below Threshold. https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
20. Blender Manual, Command Line Arguments. https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html
21. RackSolutions, EIA-310: What Does It Mean? https://www.racksolutions.com/news/data-center-optimization/eia-310-definition/
22. A&J Manufacturing, Standard EIA Openings on 19" Racks. https://aj-racks.com/standard-eia/
23. Wikipedia, Modular connector. https://en.wikipedia.org/wiki/Modular_connector
24. US Patent 4,874,330 (8-position plug width about 0.460 in under FCC Part 68). https://patents.google.com/patent/US4874330
25. Dell PowerEdge R660 Technical Guide. https://www.delltechnologies.com/asset/en-us/products/servers/technical-support/poweredge-r660-technical-guide.pdf
26. TraceParts, Network switches 3D models. https://www.traceparts.com/en/search/rs-group-ppe-safety-test-it-computing-peripherals-networking-wifi-network-switches?CatalogPath=RS_COMPONENTS:PSF_437633
27. GrabCAD Library, Cisco tag. https://grabcad.com/library/tag/cisco
28. Cisco Community, 3D CAD model (.stp) for WS-C3650. https://community.cisco.com/t5/switching/3d-cad-model-stp-for-ws-c3650-24td-s/td-p/4097867
29. Blender Extensions, STEP Importer. https://extensions.blender.org/add-ons/step-importer/
30. Blender Manual, Empties (Image: Opacity, Depth, Side, Only Axis Aligned). https://docs.blender.org/manual/en/latest/modeling/empties.html
31. Blender Manual, Bevel Modifier. https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/bevel.html
32. Blender Manual, Bevel tool options (Harden Normals, Clamp Overlap). https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/bevel.html
33. Blender 4.1 Release Notes, Modeling (Auto Smooth replaced by Smooth by Angle). https://developer.blender.org/docs/release_notes/4.1/modeling/
34. Blender Studio, Naming Conventions: Datablock names. https://studio.blender.org/tools/naming-conventions/datablock-names
35. Blender Manual, Shader To RGB Node (EEVEE only). https://docs.blender.org/manual/en/latest/render/shader_nodes/color/shader_to_rgb.html
36. Blender Manual, Freestyle Line Set (edge types). https://docs.blender.org/manual/en/latest/render/freestyle/view_layer/line_set.html
37. Blender Manual, Freestyle view layer (As Render Pass, View Map Cache). https://docs.blender.org/manual/en/latest/render/freestyle/view_layer/freestyle.html
38. Blender Manual, Line Art Modifier. https://docs.blender.org/manual/en/latest/grease_pencil/modifiers/generate/line_art.html
39. Blender Manual, Render Passes (Grease Pencil pass, Freestyle). https://docs.blender.org/manual/en/latest/render/layers/passes.html
40. BNPR Wiki, Inverse Hull Method. https://bnpr.gitbook.io/bnpr/outline/inverse-hull-method
41. Blender Developers Blog, NPR Project (May 2025). https://code.blender.org/2025/05/npr-project/
42. Blender, Projects to look forward to in 2026. https://www.blender.org/development/projects-to-look-forward-to-in-2026/ ; Blender 5.1 EEVEE release notes (Shader Raycast node). https://developer.blender.org/docs/release_notes/5.1/eevee/
43. Brandon3D, Three Point Lighting in Blender. https://brandon3d.com/three-point-lighting-in-blender-3d/
44. Blender 4.0 Release Notes, Color Management (AgX default). https://developer.blender.org/docs/release_notes/4.0/color_management/ ; CG Cookie, The secret to rendering vibrant colors with AgX. https://blog.cgcookie.com/posts/the-secret-to-rendering-vibrant-colors-with-agx-in-blender-is-the-raw-workflow/
45. Blender Manual, Output properties (Color Management: Follow Scene / Override). https://docs.blender.org/manual/en/latest/render/output/properties/output.html
46. Blender Manual, Eyedropper (use Standard for accurate sampling). https://docs.blender.org/manual/en/latest/interface/controls/buttons/eyedropper.html
47. W3C, PNG Specification (Third Edition), alpha representation. https://www.w3.org/TR/png-3/ ; Blender Manual, Alpha Convert node (premultiplied internally). https://docs.blender.org/manual/en/latest/compositing/types/color/alpha_convert.html
48. Li, Agrawala, Curless, Salesin, "Automated Generation of Interactive 3D Exploded View Diagrams," SIGGRAPH 2008. https://grail.cs.washington.edu/projects/exview3D
49. Blender Manual, EEVEE Sampling. https://docs.blender.org/manual/en/latest/render/eevee/render_settings/sampling.html
50. Blender Manual, Cycles Sampling (adaptive sampling, noise threshold). https://docs.blender.org/manual/en/latest/render/cycles/render_settings/sampling.html
51. Blender 5.0 Release Notes (render pass renames). https://developer.blender.org/docs/release_notes/5.0/python_api/
52. Blender Manual, Rendering from the Command Line. https://docs.blender.org/manual/en/latest/advanced/command_line/render.html
- Further practice: Blender Studio, Blender Motion Graphics course (camera, lighting, creative color management). https://studio.blender.org/training/motion-graphics/
