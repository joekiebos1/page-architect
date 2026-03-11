'use client'

import {
  MediaCard,
  TextOnColourCardGrid,
  TextOnImageCard,
} from '../../components/Cards'
import type { CardGridBlockItem } from './CardGridBlock.types'
import type { ImageSlotState } from '../../hooks/useImageStream'

const CARD_TYPE_MEDIA_BELOW = 'media-description-below'
const CARD_TYPE_MEDIA_INSIDE = 'media-description-inside'
const CARD_TYPE_TEXT_INSIDE = 'text-inside'

/** Resolve card type from item. Supports new cardType and legacy cardStyle / _type. */
function getCardType(item: CardGridBlockItem): string {
  const i = item as { cardType?: string; cardStyle?: string; _type?: string }
  if (i.cardType) return i.cardType
  if (i.cardStyle === 'text-on-image') return CARD_TYPE_MEDIA_INSIDE
  if (i.cardStyle === 'text-on-colour') return CARD_TYPE_TEXT_INSIDE
  if (i.cardStyle === 'image-above') return CARD_TYPE_MEDIA_BELOW
  if (i._type === 'textOnColourCardItem') return CARD_TYPE_TEXT_INSIDE
  return CARD_TYPE_MEDIA_BELOW
}

export function CardRenderer({
  item,
  prefersReducedMotion,
  imageState,
}: {
  item: CardGridBlockItem
  prefersReducedMotion: boolean
  imageState?: ImageSlotState
}) {
  const title = item.title ?? ''
  const cardType = getCardType(item)

  // Text inside: TextOnColourCardGrid (unified cardGridItem or legacy textOnColourCardItem / cardStyle text-on-colour)
  if (cardType === CARD_TYPE_TEXT_INSIDE) {
    const t = item as {
      size?: 'large' | 'small'
      icon?: string | null
      iconImage?: string | null
      title: string
      description?: string | null
      callToActionButtons?: { _key?: string; label: string; link?: string | null; style?: 'filled' | 'outlined' }[] | null
      features?: string[] | null
      backgroundColor?: 'primary' | 'secondary' | 'tertiary' | null
      surface?: string
    }
    const bg = t.backgroundColor ?? (t.surface === 'subtle' ? 'secondary' : 'primary')
    const size = t.size ?? (t.callToActionButtons?.length || t.features?.length || t.icon || t.iconImage ? 'small' : 'large')
    return (
      <TextOnColourCardGrid
        size={size}
        icon={t.icon}
        iconImage={t.iconImage}
        title={t.title}
        description={t.description}
        callToActionButtons={t.callToActionButtons}
        features={t.features}
        backgroundColor={bg}
      />
    )
  }

  // Media + description inside: TextOnImageCard
  if (cardType === CARD_TYPE_MEDIA_INSIDE) {
    const m = item as { image?: string | null; description?: string | null; imageSlot?: string }
    const img = imageState?.ready ? imageState.url : (typeof m.image === 'string' ? m.image : null) ?? ''
    if (img) {
      return (
        <TextOnImageCard
          title={title}
          description={m.description}
          image={img}
          config={{ aspectRatio: '4/5' }}
          imageState={imageState}
          imageSlot={m.imageSlot}
        />
      )
    }
  }

  // Media + description below: MediaCard (default)
  const m = item as {
    image?: string | null
    video?: string | null
    videoUrl?: string | null
    description?: string | null
    ctaText?: string | null
    ctaLink?: string | null
    imageSlot?: string
  }
  const video = m.video ?? m.videoUrl ?? undefined
  return (
    <MediaCard
      title={title}
      description={m.description}
      image={imageState?.ready ? imageState.url : m.image}
      video={typeof video === 'string' ? video : undefined}
      link={m.ctaLink}
      ctaText={m.ctaText}
      aspectRatio="4:5"
      prefersReducedMotion={prefersReducedMotion}
      config={{ layout: 'compact' }}
      imageState={imageState}
      imageSlot={m.imageSlot}
    />
  )
}
