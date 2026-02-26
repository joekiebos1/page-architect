import { defineField, defineType } from 'sanity'

export const heroBlock = defineType({
  name: 'hero',
  type: 'object',
  title: 'Hero',
  fields: [
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
    }),
    defineField({
      name: 'subheadline',
      type: 'text',
      title: 'Subheadline',
      rows: 3,
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'CTA Text',
    }),
    defineField({
      name: 'ctaLink',
      type: 'string',
      title: 'CTA Link',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Background Image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: { headline: 'headline' },
    prepare: ({ headline }) => ({
      title: headline || 'Hero',
      subtitle: 'Hero block',
    }),
  },
})
