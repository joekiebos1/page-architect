'use client'

import { useRouter } from 'next/navigation'
import {
  Display,
  Text,
  Button,
  SurfaceProvider,
  useDsContext,
} from '@marcelinodzn/ds-react'
import { spacing } from '@marcelinodzn/ds-tokens'

type HeroBlockProps = {
  headline?: string | null
  subheadline?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  image?: string | null
}

export function HeroBlock({ headline, subheadline, ctaText, ctaLink, image }: HeroBlockProps) {
  const router = useRouter()
  const { tokenContext } = useDsContext()
  const hasImage = Boolean(image)
  const isInternalLink = ctaLink?.startsWith('/') ?? false

  const paddingY = tokenContext ? spacing.get('3XL', tokenContext) : 48
  const paddingX = tokenContext ? spacing.get('L', tokenContext) : 32
  const contentGap = tokenContext ? spacing.get('L', tokenContext) : 24

  const handleCtaPress = () => {
    if (!ctaLink) return
    if (isInternalLink) {
      router.push(ctaLink)
    } else {
      window.location.href = ctaLink
    }
  }

  return (
    <SurfaceProvider
      level={0}
      hasBoldBackground={hasImage}
      style={{
        padding: `${paddingY ?? 48}px ${paddingX ?? 32}px`,
        textAlign: 'center',
        background: hasImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image}) center/cover`
          : undefined,
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          display: 'grid',
          gap: `${contentGap ?? 24}px`,
          justifyItems: 'center',
        }}
      >
        {headline && (
          <Display
            size="L"
            as="h1"
            color={hasImage ? 'on-bold-high' : 'high'}
            align="center"
          >
            {headline}
          </Display>
        )}
        {subheadline && (
          <Text
            size="L"
            weight="medium"
            color={hasImage ? 'on-bold-high' : 'medium'}
            align="center"
            as="p"
            style={{ marginBottom: 0, lineHeight: 1.5 }}
          >
            {subheadline}
          </Text>
        )}
        {ctaText && ctaLink && (
          <Button
            appearance={hasImage ? 'secondary' : 'primary'}
            size="M"
            attention="high"
            onPress={handleCtaPress}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </SurfaceProvider>
  )
}
