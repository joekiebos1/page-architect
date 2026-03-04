import { defineField, defineType } from 'sanity'
import { spacingTopField, spacingBottomField } from '../shared/spacingFields'

export const mediaTextBlock = defineType({
  name: 'mediaTextBlock',
  type: 'object',
  title: 'Media + Text',
  fields: [
    spacingTopField,
    spacingBottomField,
    defineField({
      name: 'template',
      type: 'string',
      title: 'Layout',
      description: '50/50: text and image side by side (choose image left or right). HeroOverlay: full bleed image with overlay. Stacked: large image with text above or below. TextOnly: no media.',
      options: {
        list: [
          { value: 'SideBySide', title: '50/50 – Image left or right' },
          { value: 'HeroOverlay', title: 'HeroOverlay – Full bleed image with text overlay' },
          { value: 'Stacked', title: 'Stacked – Large image with text (above or below)' },
          { value: 'TextOnly', title: 'TextOnly – No media, text only' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'SideBySide',
    }),
    defineField({
      name: 'eyebrow',
      type: 'string',
      title: 'Eyebrow',
      description: 'Small label above the headline (e.g. "MOBILE GAMES").',
    }),
    defineField({
      name: 'subhead',
      type: 'text',
      title: 'Subhead',
      description: 'Secondary headline below the main title. Press Enter for a line break.',
      rows: 2,
    }),
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
      name: 'imagePosition',
      type: 'string',
      title: 'Image position',
      description: 'For 50/50 layout: image on the left or right.',
      options: {
        list: [
          { value: 'left', title: 'Image left' },
          { value: 'right', title: 'Image right' },
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
      description: 'Left or center. Only shown when media is Default width (edge-to-edge is always center).',
      options: {
        list: [
          { value: 'left', title: 'Left' },
          { value: 'center', title: 'Center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      hidden: ({ parent }) =>
        parent?.template !== 'Stacked' || parent?.mediaSize === 'edgeToEdge',
    }),
    defineField({
      name: 'mediaSize',
      type: 'string',
      title: 'Media size',
      description: 'Edge to edge: full viewport, text always center. Default: contained width, choose left or center alignment.',
      options: {
        list: [
          { value: 'edgeToEdge', title: 'Edge to edge' },
          { value: 'default', title: 'Default width' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      hidden: ({ parent }) => parent?.template !== 'Stacked' && parent?.template !== 'HeroOverlay',
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
      name: 'blockBackground',
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
      name: 'imageAspectRatio',
      type: 'string',
      title: 'Image aspect ratio',
      description: 'For 50/50 layout only. 4:3, 3:4, or 1:1.',
      options: {
        list: [
          { value: '4:3', title: '4:3' },
          { value: '3:4', title: '3:4' },
          { value: '1:1', title: '1:1 (square)' },
        ],
        layout: 'radio',
      },
      initialValue: '4:3',
      hidden: ({ parent }) => parent?.template !== 'SideBySide',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      template: 'template',
      imagePosition: 'imagePosition',
    },
    prepare: ({ title, template, imagePosition }) => {
      const layoutLabels: Record<string, string> = {
        SideBySide: '50/50',
        HeroOverlay: 'HeroOverlay',
        Stacked: 'Stacked',
        TextOnly: 'TextOnly',
      }
      const layout = layoutLabels[template || 'SideBySide'] ?? template
      const posLabel = template === 'SideBySide' && imagePosition ? ` · Image ${imagePosition}` : ''
      return {
        title: title || 'Media + Text',
        subtitle: `Media and text · ${layout}${posLabel}`,
      }
    },
  },
})
