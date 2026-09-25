import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {WWT} from './palette';

// The title's moving light for the hand-drawn style: two soft, out-of-focus
// pools of WWT blue and indigo drifting at about 30 px/s over the navy
// ground. Behind the title it's up from frame 0 and fades out, eased, from
// `fadeStartSec` over `fadeSec`, leaving exactly the lesson ground. Behind a
// thank-you card it fades in from `fadeInStartSec` instead (and stays).
// Only gray-50 and navy-25 lettering sit on it; red never does.
export const TitleLight: React.FC<{fadeStartSec?: number; fadeSec?: number; fadeInStartSec?: number}> = ({
  fadeStartSec = Infinity,
  fadeSec = 0.6,
  fadeInStartSec,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ease = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)} as const;
  const out = Number.isFinite(fadeStartSec) ? interpolate(t, [fadeStartSec, fadeStartSec + fadeSec], [1, 0], ease) : 1;
  const inn = fadeInStartSec === undefined ? 1 : interpolate(t, [fadeInStartSec, fadeInStartSec + fadeSec], [0, 1], ease);
  const opacity = Math.min(out, inn);
  if (opacity <= 0) return null;
  const x1 = 620 + 30 * t;
  const y1 = 380 + 8 * t;
  const x2 = 1340 - 26 * t;
  const y2 = 660 - 10 * t;
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: [
          `radial-gradient(circle 620px at ${x1}px ${y1}px, ${WWT.blue}55 0%, ${WWT.blue}22 45%, transparent 100%)`,
          `radial-gradient(circle 680px at ${x2}px ${y2}px, ${WWT.indigo}88 0%, ${WWT.indigo}33 50%, transparent 100%)`,
        ].join(', '),
      }}
    />
  );
};
