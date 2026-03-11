import { defineField, defineType } from 'sanity'
import { DS_THEMES, DS_THEME_DEFAULT } from '../shared/dsThemes'
import { spacingTopField, spacingBottomField } from '../shared/spacingFields'
import { minimalBackgroundStyleField } from '../shared/minimalBackgroundStyleField'
const CARD_TYPE_MEDIA_BELOW = 'media-description-below'
const CARD_TYPE_MEDIA_INSIDE = 'media-description-inside'

export const cardGridItem = defineType({
  name: 'cardGridItem',
  type: 'object',
  title: 'Card',
  fields: [
    defineField({
      name: 'cardType',
      type: 'string',
      title: 'Card type',
      description: 'Media + description below: image/video with text underneath. Media + description inside: text overlay on image. For text inside cards, use the Lab block.',
      options: {
        list: [
          { value: CARD_TYPE_MEDIA_BELOW, title: 'Media + description below' },
          { value: CARD_TYPE_MEDIA_INSIDE, title: 'Media + description inside' },
        ],
        layout: 'radio',
      },
      initialValue: CARD_TYPE_MEDIA_BELOW,
    }),
    defineField({
      name: 'title',
      type: 'text',
      title: 'Title',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 2,
    }),
    // Media types
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      type: 'string',
      title: 'Image URL',
      description: 'External image URL. Used when no image is uploaded.',
    }),
    defineField({
      name: 'videoUrl',
      type: 'string',
      title: 'Video URL',
      description: 'External video URL. When set, video is shown instead of image. Media + description below only.',
      hidden: ({ parent }) => parent?.cardType !== CARD_TYPE_MEDIA_BELOW,
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'CTA label',
      description: 'Call-to-action button label. Media + description below only.',
      hidden: ({ parent }) => parent?.cardType !== CARD_TYPE_MEDIA_BELOW,
    }),
    defineField({
      name: 'ctaLink',
      type: 'string',
      title: 'CTA link',
      description: 'Call-to-action destination URL.',
      hidden: ({ parent }) => parent?.cardType !== CARD_TYPE_MEDIA_BELOW || !parent?.ctaText,
    }),
  ],
  preview: {
    select: { title: 'title', cardType: 'cardType' },
    prepare: ({ title, cardType }) => ({
      title: title || 'Card',
      subtitle: cardType === CARD_TYPE_MEDIA_INSIDE ? 'Media + description inside' : 'Media + description below',
    }),
  },
})

export const cardGridBlock = defineType({
  name: 'cardGrid',
  type: 'object',
  title: 'Card grid',
  description: 'Grid of 2, 3, or 4 cards. Media + description below or inside. For text inside cards, use the Lab block.',
  fields: [
    spacingTopField,
    spacingBottomField,
    // Layout
    defineField({
      name: 'columns',
      type: 'string',
      title: 'Layout',
      description: 'Number of cards per row on desktop (2, 3, or 4).',
      options: {
        list: [
          { value: '2', title: '2' },
          { value: '3', title: '3' },
          { value: '4', title: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '3',
    }),
    // Colour
    defineField({
      name: 'theme',
      type: 'string',
      title: 'Theme',
      description: 'Design system theme. Default: MyJio.',
      options: {
        list: [...DS_THEMES],
        layout: 'dropdown',
      },
      initialValue: DS_THEME_DEFAULT,
    }),
    defineField({
      name: 'blockAccent',
      type: 'string',
      title: 'Theming',
      description: 'Primary = brand, Secondary = brand secondary, Neutral = grey.',
      options: {
        list: [
          { value: 'primary', title: 'Primary (brand)' },
          { value: 'secondary', title: 'Secondary' },
          { value: 'neutral', title: 'Neutral (grey)' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'surface',
      type: 'string',
      title: 'Emphasis',
      description: 'Ghost = no background. Minimal = light tint, Subtle = medium tint, Bold = strong tint. Colour comes from Theming.',
      options: {
        list: [
          { value: 'ghost', title: 'Ghost (no background)' },
          { value: 'minimal', title: 'Minimal' },
          { value: 'subtle', title: 'Subtle' },
          { value: 'bold', title: 'Bold' },
        ],
        layout: 'radio',
      },
      initialValue: 'ghost',
    }),
    minimalBackgroundStyleField('surface'),
    // Content
    defineField({
      name: 'title',
      type: 'text',
      title: 'Section title',
      rows: 2,
      description: 'Press Enter for a line break.',
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Cards',
      of: [{ type: 'cardGridItem' }],
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
  ],
  preview: {
    select: { title: 'title', columns: 'columns', items: 'items' },
    prepare: ({ title, columns, items }) => {
      const inferredTitle = (title || '').toString().trim() || 'Card grid'
      return {
        title: inferredTitle,
        subtitle: `Card grid · ${columns ?? '3'} cols · ${items?.length ?? 0} card(s)`,
      }
    },
  },
})
