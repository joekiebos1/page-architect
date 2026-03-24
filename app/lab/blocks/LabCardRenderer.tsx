'use client'

/**
 * Renders LabCardItem for both grid and carousel.
 * Single renderer for unified lab cards.
 */

import {
  MediaCard,
  TextOnColourCardGrid,
  TextOnImageCard,
} from '../components/blocks/Cards'
import type { ImageSlotState } from '../../hooks/useImageStream'
import type { MediaCardConfig } from '../components/blocks/Cards'

const CARD_TYPE_MEDIA_BELOW = 'media-description-below'
const CARD_TYPE_MEDIA_INSIDE = 'media-description-inside'
const CARD_TYPE_TEXT_ON_COLOUR = 'text-on-colour'

export type LabCardItem = {
  _type?: 'labCardItem'
  cardType?: 'media-description-below' | 'media-description-inside' | 'text-on-colour'
  title?: string | null
  description?: string | null
  size?: 'large' | 'small'
  backgroundColor?: string | null
  icon?: string | null
  iconImage?: string | null
  callToActionButtons?: { _key?: string; label: string; link?: string | null; style?: 'filled' | 'outlined' }[] | null
  features?: string[] | null
  image?: string | null
  video?: string | null
  videoUrl?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  aspectRatio?: '4:5' | '8:5' | '2:1'
  imageSlot?: string
}

function getCardSizeFromColumns(cols: number): 'large' | 'medium' | 'small' {
  if (cols <= 1) return 'large'
  if (cols <= 2) return 'medium'
  return 'small'
}

export function LabCardRenderer({
  item,
  prefersReducedMotion,
  imageState,
  gridColumns,
  context,
  aspectRatio,
  mediaConfig,
  videoPaused,
  inView,
}: {
  item: LabCardItem
  prefersReducedMotion: boolean
  imageState?: ImageSlotState
  gridColumns?: number
  /** Grid: fixed layout. Carousel: cards in scroll track. */
  context: 'grid' | 'carousel'
  /** Carousel only: card aspect ratio. */
  aspectRatio?: '4:5' | '8:5' | '2:1'
  /** Carousel only: MediaCard config (imageHeight4_5, etc.). */
  mediaConfig?: MediaCardConfig
  /** Carousel: pause video when card out of view. */
  videoPaused?: boolean
  /** Carousel: fade text when card out of view. */
  inView?: boolean
}) {
  const title = item.title ?? ''
  const cardType = item.cardType ?? CARD_TYPE_MEDIA_BELOW
  const cardSize = gridColumns != null ? getCardSizeFromColumns(gridColumns) : 'medium'

  // Text on colour
  if (cardType === CARD_TYPE_TEXT_ON_COLOUR) {
    const size = item.size ?? (item.callToActionButtons?.length || item.features?.length || item.icon || item.iconImage ? 'small' : 'large')
    const bg = item.backgroundColor ?? 'primary-bold'
    const card = (
      <TextOnColourCardGrid
        size={size}
        cardSize={cardSize}
        icon={item.icon}
        iconImage={item.iconImage}
        title={title}
        description={item.description}
        callToActionButtons={item.callToActionButtons}
        features={item.features}
        backgroundColor={bg}
      />
    )
    if (context === 'carousel' && aspectRatio) {
      const ratioMap = { '4:5': '4/5', '8:5': '8/5', '2:1': '2/1' } as const
      return (
        <div style={{ aspectRatio: ratioMap[aspectRatio], width: '100%', minHeight: 0, display: 'flex' }}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{card}</div>
        </div>
      )
    }
    return card
  }

  // Media + description inside
  if (cardType === CARD_TYPE_MEDIA_INSIDE) {
    const img = imageState?.ready ? imageState.url : (typeof item.image === 'string' ? item.image : null) ?? ''
    if (img) {
      return (
        <TextOnImageCard
          title={title}
          description={item.description}
          image={img}
          config={{ aspectRatio: '4/5', cardSize }}
          imageState={imageState}
          imageSlot={item.imageSlot}
        />
      )
    }
  }

  // Media + description below (default)
  const video = item.video ?? item.videoUrl ?? undefined
  const config = mediaConfig ?? { layout: 'compact' as const, cardSize }
  const mediaAspectRatio = aspectRatio ?? item.aspectRatio ?? '4:5'
  return (
    <MediaCard
      title={title}
      description={item.description}
      image={imageState?.ready ? imageState.url : item.image}
      video={typeof video === 'string' ? video : undefined}
      link={item.ctaLink}
      ctaText={item.ctaText}
      aspectRatio={mediaAspectRatio}
      prefersReducedMotion={prefersReducedMotion}
      config={config}
      videoPaused={videoPaused}
      inView={inView}
      imageState={imageState}
      imageSlot={item.imageSlot}
    />
  )
}
