#!/usr/bin/env node
/**
 * Verify carousel video mapping against UK Google Store page.
 * Extracts video URLs that appear in proximity to each carousel item title.
 * Run: node scripts/verify-carousel-videos.mjs
 */

import { readFileSync } from 'fs'
import { createInterface } from 'readline'

const UK_URL = 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB'

// Carousels from our seed (title → items with titles)
const OUR_CAROUSELS = {
  'New on Pixel 10 Pro': [
    'Nano Banana',
    'Simply describe your idea',
    'Make high-motion scenes feel cinematic',
    'Magic Cue',
    'Pro Zoom with up to 100x zoom range',
    'Talk with Gemini about anything you see',
    'Meet Camera Coach',
  ],
  'What Gemini can do': [
    'Set your creative ideas in motion',
    'Talk to Gemini about anything you see',
    'Ask Gemini about anything, from anywhere',
    'Talk through whatever\'s on your screen',
    'Ask Gemini to multitask across your apps',
  ],
  'More ways to work wonders': [
    'The right info, right when you need it',
    'Real-time call translations',
    'Searching has come full circle',
  ],
  'Pro camera system': [
    '48 MP ultrawide',
    '50 MP wide',
    '48 MP telephoto',
    '42 MP front-facing',
  ],
  'Super steady videos': [
    'Up to 20x the video zoom power',
    'Low-light videos get a glow-up',
    '100x. Pixel\'s longest zoom ever',
    '50 MP portraits from a smartphone',
  ],
  'AI for your photo finish': [
    'Snap your best pics with coaching from Gemini',
    'Talk about easy photo editing',
    'Group pics the whole group loves',
    'Take the picture. And be in it, too',
  ],
  'As resilient as it is brilliant': [
    'On desk',
    'In hand',
  ],
  'Discover the world of Pixel': [
    'Unlock your full potential with the Pixel Watch',
    'Connect with Pixel Buds',
  ],
  'Add a little extra help': [
    'Pixel 10, Pro, Pro XL Case',
    'Pixelsnap Charger',
    'Pixelsnap Ring Stand',
    'Pixelsnap Charger with Stand',
  ],
}

function extractVideoMapping(html) {
  const videoRe = /storage\.googleapis\.com\/mannequin\/blobs\/([a-f0-9-]+)\.mp4/g
  const videos = []
  let m
  while ((m = videoRe.exec(html)) !== null) {
    videos.push({ id: m[1], full: `https://storage.googleapis.com/mannequin/blobs/${m[1]}.mp4` })
  }

  // For each carousel item, find the closest video (before or after) within the same card
  // Card structure often has [media, title, description] so video may appear BEFORE title
  const mapping = {}
  for (const [carouselTitle, items] of Object.entries(OUR_CAROUSELS)) {
    mapping[carouselTitle] = []
    for (const itemTitle of items) {
      const idx = html.indexOf(itemTitle)
      if (idx === -1) {
        mapping[carouselTitle].push({ item: itemTitle, video: null, reason: 'title not found' })
        continue
      }
      // Look 1500 chars before (video often precedes title in card) and 2000 after
      const before = html.slice(Math.max(0, idx - 1500), idx)
      const after = html.slice(idx, idx + 2000)
      const beforeMatch = before.match(videoRe)
      const afterMatch = after.match(videoRe)
      const firstVideo = beforeMatch ? beforeMatch[beforeMatch.length - 1] : afterMatch ? afterMatch[0] : null
      const videoId = firstVideo ? firstVideo.match(/\/([a-f0-9-]+)\.mp4$/)?.[1] : null
      mapping[carouselTitle].push({
        item: itemTitle,
        videoId,
        video: firstVideo ? `https://${firstVideo}` : null,
        source: beforeMatch ? 'before' : afterMatch ? 'after' : null,
      })
    }
  }
  return { videos: [...new Set(videos.map((v) => v.full))], mapping }
}

async function main() {
  console.log('Carousel video verification for UK page:', UK_URL)
  console.log('')

  let html
  try {
    html = readFileSync('/tmp/pixel-uk.html', 'utf8')
  } catch (e) {
    console.error('Run: curl -sL', UK_URL, '-o /tmp/pixel-uk.html')
    console.error('Then run this script again.')
    process.exit(1)
  }

  const { mapping } = extractVideoMapping(html)

  console.log('=== Video-to-carousel-item mapping (first video after each title in HTML) ===\n')

  for (const [carousel, items] of Object.entries(mapping)) {
    console.log(`## ${carousel}`)
    for (const { item, videoId, video } of items) {
      const short = item.length > 50 ? item.slice(0, 47) + '...' : item
      console.log(`  ${short}`)
      console.log(`    → ${videoId || 'NO VIDEO'}`)
    }
    console.log('')
  }

  console.log('=== Summary: items with videos ===')
  let withVideo = 0
  let without = 0
  for (const items of Object.values(mapping)) {
    for (const { videoId } of items) {
      if (videoId) withVideo++
      else without++
    }
  }
  console.log(`  With video: ${withVideo}`)
  console.log(`  Without: ${without}`)

  return mapping
}

main()
  .then((mapping) => {
    if (process.argv.includes('--json')) {
      console.log(JSON.stringify(mapping, null, 2))
    }
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
