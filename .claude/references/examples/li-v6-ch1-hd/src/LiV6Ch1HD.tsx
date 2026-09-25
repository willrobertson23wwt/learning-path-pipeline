import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {z} from 'zod';
import {NavyGround} from '../../components/sketch/Ground';
import {HandText, layoutText, TextSpan} from '../../components/sketch/HandText';
import {Ink, InkDefs} from '../../components/sketch/Ink';
import {INK} from '../../components/sketch/palette';
import {arrow, blob, braceV, cloud, computer, cross, ellipse, house, line, office, rack, wobble} from '../../components/sketch/shapes';
import {SweepMask} from '../../components/sketch/Sweep';
import {TitleLight} from '../../components/sketch/TitleLight';
import {Stroke} from '../../components/sketch/geom';
import {MixTrack} from '../../components/MixTrack';
import type {Mix} from '../../components/MixTrack';
import {FPS} from '../../constants';
import mixFile from '../../../public/chapters/li-v6-ch1-hd/mix.json';
import {B, COMP_FRAMES} from './kit';
import {NarrationTrack} from './NarrationTrack';

// li-v6-ch1 in the hand-drawn style: marker line art and lettering drawn on
// as the narrator speaks, on the navy ground (out/li-v6-ch1-hd/design.md).
// Every box and beat below comes from that shot list; beats from
// public/chapters/li-v6-ch1-hd/beats.json.

export const LI_V6_CH1_HD_FRAMES = COMP_FRAMES;

export const liV6Ch1HdSchema = z.object({
  transparent: z.boolean().describe('Overlay render: no ground, no title light'),
  playNarration: z.boolean().describe('Narration'),
  playMusic: z.boolean().describe('Music bed'),
  playSfx: z.boolean().describe('Sound effects'),
});
export type LiV6Ch1HdProps = z.infer<typeof liV6Ch1HdSchema>;
export const liV6Ch1HdDefaults = {playNarration: true, playMusic: true, playSfx: true};

const MIX = mixFile as unknown as Mix;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const WRITE = Easing.inOut(Easing.sin); // a steady hand, soft start and stop
const FADE = Easing.inOut(Easing.cubic);
const SLIDE = Easing.bezier(0.3, 0.75, 0.3, 1); // quick start, long slow settle

// ---- Scene A-C geometry (shot list boxes) ----
const OCTETS = [
  {text: '192', cx: 518},
  {text: '168', cx: 866},
  {text: '10', cx: 1214},
  {text: '42', cx: 1562},
];
const DOT_X = [692, 1040, 1388];
const ADDR_BASE = 290;
const ADDR_CAP = 70;
const BITS = ['11000000', '10101000', '00001010', '00101010'];
const GROUP_X = [374, 722, 1070, 1418];
const CELL = 36;
const BIT_BASE = 410;
const bitCx = (g: number, k: number) => GROUP_X[g] + CELL / 2 + k * CELL;

const DIV_X0 = 1388;
const DIV_X1 = 1040;
const SIGN_GAP = 22; // sign ends this far from the divider
const SIGN_BASE = 492;
const SIGN_CAP = 40;
const COUNT_BASE = 546;
const COUNT_CAP = 34;
const UL_Y = 310;

const SLASH_X = 1664;
const slashW = layoutText('/', {cap: ADDR_CAP, seed: 'slash'}).width;
const PREFIX_X = SLASH_X + slashW + ADDR_CAP * 0.04;
// The circle is fitted to the lettering it holds (the wider of "24" and "16").
const prefixEnd = PREFIX_X + Math.max(layoutText('24', {cap: ADDR_CAP, seed: 'p24'}).width, layoutText('16', {cap: ADDR_CAP, seed: 'p16'}).width);
// Left edge 30 px before the slash (clear of "42"), 22 px past the digits,
// tall enough for the slash's tail.
const CIRCLE = {cx: (SLASH_X - 30 + prefixEnd + 22) / 2, cy: 261, w: prefixEnd + 22 - (SLASH_X - 30), h: 134};

