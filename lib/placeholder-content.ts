/**
 * Predefined sample content per Block type.
 * Used by "Fill with sample" button in Sanity Studio to test Block rendering.
 */

export const PLACEHOLDER_CONTENT = {
  hero: {
    headline: 'Transform your workflow',
    subheadline:
      'Discover how our platform helps teams ship faster and collaborate better.',
    ctaText: 'Get started',
    ctaLink: '/signup',
  },
  featureGrid: {
    title: 'Why choose us',
    items: [
      {
        title: 'Fast',
        description:
          'Built for speed. Deploy in seconds, not minutes.',
      },
      {
        title: 'Reliable',
        description:
          'Uptime you can count on. We handle the infrastructure.',
      },
      {
        title: 'Secure',
        description:
          'Enterprise-grade security. Your data stays yours.',
      },
    ],
  },
  textImageBlock: {
    title: 'Designed for real teams',
    body: 'We built this with feedback from hundreds of teams. Every feature exists because someone asked for it. No bloat, no complexity—just what you need to get work done.',
    template: 'SideBySide',
    imagePosition: 'left',
    imageAspectRatio: '4:3',
  },
  fullBleedVerticalCarousel: {
    items: [
      {
        title: 'First story',
        description:
          'Add an image or video in Sanity Studio. This text will scroll from bottom to top as you scroll through the carousel.',
      },
      {
        title: 'Second story',
        description:
          'Each item gets its own full-bleed media and text overlay. The stepper on the right shows your progress.',
      },
    ],
  },
  proofPoints: {
    title: 'Why believe us',
    items: [
      { title: 'Trusted by millions', description: 'Join 10M+ satisfied customers', icon: 'IcCheckboxOn' },
      { title: 'Award-winning', description: 'Industry recognition for excellence', icon: 'IcAward' },
      { title: '24/7 support', description: 'We\'re here when you need us', icon: 'IcProtection' },
    ],
  },
} as const
