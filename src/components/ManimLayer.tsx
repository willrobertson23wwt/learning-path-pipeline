import {AbsoluteFill, interpolate, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// One Manim segment as a transparent layer inside a Remotion composition.
// manim-builder renders each segment full-frame (1920x1080, 30 fps, VP9 WebM
// with alpha) for exactly its window, so at x=0, y=0, scale=1 the Manim frame
// sits pixel-for-pixel on the composition. Remotion keeps the audio and the
// timeline; this only places the clip.
//
// `start`/`end` come from beats.json (seconds, narration time). `offset`
// shifts the whole segment and is what the Studio "start offset" prop drives;
// retiming INSIDE a segment means re-rendering it from beats.json.
export const ManimLayer: React.FC<{
  src: string; // under public/: 'manim/<id>/strip.webm' or the frames folder 'manim/<id>/strip'
  start: number;
  end: number;
  offset?: number; // seconds
  x?: number; // px, shifts the layer from its rendered position
  y?: number;
  scale?: number;
  opacity?: number;
  fadeOutSec?: number; // eased fade over the segment's last N seconds (scene cut)
}> = ({src, start, end, offset = 0, x = 0, y = 0, scale = 1, opacity = 1, fadeOutSec = 0}) => {
  const {fps} = useVideoConfig();
  // Same rounding as manim/_kit/timing.py, so a segment's frame count matches
  // its render and adjacent segments meet with no gap or overlap.
  const from = Math.round((start + offset) * fps);
  const durationInFrames = Math.max(1, Math.round(end * fps) - Math.round(start * fps));
  // premountFor: in Studio each segment plays in an HTML5 <video>; mounting it
  // a second early avoids backdrop-only frames at a seam between segments.
  return (
    <Sequence from={from} durationInFrames={durationInFrames} premountFor={fps}>
      <Layer
        src={src}
        x={x}
        y={y}
        scale={scale}
        opacity={opacity}
        fadeOutFrames={Math.round(fadeOutSec * fps)}
        durationInFrames={durationInFrames}
      />
    </Sequence>
  );
};

const Layer: React.FC<{
  src: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  fadeOutFrames: number;
  durationInFrames: number;
}> = ({src, x, y, scale, opacity, fadeOutFrames, durationInFrames}) => {
  const frame = useCurrentFrame();
  const fade =
    fadeOutFrames > 0
      ? interpolate(frame, [durationInFrames - fadeOutFrames, durationInFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
      : 1;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: 'center',
        opacity: opacity * fade,
      }}
    >
      {/\.[a-z0-9]+$/i.test(src) ? (
        // transparent: decode with alpha at render time (VP9 WebM or ProRes 4444)
        <OffthreadVideo src={staticFile(src)} transparent muted style={{width: '100%', height: '100%'}} />
      ) : (
        <Img
          src={staticFile(`${src}/${String(Math.min(frame, durationInFrames - 1)).padStart(4, '0')}.png`)}
          style={{width: '100%', height: '100%'}}
        />
      )}
    </AbsoluteFill>
  );
};
