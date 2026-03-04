/**
 * Semantic headline size mapping.
 * When AI/content assigns h2, h3, or h4, size adjusts accordingly.
 */
export type HeadingLevel = 'h2' | 'h3' | 'h4'

const VALID_LEVELS: HeadingLevel[] = ['h2', 'h3', 'h4']

/** Sanitize heading level – strips invisible Unicode, ensures valid element name for createElement */
export function normalizeHeadingLevel(level: unknown): HeadingLevel {
  const s = typeof level === 'string'
    ? level.replace(/[\u200B-\u200D\uFEFF\u2060\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180E\u3164]/g, '').trim().toLowerCase()
    : ''
  return VALID_LEVELS.includes(s as HeadingLevel) ? (s as HeadingLevel) : 'h2'
}

/** DS Headline size prop - H2 largest, H4 smallest */
export const HEADLINE_SIZE_BY_LEVEL: Record<HeadingLevel, 'L' | 'M' | 'S' | 'XS'> = {
  h2: 'L',
  h3: 'M',
  h4: 'S',
}

/** DS typography tokens: H2 slightly smaller than H1 (hero), H3/H4 step down */
export const HEADLINE_FONT_SIZE_BY_LEVEL: Record<HeadingLevel, string> = {
  h2: 'var(--ds-typography-h2)',
  h3: 'var(--ds-typography-h3)',
  h4: 'var(--ds-typography-h4)',
}

export function getHeadlineSize(level: HeadingLevel): 'L' | 'M' | 'S' | 'XS' {
  return HEADLINE_SIZE_BY_LEVEL[level]
}

export function getHeadlineFontSize(level: HeadingLevel): string {
  return HEADLINE_FONT_SIZE_BY_LEVEL[level]
}

/** One step larger: h2→h1, h3→h2, h4→h3 */
export const HEADLINE_FONT_SIZE_ONE_STEP_UP: Record<HeadingLevel, string> = {
  h2: 'var(--ds-typography-h1)',
  h3: 'var(--ds-typography-h2)',
  h4: 'var(--ds-typography-h3)',
}

export function getHeadlineFontSizeOneStepUp(level: HeadingLevel): string {
  return HEADLINE_FONT_SIZE_ONE_STEP_UP[level]
}

/** One step smaller: h2→h3, h3→h4, h4→label-m */
export const HEADLINE_FONT_SIZE_ONE_STEP_DOWN: Record<HeadingLevel, string> = {
  h2: 'var(--ds-typography-h3)',
  h3: 'var(--ds-typography-h4)',
  h4: 'var(--ds-typography-label-m)',
}

export function getHeadlineFontSizeOneStepDown(level: HeadingLevel): string {
  return HEADLINE_FONT_SIZE_ONE_STEP_DOWN[level]
}

/** Child level (one step down): h2→h3, h3→h4, h4→h4 */
export function getChildLevel(level: HeadingLevel): HeadingLevel {
  return level === 'h2' ? 'h3' : level === 'h3' ? 'h4' : 'h4'
}

/** Subhead typography: standardised across HeroBlock, MediaTextBlock, lab variants */
export const SUBHEAD_STYLE = {
  fontSize: 'var(--ds-typography-h5)',
  fontWeight: 'var(--ds-typography-weight-medium)',
} as const
