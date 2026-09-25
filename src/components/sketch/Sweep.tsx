import React from 'react';

// A soft left-to-right sweep that clears what's under it, like a board wiped
// with one pass of a wide cloth. Wrap the drawing in
// <SweepMask id progress>...</SweepMask>; progress 0 = untouched, 1 = gone.
// x0..x1 is the span the edge travels (default: the whole frame); `soft` is
// the width of the feathered edge in px. The ground underneath never changes.
export const SweepMask: React.FC<{
  id: string;
  progress: number;
  x0?: number;
  x1?: number;
  soft?: number;
  children: React.ReactNode;
}> = ({id, progress, x0 = 0, x1 = 1920, soft = 220, children}) => {
  if (progress <= 0) return <>{children}</>;
  if (progress >= 1) return null;
  const edge = x0 - soft + (x1 - x0 + 2 * soft) * progress;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={edge - soft} y1={0} x2={edge} y2={0}>
          <stop offset="0" stopColor="black" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
          <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>{children}</g>
    </>
  );
};
