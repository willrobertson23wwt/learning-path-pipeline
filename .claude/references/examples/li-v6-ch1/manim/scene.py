"""li-v6-ch1 "Addresses and Prefixes": every visible element, one BeatScene.

    scripts/manim-render.sh manim/li-v6-ch1/scene.py Chapter public/manim/li-v6-ch1/chapter.webm [--frames]

Shot list: out/li-v6-ch1-fresh/design.md (round-1 revisions and the design
log win over earlier text). Beats: public/chapters/li-v6-ch1/beats.json
(composition time, holds included). Tunables: layout.json beside this file.
Remotion draws the paper and the fluid loop; nothing here is a background.
"""
import json
import math
import sys

import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from manim import (  # noqa: E402
    DOWN,
    LEFT,
    RIGHT,
    UP,
    AnimationGroup,
    Circle,
    Create,
    CubicBezier,
    FadeIn,
    FadeOut,
    Group,
    GrowFromEdge,
    LaggedStart,
    Line,
    Rectangle,
    RoundedRectangle,
    Succession,
    Tex,
    Transform,
    UpdateFromAlphaFunc,
    Union,
    ValueTracker,
    VGroup,
    VMobject,
    Wait,
    Write,
    interpolate_color,
    rate_functions,
)

from manim.utils.paths import path_along_arc  # noqa: E402

from _kit.theme import (  # noqa: E402
    ACCENT,
    DANGER,
    LINE,
    LINE_OPACITY,
    MUTED_OPACITY,
    SUCCESS,
    WARNING,
    px,
    px_stroke,
    px_tex,
    use_course_frame,
)
from _kit.timing import BeatScene  # noqa: E402

use_course_frame()

L = json.loads((Path(__file__).resolve().parent / "layout.json").read_text())

EASE = rate_functions.ease_out_cubic
SMOOTH = rate_functions.smooth

OCTETS = ["192", "168", "10", "42"]
BITS = "11000000" "10101000" "00001010" "00101010"


# ---- helpers (1080p px in, Manim units out) ---------------------------------
def at(x, y):
    return [px(x - 960), px(540 - y), 0]


def ink(m):
    """(left, top, right, bottom) of a mobject's ink in frame px."""
    return ((m.get_left()[0]) / px(1) + 960, 540 - m.get_top()[1] / px(1),
            m.get_right()[0] / px(1) + 960, 540 - m.get_bottom()[1] / px(1))


def tex(*parts, size, color=LINE, opacity=LINE_OPACITY):
    t = Tex(*parts, arg_separator="", font_size=px_tex(size))
    # stroke color matches the fill so Write's draw-on outline isn't white on colored words
    t.set_fill(color, opacity=opacity).set_stroke(color, width=0, opacity=opacity)
    return t


def place(m, x=None, y=None, anchor="center", ref=None):
    """Move m so ref's ink (default m) is centered on y and anchored on x."""
    ref = m if ref is None else ref
    l, t, r, b = ink(ref)
    dx = dy = 0
    if x is not None:
        cur = {"center": (l + r) / 2, "left": l, "right": r}[anchor]
        dx = x - cur
    if y is not None:
        dy = y - (t + b) / 2
    m.shift([px(dx), px(-dy), 0])
    return m


def bar(x0, x1, y0, y1, color, opacity=1.0):
    """Filled rectangle with exact pixel edges (lines the viewer must read)."""
    r = Rectangle(width=px(x1 - x0), height=px(y1 - y0))
    r.move_to(at((x0 + x1) / 2, (y0 + y1) / 2))
    r.set_fill(color, opacity=opacity).set_stroke(width=0)
    return r


def curve(p0, c, p1):
    """Quadratic corner as a cubic: p0 -> p1 bending through control c."""
    a, cc, b = np.array(at(*p0)), np.array(at(*c)), np.array(at(*p1))
    return CubicBezier(a, a + 2 / 3 * (cc - a), b + 2 / 3 * (cc - b), b)


