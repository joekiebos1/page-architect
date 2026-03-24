/**
 * Lab block typography — single source for roles in `lib/blocks/typography-roles.md`.
 * Production blocks may continue using local patterns until migrated.
 */

import type { CSSProperties } from 'react'

/** Generated `--ds-typography-*` / `--ds-color-text-*` references (see `scripts/generate-ds-tokens-css.mjs`). */
export const LAB_TYPOGRAPHY_VARS = {
  h1: 'var(--ds-typography-h1)',
  h2: 'var(--ds-typography-h2)',
  h3: 'var(--ds-typography-h3)',
  h4: 'var(--ds-typography-h4)',
  h5: 'var(--ds-typography-h5)',
  labelS: 'var(--ds-typography-label-s)',
  labelM: 'var(--ds-typography-label-m)',
  /** May be provided by DS global CSS; used by compact card title scale */
  labelL: 'var(--ds-typography-label-l)',
  bodyXs: 'var(--ds-typography-body-xs)',
  bodyM: 'var(--ds-typography-body-m)',
  headlineXs: 'var(--ds-typography-headline-xs)',
  weightLow: 'var(--ds-typography-weight-low)',
  weightMedium: 'var(--ds-typography-weight-medium)',
  weightHigh: 'var(--ds-typography-weight-high)',
  textHigh: 'var(--ds-color-text-high)',
  textLow: 'var(--ds-color-text-low)',
} as const

const LINE_HEIGHT_BODY = 1.4

/** DS `Display` — no `weight` in published API; size + semantic colour only. */
export const labDisplayRole = {
  size: 'L' as const,
  color: 'high' as const,
}

/** DS `Headline` — block / section titles. */
export const labHeadlineBlockTitle = {
  weight: 'high' as const,
  color: 'high' as const,
}

export const labHeadlineBlockTitleAlt = {
  weight: 'medium' as const,
  color: 'high' as const,
}

/** DS `Text` roles */
export const labTextBody = {
  size: 'S' as const,
  weight: 'low' as const,
  color: 'low' as const,
}

export const labTextSubtitle = {
  size: 'M' as const,
  weight: 'medium' as const,
  color: 'high' as const,
}

export const labTextSubtitleAlt = {
  size: 'S' as const,
  weight: 'medium' as const,
  color: 'high' as const,
}

export const labTextBodyLead = {
  size: 'L' as const,
  weight: 'low' as const,
  color: 'low' as const,
}

/** DS `Label` — eyebrow */
export const labLabelEyebrow = {
  size: 'S' as const,
  color: 'medium' as const,
}

/** Plain `<p>` / `<span>` when DS typography components are not used */
export function labPlainBodyStyle(overrides?: CSSProperties): CSSProperties {
  return {
    fontSize: LAB_TYPOGRAPHY_VARS.labelS,
    lineHeight: LINE_HEIGHT_BODY,
    fontWeight: LAB_TYPOGRAPHY_VARS.weightLow,
    color: LAB_TYPOGRAPHY_VARS.textLow,
    ...overrides,
  }
}

export function labPlainSubtitleStyle(overrides?: CSSProperties): CSSProperties {
  return {
    fontSize: LAB_TYPOGRAPHY_VARS.h5,
    lineHeight: LINE_HEIGHT_BODY,
    fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
    color: LAB_TYPOGRAPHY_VARS.textHigh,
    ...overrides,
  }
}

export function labPlainSubtitleAltStyle(overrides?: CSSProperties): CSSProperties {
  return {
    fontSize: LAB_TYPOGRAPHY_VARS.labelS,
    lineHeight: LINE_HEIGHT_BODY,
    fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
    color: LAB_TYPOGRAPHY_VARS.textHigh,
    ...overrides,
  }
}

/** Overlay / on-image cards — use semantic local tokens where defined */
export const LAB_OVERLAY_TEXT = {
  title: {
    fontSize: LAB_TYPOGRAPHY_VARS.h5,
    fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
    color: 'var(--local-color-text-on-overlay)',
    lineHeight: LINE_HEIGHT_BODY,
  } satisfies CSSProperties,
  description: {
    fontSize: LAB_TYPOGRAPHY_VARS.labelS,
    fontWeight: LAB_TYPOGRAPHY_VARS.weightLow,
    color: 'var(--local-color-text-on-overlay-subtle)',
    lineHeight: LINE_HEIGHT_BODY,
  } satisfies CSSProperties,
} as const

/** Card grid colour-card title/description per card size (plain `<p>`). */
export const labCardGridTypography = {
  large: {
    titleFontSize: LAB_TYPOGRAPHY_VARS.h2,
    titleWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
    descFontSize: LAB_TYPOGRAPHY_VARS.labelM,
  },
  medium: {
    titleFontSize: LAB_TYPOGRAPHY_VARS.h4,
    titleWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
    descFontSize: LAB_TYPOGRAPHY_VARS.labelS,
  },
  small: {
    titleFontSize: LAB_TYPOGRAPHY_VARS.h5,
    titleWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
    descFontSize: LAB_TYPOGRAPHY_VARS.labelS,
  },
} as const

/** Text-on-image card sizes (plain `<p>`). */
export const labTextOnImageCardTypography = {
  large: {
    title: LAB_TYPOGRAPHY_VARS.h4,
    desc: LAB_TYPOGRAPHY_VARS.labelM,
  },
  medium: {
    title: LAB_TYPOGRAPHY_VARS.h5,
    desc: LAB_TYPOGRAPHY_VARS.labelS,
  },
  small: {
    title: LAB_TYPOGRAPHY_VARS.labelM,
    desc: LAB_TYPOGRAPHY_VARS.labelS,
  },
} as const

/** Lab MediaCard grid layout typography */
export const labMediaCardGridTypography = {
  large: { title: LAB_TYPOGRAPHY_VARS.h4, desc: LAB_TYPOGRAPHY_VARS.labelM },
  medium: { title: LAB_TYPOGRAPHY_VARS.h5, desc: LAB_TYPOGRAPHY_VARS.labelS },
  small: { title: LAB_TYPOGRAPHY_VARS.labelL, desc: LAB_TYPOGRAPHY_VARS.labelS },
} as const

/** Hero centred headline CSS sizes (responsive string vars). */
export const labHeroHeadlineSizes = {
  mobile: LAB_TYPOGRAPHY_VARS.h3,
  tablet: LAB_TYPOGRAPHY_VARS.h2,
  desktop: LAB_TYPOGRAPHY_VARS.h1,
} as const

export function labHeroProductNameStyle(isMobile: boolean): CSSProperties {
  return {
    marginBottom: 'var(--ds-spacing-m)',
    fontSize: isMobile ? LAB_TYPOGRAPHY_VARS.labelS : LAB_TYPOGRAPHY_VARS.headlineXs,
    lineHeight: 1.5,
  }
}

export function labHeroSubheadlineStyle(isMobile: boolean): CSSProperties {
  return {
    fontSize: isMobile ? LAB_TYPOGRAPHY_VARS.labelS : LAB_TYPOGRAPHY_VARS.headlineXs,
    lineHeight: 1.5,
  }
}
