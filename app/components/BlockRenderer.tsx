import {
  HeroBlock,
  MediaTextBlock,
  CardGridBlock,
  CarouselBlock,
  ProofPointsBlock,
  BlockContainer,
} from '../blocks'
import type { MediaTextBlockProps } from '../blocks'

type Block = {
  _type: string
  _key?: string
  spacing?: 'small' | 'medium' | 'large'
  spacingTop?: 'small' | 'medium' | 'large'
  spacingBottom?: 'small' | 'medium' | 'large'
  [key: string]: unknown
}

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '')
}

function mapMediaTextBlock(block: Block): MediaTextBlockProps {
  const template = (isEmpty(block.template) ? 'SideBySide' : block.template) as string
  const rawImagePosition = (isEmpty(block.imagePosition) ? 'right' : block.imagePosition) as string
  const imagePosition = (rawImagePosition?.toLowerCase() === 'left' ? 'left' : 'right') as 'left' | 'right'
  const mediaSize = (block.mediaSize as string) ?? (block.stackedMediaWidth as string) ?? 'default'
  const imageAspectRatio = template === 'SideBySide'
    ? (isEmpty(block.imageAspectRatio) ? '4:3' : block.imageAspectRatio) as string
    : template === 'Stacked'
      ? '2:1'
      : '16:9'

  const sideBySide = imagePosition === 'left' ? 'media-left' : 'media-right'
  const variantMap: Record<string, MediaTextBlockProps['variant']> = {
    SideBySide: sideBySide,
    HeroOverlay: 'full-bleed',
    Stacked: 'centered-media-below',
    TextOnly: 'text-only',
  }
  const variant = variantMap[template] ?? sideBySide

  const aspectRatioMap: Record<string, NonNullable<MediaTextBlockProps['media']>['aspectRatio']> = {
    '16:7': '16:9',
    '21:9': '16:9',
    '16:9': '16:9',
    '4:3': '4:3',
    '3:4': '3:4',
    '1:1': '1:1',
    '2:1': '2:1' as const,
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

  const rawAlign = (() => {
    if (template === 'Stacked') {
      if (mediaSize === 'edgeToEdge') return 'center'
      return (isEmpty(block.stackAlignment) ? 'left' : block.stackAlignment) as string
    }
    if (template === 'HeroOverlay') return (isEmpty(block.overlayAlignment) ? 'left' : block.overlayAlignment) as string
    if (!isEmpty(block.align)) return block.align as string
    return 'left'
  })()
  const alignSource =
    template === 'SideBySide'
      ? 'left'
      : rawAlign?.toLowerCase() === 'center'
        ? 'center'
        : rawAlign?.toLowerCase() === 'left'
          ? 'left'
          : undefined

  const width =
    (template === 'Stacked' || template === 'HeroOverlay') && mediaSize === 'edgeToEdge'
      ? 'edgeToEdge'
      : 'Default'

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
    imagePosition: template === 'SideBySide' ? imagePosition : undefined,
    blockBackground: (() => {
      const bg = (block.blockBackground as string)?.toLowerCase?.()
      return !isEmpty(bg) && ['ghost', 'minimal', 'subtle', 'bold', 'none'].includes(bg) ? bg as MediaTextBlockProps['blockBackground'] : 'ghost'
    })(),
    blockAccent: (() => {
      const acc = (block.blockAccent as string)?.toLowerCase?.()
      return !isEmpty(acc) && ['primary', 'secondary', 'neutral'].includes(acc) ? acc as MediaTextBlockProps['blockAccent'] : 'primary'
    })(),
    spacing: (isEmpty(block.spacing) ? 'large' : block.spacing) as MediaTextBlockProps['spacing'],
    spacingTop: (isEmpty(block.spacingTop) ? undefined : block.spacingTop) as MediaTextBlockProps['spacingTop'] | undefined,
    spacingBottom: (isEmpty(block.spacingBottom) ? undefined : block.spacingBottom) as MediaTextBlockProps['spacingBottom'] | undefined,
    width,
    align: alignSource === 'center' || alignSource === 'left' ? alignSource : undefined,
  }
}

