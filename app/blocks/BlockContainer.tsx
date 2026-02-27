'use client'

type BlockContainerElement = 'div' | 'section' | 'article' | 'main'

type BlockContainerProps = React.HTMLAttributes<HTMLElement> & {
  as?: BlockContainerElement
}

/**
 * Shared container for blocks. Uses DS tokens for consistent layout.
 */
export function BlockContainer({
  children,
  style,
  as: Component = 'div',
  ...props
}: BlockContainerProps) {
  return (
    <Component
      style={{
        width: '100%',
        maxWidth: 'min(100%, var(--ds-breakpoint-desktop))',
        marginInline: 'auto',
        paddingInline: 'var(--ds-spacing-l)',
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  )
}
