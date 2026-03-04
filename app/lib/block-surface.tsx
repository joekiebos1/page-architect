'use client'

/**
 * Block-level surface and accent utilities.
 * Content managers set these per block via Sanity; blocks use them for SurfaceProvider and background colours.
 *
 * DS terminology (from @marcelinodzn/ds-tokens colors.appearance):
 * - Primary = brand primary (block-background-bold/subtle)
 * - Secondary = brand secondary (surface-secondary)
 * - Neutral = neutral grey scale
 */

import type { ReactNode } from 'react'
import { SurfaceProvider } from '@marcelinodzn/ds-react'

/** Block surface/background: ghost, minimal, subtle, bold. Maps to SurfaceProvider level + hasBoldBackground. */
export type BlockSurface = 'ghost' | 'minimal' | 'subtle' | 'bold'

/** Block accent/colour theme: primary, secondary, neutral. Maps to DS appearance tokens. */
export type BlockAccent = 'primary' | 'secondary' | 'neutral'

/** SurfaceProvider props derived from block surface. */
export type SurfaceProviderProps = {
  level: 0 | 1
  hasBoldBackground: boolean
  /** Colored (non-bold) background; enables high-tinted typography/icons. */
  hasColoredBackground?: boolean
}

/**
 * Maps block surface to SurfaceProvider props.
 * Content author chooses surface; DS components adapt automatically from context.
 * - minimal/subtle: level 1, hasColoredBackground for tinted adaptation
 * - bold: level 1, hasBoldBackground for on-bold text/icons
 */
export function getSurfaceProviderProps(blockSurface: BlockSurface | 'none' | null | undefined): SurfaceProviderProps {
  switch (blockSurface) {
    case 'minimal':
    case 'subtle':
      return { level: 1, hasBoldBackground: false, hasColoredBackground: true }
    case 'bold':
      return { level: 1, hasBoldBackground: true, hasColoredBackground: false }
    case 'ghost':
    case 'none':
    default:
      return { level: 0, hasBoldBackground: false, hasColoredBackground: false }
  }
}

/**
 * Returns the background colour CSS value for a block with coloured surface.
 * Use when blockSurface is minimal, subtle, or bold. Returns undefined for ghost/none.
 *
 * DS tokens used:
 * - primary: --ds-color-block-background-subtle, --ds-color-block-background-bold
 * - secondary: --ds-color-surface-secondary (bold); subtle uses color-mix (no dedicated token)
 * - neutral: --ds-color-neutral-subtle, --ds-color-neutral-bold
 */
export function getBlockBackgroundColor(
  blockSurface: BlockSurface | 'none' | null | undefined,
  blockAccent: BlockAccent | null | undefined = 'primary'
): string | undefined {
  const accent = blockAccent ?? 'primary'
  if (!blockSurface || blockSurface === 'ghost' || blockSurface === 'none') return undefined

  const subtleMap: Record<BlockAccent, string> = {
    primary: 'var(--ds-color-block-background-subtle)',
    secondary: 'color-mix(in srgb, var(--ds-color-surface-secondary) 15%, white)',
    neutral: 'var(--ds-color-neutral-subtle)',
  }
  const boldMap: Record<BlockAccent, string> = {
    primary: 'var(--ds-color-block-background-bold)',
    secondary: 'var(--ds-color-surface-secondary)',
    neutral: 'var(--ds-color-neutral-bold)',
  }

  switch (blockSurface) {
    case 'minimal':
      return subtleMap[accent]
    case 'subtle':
      return subtleMap[accent]
    case 'bold':
      return boldMap[accent]
    default:
      return undefined
  }
}

export type BlockSurfaceProviderProps = {
  blockSurface?: BlockSurface | 'none' | null
  blockAccent?: BlockAccent | null
  children: ReactNode
  /** When true, background spans full viewport width (100vw). Default false. */
  fullWidth?: boolean
}

/**
 * Wraps children with SurfaceProvider and optionally a coloured background band.
 * Use when a block needs block-level surface + accent. For blocks with custom layout (e.g. MediaTextBlock),
 * use getSurfaceProviderProps and getBlockBackgroundColor directly.
 */
export function BlockSurfaceProvider({
  blockSurface = 'ghost',
  blockAccent = 'primary',
  children,
  fullWidth = false,
}: BlockSurfaceProviderProps) {
  const surfaceProps = getSurfaceProviderProps(blockSurface)
  const bgColor = getBlockBackgroundColor(blockSurface, blockAccent)

  const content = <SurfaceProvider {...surfaceProps}>{children}</SurfaceProvider>

  if (bgColor) {
    return (
      <div
        style={{
          width: fullWidth ? '100vw' : '100%',
          maxWidth: fullWidth ? '100vw' : undefined,
          marginLeft: fullWidth ? 'calc(50% - 50vw)' : undefined,
          marginRight: fullWidth ? 'calc(50% - 50vw)' : undefined,
          backgroundColor: bgColor,
          boxSizing: 'border-box',
          /** Internal padding when background is present (ghost = none). Vertical only; GridBlock provides horizontal inset. */
          paddingBlock: 'var(--ds-spacing-3xl)',
        }}
      >
        {content}
      </div>
    )
  }
  return content
}
