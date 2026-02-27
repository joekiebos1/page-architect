'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Headline, Text, Button, SurfaceProvider } from '@marcelinodzn/ds-react'
import { BlockContainer } from './BlockContainer'

const ASPECT_RATIOS: Record<string, string> = {
  '16:7': '16 / 7',   // 1440×630 – Open Graph / social standard
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '3:4': '3 / 4',
  '1:1': '1 / 1',
  '21:9': '21 / 9',
}

type TextImageBlockProps = {
  title?: string | null
  body?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  image?: string | null
  template?: 'SideBySide' | 'SideBySideNarrow' | 'SideBySideWide' | 'HeroOverlay' | 'Stacked'
  imagePosition?: 'left' | 'right'
  overlayAlignment?: 'left' | 'center' | 'right'
  stackImagePosition?: 'top' | 'bottom'
  stackAlignment?: 'left' | 'center'
  imageAspectRatio?: '16:7' | '16:9' | '4:3' | '3:4' | '1:1' | '21:9'
}

export function TextImageBlock({
  title,
  body,
  ctaText,
  ctaLink,
  image,
  template = 'SideBySide',
  imagePosition = 'right',
  overlayAlignment = 'left',
  stackImagePosition = 'top',
  stackAlignment = 'left',
  imageAspectRatio,
}: TextImageBlockProps) {
  const router = useRouter()
  const t = template as string | undefined
  const normalizedTemplate = (t === 'sideBySide' ? 'SideBySide' : t === 'fullBleedHero' ? 'HeroOverlay' : t === 'imageAbove' || t === 'textAbove' ? 'Stacked' : t === 'narrowImage' ? 'SideBySideNarrow' : t === 'wideImage' ? 'SideBySideWide' : t) as TextImageBlockProps['template']
  const template_ = normalizedTemplate ?? 'SideBySide'
  const stackImagePosition_ = t === 'textAbove' ? 'bottom' : (stackImagePosition ?? 'top')
  const isFullWidth = template_ === 'HeroOverlay' || template_ === 'Stacked'
  const fullWidthRatios = ['16:7', '16:9', '21:9']
  const fiftyFiftyRatios = ['4:3', '3:4', '1:1']
  const validRatios = isFullWidth ? fullWidthRatios : fiftyFiftyRatios
  const ratio = imageAspectRatio && validRatios.includes(imageAspectRatio) ? imageAspectRatio : (isFullWidth ? '16:7' : '4:3')
  const aspectRatio = ASPECT_RATIOS[ratio]
  const isImageRight = imagePosition !== 'left'

  const handleCtaPress = (href: string) => {
    if (href.startsWith('/')) router.push(href)
    else window.location.href = href
  }

  const contentAlign = template_ === 'Stacked' ? stackAlignment : 'left'
  const textAlign = contentAlign === 'center' ? 'center' : 'left'
  const alignItems = contentAlign === 'center' ? 'center' : 'flex-start'

  const textContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-m)', alignItems, textAlign }}>
      {title && <Headline size="M" weight="high" as="h2" color="high" align={contentAlign} style={{ lineHeight: 1.25, margin: 0, fontSize: 'var(--ds-typography-headline-m)' }}>{title}</Headline>}
      {body && <Text size="S" weight="low" color="low" as="p" align={contentAlign} style={{ margin: 0, maxWidth: '65ch' }}>{body}</Text>}
      {ctaText && ctaLink && (
        <Button appearance="secondary" size="S" attention="medium" onPress={() => handleCtaPress(ctaLink)}>{ctaText}</Button>
      )}
    </div>
  )

  const imageEl = image && (
    <div style={{ position: 'relative', width: '100%', aspectRatio, borderRadius: 'var(--ds-radius-card)', overflow: 'hidden' }}>
      <Image src={image} alt={title || ''} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
    </div>
  )

  if (template_ === 'HeroOverlay' && image) {
    return (
      <SurfaceProvider level={0} hasBoldBackground>
        <section style={{ position: 'relative', width: '100%', aspectRatio, overflow: 'hidden' }}>
          <Image src={image} alt={title || ''} fill style={{ objectFit: 'cover' }} sizes="100vw" />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'var(--ds-spacing-2xl)',
              paddingInline: 'var(--ds-spacing-l)',
              alignItems: overlayAlignment === 'center' ? 'center' : overlayAlignment === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-m)', textAlign: overlayAlignment }}>
              {title && <Headline size="M" weight="high" as="h2" color="on-bold-high" style={{ lineHeight: 1.25, margin: 0, fontSize: 'var(--ds-typography-headline-m)' }}>{title}</Headline>}
              {body && <Text size="S" weight="low" as="p" style={{ margin: 0, maxWidth: '65ch', color: 'rgba(255,255,255,0.9)' }}>{body}</Text>}
              {ctaText && ctaLink && (
                <Link href={ctaLink} style={{ color: 'white', fontWeight: 'var(--ds-typography-weight-high)', fontSize: 'var(--ds-typography-label-m)', textDecoration: 'none' }}>
                  {ctaText} →
                </Link>
              )}
            </div>
          </div>
        </section>
      </SurfaceProvider>
    )
  }

  if (template_ === 'Stacked' && image) {
    const imageFirst = stackImagePosition_ === 'top'
    return (
      <SurfaceProvider level={0}>
        <BlockContainer as="section" style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-xl)', alignItems: contentAlign === 'center' ? 'center' : 'stretch' }}>
            {imageFirst ? (
              <>
                {imageEl}
                <div style={{ maxWidth: '65ch', width: '100%' }}>{textContent}</div>
              </>
            ) : (
              <>
                <div style={{ maxWidth: '65ch', width: '100%' }}>{textContent}</div>
                {imageEl}
              </>
            )}
          </div>
        </BlockContainer>
      </SurfaceProvider>
    )
  }

  const isNarrow = template_ === 'SideBySideNarrow'
  const gridCols = isNarrow ? (isImageRight ? '2fr 1fr' : '1fr 2fr') : (isImageRight ? '1fr 2fr' : '2fr 1fr')

  if ((template_ === 'SideBySideNarrow' || template_ === 'SideBySideWide') && image) {
    return (
      <SurfaceProvider level={0}>
        <BlockContainer as="section" style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 'var(--ds-spacing-xl)', alignItems: 'center' }}>
            <div style={{ order: isImageRight ? 1 : 2 }}>{textContent}</div>
            <div style={{ order: isImageRight ? 2 : 1 }}>{imageEl}</div>
          </div>
        </BlockContainer>
      </SurfaceProvider>
    )
  }

  return (
    <SurfaceProvider level={0}>
      <BlockContainer as="section" style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: image ? '1fr 1fr' : '1fr',
            gap: 'var(--ds-spacing-xl)',
            alignItems: 'center',
          }}
        >
          {image && !isImageRight && <div style={{ order: 1 }}>{imageEl}</div>}
          <div style={{ order: isImageRight ? 1 : 2 }}>{textContent}</div>
          {image && isImageRight && <div style={{ order: 2 }}>{imageEl}</div>}
        </div>
      </BlockContainer>
    </SurfaceProvider>
  )
}
