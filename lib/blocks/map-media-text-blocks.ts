/**
 * Shared mapping from CMS block shapes → MediaTextBlock / MediaText5050 props.
 * Used by BlockRenderer and LabBlockRenderer.
 */

import type {
  MediaTextBlockProps,
  MediaText5050BlockProps,
  MediaTextAsymmetricBlockProps,
} from '../../app/blocks'
import type { ImageSlotState } from '../../app/hooks/useImageStream'

export type BlockLike = Record<string, unknown>

export type BlockSpacingValue = 'none' | 'medium' | 'large'

/** Normalize spacing: none, medium, large. Backwards compat: small -> none. */
export function normalizeBlockSpacing(v: unknown): BlockSpacingValue {
  const s = (v as string)?.toLowerCase?.()
  if (s === 'small') return 'none'
  if (s === 'none' || s === 'medium' || s === 'large') return s
  return 'large'
}

/** Map mediaText5050 block to items array. Supports items + legacy shapes. */
export function mapMediaText5050Items(block: BlockLike): { subtitle?: string; body?: string }[] {
  const items = Array.isArray(block.items)
    ? (block.items as { subtitle?: string; body?: string }[]).map((i) => ({
        subtitle: (i.subtitle as string) ?? '',
        body: (i.body as string) ?? '',
      }))
    : []
  if (items.length > 0) return items
  const headline = block.headline as string | undefined
  const body = block.body as string | undefined
  if (block.variant === 'singleParagraph' && (headline || body)) {
    return [{ subtitle: headline ?? '', body: body ?? '' }]
  }
  const accordionItems = Array.isArray(block.accordionItems)
    ? (block.accordionItems as { title?: string; body?: string }[]).map((i) => ({
        subtitle: (i.title as string) ?? '',
        body: (i.body as string) ?? '',
      }))
    : []
  if (accordionItems.length > 0) return accordionItems
  const paragraphItems = Array.isArray(block.paragraphItems)
    ? (block.paragraphItems as { headline?: string; body?: string }[]).map((i) => ({
        subtitle: (i.headline as string) ?? '',
        body: (i.body as string) ?? '',
      }))
    : []
  return paragraphItems
}

export function mapMediaTextBlock(block: BlockLike): MediaTextBlockProps {
  const rawTemplate = block.template as string
  const template =
    rawTemplate === 'SideBySide' || rawTemplate === 'sideBySide'
      ? 'Stacked'
      : rawTemplate === 'MediaOverlay'
        ? 'Overlay'
        : (rawTemplate ?? 'Stacked')
  const imageAspectRatio = '2:1'

  const variantMap: Record<string, MediaTextBlockProps['variant']> = {
    Overlay: 'full-bleed',
    Stacked: 'centered-media-below',
    TextOnly: 'text-only',
  }
  const variant = variantMap[template] ?? 'centered-media-below'

  const aspectRatioMap: Record<string, NonNullable<MediaTextBlockProps['media']>['aspectRatio']> = {
    '16:7': '16:9',
    '21:9': '16:9',
    '16:9': '16:9',
    '4:3': '4:3',
    '3:4': '3:4',
    '1:1': '1:1',
    '2:1': '2:1' as const,
  }
  const aspectRatio = aspectRatioMap[imageAspectRatio]

  const imageUrl = block.image as string | undefined
  const videoUrl = block.video as string | undefined
  const hasVideo = videoUrl && typeof videoUrl === 'string' && videoUrl.trim() !== ''
  const hasImage = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
  const media =
    hasVideo
      ? { type: 'video' as const, src: videoUrl!, poster: hasImage ? imageUrl : undefined, alt: '', aspectRatio }
      : hasImage
        ? { type: 'image' as const, src: imageUrl!, alt: '', aspectRatio }
        : undefined

  const rawAlign = (() => {
    const a = block.alignment as string
    if (a) return a
    if (template === 'TextOnly') return block.textOnlyAlignment as string
    if (template === 'Stacked') return block.stackAlignment as string
    if (template === 'Overlay') return block.overlayAlignment as string
    return block.align as string
  })()
  const alignSource =
    rawAlign?.toLowerCase() === 'center'
      ? 'center'
      : rawAlign?.toLowerCase() === 'left'
        ? 'left'
        : undefined

  const mediaSize = (block.mediaSize as string) ?? 'edgeToEdge'
  const width =
    (template === 'Stacked' || template === 'Overlay') && mediaSize === 'edgeToEdge'
      ? 'edgeToEdge'
      : 'L'

  return {
    size: 'feature',
    headline: (block.title as string) ?? '',
    eyebrow: block.eyebrow as string | undefined,
    subhead: block.subhead as string | undefined,
    body: block.body as string | undefined,
    cta:
      block.ctaText && block.ctaLink
        ? { label: block.ctaText as string, href: block.ctaLink as string }
        : undefined,
    ctaSecondary:
      block.cta2Text && block.cta2Link
        ? { label: block.cta2Text as string, href: block.cta2Link as string }
        : undefined,
    media,
    variant,
    emphasis: block.emphasis as MediaTextBlockProps['emphasis'],
    minimalBackgroundStyle: block.minimalBackgroundStyle as 'block' | 'gradient' | undefined,
    surfaceColour: block.surfaceColour as MediaTextBlockProps['surfaceColour'] | undefined,
    spacing: normalizeBlockSpacing(block.spacing) as MediaTextBlockProps['spacing'],
    spacingTop: block.spacingTop
      ? (normalizeBlockSpacing(block.spacingTop) as MediaTextBlockProps['spacingTop'])
      : undefined,
    spacingBottom: block.spacingBottom
      ? (normalizeBlockSpacing(block.spacingBottom) as MediaTextBlockProps['spacingBottom'])
      : undefined,
    width,
    align: alignSource === 'center' || alignSource === 'left' ? alignSource : undefined,
    mediaStyle: 'contained',
    descriptionTitle: block.descriptionTitle as string | undefined,
    descriptionBody: block.descriptionBody as string | undefined,
  }
}

