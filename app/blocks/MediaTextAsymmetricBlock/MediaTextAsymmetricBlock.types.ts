/**
 * Media + Text Asymmetric — CMS `_type` is `mediaTextAsymmetric`; field `variant` selects pattern.
 */

export type {
  MediaTextAsymmetricEmphasis,
  MediaTextAsymmetricSurfaceColour,
  MediaTextAsymmetricSize,
  MediaTextAsymmetricTextItem,
  MediaTextAsymmetricFaqItem,
  MediaTextAsymmetricLinkItem,
  MediaTextAsymmetricItem,
} from '../../../lib/blocks/media-text-asymmetric-shared.types'

import type {
  MediaTextAsymmetricEmphasis,
  MediaTextAsymmetricItem,
  MediaTextAsymmetricSize,
  MediaTextAsymmetricSurfaceColour,
} from '../../../lib/blocks/media-text-asymmetric-shared.types'

export type MediaTextAsymmetricVariant =
  | 'textList'
  | 'paragraphs'
  | 'faq'
  | 'links'
  | 'longForm'
  | 'image'

export type MediaTextAsymmetricLongFormBodyTypography = 'regular' | 'large'

export type MediaTextAsymmetricLongFormParagraph = {
  _key?: string
  text?: string | null
  bodyTypography?: MediaTextAsymmetricLongFormBodyTypography
}

export type MediaTextAsymmetricParagraphBodyTypography = 'regular' | 'large'

export type MediaTextAsymmetricParagraphRow = {
  _key?: string
  title?: string | null
  body?: string | null
  bodyTypography?: MediaTextAsymmetricParagraphBodyTypography
  linkText?: string | null
  linkUrl?: string | null
}

export type MediaTextAsymmetricImageAspectRatio = '5:4' | '1:1' | '4:5'

export type MediaTextAsymmetricBlockProps = {
  blockTitle?: string | null
  variant?: MediaTextAsymmetricVariant
  longFormParagraphs?: MediaTextAsymmetricLongFormParagraph[] | null
  paragraphRows?: MediaTextAsymmetricParagraphRow[] | null
  items?: MediaTextAsymmetricItem[] | null
  /** Resolved main-column image URL when variant is `image`. */
  mainImageSrc?: string | null
  imageAspectRatio?: MediaTextAsymmetricImageAspectRatio | null
  imageAlt?: string | null
  size?: MediaTextAsymmetricSize
  emphasis?: MediaTextAsymmetricEmphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: MediaTextAsymmetricSurfaceColour
  spacingTop?: 'none' | 'medium' | 'large'
  spacingBottom?: 'none' | 'medium' | 'large'
  /** When true, links open in a new tab (target="_blank"). */
  openLinksInNewTab?: boolean
}
