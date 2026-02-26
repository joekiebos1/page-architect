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
