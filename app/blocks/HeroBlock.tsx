'use client'

import { useRouter } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import { Display, Text, Button, SurfaceProvider } from '@marcelinodzn/ds-react'
import { GridBlock, useGridCell } from '../components/GridBlock'
import { BlockContainer } from './BlockContainer'
import { BlockReveal } from './BlockReveal'

type HeroBlockProps = {
  variant?: 'category' | 'product' | null
  productName?: string | null
  headline?: string | null
  subheadline?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  cta2Text?: string | null
  cta2Link?: string | null
  image?: string | null
}

export function HeroBlock({
  productName,
  headline,
  subheadline,
  ctaText,
  ctaLink,
  cta2Text,
  cta2Link,
  image,
}: HeroBlockProps) {
  const router = useRouter()
  const cell = useGridCell('wide')
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [purpleHeight, setPurpleHeight] = useState<string>('100%')

  useEffect(() => {
    const updateHeight = () => {
      const section = sectionRef.current
      const image = imageRef.current
      if (!section || !image) return
      const sectionRect = section.getBoundingClientRect()
      const imageRect = image.getBoundingClientRect()
      const centerOfImage = imageRect.top + imageRect.height / 2
      setPurpleHeight(`${Math.max(0, centerOfImage - sectionRect.top)}px`)
    }
    let cleanup: (() => void) | undefined
    const raf = requestAnimationFrame(() => {
      updateHeight()
      window.addEventListener('resize', updateHeight)
      const ro = new ResizeObserver(updateHeight)
      if (sectionRef.current) ro.observe(sectionRef.current)
      cleanup = () => {
        window.removeEventListener('resize', updateHeight)
        ro.disconnect()
      }
    })
    return () => {
      cancelAnimationFrame(raf)
      cleanup?.()
    }
  }, [productName, headline, subheadline, image])

  const handleCtaPress = (href: string) => {
    if (href.startsWith('/')) router.push(href)
    else window.location.href = href
  }

  return (
    <BlockReveal>
    <section ref={sectionRef} style={{ width: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: purpleHeight,
          background: '#3F007F',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <SurfaceProvider level={0} hasBoldBackground>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <GridBlock as="div">
          <div style={{ ...cell, display: 'flex', flexDirection: 'column', paddingTop: 'var(--ds-spacing-3xl)', gap: 'var(--ds-spacing-2xl)' }}>
            {(productName || headline) && (
              <BlockContainer contentWidth="default">
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)' }}>
                  {productName && <Text size="L" weight="high" color="on-bold-high" align="center" as="span">{productName}</Text>}
                  {headline && <Display size="L" as="h1" color="on-bold-high" align="center" style={{ lineHeight: 1.1 }}>{headline}</Display>}
                </div>
              </BlockContainer>
            )}
            {subheadline && (
              <BlockContainer contentWidth="editorial">
                <Text size="S" weight="low" color="on-bold-high" align="center" as="p" style={{ margin: 0, lineHeight: 1.4, textAlign: 'center' }}>{subheadline}</Text>
              </BlockContainer>
            )}
            {(ctaText || cta2Text) && (
              <BlockContainer contentWidth="default">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-l)', justifyContent: 'center' }}>
                  {ctaText && ctaLink && <Button appearance="primary" size="XS" attention="high" onPress={() => handleCtaPress(ctaLink)}>{ctaText}</Button>}
                  {cta2Text && cta2Link && <Button appearance="primary" size="XS" attention="medium" onPress={() => handleCtaPress(cta2Link)}>{cta2Text}</Button>}
                </div>
              </BlockContainer>
            )}
            <BlockContainer contentWidth="wide">
              <div ref={imageRef} style={{ aspectRatio: '2 / 1', overflow: 'hidden', borderRadius: 'var(--ds-radius-card)' }}>
                {image ? (
                  <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--ds-color-background-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text size="M" weight="medium" color="low" as="span">Image 2:1</Text>
                  </div>
                )}
              </div>
            </BlockContainer>
          </div>
        </GridBlock>
        </div>
      </SurfaceProvider>
    </section>
    </BlockReveal>
  )
}