def hbrace(x0, x1, top, bot, color, stroke_px, opacity=1.0):
    """Curly brace opening up (ends at top, tip at bottom), constant stroke."""
    mid = (top + bot) / 2
    h = (bot - top) / 2
    cx = (x0 + x1) / 2
    segs = [
        curve((x0, top), (x0, mid), (x0 + h, mid)),
        Line(at(x0 + h, mid), at(cx - h, mid)),
        curve((cx - h, mid), (cx, mid), (cx, bot)),
        curve((cx, bot), (cx, mid), (cx + h, mid)),
        Line(at(cx + h, mid), at(x1 - h, mid)),
        curve((x1 - h, mid), (x1, mid), (x1, top)),
    ]
    v = VMobject()
    v.set_points(np.concatenate([sg.points for sg in segs]))
    v.set_stroke(color, width=px_stroke(stroke_px), opacity=opacity).set_fill(opacity=0)
    return v


def vbrace_halves(x0, x1, top, bot, color, stroke_px, opacity):
    """Brace opening left (ends at x0, tip at x1), as two halves drawn end -> tip."""
    mid_x = (x0 + x1) / 2
    cy = (top + bot) / 2
    w = (x1 - x0) / 2

    def half(y_end, sign):
        segs = [
            curve((x0, y_end), (mid_x, y_end), (mid_x, y_end + sign * w)),
            Line(at(mid_x, y_end + sign * w), at(mid_x, cy - sign * w)),
            curve((mid_x, cy - sign * w), (mid_x, cy), (x1, cy)),
        ]
        v = VMobject()
        v.set_points(np.concatenate([s.points for s in segs]))
        v.set_stroke(color, width=px_stroke(stroke_px), opacity=opacity).set_fill(opacity=0)
        return v

    return half(top, +1), half(bot, -1)


