/** Block emphasis: ghost, minimal, subtle, bold. Maps to SurfaceProvider + background. */
export type HeroColourEmphasis = 'ghost' | 'minimal' | 'subtle' | 'bold'

/** Surface colour: primary, secondary, sparkle, neutral. Maps to DS appearance tokens. */
export type HeroColourSurfaceColour = 'primary' | 'secondary' | 'sparkle' | 'neutral'

export type HeroColourContentLayout = 'stacked' | 'sideBySide' | 'mediaOverlay'
export type HeroColourContainerLayout = 'edgeToEdge' | 'contained'
export type HeroColourImageAnchor = 'center' | 'bottom'
export type HeroColourTextAlign = 'left' | 'center'

export type HeroColourProps = {
  productName?: string | null
  headline?: string | null
  subheadline?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  cta2Text?: string | null
  cta2Link?: string | null
  image?: string | null
  videoUrl?: string | null
  contentLayout?: HeroColourContentLayout | null
  containerLayout?: HeroColourContainerLayout | null
  imageAnchor?: HeroColourImageAnchor | null
  textAlign?: HeroColourTextAlign | null
  emphasis?: HeroColourEmphasis | null
  surfaceColour?: HeroColourSurfaceColour | null
}
