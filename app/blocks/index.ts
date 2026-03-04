/**
 * Block Library
 *
 * Central registry of page blocks. All blocks use DS tokens for styling.
 * Add new blocks here and in the Sanity schema.
 */

export { HeroBlock } from './HeroBlock'
export { MediaTextBlock } from './MediaTextBlock'
export { CardGridBlock } from './CardGridBlock/CardGridBlock'
export type { MediaTextBlockProps } from './MediaTextBlock'
export { CarouselBlock } from './CarouselBlock'
export { ProofPointsBlock } from './ProofPointsBlock'
export { BlockContainer } from './BlockContainer'

/** Lab blocks – experimental, not in production page builder */
export { RotatingMediaBlock } from './RotatingMediaBlock/RotatingMediaBlock'
export { FullBleedVerticalCarousel } from './FullBleedVerticalCarousel'

export const BLOCK_REGISTRY = {
  hero: 'HeroBlock',
  mediaTextBlock: 'MediaTextBlock',
  cardGrid: 'CardGridBlock',
  carousel: 'CarouselBlock',
  proofPoints: 'ProofPointsBlock',
} as const

export type BlockType = keyof typeof BLOCK_REGISTRY
