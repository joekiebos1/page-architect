import {
  HeroBlock,
  FeatureGridBlock,
  MediaTextBlock,
  FullBleedVerticalCarousel,
  CarouselBlock,
  ProofPointsBlock,
} from '../blocks'
import type { MediaTextBlockProps } from '../blocks'

type Block = {
  _type: string
  _key?: string
  spacing?: 'small' | 'medium' | 'large'
  [key: string]: unknown
}

function mapMediaTextBlock(block: Block): MediaTextBlockProps {
  const template = (block.template as string) ?? 'SideBySide'
  const imagePosition = (block.imagePosition as string) ?? 'right'
  const contentWidth = (block.contentWidth as string) ?? 'default'
  const imageAspectRatio = (block.imageAspectRatio as string) ?? '4:3'

  const variantMap: Record<string, MediaTextBlockProps['variant']> = {
    SideBySide: imagePosition === 'left' ? 'media-left' : 'media-right',
    SideBySideNarrow: imagePosition === 'left' ? 'media-left' : 'media-right',
    SideBySideWide: imagePosition === 'left' ? 'media-left' : 'media-right',
    HeroOverlay: 'full-bleed',
    Stacked: 'centered-media-below',
    TextOnly: 'text-only',
  }
  const variant = variantMap[template] ?? 'media-right'

  const aspectRatioMap: Record<string, NonNullable<MediaTextBlockProps['media']>['aspectRatio']> = {
    '16:7': '16:9',
    '21:9': '16:9',
    '16:9': '16:9',
    '4:3': '4:3',
    '3:4': '3:4',
    '1:1': '1:1',
  }
  const aspectRatio = aspectRatioMap[imageAspectRatio] ?? '16:9'

  const imageUrl = block.image as string | undefined
  const videoUrl = block.video as string | undefined
  const hasVideo = videoUrl && typeof videoUrl === 'string' && videoUrl.trim() !== ''
  const hasImage = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
  const media =
    hasVideo
      ? { type: 'video' as const, src: videoUrl!, poster: hasImage ? imageUrl : undefined, alt: '', aspectRatio }
      : hasImage
        ? { type: 'image' as const, src: imageUrl!, alt: '', aspectRatio }
        : undefined

  const bulletList = block.bulletList as string[] | undefined
  const bulletListFiltered = Array.isArray(bulletList) ? bulletList.filter((b): b is string => typeof b === 'string').slice(0, 6) : undefined

  const alignSource =
    (block.align as 'left' | 'center' | undefined) ??
    (template === 'HeroOverlay' ? (block.overlayAlignment as 'left' | 'center' | undefined) : undefined) ??
    (template === 'Stacked' ? (block.stackAlignment as 'left' | 'center' | undefined) : undefined)

  return {
    headline: (block.title as string) ?? '',
    eyebrow: block.eyebrow as string | undefined,
    subhead: block.subhead as string | undefined,
    body: block.body as string | undefined,
    bulletList: bulletListFiltered?.length ? bulletListFiltered : undefined,
    cta:
      block.ctaText && block.ctaLink
        ? { label: block.ctaText as string, href: block.ctaLink as string }
        : undefined,
    ctaSecondary:
      block.cta2Text && block.cta2Link
        ? { label: block.cta2Text as string, href: block.cta2Link as string }
        : undefined,
    media,
    variant,
    size: (block.size as MediaTextBlockProps['size']) ?? 'feature',
    width:
      contentWidth === 'edgeToEdge' || contentWidth === 'full' /* full = legacy, map to edgeToEdge */
        ? 'edgeToEdge'
        : contentWidth === 'wide'
          ? 'wide'
          : contentWidth === 'editorial'
            ? 'narrow' /* editorial is for body copy; block uses narrow */
            : contentWidth === 'default'
              ? 'default'
              : 'narrow',
    align: alignSource === 'center' || alignSource === 'left' ? alignSource : undefined,
  }
}

type BlockRendererProps = {
  blocks: Block[] | unknown[] | null | undefined
}

const SPACING_VAR: Record<string, string> = {
  small: 'var(--ds-spacing-2xl)',
  medium: 'var(--ds-spacing-4xl)',
  large: 'var(--ds-spacing-block-gap-chapter)',
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks?.length) return null

  const blocks_ = blocks as Block[]
  return (
    <div className="block-stack">
      {blocks_.map((block, index) => {
        const blockSpacing = (block.spacing as string) ?? 'medium'
        const marginBottom = SPACING_VAR[blockSpacing] ?? SPACING_VAR.medium
        let content: React.ReactNode = null
        switch (block._type) {
          case 'hero':
            content = (
              <HeroBlock
                key={block._key || block._type}
                variant={(block.variant as 'category' | 'product') ?? 'category'}
                productName={block.productName as string}
                headline={block.headline as string}
                subheadline={block.subheadline as string}
                ctaText={block.ctaText as string}
                ctaLink={block.ctaLink as string}
                cta2Text={block.cta2Text as string}
                cta2Link={block.cta2Link as string}
                image={block.image as string}
              />
            )
            break
          case 'featureGrid':
            content = (
              <FeatureGridBlock
                key={block._key || block._type}
                title={block.title as string}
                titleLevel={(block.titleLevel as 'h2' | 'h3' | 'h4') ?? 'h2'}
                items={block.items as { title?: string; description?: string }[]}
              />
            )
            break
          case 'mediaTextBlock':
            content = (
              <MediaTextBlock key={block._key || block._type} {...mapMediaTextBlock(block)} />
            )
            break
          case 'fullBleedVerticalCarousel':
            content = (
              <FullBleedVerticalCarousel
                key={block._key || block._type}
                items={block.items as { title?: string; description?: string; image?: string; video?: string }[]}
              />
            )
            break
          case 'carousel':
            content = (
              <CarouselBlock
                key={block._key || block._type}
                title={block.title as string}
                titleLevel={(block.titleLevel as 'h2' | 'h3' | 'h4') ?? 'h2'}
                cardSize={(block.cardSize as 'compact' | 'large') ?? 'compact'}
                items={block.items as { title?: string; description?: string; image?: string; video?: string; link?: string; ctaText?: string; aspectRatio?: '4:5' | '8:5' | '2:1' }[]}
              />
            )
            break
          case 'proofPoints':
            content = (
              <ProofPointsBlock
                key={block._key || block._type}
                title={block.title as string}
                titleLevel={(block.titleLevel as 'h2' | 'h3' | 'h4') ?? 'h2'}
                items={block.items as { title?: string; description?: string; icon?: string }[]}
              />
            )
            break
          default:
            return null
        }
        if (!content) return null
        const isLast = index === blocks_.length - 1
        return (
          <div key={block._key || block._type} style={{ marginBottom: isLast ? 0 : marginBottom }}>
            {content}
          </div>
        )
      })}
    </div>
  )
}
