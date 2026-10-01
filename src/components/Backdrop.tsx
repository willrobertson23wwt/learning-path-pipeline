import {AbsoluteFill, Img, OffthreadVideo, getStaticFiles, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const PAPER_BG = 'backgrounds/paper-dark.jpg';
export const TRANSITION_LOOP = 'backgrounds/transition-loop.mp4';

// The loop (26 MB) is kept out of git; a fresh clone doesn't have it, and
// the title then sits on the backdrop under it alone.
const hasTransitionLoop = () =>
  getStaticFiles().some((f) => f.name === TRANSITION_LOOP);

// Full-frame crumpled-paper texture behind chapter content. Render ONLY when
// not transparent — the -Overlay render must stay fully transparent.
export const PaperBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Img
      src={staticFile(PAPER_BG)}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  </AbsoluteFill>
);

// Fluid dark loop behind chapter-title transitions (20s 4K source, titles are
// far shorter). Fades in/out so it hands back to the paper texture cleanly.
// Render ONLY when not transparent, inside the title's <Sequence>.
// Chapter openers pass fadeInFrames={0}: the title Sequence starts on frame 0,
// and the backdrop must already be up so the clip never opens on bare paper.
export const TransitionBackdrop: React.FC<{
  durationInFrames: number;
  fadeFrames?: number;
  fadeInFrames?: number;
}> = ({durationInFrames, fadeFrames = 12, fadeInFrames}) => {
  const frame = useCurrentFrame();
  const fadeIn = fadeInFrames ?? fadeFrames;
  const enter =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;
  const exit = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const opacity = enter * exit;
  if (!hasTransitionLoop()) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <OffthreadVideo
        muted
        src={staticFile(TRANSITION_LOOP)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </AbsoluteFill>
  );
};
