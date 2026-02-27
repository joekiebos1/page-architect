'use client'

import { Headline, Text, Icon, SurfaceProvider } from '@marcelinodzn/ds-react'
import { BlockContainer } from './BlockContainer'
import { getProofPointIcon } from '@/lib/proof-point-icons'

const DEFAULT_ICON_NAME = 'IcCheckboxOn'

type ProofPointItem = {
  title?: string | null
  description?: string | null
  icon?: string | null
}

type ProofPointsBlockProps = {
  title?: string | null
  items?: ProofPointItem[] | null
}

function ProofPointCard({ item }: { item: ProofPointItem }) {
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
        <Headline size="S" weight="high" as="h3" style={{ margin: 0 }}>
          {item.title}
        </Headline>
      )}
      {item.description && (
        <Text size="S" weight="low" color="low" as="p" style={{ margin: 0 }}>
          {item.description}
        </Text>
      )}
    </div>
  )
}

export function ProofPointsBlock({ title, items }: ProofPointsBlockProps) {
  const items_ = items?.filter((i) => i?.title) ?? []
  if (items_.length === 0) return null

  return (
    <SurfaceProvider level={0}>
      <BlockContainer as="section" style={{ paddingBlock: 'var(--ds-spacing-xl)' }}>
        {title && (
          <Headline
            size="M"
            weight="high"
            as="h2"
            align="center"
            style={{ marginBottom: 'var(--ds-spacing-l)' }}
          >
            {title}
          </Headline>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(calc(var(--ds-spacing-s) * 12), 1fr))',
            gap: 'var(--ds-spacing-m)',
            alignItems: 'stretch',
          }}
        >
          {items_.map((item, i) => (
            <ProofPointCard key={i} item={item} />
          ))}
        </div>
      </BlockContainer>
    </SurfaceProvider>
  )
}
