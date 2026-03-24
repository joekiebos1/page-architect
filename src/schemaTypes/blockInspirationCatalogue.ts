import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const BLOCK_IDS = [
  'hero',
  'mediaText',
  'mediaText5050',
  'cardGrid',
  'carousel',
  'proofPoints',
  'iconGrid',
  'mediaTextAsymmetric',
  'editorial',
  'fullBleedVerticalCarousel',
  'rotatingMedia',
  'mediaZoomOutOnScroll',
  'topNav',
] as const

/**
 * Block Inspiration catalogue – thumbnails for /studio/block-inspiration.
 * Edit thumbnail images per block. When set, the custom thumbnail is shown in the list.
 */
export const blockInspirationCatalogueType = defineType({
  name: 'blockInspirationCatalogue',
  type: 'document',
  title: 'Block Inspiration',
  icon: ImageIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: 'entries',
      type: 'array',
      title: 'Block thumbnails',
      description: 'Custom thumbnail for each block. When set, shown in the Block Inspiration list. Leave empty to use the default preview.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'blockId',
              type: 'string',
              title: 'Block',
              options: {
                list: BLOCK_IDS.map((id) => ({ value: id, title: id })),
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'thumbnail',
              type: 'image',
              title: 'Thumbnail',
              description: 'Custom thumbnail for the block list. Recommended: 280×180px or similar aspect.',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { blockId: 'blockId' },
            prepare: ({ blockId }) => ({
              title: blockId ?? 'Block',
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Block Inspiration',
      subtitle: '/studio/block-inspiration',
    }),
  },
})
