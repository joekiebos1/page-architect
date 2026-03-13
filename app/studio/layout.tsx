import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--ds-color-background-ghost)' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          paddingBlock: 'var(--ds-spacing-s)',
          paddingInline: 'var(--ds-spacing-m)',
          borderBottom: '1px solid var(--ds-color-stroke-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 'var(--ds-typography-weight-high)',
            color: 'var(--ds-color-text-high)',
            textDecoration: 'none',
            fontSize: 'var(--ds-typography-label-m)',
          }}
        >
          Page Architect
        </Link>
        <nav style={{ display: 'flex', gap: 'var(--ds-spacing-m)' }}>
          <Link
            href="/studio/story-coach"
            style={{
              color: 'var(--ds-color-text-medium)',
              textDecoration: 'none',
              fontSize: 'var(--ds-typography-label-s)',
            }}
          >
            Story Coach
          </Link>
          <Link
            href="/jiokarna"
            style={{
              color: 'var(--ds-color-text-medium)',
              textDecoration: 'none',
              fontSize: 'var(--ds-typography-label-s)',
            }}
          >
            JioKarna
          </Link>
        </nav>
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  )
}
