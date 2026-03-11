'use client'

/**
 * ResponsiveCarouselBlock — Lab experiment for breakpoint-aware carousel.
 *
 * Adapts card count and layout across breakpoints:
 * - Mobile (4 cols): 1 card visible, compact nav buttons
 * - Tablet (8 cols): 2 cards for compact/medium, 1 for large
 * - Desktop (12 cols): 3 for compact, 2 for medium, 1 for large
 *
 * Uses DS tokens, GridBlock, useGridCell, useGridBreakpoint.
 */

import { useRef, useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { createTransition } from '@marcelinodzn/ds-tokens'
import { Headline, Button, Icon, IcChevronLeft, IcChevronRight } from '@marcelinodzn/ds-react'
import { getHeadlineSize, normalizeHeadingLevel, TYPOGRAPHY } from '../../../lib/semantic-headline'
import { BlockSurfaceProvider } from '../../../lib/block-surface'
import { GridBlock, useGridCell } from '../../../components/GridBlock'
import { useGridBreakpoint } from '../../../lib/use-grid-breakpoint'
import { BlockContainer } from '../../../blocks/BlockContainer'
import { useCarouselReveal } from '../../../lib/use-carousel-reveal'
import { MediaCard, TextOnColourCard } from '../../../components/Cards'

type CarouselItem = {
  cardType?: 'media' | 'text-on-colour' | null
  title?: string | null
  description?: string | null
  image?: string | null
  video?: string | null
  link?: string | null
  ctaText?: string | null
  aspectRatio?: '4:5' | '8:5' | '2:1'
  imageSlot?: string
}

type CarouselCardSize = 'compact' | 'medium' | 'large'

type CarouselEmphasis = 'ghost' | 'minimal' | 'subtle' | 'bold'

type CarouselSurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export type ResponsiveCarouselBlockProps = {
  title?: string | null
  cardSize?: CarouselCardSize
  emphasis?: CarouselEmphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: CarouselSurfaceColour
  items?: CarouselItem[] | null
  images?: Record<string, { url: string; alt: string; source: 'database' | 'generated'; ready: boolean }>
}

const GAP = 'var(--ds-spacing-l)'

const CAROUSEL_FADED_OPACITY = 0.25

/** Responsive cols: mobile (4) → 1, tablet (8) → 2 for compact/medium, desktop (12) → 3/2/1 by cardSize */
function getResponsiveCols(columns: number, cardSize: CarouselCardSize): number {
  if (columns <= 4) return 1
  if (columns <= 8) return cardSize === 'large' ? 1 : 2
  switch (cardSize) {
    case 'compact': return 3
    case 'medium': return 2
    case 'large': return 1
    default: return 2
  }
}

function getResponsiveConfig(columns: number, cardSize: CarouselCardSize) {
  const cols = getResponsiveCols(columns, cardSize)
  const gap = GAP

  return {
    cols,
    gap,
    getSlots: (ratio?: '4:5' | '8:5' | '2:1') =>
      cols >= 2 && (ratio === '8:5' || ratio === '2:1') ? 2 : 1,
    getSlotWidthCss: (slots: number) => {
      if (cols === 1) return '100cqw'
      const colWidth = `calc((100cqw - ${cols - 1} * ${gap}) / ${cols})`
      return slots === 1 ? colWidth : `calc(${colWidth} * 2 + ${gap})`
    },
    getImageHeight4_5: () => {
      if (cols === 1) return 'auto'
      const colWidth = `calc((100cqw - ${cols - 1} * ${gap}) / ${cols})`
      return `calc(${colWidth} * 5 / 4)`
    },
    getScrollAmount: (viewportW: number, gapPx: number) => {
      if (cols === 1) return viewportW + gapPx
      return (viewportW - (cols - 1) * gapPx) / cols + gapPx
    },
  }
}

function NavButton({
  direction,
  disabled,
  onPress,
  size = 'S',
  surface = 'ghost',
}: {
  direction: 'left' | 'right'
  disabled: boolean
  onPress: () => void
  size?: 'XS' | 'S' | 'M'
  surface?: 'ghost' | 'minimal' | 'subtle' | 'bold'
}) {
  const iconSize = size === 'XS' ? 'S' : size === 'S' ? 'M' : 'L'
  const hasBackground = surface === 'minimal' || surface === 'subtle' || surface === 'bold'
  return (
    <Button
      single
      appearance="primary"
      attention={hasBackground ? 'high' : undefined}
      size={size}
      aria-label={direction === 'left' ? 'Previous cards' : 'Next cards'}
      onPress={onPress}
      isDisabled={disabled}
      content={
        direction === 'left'
          ? <Icon asset={<IcChevronLeft />} size={iconSize} appearance="secondary" tinted />
          : <Icon asset={<IcChevronRight />} size={iconSize} appearance="secondary" tinted />
      }
    />
  )
}

export function ResponsiveCarouselBlock({
  title,
  cardSize = 'medium',
  emphasis = 'ghost',
  minimalBackgroundStyle = 'block',
  surfaceColour = 'primary',
  items,
  images,
}: ResponsiveCarouselBlockProps) {
  const level = normalizeHeadingLevel('h2')
  const { columns, contentMaxDefault } = useGridBreakpoint()
  const cellContainer = useGridCell('Wide')
  const config = getResponsiveConfig(columns, cardSize)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const infiniteInitializedRef = useRef(false)
  const pendingJumpRef = useRef<'right' | null>(null)

  const items_ = items?.filter((i) => i?.title || i?.image || i?.video) ?? []
  const isLargeLayout = cardSize === 'large'
  const isInfiniteCarousel = cardSize === 'large' && config.cols <= 2

  useEffect(() => {
    if (!isInfiniteCarousel) infiniteInitializedRef.current = false
  }, [isInfiniteCarousel])

  const { ref: revealRef, isVisible: isCardVisible, containerVisible, prefersReducedMotion } = useCarouselReveal(
    isInfiniteCarousel ? items_.length + 2 : items_.length
  )

  if (items_.length === 0) return null

  const displayItems: CarouselItem[] = isInfiniteCarousel && items_.length > 1
    ? [items_[items_.length - 1]!, ...items_, items_[0]!]
    : items_

  const getCardStepPx = (): number => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return 0
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0
    const firstCard = track.children[0] as HTMLElement | undefined
    if (config.cols > 1 && firstCard) return firstCard.offsetWidth + gapPx
    return config.getScrollAmount(viewport.clientWidth, gapPx)
  }

  const updateScrollBounds = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0
    const firstCard = track.children[0] as HTMLElement | undefined
    const max =
      config.cols > 1 && firstCard && displayItems.length > config.cols
        ? Math.max(0, (displayItems.length - config.cols) * (firstCard.offsetWidth + gapPx))
        : Math.max(0, track.offsetWidth - viewport.clientWidth)
    setMaxScroll(max)
    if (!isInfiniteCarousel) {
      setScrollPosition((prev) => Math.min(prev, max))
    } else if (items_.length > 1 && !infiniteInitializedRef.current) {
      const cardStep = getCardStepPx()
      if (cardStep > 0) {
        infiniteInitializedRef.current = true
        setScrollPosition(cardStep)
      }
    }
  }

  useEffect(() => {
    updateScrollBounds()
    window.addEventListener('resize', updateScrollBounds)
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return () => { window.removeEventListener('resize', updateScrollBounds) }
    const ro = new ResizeObserver(updateScrollBounds)
    ro.observe(viewport)
    ro.observe(track)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateScrollBounds)
    }
  }, [items_, displayItems, isInfiniteCarousel, config.cols])

  useEffect(() => {
    if (!isInfiniteCarousel && maxScroll >= 0) {
      setScrollPosition((prev) => Math.max(0, Math.min(maxScroll, prev)))
    }
  }, [isInfiniteCarousel, maxScroll])

  const n = items_.length
  const cardStepPx = getCardStepPx()
  const canScrollLeft = isInfiniteCarousel ? n > 1 : maxScroll > 0 && scrollPosition > 1
  const canScrollRight = isInfiniteCarousel ? n > 1 : maxScroll > 0 && scrollPosition + 1 < maxScroll

  const scroll = (dir: 'left' | 'right') => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0
    const firstCard = track.children[0] as HTMLElement | undefined
    const scrollAmount =
      config.cols > 1 && firstCard
        ? firstCard.offsetWidth + gapPx
        : config.getScrollAmount(viewport.clientWidth, gapPx)
    const next = dir === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount

    if (isInfiniteCarousel && n > 1) {
      if (dir === 'right' && next >= (n + 1) * cardStepPx) {
        if (prefersReducedMotion) {
          setIsJumping(true)
          setScrollPosition(cardStepPx)
          requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)))
        } else {
          setScrollPosition((n + 1) * cardStepPx)
          pendingJumpRef.current = 'right'
        }
      } else if (dir === 'left' && next < 0) {
        setIsJumping(true)
        setScrollPosition(n * cardStepPx)
        requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)))
      } else {
        setScrollPosition(next)
        pendingJumpRef.current = null
      }
    } else {
      const clamped = Math.max(0, Math.min(maxScroll, next))
      setScrollPosition(clamped)
    }
  }

  const motionLevel = prefersReducedMotion ? 'subtle' : 'moderate'
  const trackStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: config.gap,
    width: 'max-content',
    minWidth: '100%',
    transform: `translateX(-${scrollPosition}px)`,
    transition: isJumping || prefersReducedMotion ? 'none' : createTransition('transform', 'l', 'transition', motionLevel),
  }

  const centerIndex =
    cardStepPx > 0
      ? Math.min(displayItems.length - 1, Math.max(0, Math.round(scrollPosition / cardStepPx)))
      : 0

  const isCardInView = (i: number) =>
    i >= centerIndex && i < centerIndex + config.cols

  const leftCardIndex = cardStepPx > 0 ? Math.floor(scrollPosition / cardStepPx) : 0
  const isCardInViewportForFade = (i: number) =>
    cardSize === 'medium' ? i >= leftCardIndex && i < leftCardIndex + config.cols : isCardInView(i)

  const titleTransition = prefersReducedMotion
    ? undefined
    : createTransition(['opacity', 'transform'], 'xl', 'entrance', motionLevel)
  const cardTransition = prefersReducedMotion
    ? undefined
    : createTransition(['opacity', 'transform'], 'xl', 'entrance', motionLevel)

  const handleTrackTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== 'transform') return
    if (pendingJumpRef.current === 'right') {
      pendingJumpRef.current = null
      setIsJumping(true)
      setScrollPosition(cardStepPx)
      requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)))
    }
  }

  const navButtonSize = columns <= 4 ? 'XS' : columns <= 8 ? 'S' : 'M'
  const halfBtn = 'var(--ds-spacing-l)'
  const buttonMediaCenterOffset =
    columns >= 12
      ? cardSize === 'large'
        ? `calc(${contentMaxDefault} / 4 - ${halfBtn})`
        : cardSize === 'medium'
          ? `calc((${contentMaxDefault} - ${config.gap}) * 5 / 16 - ${halfBtn})`
          : `calc((${contentMaxDefault} - 2 * ${config.gap}) * 5 / 24 - ${halfBtn})`
      : undefined

  return (
    <BlockSurfaceProvider emphasis={emphasis} surfaceColour={surfaceColour} minimalBackgroundStyle={minimalBackgroundStyle} fullWidth>
      <GridBlock as="section">
        <div
          ref={revealRef}
          style={{
            ...cellContainer,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-spacing-3xl)',
            overflow: 'visible',
          }}
        >
          {title && (
            <BlockContainer contentWidth="Default" style={{ width: '100%' }}>
              <Headline
                size={getHeadlineSize(level)}
                weight="high"
                as={level}
                align="center"
                style={{
                  margin: 0,
                  fontSize: TYPOGRAPHY.h2,
                  whiteSpace: 'pre-line',
                  opacity: containerVisible ? 1 : 0,
                  transform: containerVisible ? 'translateY(0)' : 'translateY(var(--ds-spacing-xl))',
                  transition: titleTransition,
                }}
              >
                {title}
              </Headline>
            </BlockContainer>
          )}
          <BlockContainer contentWidth="Wide" className="card-block-carousel" style={{ width: '100%', overflow: 'visible' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 'var(--ds-spacing-m)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    ...(buttonMediaCenterOffset
                      ? { marginTop: buttonMediaCenterOffset }
                      : { alignSelf: 'center' }),
                  }}
                >
                  <NavButton
                    direction="left"
                    disabled={!canScrollLeft}
                    onPress={() => scroll('left')}
                    size={navButtonSize}
                    surface={emphasis}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    minWidth: 0,
                    position: 'relative',
                    zIndex: 0,
                  }}
                >
                  <div
                    ref={viewportRef}
                    style={{
                      width: contentMaxDefault,
                      maxWidth: '100%',
                      minWidth: 0,
                      containerType: 'inline-size',
                      overflow: 'visible',
                      marginInline: 'auto',
                    }}
                  >
                    <div
                      ref={trackRef}
                      style={trackStyle}
                      onTransitionEnd={handleTrackTransitionEnd}
                    >
                      {displayItems.map((item, i) => {
                        if (isLargeLayout) {
                          const isInView = isCardInView(i)
                          const wrapperStyle: CSSProperties = {
                            flex: `0 0 ${config.getSlotWidthCss(1)}`,
                            minWidth: 0,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            opacity: isInView ? 1 : CAROUSEL_FADED_OPACITY,
                            transform: isCardVisible(i) ? 'translateY(0)' : 'translateY(var(--ds-spacing-xl))',
                            transition: prefersReducedMotion ? undefined : createTransition(['opacity', 'transform'], 'xl', 'transition', motionLevel),
                          }
                          return (
                            <div key={i} className="carousel-card" style={wrapperStyle}>
                              <MediaCard
                                title={item.title}
                                description={item.description}
                                image={images?.[item.imageSlot!]?.ready ? images[item.imageSlot!].url : item.image}
                                video={item.video}
                                link={item.link}
                                ctaText={item.ctaText}
                                aspectRatio="2:1"
                                prefersReducedMotion={prefersReducedMotion}
                                videoPaused={!isInView}
                                inView={isInView}
                                config={{ layout: cardSize, imageHeight4_5: config.getImageHeight4_5() }}
                                imageState={item.imageSlot ? images?.[item.imageSlot] : undefined}
                                imageSlot={item.imageSlot}
                              />
                            </div>
                          )
                        }
                        const slots = config.getSlots(item.aspectRatio)
                        const cardVisible = isCardVisible(i)
                        const inView = isCardInViewportForFade(i)
                        const textCardAspectRatio = (item.aspectRatio === '8:5' || item.aspectRatio === '2:1') ? '8:5' : '4:5'
                        const wrapperStyle: CSSProperties = {
                          flex: `0 0 ${config.getSlotWidthCss(slots)}`,
                          minWidth: 0,
                          minHeight: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'visible',
                          opacity: cardVisible ? (inView ? 1 : CAROUSEL_FADED_OPACITY) : 0,
                          transform: cardVisible ? 'translateY(0)' : 'translateY(var(--ds-spacing-xl))',
                          transition: cardTransition,
                        }
                        return (
                          <div key={i} className="carousel-card" style={wrapperStyle}>
                            {item.cardType === 'text-on-colour' ? (
                              <TextOnColourCard
                                title={item.title}
                                description={item.description}
                                surface="bold"
                                size={cardSize === 'medium' ? 'large' : 'compact'}
                                titleFontSize={cardSize === 'medium' && textCardAspectRatio === '4:5' ? TYPOGRAPHY.h3 : undefined}
                                aspectRatio={textCardAspectRatio}
                                inView={inView}
                                prefersReducedMotion={prefersReducedMotion}
                              />
                            ) : (
                              <MediaCard
                                title={item.title}
                                description={item.description}
                                image={item.imageSlot && images?.[item.imageSlot]?.ready ? images[item.imageSlot].url : item.image}
                                video={item.video}
                                link={item.link}
                                ctaText={item.ctaText}
                                aspectRatio={item.aspectRatio}
                                prefersReducedMotion={prefersReducedMotion}
                                videoPaused={!isCardInView(i)}
                                inView={inView}
                                config={{ layout: 'compact', imageHeight4_5: config.getImageHeight4_5() }}
                                imageState={item.imageSlot ? images?.[item.imageSlot] : undefined}
                                imageSlot={item.imageSlot}
                              />
                            )}
                          </div>
                        )
                      })}
                      {isInfiniteCarousel && items_.length > 1 && cardStepPx > 0 && (
                        <div aria-hidden style={{ flex: `0 0 ${cardStepPx}px`, minWidth: 0, minHeight: 0 }} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    ...(buttonMediaCenterOffset
                      ? { marginTop: buttonMediaCenterOffset }
                      : { alignSelf: 'center' }),
                  }}
                >
                  <NavButton
                    direction="right"
                    disabled={!canScrollRight}
                    onPress={() => scroll('right')}
                    size={navButtonSize}
                    surface={emphasis}
                  />
                </div>
              </div>
            </div>
          </BlockContainer>
        </div>
      </GridBlock>
    </BlockSurfaceProvider>
  )
}
