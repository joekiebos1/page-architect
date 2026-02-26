import { defineField, defineType } from 'sanity'

export const heroBlock = defineType({
  name: 'hero',
  type: 'object',
  title: 'Hero',
  fields: [
    defineField({
      name: 'productName',
      type: 'string',
      title: 'Product name',
      description: 'e.g. JioProduct - shown above headline with icon',
    }),
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
    }),
    defineField({
      name: 'subheadline',
      type: 'text',
      title: 'Description',
      description: 'Body text below headline (in hero section)',
      rows: 3,
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'Primary CTA Text',
    }),
    defineField({
      name: 'ctaLink',
      type: 'string',
      title: 'Primary CTA Link',
    }),
    defineField({
      name: 'cta2Text',
      type: 'string',
      title: 'Secondary CTA Text',
    }),
    defineField({
      name: 'cta2Link',
      type: 'string',
      title: 'Secondary CTA Link',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Key visual',
      description: '2:1 aspect ratio recommended',
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
