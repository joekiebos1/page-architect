/**
 * ListBlock – Production block types.
 * Two-column layout: block title on left, list on right.
 * Variants: textList, faq, links.
 */

export type ListBlockVariant = 'textList' | 'faq' | 'links'

/** Text list item: title + body + optional link */
export type ListBlockTextItem = {
  title?: string | null
  body?: string | null
  linkText?: string | null
  linkUrl?: string | null
}

/** FAQ item: question (title) + answer (body), accordion expand/collapse */
export type ListBlockFaqItem = {
  title?: string | null
  body?: string | null
}

/** Links item: clickable subtitle (text link, slightly larger than regular) */
export type ListBlockLinkItem = {
  subtitle?: string | null
  linkUrl?: string | null
}

export type ListBlockItem = ListBlockTextItem | ListBlockFaqItem | ListBlockLinkItem

export type ListBlockEmphasis = 'ghost' | 'minimal' | 'subtle' | 'bold'
export type ListBlockSurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export type ListBlockSize = 'hero' | 'feature' | 'editorial'

export type ListBlockProps = {
  blockTitle?: string | null
  listVariant?: ListBlockVariant
  items?: ListBlockItem[] | null
  size?: ListBlockSize
  emphasis?: ListBlockEmphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: ListBlockSurfaceColour
  spacingTop?: 'none' | 'medium' | 'large'
  spacingBottom?: 'none' | 'medium' | 'large'
  /** When true, links open in new tab (target="_blank"). */
  openLinksInNewTab?: boolean
}
