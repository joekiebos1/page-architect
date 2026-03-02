export type MediaTextBlockSize = 'hero' | 'feature' | 'editorial'

export type MediaTextBlockVariant =
  | 'media-right'
  | 'media-left'
  | 'text-only'
  | 'centered-media-below'
  | 'full-bleed'
  | 'split'

export type MediaTextBlockWidth = 'narrow' | 'default' | 'wide' | 'edgeToEdge'
export type MediaTextBlockAlign = 'left' | 'center'

export type MediaTextBlockAspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | 'auto'
export type SurfaceMode = 'ghost' | 'minimal' | 'subtle' | 'bold'

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

export interface MediaTextBlockProps {
  size?: MediaTextBlockSize
  variant?: MediaTextBlockVariant
  width?: MediaTextBlockWidth
  surface?: SurfaceMode
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
