'use client'

/**
 * Lab – Top nav preview page.
 * Dedicated page to test and preview the TopNavBlock (mega menu).
 * URL: /lab/top-nav
 */

import { DsProvider } from '@marcelinodzn/ds-react'
import { TopNavBlock } from '../blocks'
import Link from 'next/link'

export default function LabTopNavPage() {
  return (
    <DsProvider platform="Desktop (1440)" colorMode="Light" density="Default" theme="MyJio">
      <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <TopNavBlock />
        <main className="ds-container" style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
        <div style={{ marginBottom: 'var(--ds-spacing-3xl)' }}>
          <Link
            href="/lab"
            style={{
              fontSize: 'var(--ds-typography-body-xs)',
              color: 'var(--ds-color-text-low)',
              textDecoration: 'none',
              marginBottom: 'var(--ds-spacing-m)',
              display: 'inline-block',
            }}
          >
            ← Back to Lab
          </Link>
          <h1
            style={{
              fontSize: 'var(--ds-typography-h2)',
              fontWeight: 'var(--ds-typography-weight-high)',
              marginBottom: 'var(--ds-spacing-m)',
            }}
          >
            Top nav (mega menu)
          </h1>
          <p
            style={{
              fontSize: 'var(--ds-typography-body-m)',
              color: 'var(--ds-color-text-low)',
              margin: 0,
            }}
          >
            L1 click to open, L2/L3 hover/click, click-outside to close. Mobile Apps &amp; Services
            expand, Business L2 → L3 → L4/L5 product listings.
          </p>
        </div>
        <p
          style={{
            fontSize: 'var(--ds-typography-body-s)',
            color: 'var(--ds-color-text-medium)',
            margin: 0,
          }}
        >
          The mega menu is rendered above. Use the nav items to explore the dropdown behaviour.
        </p>
      </main>
      </div>
    </DsProvider>
  )
}
