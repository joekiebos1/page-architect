'use client'

import { useRouter } from 'next/navigation'
import {
  Headline,
  Text,
  Label,
  Card,
  CardBody,
} from '@marcelinodzn/ds-react'
import { GridBlock } from '../../components/GridBlock'
import { useGridBreakpoint } from '../../lib/use-grid-breakpoint'
import { BLOCK_CATALOGUE, type BlockCatalogueEntry } from './block-catalogue'

function BlockCard({
  entry,
  gridColumn,
}: {
  entry: BlockCatalogueEntry
  gridColumn: string
}) {
  const router = useRouter()
  const href = `/lab/${entry.labSlug}`

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(href)
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View ${entry.name} in Lab`}
      style={{ gridColumn, cursor: 'pointer' }}
    >
      <Card size="M" surface="default" isPressable={false}>
        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-s)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', minHeight: 180, pointerEvents: 'none' }}>
            <entry.Preview />
          </div>
          <Headline size="XS" weight="low" as="h3" color="high" style={{ margin: 0 }}>
            {entry.name}
          </Headline>
          {entry.tier === 'lab' && (
            <Label size="XS" weight="low" color="low" as="span">
              Lab
            </Label>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default function BlockInspirationPage() {
  const { columns } = useGridBreakpoint()
  // 4 per row on desktop (12 cols), 2 per row on tablet (6 cols), 1 per row on mobile (4 cols)
  const span = columns >= 12 ? 3 : columns >= 6 ? 3 : 4

  return (
    <GridBlock as="main" style={{ gap: 0, paddingBlock: 'var(--ds-spacing-2xl)', alignContent: 'start', height: '100%', minHeight: 0, overflowY: 'auto' }}>
      <div style={{ gridColumn: '1 / -1', marginBottom: 'var(--ds-spacing-xl)' }}>
        <Headline level={2} weight="low" color="high" style={{ margin: 0, marginBottom: 'var(--ds-spacing-s)' }}>
          Block Inspiration
        </Headline>
        <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, lineHeight: 1.5 }}>
          Browse all blocks. Click a block to view variants and examples in the Lab.
        </Text>
      </div>

      {BLOCK_CATALOGUE.map((entry) => (
        <BlockCard
          key={entry.id}
          entry={entry}
          gridColumn={`span ${span}`}
        />
      ))}
    </GridBlock>
  )
}
