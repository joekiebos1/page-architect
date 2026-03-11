import { defineField } from 'sanity'

/** Surface colour options: Primary, Secondary, Sparkle, Neutral (block-level colour theme). */
export const BLOCK_ACCENT_OPTIONS = [
  { value: 'primary', title: 'Primary' },
  { value: 'secondary', title: 'Secondary' },
  { value: 'sparkle', title: 'Sparkle' },
  { value: 'neutral', title: 'Neutral' },
] as const

/** Emphasis options: ghost, minimal, subtle, bold (block background strength). */
export const EMPHASIS_OPTIONS = [
  { value: 'ghost', title: 'Ghost (no background)' },
  { value: 'minimal', title: 'Minimal' },
  { value: 'subtle', title: 'Subtle' },
  { value: 'bold', title: 'Bold' },
] as const

/**
 * Surface colour field. Choose Primary, Secondary, Sparkle, or Neutral (block-level colour theme).
 * Field name: surfaceColour. Queries fetch surfaceColour only.
 */
export function surfaceColourField(options?: { hidden?: (ctx: { parent?: unknown }) => boolean }) {
  return defineField({
    name: 'surfaceColour',
    type: 'string',
    title: 'Surface colour',
    description: 'Primary = brand, Secondary = brand secondary, Sparkle = accent, Neutral = grey.',
    options: {
      list: [...BLOCK_ACCENT_OPTIONS],
      layout: 'radio',
    },
    initialValue: 'primary',
    hidden: options?.hidden,
  })
}

/**
 * Emphasis field. Choose ghost, minimal, subtle, or bold (block background strength).
 * Field name: emphasis.
 */
export function emphasisField(options?: {
  initialValue?: 'ghost' | 'minimal' | 'subtle' | 'bold'
  hidden?: (ctx: { parent?: unknown }) => boolean
}) {
  return defineField({
    name: 'emphasis',
    type: 'string',
    title: 'Emphasis',
    description: 'Ghost = no background. Minimal = light tint, Subtle = medium tint, Bold = strong tint. Colour comes from Surface colour.',
    options: {
      list: [...EMPHASIS_OPTIONS],
      layout: 'radio',
    },
    initialValue: options?.initialValue ?? 'ghost',
    hidden: options?.hidden,
  })
}
