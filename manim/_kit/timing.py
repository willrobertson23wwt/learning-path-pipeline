"""Beat timing for Manim segments, read from the shared beats.json.

Remotion and Manim both time themselves from public/chapters/<id>/beats.json
(built by scripts/beats.mjs), so a retimed narration retimes both engines.
A segment covers one window [start, end] of narration time and renders for
exactly end - start seconds; the Remotion ManimLayer places it at `start`.

    class Strip(BeatScene):
        media_id = "li-v6-ch1"
        window = ("aIn", "aOut")

        def construct(self):
            self.wait_until("resolve")
            self.play(Write(cells), run_time=1.2)
            ...
            self.finish()
"""
import json
from pathlib import Path

from manim import Scene, config

from .straight_alpha import StraightAlphaRenderer

ROOT = Path(__file__).resolve().parents[2]  # course repo root


def load_beats(media_id: str) -> dict:
    path = ROOT / "public" / "chapters" / media_id / "beats.json"
    return json.loads(path.read_text())["beats"]


class BeatScene(Scene):
    media_id: str = ""
    window: tuple = ("", "")  # (start beat, end beat) names in beats.json

    def __init__(self, *args, **kwargs):
        # Straight (non-premultiplied) alpha: see straight_alpha.py.
        kwargs.setdefault("renderer", StraightAlphaRenderer())
        super().__init__(*args, **kwargs)

    def setup(self):
        self.beats = load_beats(self.media_id)
        self.t_start = self.beats[self.window[0]]
        self.t_end = self.beats[self.window[1]]
        self.fps = config.frame_rate

    def at(self, beat: str) -> float:
        """Segment-relative seconds of a beat."""
        return self.beats[beat] - self.t_start

    def frame_of(self, beat) -> int:
        """Segment-relative frame of a beat (name or absolute narration seconds).

        round(beat*fps) - round(start*fps): the same rounding ManimLayer uses,
        so a beat lands on the same frame in both engines.
        """
        t = self.beats[beat] if isinstance(beat, str) else beat
        return round(t * self.fps) - round(self.t_start * self.fps)

    def now_frame(self) -> int:
        return round(self.renderer.time * self.fps)

    def _hold(self, frames: int):
        # (frames - 0.5)/fps: Manim steps through np.arange(0, run_time, dt),
        # so an exact frames/fps can gain a frame from float error.
        # frozen_frame=False keeps static waits from rounding a frame down.
        self.wait((frames - 0.5) / self.fps, frozen_frame=False)

    def wait_until(self, beat):
        """Hold until a beat (name, or absolute narration seconds).

        Raises if the scene has already passed it: an animation overran its
        next beat, so shorten its run_time rather than letting sync drift.
        """
        gap = self.frame_of(beat) - self.now_frame()
        if gap < 0:
            raise RuntimeError(f"{self.__class__.__name__}: past beat {beat!r} by {-gap} frames")
        if gap > 0:
            self._hold(gap)

    def run_until(self, beat, *animations, **kwargs):
        """Play animations so they end exactly on a beat."""
        frames = self.frame_of(beat) - self.now_frame()
        if frames <= 0:
            raise RuntimeError(f"{self.__class__.__name__}: no time left before {beat!r}")
        self.play(*animations, run_time=(frames - 0.5) / self.fps, **kwargs)

    def finish(self):
        """Hold to the window's end and check the segment's exact length."""
        self.wait_until(self.window[1])
        want = self.frame_of(self.window[1])
        got = self.now_frame()
        if got != want:
            raise RuntimeError(f"{self.__class__.__name__}: {got} frames, window is {want}")
