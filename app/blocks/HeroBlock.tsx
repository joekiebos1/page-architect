'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Display, Text, Button, SurfaceProvider } from '@marcelinodzn/ds-react'
import { getBreakpoints } from '@marcelinodzn/ds-tokens'

type HeroBlockProps = {
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
  const hasImage = Boolean(image)
  const breakpoints = getBreakpoints()

  const handleCtaPress = (link: string) => {
    if (!link) return
    if (link.startsWith('/')) router.push(link)
    else window.location.href = link
  }

  return (
    <>
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 'calc(100% - var(--ds-spacing-hero-panel-trim))',
            zIndex: 0,
            pointerEvents: 'none',
            backgroundColor: '#3F007F',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', paddingBottom: 'var(--ds-spacing-hero-overlap)' }}>
            <SurfaceProvider
              level={0}
              hasBoldBackground
              style={{
                width: '100%',
                boxSizing: 'border-box',
                paddingLeft: 'var(--ds-spacing-hero-sides)',
                paddingRight: 'var(--ds-spacing-hero-sides)',
                paddingTop: 'var(--ds-spacing-2xl)',
                paddingBottom: 'var(--ds-spacing-2xl)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 'var(--ds-breakpoint-desktop)',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 'var(--ds-spacing-m)',
                  textAlign: 'center',
                }}
              >
                {(productName || headline || subheadline || ctaText || cta2Text) ? (
                  <>
                    {productName && <Text size="L" weight="high" color="on-bold-high" align="center" as="span">{productName}</Text>}
                    {headline && <Display size="L" as="h1" color="on-bold-high" align="center" style={{ lineHeight: 1.1 }}>{headline}</Display>}
                    {subheadline && (
                      <Text size="S" weight="low" color="on-bold-high" align="center" as="p" style={{ margin: 0, maxWidth: 'calc(var(--ds-breakpoint-desktop) / 2 + var(--ds-spacing-l))', lineHeight: 1.4, marginInline: 'auto' }}>
                        {subheadline}
                      </Text>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-s)', justifyContent: 'center', marginTop: 'var(--ds-spacing-2xs)' }}>
                      {ctaText && ctaLink && <Button appearance="primary" size="XS" attention="high" onPress={() => handleCtaPress(ctaLink)}>{ctaText}</Button>}
                      {cta2Text && cta2Link && <Button appearance="primary" size="XS" attention="medium" onPress={() => handleCtaPress(cta2Link)}>{cta2Text}</Button>}
                    </div>
                  </>
                ) : (
                  <>
                    <Text size="L" weight="high" color="on-bold-high" align="center" as="span">Home</Text>
                    <Display size="L" as="h1" color="on-bold-high" align="center" style={{ lineHeight: 1.1 }}>Always more.</Display>
                    <Text size="S" weight="low" color="on-bold-high" align="center" as="p" style={{ margin: 0, maxWidth: 'calc(var(--ds-breakpoint-desktop) / 2 + var(--ds-spacing-l))', lineHeight: 1.4, marginInline: 'auto' }}>
                      With JioHome, your connection is just the beginning.
                    </Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-s)', justifyContent: 'center', marginTop: 'var(--ds-spacing-2xs)' }}>
                      <Button appearance="primary" size="XS" attention="high" onPress={() => handleCtaPress('#')}>Get Home</Button>
                      <Button appearance="primary" size="XS" attention="medium" onPress={() => handleCtaPress('#')}>Recharge</Button>
                    </div>
                  </>
                )}
              </div>
            </SurfaceProvider>
          </div>
          <div
            className="hero-parallax-image"
            data-parallax-target="image"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: 'var(--ds-spacing-l)',
              paddingRight: 'var(--ds-spacing-l)',
              paddingTop: 'var(--ds-spacing-s)',
              paddingBottom: 'var(--ds-spacing-xl)',
              marginTop: 'calc(var(--ds-spacing-hero-overlap) * -1)',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 'calc(var(--ds-breakpoint-desktop) - var(--ds-spacing-l) * 2 - var(--ds-spacing-2xl) * 4)',
                marginLeft: 'auto',
                marginRight: 'auto',
                aspectRatio: '16 / 9',
                borderRadius: 'var(--ds-spacing-m)',
                overflow: 'hidden',
                position: 'relative',
                background: hasImage ? undefined : 'var(--ds-color-background-subtle)',
              }}
            >
              {hasImage ? (
                <Image src={image!} alt="" fill sizes={`(max-width: ${breakpoints.tablet}px) 100vw, ${breakpoints.desktop}px`} style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="M" weight="medium" align="center" as="span" style={{ color: 'var(--ds-color-text-medium)' }}>Key visual 16:9</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
