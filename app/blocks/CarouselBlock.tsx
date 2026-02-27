'use client'

import { useRef, useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Headline, Button, Icon, SurfaceProvider, IcChevronLeft, IcChevronRight } from '@marcelinodzn/ds-react'
import { BlockContainer } from './BlockContainer'

type CarouselItem = {
  title?: string | null
  description?: string | null
  image?: string | null
  link?: string | null
  ctaText?: string | null
  aspectRatio?: '4:5' | '8:5'
}

type CarouselBlockProps = {
  title?: string | null
  items?: CarouselItem[] | null
}

const GAP = 'var(--ds-spacing-l)'
const COLS = 4

function getSlots(ratio?: '4:5' | '8:5') {
  return ratio === '8:5' ? 2 : 1
}

/** 1 column = 1/4 of carousel viewport. 4:5 = 1 col, 8:5 = 2 cols. Uses container query so cards fit the visible area. */
function getSlotWidthCss(slots: number) {
  const colWidth = `calc((100cqw - 3 * ${GAP}) / ${COLS})`
  return slots === 1 ? colWidth : `calc(${colWidth} * 2 + ${GAP})`
}

/** Image height so 4:5 and 8:5 align in the same row. Both use 4:5 height (1 col width * 5/4). */
const IMAGE_HEIGHT_4_5 = `calc(((100cqw - 3 * ${GAP}) / ${COLS}) * 5 / 4)`

function Card({ item }: { item: CarouselItem }) {
  const router = useRouter()

  const handleCtaPress = (href: string) => {
    if (href.startsWith('/')) router.push(href)
    else window.location.href = href
  }

  const imageBlock = (
    <div
      style={{
        position: 'relative',
        width: '100%',
        ...(item.aspectRatio === '8:5'
          ? { height: IMAGE_HEIGHT_4_5 }
          : { aspectRatio: '4/5' as const }),
        borderRadius: 'var(--ds-radius-card)',
        overflow: 'hidden',
      }}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'inherit',
          }}
        />
      ) : null}
    </div>
  )

  const textBlock = (item.title || item.description || (item.ctaText && item.link)) ? (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        width: '100%',
        paddingRight: 'var(--ds-spacing-l)',
        paddingBottom: 'var(--ds-spacing-l)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-spacing-xs)',
      }}
    >
      {(item.title || item.description) && (
        <p
          style={{
            margin: 0,
            width: '100%',
            fontSize: 'var(--ds-typography-body-xs)',
            lineHeight: 1.4,
          }}
        >
          {item.title && (
            <span style={{ color: 'var(--ds-color-text-high)', fontWeight: 'var(--ds-typography-weight-high)' }}>
              {item.title}
            </span>
          )}
          {item.title && item.description && ' '}
          {item.description && (
            <span style={{ color: 'var(--ds-color-text-low)', fontWeight: 'var(--ds-typography-weight-low)' }}>
              {item.description}
            </span>
          )}
        </p>
      )}
      {item.ctaText && item.link && (
        <Button
          appearance="primary"
          size="XS"
          attention="low"
          onPress={() => handleCtaPress(item.link!)}
          style={{ alignSelf: 'flex-start' }}
        >
          {item.ctaText}
        </Button>
      )}
    </div>
  ) : null

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: GAP,
        width: '100%',
        height: '100%',
        minHeight: 0,
      }}
    >
      {item.link && !item.ctaText ? (
        <Link href={item.link} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flexShrink: 0 }}>
          {imageBlock}
        </Link>
      ) : (
        <div style={{ flexShrink: 0 }}>{imageBlock}</div>
      )}
      {textBlock}
    </div>
  )

  return content
}

export function CarouselBlock({
  title,
  items,
}: CarouselBlockProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)

  const items_ = items?.filter((i) => i?.title || i?.image) ?? []
  if (items_.length === 0) return null

  const updateScrollBounds = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth)
    setMaxScroll(max)
    setScrollPosition((prev) => Math.min(prev, max))
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
  }, [items_])

  const canScrollLeft = maxScroll > 0 && scrollPosition > 0
  const canScrollRight = maxScroll > 0 && scrollPosition < maxScroll - 0.5

  const scroll = (dir: 'left' | 'right') => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0
    const colWidth = (viewport.clientWidth - 3 * gapPx) / COLS
    const scrollAmount = colWidth + gapPx
    setScrollPosition((prev) => {
      const next = dir === 'left' ? prev - scrollAmount : prev + scrollAmount
      return Math.max(0, Math.min(maxScroll, next))
    })
  }

  const trackStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: GAP,
    paddingBlock: 'var(--ds-spacing-s)',
    width: 'max-content',
    minWidth: '100%',
    transform: `translateX(-${scrollPosition}px)`,
    transition: 'transform 0.3s ease',
  }

  const viewportStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    overflow: 'visible',
    paddingBlock: 'var(--ds-radius-card)',
    containerType: 'inline-size',
  }

  return (
    <SurfaceProvider level={0}>
      <BlockContainer
        as="section"
        style={{
          paddingBlock: 'var(--ds-spacing-2xl)',
          overflow: 'visible',
        }}
      >
        {title && (
          <Headline
            size="M"
            weight="high"
            as="h2"
            align="center"
            style={{
              marginBottom: 'var(--ds-spacing-xl)',
            }}
          >
            {title}
          </Headline>
        )}
        <div style={{ overflow: 'visible' }}>
          <div ref={viewportRef} style={viewportStyle}>
            <div ref={trackRef} style={trackStyle}>
            {items_.map((item, i) => {
              const slots = getSlots(item.aspectRatio)
              const wrapperStyle: CSSProperties = {
                flex: `0 0 ${getSlotWidthCss(slots)}`,
                minWidth: 0,
                minHeight: 0,
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--ds-radius-card)',
                overflow: 'hidden',
              }
              return (
                <div key={i} style={wrapperStyle}>
                  <Card item={item} />
                </div>
              )
            })}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--ds-spacing-m)',
              marginTop: 'var(--ds-spacing-l)',
            }}
          >
            <Button
              single
              appearance="primary"
              attention="medium"
              size="XS"
              aria-label="Previous cards"
              onPress={() => scroll('left')}
              isDisabled={!canScrollLeft}
              content={<Icon asset={<IcChevronLeft />} size="S" />}
            />
            <Button
              single
              appearance="primary"
              attention="medium"
              size="XS"
              aria-label="Next cards"
              onPress={() => scroll('right')}
              isDisabled={!canScrollRight}
              content={<Icon asset={<IcChevronRight />} size="S" />}
            />
          </div>
        </div>
      </BlockContainer>
    </SurfaceProvider>
  )
}
