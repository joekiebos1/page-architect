'use client'

/**
 * Lab block detail – renders one block type with all layout variants stacked.
 * URL: /lab/[block-slug]. Data from Sanity (labBlockPage sections).
 *
 * No page-level Grid — blocks own their layout. Simple container with padding.
 */

import Link from 'next/link'
import { LAB_TYPOGRAPHY_VARS } from '../../../lib/typography/block-typography'
import { LabBlockRenderer, getBlockLayoutTitle } from '../LabBlockRenderer'

type LabBlockDetailClientProps = {
  title: string
  blocks: unknown[]
}

export function LabBlockDetailClient({ title, blocks }: LabBlockDetailClientProps) {
  const blockList = Array.isArray(blocks) ? blocks : []
  const variantLabels = blockList.map((b) =>
    getBlockLayoutTitle(b as { _type: string; _key?: string; [key: string]: unknown })
  )

  return (
    <main style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
      <div className="ds-container" style={{ marginBottom: 'var(--ds-spacing-3xl)' }}>
        <Link
          href="/lab"
          style={{
            fontSize: LAB_TYPOGRAPHY_VARS.bodyXs,
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
            fontSize: LAB_TYPOGRAPHY_VARS.h2,
            fontWeight: LAB_TYPOGRAPHY_VARS.weightHigh,
            marginBottom: 'var(--ds-spacing-m)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: LAB_TYPOGRAPHY_VARS.bodyM,
            color: 'var(--ds-color-text-low)',
            margin: 0,
          }}
        >
          {blockList.length} layout variant{blockList.length !== 1 ? 's' : ''}
        </p>
      </div>
      <LabBlockRenderer blocks={blockList as { _type: string; _key?: string; [key: string]: unknown }[]} variantLabels={variantLabels} />
    </main>
  )
}
