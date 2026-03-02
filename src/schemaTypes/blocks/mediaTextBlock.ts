import { defineField, defineType } from 'sanity'

export const mediaTextBlock = defineType({
  name: 'mediaTextBlock',
  type: 'object',
  title: 'Media + Text',
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
      name: 'eyebrow',
      type: 'string',
      title: 'Eyebrow',
      description: 'Small label above the headline (e.g. "MOBILE GAMES"). Shown in 50/50 layout.',
    }),
    defineField({
      name: 'subhead',
      type: 'string',
      title: 'Subhead',
      description: 'Secondary headline below the main title.',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
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
      name: 'body',
      type: 'text',
      title: 'Body',
      rows: 4,
    }),
    defineField({
      name: 'bulletList',
      type: 'array',
      title: 'Bullet list',
      description: 'Max 6 bullets. Shown in centered-media-below and feature layouts.',
      validation: (Rule) => Rule.max(6),
      of: [{ type: 'string' }],
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
      name: 'cta2Text',
      type: 'string',
      title: 'Secondary CTA Text',
      description: 'e.g. "See it in action"',
    }),
    defineField({
      name: 'cta2Link',
      type: 'string',
      title: 'Secondary CTA Link',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image (upload)',
      description: 'Upload or use Image URL below',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageUrl',
      type: 'string',
      title: 'Image URL',
      description: 'External image URL. Used when no image is uploaded. Also used as poster for video.',
    }),
    defineField({
      name: 'video',
      type: 'file',
      title: 'Video (upload)',
      description: 'Optional video. When set, video is shown instead of image. Autoplay with mute/play controls.',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'videoUrl',
      type: 'string',
      title: 'Video URL',
      description: 'External video URL. Used when no video is uploaded.',
    }),
    defineField({
      name: 'size',
      type: 'string',
      title: 'Size',
      description: 'Narrative weight: hero (largest), feature (standard), editorial (compact).',
      options: {
        list: [
          { value: 'hero', title: 'Hero' },
          { value: 'feature', title: 'Feature' },
          { value: 'editorial', title: 'Editorial' },
        ],
        layout: 'radio',
      },
      initialValue: 'feature',
    }),
    defineField({
      name: 'contentWidth',
      type: 'string',
      title: 'Media width',
      description: 'For Stacked/HeroOverlay: edgeToEdge = full viewport width. Default = contained.',
      options: {
        list: [
          { value: 'default', title: 'Default (contained)' },
          { value: 'edgeToEdge', title: 'Edge to edge (full width)' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      hidden: ({ parent }) => !['Stacked', 'HeroOverlay'].includes(parent?.template ?? ''),
    }),
    defineField({
      name: 'template',
      type: 'string',
      title: 'Layout',
      description: 'SideBySide: text + image side by side. HeroOverlay: full bleed image with overlay. Stacked: large image with text above or below. TextOnly: no media.',
      options: {
        list: [
          { value: 'SideBySide', title: 'SideBySide – Text + image side by side (50/50)' },
          { value: 'SideBySideNarrow', title: 'SideBySide – Narrow image (1/3 image)' },
          { value: 'SideBySideWide', title: 'SideBySide – Wide image (2/3 image)' },
          { value: 'HeroOverlay', title: 'HeroOverlay – Full bleed image with text overlay' },
          { value: 'Stacked', title: 'Stacked – Large image with text (above or below)' },
          { value: 'TextOnly', title: 'TextOnly – No media, text only' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'SideBySide',
    }),
    defineField({
      name: 'align',
      type: 'string',
      title: 'Text alignment',
      description: 'Left or center aligned. Applies to all text in this block.',
      options: {
        list: [
          { value: 'left', title: 'Left' },
          { value: 'center', title: 'Center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      hidden: ({ parent }) => parent?.template === 'HeroOverlay' || parent?.template === 'Stacked',
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
      hidden: ({ parent }) => ['HeroOverlay', 'Stacked', 'TextOnly'].includes(parent?.template ?? ''),
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
        title: title || 'Media + Text',
        subtitle: `Media and text · ${layout}`,
      }
    },
  },
})
