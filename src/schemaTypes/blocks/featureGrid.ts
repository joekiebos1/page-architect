import { defineField, defineType } from 'sanity'

export const featureGridBlock = defineType({
  name: 'featureGrid',
  type: 'object',
  title: 'Feature Grid',
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
      title: 'Section Title',
    }),
    defineField({
      name: 'titleLevel',
      type: 'string',
      title: 'Heading level',
      description: 'Semantic level for accessibility and size. AI can assign based on document structure.',
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
