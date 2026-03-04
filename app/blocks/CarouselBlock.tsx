'use client'

/**
 * CarouselBlock — two variants for Jio:
 *
 * **Variant A: Featured** (buttons on sides)
 * - Intent: Feature product highlights in a large, rich way
 * - Content: Short videos or striking images for key features at a glance
 * - Placement: Top or body of page only, never at bottom
 * - Constraints: Large 2:1 cards only, Default width
 *
 * **Variant B: Informative** (buttons below)
 * - Intent: Inform, educate, showcase detailed functionality, or create an overview of items that link to other sections
 * - Content: More detailed, less impactful, more informative
 * - Placement: Anywhere on page, including bottom
 * - Constraints: Card shapes 4:5 and 8:5
 */

import { useRef, useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { createTransition } from '@marcelinodzn/ds-tokens'
import { Headline, Button, Icon, IcChevronLeft, IcChevronRight, CarouselIndicator } from '@marcelinodzn/ds-react'
import { getHeadlineSize, getHeadlineFontSize, normalizeHeadingLevel } from '../lib/semantic-headline'
import { BlockSurfaceProvider } from '../lib/block-surface'
import { GridBlock, useGridCell } from '../components/GridBlock'
import { useGridBreakpoint } from '../lib/use-grid-breakpoint'
import { BlockContainer } from './BlockContainer'
import { useCarouselReveal } from '../lib/use-carousel-reveal'
import { MediaCard, TextOnColourCard } from '../components/Cards'

type CarouselItem = {
  cardType?: 'media' | 'text-on-colour' | null
  title?: string | null
  description?: string | null
  image?: string | null
  video?: string | null
  link?: string | null
  ctaText?: string | null
  aspectRatio?: '4:5' | '8:5' | '2:1'
}

type CarouselCardSize = 'compact' | 'medium' | 'large'

type CarouselSurface = 'ghost' | 'minimal' | 'subtle' | 'bold'

type CarouselBlockAccent = 'primary' | 'secondary' | 'neutral'

type CarouselBlockProps = {
  title?: string | null
  cardSize?: CarouselCardSize
  surface?: CarouselSurface
  blockAccent?: CarouselBlockAccent
  items?: CarouselItem[] | null
}

const GAP = 'var(--ds-spacing-l)'

/** Faded opacity for non-center cards in large carousel (DS: no opacity token; use semantic value) */
const LARGE_CAROUSEL_FADED_OPACITY = 0.5

const CARD_SIZE_CONFIG = {
  /** Compact: 3 cols, 4:5 = 1 slot (3 cards), 8:5 = 2 slots. 2:1 falls back to 8:5. Media and coloured container interchangeable. */
  compact: {
    cols: 3,
    contentWidth: 'Default' as const,
    getSlots: (ratio?: '4:5' | '8:5' | '2:1') => (ratio === '8:5' || ratio === '2:1' ? 2 : 1),
    getSlotWidthCss: (slots: number) => {
      const colWidth = `calc((100cqw - 2 * ${GAP}) / 3)`
      return slots === 1 ? colWidth : `calc(${colWidth} * 2 + ${GAP})`
    },
    getImageHeight4_5: () =>
      `calc(((100cqw - 2 * ${GAP}) / 3) * 5 / 4)`,
    getScrollAmount: (viewportW: number, gapPx: number) =>
      (viewportW - 2 * gapPx) / 3 + gapPx,
  },
  /** Large 2:1: 1 card per view, Wide width for prominent single card. 2:1 only. */
  large: {
    cols: 1,
    contentWidth: 'Wide' as const,
    getSlots: () => 1,
    getSlotWidthCss: () => '100cqw',
    getImageHeight4_5: () => 'auto',
    getScrollAmount: (viewportW: number, gapPx: number) => viewportW + gapPx,
  },
  /** Medium: 2 cards per view, S width each (Wide container). 4:5 only. */
  medium: {
    cols: 2,
    contentWidth: 'Wide' as const,
    getSlots: () => 1,
    getSlotWidthCss: () => `calc((100cqw - ${GAP}) / 2)`,
    getImageHeight4_5: () => `calc(((100cqw - ${GAP}) / 2) * 5 / 4)`,
    getScrollAmount: (viewportW: number, gapPx: number) =>
      (viewportW - gapPx) / 2 + gapPx,
  },
} as const

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

export function CarouselBlock({
  title,
  cardSize = 'compact',
  surface = 'ghost',
  blockAccent = 'primary',
  items,
}: CarouselBlockProps) {
  const level = normalizeHeadingLevel('h2')
  const { contentMaxDefault } = useGridBreakpoint()
  const cellContainer = useGridCell(cardSize === 'large' ? 'Wide' : 'Default')
  const config = CARD_SIZE_CONFIG[cardSize]
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const infiniteInitializedRef = useRef(false)

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const items_ = items?.filter((i) => i?.title || i?.image || i?.video) ?? []
  const isLargeFeatured = cardSize === 'large' || cardSize === 'medium'
  const isLargeLayout = cardSize === 'large'

  /** Reset infinite init when switching away from large featured */
  useEffect(() => {
    if (!isLargeFeatured) infiniteInitializedRef.current = false
  }, [isLargeFeatured])
  const { ref: revealRef, isVisible: isCardVisible, containerVisible } = useCarouselReveal(
    isLargeFeatured ? items_.length + 2 : items_.length
  )
  if (items_.length === 0) return null

  /** For large featured: infinite items [last, ...all, first] */
  const displayItems: CarouselItem[] = isLargeFeatured && items_.length > 1
    ? [items_[items_.length - 1]!, ...items_, items_[0]!]
    : items_

  /** One card step in px (card width + gap) for large carousel pagination */
  const getCardStepPx = (): number => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return 0
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0
    return config.getScrollAmount(viewport.clientWidth, gapPx)
  }

  const updateScrollBounds = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const max = Math.max(0, track.offsetWidth - viewport.clientWidth)
    setMaxScroll(max)
    if (!isLargeFeatured) {
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
  }, [items_, displayItems, isLargeFeatured])

  /** Compact: clamp scroll to [0, maxScroll] when bounds change (e.g. resize) */
  useEffect(() => {
    if (!isLargeFeatured && maxScroll >= 0) {
      setScrollPosition((prev) => Math.max(0, Math.min(maxScroll, prev)))
    }
  }, [isLargeFeatured, maxScroll])

  const n = items_.length
  const cardStepPx = getCardStepPx()
  /** Compact: finite scroll — disable nav at boundaries. Large featured: infinite, always allow when n > 1. */
  const canScrollLeft = isLargeFeatured ? n > 1 : maxScroll > 0 && scrollPosition > 1
  const canScrollRight = isLargeFeatured ? n > 1 : maxScroll > 0 && scrollPosition < maxScroll - 1

  const scroll = (dir: 'left' | 'right') => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0
    const scrollAmount = config.getScrollAmount(viewport.clientWidth, gapPx)
    const next = dir === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount

    if (isLargeFeatured && n > 1) {
      /** Infinite: scroll by exactly one card, jump at boundaries */
      if (dir === 'right' && next >= (n + 1) * cardStepPx) {
        setIsJumping(true)
        setScrollPosition(cardStepPx)
        requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)))
      } else if (dir === 'left' && next < 0) {
        setIsJumping(true)
        setScrollPosition(n * cardStepPx)
        requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)))
      } else {
        setScrollPosition(next)
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
    gap: GAP,
    width: 'max-content',
    minWidth: '100%',
    transform: `translateX(-${scrollPosition}px)`,
    transition: isJumping || prefersReducedMotion ? 'none' : createTransition('transform', 'l', 'transition', motionLevel),
  }

  /** Center card index for large featured (0-based in displayItems); used for faded-side effect */
  const centerIndex =
    isLargeFeatured && cardStepPx > 0
      ? Math.min(displayItems.length - 1, Math.max(0, Math.round(scrollPosition / cardStepPx)))
      : 0

  /** For medium: 2 cards in view, both should be full opacity. Only cards outside viewport fade. */
  const isCardInView = (i: number) =>
    isLargeFeatured && i >= centerIndex && i < centerIndex + config.cols

  /** Stepper active index (0-based, for display in items_) */
  const stepperActiveIndex =
    n <= 1
      ? 0
      : isLargeFeatured
        ? centerIndex <= 0
          ? n - 1
          : centerIndex > n
            ? 0
            : centerIndex - 1
        : Math.min(n - 1, Math.max(0, Math.round(scrollPosition / (cardStepPx || 1))))

  const viewportOverflow = cardSize === 'large' ? 'hidden' : 'visible'
  const viewportStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    containerType: 'inline-size',
    overflow: viewportOverflow,
  }

  const titleTransition = prefersReducedMotion
    ? undefined
    : createTransition(['opacity', 'transform'], 'xl', 'entrance', motionLevel)
  const cardTransition = prefersReducedMotion
    ? undefined
    : createTransition(['opacity', 'transform'], 'xl', 'entrance', motionLevel)

  const hasSurfaceBg = surface === 'minimal' || surface === 'subtle' || surface === 'bold'
  /** Stepper always uses primary minimal background. */
  const stepperBg = 'var(--ds-color-block-background-subtle)'

  const handleDotClick = (idx: number) => {
    if (isLargeFeatured && n > 1 && cardStepPx > 0) {
      const targetScroll = (idx + 1) * cardStepPx
      setIsJumping(true)
      setScrollPosition(targetScroll)
      infiniteInitializedRef.current = true
      requestAnimationFrame(() => requestAnimationFrame(() => setIsJumping(false)))
    } else if (cardStepPx > 0) {
      setScrollPosition(Math.min(maxScroll, Math.max(0, idx * cardStepPx)))
    }
  }

  /** Stepper height matches DS Button size S (padding XS + content M + padding XS). */
  const stepperHeight = 'calc(var(--ds-spacing-xs) + var(--ds-spacing-m) + var(--ds-spacing-xs))'

  /** Custom stepper for Compact/Medium: pill capsule, elongated active dot, small circular inactive dots */
  const renderCompactMediumStepper = () => {
    if (n <= 1) return null
    return (
      <div
        role="tablist"
        aria-label="Carousel pagination"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--ds-spacing-xs)',
          paddingInline: 'var(--ds-spacing-m)',
          height: stepperHeight,
          boxSizing: 'border-box',
          borderRadius: 'var(--ds-radius-full)',
          backgroundColor: stepperBg,
        }}
      >
        {Array.from({ length: n }, (_, i) => {
          const isActive = i === stepperActiveIndex
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => handleDotClick(i)}
              style={{
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: isActive
                  ? 'var(--ds-color-block-background-bold)'
                  : hasSurfaceBg
                    ? 'rgba(255, 255, 255, 0.65)'
                    : 'rgba(0, 0, 0, 0.15)',
                borderRadius: 'var(--ds-radius-full)',
                width: isActive ? 14 : 6,
                height: 6,
                minWidth: isActive ? 14 : 6,
                transition: 'background 0.2s ease, width 0.2s ease',
              }}
            />
          )
        })}
      </div>
    )
  }

  /** DS CarouselIndicator for Large (center-aligned below carousel) */
  const renderLargeStepper = () => {
    if (n <= 1) return null
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 'var(--ds-spacing-m)',
          height: stepperHeight,
          boxSizing: 'border-box',
          borderRadius: 'var(--ds-radius-full)',
          backgroundColor: stepperBg,
        }}
        aria-hidden
      >
        <CarouselIndicator
          type={hasSurfaceBg ? 'media' : 'below-media'}
          items={n}
          activeIndex={stepperActiveIndex}
          onDotClick={handleDotClick}
        />
      </div>
    )
  }

  const stepperEl = n > 1 ? (isLargeLayout ? renderLargeStepper() : renderCompactMediumStepper()) : null

  return (
    <BlockSurfaceProvider blockSurface={surface} blockAccent={blockAccent} fullWidth>
      <GridBlock as="section">
        <div
          ref={revealRef}
          style={{
            ...cellContainer,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-spacing-xl)',
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
                  fontSize: getHeadlineFontSize(level),
                  opacity: containerVisible ? 1 : 0,
                  transform: containerVisible ? 'translateY(0)' : 'translateY(var(--ds-spacing-xl))',
                  transition: titleTransition,
                }}
              >
                {title}
              </Headline>
            </BlockContainer>
          )}
          <BlockContainer contentWidth={config.contentWidth ?? 'Default'} className="card-block-carousel" style={{ width: '100%', overflow: 'visible' }}>
            {isLargeLayout ? (
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
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: `calc(${contentMaxDefault} / 4)`,
                      }}
                    >
                      <NavButton
                        direction="left"
                        disabled={!canScrollLeft}
                        onPress={() => scroll('left')}
                        size="M"
                        surface={surface}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'stretch', minWidth: 0 }}>
                      <div
                        ref={viewportRef}
                        style={{
                          ...viewportStyle,
                          width: contentMaxDefault,
                          maxWidth: '100%',
                          marginInline: 'auto',
                        }}
                      >
                        <div ref={trackRef} style={trackStyle}>
                          {displayItems.map((item, i) => {
                            const slots = 1
                            const cardVisible = isCardVisible(i)
                            const useTextOnColour = false
                            const textCardAspectRatio = '2:1'
                            const isInView = isCardInView(i)
                            const cardOpacity = isInView ? 1 : LARGE_CAROUSEL_FADED_OPACITY
                            const wrapperTransition = prefersReducedMotion ? undefined : createTransition(['opacity', 'transform'], 'l', 'transition', motionLevel)
                            const cardOverflow = 'hidden' as const
                            const wrapperStyle: CSSProperties = {
                              flex: `0 0 ${config.getSlotWidthCss(slots)}`,
                              minWidth: 0,
                              minHeight: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              overflow: cardOverflow,
                              opacity: cardOpacity,
                              transform: cardVisible ? 'translateY(0)' : 'translateY(var(--ds-spacing-xl))',
                              transition: wrapperTransition ?? undefined,
                            }
                            return (
                              <div
                                key={i}
                                className="carousel-card"
                                style={wrapperStyle}
                              >
                                {useTextOnColour ? (
                                  <TextOnColourCard
                                    title={item.title}
                                    description={item.description}
                                    surface="subtle"
                                    size="large"
                                    aspectRatio={textCardAspectRatio}
                                  />
                                ) : (
                                  <MediaCard
                                    title={item.title}
                                    description={item.description}
                                    image={item.image}
                                    video={item.video}
                                    link={item.link}
                                    ctaText={item.ctaText}
                                    aspectRatio="2:1"
                                    prefersReducedMotion={prefersReducedMotion}
                                    config={{
                                      layout: cardSize,
                                      imageHeight4_5: config.getImageHeight4_5(),
                                    }}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: `calc(${contentMaxDefault} / 4)`,
                      }}
                    >
                      <NavButton
                        direction="right"
                        disabled={!canScrollRight}
                        onPress={() => scroll('right')}
                        size="M"
                        surface={surface}
                      />
                    </div>
                  </div>
                  {stepperEl && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>{stepperEl}</div>
                  )}
                </div>
              ) : (
                <>
                  <div ref={viewportRef} style={{ ...viewportStyle, width: '100%' }}>
                    <div ref={trackRef} style={trackStyle}>
                      {displayItems.map((item, i) => {
                        const slots = config.getSlots(item.aspectRatio)
                        const cardVisible = isCardVisible(i)
                        const useTextOnColour = item.cardType === 'text-on-colour'
                        const textCardAspectRatio = (item.aspectRatio === '8:5' || item.aspectRatio === '2:1') ? '8:5' : '4:5'
                        const wrapperStyle: CSSProperties = {
                          flex: `0 0 ${config.getSlotWidthCss(slots)}`,
                          minWidth: 0,
                          minHeight: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'visible',
                          opacity: cardVisible ? 1 : 0,
                          transform: cardVisible ? 'translateY(0)' : 'translateY(var(--ds-spacing-xl))',
                          transition: cardTransition,
                        }
                        return (
                          <div
                            key={i}
                            className="carousel-card"
                            style={wrapperStyle}
                          >
                            {useTextOnColour ? (
                              <TextOnColourCard
                                title={item.title}
                                description={item.description}
                                surface="subtle"
                                size="compact"
                                aspectRatio={textCardAspectRatio}
                              />
                            ) : (
                              <MediaCard
                                title={item.title}
                                description={item.description}
                                image={item.image}
                                video={item.video}
                                link={item.link}
                                ctaText={item.ctaText}
                                aspectRatio={item.aspectRatio}
                                prefersReducedMotion={prefersReducedMotion}
                                config={{
                                  layout: 'compact',
                                  imageHeight4_5: config.getImageHeight4_5(),
                                }}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--ds-spacing-m)',
                      marginTop: 'var(--ds-spacing-l)',
                    }}
                  >
                    {stepperEl ? (
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {stepperEl}
                      </div>
                    ) : (
                      <div />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-m)' }}>
                      <NavButton
                        direction="left"
                        disabled={!canScrollLeft}
                        onPress={() => scroll('left')}
                        size="S"
                        surface={surface}
                      />
                      <NavButton
                        direction="right"
                        disabled={!canScrollRight}
                        onPress={() => scroll('right')}
                        size="S"
                        surface={surface}
                      />
                    </div>
                  </div>
                </>
              )}
          </BlockContainer>
        </div>
      </GridBlock>
    </BlockSurfaceProvider>
  )
}