export function mapMediaTextAsymmetricBlockProps(
  block: BlockLike,
  openLinksInNewTab?: boolean,
): MediaTextAsymmetricBlockProps {
  const asymmetricItems = Array.isArray(block.items)
    ? (block.items as { title?: string; body?: string; linkText?: string; linkUrl?: string; subtitle?: string }[]).map(
        (i) => ({
          title: i.title as string | undefined,
          body: i.body as string | undefined,
          linkText: i.linkText as string | undefined,
          linkUrl: i.linkUrl as string | undefined,
          subtitle: i.subtitle as string | undefined,
        }),
      )
    : []
  const longFormParagraphsRaw = block.longFormParagraphs
  const longFormParagraphs = Array.isArray(longFormParagraphsRaw)
    ? longFormParagraphsRaw.map((p: { _key?: string; text?: string; bodyTypography?: string }) => ({
        _key: p._key,
        text: p.text,
        bodyTypography: p.bodyTypography === 'large' ? ('large' as const) : ('regular' as const),
      }))
    : []
  const paragraphRowsRaw = block.paragraphRows
  const paragraphRows = Array.isArray(paragraphRowsRaw)
    ? paragraphRowsRaw.map(
        (p: {
          _key?: string
          title?: string
          body?: string
          bodyTypography?: string
          linkText?: string
          linkUrl?: string
        }) => ({
          _key: p._key,
          title: p.title,
          body: p.body,
          bodyTypography: p.bodyTypography === 'large' ? ('large' as const) : ('regular' as const),
          linkText: p.linkText,
          linkUrl: p.linkUrl,
        }),
      )
    : []
  const mainImageRaw = block.image as string | undefined
  const mainImageSrc =
    typeof mainImageRaw === 'string' && mainImageRaw.trim().length > 0
      ? mainImageRaw.trim()
      : typeof block.imageUrl === 'string' && block.imageUrl.trim().length > 0
        ? (block.imageUrl as string).trim()
        : ''
  const ar = block.imageAspectRatio as string | undefined
  const imageAspectRatio =
    ar === '5:4' || ar === '1:1' || ar === '4:5' ? ar : undefined
  const rawVariant = (block.variant as string) ?? 'textList'
  const variant: MediaTextAsymmetricBlockProps['variant'] =
    rawVariant === 'paragraphs'
      ? 'paragraphs'
      : rawVariant === 'faq'
        ? 'faq'
        : rawVariant === 'links'
          ? 'links'
          : rawVariant === 'longForm'
            ? 'longForm'
            : rawVariant === 'image'
              ? 'image'
              : 'textList'

  const rawBlockTitle = block.blockTitle
  const blockTitleProp =
    typeof rawBlockTitle === 'string' && rawBlockTitle.trim().length > 0 ? rawBlockTitle.trim() : undefined

  return {
    ...(blockTitleProp !== undefined ? { blockTitle: blockTitleProp } : {}),
    variant,
    longFormParagraphs,
    paragraphRows,
    items: asymmetricItems,
    mainImageSrc: mainImageSrc || undefined,
    imageAspectRatio,
    imageAlt: (block.imageAlt as string | null) ?? null,
    size: (block.size as MediaTextAsymmetricBlockProps['size']) ?? 'feature',
    emphasis: block.emphasis as MediaTextAsymmetricBlockProps['emphasis'],
    minimalBackgroundStyle:
      (block.minimalBackgroundStyle as string)?.toLowerCase?.() === 'gradient' ? 'gradient' : 'block',
    surfaceColour: block.surfaceColour as MediaTextAsymmetricBlockProps['surfaceColour'],
    openLinksInNewTab,
  }
}

