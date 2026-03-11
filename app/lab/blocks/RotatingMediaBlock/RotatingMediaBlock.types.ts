export type RotatingMediaVariant = 'small' | 'large' | 'combined'

export type RotatingMediaItem = {
  image: string
  title?: string | null
  label?: string | null
}

export type RotatingMediaBlockSurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export type RotatingMediaBlockProps = {
  variant?: RotatingMediaVariant
  items?: RotatingMediaItem[] | null
  emphasis?: 'ghost' | 'minimal' | 'subtle' | 'bold'
  surfaceColour?: RotatingMediaBlockSurfaceColour
}
