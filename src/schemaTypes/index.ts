import { pageType } from './page'
import { pageBuilderType } from './pageBuilder'
import { heroBlock } from './blocks/hero'
import { featureGridBlock } from './blocks/featureGrid'
import { textImageBlock } from './blocks/textImageBlock'
import {
  fullBleedVerticalCarouselBlock,
  fullBleedVerticalCarouselItem,
} from './blocks/fullBleedVerticalCarousel'
import { cardBlock, cardItem } from './blocks/cardBlock'
import { carouselBlock } from './blocks/carousel'
import { proofPointsBlock } from './blocks/proofPoints'

export const schemaTypes = [
  pageType,
  pageBuilderType,
  heroBlock,
  featureGridBlock,
  textImageBlock,
  fullBleedVerticalCarouselItem,
  fullBleedVerticalCarouselBlock,
  cardItem,
  cardBlock,
  carouselBlock,
  proofPointsBlock,
]
