export type CardGridCardType = 'media-description-below' | 'media-description-inside'
export type CardGridColumns = 2 | 3 | 4
export type CardGridEmphasis = 'ghost' | 'minimal' | 'subtle' | 'bold'
export type CardGridSurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export type CardGridItem = {
  _type?: 'cardGridItem'
  cardType?: CardGridCardType
  /** @deprecated Use cardType. Maps: image-above → media-description-below, text-on-image → media-description-inside */
  cardStyle?: string
  title: string
  description?: string | null
  image?: string | null
  video?: string | null
  videoUrl?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  imageSlot?: string
}

export type TextOnColourCardGridItem = {
  _type?: 'textOnColourCardItem'
  size?: 'large' | 'small'
  icon?: string | null
  iconImage?: string | null
  title: string
  description?: string | null
  callToActionButtons?: { _key?: string; label: string; link?: string | null; style?: 'filled' | 'outlined' }[] | null
  features?: string[] | null
  backgroundColor?: 'primary' | 'secondary' | 'tertiary' | null
}

export type CardGridBlockItem = CardGridItem | TextOnColourCardGridItem

export type CardGridBlockProps = {
  columns?: CardGridColumns
  title?: string | null
  emphasis?: CardGridEmphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: CardGridSurfaceColour
  items?: CardGridBlockItem[] | null
  /** JioKarna preview: progressive image stream state keyed by slot. */
  images?: Record<string, import('../../hooks/useImageStream').ImageSlotState>
}
