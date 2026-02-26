'use client'

import {
  Headline,
  Text,
  Image,
  SurfaceProvider,
  useDsContext,
} from '@marcelinodzn/ds-react'
import { spacing } from '@marcelinodzn/ds-tokens'

type TextImageBlockProps = {
  title?: string | null
  body?: string | null
  image?: string | null
  imagePosition?: 'left' | 'right' | null
}

export function TextImageBlock({ title, body, image, imagePosition }: TextImageBlockProps) {
  const { tokenContext } = useDsContext()
  const isImageLeft = imagePosition === 'left'

  const sectionPadding = tokenContext ? spacing.get('3XL', tokenContext) : 48
  const sectionPaddingX = tokenContext ? spacing.get('L', tokenContext) : 32
  const gridGap = tokenContext ? spacing.get('2XL', tokenContext) : 32
  const titleGap = tokenContext ? spacing.get('M', tokenContext) : 24

  return (
    <SurfaceProvider level={0}>
      <section
        style={{
          padding: `${sectionPadding ?? 48}px ${sectionPaddingX ?? 32}px`,
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: image ? '1fr 1fr' : '1fr',
            gap: `${gridGap ?? 32}px`,
            alignItems: 'center',
          }}
        >
          {image && isImageLeft && (
            <div style={{ order: 1 }}>
              <Image src={image} alt={title || ''} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            </div>
          )}
          <div style={{ order: isImageLeft ? 2 : 1 }}>
            {title && (
              <Headline size="M" weight="high" as="h2" style={{ marginBottom: `${titleGap ?? 24}px` }}>
                {title}
              </Headline>
            )}
            {body && (
              <Text size="L" weight="medium" color="medium" as="p" style={{ lineHeight: 1.6 }}>
                {body}
              </Text>
            )}
          </div>
          {image && !isImageLeft && (
            <div style={{ order: 2 }}>
              <Image src={image} alt={title || ''} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            </div>
          )}
        </div>
      </section>
    </SurfaceProvider>
  )
}
