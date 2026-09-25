import {useMemo} from 'react';
import {AbsoluteFill, getStaticFiles, useCurrentFrame, useVideoConfig} from 'remotion';
import {ManimLayer} from '../ManimLayer';

// ManimLayer, guarded: in frames mode it loads `<src>/NNNN.png` per frame and
// a missing file would fail the render, so each frame is checked against
// getStaticFiles() first. A frame (or a .webm) that isn't in public/ yet draws
// a small dashed placeholder naming the missing file instead.
export const GuardedManimLayer: React.FC<{
  src: string;
  start: number; // s, composition time
  end: number;
  offsetFrames: number;
  x: number;
  y: number;
  scale: number;
}> = ({src, start, end, offsetFrames, x, y, scale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const files = useMemo(() => new Set(getStaticFiles().map((f) => f.name)), []);

  const isVideo = /\.[a-z0-9]+$/i.test(src);
  const from = Math.round(start * fps) + offsetFrames;
  const dur = Math.max(1, Math.round(end * fps) - Math.round(start * fps));
  // Same index ManimLayer asks for (clamped, so its premount frames are covered).
  const index = Math.min(Math.max(frame - from, 0), dur - 1);
  const needed = isVideo ? src : `${src}/${String(index).padStart(4, '0')}.png`;

  if (!files.has(needed)) {
    // Outside the layer's window nothing would draw anyway.
    if (frame < from || frame >= from + dur) return null;
    return <Placeholder missing={needed} />;
  }
  return <ManimLayer src={src} start={start} end={end} offset={offsetFrames / fps} x={x} y={y} scale={scale} />;
};

const Placeholder: React.FC<{missing: string}> = ({missing}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div
      style={{
        border: '3px dashed rgba(255,190,70,0.8)',
        borderRadius: 8,
        padding: '18px 28px',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'Menlo, monospace',
        fontSize: 22,
        background: 'rgba(0,0,0,0.35)',
        whiteSpace: 'nowrap',
      }}
    >
      Manim frame missing: public/{missing}
    </div>
  </AbsoluteFill>
);
