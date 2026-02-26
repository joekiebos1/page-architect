'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Headline, Text } from '@marcelinodzn/ds-react'

type CarouselItem = {
  title?: string | null
  description?: string | null
  image?: string | null
  video?: string | null
}

type FullBleedVerticalCarouselProps = {
  items?: CarouselItem[] | null
}

const ITEM_VH = 100

function MediaLayer({ item }: { item: CarouselItem }) {
  if (item?.video) {
    return (
      <video
        src={item.video}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }
  if (item?.image) {
    return (
      <Image
        src={item.image}
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        priority
      />
    )
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, var(--ds-color-background-subtle) 0%, var(--ds-color-surface-bold) 100%)',
      }}
    />
  )
}

/**
 * Full-bleed vertical carousel:
 * 1. Container becomes sticky when its top reaches viewport top
 * 2. While sticky, images show in a fixed overlay; text scrolls; when item text crosses top, fade to next image
 * 3. When last item's text center reaches viewport center, container unsticks
 */
export function FullBleedVerticalCarousel({ items }: FullBleedVerticalCarouselProps) {
  const items_ = items?.filter((i) => i?.title || i?.description) ?? []
  const n = items_.length

  const containerRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])

  const [imageIndex, setImageIndex] = useState(0)
  const [prevImageIndex, setPrevImageIndex] = useState(0)
  const prevImageIndexRef = useRef(0)
  const [isSticky, setIsSticky] = useState(false)

  if (n === 0) return null

  const heightVh = n * ITEM_VH

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight

      // Before carousel: not sticky, reset image
      if (top > 0) {
        setIsSticky(false)
        setImageIndex(0)
        return
      }

      // Past carousel: not sticky, reset
      if (bottom <= 0) {
        setIsSticky(false)
        prevImageIndexRef.current = 0
        setPrevImageIndex(0)
        return
      }

      // Inside carousel: compute which image to show
      const scrollIntoCarousel = -top
      const itemIndex = Math.min(Math.floor(scrollIntoCarousel / vh), n - 1)
      const textEl = textRefs.current[itemIndex]
      const textPastTop = textEl && textEl.getBoundingClientRect().top <= 0
      const imageIndexNew =
        textPastTop && itemIndex < n - 1 ? itemIndex + 1 : itemIndex

      if (imageIndexNew !== prevImageIndexRef.current) {
        setPrevImageIndex(prevImageIndexRef.current)
        prevImageIndexRef.current = imageIndexNew
      }
      setImageIndex(imageIndexNew)

      // Unstick when last item's text center reaches viewport center
      const lastText = textRefs.current[n - 1]
      const lastTextRect = lastText?.getBoundingClientRect()
      const lastItemReachedCenter =
        imageIndexNew === n - 1 &&
        lastTextRect &&
        lastTextRect.top + lastTextRect.height / 2 <= vh / 2

      setIsSticky(!lastItemReachedCenter)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [n])

  const showOverlay = isSticky

  const textColor = showOverlay ? 'white' : 'var(--ds-color-text-high)'
  const descColor = showOverlay ? 'rgba(255,255,255,0.95)' : 'var(--ds-color-text-medium)'
  const textShadow = showOverlay ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'

  return (
    <section style={{ marginTop: 'var(--ds-spacing-2xl)' }}>
      <style>{`
        @keyframes carouselFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          position: isSticky ? 'sticky' : 'relative',
          top: isSticky ? 0 : undefined,
          height: `${heightVh}vh`,
        }}
      >
        {showOverlay && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <MediaLayer item={items_[prevImageIndex]} />
            </div>
            <div
              key={imageIndex}
              style={{
                position: 'absolute',
                inset: 0,
                animation: 'carouselFade 0.5s ease-out',
              }}
            >
              <MediaLayer item={items_[imageIndex]} />
            </div>
          </div>
        )}

        {items_.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              zIndex: 1,
              height: `${ITEM_VH}vh`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                visibility: showOverlay ? 'hidden' : 'visible',
                pointerEvents: showOverlay ? 'none' : 'auto',
              }}
            >
              <MediaLayer item={item} />
            </div>
            <div
              ref={(el) => { textRefs.current[i] = el }}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: 'var(--ds-spacing-4xl) var(--ds-spacing-l)',
                textAlign: 'center',
                maxWidth: 'calc(var(--ds-breakpoint-desktop) - var(--ds-spacing-l) * 2)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {item.title && (
                <Headline
                  size="L"
                  weight="high"
                  as="h2"
                  style={{ color: textColor, textShadow, marginBottom: 'var(--ds-spacing-s)' }}
                >
                  {item.title}
                </Headline>
              )}
              {item.description && (
                <Text
                  size="M"
                  weight="low"
                  as="p"
                  style={{
                    color: descColor,
                    textShadow,
                    margin: 0,
                    maxWidth: 'calc(var(--ds-breakpoint-desktop) / 2 + var(--ds-spacing-2xl))',
                    marginInline: 'auto',
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
