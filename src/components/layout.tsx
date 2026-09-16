import React, {createContext, useContext} from 'react';

/**
 * Reusable layout-override plumbing shared by every chapter.
 *
 * A chapter defines a Zod `schema` (see Chapter3.tsx) exposing position numbers
 * and visibility toggles. It wraps its stage in <LayoutProvider values={props}>,
 * and individual panels read their position/visibility with `useNum`/`useFlag`,
 * falling back to a hard-coded default. The result: every exposed knob becomes a
 * draggable field in the Remotion Studio props panel, with live preview — and
 * elements can be shown/hidden per composition without touching the layout code.
 */
export type LayoutValues = Record<string, number | boolean | undefined>;

const LayoutContext = createContext<LayoutValues>({});

export const LayoutProvider: React.FC<{values: LayoutValues; children: React.ReactNode}> = ({
  values,
  children,
}) => <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>;

/** Numeric layout value with a default (so panels still work with no schema). */
export const useNum = (key: string, fallback: number): number => {
  const v = useContext(LayoutContext)[key];
  return typeof v === 'number' ? v : fallback;
};

/** Boolean visibility flag with a default (default = visible). */
export const useFlag = (key: string, fallback = true): boolean => {
  const v = useContext(LayoutContext)[key];
  return typeof v === 'boolean' ? v : fallback;
};
