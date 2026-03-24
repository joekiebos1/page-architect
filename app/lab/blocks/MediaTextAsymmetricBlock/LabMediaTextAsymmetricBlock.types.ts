import type {
  MediaTextAsymmetricEmphasis,
  MediaTextAsymmetricFaqItem,
  MediaTextAsymmetricLinkItem,
  MediaTextAsymmetricSize,
  MediaTextAsymmetricSurfaceColour,
} from '../../../blocks/MediaTextAsymmetricBlock/MediaTextAsymmetricBlock.types'

/** Lab-only `_type` is `labMediaTextAsymmetric`; `variant` selects pattern (merged paragraphs + long-form). */
export type LabMediaTextAsymmetricVariant = 'paragraphs' | 'faq' | 'links'

export type LabMediaTextAsymmetricBodyTypography = 'regular' | 'large'

export type LabMediaTextAsymmetricParagraphRow = {
  _key?: string
  title?: string | null
  body?: string | null
  bodyTypography?: LabMediaTextAsymmetricBodyTypography
  linkText?: string | null
  linkUrl?: string | null
}

export type LabMediaTextAsymmetricItem = MediaTextAsymmetricFaqItem | MediaTextAsymmetricLinkItem

export type LabMediaTextAsymmetricBlockProps = {
  blockTitle?: string | null
  variant?: LabMediaTextAsymmetricVariant
  paragraphRows?: LabMediaTextAsymmetricParagraphRow[] | null
  items?: LabMediaTextAsymmetricItem[] | null
  size?: MediaTextAsymmetricSize
  emphasis?: MediaTextAsymmetricEmphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: MediaTextAsymmetricSurfaceColour
  spacingTop?: 'none' | 'medium' | 'large'
  spacingBottom?: 'none' | 'medium' | 'large'
  openLinksInNewTab?: boolean
}
