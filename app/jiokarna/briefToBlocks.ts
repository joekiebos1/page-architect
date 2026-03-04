/**
 * Converts JioKarna PageBrief sections to BlockRenderer block format.
 * Used for the preview step to render a visual mock of the proposed page.
 * Images come from Sanity Image Library when available; otherwise placeholder.
 */

import type { PageBrief, Section } from './types'

/** Grey placeholder for preview (local asset, no external URLs). */
const PLACEHOLDER_IMAGE = '/placeholder-preview.svg'

/** Returns true if string is a valid image URL (http, https, or absolute path). */
function isValidImageUrl(s: string | null | undefined): boolean {
  if (!s || typeof s !== 'string' || !s.trim()) return false
  const t = s.trim()
  return t.startsWith('http://') || t.startsWith('https://') || t.startsWith('/')
}

/** Picks an image from Sanity pool or falls back to placeholder. */
function resolveImage(
  raw: string | null | undefined,
  sanityUrls: string[],
  index: number
): string {
  if (isValidImageUrl(raw)) return raw!.trim()
  if (sanityUrls.length > 0) return sanityUrls[index % sanityUrls.length]
  return PLACEHOLDER_IMAGE
}

type Block = {
  _type: string
  _key: string
  spacingTop?: 'small' | 'medium' | 'large'
  spacingBottom?: 'small' | 'medium' | 'large'
  [key: string]: unknown
}

function getCtaFromSlot(cta: Section['contentSlots']['cta']): { label?: string; href?: string } | undefined {
  if (!cta) return undefined
  if (typeof cta === 'string') return cta ? { label: cta, href: '#' } : undefined
  const label = cta.label || cta.destination
  const href = cta.destination ? `/${cta.destination.toLowerCase().replace(/\s+/g, '-')}` : '#'
  return label ? { label, href } : undefined
}

function normalizeItems(
  items: unknown[] | null | undefined,
  component: string,
  sanityImageUrls: string[],
  itemOffset: number
): Record<string, unknown>[] {
  if (!Array.isArray(items) || items.length === 0) return []

  return items.map((item, i) => {
    const imgIndex = itemOffset + i
    const o = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}
    const title = (o.title as string) ?? (o.headline as string) ?? `Item ${i + 1}`
    const description = (o.description as string) ?? (o.body as string) ?? ''

    switch (component) {
      case 'cardGrid':
        return {
          cardStyle: (o.cardStyle as string) ?? 'image-above',
          title,
          description,
          image: resolveImage(o.image as string, sanityImageUrls, imgIndex),
          video: o.video,
          ctaText: o.ctaText,
          ctaLink: o.ctaLink ?? (o.link as string),
          surface: (o.surface as string) ?? 'bold',
        }
      case 'carousel':
        return {
          cardType: (o.cardType as string) ?? 'media',
          title,
          description,
          image: resolveImage(o.image as string, sanityImageUrls, imgIndex),
          video: o.video,
          link: o.link,
          ctaText: o.ctaText,
          aspectRatio: (o.aspectRatio as string) ?? '4:5',
        }
      case 'proofPoints':
        return {
          title,
          description,
          icon: (o.icon as string) ?? 'IcCheckboxOn',
        }
      default:
        return { title, description, ...o }
    }
  })
}

