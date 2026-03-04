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

async function seed() {
  console.log('Seeding Sanity...')

  // Use images from Sanity Image Library only (no external URLs)
  const imageAssets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id }`)
  const assetIds = imageAssets.map((a) => a._id)
  const getAsset = (i) => (assetIds.length > 0 ? assetIds[i % assetIds.length] : null)

  if (assetIds.length === 0) {
    console.warn('Image Library is empty. Upload images via Image Library → Upload images in Sanity Studio, then re-run this seed.')
  } else {
    console.log(`Using ${assetIds.length} image(s) from Image Library`)
  }

  const heroImageId = getAsset(0)
  const mediaTextId = getAsset(1)
  const carouselImage1 = getAsset(2)
  const carouselImage2 = getAsset(3)
  const carouselImage3 = getAsset(4)
  const carouselImage4 = getAsset(5)
  const productHeroId = getAsset(6)
  const productMediaTextId = getAsset(7)
  const rotImg1 = getAsset(8)
  const rotImg2 = getAsset(9)
  const rotImg3 = getAsset(10)
  const rotImg4 = getAsset(11)
  const rotImg5 = getAsset(12)
  const rotImg6 = getAsset(13)
  const rotImg7 = getAsset(14)
  const rotImg8 = getAsset(15)

  const imageRef = (id) => id ? { _type: 'image', asset: { _type: 'reference', _ref: id } } : undefined

  const sections = [
    {
      _type: 'hero',
      _key: 'hero-1',
      variant: 'category',
      spacingBottom: 'large',
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
        spacingTop: 'large',
        spacingBottom: 'large',
        blockAccent: 'primary',
        surface: 'ghost',
        title: 'Why believe us',
        items: [
          { _key: 'pp1', title: 'Trusted by millions', description: 'Join 10M+ satisfied customers', icon: 'IcCheckboxOn' },
          { _key: 'pp2', title: 'Award-winning', description: 'Industry recognition for excellence', icon: 'IcAward' },
          { _key: 'pp3', title: '24/7 support', description: "We're here when you need us", icon: 'IcProtection' },
        ],
      },
      {
        _type: 'cardGrid',
        _key: 'cg-1',
        spacingTop: 'large',
        spacingBottom: 'large',
        columns: '3',
        blockAccent: 'primary',
        surface: 'ghost',
        title: 'Why choose us',
        items: [
          { _type: 'cardGridItem', _key: 'c1', cardStyle: 'image-above', title: 'Fast', description: 'Built for speed. Deploy in seconds, not minutes.', image: imageRef(mediaTextId) },
          { _type: 'cardGridItem', _key: 'c2', cardStyle: 'text-on-colour', title: 'Reliable', description: 'Uptime you can count on. We handle the infrastructure.', surface: 'bold' },
          { _type: 'cardGridItem', _key: 'c3', cardStyle: 'text-on-image', title: 'Secure', description: 'Enterprise-grade security. Your data stays yours.', image: imageRef(carouselImage1), surface: 'bold' },
        ],
      },
      // MediaTextBlock – all variants with all content fields
      {
        _type: 'mediaTextBlock',
        _key: 'tib-1',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'SideBySide',
        size: 'feature',
        imagePosition: 'left',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        contentWidth: 'Default',
        mediaStyle: 'contained',
        imageAspectRatio: '4:3',
        eyebrow: 'FEATURED',
        title: 'Designed for real teams',
        body: 'We built this with feedback from hundreds of teams. Every feature exists because someone asked for it. No bloat, no complexity—just what you need to get work done.',
        ctaText: 'Visit JioFinance',
        ctaLink: '/finance',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-2',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'SideBySide',
        size: 'feature',
        imagePosition: 'right',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        contentWidth: 'Default',
        mediaStyle: 'contained',
        imageAspectRatio: '3:4',
        eyebrow: 'MOBILE GAMES',
        title: 'SideBySide – image right',
        body: 'Classic 50/50 layout with image on the right. The eyebrow, title, body, and CTA are all populated for testing.',
        ctaText: 'Get started',
        ctaLink: '/signup',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-3',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'SideBySide',
        size: 'feature',
        imagePosition: 'left',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        contentWidth: 'Default',
        mediaStyle: 'contained',
        imageAspectRatio: '1:1',
        eyebrow: 'SIDE BY SIDE',
        title: 'SideBySide – image left',
        body: 'Text and image side by side. Image on the left.',
        ctaText: 'Learn more',
        ctaLink: '/about',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-4',
        spacingTop: 'small',
        spacingBottom: 'large',
        template: 'SideBySide',
        size: 'feature',
        imagePosition: 'right',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        contentWidth: 'Default',
        mediaStyle: 'contained',
        imageAspectRatio: '16:9',
        eyebrow: 'SIDE BY SIDE',
        title: 'SideBySide – image right',
        body: 'Text and image side by side. Image on the right.',
        ctaText: 'View product',
        ctaLink: '/products',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-4b',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'SideBySide',
        size: 'feature',
        imagePosition: 'left',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        contentWidth: 'M',
        mediaStyle: 'contained',
        imageAspectRatio: '4:3',
        eyebrow: 'NARROW CONTENT',
        title: 'SideBySide – contentWidth narrow',
        body: 'Narrow content width (8 cols). Focused reading experience. All fields: eyebrow, title, body, CTA.',
        ctaText: 'Read more',
        ctaLink: '/blog',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-4c',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'SideBySide',
        size: 'feature',
        imagePosition: 'right',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        contentWidth: 'edgeToEdge',
        mediaStyle: 'contained',
        imageAspectRatio: '16:9',
        eyebrow: 'FULL WIDTH',
        title: 'SideBySide – contentWidth full',
        body: 'Full-width layout. Maximum visual impact.',
        ctaText: 'Explore',
        ctaLink: '/explore',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-5',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'HeroOverlay',
        size: 'feature',
        overlayAlignment: 'left',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        imageAspectRatio: '16:7',
        eyebrow: 'HERO OVERLAY',
        title: 'Full bleed image with text overlay',
        body: 'This layout uses a full-width image with text overlay. Perfect for impactful landing sections. Left-aligned overlay.',
        ctaText: 'Explore',
        ctaLink: '/explore',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-6',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'HeroOverlay',
        size: 'feature',
        overlayAlignment: 'center',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        imageAspectRatio: '16:9',
        eyebrow: 'CENTERED HERO',
        title: 'HeroOverlay – center aligned',
        body: 'Centered overlay on full bleed. Widescreen 16:9. Ideal for campaign or brand moments.',
        ctaText: 'Join now',
        ctaLink: '/join',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-7',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'Stacked',
        stackImagePosition: 'top',
        stackAlignment: 'left',
        mediaSize: 'default',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        eyebrow: 'STACKED LAYOUT',
        title: 'Stacked – image on top, text left',
        body: 'Large image on top. Text below, left aligned. Good for editorial or feature sections.',
        ctaText: 'Read more',
        ctaLink: '/blog',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-8',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'Stacked',
        stackImagePosition: 'bottom',
        stackAlignment: 'center',
        mediaSize: 'default',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        eyebrow: 'STACKED CENTER',
        title: 'Stacked – image on bottom, text center',
        body: 'Text first, then image. Centered layout. Use for testimonials or impact statements.',
        ctaText: 'See all',
        ctaLink: '/gallery',
        image: imageRef(mediaTextId),
      },
      {
        _type: 'mediaTextBlock',
        _key: 'tib-8a',
        spacingTop: 'large',
        spacingBottom: 'large',
        template: 'Stacked',
        stackImagePosition: 'top',
        mediaSize: 'edgeToEdge',
        blockAccent: 'primary',
        blockBackground: 'ghost',
        eyebrow: 'EDGE TO EDGE',
        title: 'Stacked – edge-to-edge media, text center',
        body: 'Full viewport media. Text above/below, always center aligned.',
        ctaText: 'Learn more',
        ctaLink: '/about',
        image: imageRef(mediaTextId),
      },
    ]

  if (carouselImage1 && carouselImage2 && carouselImage3 && carouselImage4) {
    sections.push({
      _type: 'carousel',
      _key: 'car-1',
      spacingTop: 'large',
      spacingBottom: 'large',
      cardSize: 'compact',
      blockAccent: 'primary',
      surface: 'ghost',
      title: 'Featured products',
      items: [
        { _type: 'cardItem', _key: 'c1', cardType: 'media', title: 'Product One', description: 'The first in our lineup. Built for performance.', image: imageRef(carouselImage1), aspectRatio: '4:5', link: '/products/1', ctaText: 'View' },
        { _type: 'cardItem', _key: 'c2', cardType: 'media', title: 'Product Two', description: 'Double the power. Half the effort.', image: imageRef(carouselImage2), aspectRatio: '4:5', link: '/products/2', ctaText: 'View' },
        { _type: 'cardItem', _key: 'c3', cardType: 'media', title: 'Product Three', description: 'Our flagship offering. Everything you need.', image: imageRef(carouselImage3), aspectRatio: '8:5', link: '/products/3', ctaText: 'View' },
        { _type: 'cardItem', _key: 'c4', cardType: 'media', title: 'Product Four', description: 'The complete solution for modern teams.', image: imageRef(carouselImage4), aspectRatio: '4:5', link: '/products/4', ctaText: 'View' },
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
  const productImg = imageRef(productMediaTextId)
  const productSections = [
    {
      _type: 'hero',
      _key: 'p-hero',
      variant: 'category',
      spacingBottom: 'large',
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
      spacingTop: 'large',
      spacingBottom: 'large',
      blockAccent: 'primary',
      surface: 'ghost',
      title: 'Product proof points',
      items: [
        { _key: 'pp1', title: 'Trusted by millions', description: 'Join 10M+ satisfied customers', icon: 'IcCheckboxOn' },
        { _key: 'pp2', title: 'Award-winning', description: 'Industry recognition for excellence', icon: 'IcAward' },
        { _key: 'pp3', title: '24/7 support', description: "We're here when you need us", icon: 'IcProtection' },
        { _key: 'pp4', title: 'Lightning fast', description: 'Built for speed and scale', icon: 'IcRocket' },
        { _key: 'pp5', title: 'Secure by design', description: 'Enterprise-grade security', icon: 'IcLock' },
      ],
    },
    // MediaTextBlock – all variants with all content fields
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-1',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'left',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '4:3',
      eyebrow: 'SIDE BY SIDE',
      title: 'SideBySide – image left, 4:3',
      body: 'Classic 50/50 layout with image on the left. Aspect ratio 4:3. All content fields: eyebrow, title, body, CTA, image.',
      ctaText: 'Visit JioFinance',
      ctaLink: '/finance',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-2',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'right',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '3:4',
      eyebrow: '50/50 LAYOUT',
      title: 'SideBySide – image right, 3:4',
      body: 'Same layout with image on the right. Taller 3:4 aspect ratio. Good for portrait or vertical imagery.',
      ctaText: 'Get started',
      ctaLink: '/signup',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-3',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'right',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '1:1',
      eyebrow: 'SQUARE IMAGE',
      title: 'SideBySide – image right, 1:1',
      body: 'Square image. Perfect for product shots or portraits. Content width narrow for focused reading.',
      ctaText: 'Learn more',
      ctaLink: '/about',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-4',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'left',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '3:4',
      eyebrow: 'SIDE BY SIDE',
      title: 'SideBySide – image left',
      body: 'Text and image side by side. Image on the left.',
      ctaText: 'View product',
      ctaLink: '/products',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-5',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'right',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '3:4',
      eyebrow: 'SIDE BY SIDE',
      title: 'SideBySide – image right',
      body: 'Text and image side by side. Image on the right.',
      ctaText: 'Explore',
      ctaLink: '/explore',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-6',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'left',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '4:3',
      eyebrow: 'SIDE BY SIDE',
      title: 'SideBySide – image left',
      body: 'Text and image side by side. Image on the left.',
      ctaText: 'Join now',
      ctaLink: '/join',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-7',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'SideBySide',
      size: 'feature',
      imagePosition: 'right',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      contentWidth: 'Default',
      mediaStyle: 'contained',
      imageAspectRatio: '4:3',
      eyebrow: 'SIDE BY SIDE',
      title: 'SideBySide – image right',
      body: 'Text and image side by side. Image on the right.',
      ctaText: 'Read more',
      ctaLink: '/blog',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-8',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'HeroOverlay',
      size: 'feature',
      overlayAlignment: 'left',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      imageAspectRatio: '16:7',
      eyebrow: 'FULL BLEED',
      title: 'HeroOverlay – left, 16:7',
      body: 'Full bleed with text overlay left. Open Graph standard aspect ratio. Maximum impact.',
      ctaText: 'See all',
      ctaLink: '/gallery',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-9',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'HeroOverlay',
      size: 'feature',
      overlayAlignment: 'center',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      imageAspectRatio: '16:9',
      eyebrow: 'HERO CENTER',
      title: 'HeroOverlay – center, 16:9',
      body: 'Centered overlay. Widescreen 16:9 aspect ratio. Ideal for campaign or brand moments.',
      ctaText: 'Get started',
      ctaLink: '/signup',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-10',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'HeroOverlay',
      size: 'feature',
      overlayAlignment: 'center',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      imageAspectRatio: '21:9',
      eyebrow: 'CINEMATIC',
      title: 'HeroOverlay – center, 21:9',
      body: 'Cinematic 21:9. Maximum impact for hero sections. All content fields populated.',
      ctaText: 'Explore',
      ctaLink: '/explore',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-11',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'Stacked',
      stackImagePosition: 'top',
      stackAlignment: 'left',
      mediaSize: 'default',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      eyebrow: 'STACKED TOP',
      title: 'Stacked – image top, text left',
      body: 'Large image on top. Text below, left aligned. Good for editorial or feature sections.',
      ctaText: 'Visit JioFinance',
      ctaLink: '/finance',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-12',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'Stacked',
      stackImagePosition: 'top',
      stackAlignment: 'center',
      mediaSize: 'default',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      eyebrow: 'STACKED CENTER',
      title: 'Stacked – image top, text center',
      body: 'Image on top. Text centered below. Use for testimonials or impact statements.',
      ctaText: 'Learn more',
      ctaLink: '/about',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-13',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'Stacked',
      stackImagePosition: 'bottom',
      stackAlignment: 'left',
      mediaSize: 'default',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      eyebrow: 'TEXT FIRST',
      title: 'Stacked – image bottom, text left',
      body: 'Text first, then image. Left aligned. Good when copy leads the narrative.',
      ctaText: 'View product',
      ctaLink: '/products',
      image: productImg,
    },
    {
      _type: 'mediaTextBlock',
      _key: 'p-tib-14',
      spacingTop: 'large',
      spacingBottom: 'large',
      template: 'Stacked',
      stackImagePosition: 'bottom',
      stackAlignment: 'center',
      mediaSize: 'default',
      blockAccent: 'primary',
      blockBackground: 'ghost',
      eyebrow: 'STACKED BOTTOM',
      title: 'Stacked – image bottom, text center',
      body: 'Text above, image below. Centered layout. All content fields: eyebrow, title, body, CTA, image.',
      ctaText: 'See all',
      ctaLink: '/gallery',
      image: productImg,
    },
  ]

  if (carouselImage1 && carouselImage2 && carouselImage3 && carouselImage4) {
    productSections.push({
      _type: 'carousel',
      _key: 'p-car',
      spacingTop: 'large',
      spacingBottom: 'large',
      cardSize: 'compact',
      blockAccent: 'primary',
      surface: 'ghost',
      title: 'Product carousel (4+ items)',
      items: [
        { _type: 'cardItem', _key: 'pc1', cardType: 'media', title: 'Product A', description: 'First in the lineup.', image: imageRef(carouselImage1), aspectRatio: '4:5', link: '/products/a', ctaText: 'View' },
        { _type: 'cardItem', _key: 'pc2', cardType: 'media', title: 'Product B', description: 'Second option for you.', image: imageRef(carouselImage2), aspectRatio: '4:5', link: '/products/b', ctaText: 'View' },
        { _type: 'cardItem', _key: 'pc3', cardType: 'media', title: 'Product C', description: 'Wider card (8:5).', image: imageRef(carouselImage3), aspectRatio: '8:5', link: '/products/c', ctaText: 'View' },
        { _type: 'cardItem', _key: 'pc4', cardType: 'media', title: 'Product D', description: 'Fourth and final.', image: imageRef(carouselImage4), aspectRatio: '4:5', link: '/products/d', ctaText: 'View' },
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

  // Lab page – singleton for /lab experiments
  const labImageId = getAsset(0)
  const labPage = {
    _type: 'labPage',
    _id: 'labPage',
    title: 'Lab',
    description: 'Hero variants and TopNavBlock mega menu. Manage content here.',
    hero: {
      productName: 'Product Name',
      headline: 'Designed for the way you live.',
      subheadline: 'Clean lines. Thoughtful details. Built to last.',
      ctaText: 'Shop now',
      ctaLink: '#',
      cta2Text: 'Learn more',
      cta2Link: '#',
      image: labImageId ? { _type: 'image', asset: { _type: 'reference', _ref: labImageId } } : undefined,
      imagePosition: 'right',
    },
  }
  await client.createOrReplace(labPage)
  console.log('Created Lab page (singleton)')

  console.log('Done. Open your app to see the seeded content.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
