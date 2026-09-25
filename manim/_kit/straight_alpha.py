"""Straight-alpha frames for transparent Manim renders.

Cairo draws into a premultiplied ARGB32 surface and Manim hands that pixel
array straight to the PNG writer, so every translucent pixel is stored as
color * alpha and then composited with alpha again downstream (PNG, VP9 and
Remotion all read straight alpha). A 0.32 cyan fill was saved as
(0, 62, 81, a=81) instead of (0, 194, 255, a=81): tints behave as alpha^2,
0.92 text as 0.85, 60% dots as 36%, and antialiased edges darken.

StraightAlphaRenderer un-premultiplies each frame as it goes to the writer.
BeatScene uses it by default, so every course scene gets straight alpha.
Apply it in exactly one place: never also add an ffmpeg `unpremultiply` in
manim-render.sh, which would double-brighten. Found in the li-v6-ch1 pilot.
"""
import numpy as np
from manim.renderer.cairo_renderer import CairoRenderer


def unpremultiply(frame: np.ndarray) -> np.ndarray:
    f = frame.astype(np.float32)
    a = f[..., 3:4]
    rgb = np.where(a > 0, f[..., :3] * 255.0 / np.maximum(a, 1), 0)
    out = np.empty_like(frame)
    out[..., :3] = np.clip(np.rint(rgb), 0, 255).astype(frame.dtype)
    out[..., 3] = frame[..., 3]
    return out


class StraightAlphaRenderer(CairoRenderer):
    # Hook add_frame, not get_frame: Manim caches its static background with
    # get_frame() and draws on top of it, so converting there converts twice.
    def add_frame(self, frame, num_frames: int = 1):
        super().add_frame(unpremultiply(frame), num_frames)


class StraightAlphaMixin:
    """Put first in the bases: class Strip(StraightAlphaMixin, BeatScene)."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("renderer", StraightAlphaRenderer())
        super().__init__(*args, **kwargs)
