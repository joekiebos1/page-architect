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
      name: 'template',
      type: 'string',
      title: 'Layout',
      description: 'SideBySide: text + image side by side. HeroOverlay: full bleed image with overlay. Stacked: large image with text above or below.',
      options: {
        list: [
          { value: 'SideBySide', title: 'SideBySide – Text + image side by side (50/50)' },
          { value: 'SideBySideNarrow', title: 'SideBySide – Narrow image (1/3 image)' },
          { value: 'SideBySideWide', title: 'SideBySide – Wide image (2/3 image)' },
          { value: 'HeroOverlay', title: 'HeroOverlay – Full bleed image with text overlay' },
          { value: 'Stacked', title: 'Stacked – Large image with text (above or below)' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'SideBySide',
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      title: 'Image Position',
      description: 'For side-by-side and narrow/wide layouts',
      options: {
        list: [
          { value: 'left', title: 'Left' },
          { value: 'right', title: 'Right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
      hidden: ({ parent }) => parent?.template === 'HeroOverlay' || parent?.template === 'Stacked',
    }),
    defineField({
      name: 'overlayAlignment',
      type: 'string',
      title: 'Text alignment',
      description: 'For full bleed hero only',
      options: {
        list: [
          { value: 'left', title: 'Left' },
          { value: 'center', title: 'Center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      hidden: ({ parent }) => parent?.template !== 'HeroOverlay',
    }),
    defineField({
      name: 'stackImagePosition',
      type: 'string',
      title: 'Image position',
      description: 'For Stacked layout: image on top or bottom',
      options: {
        list: [
          { value: 'top', title: 'Image on top' },
          { value: 'bottom', title: 'Image on bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'top',
      hidden: ({ parent }) => parent?.template !== 'Stacked',
    }),
    defineField({
      name: 'stackAlignment',
      type: 'string',
      title: 'Text alignment',
      description: 'Left or center aligned. Use one alignment per block.',
      options: {
        list: [
          { value: 'left', title: 'Left' },
          { value: 'center', title: 'Center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      hidden: ({ parent }) => parent?.template !== 'Stacked',
    }),
    defineField({
      name: 'imageAspectRatio',
      type: 'string',
      title: 'Image aspect ratio',
      description: '50/50 layouts: 4:3, 3:4, 1:1. Full-width: 16:7, 16:9, 21:9.',
      options: {
        list: [
          { value: '4:3', title: '4:3' },
          { value: '3:4', title: '3:4' },
          { value: '1:1', title: '1:1 (square)' },
          { value: '16:7', title: '16:7 (1440×630)' },
          { value: '16:9', title: '16:9 (widescreen)' },
          { value: '21:9', title: '21:9 (cinematic)' },
        ],
        layout: 'dropdown',
      },
      initialValue: '4:3',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      template: 'template',
    },
    prepare: ({ title, template }) => {
      const       layoutLabels: Record<string, string> = {
        SideBySide: 'SideBySide',
        SideBySideNarrow: 'SideBySide narrow',
        SideBySideWide: 'SideBySide wide',
        HeroOverlay: 'HeroOverlay',
        Stacked: 'Stacked',
      }
      const layout = layoutLabels[template || 'SideBySide'] ?? template
      return {
        title: title || 'Text + Image',
        subtitle: `Text and image · ${layout}`,
      }
    },
  },
})
