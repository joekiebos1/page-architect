'use client'

/**
 * Lab – Block experiments
 *
 * Content from Sanity (Lab page). Uses DS components and tokens.
 * FullBleedVerticalCarousel and RotatingMedia are experimental blocks (not in production page builder).
 */

import { Text, DsProvider } from '@marcelinodzn/ds-react'
import {
  TopNavBlock,
  HeroSplit50,
  HeroSplit50Reveal,
  HeroColourImage,
  HeroColourEdge,
} from './blocks'
import { FullBleedVerticalCarousel, RotatingMediaBlock } from '../blocks'
import { mockFullBleedVerticalCarousel, mockRotatingMedia } from './mock-data'
import type { HeroLabProps } from './blocks/HeroVariants/HeroLab.types'

const FALLBACK_HERO: HeroLabProps = {
  productName: 'Product Name',
  headline: 'Designed for the way you live.',
  subheadline: 'Clean lines. Thoughtful details. Built to last.',
  ctaText: 'Shop now',
  ctaLink: '#',
  cta2Text: 'Learn more',
  cta2Link: '#',
  image: null,
  imagePosition: 'right',
}

type LabPageClientProps = {
  title?: string | null
  description?: string | null
  hero?: HeroLabProps | null
}

export function LabPageClient({ title = 'Lab', description, hero }: LabPageClientProps) {
  const heroProps = hero ?? FALLBACK_HERO

  return (
    <>
      <DsProvider platform="Desktop (1440)" colorMode="Light" density="Default" theme="MyJio">
        <TopNavBlock />
      </DsProvider>
      <main className="ds-container" style={{ paddingBlock: 'var(--ds-spacing-2xl)' }}>
        <div style={{ marginBottom: 'var(--ds-spacing-3xl)' }}>
          <h1 style={{ fontSize: 'var(--ds-typography-h2)', fontWeight: 'var(--ds-typography-weight-high)', marginBottom: 'var(--ds-spacing-m)' }}>
            {title}
          </h1>
          {description && (
            <Text size="M" weight="low" color="low" as="p" style={{ margin: 0 }}>
              {description}
            </Text>
          )}
          {!description && (
            <Text size="M" weight="low" color="low" as="p" style={{ margin: 0 }}>
              Hero variants and TopNavBlock mega menu. Manage content in Sanity Studio → Lab.
            </Text>
          )}
        </div>

        <section style={{ marginBottom: 'var(--ds-spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--ds-typography-h4)', fontWeight: 'var(--ds-typography-weight-medium)', marginBottom: 'var(--ds-spacing-l)' }}>
            1. HeroSplit50 – 50/50 split
          </h2>
          <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, marginBottom: 'var(--ds-spacing-l)' }}>
            Text and image side by side. Reduces visual weight by giving the image only half the space.
          </Text>
          <HeroSplit50 {...heroProps} />
        </section>

        <section style={{ marginBottom: 'var(--ds-spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--ds-typography-h4)', fontWeight: 'var(--ds-typography-weight-medium)', marginBottom: 'var(--ds-spacing-l)' }}>
            2. HeroSplit50Reveal – 50/50 with scroll transition
          </h2>
          <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, marginBottom: 'var(--ds-spacing-l)' }}>
            Same layout. Image fades and slides in when entering viewport.
          </Text>
          <HeroSplit50Reveal {...heroProps} />
        </section>

        <section style={{ marginBottom: 'var(--ds-spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--ds-typography-h4)', fontWeight: 'var(--ds-typography-weight-medium)', marginBottom: 'var(--ds-spacing-l)' }}>
            3. HeroColourImage – Colour band + image
          </h2>
          <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, marginBottom: 'var(--ds-spacing-l)' }}>
            Bold colour holds the text. Strong visual separation. Image feels contained.
          </Text>
          <HeroColourImage {...heroProps} />
        </section>

        <section style={{ marginBottom: 'var(--ds-spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--ds-typography-h4)', fontWeight: 'var(--ds-typography-weight-medium)', marginBottom: 'var(--ds-spacing-l)' }}>
            4. HeroColourEdge – Full image with gradient overlay
          </h2>
          <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, marginBottom: 'var(--ds-spacing-l)' }}>
            Image fills the hero. Soft gradient from one edge holds the text.
          </Text>
          <HeroColourEdge {...heroProps} />
        </section>

        <section style={{ marginBottom: 'var(--ds-spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--ds-typography-h4)', fontWeight: 'var(--ds-typography-weight-medium)', marginBottom: 'var(--ds-spacing-l)' }}>
            5. FullBleedVerticalCarousel – Experimental
          </h2>
          <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, marginBottom: 'var(--ds-spacing-l)' }}>
            Full-bleed vertical carousel. Sticky images, scrolling text. Moved to Lab for experimentation.
          </Text>
          <FullBleedVerticalCarousel
            surface={mockFullBleedVerticalCarousel.surface}
            items={mockFullBleedVerticalCarousel.items}
          />
        </section>

        <section style={{ marginBottom: 'var(--ds-spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--ds-typography-h4)', fontWeight: 'var(--ds-typography-weight-medium)', marginBottom: 'var(--ds-spacing-l)' }}>
            6. RotatingMedia – Experimental
          </h2>
          <Text size="S" weight="low" color="low" as="p" style={{ margin: 0, marginBottom: 'var(--ds-spacing-l)' }}>
            Auto-rotating media carousel. Small: 2×4 grid. Large: single full-width card. Moved to Lab for experimentation.
          </Text>
          <RotatingMediaBlock
            variant={mockRotatingMedia.variant}
            surface={mockRotatingMedia.surface}
            items={mockRotatingMedia.items}
          />
        </section>
      </main>
    </>
  )
}
