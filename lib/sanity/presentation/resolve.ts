import { defineLocations } from 'sanity/presentation'

export const resolve = {
  locations: {
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: doc?.slug === 'home' ? '/' : `/${doc?.slug ?? ''}`,
          },
          { title: 'Home', href: '/' },
          { title: 'JioKarna', href: '/jiokarna' },
        ],
      }),
    }),
    labPage: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Lab', href: '/lab' },
        ],
      }),
    }),
  },
}
