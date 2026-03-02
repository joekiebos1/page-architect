import { defineField, defineType } from 'sanity'

export const carouselBlock = defineType({
  name: 'carousel',
  type: 'object',
  title: 'Carousel',
  description: 'A horizontal carousel of cards with navigation arrows.',
  fields: [
    defineField({
      name: 'spacing',
      type: 'string',
      title: 'Spacing',
      description: 'Space below this block.',
      options: {
        list: [
          { value: 'small', title: 'Small' },
          { value: 'medium', title: 'Medium' },
          { value: 'large', title: 'Large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section title',
      description: 'Optional heading above the carousel',
    }),
    defineField({
      name: 'cardSize',
      type: 'string',
      title: 'Card size',
      description: 'Large: 8-col cards, 1 visible, 2:1 only. Compact: 3 cards per row (4:5) or mixed 4:5/8:5.',
      options: {
        list: [
          { value: 'compact', title: 'Compact (3 per row)' },
          { value: 'large', title: 'Large (1 per row, 8 cols)' },
        ],
        layout: 'radio',
      },
      initialValue: 'compact',
    }),
    defineField({
      name: 'titleLevel',
      type: 'string',
      title: 'Heading level',
      description: 'Semantic level for accessibility and size.',
      options: {
        list: [
          { value: 'h2', title: 'H2' },
          { value: 'h3', title: 'H3' },
          { value: 'h4', title: 'H4' },
        ],
        layout: 'radio',
      },
      initialValue: 'h2',
      hidden: ({ parent }) => !parent?.title,
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
