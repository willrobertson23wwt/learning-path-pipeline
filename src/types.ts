export type CueType = 'title' | 'lowerThird' | 'bullets' | 'waveform' | 'principle';

export type PrincipleIcon = 'leastPrivilege' | 'defenseInDepth' | 'attackSurface';

export interface BulletItem {
  text: string;
  /** Seconds after the cue starts that this bullet appears */
  at: number;
}

export interface Cue {
  type: CueType;
  /** Seconds from the start of the chapter audio */
  start: number;
  /** Seconds the element stays on screen */
  duration: number;
  text?: string;
  subtitle?: string;
  heading?: string;
  items?: BulletItem[];
  /** Which animated icon a 'principle' cue shows */
  icon?: PrincipleIcon;
  /**
   * For a 'principle' cue: seconds after the cue starts when the panel slides
   * from center to the side (typically when its bullet list appears).
   */
  slideAt?: number;
}

export interface ChapterTimeline {
  /** Path under public/, e.g. "chapters/chapter-01/narration.wav" */
  audio: string;
  cues: Cue[];
}