export function briefToBlocks(brief: PageBrief, sanityImageUrls: string[] = []): Block[] {
  const sections = [...brief.sections].sort((a, b) => a.order - b.order)
  let itemOffset = 0

  return sections.map((s, i) => {
    const slots = s.contentSlots
    const opts = s.blockOptions ?? {}
    const cta = getCtaFromSlot(slots.cta)
    const base: Block = {
      _type: s.component,
      _key: `preview-${i}-${s.component}`,
      spacingTop: 'large',
      spacingBottom: 'large',
    }

    switch (s.component) {
      case 'hero': {
        return {
          ...base,
          variant: opts.variant ?? 'category',
          productName: brief.meta.pageName,
          headline: slots.headline ?? brief.meta.pageName,
          subheadline: slots.subhead ?? brief.meta.keyMessage,
          ctaText: cta?.label,
          ctaLink: cta?.href ?? '#',
          cta2Text: undefined,
          cta2Link: undefined,
          image: resolveImage(undefined, sanityImageUrls, 0),
        }
      }

      case 'mediaTextBlock': {
        const template = opts.template ?? 'SideBySide'
        const hasMedia = slots.mediaType === 'image' || slots.mediaType === 'video'
        return {
          ...base,
          template: hasMedia ? template : 'TextOnly',
          size: opts.size ?? 'feature',
          imagePosition: (opts.imagePosition as 'left' | 'right') ?? 'right',
          blockAccent: opts.blockAccent ?? 'primary',
          blockBackground: opts.blockSurface ?? 'ghost',
          contentWidth: 'Default',
          mediaStyle: opts.mediaStyle ?? 'contained',
          imageAspectRatio: opts.imageAspectRatio ?? '4:3',
          title: slots.headline ?? s.sectionName,
          subhead: slots.subhead,
          body: slots.body,
          bulletList: undefined,
          ctaText: cta?.label,
          ctaLink: cta?.href ?? '#',
          cta2Text: undefined,
          cta2Link: undefined,
          image: hasMedia ? resolveImage(undefined, sanityImageUrls, i) : undefined,
          video: undefined,
        }
      }

      case 'cardGrid': {
        const items = normalizeItems(slots.items, 'cardGrid', sanityImageUrls, itemOffset)
        itemOffset += items.length
        if (items.length === 0) {
          items.push(
            { cardStyle: 'image-above', title: 'Card 1', description: slots.body ?? '', image: resolveImage(undefined, sanityImageUrls, itemOffset) },
            { cardStyle: 'image-above', title: 'Card 2', description: '', image: resolveImage(undefined, sanityImageUrls, itemOffset + 1) },
            { cardStyle: 'image-above', title: 'Card 3', description: '', image: resolveImage(undefined, sanityImageUrls, itemOffset + 2) }
          )
          itemOffset += 3
        }
        return {
          ...base,
          columns: String(opts.columns ?? 3),
          title: slots.headline ?? s.sectionName,
          blockSurface: opts.blockSurface ?? 'ghost',
          blockAccent: opts.blockAccent ?? 'primary',
          items,
        }
      }

      case 'carousel': {
        const carouselCardSize = opts.cardSize ?? 'compact'
        let items = normalizeItems(slots.items, 'carousel', sanityImageUrls, itemOffset)
        itemOffset += items.length
        if (items.length === 0) {
          items = [
            { cardType: 'media', title: 'Item 1', description: slots.body ?? '', image: resolveImage(undefined, sanityImageUrls, itemOffset), ...(carouselCardSize === 'compact' && { aspectRatio: '4:5' }) },
            { cardType: 'media', title: 'Item 2', description: '', image: resolveImage(undefined, sanityImageUrls, itemOffset + 1), ...(carouselCardSize === 'compact' && { aspectRatio: '4:5' }) },
          ]
          itemOffset += 2
        } else if (carouselCardSize === 'large' || carouselCardSize === 'medium') {
          items = items.map(({ aspectRatio: _a, ...rest }) => rest)
        }
        return {
          ...base,
          cardSize: carouselCardSize,
          blockAccent: opts.blockAccent ?? 'primary',
          surface: opts.blockSurface ?? 'ghost',
          title: slots.headline ?? s.sectionName,
          items,
        }
      }

      case 'proofPoints': {
        const items = normalizeItems(slots.items, 'proofPoints', sanityImageUrls, itemOffset)
        itemOffset += items.length
        if (items.length === 0) {
          items.push(
            { title: 'Point 1', description: '', icon: 'IcCheckboxOn' },
            { title: 'Point 2', description: '', icon: 'IcSecured' },
            { title: 'Point 3', description: '', icon: 'IcStar' }
          )
        }
        return {
          ...base,
          title: slots.headline ?? s.sectionName,
          blockSurface: opts.blockSurface ?? 'ghost',
          blockAccent: opts.blockAccent ?? 'primary',
          items,
        }
      }

      default:
        return base
    }
  })
}
