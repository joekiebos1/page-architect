import { defineField, defineType } from 'sanity'
import { IconPickerInput } from '../../components/IconPickerInput'

export const proofPointsBlock = defineType({
  name: 'proofPoints',
  type: 'object',
  title: 'Proof Points',
  description: 'Text + icon strip for top reasons to believe. Often used at the top of a page.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section Title',
      description: 'Optional heading above the proof points',
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Proof Points',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
            {
              name: 'icon',
              type: 'string',
              title: 'Icon',
              components: {
                input: IconPickerInput,
              },
            },
          ],
          preview: {
            select: { title: 'title' },
            prepare: ({ title }) => ({ title: title || 'Proof point' }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: title || 'Proof Points',
      subtitle: 'Proof points block',
    }),
  },
})
