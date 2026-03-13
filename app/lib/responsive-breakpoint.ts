'use client'

import { useGridBreakpoint } from './use-grid-breakpoint'

/**
 * Responsive breakpoint logic — shared across blocks.
 *
 * Uses grid columns from useGridBreakpoint():
 * - Mobile: columns <= 4
 * - Tablet: columns <= 8
 * - Desktop: columns === 12
 *
 * Use for: carousels, media blocks, grids.
 */

/** Grid columns at breakpoint boundaries. */
export const BREAKPOINT_COLUMNS = {
  mobile: 4,
  tablet: 8,
  desktop: 12,
} as const

export function isMobile(columns: number): boolean {
  return columns <= BREAKPOINT_COLUMNS.mobile
}

export function isTablet(columns: number): boolean {
  return columns > BREAKPOINT_COLUMNS.mobile && columns <= BREAKPOINT_COLUMNS.tablet
}

export function isDesktop(columns: number): boolean {
  return columns >= BREAKPOINT_COLUMNS.desktop
}

/** Breakpoint name from columns. */
export type BreakpointName = 'mobile' | 'tablet' | 'desktop'

/**
 * Hook: returns current breakpoint from grid columns.
 * Use instead of ad-hoc `columns <= 4` checks for clarity.
 */
export function useBreakpoint(): BreakpointName {
  const { columns } = useGridBreakpoint()
  if (columns <= BREAKPOINT_COLUMNS.mobile) return 'mobile'
  if (columns <= BREAKPOINT_COLUMNS.tablet) return 'tablet'
  return 'desktop'
}

/** Carousel card size. */
export type CarouselCardSize = 'compact' | 'medium' | 'large'

/**
 * Responsive visible columns for carousel.
 * Mobile: 1 for all. Tablet: 2 for compact/medium, 1 for large. Desktop: 3/2/1.
 */
export function getResponsiveCarouselCols(
  columns: number,
  cardSize: CarouselCardSize
): number {
  if (columns <= BREAKPOINT_COLUMNS.mobile) return 1
  if (columns <= BREAKPOINT_COLUMNS.tablet) return cardSize === 'large' ? 1 : 2
  switch (cardSize) {
    case 'compact': return 3
    case 'medium': return 2
    case 'large': return 1
    default: return 2
  }
}

/** Aspect ratios supported for breakpoint switching. */
export type LandscapeAspectRatio = '2:1' | '16:9' | '4:3' | '8:5'
export type PortraitAspectRatio = '4:5' | '3:4'

/**
 * On mobile, landscape ratios become portrait for more impact.
 * Desktop/tablet: keep base ratio.
 *
 * Use for: Large carousel cards, hero media, full-bleed overlays.
 */
export function getAspectRatioForBreakpoint(
  baseRatio: LandscapeAspectRatio | PortraitAspectRatio,
  columns: number
): string {
  if (columns > BREAKPOINT_COLUMNS.mobile) return baseRatio

  const landscapeToPortrait: Record<string, PortraitAspectRatio> = {
    '2:1': '4:5',
    '16:9': '4:5',
    '4:3': '3:4',
    '8:5': '4:5',
  }
  return landscapeToPortrait[baseRatio] ?? baseRatio
}
