'use client'

import { Headline, Text, Card, CardHeader, CardBody, SurfaceProvider } from '@marcelinodzn/ds-react'
import { BlockContainer } from './BlockContainer'

type FeatureItem = {
  title?: string | null
  description?: string | null
}

type FeatureGridBlockProps = {
  title?: string | null
  items?: FeatureItem[] | null
}

export function FeatureGridBlock({ title, items }: FeatureGridBlockProps) {
  return (
    <SurfaceProvider level={0}>
      <BlockContainer as="section" style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
        {title && (
          <Headline size="M" weight="high" as="h2" align="center" style={{ marginBottom: 'var(--ds-spacing-xl)' }}>
            {title}
          </Headline>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(calc(var(--ds-spacing-s) * 15), 1fr))',
            gap: 'var(--ds-spacing-xl)',
          }}
        >
          {items?.map((item, i) => (
            <Card key={i} size="M" surface="minimal" appearance="neutral">
              <CardHeader>
                {item.title && <Headline size="S" weight="high" as="h3">{item.title}</Headline>}
              </CardHeader>
              <CardBody>
                {item.description && <Text size="M" weight="medium" color="medium" as="p">{item.description}</Text>}
              </CardBody>
            </Card>
          ))}
        </div>
      </BlockContainer>
    </SurfaceProvider>
  )
}
