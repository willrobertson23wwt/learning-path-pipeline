"""CSS-exact text for Manim: glyph shapes from Pango, glyph positions from the font.

Calibration (li-v6-ch1 build, 2026-09-24):
- Glyph size: Manim font_size 1 = 1.88 CSS px (ink height of Menlo Bold digits
  and Helvetica Neue Bold caps, checked against a Remotion still of LiV6Ch1:
  46 px Menlo digits are 36 px tall there, 30 px ones 24 px).
- Glyph spacing: Pango's advances in Manim's Text come out 3-6% off Chrome's,
  and the error changes with font_size (Menlo "192.168.10.42" is 9.4x its height
  at font_size 32, 10.5x at 40). So a Text is only used for its glyph outlines;
  each glyph is re-placed at the advance Pillow reads from the same font file,
  which is what Chrome lays out (em = CSS px).

css_text() returns a VGroup of glyphs (spaces dropped) with `.advance` (layout
width in px) and `.glyph_chars` (the characters, one per submobject).
Candidate for promotion to manim/_kit/.
"""
import sys
from functools import lru_cache
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # manim/, so _kit resolves
from PIL import Image, ImageDraw, ImageFont  # noqa: E402
from manim import BOLD, NORMAL, Text, VGroup, config  # noqa: E402
import numpy as np  # noqa: E402

from _kit.theme import LINE, LINE_OPACITY, px, px_font, px_stroke  # noqa: E402

FONT_FILES = {
    ("Menlo", BOLD): ("/System/Library/Fonts/Menlo.ttc", 1),
    ("Menlo", NORMAL): ("/System/Library/Fonts/Menlo.ttc", 0),
    ("Helvetica Neue", BOLD): ("/System/Library/Fonts/HelveticaNeue.ttc", 1),
    ("Helvetica Neue", NORMAL): ("/System/Library/Fonts/HelveticaNeue.ttc", 0),
}
REF = 1000  # reference em in px for metric lookups


def font_size(css_px: float) -> float:
    return px_font(css_px)  # theme.FONT_PX_PER_SIZE = 1.88 (calibrated here)


def stroke(css_px: float) -> float:
    return px_stroke(css_px)


def at(x: float, y: float) -> np.ndarray:
    """1080p pixel coordinates (origin top-left, y down) to a Manim point."""
    return np.array([px(x) - config.frame_width / 2, config.frame_height / 2 - px(y), 0.0])


def to_px(point) -> tuple:
    return (
        (point[0] + config.frame_width / 2) / px(1),
        (config.frame_height / 2 - point[1]) / px(1),
    )


@lru_cache(maxsize=None)
def _font(family: str, weight: str):
    path, index = FONT_FILES[(family, weight)]
    return ImageFont.truetype(path, REF, index=index)


@lru_cache(maxsize=None)
def glyph_ink(family: str, weight: str, ch: str) -> tuple:
    """Ink box of one glyph relative to its origin on the baseline, in em units
    (left, top, right, bottom; y down, so top is negative)."""
    f = _font(family, weight)
    ox, oy = REF, 2 * REF
    img = Image.new("L", (4 * REF, 3 * REF), 0)
    ImageDraw.Draw(img).text((ox, oy), ch, font=f, fill=255, anchor="ls")
    l, t, r, b = img.getbbox()
    return ((l - ox) / REF, (t - oy) / REF, (r - ox) / REF, (b - oy) / REF)


def advance(s: str, family: str, weight: str = BOLD) -> float:
    """Layout width of s in em units."""
    return _font(family, weight).getlength(s) / REF


def css_text(
    s: str,
    css_px: float,
    family: str,
    weight: str = BOLD,
    x: float = 0.0,
    baseline: float = 0.0,
    anchor: str = "left",
    color=LINE,
    opacity: float = LINE_OPACITY,
) -> VGroup:
    """Text laid out like Chrome: layout box starts at x (anchor left) or is
    centered on x (anchor center); glyphs sit on the baseline y (px)."""
    t = Text(s, font=family, weight=weight, font_size=font_size(css_px), color=color)
    chars = [c for c in s if not c.isspace()]
    glyphs = list(t.submobjects)
    if len(glyphs) != len(chars):
        raise RuntimeError(f"css_text: {len(glyphs)} glyphs for {len(chars)} chars in {s!r}")
    width = advance(s, family, weight) * css_px
    left = x - width / 2 if anchor == "center" else x
    for g, (i, c) in zip(glyphs, [(i, c) for i, c in enumerate(s) if not c.isspace()]):
        l, _, r, b = glyph_ink(family, weight, c)
        origin = left + advance(s[:i], family, weight) * css_px
        # Horizontal: ink center; vertical: ink bottom relative to the baseline.
        g.move_to(at(origin + (l + r) / 2 * css_px, baseline + b * css_px))
        g.shift(np.array([0, g.height / 2, 0]))
    group = VGroup(*glyphs)
    group.set_fill(color, opacity=opacity)
    group.set_stroke(width=0)
    group.advance = width
    group.glyph_chars = chars
    return group
