#!/usr/bin/env node
/**
 * Seed Sanity with sample page content.
 * Requires: SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, and SANITY_API_TOKEN (write token from sanity.io/manage)
 * Run: node --env-file=.env scripts/seed-sanity.mjs
 */

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || projectId === 'your-project-id') {
  console.error('Set SANITY_STUDIO_PROJECT_ID in .env (from sanity.io/manage)')
  process.exit(1)
}

if (!token) {
  console.error('Set SANITY_API_TOKEN in .env (create a token with Editor permissions at sanity.io/manage)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/** Fetch image from URL and upload to Sanity */
async function uploadImageFromUrl(url, filename = 'image.jpg') {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  return asset._id
}

async function seed() {
  console.log('Seeding Sanity...')

  // Upload placeholder images (picsum.photos - allows hotlinking)
  let heroImageId, textImageId, carouselImage1, carouselImage2, carouselImage3, carouselImage4
  let productHeroId, productTextImageId
  try {
    const uploads = await Promise.all([
      uploadImageFromUrl('https://picsum.photos/1200/675', 'hero.jpg'),
      uploadImageFromUrl('https://picsum.photos/800/600', 'text-image.jpg'),
      uploadImageFromUrl('https://picsum.photos/400/500', 'card1.jpg'),
      uploadImageFromUrl('https://picsum.photos/400/500', 'card2.jpg'),
      uploadImageFromUrl('https://picsum.photos/400/500', 'card3.jpg'),
      uploadImageFromUrl('https://picsum.photos/400/500', 'card4.jpg'),
      uploadImageFromUrl('https://picsum.photos/1200/675', 'product-hero.jpg'),
      uploadImageFromUrl('https://picsum.photos/800/600', 'product-text.jpg'),
    ])
    ;[heroImageId, textImageId, carouselImage1, carouselImage2, carouselImage3, carouselImage4, productHeroId, productTextImageId] = uploads
    console.log('Uploaded placeholder images')
  } catch (err) {
    console.warn('Image upload failed, using text-only content:', err.message)
  }

  const imageRef = (id) => id ? { _type: 'image', asset: { _type: 'reference', _ref: id } } : undefined

  const sections = [
    {
      _type: 'hero',
      _key: 'hero-1',
      productName: 'JioProduct',
      headline: 'Transform your workflow',
      subheadline: 'Discover how our platform helps teams ship faster and collaborate better.',
      ctaText: 'Get started',
      ctaLink: '/signup',
      cta2Text: 'Learn more',
      cta2Link: '/about',
      image: imageRef(heroImageId),
    },
      {
        _type: 'proofPoints',
        _key: 'proof-1',
        title: 'Why believe us',
        items: [
          { _key: 'pp1', title: 'Trusted by millions', description: 'Join 10M+ satisfied customers', icon: 'IcCheckboxOn' },
          { _key: 'pp2', title: 'Award-winning', description: 'Industry recognition for excellence', icon: 'IcAward' },
          { _key: 'pp3', title: '24/7 support', description: "We're here when you need us", icon: 'IcProtection' },
        ],
      },
      {
        _type: 'featureGrid',
        _key: 'fg-1',
        title: 'Why choose us',
        items: [
          { _key: 'f1', title: 'Fast', description: 'Built for speed. Deploy in seconds, not minutes.' },
          { _key: 'f2', title: 'Reliable', description: 'Uptime you can count on. We handle the infrastructure.' },
          { _key: 'f3', title: 'Secure', description: 'Enterprise-grade security. Your data stays yours.' },
        ],
      },
      {
        _type: 'textImageBlock',
        _key: 'tib-1',
        title: 'Designed for real teams',
        body: 'We built this with feedback from hundreds of teams. Every feature exists because someone asked for it. No bloat, no complexity—just what you need to get work done.',
        ctaText: 'Visit JioFinance',
        ctaLink: '/finance',
        template: 'SideBySide',
        imagePosition: 'left',
        imageAspectRatio: '4:3',
        image: imageRef(textImageId),
      },
      {
        _type: 'textImageBlock',
        _key: 'tib-2',
        title: 'Full bleed hero',
        body: 'This layout uses a full-width image with text overlay. Perfect for impactful landing sections.',
        template: 'HeroOverlay',
        overlayAlignment: 'center',
        imageAspectRatio: '16:7',
        image: imageRef(textImageId),
      },
    ]

  if (carouselImage1 && carouselImage2 && carouselImage3 && carouselImage4) {
    sections.push({
      _type: 'carousel',
      _key: 'car-1',
      title: 'Featured products',
      items: [
        { _type: 'cardItem', _key: 'c1', title: 'Product One', description: 'The first in our lineup. Built for performance.', image: imageRef(carouselImage1), aspectRatio: '4:5', link: '/products/1', ctaText: 'View' },
        { _type: 'cardItem', _key: 'c2', title: 'Product Two', description: 'Double the power. Half the effort.', image: imageRef(carouselImage2), aspectRatio: '4:5', link: '/products/2', ctaText: 'View' },
        { _type: 'cardItem', _key: 'c3', title: 'Product Three', description: 'Our flagship offering. Everything you need.', image: imageRef(carouselImage3), aspectRatio: '8:5', link: '/products/3', ctaText: 'View' },
        { _type: 'cardItem', _key: 'c4', title: 'Product Four', description: 'The complete solution for modern teams.', image: imageRef(carouselImage4), aspectRatio: '4:5', link: '/products/4', ctaText: 'View' },
      ],
    })
    sections.push({
      _type: 'fullBleedVerticalCarousel',
      _key: 'fbvc-1',
      items: [
        { _type: 'fullBleedVerticalCarouselItem', _key: 'fb1', title: 'First story', description: 'Add an image or video in Sanity Studio. This text scrolls from bottom to top as you scroll through the carousel.', image: imageRef(carouselImage1) },
        { _type: 'fullBleedVerticalCarouselItem', _key: 'fb2', title: 'Second story', description: 'Each item gets its own full-bleed media and text overlay. The stepper on the right shows your progress.', image: imageRef(carouselImage2) },
        { _type: 'fullBleedVerticalCarouselItem', _key: 'fb3', title: 'Third story', description: 'Scroll through to discover more. Each slide tells part of the story.', image: imageRef(carouselImage3) },
        { _type: 'fullBleedVerticalCarouselItem', _key: 'fb4', title: 'Fourth story', description: 'The final chapter. Ready to take action?', image: imageRef(carouselImage4) },
      ],
    })
  } else {
    console.warn('Skipping carousel blocks (images required)')
  }

  const homePage = {
    _type: 'page',
    _id: 'page-home',
    title: 'Home',
    slug: { _type: 'slug', current: 'home' },
    sections,
  }

  await client.createOrReplace(homePage)
  console.log('Created page: Home (slug: home)')

  // --- Product page: all blocks, all variations ---
  const productImg = imageRef(productTextImageId)
  const productSections = [
    {
      _type: 'hero',
      _key: 'p-hero',
      productName: 'Product Showcase',
      headline: 'Every block, every variation',
      subheadline: 'This page demonstrates all block types and their layout options. Use it as a reference for design and content.',
      ctaText: 'Get started',
      ctaLink: '/signup',
      cta2Text: 'Learn more',
      cta2Link: '/about',
      image: imageRef(productHeroId),
    },
    {
      _type: 'proofPoints',
      _key: 'p-pp',
      title: 'Product proof points',
      items: [
        { _key: 'pp1', title: 'Trusted by millions', description: 'Join 10M+ satisfied customers', icon: 'IcCheckboxOn' },
        { _key: 'pp2', title: 'Award-winning', description: 'Industry recognition for excellence', icon: 'IcAward' },
        { _key: 'pp3', title: '24/7 support', description: "We're here when you need us", icon: 'IcProtection' },
        { _key: 'pp4', title: 'Lightning fast', description: 'Built for speed and scale', icon: 'IcRocket' },
        { _key: 'pp5', title: 'Secure by design', description: 'Enterprise-grade security', icon: 'IcLock' },
      ],
    },
    {
      _type: 'featureGrid',
      _key: 'p-fg',
      title: 'Product features',
      items: [
        { _key: 'f1', title: 'Fast', description: 'Built for speed. Deploy in seconds, not minutes.' },
        { _key: 'f2', title: 'Reliable', description: 'Uptime you can count on. We handle the infrastructure.' },
        { _key: 'f3', title: 'Secure', description: 'Enterprise-grade security. Your data stays yours.' },
        { _key: 'f4', title: 'Flexible', description: 'Adapt to your workflow. Customize everything.' },
      ],
    },
    // Text + Image: SideBySide variations
    { _type: 'textImageBlock', _key: 'p-tib-1', title: 'SideBySide – image left, 4:3', body: 'Classic 50/50 layout with image on the left. Aspect ratio 4:3.', template: 'SideBySide', imagePosition: 'left', imageAspectRatio: '4:3', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-2', title: 'SideBySide – image right, 3:4', body: 'Same layout with image on the right. Taller 3:4 aspect ratio.', template: 'SideBySide', imagePosition: 'right', imageAspectRatio: '3:4', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-3', title: 'SideBySide – image right, 1:1', body: 'Square image. Perfect for product shots or portraits.', template: 'SideBySide', imagePosition: 'right', imageAspectRatio: '1:1', image: productImg },
    // SideBySideNarrow
    { _type: 'textImageBlock', _key: 'p-tib-4', title: 'SideBySideNarrow – image left', body: 'Narrow image (1/3 width). Text gets more space.', template: 'SideBySideNarrow', imagePosition: 'left', imageAspectRatio: '3:4', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-5', title: 'SideBySideNarrow – image right', body: 'Narrow image on the right. Good for sidebars.', template: 'SideBySideNarrow', imagePosition: 'right', imageAspectRatio: '3:4', image: productImg },
    // SideBySideWide
    { _type: 'textImageBlock', _key: 'p-tib-6', title: 'SideBySideWide – image left', body: 'Wide image (2/3 width). Image dominates the layout.', template: 'SideBySideWide', imagePosition: 'left', imageAspectRatio: '4:3', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-7', title: 'SideBySideWide – image right', body: 'Wide image on the right. Great for hero-style content.', template: 'SideBySideWide', imagePosition: 'right', imageAspectRatio: '4:3', image: productImg },
    // HeroOverlay (left and center only)
    { _type: 'textImageBlock', _key: 'p-tib-8', title: 'HeroOverlay – left, 16:7', body: 'Full bleed with text overlay left. Open Graph standard aspect ratio.', template: 'HeroOverlay', overlayAlignment: 'left', imageAspectRatio: '16:7', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-9', title: 'HeroOverlay – center, 16:9', body: 'Centered overlay. Widescreen 16:9 aspect ratio.', template: 'HeroOverlay', overlayAlignment: 'center', imageAspectRatio: '16:9', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-10', title: 'HeroOverlay – center, 21:9', body: 'Cinematic 21:9. Maximum impact for hero sections.', template: 'HeroOverlay', overlayAlignment: 'center', imageAspectRatio: '21:9', image: productImg },
    // Stacked
    { _type: 'textImageBlock', _key: 'p-tib-11', title: 'Stacked – image top, text left', body: 'Large image on top. Text below, left aligned.', template: 'Stacked', stackImagePosition: 'top', stackAlignment: 'left', imageAspectRatio: '16:7', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-12', title: 'Stacked – image top, text center', body: 'Image on top. Text centered below.', template: 'Stacked', stackImagePosition: 'top', stackAlignment: 'center', imageAspectRatio: '16:9', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-13', title: 'Stacked – image bottom, text left', body: 'Text first, then image. Left aligned.', template: 'Stacked', stackImagePosition: 'bottom', stackAlignment: 'left', imageAspectRatio: '16:7', image: productImg },
    { _type: 'textImageBlock', _key: 'p-tib-14', title: 'Stacked – image bottom, text center', body: 'Text above, image below. Centered layout.', template: 'Stacked', stackImagePosition: 'bottom', stackAlignment: 'center', imageAspectRatio: '16:9', image: productImg },
  ]

  if (carouselImage1 && carouselImage2 && carouselImage3 && carouselImage4) {
    productSections.push({
      _type: 'carousel',
      _key: 'p-car',
      title: 'Product carousel (4+ items)',
      items: [
        { _type: 'cardItem', _key: 'pc1', title: 'Product A', description: 'First in the lineup.', image: imageRef(carouselImage1), aspectRatio: '4:5', link: '/products/a', ctaText: 'View' },
        { _type: 'cardItem', _key: 'pc2', title: 'Product B', description: 'Second option for you.', image: imageRef(carouselImage2), aspectRatio: '4:5', link: '/products/b', ctaText: 'View' },
        { _type: 'cardItem', _key: 'pc3', title: 'Product C', description: 'Wider card (8:5).', image: imageRef(carouselImage3), aspectRatio: '8:5', link: '/products/c', ctaText: 'View' },
        { _type: 'cardItem', _key: 'pc4', title: 'Product D', description: 'Fourth and final.', image: imageRef(carouselImage4), aspectRatio: '4:5', link: '/products/d', ctaText: 'View' },
      ],
    })
    productSections.push({
      _type: 'fullBleedVerticalCarousel',
      _key: 'p-fbvc',
      items: [
        { _type: 'fullBleedVerticalCarouselItem', _key: 'pfb1', title: 'Product story 1', description: 'First chapter of the product narrative.', image: imageRef(carouselImage1) },
        { _type: 'fullBleedVerticalCarouselItem', _key: 'pfb2', title: 'Product story 2', description: 'Second chapter. Building the case.', image: imageRef(carouselImage2) },
        { _type: 'fullBleedVerticalCarouselItem', _key: 'pfb3', title: 'Product story 3', description: 'Third chapter. The details matter.', image: imageRef(carouselImage3) },
        { _type: 'fullBleedVerticalCarouselItem', _key: 'pfb4', title: 'Product story 4', description: 'Final chapter. Ready to get started?', image: imageRef(carouselImage4) },
      ],
    })
  }

  const productPage = {
    _type: 'page',
    _id: 'page-product',
    title: 'Product',
    slug: { _type: 'slug', current: 'product' },
    sections: productSections,
  }

  await client.createOrReplace(productPage)
  console.log('Created page: Product (slug: product)')
  console.log('Done. Open your app to see the seeded content.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
