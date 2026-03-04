import { defineField, defineType } from 'sanity'

/**
 * Lab page – singleton for /lab experiments.
 * Content feeds Hero variants, TopNavBlock, etc.
 */
export const labPageType = defineType({
  name: 'labPage',
  type: 'document',
  title: 'Lab',
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Page title shown in lab header',
      initialValue: 'Lab',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Intro text below the title',
      rows: 2,
    }),
    defineField({
      name: 'hero',
      type: 'object',
      title: 'Hero content',
      description: 'Feeds HeroSplit50, HeroColourImage, HeroColourEdge variants',
      fields: [
        defineField({
          name: 'productName',
          type: 'string',
          title: 'Product name',
        }),
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
          title: 'Image',
          description: 'From Image Library or upload',
          options: { hotspot: true },
        }),
        defineField({
          name: 'imageUrl',
          type: 'string',
          title: 'Image URL',
          description: 'External URL fallback when no image uploaded',
        }),
        defineField({
          name: 'imagePosition',
          type: 'string',
          title: 'Image position',
          options: {
            list: [
              { value: 'left', title: 'Left' },
              { value: 'right', title: 'Right' },
            ],
            layout: 'radio',
          },
          initialValue: 'right',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: title || 'Lab',
      subtitle: 'Experiments at /lab',
    }),
  },
})