// Scenes A-C sit this much lower than the shot list's boxes (vertical balance,
// stills review); scene D this much higher.
const STRIP_DY = 45;
const D_DY = -35;

const dot = (x: number, y: number): Stroke[] => [[[x - 2.5, y], [x + 2.5, y - 1]]];

// A sign that hangs off the divider: "← network" (arrow, then word; its right
// end at x) or "host →" (word, then arrow; its left end at x).
const Sign: React.FC<{side: 'left' | 'right'; x: number; word: string; color: string; progress: number}> = ({side, x, word, color, progress}) => {
  const w = layoutText(word, {cap: SIGN_CAP, seed: `sign-${word}`}).width;
  const y = SIGN_BASE - SIGN_CAP * 0.38;
  const arrowP = side === 'left' ? Math.min(1, progress / 0.3) : Math.max(0, (progress - 0.7) / 0.3);
  const wordP = side === 'left' ? Math.max(0, (progress - 0.3) / 0.7) : Math.min(1, progress / 0.7);
  const a =
    side === 'left'
      ? arrow([x - w - 14, y], [x - w - 60, y], `arr-${word}`, 13)
      : arrow([x + w + 14, y], [x + w + 60, y], `arr-${word}`, 13);
  return (
    <>
      <Ink strokes={a} color={color} width={4} progress={arrowP} />
      <HandText text={word} seed={`sign-${word}`} x={x} y={SIGN_BASE} cap={SIGN_CAP} align={side === 'left' ? 'end' : 'start'} color={color} progress={wordP} />
    </>
  );
};

// ---- Scene D geometry ----
const D_CAP = 48;
const xRow = (s: string): TextSpan[] => s.split(/(x)/).filter(Boolean).map((t) => ({text: t, color: t === 'x' ? INK.note : INK.line}));
const row172a = xRow('172.16.x.x');
const row172aW = layoutText(row172a, {cap: D_CAP, seed: 'r172a', jitter: 0.9}).width;
const row172W = row172aW + layoutText([{text: ' – '}, ...xRow('172.31.x.x')], {cap: D_CAP, seed: 'r172b', jitter: 0.9}).width;
// The brace stands just clear of the widest row (at least where the shot
// list put it), and the path out, its cross and label follow from it.
const BRACE_X = Math.max(905, 230 + row172W + 26);
const CROSS_X = 1285;

