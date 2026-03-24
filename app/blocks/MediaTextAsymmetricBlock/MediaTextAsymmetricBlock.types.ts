/**
 * Media + Text Asymmetric — CMS `_type` is `mediaTextAsymmetric`; field `variant` selects pattern.
 */

export type MediaTextAsymmetricVariant = 'textList' | 'faq' | 'links' | 'longForm'

export type MediaTextAsymmetricTextItem = {
  title?: string | null
  body?: string | null
  linkText?: string | null
  linkUrl?: string | null
}

export type MediaTextAsymmetricFaqItem = {
  title?: string | null
  body?: string | null
}

export type MediaTextAsymmetricLinkItem = {
  subtitle?: string | null
  linkUrl?: string | null
}

export type MediaTextAsymmetricItem =
  | MediaTextAsymmetricTextItem
  | MediaTextAsymmetricFaqItem
  | MediaTextAsymmetricLinkItem

export type MediaTextAsymmetricEmphasis = 'ghost' | 'minimal' | 'subtle' | 'bold'
export type MediaTextAsymmetricSurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export type MediaTextAsymmetricSize = 'hero' | 'feature' | 'editorial'

export type MediaTextAsymmetricLongFormBodyTypography = 'regular' | 'large'

export type MediaTextAsymmetricLongFormParagraph = {
  _key?: string
  text?: string | null
  bodyTypography?: MediaTextAsymmetricLongFormBodyTypography
}

export type MediaTextAsymmetricBlockProps = {
  blockTitle?: string | null
  variant?: MediaTextAsymmetricVariant
  longFormParagraphs?: MediaTextAsymmetricLongFormParagraph[] | null
  items?: MediaTextAsymmetricItem[] | null
  size?: MediaTextAsymmetricSize
  emphasis?: MediaTextAsymmetricEmphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: MediaTextAsymmetricSurfaceColour
  spacingTop?: 'none' | 'medium' | 'large'
  spacingBottom?: 'none' | 'medium' | 'large'
  /** When true, links open in a new tab (target="_blank"). */
  openLinksInNewTab?: boolean
}
