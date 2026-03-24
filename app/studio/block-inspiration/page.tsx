/**
 * Block Inspiration – browse blocks with editable thumbnails from Sanity.
 */

import { draftMode } from 'next/headers'
import BlockInspirationClient from './BlockInspirationClient'
import { getClient } from '../../../lib/sanity/client'
import { blockInspirationCatalogueQuery } from '../../../lib/sanity/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function buildThumbnailsMap(entries: { blockId?: string; thumbnail?: string }[] | undefined): Record<string, string> {
  const map: Record<string, string> = {}
  if (!entries) return map
  for (const e of entries) {
    if (e.blockId && e.thumbnail) {
      map[e.blockId] = e.thumbnail
    }
  }
  return map
}

export default async function BlockInspirationPage() {
  const { isEnabled: draft } = await draftMode()
  const sanity = getClient(draft)
  let catalogue: { entries?: { blockId?: string; thumbnail?: string }[] } | null = null
  try {
    catalogue = await sanity.fetch(blockInspirationCatalogueQuery)
  } catch {
    // No Sanity project or fetch failed
  }

  const thumbnailsMap = buildThumbnailsMap(catalogue?.entries ?? [])

  return <BlockInspirationClient thumbnailsMap={thumbnailsMap} />
}
