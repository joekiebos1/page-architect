'use client'

import { useEffect } from 'react'
import { useDsContext } from '@marcelinodzn/ds-react'
import {
  spacing,
  typography,
  colors,
  getBreakpoints,
  getVariableByName,
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
      [COLLECTION_NAMES.THEME]: '↓Pack1',
      [COLLECTION_NAMES.THEME_PACK1]: 'JioHome',
    })

    const root = document.documentElement

    // Typography - JioType Var via next/font (var(--font-jiotype)), fallback to DS token
    const fontFamily = typography.fontFamily(ctx)
    const fontStack = fontFamily
      ? `${String(fontFamily)}, "Inter", system-ui, sans-serif`
      : 'var(--font-jiotype), "Inter", system-ui, sans-serif'
    root.style.setProperty('--ds-font-family', fontStack)

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

    // Surface/background colors for placeholders and surfaces
    const bgSubtle = colors.background('Subtle', ctx)
    const textHigh = colors.text('High', ctx)
    const textMedium = colors.text('Medium', ctx)
    const textLow = colors.text('Low', ctx)
    const primaryBold = colors.appearance('Primary', 'Background/Bold', ctx)
    const secondaryBold = getVariableByName('Secondary/Background/Bold', ctx)
    const strokeSubtle = colors.background('Ghost', ctx) ?? colors.background('Subtle', ctx)
    const labelM = typography.fontSize('Label', 'M', ctx)
    const headlineM = typography.fontSize('Headline', 'M', ctx)
    const bodyXs = typography.fontSize('Body', 'XS', ctx)
    const labelWeightHigh = typography.fontWeight('Label', 'High', ctx)
    const labelWeightLow = typography.fontWeight('Label', 'Low', ctx)
    const bodyWeightMedium = typography.fontWeight('Body', 'Medium', ctx)
    const display2xl = typography.fontSize('Display', '2XL', ctx)
    if (bgSubtle != null) root.style.setProperty('--ds-color-background-subtle', String(bgSubtle))
    if (textHigh != null) root.style.setProperty('--ds-color-text-high', String(textHigh))
    if (textMedium != null) root.style.setProperty('--ds-color-text-medium', String(textMedium))
    if (textLow != null) root.style.setProperty('--ds-color-text-low', String(textLow))
    if (primaryBold != null) root.style.setProperty('--ds-color-surface-bold', String(primaryBold))
    if (secondaryBold != null) root.style.setProperty('--ds-color-surface-secondary', String(secondaryBold))
    if (strokeSubtle != null) root.style.setProperty('--ds-color-stroke-subtle', String(strokeSubtle))
    if (labelM != null) root.style.setProperty('--ds-typography-label-m', `${labelM}px`)
    if (headlineM != null) root.style.setProperty('--ds-typography-headline-m', `${headlineM}px`)
    if (bodyXs != null) root.style.setProperty('--ds-typography-body-xs', `${bodyXs}px`)
    if (labelWeightHigh != null) root.style.setProperty('--ds-typography-weight-high', String(labelWeightHigh))
    if (labelWeightLow != null) root.style.setProperty('--ds-typography-weight-low', String(labelWeightLow))
    if (bodyWeightMedium != null) root.style.setProperty('--ds-typography-weight-medium', String(bodyWeightMedium))
    if (display2xl != null) {
      const base = Number(display2xl)
      root.style.setProperty('--ds-typography-display-2xl', `${base}px`)
      root.style.setProperty('--ds-typography-display-hero', `${Math.round(base * 1.75)}px`)
    }

    // Derived tokens from DS spacing
    const spacing2xl = spacing.get('2XL', ctx)
    const spacingS = spacing.get('S', ctx)
    if (spacing2xl != null && spacingS != null) {
      root.style.setProperty('--ds-spacing-hero-sides', `${Number(spacing2xl) + Number(spacingS)}px`)
    }
    root.style.setProperty('--ds-spacing-hero-overlap', '12.5vw')
    root.style.setProperty('--ds-spacing-hero-panel-trim', '25vw')

    // Card radius from DS Shape/XL token
    const radiusCard = getVariableByName('Shape/XL', ctx)
    if (radiusCard != null) {
      root.style.setProperty('--ds-radius-card', `${Number(radiusCard)}px`)
    }
  }, [tokenContext])

  return null
}