export function mapMediaText5050BlockProps(
  block: BlockLike,
  images?: Record<string, ImageSlotState> | null,
): MediaText5050BlockProps {
  const imageUrl = block.image as string | undefined
  const videoUrl = block.video as string | undefined
  const hasVideo = videoUrl && typeof videoUrl === 'string' && videoUrl.trim() !== ''
  const hasImage = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
  const aspectRatio = (block.imageAspectRatio as string) || undefined
  const media =
    hasVideo
      ? {
          type: 'video' as const,
          src: videoUrl!,
          poster: hasImage ? imageUrl : undefined,
          alt: '',
          aspectRatio: aspectRatio as '5:4' | '1:1' | '4:5',
        }
      : hasImage
        ? { type: 'image' as const, src: imageUrl!, alt: '', aspectRatio: aspectRatio as '5:4' | '1:1' | '4:5' }
        : undefined
  const items = mapMediaText5050Items(block)
  const imageSlot = block.imageSlot as string | undefined
  const imageState = imageSlot && images?.[imageSlot] ? images[imageSlot] : undefined
  const rawVariant = block.variant as string
  const variant: MediaText5050BlockProps['variant'] = rawVariant === 'accordion' ? 'accordion' : 'paragraphs'
  let paragraphColumnLayout: MediaText5050BlockProps['paragraphColumnLayout']
  if (variant === 'paragraphs') {
    const rawLayout = block.paragraphColumnLayout as string | undefined
    paragraphColumnLayout =
      rawLayout === 'single' || rawLayout === 'multi'
        ? rawLayout
        : items.length === 1
          ? 'single'
          : 'multi'
  }
  const rawFramingAlign = block.blockFramingAlignment as string | undefined
  const blockFramingAlignment: MediaText5050BlockProps['blockFramingAlignment'] =
    rawFramingAlign === 'center' ? 'center' : 'left'
  return {
    variant,
    paragraphColumnLayout,
    imagePosition: (block.imagePosition as 'left' | 'right') ?? 'right',
    blockFramingAlignment,
    emphasis: block.emphasis as MediaText5050BlockProps['emphasis'],
    minimalBackgroundStyle: (block.minimalBackgroundStyle as 'block' | 'gradient') ?? 'block',
    surfaceColour: block.surfaceColour as MediaText5050BlockProps['surfaceColour'],
    spacingTop: block.spacingTop
      ? (normalizeBlockSpacing(block.spacingTop) as MediaText5050BlockProps['spacingTop'])
      : undefined,
    spacingBottom: block.spacingBottom
      ? (normalizeBlockSpacing(block.spacingBottom) as MediaText5050BlockProps['spacingBottom'])
      : undefined,
    headline: block.headline as string | undefined,
    description: block.description as string | null | undefined,
    callToActions: block.callToActions as MediaText5050BlockProps['callToActions'],
    items,
    media,
    imageSlot,
    imageState,
  }
}
