import { defineField, defineType } from 'sanity'

export const fullBleedVerticalCarouselItem = defineType({
  name: 'fullBleedVerticalCarouselItem',
  type: 'object',
  title: 'Carousel item',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 3,
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      description: 'Use image or video (not both)',
      options: { hotspot: true },
      hidden: ({ parent }) => Boolean(parent?.video?.asset),
    }),
    defineField({
      name: 'video',
      type: 'file',
      title: 'Video',
      description: 'Use image or video (not both)',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => Boolean(parent?.image?.asset),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: title || 'Carousel item',
    }),
  },
})

export const fullBleedVerticalCarouselBlock = defineType({
  name: 'fullBleedVerticalCarousel',
  type: 'object',
  title: 'Full bleed vertical carousel',
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      description: '1–5 images or videos with title and description',
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(5)
          .error('Add 1 to 5 items'),
      of: [{ type: 'fullBleedVerticalCarouselItem' }],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Full bleed vertical carousel',
      subtitle: `${items?.length ?? 0} item(s)`,
    }),
  },
})
