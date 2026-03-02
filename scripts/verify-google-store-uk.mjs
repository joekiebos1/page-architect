#!/usr/bin/env node
/**
 * Verify all modules (carousels, hero, media blocks) against UK Google Store page.
 * Extracts image + video presence for each item. If Google has no image, omit imageUrl.
 * Run: node scripts/verify-google-store-uk.mjs
 * Requires: curl -sL 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB' -o /tmp/pixel-uk.html
 */

import { readFileSync } from 'fs'

const UK_URL = 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB'

const MODULES = {
  carousels: {
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
  },
  mediaBlocks: [
    { key: 'hero', title: 'Meet the new status pro', section: 'Hero' },
    { key: 'camera-intro', title: 'The Pixel 10 Pro camera. Next-level everything', section: 'Camera intro' },
    { key: 'tensor', title: 'Breakthrough performance', section: 'Tensor' },
  ],
}

function findMedia(html, title, windowBefore = 2500, windowAfter = 600) {
  const idx = html.indexOf(title)
  if (idx === -1) return { hasImage: false, hasVideo: false, videoId: null, imageId: null }
  const before = html.slice(Math.max(0, idx - windowBefore), idx)
  const after = html.slice(idx, idx + windowAfter)

  const imgRe = /lh3\.googleusercontent\.com\/([A-Za-z0-9_-]+)/g
  const videoRe = /storage\.googleapis\.com\/mannequin\/blobs\/([a-f0-9-]+)\.mp4/g

  const imgBefore = before.match(imgRe)
  const imgAfter = after.match(imgRe)
  const vidBefore = before.match(videoRe)
  const vidAfter = after.match(videoRe)

  const hasImage = Boolean((imgBefore?.length || 0) + (imgAfter?.length || 0))
  const hasVideo = Boolean((vidBefore?.length || 0) + (vidAfter?.length || 0))

  const firstVideo = vidBefore ? vidBefore[vidBefore.length - 1] : vidAfter ? vidAfter[0] : null
  const videoId = firstVideo ? firstVideo.match(/\/([a-f0-9-]+)\.mp4$/)?.[1] : null

  const firstImg = imgBefore ? imgBefore[imgBefore.length - 1] : imgAfter ? imgAfter[0] : null
  const imageId = firstImg ? firstImg.replace(/.*\/([A-Za-z0-9_-]+)$/, '$1') : null

  return { hasImage, hasVideo, videoId, imageId }
}

async function main() {
  console.log('UK page verification:', UK_URL)
  console.log('')

  let html
  try {
    html = readFileSync('/tmp/pixel-uk.html', 'utf8')
  } catch (e) {
    console.error('Run: curl -sL', UK_URL, '-o /tmp/pixel-uk.html')
    process.exit(1)
  }

  const result = { carousels: {}, mediaBlocks: {} }

  for (const [carouselTitle, items] of Object.entries(MODULES.carousels)) {
    result.carousels[carouselTitle] = []
    for (const itemTitle of items) {
      const m = findMedia(html, itemTitle)
      result.carousels[carouselTitle].push({
        item: itemTitle,
        hasImage: m.hasImage,
        hasVideo: m.hasVideo,
        videoId: m.videoId,
        imageId: m.imageId,
      })
    }
  }

  for (const { key, title, section } of MODULES.mediaBlocks) {
    const m = findMedia(html, title, 3000, 1500)
    result.mediaBlocks[key] = { section, hasImage: m.hasImage, hasVideo: m.hasVideo, imageId: m.imageId }
  }

  // Print report
  console.log('=== Carousels: image + video presence ===\n')
  for (const [carousel, items] of Object.entries(result.carousels)) {
    console.log(`## ${carousel}`)
    for (const { item, hasImage, hasVideo, videoId, imageId } of items) {
      const short = item.length > 50 ? item.slice(0, 47) + '...' : item
      const img = hasImage ? (imageId ? `img:${imageId}` : 'img') : 'no img'
      const vid = hasVideo ? (videoId ? `vid:${videoId}` : 'vid') : 'no vid'
      console.log(`  ${short}`)
      console.log(`    → ${img} | ${vid}`)
    }
    console.log('')
  }

  console.log('=== Media blocks ===\n')
  for (const [key, m] of Object.entries(result.mediaBlocks)) {
    console.log(`${key}: hasImage=${m.hasImage} hasVideo=${m.hasVideo}${m.imageId ? ` imageId=${m.imageId.slice(0, 20)}...` : ''}`)
  }

  if (process.argv.includes('--json')) {
    console.log('\n' + JSON.stringify(result, null, 2))
  }

  return result
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
