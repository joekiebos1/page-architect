'use client'

import { useGridBreakpoint } from '../lib/use-grid-breakpoint'

type BlockContainerElement = 'div' | 'section' | 'article' | 'main'

/**
 * Content width options. All values from getVariableByName (ds-tokens).
 * On large screens (12 cols): wide=12, default=10, narrow=8, editorial=6.
 * - editorial: 6 cols — body copy
 * - narrow: 8 cols
 * - default: 10 cols
 * - wide: 12 cols (full container)
 * - edgeToEdge: 100vw, no padding (uncapped)
 *
 * Above 1440px, all content widths cap at ContainerWidth/L (1440)/100-100-100 (1346px).
 */
export type ContentWidth = 'narrow' | 'editorial' | 'default' | 'wide' | 'edgeToEdge'

type BlockContainerProps = React.HTMLAttributes<HTMLElement> & {
  as?: BlockContainerElement
  contentWidth?: ContentWidth
}

/**
 * Shared container for blocks. All margin, gutter, column values from ds-tokens.
 * narrow/default/wide are centered with auto margins. edgeToEdge is 100vw with no padding.
 */
export function BlockContainer({
  children,
  style,
  as: Component = 'div',
  contentWidth = 'default',
  ...props
}: BlockContainerProps) {
  const {
    marginPx,
    contentMaxNarrow,
    contentMaxEditorial,
    contentMaxDefault,
    contentMaxWide,
  } = useGridBreakpoint()

  if (contentWidth === 'edgeToEdge') {
    return (
      <Component
        style={{
          width: '100vw',
          maxWidth: '100vw',
          marginLeft: `-${marginPx}`,
          marginRight: 0,
          paddingInline: 0,
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    )
  }

  const maxWidth =
    contentWidth === 'narrow'
      ? contentMaxNarrow
      : contentWidth === 'editorial'
        ? contentMaxEditorial
        : contentWidth === 'wide'
          ? contentMaxWide
          : contentMaxDefault

  return (
    <Component
      style={{
        width: '100%',
        maxWidth,
        marginInline: 'auto',
        paddingInline: marginPx,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  )
}
