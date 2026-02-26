'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Display,
  Text,
  SurfaceProvider,
} from '@marcelinodzn/ds-react'

type TextImageBlockProps = {
  title?: string | null
  body?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  image?: string | null
  imagePosition?: 'left' | 'right' | null
}

export function TextImageBlock({ title, body, ctaText, ctaLink, image, imagePosition }: TextImageBlockProps) {
  const isImageRight = imagePosition !== 'left'

  return (
    <SurfaceProvider level={0}>
      <section
        className="ds-container"
        style={{
          paddingBlock: 'var(--ds-spacing-2xl)',
        }}
      >
        <div
          className="text-image-block-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: image ? '1fr 1fr' : '1fr',
            gap: 'var(--ds-spacing-3xl)',
            alignItems: 'center',
          }}
        >
          {image && !isImageRight && (
            <div style={{ order: 1 }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: 'var(--ds-spacing-m)',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={image}
                  alt={title || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
          <div
            style={{
              order: isImageRight ? 1 : 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--ds-spacing-m)',
            }}
          >
            {title && (
              <Display size="L" as="h2" color="high" style={{ lineHeight: 1.2 }}>
                {title}
              </Display>
            )}
            {body && (
              <Text size="L" weight="medium" color="medium" as="p" style={{ maxWidth: '32ch' }}>
                {body}
              </Text>
            )}
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                style={{
                  color: 'var(--ds-color-surface-bold)',
                  fontWeight: 'var(--ds-typography-weight-high)',
                  textDecoration: 'none',
                  fontSize: 'var(--ds-typography-label-m)',
                  alignSelf: 'flex-start',
                }}
              >
                {ctaText} →
              </Link>
            )}
          </div>
          {image && isImageRight && (
            <div style={{ order: 2 }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: 'var(--ds-spacing-m)',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={image}
                  alt={title || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </SurfaceProvider>
  )
}
