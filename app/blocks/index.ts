/**
 * Block Library
 *
 * Central registry of page blocks. All blocks use DS tokens for styling.
 * Add new blocks here and in the Sanity schema.
 */

export { HeroBlock } from './HeroBlock'
export { FeatureGridBlock } from './FeatureGridBlock'
export { TextImageBlock } from './TextImageBlock'
export { CarouselBlock } from './CarouselBlock'
export { FullBleedVerticalCarousel } from './FullBleedVerticalCarousel'
export { ProofPointsBlock } from './ProofPointsBlock'
export { BlockContainer } from './BlockContainer'

export const BLOCK_REGISTRY = {
  hero: 'HeroBlock',
  featureGrid: 'FeatureGridBlock',
  textImageBlock: 'TextImageBlock',
  carousel: 'CarouselBlock',
  fullBleedVerticalCarousel: 'FullBleedVerticalCarousel',
  proofPoints: 'ProofPointsBlock',
} as const

export type BlockType = keyof typeof BLOCK_REGISTRY
