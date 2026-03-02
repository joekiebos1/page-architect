'use client'

import { Headline, Text, Icon, SurfaceProvider } from '@marcelinodzn/ds-react'
import { GridBlock, useGridCell } from '../components/GridBlock'
import { BlockReveal } from './BlockReveal'
import { getProofPointIcon } from '@/lib/proof-point-icons'
import { getHeadlineSize, getHeadlineFontSize, getHeadlineFontSizeOneStepDown, getChildLevel, normalizeHeadingLevel, type HeadingLevel } from '../lib/semantic-headline'

const DEFAULT_ICON_NAME = 'IcCheckboxOn'

type ProofPointItem = {
  title?: string | null
  description?: string | null
  icon?: string | null
}

type ProofPointsBlockProps = {
  title?: string | null
  titleLevel?: HeadingLevel
  items?: ProofPointItem[] | null
}

function ProofPointCard({ item, itemLevel }: { item: ProofPointItem; itemLevel: HeadingLevel }) {
  const iconName = item.icon || DEFAULT_ICON_NAME
  const IconAsset = getProofPointIcon(iconName)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--ds-spacing-s)',
        textAlign: 'center',
        padding: 'var(--ds-spacing-m)',
      }}
    >
      <Icon asset={<IconAsset />} size="L" appearance="secondary" attention="high" tinted />
      {item.title && (
        <Headline size={getHeadlineSize(getChildLevel(itemLevel))} weight="high" as={itemLevel} style={{ margin: 0, fontSize: getHeadlineFontSizeOneStepDown(itemLevel) }}>
          {item.title}
        </Headline>
      )}
      {item.description && (
        <Text size="XS" weight="low" color="low" as="p" style={{ margin: 0 }}>
          {item.description}
        </Text>
      )}
    </div>
  )
}

export function ProofPointsBlock({ title, titleLevel = 'h2', items }: ProofPointsBlockProps) {
  const level = normalizeHeadingLevel(titleLevel)
  const items_ = items?.filter((i) => i?.title) ?? []
  const itemLevel = getChildLevel(level)
  const cell = useGridCell()
  if (items_.length === 0) return null

  return (
    <BlockReveal>
    <SurfaceProvider level={0}>
      <GridBlock as="section">
        <div style={{ ...cell, display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)' }}>
          {title && (
            <Headline
              size={getHeadlineSize(level)}
              weight="high"
              as={level}
              align="center"
              style={{ margin: 0, fontSize: getHeadlineFontSize(level) }}
            >
              {title}
            </Headline>
          )}
          <div className="proof-points-grid" style={{ alignItems: 'stretch' }}>
            {items_.map((item, i) => (
              <ProofPointCard key={i} item={item} itemLevel={itemLevel} />
            ))}
          </div>
        </div>
      </GridBlock>
    </SurfaceProvider>
    </BlockReveal>
  )
}