type BlockRendererProps = {
  blocks: Block[] | unknown[] | null | undefined
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks?.length) return null

  const blocks_ = blocks as Block[]
  return (
    <div className="block-stack">
      {blocks_.map((block) => {
        let content: React.ReactNode = null
        switch (block._type) {
          case 'hero': {
            const v = (block.variant as string)?.toLowerCase?.()
            const heroVariant = !isEmpty(v) && ['category', 'product', 'ghost', 'fullscreen'].includes(v) ? v : 'category'
            content = (
              <HeroBlock
                key={block._key || block._type}
                variant={heroVariant as 'category' | 'product' | 'ghost' | 'fullscreen'}
                productName={block.productName as string}
                headline={block.headline as string}
                subheadline={block.subheadline as string}
                ctaText={block.ctaText as string}
                ctaLink={block.ctaLink as string}
                cta2Text={block.cta2Text as string}
                cta2Link={block.cta2Link as string}
                image={block.image as string}
                videoUrl={block.videoUrl as string}
              />
            )
          }
            break
          case 'mediaTextBlock':
            content = (
              <MediaTextBlock key={block._key || block._type} {...mapMediaTextBlock(block)} />
            )
            break
          case 'cardGrid': {
            const surf = (block.surface as string)?.toLowerCase?.()
            const acc = (block.blockAccent as string)?.toLowerCase?.()
            const cardSurf = !isEmpty(surf) && ['ghost', 'minimal', 'subtle', 'bold'].includes(surf) ? surf : 'ghost'
            const cardAcc = !isEmpty(acc) && ['primary', 'secondary', 'neutral'].includes(acc) ? acc : 'primary'
            const cols = block.columns as string
            content = (
              <CardGridBlock
                key={block._key || block._type}
                columns={(parseInt(isEmpty(cols) ? '3' : cols, 10) || 3) as 2 | 3 | 4}
                title={block.title as string}
                blockSurface={cardSurf as 'ghost' | 'minimal' | 'subtle' | 'bold'}
                blockAccent={cardAcc as 'primary' | 'secondary' | 'neutral'}
                items={(block.items as { cardStyle?: string; title?: string; description?: string; image?: string; video?: string; ctaText?: string; ctaLink?: string; surface?: string }[])?.map((i) => ({
                  cardStyle: (isEmpty(i.cardStyle) ? 'image-above' : i.cardStyle) as 'image-above' | 'text-on-colour' | 'text-on-image',
                  title: i.title ?? '',
                  description: i.description,
                  image: i.image,
                  video: i.video,
                  ctaText: i.ctaText,
                  ctaLink: i.ctaLink,
                  surface: (() => {
                    const s = (i.surface as string)?.toLowerCase?.()
                    return !isEmpty(s) && ['subtle', 'bold'].includes(s) ? s as 'subtle' | 'bold' : 'bold'
                  })(),
                }))}
              />
            )
          }
            break
          case 'carousel': {
            const cardSize =
              (block.cardSize as string) === 'large' ? 'large'
              : (block.cardSize as string) === 'medium' ? 'medium'
              : 'compact'
            const carSurf = !isEmpty(block.surface) && ['ghost', 'minimal', 'subtle', 'bold'].includes((block.surface as string)?.toLowerCase?.()) ? (block.surface as string).toLowerCase() : 'ghost'
            const carAcc = !isEmpty(block.blockAccent) && ['primary', 'secondary', 'neutral'].includes((block.blockAccent as string)?.toLowerCase?.()) ? (block.blockAccent as string).toLowerCase() : 'primary'
            content = (
              <CarouselBlock
                key={block._key || block._type}
                title={block.title as string}
                cardSize={cardSize as 'compact' | 'medium' | 'large'}
                surface={carSurf as 'ghost' | 'minimal' | 'subtle' | 'bold'}
                blockAccent={carAcc as 'primary' | 'secondary' | 'neutral'}
                items={((block.items ?? []) as { cardType?: string; title?: string; description?: string; image?: string; video?: string; link?: string; ctaText?: string; aspectRatio?: '4:5' | '8:5' | '2:1' }[]).map((it) => ({
                  ...it,
                  cardType: (isEmpty(it.cardType) ? 'media' : it.cardType) as 'media' | 'text-on-colour',
                  aspectRatio: (isEmpty(it.aspectRatio) ? '4:5' : it.aspectRatio) as '4:5' | '8:5' | '2:1',
                }))}
              />
            )
          }
            break
          case 'proofPoints': {
            const ppSurf = !isEmpty(block.surface) && ['ghost', 'minimal', 'subtle', 'bold'].includes((block.surface as string)?.toLowerCase?.()) ? (block.surface as string).toLowerCase() : 'ghost'
            const ppAcc = !isEmpty(block.blockAccent) && ['primary', 'secondary', 'neutral'].includes((block.blockAccent as string)?.toLowerCase?.()) ? (block.blockAccent as string).toLowerCase() : 'primary'
            content = (
              <ProofPointsBlock
                key={block._key || block._type}
                title={block.title as string}
                blockSurface={ppSurf as 'ghost' | 'minimal' | 'subtle' | 'bold'}
                blockAccent={ppAcc as 'primary' | 'secondary' | 'neutral'}
                items={block.items as { title?: string; description?: string; icon?: string }[]}
              />
            )
          }
            break
          default:
            return null
        }
        if (!content) return null
        const fallbackSpacing = (isEmpty(block.spacing) ? 'large' : block.spacing) as 'small' | 'medium' | 'large'
        const spacingTop =
          block._type === 'hero'
            ? undefined
            : (isEmpty(block.spacingTop) ? fallbackSpacing : block.spacingTop) as 'small' | 'medium' | 'large'
        const spacingBottom = (isEmpty(block.spacingBottom) ? fallbackSpacing : block.spacingBottom) as 'small' | 'medium' | 'large'
        const blockBg = (block.blockBackground as string)?.toLowerCase?.()
        const blockSurf = ((block.surface ?? block.blockSurface) as string)?.toLowerCase?.()
        const hasColouredBackground = Boolean(
          (block._type === 'mediaTextBlock' && blockBg && !['ghost', 'none'].includes(blockBg)) ||
          (['carousel', 'cardGrid', 'proofPoints'].includes(block._type) && blockSurf && blockSurf !== 'ghost')
        )
        const isOverflow =
          block._type === 'mediaTextBlock' && block.mediaStyle === 'overflow'
        return (
          <BlockContainer
            key={block._key || block._type}
            contentWidth="full"
            spacingTop={spacingTop}
            spacingBottom={spacingBottom}
            hasColouredBackground={hasColouredBackground}
            spacingOnlyOnContent={isOverflow}
            style={{ overflow: 'visible' }}
          >
            {content}
          </BlockContainer>
        )
      })}
    </div>
  )
}
