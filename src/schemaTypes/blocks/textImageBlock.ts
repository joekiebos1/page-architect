import { defineField, defineType } from 'sanity'

export const textImageBlock = defineType({
  name: 'textImageBlock',
  type: 'object',
  title: 'Text + Image',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Body',
      rows: 4,
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'CTA Text',
      description: 'e.g. "Visit JioFinance"',
    }),
    defineField({
      name: 'ctaLink',
      type: 'string',
      title: 'CTA Link',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      title: 'Image Position',
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
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: title || 'Text + Image',
      subtitle: 'Text and image block',
    }),
  },
})
