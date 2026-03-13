'use client'

/**
 * Lab – Overview page. Renders sections from Sanity (labOverview).
 * Uses List block for the block links. Links open in new tab.
 */

import { DsProvider } from '@marcelinodzn/ds-react'
import { TopNavBlock } from './blocks'
import { LabBlockRenderer } from './LabBlockRenderer'

type LabPageClientProps = {
  sections: unknown[]
}

const TOP_NAV_LIST_ITEM = {
  _type: 'listItem' as const,
  _key: 'top-nav',
  subtitle: 'Top nav (mega menu)',
  linkUrl: '/lab/top-nav',
}

function ensureTopNavInBlockList(
  sections: unknown[]
): { _type: string; _key?: string; [key: string]: unknown }[] {
  const blocks = sections as { _type: string; _key?: string; listVariant?: string; items?: unknown[] }[]
  const firstList = blocks.find((b) => b._type === 'list' && b.listVariant === 'links')
  if (!firstList || !Array.isArray(firstList.items)) return blocks as { _type: string; _key?: string; [key: string]: unknown }[]
  const hasTopNav = firstList.items.some(
    (i) => (i as { linkUrl?: string })?.linkUrl === '/lab/top-nav'
  )
  if (hasTopNav) return blocks as { _type: string; _key?: string; [key: string]: unknown }[]
  return blocks.map((b) => {
    if (b._type === 'list' && b.listVariant === 'links' && Array.isArray(b.items)) {
      return { ...b, items: [TOP_NAV_LIST_ITEM, ...b.items] }
    }
    return b
  }) as { _type: string; _key?: string; [key: string]: unknown }[]
}

export function LabPageClient({ sections }: LabPageClientProps) {
  const rawBlocks = Array.isArray(sections) ? sections : []
  const blocks = ensureTopNavInBlockList(rawBlocks)

  return (
    <DsProvider platform="Desktop (1440)" colorMode="Light" density="Default" theme="MyJio">
      <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <TopNavBlock />
        <main style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
        <LabBlockRenderer
          blocks={blocks as { _type: string; _key?: string; [key: string]: unknown }[]}
          clean
          listBlockOpenLinksInNewTab
        />
      </main>
      </div>
    </DsProvider>
  )
}
