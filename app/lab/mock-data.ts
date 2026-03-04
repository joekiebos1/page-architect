/**
 * Mock data for Lab block experiments.
 * Replace with real content when promoting blocks.
 */

export const mockFullBleedVerticalCarousel = {
  surface: 'ghost' as const,
  items: [
    {
      title: 'First story',
      description:
        'Add an image or video in Sanity Studio. This text will scroll from bottom to top as you scroll through the carousel.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
    },
    {
      title: 'Second story',
      description:
        'Each item gets its own full-bleed media and text overlay. The stepper on the right shows your progress.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
    },
  ],
}

export const mockRotatingMedia = {
  variant: 'small' as const,
  surface: 'ghost' as const,
  items: [
    { image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80', title: 'Card 1', label: 'Label 1' },
    { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80', title: 'Card 2', label: 'Label 2' },
    { image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80', title: 'Card 3', label: 'Label 3' },
    { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', title: 'Card 4', label: 'Label 4' },
    { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', title: 'Card 5', label: 'Label 5' },
    { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', title: 'Card 6', label: 'Label 6' },
  ],
}

export const mockHero = {
  productName: 'Product Name',
  headline: 'Designed for the way you live.',
  subheadline: 'Clean lines. Thoughtful details. Built to last.',
  ctaText: 'Shop now',
  ctaLink: '#',
  cta2Text: 'Learn more',
  cta2Link: '#',
  image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
  imagePosition: 'right' as const,
}
