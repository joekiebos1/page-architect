'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Display,
  Headline,
  Title,
  Text,
  Label,
  Button,
  SurfaceProvider,
} from '@marcelinodzn/ds-react'
import { GridBlock, useGridCell } from '../../components/GridBlock'
import { BlockContainer } from '../BlockContainer'
import { BlockReveal } from '../BlockReveal'
import { VideoWithControls } from '../../components/VideoWithControls'
import { getHeadlineFontSize, getHeadlineFontSizeOneStepUp } from '../../lib/semantic-headline'
import type { MediaTextBlockProps, MediaTextBlockSize } from './MediaTextBlock.types'

const ASPECT_RATIOS: Record<string, string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '1:1': '1 / 1',
  '3:4': '3 / 4',
  auto: 'auto',
}

const SIZE_PADDING: Record<MediaTextBlockSize, string> = {
  hero: 'var(--ds-spacing-4xl)',
  feature: 'var(--ds-spacing-3xl)',
  editorial: 'var(--ds-spacing-2xl)',
}

function getSurfaceProps(surface: MediaTextBlockProps['surface'], isFullBleed: boolean) {
  if (isFullBleed) return { level: 1 as const, hasBoldBackground: true }
  switch (surface) {
    case 'minimal':
    case 'subtle':
      return { level: 1 as const, hasBoldBackground: false }
    case 'bold':
      return { level: 1 as const, hasBoldBackground: true }
    default:
      return { level: 0 as const, hasBoldBackground: false }
  }
}

