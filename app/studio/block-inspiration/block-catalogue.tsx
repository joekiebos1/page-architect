'use client'

/**
 * Block Inspiration – catalogue of all blocks with metadata and preview renderers.
 */

import React from 'react'
import {
  HeroBlock,
  MediaTextBlock,
  MediaText5050Block,
  CardGridBlock,
  CarouselBlock,
  ProofPointsBlock,
  IconGridBlock,
  ListBlock,
} from '../../blocks'
import {
  FullBleedVerticalCarousel,
  RotatingMediaBlock,
  MediaZoomOutOnScroll,
  TopNavBlock,
} from '../../lab/blocks'
import { SurfaceProvider } from '@marcelinodzn/ds-react'

const PLACEHOLDER = '/placeholder-preview.svg'

export type BlockCatalogueEntry = {
  id: string
  name: string
  description: string
  creativeUses: string[]
  /** Production or Lab */
  tier: 'production' | 'lab'
  /** Renders a small preview of the block */
  Preview: React.ComponentType
}

const PREVIEW_SCALE = 0.18
const PREVIEW_WIDTH = 280
const PREVIEW_HEIGHT = 180
const PREVIEW_INNER_WIDTH = PREVIEW_WIDTH / PREVIEW_SCALE
const PREVIEW_INNER_HEIGHT = PREVIEW_HEIGHT / PREVIEW_SCALE

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        overflow: 'hidden',
        borderRadius: 'var(--ds-radius-m)',
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'var(--ds-color-background-ghost)',
      }}
    >
      <div
        style={{
          transform: `scale(${PREVIEW_SCALE})`,
          transformOrigin: 'top left',
          width: PREVIEW_INNER_WIDTH,
          height: PREVIEW_INNER_HEIGHT,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const BLOCK_CATALOGUE: BlockCatalogueEntry[] = [
  {
    id: 'hero',
    name: 'Hero',
    description: 'Full-width hero section with headline, subheadline, media and CTAs. Supports stacked, side-by-side, category, media overlay and text-only layouts.',
    tier: 'production',
    creativeUses: [
      'Product launch announcements with bold imagery',
      'Campaign landing with media overlay and centred text',
      'Category pages with colour band extending into media',
      'Text-only hero for editorial or minimal layouts',
    ],
    Preview: () => (
      <PreviewFrame>
        <HeroBlock
          headline="Designed for the way you live"
          subheadline="Clean lines. Thoughtful details."
          ctaText="Shop now"
          image={PLACEHOLDER}
          contentLayout="stacked"
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'mediaText',
    name: 'Media + Text (Stacked)',
    description: 'Stacked or overlay layout with media above or behind text. Supports contained and edge-to-edge media.',
    tier: 'production',
    creativeUses: [
      'Feature highlights with image or video',
      'Overlay for dramatic full-bleed imagery',
      'Text-only variant for editorial sections',
    ],
    Preview: () => (
      <PreviewFrame>
        <MediaTextBlock
          headline="Feature highlight"
          subhead="Supporting copy for the visual."
          media={{ type: 'image', src: PLACEHOLDER, aspectRatio: '2:1' }}
          variant="centered-media-below"
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'mediaText5050',
    name: 'Media + Text (50/50)',
    description: 'Side-by-side layout with paragraphs or accordion. Image position left or right.',
    tier: 'production',
    creativeUses: [
      'Product specs with imagery',
      'FAQ or accordion with supporting visual',
      'Alternating content blocks down the page',
    ],
    Preview: () => (
      <PreviewFrame>
        <MediaText5050Block
          items={[{ subtitle: 'Feature', body: 'Supporting copy.' }]}
          media={{ type: 'image', src: PLACEHOLDER }}
          imagePosition="right"
          variant="paragraphs"
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'cardGrid',
    name: 'Card Grid',
    description: 'Responsive grid of cards. Supports media cards, text-on-colour and text-on-image variants.',
    tier: 'production',
    creativeUses: [
      'Product or service showcases',
      'Feature grids with icons or imagery',
      'Promotional tiles with CTAs',
    ],
    Preview: () => (
      <PreviewFrame>
        <CardGridBlock
          columns={3}
          items={[
            { title: 'Card 1', description: 'Desc', image: PLACEHOLDER, cardType: 'media-description-below' },
            { title: 'Card 2', description: 'Desc', image: PLACEHOLDER, cardType: 'media-description-below' },
            { title: 'Card 3', description: 'Desc', image: PLACEHOLDER, cardType: 'media-description-below' },
          ]}
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'carousel',
    name: 'Carousel',
    description: 'Horizontal carousel of cards. Compact, medium or large card sizes. Responsive column counts.',
    tier: 'production',
    creativeUses: [
      'Product carousels on category pages',
      'Featured content or recommendations',
      'Testimonial or case study slides',
    ],
    Preview: () => (
      <PreviewFrame>
        <CarouselBlock
          items={[
            { title: 'Card 1', description: 'Desc', image: PLACEHOLDER, cardType: 'media', aspectRatio: '4:5' },
            { title: 'Card 2', description: 'Desc', image: PLACEHOLDER, cardType: 'media', aspectRatio: '4:5' },
          ]}
          cardSize="medium"
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'proofPoints',
    name: 'Proof Points',
    description: 'Icon or stat variant. Highlights key benefits or metrics.',
    tier: 'production',
    creativeUses: [
      'Feature benefits with icons',
      'Stats or numbers for credibility',
      'Trust signals on product pages',
    ],
    Preview: () => (
      <PreviewFrame>
        <ProofPointsBlock
          title="Why choose us"
          variant="icon"
          items={[
            { title: 'Fast', icon: 'IcCheckboxOn' },
            { title: 'Reliable', icon: 'IcCheckboxOn' },
            { title: 'Secure', icon: 'IcCheckboxOn' },
          ]}
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'iconGrid',
    name: 'Icon Grid',
    description: 'Grid of icons with titles. Supports spectrum colours and accent colours.',
    tier: 'production',
    creativeUses: [
      'Service or feature overview',
      'Category quick links',
      'Value propositions with icons',
    ],
    Preview: () => (
      <PreviewFrame>
        <IconGridBlock
          items={[
            { icon: 'IcStar', title: 'Feature 1', accentColor: 'primary' },
            { icon: 'IcStar', title: 'Feature 2', accentColor: 'primary' },
            { icon: 'IcStar', title: 'Feature 3', accentColor: 'primary' },
          ]}
          columns={3}
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'list',
    name: 'List',
    description: 'Text list, FAQ or links variant. Collapsible FAQ items.',
    tier: 'production',
    creativeUses: [
      'FAQ sections',
      'Link lists or navigation',
      'Bullet-point features',
    ],
    Preview: () => (
      <PreviewFrame>
        <ListBlock
          blockTitle="FAQ"
          listVariant="faq"
          items={[
            { title: 'Question 1?', body: 'Answer.' },
            { title: 'Question 2?', body: 'Answer.' },
          ]}
          emphasis="ghost"
        />
      </PreviewFrame>
    ),
  },
  {
    id: 'fullBleedVerticalCarousel',
    name: 'Full Bleed Vertical Carousel',
    description: 'Full-viewport vertical carousel. Each item has full-bleed media and scrolling text overlay.',
    tier: 'lab',
    creativeUses: [
      'Product storytelling with immersive scroll',
      'Campaign narratives with multiple stories',
      'Editorial or editorial-style content',
    ],
    Preview: () => (
      <PreviewFrame>
        <SurfaceProvider level={0}>
          <FullBleedVerticalCarousel
            emphasis="ghost"
            items={[
              { title: 'Story 1', description: 'Description.', image: PLACEHOLDER },
              { title: 'Story 2', description: 'Description.', image: PLACEHOLDER },
            ]}
          />
        </SurfaceProvider>
      </PreviewFrame>
    ),
  },
  {
    id: 'rotatingMedia',
    name: 'Rotating Media',
    description: 'Rotating carousel of media cards. Small, large or combined variants.',
    tier: 'lab',
    creativeUses: [
      'Product imagery with rotation',
      'Brand or campaign visuals',
      'Featured content carousel',
    ],
    Preview: () => (
      <PreviewFrame>
        <SurfaceProvider level={0}>
          <RotatingMediaBlock
            variant="small"
            emphasis="ghost"
            items={[
              { image: PLACEHOLDER, title: 'Card 1', label: 'Label' },
              { image: PLACEHOLDER, title: 'Card 2', label: 'Label' },
            ]}
          />
        </SurfaceProvider>
      </PreviewFrame>
    ),
  },
  {
    id: 'mediaZoomOutOnScroll',
    name: 'Media Zoom Out on Scroll',
    description: 'Media that zooms out as you scroll. Image or video.',
    tier: 'lab',
    creativeUses: [
      'Immersive hero or section transitions',
      'Video with scroll-driven reveal',
      'Editorial or editorial-style layouts',
    ],
    Preview: () => (
      <PreviewFrame>
        <SurfaceProvider level={0}>
          <MediaZoomOutOnScroll image={PLACEHOLDER} alt="Preview" />
        </SurfaceProvider>
      </PreviewFrame>
    ),
  },
  {
    id: 'topNav',
    name: 'Top Nav (Mega Menu)',
    description: 'Mega menu navigation. Supports dropdowns and links.',
    tier: 'lab',
    creativeUses: [
      'Site navigation with mega menu',
      'Category browsing',
      'Header with dropdown panels',
    ],
    Preview: () => (
      <PreviewFrame>
        <SurfaceProvider level={0}>
          <TopNavBlock />
        </SurfaceProvider>
      </PreviewFrame>
    ),
  },
]
