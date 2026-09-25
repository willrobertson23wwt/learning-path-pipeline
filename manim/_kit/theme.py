"""Course palette and fonts for Manim scenes, mirrored from src/components/theme.ts.

Keep these in step with theme.ts: the Manim layers sit beside Remotion panels
in the same frame, so a drifted hex reads as a different course.
"""
from functools import lru_cache

from manim import ManimColor, config

# WWT design system (mirrors src/components/theme.ts and sketch/palette.ts;
# user decision 2026-09-25). Manim now makes exact plots and diagrams shown
# as cards on the hand-drawn navy sheet, so these are the lettering roles.
ACCENT = ManimColor("#66B6F2")   # WWT blue-50: network, the current focus (7.2:1 on navy)
SUCCESS = ManimColor("#1E9E62")  # WWT status-positive: thick strokes and checks only (4.6:1)
WARNING = ManimColor("#FFC601")  # WWT gold: the key setting, the prefix (10.0:1)
DANGER = ManimColor("#F57E7F")   # WWT red-50: always with a cross or the word (6.1:1)
HOST = ManimColor("#FDA38B")     # WWT orange-50: the other side of a comparison, "host" (8.1:1)
NOTE = ManimColor("#C7C7D1")     # WWT navy-25: secondary labels (9.4:1)
LINE = ManimColor("#F6F7F8")     # WWT gray-50: text and lines; use with LINE_OPACITY
LINE_OPACITY = 1.0
PANEL_BG = ManimColor("#11122E")  # WWT navy-ink card -> fill_opacity=PANEL_OPACITY
PANEL_OPACITY = 0.92
MUTED_OPACITY = 0.60  # WCAG floor for text is 50% white (03-accessible-color.md); 0.45 failed
# Tinted cell pair the Remotion builds use (hex alpha 22 / 88).
TINT_FILL = 0x22 / 255    # 0.133
TINT_STROKE = 0x88 / 255  # 0.533

# 1920x1080 frame is 14.222 x 8 Manim units: 1 unit = 135 px.
PX = 1 / 135


def px(n: float) -> float:
    """Pixels on the final 1080p frame to Manim units (positions, sizes)."""
    return n * PX


# Manim's font_size and stroke_width are not CSS px. These factors turn a
# Remotion size into Manim's, calibrated against Remotion stills. Glyph
# spacing still differs from Chrome: see manim/_kit/typeset.py css_text().
FONT_PX_PER_SIZE = 1.88   # CSS px per Manim font_size unit (calibrated 2026-09-24, Menlo + Helvetica Neue Bold)
STROKE_PX_PER_WIDTH = 1.35  # px per stroke_width unit at 1080p (calibrated 2026-09-24)


def px_font(css_px: float) -> float:
    """Designer's pixel size to Manim font_size for Pango Text / Code (Menlo)."""
    return css_px / FONT_PX_PER_SIZE


TEX_PX_PER_SIZE = 1.40  # CSS px per Tex/MathTex font_size unit (Computer Modern, calibrated 2026-09-24)


def px_tex(css_px: float) -> float:
    """Designer's pixel size to Manim font_size for Tex / MathTex (LaTeX)."""
    return css_px / TEX_PX_PER_SIZE


def px_stroke(css_px: float) -> float:
    """Remotion border/stroke width (px) to Manim stroke_width."""
    return css_px / STROKE_PX_PER_WIDTH


@lru_cache(maxsize=None)
def _available() -> frozenset:
    import manimpango

    return frozenset(manimpango.list_fonts())


def _first(*names: str) -> str:
    fonts = _available()
    for name in names:
        if name in fonts:
            return name
    return names[-1]


def text_font() -> str:
    # SF Pro is a hidden system face (.SF NS) Pango can't select by name.
    return _first("SF Pro Display", "Helvetica Neue", "Helvetica", "Arial")


def mono_font() -> str:
    # SF Mono isn't installed as a font on macOS; Remotion's MONO_STACK falls
    # through to Menlo too, so both engines match.
    return _first("SF Mono", "Menlo", "Monaco", "Courier New")


def use_course_frame(fps: int = 30) -> None:
    """Match the Remotion composition: 1920x1080, 30 fps, transparent."""
    config.pixel_width = 1920
    config.pixel_height = 1080
    config.frame_rate = fps
    config.transparent = True
    config.background_opacity = 0
