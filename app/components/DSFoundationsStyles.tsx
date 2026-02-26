'use client'

import { useEffect } from 'react'
import { useDsContext } from '@marcelinodzn/ds-react'
import {
  spacing,
  typography,
  getBreakpoints,
  createTokenContext,
  COLLECTION_NAMES,
  PLATFORM_MODES,
  DENSITY_MODES,
  COLOR_MODE_MODES,
} from '@marcelinodzn/ds-tokens'

/**
 * Injects Jio Design System foundation tokens as CSS variables on :root.
 * Enables use of --ds-* variables across the app for grid, spacing, typography.
 */
export function DSFoundationsStyles() {
  const { tokenContext } = useDsContext()

  useEffect(() => {
    const ctx = tokenContext ?? createTokenContext({
      [COLLECTION_NAMES.PLATFORM]: PLATFORM_MODES.DESKTOP_1440,
      [COLLECTION_NAMES.DENSITY]: DENSITY_MODES.DEFAULT,
      [COLLECTION_NAMES.COLOR_MODE]: COLOR_MODE_MODES.LIGHT,
    })

    const root = document.documentElement

    // Typography - font family from DS token (JioType Var; add @font-face if you have the font files)
    const fontFamily = typography.fontFamily(ctx)
    if (fontFamily) {
      root.style.setProperty('--ds-font-family', `${String(fontFamily)}, system-ui, sans-serif`)
    }

    // Spacing tokens (for grid gaps, padding, margins)
    const spacingSizes = ['3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'] as const
    spacingSizes.forEach((size) => {
      const value = spacing.get(size, ctx)
      if (value != null) {
        root.style.setProperty(`--ds-spacing-${size.toLowerCase()}`, `${value}px`)
      }
    })

    // Breakpoints for grid/layout
    const breakpoints = getBreakpoints()
    root.style.setProperty('--ds-breakpoint-mobile', `${breakpoints.mobile}px`)
    root.style.setProperty('--ds-breakpoint-tablet', `${breakpoints.tablet}px`)
    root.style.setProperty('--ds-breakpoint-desktop', `${breakpoints.desktop}px`)
    root.style.setProperty('--ds-breakpoint-desktop-lg', `${breakpoints.desktopLarge}px`)
  }, [tokenContext])

  return null
}
