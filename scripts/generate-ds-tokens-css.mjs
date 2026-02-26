#!/usr/bin/env node
/**
 * Generates CSS variables from @marcelinodzn/ds-tokens at build time.
 * Single source of truth: no duplicated values in globals.css.
 *
 * Run: node scripts/generate-ds-tokens-css.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import {
  spacing,
  typography,
  colors,
  getBreakpoints,
  createTokenContext,
  COLLECTION_NAMES,
  PLATFORM_MODES,
  DENSITY_MODES,
  COLOR_MODE_MODES,
} from '@marcelinodzn/ds-tokens'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'app', 'ds-tokens.generated.css')

const ctx = createTokenContext({
  [COLLECTION_NAMES.PLATFORM]: PLATFORM_MODES.DESKTOP_1440,
  [COLLECTION_NAMES.DENSITY]: DENSITY_MODES.DEFAULT,
  [COLLECTION_NAMES.COLOR_MODE]: COLOR_MODE_MODES.LIGHT,
})

const vars = []

// Font family
const fontFamily = typography.fontFamily(ctx)
const fontStack = fontFamily
  ? `${String(fontFamily)}, "Inter", system-ui, sans-serif`
  : '"JioType Var", "Inter", system-ui, sans-serif'
vars.push(`  --ds-font-family: ${fontStack};`)

// Spacing
const spacingSizes = ['3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
spacingSizes.forEach((size) => {
  const value = spacing.get(size, ctx)
  if (value != null) vars.push(`  --ds-spacing-${size.toLowerCase()}: ${value}px;`)
})

// Breakpoints
const bp = getBreakpoints()
vars.push(`  --ds-breakpoint-mobile: ${bp.mobile}px;`)
vars.push(`  --ds-breakpoint-tablet: ${bp.tablet}px;`)
vars.push(`  --ds-breakpoint-desktop: ${bp.desktop}px;`)
vars.push(`  --ds-breakpoint-desktop-lg: ${bp.desktopLarge}px;`)

// Colors
const bgSubtle = colors.background('Subtle', ctx)
const textHigh = colors.text('High', ctx)
const textMedium = colors.text('Medium', ctx)
const primaryBold = colors.appearance('Primary', 'Background/Bold', ctx)
const strokeSubtle = colors.background('Ghost', ctx) ?? colors.background('Subtle', ctx)
if (bgSubtle != null) vars.push(`  --ds-color-background-subtle: ${bgSubtle};`)
if (textHigh != null) vars.push(`  --ds-color-text-high: ${textHigh};`)
if (textMedium != null) vars.push(`  --ds-color-text-medium: ${textMedium};`)
if (primaryBold != null) vars.push(`  --ds-color-surface-bold: ${primaryBold};`)
if (strokeSubtle != null) vars.push(`  --ds-color-stroke-subtle: ${strokeSubtle};`)

// Typography
const labelM = typography.fontSize('Label', 'M', ctx)
const labelWeightHigh = typography.fontWeight('Label', 'High', ctx)
const display2xl =
  typography.fontSize('Display', '2XL', ctx) ??
  typography.fontSize('Headline', '2XL', ctx) ??
  typography.fontSize('Title', '2XL', ctx)
const baseDisplay = display2xl != null ? Number(display2xl) : 48
if (labelM != null) vars.push(`  --ds-typography-label-m: ${labelM}px;`)
if (labelWeightHigh != null) vars.push(`  --ds-typography-weight-high: ${labelWeightHigh};`)
vars.push(`  --ds-typography-display-2xl: ${baseDisplay}px;`)
vars.push(`  --ds-typography-display-hero: ${Math.round(baseDisplay * 1.75)}px;`)

// Derived tokens
const spacing2xl = spacing.get('2XL', ctx)
const spacingS = spacing.get('S', ctx)
if (spacing2xl != null && spacingS != null) {
  vars.push(`  --ds-spacing-hero-sides: ${Number(spacing2xl) + Number(spacingS)}px;`)
}
vars.push(`  --ds-spacing-hero-overlap: 12.5vw;`)
vars.push(`  --ds-spacing-hero-panel-trim: 25vw;`)

const css = `/**
 * Design System tokens - generated from @marcelinodzn/ds-tokens
 * Do not edit. Run: node scripts/generate-ds-tokens-css.mjs
 */
:root {
${vars.join('\n')}
}
`

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, css)
console.log('Generated:', outPath)
