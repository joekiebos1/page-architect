export type MediaTextBlockSize = 'hero' | 'feature' | 'editorial'

export type MediaTextBlockVariant =
  | 'media-right'
  | 'media-left'
  | 'text-only'
  | 'centered-media-below'
  | 'full-bleed'

export type MediaTextBlockWidth = 'XS' | 'S' | 'M' | 'Default' | 'Wide' | 'edgeToEdge'
export type MediaTextBlockAlign = 'left' | 'center'
export type MediaTextBlockMediaStyle = 'contained' | 'overflow'
export type MediaTextBlockSpacing = 'small' | 'medium' | 'large'

export type MediaTextBlockAspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '2:1' | 'auto'
/** Block emphasis: content author chooses this; DS components adapt automatically. */
export type BlockBackgroundMode = 'ghost' | 'none' | 'minimal' | 'subtle' | 'bold'
/** Block accent/colour theme: primary, secondary, neutral. DS appearance tokens. */
export type BlockAccent = 'primary' | 'secondary' | 'neutral'

export interface MediaTextBlockMedia {
  type: 'image' | 'video'
  src: string
  alt?: string
  poster?: string
  aspectRatio?: MediaTextBlockAspectRatio
}

export interface MediaTextBlockCTA {
  label: string
  href: string
  appearance?: 'primary' | 'secondary' | 'ghost'
}

export type MediaTextBlockImagePosition = 'left' | 'right'

export interface MediaTextBlockProps {
  size?: MediaTextBlockSize
  variant?: MediaTextBlockVariant
  /** For SideBySide: image on left or right. Takes precedence over variant when provided. */
  imagePosition?: MediaTextBlockImagePosition
  width?: MediaTextBlockWidth
  mediaStyle?: MediaTextBlockMediaStyle
  blockBackground?: BlockBackgroundMode
  blockAccent?: BlockAccent
  spacing?: MediaTextBlockSpacing
  spacingTop?: MediaTextBlockSpacing
  spacingBottom?: MediaTextBlockSpacing
  align?: MediaTextBlockAlign
  eyebrow?: string
  headline: string
  subhead?: string
  body?: string
  bulletList?: string[]
  cta?: MediaTextBlockCTA
  ctaSecondary?: MediaTextBlockCTA
  media?: MediaTextBlockMedia
}
