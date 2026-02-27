import { defineField, defineType } from 'sanity'

export const cardItem = defineType({
  name: 'cardItem',
  type: 'object',
  title: 'Card',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 2,
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aspectRatio',
      type: 'string',
      title: 'Card size',
      description: '4:5 = 1 slot, 8:5 = 2 slots (wider)',
      options: {
        list: [
          { value: '4:5', title: '4:5 (1 slot)' },
          { value: '8:5', title: '8:5 (2 slots)' },
        ],
        layout: 'radio',
      },
      initialValue: '4:5',
    }),
    defineField({
      name: 'link',
      type: 'url',
      title: 'Link',
      description: 'Optional link for the card',
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'Button label',
      description: 'Optional button (low emphasis). Requires a link.',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: title || 'Card',
    }),
  },
})

export const cardBlock = defineType({
  name: 'cardBlock',
  type: 'object',
  title: 'Card grid',
  description: 'A grid of cards. Reserved for CardGrid block.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section title',
      description: 'Optional heading above the cards',
    }),
    defineField({
      name: 'textPosition',
      type: 'string',
      title: 'Text position',
      options: {
        list: [
          { value: 'top', title: 'Top' },
          { value: 'bottom', title: 'Bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'bottom',
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
      title: title || 'Card grid',
      subtitle: `${items?.length ?? 0} card(s)`,
    }),
  },
})
