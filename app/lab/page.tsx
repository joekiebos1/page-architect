/**
 * Lab – Block experiments
 *
 * Fetches content from Sanity (Lab page). Images from Image Library.
 */

import { draftMode } from 'next/headers'
import { getClient } from '../../lib/sanity/client'
import { labPageQuery } from '../../lib/sanity/queries'
import { LabPageClient } from './LabPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LabPage() {
  const { isEnabled: draft } = await draftMode()
  const sanity = getClient(draft)
  let labData: {
    title?: string | null
    description?: string | null
    hero?: {
      productName?: string | null
      headline?: string | null
      subheadline?: string | null
      ctaText?: string | null
      ctaLink?: string | null
      cta2Text?: string | null
      cta2Link?: string | null
      image?: string | null
      imagePosition?: 'left' | 'right'
    } | null
  } | null = null

  try {
    labData = await sanity.fetch(labPageQuery)
  } catch {
    // Sanity not configured or fetch failed
  }

  const hero = labData?.hero
    ? {
        productName: hero.productName ?? null,
        headline: hero.headline ?? null,
        subheadline: hero.subheadline ?? null,
        ctaText: hero.ctaText ?? null,
        ctaLink: hero.ctaLink ?? null,
        cta2Text: hero.cta2Text ?? null,
        cta2Link: hero.cta2Link ?? null,
        image: hero.image ?? null,
        imagePosition: (hero.imagePosition ?? 'right') as 'left' | 'right',
      }
    : null

  return (
    <LabPageClient
      title={labData?.title ?? 'Lab'}
      description={labData?.description ?? null}
      hero={hero}
    />
  )
}
