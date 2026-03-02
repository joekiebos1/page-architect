'use client'

import { Headline, Text, Card, CardHeader, CardBody, SurfaceProvider } from '@marcelinodzn/ds-react'
import { GridBlock, useGridCell } from '../components/GridBlock'
import { BlockReveal } from './BlockReveal'
import { getHeadlineSize, getHeadlineFontSize, getChildLevel, normalizeHeadingLevel, type HeadingLevel } from '../lib/semantic-headline'

type FeatureItem = {
  title?: string | null
  description?: string | null
}

type FeatureGridBlockProps = {
  title?: string | null
  titleLevel?: HeadingLevel
  items?: FeatureItem[] | null
}

export function FeatureGridBlock({ title, titleLevel = 'h2', items }: FeatureGridBlockProps) {
  const level = normalizeHeadingLevel(titleLevel)
  const itemLevel = getChildLevel(level)
  const cell = useGridCell()
  return (
    <BlockReveal>
    <SurfaceProvider level={0}>
      <GridBlock as="section">
        <div style={{ ...cell, display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-xl)' }}>
          {title && (
            <Headline size={getHeadlineSize(level)} weight="high" as={level} align="center" style={{ margin: 0, fontSize: getHeadlineFontSize(level) }}>
              {title}
            </Headline>
          )}
          <div className="feature-grid-block-grid" data-item-count={items?.length ?? 0}>
            {items?.map((item, i) => (
              <Card key={i} size="M" surface="minimal" appearance="neutral">
                <CardHeader>
                  {item.title && <Headline size={getHeadlineSize(itemLevel)} weight="high" as={itemLevel} style={{ fontSize: getHeadlineFontSize(itemLevel) }}>{item.title}</Headline>}
                </CardHeader>
                <CardBody>
                  {item.description && <Text size="M" weight="medium" color="medium" as="p">{item.description}</Text>}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </GridBlock>
    </SurfaceProvider>
    </BlockReveal>
  )
}
