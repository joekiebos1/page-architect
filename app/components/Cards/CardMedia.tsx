'use client'

import Image from 'next/image'
import { VideoWithControls } from '../VideoWithControls'
import type { CardMediaAspectRatio } from './Card.types'

/** Valid image src: full URL or path starting with /. Rejects filenames like "laptop-design.jpg". */
function isValidImageSrc(s: string | null | undefined): boolean {
  if (!s || typeof s !== 'string' || !s.trim()) return false
  const t = s.trim()
  return t.startsWith('http://') || t.startsWith('https://') || t.startsWith('/')
}

type CardMediaProps = {
  image?: string | null
  video?: string | null
  prefersReducedMotion: boolean
  aspectRatio?: CardMediaAspectRatio
  /** When true, use height instead of aspect-ratio (for Carousel compact 4:5) */
  heightCss?: string
}

export function CardMedia({
  image,
  video,
  prefersReducedMotion,
  aspectRatio = '4/5',
  heightCss,
}: CardMediaProps) {
  const hasVideo = video && typeof video === 'string' && video.trim() !== ''
  const hasValidImage = image && isValidImageSrc(image)
  const hasInvalidImage = image && typeof image === 'string' && image.trim() !== '' && !isValidImageSrc(image)
  if (!hasVideo && !hasValidImage && !hasInvalidImage) return null

  const aspectMap: Record<CardMediaAspectRatio, string> = {
    '4/5': '4/5',
    '4/3': '4/3',
    '8/5': '8/5',
    '2/1': '2/1',
  }
  const aspectValue = aspectMap[aspectRatio]

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'inherit',
    ...(heightCss ? { height: heightCss } : { aspectRatio: aspectValue }),
  }

  return (
    <div style={containerStyle}>
      {hasVideo ? (
        <VideoWithControls
          src={video!}
          poster={hasValidImage ? image : undefined}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : hasValidImage ? (
        <Image
          src={image!.trim()}
          alt=""
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--ds-color-background-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--ds-typography-body-xs)',
            color: 'var(--ds-color-text-medium)',
          }}
        >
          Preview
        </div>
      )}
    </div>
  )
}
