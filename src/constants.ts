// Transparent lead-in and tail (seconds) added to each chapter so the clip has
// handles to trim and cross-fade in Premiere. Also extends the duration in Root.
// Set to 0: clips start on frame 0 (audio + graphics aligned) with no padding,
// since transitions are handled in Premiere directly.
export const BUFFER_SECONDS = 0;

// End-of-chapter hold (seconds) past the last narration beat: foreground
// elements fade out but the backdrop stays, giving Premiere clean
// background-only tail frames to build a transition into. Added ONCE to a
// chapter's duration (not doubled like BUFFER_SECONDS). Applied to chapters
// produced from 2026-07-09 onward (first: video 10).
export const END_BUFFER_SECONDS = 2;

export const FPS = 30;