def cloud(box, stroke_px, opacity):
    """Line-art cloud filling box (x0, y0, x1, y1): a flat-bottomed union of bumps."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    base_h = 0.5 * h
    base = RoundedRectangle(width=px(w), height=px(base_h), corner_radius=px(base_h / 2))
    base.move_to(at(x0 + w / 2, y1 - base_h / 2))
    bumps = []
    for fx, fy, fr in [(0.33, 0.62, 0.30), (0.60, 0.41, 0.41), (0.84, 0.70, 0.26)]:
        c = Circle(radius=px(fr * h))
        c.move_to(at(x0 + fx * w, y0 + fy * h))
        bumps.append(c)
    u = Union(base, *bumps)
    u.set_stroke(LINE, width=px_stroke(stroke_px), opacity=opacity).set_fill(opacity=0)
    # fit the ink exactly to the design box
    u.stretch_to_fit_width(px(w)).stretch_to_fit_height(px(h)).move_to(at(x0 + w / 2, y0 + h / 2))
    return u


def recolor(parts, color, opacity, run_time, lag=0.25):
    """Left-to-right recolor of text pieces."""
    return LaggedStart(*[p.animate(rate_func=EASE).set_fill(color, opacity=opacity) for p in parts],
                       lag_ratio=lag, run_time=run_time)


def draw_bar(b, run_time, edge=LEFT):
    return GrowFromEdge(b, edge, rate_func=EASE, run_time=run_time)


def write(m, run_time):
    return Write(m, run_time=run_time, rate_func=SMOOTH)


class Chapter(BeatScene):
    media_id = "li-v6-ch1"
    window = ("titleIn", "end")

    def frame_of(self, beat):
        # per-beat nudges from layout.json (seconds); beats.json stays untouched
        f = super().frame_of(beat)
        if isinstance(beat, str):
            f += round(L["beat_offsets"].get(beat, 0) * self.fps)
        return f

    # play several beat-cued animations as one play starting now
    def cued(self, *items):
        now = self.now_frame()
        parts = []
        for beat, anim in items:
            off = self.frame_of(beat) - now
            if off < 0:
                raise RuntimeError(f"cue {beat!r} is {-off} frames in the past")
            parts.append(Succession(Wait(off / self.fps), anim) if off else anim)
        self.play(AnimationGroup(*parts))

    def construct(self):
        A, B, BT = L["address"], L["bits"], L["braces"]
        DV, UL, CT = L["divider"], L["underlines"], L["bit_counts"]
        SY = L["strip"]["offset_y"]  # moves every A-C element down together; y keys below are before it

        # ================= build: the address strip ==========================
        addr = tex("192", ".", "168", ".", "10", ".", "42", "/", "24", size=A["px"])
        octs = [addr[0], addr[2], addr[4], addr[6]]
        dots = [addr[1], addr[3], addr[5]]
        quad = VGroup(*addr[:7])
        # center the dotted quad (not the prefix) on the design point
        place(addr, x=A["center"][0], ref=quad)
        place(addr, y=A["center"][1] + SY, ref=addr[0])
        prefix = VGroup(addr[7], addr[8])
        slash, p24 = addr[7], addr[8]
        # rest positions after the spread: octets over their bit groups
        rest_shift = [A["octet_centers"][g] - (ink(o)[0] + ink(o)[2]) / 2 for g, o in enumerate(octs)]
        rest_dot = [A["dot_centers"][g] - (ink(d)[0] + ink(d)[2]) / 2 for g, d in enumerate(dots)]
        # the prefix sits after "42" once it rests; place it now (it is hidden until bSlash)
        place(prefix, x=L["prefix"]["left"], anchor="left", ref=prefix)
        p16 = tex("16", size=A["px"], color=WARNING, opacity=1)
        p16.align_to(p24, LEFT).align_to(p24, DOWN)
        prefix.set_fill(WARNING, opacity=1)

        # bits: one Tex (shared baseline), each glyph moved to its 40 px cell
        bits_tex = tex(BITS, size=B["px"])
        place(bits_tex, y=B["center_y"] + SY)
        bits = list(bits_tex[0])
        cell_cx = [B["group_left"][i // 8] + B["cell_w"] * (i % 8 + 0.5) for i in range(32)]
        for i, b in enumerate(bits):
            b.set_x(at(cell_cx[i], 0)[0])

        div_x = DV["x"]
        divider = bar(div_x - DV["grey_width"] / 2, div_x + DV["grey_width"] / 2,
                      DV["grey_top"] + SY, DV["grey_bottom"] + SY, LINE, MUTED_OPACITY)
        divider_amber = bar(div_x - DV["amber_width"] / 2, div_x + DV["amber_width"] / 2,
                            DV["amber_top"] + SY, DV["amber_bottom"] + SY, WARNING, 1)

        gap = BT["gap_to_divider"]

        def net_brace_at(x):
            return hbrace(BT["left"], x - gap, BT["top"] + SY, BT["bottom"] + SY, ACCENT, BT["stroke"])

        def host_brace_at(x):
            return hbrace(x + gap, BT["right"], BT["top"] + SY, BT["bottom"] + SY, SUCCESS, BT["stroke"])

        def net_cx(x):
            return (BT["left"] + x - gap) / 2

        def host_cx(x):
            return (x + gap + BT["right"]) / 2

        net_brace, host_brace = net_brace_at(div_x), host_brace_at(div_x)
        net_label = place(tex("network", size=L["network_label"]["px"], color=ACCENT, opacity=1),
                          x=net_cx(div_x), y=L["network_label"]["center_y"] + SY)
        host_label = place(tex("host", size=L["host_label"]["px"], color=SUCCESS, opacity=1),
                           x=host_cx(div_x), y=L["host_label"]["center_y"] + SY)

        # bit counts: pre-built values, one visible at a time during the reveal
        def count(n, color):
            return tex(str(n), "\\ bits", size=CT["px"], color=color, opacity=1)

        net_counts = {n: count(n, ACCENT) for n in range(16, 25)}
        host_counts = {n: count(n, SUCCESS) for n in range(8, 17)}
        for n, m in net_counts.items():
            place(m, x=net_cx(div_x), y=CT["center_y"] + SY, ref=m)
        for n, m in host_counts.items():
            place(m, x=host_cx(div_x), y=CT["center_y"] + SY, ref=m)

        # centered over the whole prefix ("/24", later "/16"), its bottom a set gap above the slash's top
        CD = L["cidr_label"]
        cidr = tex("CIDR notation", size=CD["px"])
        pl, pt, pr, _ = ink(prefix)
        place(cidr, x=(pl + pr) / 2 + CD["offset_x"], y=pt - CD["gap_above_prefix"] - cidr.height / px(1) / 2)

        def underline(key, color):
            x0, x1 = UL[key]
            return bar(x0, x1, UL["top"] + SY, UL["top"] + SY + UL["thickness"], color)

        # neighbors block
        NB = L["neighbors"]
        nb_label = place(tex("neighbors", size=NB["label_px"], opacity=MUTED_OPACITY),
                         x=NB["label_right"], y=NB["label_center_y"] + SY, anchor="right")
        row24 = tex("/24", "192.168.10.", "x", size=NB["row_px"], opacity=MUTED_OPACITY)
        row16 = tex("/16", "192.168", ".", "x", ".", "x", size=NB["row_px"])
        for row, cy in [(row24, NB["row24_center_y"] + SY), (row16, NB["row16_center_y"] + SY)]:
            place(row, y=cy, ref=row[1])
            place(row[0], x=NB["prefix_left"], anchor="left")
            place(VGroup(*row[1:]), x=NB["pattern_left"], anchor="left")
        for i, c in [(0, WARNING), (1, ACCENT), (3, SUCCESS), (5, SUCCESS)]:
            # stroke follows the fill so Write's draw-on outline isn't white on colored parts
            row16[i].set_fill(c, opacity=1).set_stroke(c, opacity=1)
        # "neighbors" first appears on the /24 row's baseline (its first glyph's foot on the
        # digits' foot), then glides to its centered spot as the /16 row writes on
        nb_label_home = nb_label.get_center().copy()
        nb_label.shift(UP * (row24[1].get_bottom()[1] - nb_label[0][0].get_bottom()[1]))

        # ================= Title =============================================
        T = L["title"]
        title = place(tex("Addresses and Prefixes", size=T["px"]), x=T["center"][0], y=T["center"][1])
        subtitle = place(tex("Chapter 1 $\\cdot$ Addressing and Subnetting", size=L["subtitle"]["px"],
                             opacity=MUTED_OPACITY),
                         x=L["subtitle"]["center"][0], y=L["subtitle"]["center"][1])
        s0 = T["start_opacity"]
        spring = (lambda t: s0 + (1 - s0) * EASE(t))
        self.play(FadeIn(VGroup(title, subtitle), scale=T["start_scale"], rate_func=spring,
                         run_time=T["spring_s"]))

        # ================= A: 32 bits, two parts =============================
        # the title leaves with the wrapper's fluid loop (same start, 0.6 s, inOut cubic),
        # and the address writes on only once both are gone
        self.wait_until("titleOut")
        self.play(FadeOut(VGroup(title, subtitle), rate_func=rate_functions.ease_in_out_cubic,
                          run_time=T["fade_out_s"]))
        self.wait_until("aAddr")
        self.next_section("A")
        self.play(write(quad, A["write_s"]))

        self.wait_until("aSpread")
        self.play(*[o.animate(rate_func=SMOOTH).shift(RIGHT * px(s)) for o, s in zip(octs, rest_shift)],
                  *[d.animate(rate_func=SMOOTH).shift(RIGHT * px(s)) for d, s in zip(dots, rest_dot)],
                  run_time=A["spread_s"])

        self.wait_until("aBitsIn")
        fans = []
        for g in range(4):
            src = octs[g].get_center()
            fan = LaggedStart(*[FadeIn(bits[g * 8 + k], target_position=src, scale=B["fan_start_scale"],
                                       rate_func=EASE) for k in range(8)],
                              lag_ratio=B["bit_lag"], run_time=B["fan_s"])
            fans.append(Succession(Wait(g * B["octet_lag_s"]), fan) if g else fan)
        self.play(AnimationGroup(*fans))

        self.wait_until("aDim")
        self.play(quad.animate(rate_func=EASE).set_fill(LINE, opacity=MUTED_OPACITY), run_time=A["dim_s"])

        self.wait_until("aSplit")
        self.play(draw_bar(divider, DV["draw_s"], edge=UP))

        self.wait_until("aNet")
        self.play(
            recolor(bits[:24], ACCENT, 1, B["recolor_s"], lag=0.04),
            Succession(Wait(0.1), Create(net_brace, rate_func=EASE, run_time=BT["draw_s"])),
            Succession(Wait(0.35), write(net_label, L["network_label"]["write_s"])),
        )
        self.wait_until("aHost")
        self.play(
            recolor(bits[24:], SUCCESS, 1, B["recolor_s"] * 0.6, lag=0.08),
            Succession(Wait(0.1), Create(host_brace, rate_func=EASE, run_time=BT["draw_s"] * 0.8)),
            Succession(Wait(0.3), write(host_label, L["host_label"]["write_s"])),
        )

        # ================= B: the prefix =====================================
        self.wait_until("bStart")
        self.next_section("B")
        self.wait_until("bCue")
        self.play(Transform(divider, divider_amber, rate_func=EASE, run_time=DV["cue_s"]))

        self.wait_until("bSlash")
        self.play(write(prefix, L["prefix"]["write_s"]))
        self.wait_until("bCidr")
        self.play(write(cidr, L["cidr_label"]["write_s"]))

        self.wait_until("bNet24")
        n24 = net_counts[24]
        # the copy stays upright: only its center rides the arc while it shrinks and turns cyan
        src24, dst24 = p24.copy(), n24[0]
        arc = path_along_arc(-math.radians(CT["flight_arc_deg"]))
        c0, c1 = np.array([src24.get_center()]), np.array([dst24.get_center()])
        k = dst24.height / src24.height
        flyer = src24.copy()

        def fly(m, a):
            m.become(src24.copy().scale(1 + (k - 1) * a))
            m.set_fill(interpolate_color(WARNING, ACCENT, a), opacity=1)
            m.move_to(arc(c0, c1, a)[0])

        self.play(UpdateFromAlphaFunc(flyer, fly, rate_func=SMOOTH, run_time=CT["flight_s"]))
        self.remove(flyer)
        self.add(n24[0])
        self.play(write(n24[1], CT["bits_write_s"]))
        self.remove(n24[0], n24[1])
        self.add(n24)  # the parent must be in the scene for the reveal's updater

        self.wait_until("bHost8")
        self.play(write(host_counts[8], CT["write_s"]))

        self.wait_until("bTake")
        self.play(recolor(list(quad), LINE, LINE_OPACITY, A["brighten_s"], lag=0.15))

        ul_net24, ul_host24 = underline("net24", ACCENT), underline("host24", SUCCESS)
        self.wait_until("bNetDec")
        self.play(recolor(list(addr[0:5]), ACCENT, 1, A["recolor_s"], lag=0.15),
                  draw_bar(ul_net24, UL["draw_s"] + 0.1))
        self.wait_until("bHostDec")
        self.play(recolor([addr[6]], SUCCESS, 1, A["recolor_s"] * 0.8),
                  draw_bar(ul_host24, UL["draw_s"]))

        # ================= C: a different prefix ============================
        self.wait_until("cStart")
        self.next_section("C")
        ul_prefix = underline("prefix", WARNING)
        self.wait_until("cCue")
        self.play(draw_bar(ul_prefix, UL["draw_s"]))

        self.wait_until("cSlash16")
        self.play(FadeOut(p24, rate_func=SMOOTH), FadeIn(p16, rate_func=SMOOTH), run_time=L["prefix"]["swap_s"])

        self.wait_until("cClear")
        self.run_until("cReveal",
                       *[p.animate(rate_func=SMOOTH).set_fill(LINE, opacity=LINE_OPACITY) for p in quad],
                       FadeOut(ul_net24, rate_func=SMOOTH), FadeOut(ul_host24, rate_func=SMOOTH))

        # ---- THE REVEAL: the divider slides left, everything attached follows
        x = ValueTracker(div_x)
        g3 = list(range(16, 24))
        for n in range(16, 24):
            net_counts[n].set_fill(opacity=0)
            self.add(net_counts[n])
        for n in range(9, 17):
            host_counts[n].set_fill(opacity=0)
            self.add(host_counts[n])

        def net_n(sx):
            return 16 + sum(1 for i in g3 if cell_cx[i] < sx)

        def upd_divider(m):
            m.set_x(at(x.get_value(), 0)[0])

        def upd_bit(i):
            def f(m):
                a = (cell_cx[i] - x.get_value()) / B["cell_w"] + 0.5
                m.set_fill(interpolate_color(ACCENT, SUCCESS, SMOOTH(min(1.0, max(0.0, a)))), opacity=1)
            return f

        def upd_net_count(n):
            def f(m):
                m.set_fill(opacity=1 if net_n(x.get_value()) == n else 0)
                place(m, x=net_cx(x.get_value()))
            return f

        def upd_host_count(n):
            def f(m):
                m.set_fill(opacity=1 if 32 - net_n(x.get_value()) == n else 0)
                place(m, x=host_cx(x.get_value()))
            return f

        swept = [
            (divider, upd_divider),
            (net_brace, lambda m: m.become(net_brace_at(x.get_value()))),
            (host_brace, lambda m: m.become(host_brace_at(x.get_value()))),
            (net_label, lambda m: place(m, x=net_cx(x.get_value()))),
            (host_label, lambda m: place(m, x=host_cx(x.get_value()))),
        ]
        swept += [(bits[i], upd_bit(i)) for i in g3]
        swept += [(net_counts[n], upd_net_count(n)) for n in range(16, 25)]
        swept += [(host_counts[n], upd_host_count(n)) for n in range(8, 17)]
        for m, f in swept:
            m.add_updater(f)
        self.play(x.animate(rate_func=SMOOTH).set_value(DV["reveal_x"]), run_time=DV["reveal_s"])
        for m, _ in swept:
            m.clear_updaters()
        for n in range(17, 25):
            self.remove(net_counts[n])
        for n in range(8, 16):
            self.remove(host_counts[n])
        for i in g3:
            bits[i].set_fill(SUCCESS, opacity=1)

        ul_net16, ul_host16 = underline("net16", ACCENT), underline("host16", SUCCESS)
        self.wait_until("cNet16")
        self.play(recolor(list(addr[0:3]), ACCENT, 1, A["recolor_s"], lag=0.2),
                  draw_bar(ul_net16, UL["draw_s"]))
        self.wait_until("cHost16")
        self.play(recolor(list(addr[4:7]), SUCCESS, 1, A["recolor_s"], lag=0.2),
                  draw_bar(ul_host16, UL["draw_s"]))

        self.wait_until("cNbr24")
        self.play(FadeIn(nb_label, rate_func=EASE, run_time=NB["label_fade_s"]), write(row24, NB["write_s"]))
        self.wait_until("cNbr16")
        self.play(write(row16, NB["write_s"]),
                  nb_label.animate(rate_func=SMOOTH, run_time=NB["label_glide_s"]).move_to(nb_label_home))

        # ================= D: private ranges ================================
        self.wait_until("dStart")
        self.next_section("D")
        self.wait_until("dOut")
        anchor = Group(*self.mobjects)
        self.play(FadeOut(anchor, shift=RIGHT * px(L["anchor_exit"]["shift_x"]), rate_func=SMOOTH,
                          run_time=L["anchor_exit"]["s"]))
        self.remove(*self.mobjects)

        PH, R = L["private_head"], L["ranges"]
        head = place(tex("private address space", size=PH["px"]), x=PH["center"][0], y=PH["center"][1])

        def rng(*parts, cy):
            t = tex(*parts, size=R["px"])
            for p, s in zip(t, parts):
                if s == "x":
                    p.set_fill(LINE, opacity=MUTED_OPACITY)
            # centered on the digits (the x letters are shorter), left edge on the column
            place(t, y=cy, ref=t[0])
            return place(t, x=R["left"], anchor="left")

        cy = R["row_center_y"]
        r10 = rng("10.", "x", ".", "x", ".", "x", cy=cy[0])
        r172 = rng("172.16.", "x", ".", "x", " -- 172.31.", "x", ".", "x", cy=cy[1])
        r192 = rng("192.168.", "x", ".", "x", cy=cy[2])

        self.wait_until("dHead")
        self.play(write(head, PH["write_s"]))
        self.wait_until("dTen")
        self.play(write(r10, R["write_s"]))
        self.wait_until("d172a")
        self.play(write(VGroup(*r172[:4]), R["write_s"]))
        self.wait_until("d172b")
        self.play(write(VGroup(*r172[4:]), R["write_s"]))
        self.wait_until("d192")
        self.play(write(r192, R["row192_write_s"]))

        NR = L["no_route"]
        b_top, b_bot = vbrace_halves(NR["brace_x"][0], NR["brace_x"][1], NR["brace_y"][0], NR["brace_y"][1],
                                     LINE, NR["stroke"], MUTED_OPACITY)
        path = Line(at(NR["line_x"][0], NR["line_y"]), at(NR["line_x"][1], NR["line_y"]))
        path.set_stroke(LINE, width=px_stroke(NR["stroke"]), opacity=MUTED_OPACITY)
        CL = L["cloud"]
        cloud_m = cloud(CL["box"], CL["stroke"], MUTED_OPACITY)
        PL = L["public_label"]
        public = place(tex("public internet", size=PL["px"]), x=PL["center"][0], y=PL["center"][1])
        CX = L["cross"]
        cx0, cy0, hs = CX["center"][0], CX["center"][1], CX["size"] / 2
        cross = VGroup(Line(at(cx0 - hs, cy0 - hs), at(cx0 + hs, cy0 + hs)),
                       Line(at(cx0 - hs, cy0 + hs), at(cx0 + hs, cy0 - hs)))
        cross.set_stroke(DANGER, width=px_stroke(CX["stroke"]), opacity=1)
        NT = L["not_routed"]
        not_routed = place(tex("not routed", size=NT["px"], color=DANGER, opacity=1),
                           x=NT["center"][0], y=NT["center"][1])

        self.wait_until("dNoRoute")
        self.play(Succession(
            AnimationGroup(Create(b_top, rate_func=SMOOTH), Create(b_bot, rate_func=SMOOTH),
                           run_time=NR["brace_draw_s"]),
            Create(path, rate_func=EASE, run_time=NR["line_draw_s"]),
        ))
        self.wait_until("dPublic")
        self.cued(
            ("dPublic", AnimationGroup(FadeIn(cloud_m, rate_func=EASE, run_time=CL["fade_s"]),
                                       write(public, PL["write_s"]))),
            ("dBlock", FadeIn(cross, scale=CX["start_scale"], rate_func=EASE, run_time=CX["land_s"])),
            ("dNotRouted", write(not_routed, NT["write_s"])),
        )

        EX = L["example"]
        ex = r192.copy()
        ex_target = tex("192.168.", "10.42", size=R["px"])
        self.wait_until("dExample")
        self.play(ex.animate(rate_func=SMOOTH).shift(DOWN * px(EX["center_y"] - cy[2])),
                  run_time=EX["slide_s"])
        # "192.168." of the target sits exactly on the copy's, so only "x.x" -> "10.42" changes
        ex_target.shift(ex[0].get_corner(DOWN + LEFT) - ex_target[0].get_corner(DOWN + LEFT))
        self.wait_until("dMorph")
        self.play(*[FadeOut(p, rate_func=SMOOTH) for p in ex[1:]], FadeIn(ex_target[1], rate_func=SMOOTH),
                  run_time=EX["morph_s"])

        # ================= Tail =============================================
        self.wait_until("fadeOut")
        self.next_section("tail")
        self.play(FadeOut(Group(*self.mobjects), rate_func=SMOOTH, run_time=L["tail"]["fade_s"]))
        self.remove(*self.mobjects)
        self.finish()
