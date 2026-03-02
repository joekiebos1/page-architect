import { defineField, defineType } from 'sanity'

export const heroBlock = defineType({
  name: 'hero',
  type: 'object',
  title: 'Hero',
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Variant',
      description: 'Category: full-width hero for category/landing pages. Product: compact layout for product pages.',
      options: {
        list: [
          { value: 'category', title: 'Category' },
          { value: 'product', title: 'Product' },
        ],
        layout: 'radio',
      },
      initialValue: 'category',
    }),
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
      title: 'Key visual (upload)',
      description: 'Upload or use Image URL below',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageUrl',
      type: 'string',
      title: 'Image URL',
      description: 'External image URL (e.g. from store.google.com). Used when no image is uploaded.',
    }),
  ],
  preview: {
    select: { headline: 'headline', variant: 'variant' },
    prepare: ({ headline, variant }) => ({
      title: headline || 'Hero',
      subtitle: variant === 'product' ? 'Hero (Product)' : 'Hero (Category)',
    }),
  },
})