export function MediaTextBlock({
  size = 'feature',
  variant = 'media-right',
  width = 'default',
  surface = 'ghost',
  align,
  eyebrow,
  headline,
  subhead,
  body,
  bulletList = [],
  cta,
  ctaSecondary,
  media,
}: MediaTextBlockProps) {
  const router = useRouter()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const hasMedia = media?.src && media.src.trim() !== ''
  const isNarrow = width === 'narrow'
  const isFullBleed = variant === 'full-bleed'
  const surfaceProps = getSurfaceProps(surface, isFullBleed)

  const handleCtaPress = (href: string) => {
    if (href.startsWith('/')) router.push(href)
    else window.location.href = href
  }

  const bullets = bulletList.slice(0, 6)

  const derivedCentered =
    isNarrow ||
    variant === 'centered-media-below' ||
    variant === 'text-only' ||
    !hasMedia
  const textAlign = align ?? (derivedCentered ? 'center' : 'left')

  const titleContent = (
    <BlockContainer contentWidth="narrow" style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-spacing-l)',
          alignItems: textAlign === 'center' ? 'center' : 'flex-start',
          textAlign,
          width: '100%',
        }}
      >
        {eyebrow && (
          <Label size="S" appearance="secondary">
            {eyebrow}
          </Label>
        )}
        {size === 'hero' && <Display as="h1" style={{ textAlign }}>{headline}</Display>}
        {size === 'feature' && (
          <Headline
            size="L"
            weight="high"
            as="h2"
            style={{
              fontSize:
                textAlign === 'center' || variant === 'full-bleed'
                  ? getHeadlineFontSizeOneStepUp('h2')
                  : getHeadlineFontSize('h2'),
              textAlign,
            }}
          >
            {headline}
          </Headline>
        )}
        {size === 'editorial' && <Title level={2} style={{ textAlign }}>{headline}</Title>}
        {size !== 'hero' && subhead && <Title level={3} style={{ textAlign }}>{subhead}</Title>}
      </div>
    </BlockContainer>
  )

  const bodyContent =
    (size !== 'hero' && (body || bullets.length > 0)) || (cta || ctaSecondary) ? (
      <BlockContainer contentWidth="editorial" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-spacing-l)',
            alignItems: textAlign === 'center' ? 'center' : 'flex-start',
            textAlign,
            width: '100%',
          }}
        >
          {size !== 'hero' && body && (
            <Text size="M" as="p" style={{ color: 'var(--ds-color-text-medium)', textAlign }}>
              {body}
            </Text>
          )}
          {size !== 'hero' && bullets.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: textAlign === 'center' ? 0 : 'var(--ds-spacing-l)', listStyle: 'disc', listStylePosition: textAlign === 'center' ? 'inside' : 'outside', textAlign }}>
              {bullets.map((item, i) => (
                <li key={i} style={{ marginBottom: i < bullets.length - 1 ? 'var(--ds-spacing-xs)' : 0 }}>
                  <Text size="M" as="span" style={{ color: 'var(--ds-color-text-medium)' }}>{item}</Text>
                </li>
              ))}
            </ul>
          )}
          {(cta || ctaSecondary) && (
            <div style={{ display: 'flex', gap: 'var(--ds-spacing-s)', flexWrap: 'wrap', marginTop: 'var(--ds-spacing-m)' }}>
              {cta && (
                <Button
                  appearance={cta.appearance ?? 'primary'}
                  size="M"
                  onPress={() => handleCtaPress(cta.href)}
                >
                  {cta.label}
                </Button>
              )}
              {ctaSecondary && (
                <Button appearance="ghost" size="M" onPress={() => handleCtaPress(ctaSecondary.href)}>
                  {ctaSecondary.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </BlockContainer>
    ) : null

  const textContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)', alignItems: textAlign === 'center' ? 'center' : 'flex-start' }}>
      {titleContent}
      {bodyContent}
    </div>
  )

  const mediaContent = hasMedia && media && (() => {
    const ratio = media.aspectRatio ?? '16:9'
    const aspectRatio = ASPECT_RATIOS[ratio] ?? '16 / 9'
    const isVideo = media.type === 'video'

    if (isVideo) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: ratio === 'auto' ? undefined : aspectRatio, overflow: 'hidden', borderRadius: 'var(--ds-radius-card-m)' }}>
          <VideoWithControls
            src={media.src}
            poster={media.poster}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      )
    }

    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: ratio === 'auto' ? undefined : aspectRatio, overflow: 'hidden', borderRadius: 'var(--ds-radius-card)' }}>
        <Image
          src={media.src}
          alt={media.alt ?? ''}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    )
  })()

  const paddingBlock = SIZE_PADDING[size]
  const cellMedia = useGridCell('default')

  if (isNarrow) {
    return (
      <BlockReveal>
      <SurfaceProvider {...surfaceProps}>
        <GridBlock as="section">
          <div style={{ ...cellMedia, paddingBlock, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--ds-spacing-2xl)' }}>
            {titleContent}
            <BlockContainer contentWidth="default" style={{ width: '100%' }}>
              {mediaContent}
            </BlockContainer>
            {bodyContent}
          </div>
        </GridBlock>
      </SurfaceProvider>
      </BlockReveal>
    )
  }

  if (variant === 'full-bleed' && hasMedia && media) {
    const ratio = media.aspectRatio ?? '16:9'
    const aspectRatio = ASPECT_RATIOS[ratio] ?? '16 / 9'
    const isVideo = media.type === 'video'
    return (
      <BlockReveal>
      <SurfaceProvider level={1} hasBoldBackground>
        <section style={{ position: 'relative', width: '100%', aspectRatio, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {isVideo ? (
              <VideoWithControls
                src={media.src}
                poster={media.poster}
                prefersReducedMotion={prefersReducedMotion}
              />
            ) : (
              <Image src={media.src} alt={media.alt ?? ''} fill style={{ objectFit: 'cover' }} sizes="100vw" />
            )}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--ds-color-overlay-dark) 0%, transparent 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'var(--ds-spacing-3xl)',
              paddingInline: 'var(--ds-grid-margin)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)', alignItems: 'center' }}>
              {textContent}
            </div>
          </div>
        </section>
      </SurfaceProvider>
      </BlockReveal>
    )
  }

  if (variant === 'text-only') {
    return (
      <BlockReveal>
      <SurfaceProvider {...surfaceProps}>
        <GridBlock as="section">
          <div style={{ ...cellMedia, paddingBlock, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--ds-spacing-l)' }}>
            {titleContent}
            {bodyContent}
          </div>
        </GridBlock>
      </SurfaceProvider>
      </BlockReveal>
    )
  }

  if (variant === 'centered-media-below' && hasMedia) {
    const isEdgeToEdge = width === 'edgeToEdge'
    return (
      <BlockReveal>
      <SurfaceProvider {...surfaceProps}>
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--ds-spacing-2xl)',
          }}
        >
          <GridBlock as="div">
            <div
              style={{
                ...cellMedia,
                paddingBlock,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--ds-spacing-2xl)',
              }}
            >
              {titleContent}
              {bodyContent}
            </div>
          </GridBlock>
          {isEdgeToEdge ? (
            <div
              style={{
                width: '100vw',
                position: 'relative' as const,
                left: 0,
                marginLeft: 0,
                paddingLeft: 0,
                boxSizing: 'border-box',
                alignSelf: 'flex-start',
              }}
            >
              {mediaContent}
            </div>
          ) : (
            <BlockContainer contentWidth="default" style={{ width: '100%' }}>
              {mediaContent}
            </BlockContainer>
          )}
        </section>
      </SurfaceProvider>
      </BlockReveal>
    )
  }

  if ((variant === 'media-right' || variant === 'media-left') && hasMedia) {
    const mediaFirst = variant === 'media-left'
    return (
      <BlockReveal>
      <SurfaceProvider {...surfaceProps}>
        <GridBlock as="section">
          <div
            style={{
              ...cellMedia,
              paddingBlock,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--ds-spacing-2xl)',
              alignItems: 'center',
            }}
          >
            {mediaFirst ? (
              <>
                <BlockContainer contentWidth="default" style={{ width: '100%' }}>{mediaContent}</BlockContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)', alignItems: textAlign === 'center' ? 'center' : 'flex-start' }}>{titleContent}{bodyContent}</div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)', alignItems: textAlign === 'center' ? 'center' : 'flex-start' }}>{titleContent}{bodyContent}</div>
                <BlockContainer contentWidth="default" style={{ width: '100%' }}>{mediaContent}</BlockContainer>
              </>
            )}
          </div>
        </GridBlock>
      </SurfaceProvider>
      </BlockReveal>
    )
  }

  if (variant === 'split' && hasMedia) {
    return (
      <BlockReveal>
      <SurfaceProvider {...surfaceProps}>
        <GridBlock as="section">
          <div
            style={{
              ...cellMedia,
              paddingBlock: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              minHeight: 0,
            }}
          >
            <div style={{ padding: paddingBlock, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--ds-spacing-l)' }}>{titleContent}{bodyContent}</div>
            <BlockContainer contentWidth="default" style={{ minWidth: 0, width: '100%' }}>{mediaContent}</BlockContainer>
          </div>
        </GridBlock>
      </SurfaceProvider>
      </BlockReveal>
    )
  }

  return (
    <BlockReveal>
    <SurfaceProvider {...surfaceProps}>
      <GridBlock as="section">
        <div style={{ ...cellMedia, paddingBlock, display: 'flex', flexDirection: 'column', alignItems: derivedCentered ? 'center' : 'stretch', gap: 'var(--ds-spacing-l)' }}>
          {titleContent}
          {bodyContent}
        </div>
      </GridBlock>
    </SurfaceProvider>
    </BlockReveal>
  )
}
