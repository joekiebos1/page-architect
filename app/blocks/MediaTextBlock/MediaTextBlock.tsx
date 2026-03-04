'use client'

import { useEffect, useState, type ReactNode } from 'react'
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
import { useGridBreakpoint } from '../../lib/use-grid-breakpoint'
import { BlockContainer, SPACING_VAR } from '../BlockContainer'
import { BlockReveal } from '../BlockReveal'
import { VideoWithControls } from '../../components/VideoWithControls'
import { getHeadlineFontSize, getHeadlineFontSizeOneStepUp, SUBHEAD_STYLE } from '../../lib/semantic-headline'
import { getSurfaceProviderProps, getBlockBackgroundColor } from '../../lib/block-surface'
import type { MediaTextBlockProps } from './MediaTextBlock.types'

/** Minimum block height for overflow media variant. Ensures enough of the image is visible even with short text. */
const OVERFLOW_MEDIA_MIN_HEIGHT = 540

const ASPECT_RATIOS: Record<string, string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '1:1': '1 / 1',
  '3:4': '3 / 4',
  '2:1': '2 / 1',
  auto: 'auto',
}

export function MediaTextBlock({
  size = 'feature',
  variant = 'media-right',
  imagePosition,
  width = 'Default',
  mediaStyle = 'contained',
  blockBackground = 'ghost',
  blockAccent = 'primary',
  spacing = 'large',
  spacingTop,
  spacingBottom,
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
  /** imagePosition takes precedence over variant for SideBySide layout. */
  const effectiveImageLeft = imagePosition
    ? imagePosition === 'left'
    : variant === 'media-left'
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
  const isNarrow = width === 'M'
  const isFullBleed = variant === 'full-bleed'
  const surfaceProps = isFullBleed
    ? { level: 1 as const, hasBoldBackground: true }
    : getSurfaceProviderProps(blockBackground)

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

  /** Titles: M (8 cols). Body: XS (4 cols). 50/50 blocks use Default (grid layout). */
  const titleContentWidth = derivedCentered ? 'M' : 'Default'
  const bodyContentWidth = derivedCentered ? 'XS' : 'Default'

  const titleContent = (
    <BlockContainer contentWidth={titleContentWidth} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-spacing-m)',
          alignItems: textAlign === 'center' ? 'center' : 'flex-start',
          textAlign,
          width: '100%',
        }}
      >
        {eyebrow && (
          <Label size="S" color="medium">
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
        {size !== 'hero' && subhead && <Title level={3} style={{ textAlign, ...SUBHEAD_STYLE }}>{subhead}</Title>}
      </div>
    </BlockContainer>
  )

  /** Stacked layout: title only (eyebrow + headline), no subhead. Subhead renders after media.
   * Typography: ~40px title, ~24px subhead, 16–19px body. */
  const stackedBlockStyle = variant === 'centered-media-below' && align === 'left' ? { marginInline: 0 } : undefined
  const headlineOnlyContent =
    variant === 'centered-media-below' ? (
      <BlockContainer contentWidth={titleContentWidth} style={{ width: '100%', ...stackedBlockStyle }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-spacing-m)',
            alignItems: textAlign === 'center' ? 'center' : 'flex-start',
            textAlign,
            width: '100%',
          }}
        >
          {eyebrow && (
            <Label size="S" color="medium">
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
                fontSize: getHeadlineFontSize('h2'),
                textAlign,
              }}
            >
              {headline}
            </Headline>
          )}
          {size === 'editorial' && (
            <Title level={2} style={{ textAlign, fontSize: 'var(--ds-typography-h3)' }}>{headline}</Title>
          )}
        </div>
      </BlockContainer>
    ) : null

  const subheadContent =
    variant === 'centered-media-below' && size !== 'hero' && subhead ? (
      <BlockContainer contentWidth="XS" style={{ width: '100%', ...stackedBlockStyle }}>
        <Title
          level={3}
          style={{
            textAlign,
            ...SUBHEAD_STYLE,
          }}
        >
          {subhead}
        </Title>
      </BlockContainer>
    ) : null

  const bodyContent =
    (size !== 'hero' && (body || bullets.length > 0)) || (cta || ctaSecondary) ? (
      <BlockContainer contentWidth={bodyContentWidth} style={{ width: '100%', ...(variant === 'centered-media-below' ? stackedBlockStyle : undefined) }}>
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
            <Text
              size={variant === 'centered-media-below' ? 'S' : 'M'}
              weight="low"
              as="p"
              color="medium"
              style={{ textAlign, whiteSpace: 'pre-line' }}
            >
              {body}
            </Text>
          )}
          {size !== 'hero' && bullets.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: textAlign === 'center' ? 0 : 'var(--ds-spacing-l)', listStyle: 'disc', listStylePosition: textAlign === 'center' ? 'inside' : 'outside', textAlign }}>
              {bullets.map((item, i) => (
                <li key={i} style={{ marginBottom: i < bullets.length - 1 ? 'var(--ds-spacing-xs)' : 0 }}>
                  <Text size={variant === 'centered-media-below' ? 'S' : 'M'} weight="low" as="span" color="medium" style={{ whiteSpace: 'pre-line' }}>{item}</Text>
                </li>
              ))}
            </ul>
          )}
          {(cta || ctaSecondary) && (
            <div style={{ display: 'flex', gap: 'var(--ds-spacing-s)', flexWrap: 'wrap', marginTop: 'var(--ds-spacing-l)' }}>
              {cta && (() => {
                const appearance = cta.appearance ?? 'primary'
                const isGhost = appearance === 'ghost'
                return (
                  <Button
                    appearance={isGhost ? 'secondary' : appearance}
                    contained={!isGhost}
                    size="S"
                    onPress={() => handleCtaPress(cta.href)}
                  >
                    {cta.label}
                  </Button>
                )
              })()}
              {ctaSecondary && (
                <Button appearance="secondary" contained={false} size="S" onPress={() => handleCtaPress(ctaSecondary.href)}>
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
    const useBorderRadius = mediaStyle === 'contained'

    if (isVideo) {
      return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: ratio === 'auto' ? undefined : aspectRatio, overflow: 'hidden', borderRadius: useBorderRadius ? 'var(--ds-radius-card-m)' : 0 }}>
          <VideoWithControls
            src={media.src}
            poster={media.poster}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      )
    }

    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: ratio === 'auto' ? undefined : aspectRatio, overflow: 'hidden', borderRadius: useBorderRadius ? 'var(--ds-radius-card)' : 0 }}>
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

  const paddingBlockTop = SPACING_VAR[spacingTop ?? spacing] ?? SPACING_VAR.large
  const paddingBlockBottom = SPACING_VAR[spacingBottom ?? spacing] ?? SPACING_VAR.large
  const paddingBlock = paddingBlockTop
  const cellMedia = useGridCell('Default')
  const { columns } = useGridBreakpoint()
  const isStacked = columns < 8

  const bgColor = getBlockBackgroundColor(blockBackground, blockAccent)

  /** Full-width background band. Contained: padding top+bottom. Overflow: padding top only (image bleeds, no bottom padding). Spacer below band only when overflow (BlockContainer skips padding). */
  const blockBgWrapper = (children: ReactNode, isOverflow?: boolean) =>
    bgColor ? (
      <>
        <div
          style={{
            width: '100vw',
            maxWidth: '100vw',
            marginLeft: 'calc(50% - 50vw)',
            marginRight: 'calc(50% - 50vw)',
            backgroundColor: bgColor,
            boxSizing: 'border-box',
            paddingBlockStart: paddingBlockTop,
            paddingBlockEnd: isOverflow ? 0 : paddingBlockBottom,
            minHeight: 1,
          }}
        >
          {children}
        </div>
      </>
    ) : (
      children
    )

  if (isNarrow) {
    return blockBgWrapper(
      <BlockReveal>
        <SurfaceProvider {...surfaceProps}>
          <GridBlock as="section">
            <div style={{ ...cellMedia, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--ds-spacing-2xl)' }}>
              {titleContent}
              <BlockContainer contentWidth="Default" style={{ width: '100%' }}>
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
    return blockBgWrapper(
      <BlockReveal>
        <SurfaceProvider {...surfaceProps}>
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
                background: 'linear-gradient(to top, var(--local-color-overlay-dark) 0%, transparent 60%)',
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
    return blockBgWrapper(
      <BlockReveal>
        <SurfaceProvider {...surfaceProps}>
          <GridBlock as="section">
            <div style={{ ...cellMedia, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--ds-spacing-l)' }}>
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
    const stackedAlignItems = align === 'center' ? 'center' : 'flex-start'
    return blockBgWrapper(
      <BlockReveal>
        <SurfaceProvider {...surfaceProps}>
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isEdgeToEdge ? 'center' : stackedAlignItems,
              gap: 'var(--ds-spacing-2xl)',
            }}
          >
            {isEdgeToEdge ? (
              <>
                <GridBlock as="div">
                  <div
                    style={{
                      ...cellMedia,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {headlineOnlyContent}
                  </div>
                </GridBlock>
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
                {(subheadContent || bodyContent) && (
                  <GridBlock as="div">
                    <div
                      style={{
                        ...cellMedia,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--ds-spacing-l)',
                      }}
                    >
                      {subheadContent}
                      {bodyContent}
                    </div>
                  </GridBlock>
                )}
              </>
            ) : (
              <BlockContainer contentWidth="Default" style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: stackedAlignItems,
                    gap: 'var(--ds-spacing-2xl)',
                  }}
                >
                  {headlineOnlyContent}
                  {mediaContent}
                  {(subheadContent || bodyContent) && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: stackedAlignItems,
                        gap: 'var(--ds-spacing-l)',
                      }}
                    >
                      {subheadContent}
                      {bodyContent}
                    </div>
                  )}
                </div>
              </BlockContainer>
            )}
          </section>
        </SurfaceProvider>
      </BlockReveal>
    )
  }

  if ((variant === 'media-right' || variant === 'media-left') && hasMedia && media) {
    const mediaFirst = effectiveImageLeft
    const isOverflow = mediaStyle === 'overflow'
    const isVideo = media.type === 'video'

    const overflowMediaContent = (
      <div
        style={{
          position: 'relative',
          overflow: 'visible',
          width: '100%',
          minHeight: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '5 / 8',
          }}
        >
          {isVideo ? (
            <VideoWithControls
              src={media.src}
              poster={media.poster}
              prefersReducedMotion={prefersReducedMotion}
            />
          ) : (
            <Image
              src={media.src}
              alt={media.alt ?? ''}
              fill
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </div>
    )

    /** 10-column grid: text 5 cols, gap (ample padding), image 5 cols. Text at x=0 when left; image at x=0 when right. */
    const SIDE_BY_SIDE_COLS = 10
    const HALF_COLS = 5
    const COL_GAP = 'var(--ds-spacing-2xl)'

    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: isStacked ? '1fr' : `repeat(${SIDE_BY_SIDE_COLS}, 1fr)`,
      gap: isStacked ? 'var(--ds-spacing-3xl)' : COL_GAP,
      alignItems: isOverflow ? 'start' : 'center',
    }

    const gridWrapperStyle: React.CSSProperties = {
      ...cellMedia,
      position: 'relative',
    }

    const textColumnStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-spacing-l)',
      alignItems: textAlign === 'center' ? 'center' : 'flex-start',
      minWidth: 0,
      ...(isOverflow && !isStacked
        ? {
            paddingBlock: paddingBlock,
            paddingInline: 'var(--ds-spacing-2xl)',
            minHeight: `calc(${OVERFLOW_MEDIA_MIN_HEIGHT}px - ${paddingBlock})`,
          }
        : {}),
    }

    /** Overflow: when stacked, use normal height (no bleed). When side-by-side, height: 0 trick for bleed. */
    const mediaColumn = isOverflow ? (
      <div
        style={{
          position: 'relative',
          overflow: 'visible',
          ...(isStacked ? { aspectRatio: '5 / 8' } : { height: 0, minHeight: 0, gridColumn: `span ${HALF_COLS}` }),
        }}
      >
        {overflowMediaContent}
      </div>
    ) : (
      <div
        style={{
          position: 'relative',
          minWidth: 0,
          ...(!isStacked && { gridColumn: `span ${HALF_COLS}` }),
        }}
      >
        <BlockContainer contentWidth="Default" style={{ width: '100%' }}>{mediaContent}</BlockContainer>
      </div>
    )

    const textColumnContent = (
      <>
        {titleContent}
        {bodyContent}
      </>
    )

    /** Text on left: cols 1–5. Text on right: cols 6–10. */
    const textColumnWrapperStyle: React.CSSProperties = {
      ...textColumnStyle,
      ...(!isStacked && {
        gridColumn: mediaFirst ? `${HALF_COLS + 1} / span ${HALF_COLS}` : `1 / span ${HALF_COLS}`,
      }),
    }

    const gridContent = (
      <GridBlock as="section">
        <div style={gridWrapperStyle}>
          <div style={gridStyle}>
            {mediaFirst ? (
              <>
                {mediaColumn}
                <div style={textColumnWrapperStyle}>{textColumnContent}</div>
              </>
            ) : (
              <>
                <div style={textColumnWrapperStyle}>{textColumnContent}</div>
                {mediaColumn}
              </>
            )}
          </div>
        </div>
      </GridBlock>
    )

    const contentToWrap = isOverflow ? (
      <div style={{ overflow: 'hidden' }}>
        {gridContent}
      </div>
    ) : (
      gridContent
    )

    const overflowContent = blockBgWrapper(
      <BlockReveal>
        <SurfaceProvider {...surfaceProps}>
          {contentToWrap}
        </SurfaceProvider>
      </BlockReveal>,
      isOverflow
    )
    return overflowContent
  }

  return blockBgWrapper(
    <BlockReveal>
      <SurfaceProvider {...surfaceProps}>
        <GridBlock as="section">
          <div style={{ ...cellMedia, display: 'flex', flexDirection: 'column', alignItems: derivedCentered ? 'center' : 'stretch', gap: 'var(--ds-spacing-l)' }}>
            {titleContent}
            {bodyContent}
          </div>
        </GridBlock>
      </SurfaceProvider>
    </BlockReveal>
  )
}
