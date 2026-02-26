import { HeroBlock } from './HeroBlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { TextImageBlock } from './TextImageBlock'
import { FullBleedVerticalCarousel } from './FullBleedVerticalCarousel'

type Block = {
  _type: string
  _key?: string
  [key: string]: unknown
}

type BlockRendererProps = {
  blocks: Block[] | unknown[] | null | undefined
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks?.length) return null

  return (
    <>
      {(blocks as Block[]).map((block) => {
        switch (block._type) {
          case 'hero':
            return (
              <HeroBlock
                key={block._key || block._type}
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
          case 'featureGrid':
            return (
              <FeatureGridBlock
                key={block._key || block._type}
                title={block.title as string}
                items={block.items as { title?: string; description?: string }[]}
              />
            )
          case 'textImageBlock':
            return (
              <TextImageBlock
                key={block._key || block._type}
                title={block.title as string}
                body={block.body as string}
                ctaText={block.ctaText as string}
                ctaLink={block.ctaLink as string}
                image={block.image as string}
                imagePosition={block.imagePosition as 'left' | 'right'}
              />
            )
          case 'fullBleedVerticalCarousel':
            return (
              <FullBleedVerticalCarousel
                key={block._key || block._type}
                items={block.items as { title?: string; description?: string; image?: string; video?: string }[]}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
