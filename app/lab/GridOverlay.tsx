'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGridBreakpoint } from '../lib/use-grid-breakpoint'

/**
 * Lab grid overlay – matches GridBlock structure exactly (centered, gridMaxWidth).
 * Renders to document.body so it's above all content.
 */
export function LabGridOverlay() {
  const [mounted, setMounted] = useState(false)
  const { gridMaxWidth, columns } = useGridBreakpoint()

  useEffect(() => setMounted(true), [])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2147483647,
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
      aria-hidden
    >
      <div
        className="lab-grid-overlay"
        style={{
          width: '100%',
          maxWidth: gridMaxWidth ?? '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 'var(--ds-grid-gutter)',
          paddingLeft: 'var(--ds-grid-margin)',
          paddingRight: 'var(--ds-grid-margin)',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255, 0, 0, 0.2)',
              minHeight: '100vh',
            }}
          />
        ))}
      </div>
    </div>,
    document.body
  )
}
