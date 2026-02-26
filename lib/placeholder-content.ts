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
    imagePosition: 'left',
  },
} as const
