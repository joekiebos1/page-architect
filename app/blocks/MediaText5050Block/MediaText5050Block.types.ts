export type MediaText5050Variant = 'paragraphs' | 'accordion'

export type MediaText5050ImagePosition = 'left' | 'right'

export type MediaText5050Emphasis = 'ghost' | 'none' | 'minimal' | 'subtle' | 'bold'
export type MediaText5050SurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export interface MediaText5050Media {
  type: 'image' | 'video'
  src: string
  alt?: string
  poster?: string
  aspectRatio?: '5:4' | '1:1' | '4:5'
}

export interface MediaText5050Item {
  subtitle?: string
  body?: string
}

export interface MediaText5050BlockProps {
  variant: MediaText5050Variant
  imagePosition?: MediaText5050ImagePosition
  emphasis?: MediaText5050Emphasis
  minimalBackgroundStyle?: 'block' | 'gradient' | null
  surfaceColour?: MediaText5050SurfaceColour
  spacingTop?: 'none' | 'medium' | 'large'
  spacingBottom?: 'none' | 'medium' | 'large'
  /** Block-level heading above all content */
  headline?: string
  /** Unified items array – both variants use subtitle + body */
  items?: MediaText5050Item[]
  media?: MediaText5050Media
  /** JioKarna preview: progressive image stream slot and state */
  imageSlot?: string | null
  imageState?: import('../../hooks/useImageStream').ImageSlotState | null
}
