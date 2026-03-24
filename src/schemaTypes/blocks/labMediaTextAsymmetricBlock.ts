import { defineField, defineType } from 'sanity'
import { DS_THEMES, DS_THEME_DEFAULT } from '../shared/dsThemes'
import { spacingTopField, spacingBottomField } from '../shared/spacingFields'
import { surfaceColourField, emphasisField } from '../shared/blockColourFields'
import { minimalBackgroundStyleField } from '../shared/minimalBackgroundStyleField'

function getLabAsymmetricSectionFromPath(
  document: { sections?: Array<{ variant?: string }> },
  path: unknown[],
): { variant?: string } | undefined {
  const sections = document?.sections
  if (!sections || !Array.isArray(path) || path[0] !== 'sections') return undefined
  const sectionIndex = path[1]
  if (typeof sectionIndex !== 'number') return undefined
  return sections[sectionIndex]
}

/** Lab-only: merged paragraph + long-form rows (optional title per row, body size per row). */
export const labMediaTextAsymmetricParagraphRow = defineType({
  name: 'labMediaTextAsymmetricParagraphRow',
  type: 'object',
  title: 'Paragraph',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Optional. Leave empty for a body-only paragraph.',
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Body',
      rows: 5,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'bodyTypography',
      type: 'string',
      title: 'Body size',
      description: 'Regular is standard body; Large uses a larger body style.',
      options: {
        list: [
          { value: 'regular', title: 'Regular' },
          { value: 'large', title: 'Large' },
        ],
        layout: 'radio',
      },
      initialValue: 'regular',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkText',
      type: 'string',
      title: 'Link text',
      description: 'Optional text link.',
      hidden: ({ document, path }) => {
        const block = getLabAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])
        return block?.variant !== 'paragraphs'
      },
    }),
    defineField({
      name: 'linkUrl',
      type: 'string',
      title: 'Link URL',
      description: 'URL for the optional link.',
      hidden: ({ document, path }) => {
        const block = getLabAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])
        return block?.variant !== 'paragraphs'
      },
    }),
  ],
  preview: {
    select: { title: 'title', body: 'body', bodyTypography: 'bodyTypography' },
    prepare: ({ title, body, bodyTypography }) => {
      const b = body ? String(body).replace(/\s+/g, ' ') : ''
      const lead = title && String(title).trim().length > 0 ? String(title) : b.length > 0 ? (b.length > 60 ? `${b.slice(0, 60)}…` : b) : 'Paragraph'
      return {
        title: lead,
        subtitle: bodyTypography === 'large' ? 'Large body' : 'Regular body',
      }
    },
  },
})

export const labMediaTextAsymmetricBlock = defineType({
  name: 'labMediaTextAsymmetric',
  type: 'object',
  title: 'Media + Text Asymmetric (Lab)',
  description: 'Lab: left block title, right column — merged paragraphs (optional title + body size + optional link), FAQ, or links.',
  fields: [
    spacingTopField,
    spacingBottomField,
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Pattern',
      description: 'Choose one pattern. Cannot mix.',
      options: {
        list: [
          { value: 'paragraphs', title: 'Paragraphs – optional title, body, body size, optional link' },
          { value: 'faq', title: 'FAQ – accordion (question + answer)' },
          { value: 'links', title: 'Links – clickable labels' },
        ],
        layout: 'radio',
      },
      initialValue: 'paragraphs',
      validation: (Rule) => Rule.required(),
    }),
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
    surfaceColourField(),
    emphasisField(),
    minimalBackgroundStyleField('emphasis'),
    defineField({
      name: 'blockTitle',
      type: 'string',
      title: 'Block title',
      description: 'Shown on the left side.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paragraphRows',
      type: 'array',
      title: 'Paragraphs',
      description: 'Each row: optional title, body, body size, optional link.',
      of: [{ type: 'labMediaTextAsymmetricParagraphRow' }],
      hidden: ({ parent }) => parent?.variant !== 'paragraphs',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { variant?: string }
          if (parent?.variant !== 'paragraphs') return true
          const rows = Array.isArray(value) ? value : []
          const hasBody = rows.some((r) => {
            const row = r as { body?: string }
            return typeof row?.body === 'string' && row.body.trim().length > 0
          })
          if (!hasBody) return 'Add at least one paragraph with body text'
          return true
        }),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [{ type: 'mediaTextAsymmetricItem' }],
      hidden: ({ parent }) => parent?.variant === 'paragraphs',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { variant?: string }
          if (parent?.variant === 'paragraphs') return true
          if (!value || value.length < 1) return 'Add at least one item'
          return true
        }),
    }),
  ],
  preview: {
    select: {
      blockTitle: 'blockTitle',
      variant: 'variant',
      items: 'items',
      paragraphRows: 'paragraphRows',
    },
    prepare: ({ blockTitle, variant, items, paragraphRows }) => {
      const v = variant != null && variant !== '' ? variant : 'paragraphs'
      let count: string
      if (v === 'paragraphs') {
        const n = Array.isArray(paragraphRows) ? paragraphRows.length : 0
        count = `${n} paragraph${n === 1 ? '' : 's'}`
      } else {
        const n = Array.isArray(items) ? items.length : 0
        count = `${n} item(s)`
      }
      return {
        title: blockTitle || 'Media + Text Asymmetric (Lab)',
        subtitle: `${v} · ${count}`,
      }
    },
  },
})
