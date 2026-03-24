import { defineField, defineType } from 'sanity'
import { DS_THEMES, DS_THEME_DEFAULT } from '../shared/dsThemes'
import { spacingTopField, spacingBottomField } from '../shared/spacingFields'
import { surfaceColourField, emphasisField } from '../shared/blockColourFields'
import { minimalBackgroundStyleField } from '../shared/minimalBackgroundStyleField'

function getAsymmetricSectionFromPath(
  document: { sections?: Array<{ variant?: string }> },
  path: unknown[],
): { variant?: string } | undefined {
  const sections = document?.sections
  if (!sections || !Array.isArray(path) || path[0] !== 'sections') return undefined
  const sectionIndex = path[1]
  if (typeof sectionIndex !== 'number') return undefined
  return sections[sectionIndex]
}

export const mediaTextAsymmetricItem = defineType({
  name: 'mediaTextAsymmetricItem',
  type: 'object',
  title: 'Item',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Paragraph rows: item title. FAQ: question.',
      hidden: ({ document, path }) =>
        getAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])?.variant === 'links',
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Body',
      description: 'Paragraph rows: body text. FAQ: answer.',
      rows: 3,
      hidden: ({ document, path }) =>
        getAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])?.variant === 'links',
    }),
    defineField({
      name: 'linkText',
      type: 'string',
      title: 'Link text',
      description: 'Optional text link (paragraph rows only).',
      hidden: ({ document, path }) => {
        const block = getAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])
        return block?.variant !== 'textList' && block?.variant !== 'paragraphs'
      },
    }),
    defineField({
      name: 'linkUrl',
      type: 'string',
      title: 'Link URL',
      description: 'URL for the link (paragraph rows: optional. Links: required).',
      hidden: ({ document, path }) => {
        const block = getAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])
        return block?.variant === 'faq'
      },
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
      description: 'Clickable link label (links pattern only).',
      hidden: ({ document, path }) =>
        getAsymmetricSectionFromPath(document as { sections?: Array<{ variant?: string }> }, path as unknown[])?.variant !== 'links',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', body: 'body' },
    prepare: ({ title, subtitle, body }) => ({
      title: title || subtitle || (body ? String(body).slice(0, 40) + '…' : 'Item'),
    }),
  },
})

export const mediaTextAsymmetricParagraph = defineType({
  name: 'mediaTextAsymmetricParagraph',
  type: 'object',
  title: 'Paragraph',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      title: 'Paragraph text',
      rows: 5,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'bodyTypography',
      type: 'string',
      title: 'Body size',
      description: 'Regular is standard long-form body; Large uses a larger body style.',
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
  ],
  preview: {
    select: { text: 'text', bodyTypography: 'bodyTypography' },
    prepare: ({ text, bodyTypography }) => {
      const t = text ? String(text).replace(/\s+/g, ' ') : ''
      const title =
        t.length > 0 ? (t.length > 60 ? `${t.slice(0, 60)}…` : t) : 'Paragraph'
      return {
        title,
        subtitle: bodyTypography === 'large' ? 'Large body' : 'Regular body',
      }
    },
  },
})

export const mediaTextAsymmetricBlock = defineType({
  name: 'mediaTextAsymmetric',
  type: 'object',
  title: 'Media + Text Asymmetric',
  description:
    'Left: block title. Right: paragraph rows, FAQ, links, or long-form copy.',
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
          { value: 'textList', title: 'Paragraph rows – title + body + optional link' },
          { value: 'faq', title: 'FAQ – accordion (question + answer)' },
          { value: 'links', title: 'Links – clickable labels' },
          { value: 'longForm', title: 'Long form – body on the right' },
        ],
        layout: 'radio',
      },
      initialValue: 'textList',
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
      name: 'longFormParagraphs',
      type: 'array',
      title: 'Paragraphs (long form)',
      description: 'One block of copy per paragraph. Regular or Large body per paragraph.',
      of: [{ type: 'mediaTextAsymmetricParagraph' }],
      hidden: ({ parent }) => parent?.variant !== 'longForm',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { variant?: string }
          if (parent?.variant !== 'longForm') return true
          const paras = Array.isArray(value) ? value : []
          const hasText = paras.some((p) => {
            const row = p as { text?: string }
            return typeof row?.text === 'string' && row.text.trim().length > 0
          })
          if (!hasText) return 'Add at least one paragraph with text'
          return true
        }),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [{ type: 'mediaTextAsymmetricItem' }],
      hidden: ({ parent }) => parent?.variant === 'longForm',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { variant?: string }
          if (parent?.variant !== 'longForm' && (!value || value.length < 1)) return 'Add at least one item'
          return true
        }),
    }),
  ],
  preview: {
    select: {
      blockTitle: 'blockTitle',
      variant: 'variant',
      items: 'items',
      longFormParagraphs: 'longFormParagraphs',
    },
    prepare: ({ blockTitle, variant, items, longFormParagraphs }) => {
      const v = variant != null && variant !== '' ? variant : 'textList'
      let count: string
      if (v === 'longForm') {
        const n = Array.isArray(longFormParagraphs) ? longFormParagraphs.length : 0
        count = `${n} paragraph${n === 1 ? '' : 's'}`
      } else {
        const n = Array.isArray(items) ? items.length : 0
        count = `${n} item(s)`
      }
      return {
        title: blockTitle || 'Media + Text Asymmetric',
        subtitle: `${v} · ${count}`,
      }
    },
  },
})