export const LiV6Ch1HD: React.FC<LiV6Ch1HdProps> = ({transparent, playNarration, playMusic, playSfx}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const at = (t0: number, dur: number, easing = WRITE) => interpolate(t, [t0, t0 + dur], [0, 1], {...clamp, easing});

  // ---- Title ----
  const titleOut = 1 - at(B.titleOut, 0.6, FADE);

  // ---- Scene A ----
  // Address: one pass of the pen, number, dot, number... over 1.5 s.
  const addrWeights = [3, 0.6, 3, 0.6, 2, 0.6, 2];
  const addrP = at(B.aAddr, 1.5);
  const addrPiece = (k: number) => {
    const sum = addrWeights.reduce((a, b) => a + b, 0);
    const before = addrWeights.slice(0, k).reduce((a, b) => a + b, 0) / sum;
    return Math.max(0, Math.min(1, (addrP - before) / (addrWeights[k] / sum)));
  };
  // Bits: 0.5 s a group, one group after another, 2.0 s in all.
  const bitP = (g: number, k: number) => Math.max(0, Math.min(1, at(B.aBits + g * 0.5, 0.5, Easing.linear) * 8 - k));
  // The machine, drawn in hold 1 (0.8 s): outline, stand, foot, then "01".
  const pcP = at(B.hold1Machine + 0.05, 0.6);
  const pcTextP = at(B.hold1Machine + 0.6, 0.25);

  // Divider: lavender on aSplit, gone over in gold on bCue, slides on cReveal.
  const divP = at(B.aSplit, 0.35);
  const gold = at(B.bCue, 0.4, FADE);
  const slide = at(B.cReveal, 1.8, SLIDE);
  const divX = interpolate(slide, [0, 1], [DIV_X0, DIV_X1]);
  const shift = divX - DIV_X0;

  // Bit colors: network sweep (g1-g3, 0.4 s), host sweep (g4, 0.3 s), then
  // the orange trail behind the moving divider over g3.
  const bitColor = (g: number, k: number) => {
    const j = g * 8 + k;
    let c: string = INK.line;
    if (g < 3) c = interpolateColors(at(B.aNetSweep + (0.4 * j) / 23, 0.12, FADE), [0, 1], [INK.line, INK.a]);
    else c = interpolateColors(at(B.aHostSweep + (0.3 * k) / 7, 0.12, FADE), [0, 1], [INK.line, INK.b]);
    if (g === 2) {
      const trail = interpolate(bitCx(g, k) - divX, [0, 22], [0, 1], clamp);
      c = interpolateColors(trail, [0, 1], [c, INK.b]);
    }
    return c;
  };

  // /24 -> circled -> "24" rubbed out -> "16" lettered.
  const slashP = at(B.bSlash, 0.2);
  const p24 = at(B.bSlash + 0.15, 0.3);
  const rub24 = at(B.cSlash16, 0.2, Easing.linear);
  const p16 = at(B.cSlash16 + 0.2, 0.45);
  const circleP = at(B.cCue, 0.5);

  // The /24 reading, wiped on cClear (0.3 s).
  const reading24 = 1 - at(B.cClear, 0.3, FADE);

  // Sheet wipes.
  const wipeC = at(B.cWipe, 0.6, FADE);
  const wipeTail = at(B.tailWipe, 0.6, FADE);

  // ---- Scene D: the private space ----
  const blobP = at(B.dLoop, 1.0);
  const braceArrow = [...braceV(BRACE_X, 280, 528, 40, 'dBrace'), ...arrow([BRACE_X + 47, 404], [1400, 404], 'dArrow', 22)];
  const crossP = at(B.dCross, 0.35);
  const noRouteP = at(B.dCross + 0.35, 0.5);
  const cloudStart = Math.max(B.dCloud, B.dCross + 0.85);

  const abc = (
    <SweepMask id="wipeC" progress={wipeC}>
      <g transform={`translate(0 ${STRIP_DY})`}>
      {/* Scene A: the address, spread out over its bits */}
      {OCTETS.map((o, i) => (
        <HandText key={o.text} text={o.text} seed={`oct${i}`} x={o.cx} y={ADDR_BASE} cap={ADDR_CAP} align="middle" color={INK.line} progress={addrPiece(i * 2)} />
      ))}
      {DOT_X.map((x, i) => (
        <Ink key={x} strokes={dot(x, 283)} color={INK.line} width={12} progress={addrPiece(i * 2 + 1)} />
      ))}
      {BITS.map((g, gi) =>
        g.split('').map((b, k) => (
          <HandText key={`${gi}${k}`} text={b} seed={`b${gi}${k}`} x={bitCx(gi, k)} y={BIT_BASE} cap={44} align="middle" color={bitColor(gi, k)} progress={bitP(gi, k)} />
        )),
      )}
      <Ink strokes={computer(214, 340, 110, 96, 'machine')} color={INK.line} width={4.5} progress={pcP} />
      <HandText text="01" x={269} y={389} cap={24} align="middle" color={INK.note} progress={pcTextP} seed="screen01" />

      {/* The divider and the two signs it carries */}
      <g transform={`translate(${divX.toFixed(2)} 0)`}>
        <Ink
          strokes={[wobble([[0, 342 - 4 * gold], [0, 434 + 6 * gold]], 'divider', 1.2, 80)]}
          color={interpolateColors(gold, [0, 1], [INK.note, INK.key])}
          width={5 + 3 * gold}
          progress={divP}
        />
      </g>
      <g transform={`translate(${shift.toFixed(2)} 0)`}>
        <Sign side="left" x={DIV_X0 - SIGN_GAP} word="network" color={INK.a} progress={at(B.aNetLabel, 0.6)} />
        <Sign side="right" x={DIV_X0 + SIGN_GAP} word="host" color={INK.b} progress={at(B.aHostLabel, 0.5)} />
      </g>

      {/* Scene B: the prefix */}
      <HandText text="/" seed="slash" x={SLASH_X} y={ADDR_BASE} cap={ADDR_CAP} color={INK.key} progress={slashP} />
      <SweepMask id="rub24" progress={rub24} x0={PREFIX_X - 5} x1={PREFIX_X + 100} soft={30}>
        <HandText text="24" seed="p24" x={PREFIX_X} y={ADDR_BASE} cap={ADDR_CAP} color={INK.key} progress={p24} />
      </SweepMask>
      <HandText text="16" seed="p16" x={PREFIX_X} y={ADDR_BASE} cap={ADDR_CAP} color={INK.key} progress={p16} />
      <HandText text="CIDR notation" x={1770} y={174} cap={34} align="end" color={INK.note} jitter={0.6} progress={at(B.bCidr, 0.8)} />
      <g opacity={reading24}>
        <HandText text={[{text: '24', color: INK.key}, {text: ' bits', color: INK.note}]} seed="cnt24" x={DIV_X0 - SIGN_GAP} y={COUNT_BASE} cap={COUNT_CAP} align="end" progress={at(B.bNet24, 0.5)} />
        <HandText text="8 bits" seed="cnt8" x={DIV_X0 + SIGN_GAP} y={COUNT_BASE} cap={COUNT_CAP} color={INK.note} progress={at(B.bHost8, 0.45)} />
        <Ink strokes={line(452, UL_Y, 1258, UL_Y + 2, 'ulNet24', 1.3)} color={INK.a} width={4.5} progress={at(B.bNetDec, 0.6)} />
        <Ink strokes={line(1518, UL_Y, 1606, UL_Y, 'ulHost8', 1.1)} color={INK.b} width={4.5} progress={at(B.bHostDec, 0.3)} />
      </g>

      {/* Scene C: circled, re-lettered, slid, re-read */}
      <Ink strokes={ellipse(CIRCLE.cx, CIRCLE.cy, CIRCLE.w, CIRCLE.h, 'circle24', 1.1)} color={INK.key} width={4.5} progress={circleP} />
      <Ink strokes={line(452, UL_Y, 932, UL_Y + 1, 'ulNet16', 1.3)} color={INK.a} width={4.5} progress={at(B.cNet16, 0.5)} />
      <HandText text={[{text: '16', color: INK.key}, {text: ' bits', color: INK.note}]} seed="cnt16a" x={DIV_X1 - SIGN_GAP} y={COUNT_BASE} cap={COUNT_CAP} align="end" progress={at(B.cNetCount, 0.5)} />
      <Ink strokes={line(1170, UL_Y, 1606, UL_Y + 1, 'ulHost16', 1.3)} color={INK.b} width={4.5} progress={at(B.cHost16, 0.5)} />
      <HandText text="16 bits" seed="cnt16b" x={DIV_X1 + SIGN_GAP} y={COUNT_BASE} cap={COUNT_CAP} color={INK.note} progress={at(B.cHostCount, 0.5)} />

      {/* The machine's idea of its neighbors */}
      <Ink
        strokes={[
          ...ellipse(306, 478, 16, 16, 'th1', 0.4),
          ...ellipse(338, 526, 26, 24, 'th2', 0.5),
          ...ellipse(378, 584, 38, 34, 'th3', 0.6),
          ...cloud(425, 596, 1015, 835, 'bubble', 12, false),
        ]}
        color={INK.line}
        width={4}
        progress={at(B.cBubble, 0.7)}
      />
      <HandText text="/24  192.168.10.x" x={515} y={694} cap={40} color={INK.ghost} jitter={0.9} progress={at(B.cNbr24, 1.0)} />
      <HandText
        text={[
          {text: '/16', color: INK.key},
          {text: '  192.168', color: INK.a},
          {text: '.', color: INK.line},
          {text: 'x', color: INK.b},
          {text: '.', color: INK.line},
          {text: 'x', color: INK.b},
        ]}
        seed="nbr16"
        x={515}
        y={772}
        jitter={0.9}
        cap={40}
        progress={at(B.cNbr16, 1.0)}
      />
      </g>
    </SweepMask>
  );

  const d = (
    <SweepMask id="wipeTail" progress={wipeTail}>
      <g transform={`translate(0 ${D_DY})`}>
      <Ink strokes={blob(150, 110, 1170, 870, 'private')} color={INK.line} width={5} progress={blobP} />
      <HandText text="private address space" x={240} y={220} cap={56} color={INK.line} progress={at(B.dHead, 0.9)} />
      <HandText text={xRow('10.x.x.x')} seed="r10" x={230} y={328} cap={D_CAP} jitter={0.9} progress={at(B.dTen, 0.5)} />
      <HandText text={row172a} seed="r172a" x={230} y={428} cap={D_CAP} jitter={0.9} progress={at(B.d172a, 0.7)} />
      <HandText text={[{text: ' – ', color: INK.line}, ...xRow('172.31.x.x')]} seed="r172b" x={230 + row172aW} y={428} cap={D_CAP} jitter={0.9} progress={at(B.d172b, 0.9)} />
      <HandText text={xRow('192.168.x.x')} seed="r192" x={230} y={528} cap={D_CAP} jitter={0.9} progress={at(B.d192, 0.8)} />
      <Ink strokes={braceArrow} color={INK.line} width={5} progress={at(B.dArrow, 1.0)} />
      <Ink strokes={cross(CROSS_X, 405, 60, 'noroute')} color={INK.bad} width={8} progress={crossP} />
      <HandText text="no route" x={CROSS_X} y={350} cap={34} align="middle" color={INK.bad} progress={noRouteP} />
      <Ink strokes={cloud(1440, 330, 1700, 480, 'internet', 8)} color={INK.line} width={5} progress={at(cloudStart, 0.6)} />
      <HandText text="public internet" x={1572} y={539} cap={34} align="middle" color={INK.note} progress={at(cloudStart + 0.6, 0.6)} />
      <Ink strokes={rack(280, 680, 90, 130, 'lab')} color={INK.line} width={4.5} progress={at(B.dLab, 0.5)} />
      <Ink strokes={office(550, 640, 120, 170, 'office')} color={INK.line} width={4.5} progress={at(B.dOffice, 0.5)} />
      <Ink strokes={house(840, 680, 160, 130, 'home')} color={INK.line} width={4.5} progress={at(B.dHome, 0.5)} />
      <Ink strokes={arrow([194, 540], [218, 584], 'hook', 11, -10)} color={INK.note} width={4} progress={at(B.dExample, 0.2)} />
      <HandText text="192.168.10.42" x={230} y={600} cap={D_CAP} color={INK.line} jitter={0.9} progress={at(B.dExample + 0.15, 0.9)} />
      </g>
    </SweepMask>
  );

  return (
    <AbsoluteFill>
      {transparent ? null : <NavyGround />}
      {transparent ? null : <TitleLight fadeStartSec={B.titleOut} fadeSec={0.6} />}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <InkDefs />
        <g filter="url(#marker)">
          {t < B.titleOut + 0.7 ? (
            <g opacity={titleOut}>
              <HandText text="Addresses and Prefixes" x={960} y={520} cap={70} align="middle" color={INK.line} progress={at(-0.06, 0.86)} />
              <HandText text="Chapter 1 · Addressing and Subnetting" x={960} y={604} cap={34} align="middle" color={INK.note} progress={at(B.titleSub, 0.4)} />
            </g>
          ) : null}
          {t >= B.aAddr - 0.1 && t < B.cWipe + 0.7 ? abc : null}
          {t >= B.dLoop - 0.1 ? d : null}
        </g>
      </svg>
      {playNarration ? <NarrationTrack /> : null}
      <MixTrack mix={{music: playMusic ? MIX.music : [], sfx: playSfx ? MIX.sfx : []}} />
    </AbsoluteFill>
  );
};

