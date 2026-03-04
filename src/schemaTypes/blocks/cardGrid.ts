import { defineField, defineType } from 'sanity'
import { spacingTopField, spacingBottomField } from '../shared/spacingFields'

export const cardGridItem = defineType({
  name: 'cardGridItem',
  type: 'object',
  title: 'Card',
  fields: [
    defineField({
      name: 'cardStyle',
      type: 'string',
      title: 'Card style',
      description: 'image-above: image on top, text below. text-on-colour: text on coloured background. text-on-image: text overlay on image.',
      options: {
        list: [
          { value: 'image-above', title: 'Image above' },
          { value: 'text-on-colour', title: 'Text on colour' },
          { value: 'text-on-image', title: 'Text on image' },
        ],
        layout: 'radio',
      },
      initialValue: 'image-above',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 2,
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.cardStyle === 'text-on-colour',
    }),
    defineField({
      name: 'imageUrl',
      type: 'string',
      title: 'Image URL',
      description: 'External image URL. Used when no image is uploaded.',
      hidden: ({ parent }) => parent?.cardStyle === 'text-on-colour',
    }),
    defineField({
      name: 'videoUrl',
      type: 'string',
      title: 'Video URL',
      description: 'External video URL. When set, video is shown instead of image (image-above only).',
      hidden: ({ parent }) => parent?.cardStyle === 'text-on-colour',
    }),
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'CTA label',
      description: 'Call-to-action button label.',
      hidden: ({ parent }) => parent?.cardStyle === 'text-on-colour',
    }),
    defineField({
      name: 'ctaLink',
      type: 'string',
      title: 'CTA link',
      description: 'Call-to-action destination URL.',
      hidden: ({ parent }) => parent?.cardStyle === 'text-on-colour' || !parent?.ctaText,
    }),
    defineField({
      name: 'surface',
      type: 'string',
      title: 'Background',
      description: 'For text-on-colour: subtle or bold background.',
      options: {
        list: [
          { value: 'subtle', title: 'Subtle' },
          { value: 'bold', title: 'Bold' },
        ],
        layout: 'radio',
      },
      initialValue: 'bold',
      hidden: ({ parent }) => parent?.cardStyle !== 'text-on-colour',
    }),
  ],
  preview: {
    select: { title: 'title', cardStyle: 'cardStyle' },
    prepare: ({ title, cardStyle }) => ({
      title: title || 'Card',
      subtitle: cardStyle === 'image-above' ? 'Image above' : cardStyle === 'text-on-colour' ? 'Text on colour' : 'Text on image',
    }),
  },
})

export const cardGridBlock = defineType({
  name: 'cardGrid',
  type: 'object',
  title: 'Card grid',
  description: 'Grid of 2, 3, or 4 cards. Each card can have image above, text on colour, or text on image.',
  fields: [
    spacingTopField,
    spacingBottomField,
    defineField({
      name: 'columns',
      type: 'string',
      title: 'Columns',
      description: 'Number of columns on desktop (2, 3, or 4).',
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
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section title',
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
    prepare: ({ title, columns, items }) => ({
      title: title || 'Card grid',
      subtitle: `${columns} cols · ${items?.length ?? 0} card(s)`,
    }),
  },
})
