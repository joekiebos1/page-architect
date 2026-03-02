'use client'

import { useGridBreakpoint } from '../lib/use-grid-breakpoint'

type GridBlockProps = {
  children: React.ReactNode
  as?: 'section' | 'div'
}

/**
 * Shared grid wrapper – same logic as Hero block.
 * Uses foundation grid (columns, margin, gutter) from useGridBreakpoint.
 */
export function GridBlock({ children, as: Component = 'section' }: GridBlockProps) {
  const { columns, marginPx, gutterPx } = useGridBreakpoint()
  return (
    <Component
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gutterPx,
        paddingLeft: marginPx,
        paddingRight: marginPx,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Component>
  )
}

/** Content width: narrow (8 cols), editorial (6 cols), default (10 cols), wide (12 cols), edgeToEdge (100vw). */
export type ContentWidth = 'narrow' | 'editorial' | 'default' | 'wide' | 'edgeToEdge'

/** Cell spanning the given content width, centered. Tablet: wide=8, default/narrow=6, editorial=4. Mobile: all=4. */
export function useGridCell(contentWidth: ContentWidth = 'default') {
  const { columns } = useGridBreakpoint()
  const isFull = contentWidth === 'wide' || contentWidth === 'edgeToEdge'
  const span =
    columns === 12
      ? isFull
        ? 12
        : contentWidth === 'default'
          ? 10
          : contentWidth === 'narrow'
            ? 8
            : contentWidth === 'editorial'
              ? 6
              : 12
      : columns === 8
        ? isFull
          ? 8
          : contentWidth === 'editorial'
            ? 4
            : 6
        : 4
  const start = Math.floor((columns - span) / 2) + 1
  return { gridColumn: `${start} / span ${span}` as const }
}
