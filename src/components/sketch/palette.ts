// WWT design-system tokens (user's palette, 2026-09-25) and the roles the
// hand-drawn style gives them on the navy ground. Contrast is measured on the
// ground's lightest point (--wwt-navy #1D1E48): thin marker lines are held to
// the text rule (4.5:1 or better), so the full-strength brand colors are
// fill-and-thick-stroke only and the -50 tints carry lines and lettering.
export const WWT = {
  navy: '#1D1E48',
  navyInk: '#11122E',
  navy75: '#565676',
  navy50: '#8E8FA4',
  navy25: '#C7C7D1',
  gray50: '#F6F7F8',
  gray300: '#98A3A3',
  ink: '#121212',
  white: '#FFFFFF',
  orange: '#FA4616',
  orange50: '#FDA38B',
  orange25: '#FED1C5',
  gold: '#FFC601',
  positive: '#1E9E62',
  blue: '#0086EA',
  blue50: '#66B6F2',
  blue25: '#99CFF7',
  indigo: '#162FB4',
  red50: '#F57E7F',
} as const;

export const INK = {
  line: WWT.gray50, // main marker lines and lettering, 14.7:1
  note: WWT.navy25, // secondary labels, 9.4:1
  ghost: WWT.navy50, // superseded or background content, 5.0:1
  a: WWT.blue50, // accent A (the network side), 7.2:1
  b: WWT.orange50, // accent B (the host side), 8.1:1
  key: WWT.gold, // the key reveal's highlight, 10.0:1
  bad: WWT.red50, // problem state, always with a drawn cross, 6.1:1
  good: WWT.positive, // check marks, thick strokes only, 4.6:1
} as const;
