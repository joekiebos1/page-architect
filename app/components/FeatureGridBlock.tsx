'use client'

import {
  Headline,
  Text,
  Card,
  CardHeader,
  CardBody,
  SurfaceProvider,
  useDsContext,
} from '@marcelinodzn/ds-react'
import { spacing } from '@marcelinodzn/ds-tokens'

type FeatureItem = {
  title?: string | null
  description?: string | null
}

type FeatureGridBlockProps = {
  title?: string | null
  items?: FeatureItem[] | null
}

export function FeatureGridBlock({ title, items }: FeatureGridBlockProps) {
  const { tokenContext } = useDsContext()
  const sectionPadding = tokenContext ? spacing.get('3XL', tokenContext) : 48
  const sectionPaddingX = tokenContext ? spacing.get('L', tokenContext) : 32
  const titleGap = tokenContext ? spacing.get('2XL', tokenContext) : 32
  const gridGap = tokenContext ? spacing.get('2XL', tokenContext) : 32

  return (
    <SurfaceProvider level={0}>
      <section
        style={{
          padding: `${sectionPadding ?? 48}px ${sectionPaddingX ?? 32}px`,
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        {title && (
          <Headline
            size="M"
            weight="high"
            as="h2"
            align="center"
            style={{ marginBottom: `${titleGap ?? 32}px` }}
          >
            {title}
          </Headline>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: `${gridGap ?? 32}px`,
          }}
        >
          {items?.map((item, i) => (
            <Card key={i} size="M" surface="minimal" appearance="neutral">
              <CardHeader>
                {item.title && (
                  <Headline size="S" weight="high" as="h3">
                    {item.title}
                  </Headline>
                )}
              </CardHeader>
              <CardBody>
                {item.description && (
                  <Text size="M" weight="medium" color="medium" as="p" style={{ lineHeight: 1.5 }}>
                    {item.description}
                  </Text>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </SurfaceProvider>
  )
}
