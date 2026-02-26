import { defineField, defineType } from 'sanity'

export const featureGridBlock = defineType({
  name: 'featureGrid',
  type: 'object',
  title: 'Feature Grid',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section Title',
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Features',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
          preview: {
            select: { title: 'title' },
            prepare: ({ title }) => ({ title: title || 'Feature' }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: title || 'Feature Grid',
      subtitle: 'Feature grid block',
    }),
  },
})
