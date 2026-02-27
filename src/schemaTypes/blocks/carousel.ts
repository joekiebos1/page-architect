import { defineField, defineType } from 'sanity'

export const carouselBlock = defineType({
  name: 'carousel',
  type: 'object',
  title: 'Carousel',
  description: 'A horizontal carousel of cards with navigation arrows.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section title',
      description: 'Optional heading above the carousel',
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Cards',
      of: [{ type: 'cardItem' }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('Add at least one card'),
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({
      title: title || 'Carousel',
      subtitle: `${items?.length ?? 0} card(s)`,
    }),
  },
})
