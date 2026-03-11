'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Headline,
  Text,
  Icon,
  Button,
  IcChevronDown,
  IcChevronUp,
  SurfaceProvider,
} from '@marcelinodzn/ds-react'
import { createTransition } from '@marcelinodzn/ds-tokens'
import { Collapsible } from '@base-ui/react/collapsible'
import { GridBlock, useGridCell } from '../../../components/GridBlock'
import { useGridBreakpoint } from '../../../lib/use-grid-breakpoint'
import { VideoWithControls } from '../../../components/VideoWithControls'
import { StreamImage } from '../../../components/StreamImage'
import { getSurfaceProviderProps, useBlockBackgroundColor } from '../../../lib/block-surface'
import { MEDIA_TEXT_SUBTITLE_BODY_STYLE, TYPOGRAPHY } from '../../../lib/semantic-headline'
import type { MediaText5050BlockProps, MediaText5050Item } from '../../../blocks/MediaText5050Block/MediaText5050Block.types'

const ASPECT_RATIOS: Record<string, string> = {
  '5:4': '5 / 4',
  '1:1': '1 / 1',
  '4:5': '4 / 5',
};

function AccordionItem({
  item,
  isLast,
  open,
  onOpenChange,
  prefersReducedMotion,
}: {
  item: MediaText5050Item
  isLast: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  prefersReducedMotion: boolean
}) {
  const motionLevel = prefersReducedMotion ? 'subtle' : 'moderate'
  const panelTransition = prefersReducedMotion ? undefined : createTransition('height', 'l', 'transition', motionLevel)
  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange}>
      <div
        style={{
          borderBottom: isLast ? undefined : '1px solid var(--ds-color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 'var(--ds-spacing-m)',
            padding: 'var(--ds-spacing-m) 0',
            minHeight: 'var(--ds-spacing-2xl)',
          }}
        >
          <Collapsible.Trigger
            render={(props) => (
              <button
                type="button"
                {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                  width: '100%',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                {item.subtitle && (
                  <Headline
                    size="S"
                    weight="high"
                    as="h3"
                    style={{
                      margin: 0,
                      width: '100%',
                      ...MEDIA_TEXT_SUBTITLE_BODY_STYLE.subtitle,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {item.subtitle}
                  </Headline>
                )}
              </button>
            )}
          />
          <Collapsible.Trigger
            render={(props, state) => {
              const { onClick, ...rest } = props as React.ButtonHTMLAttributes<HTMLButtonElement>
              return (
                <Button
                  single
                  appearance="auto"
                  contained={false}
                  attention="high"
                  size="M"
                  aria-label={state?.open ? 'Collapse' : 'Expand'}
                  {...rest}
                  onPress={(e: unknown) =>
                    onClick?.(e as React.MouseEvent<HTMLButtonElement>)
                  }
                  content={
                    <Icon
                      asset={state?.open ? <IcChevronUp /> : <IcChevronDown />}
                      size="S"
                      appearance="secondary"
                    />
                  }
                />
              )
            }}
          />
        </div>
        <Collapsible.Panel
          keepMounted={!prefersReducedMotion}
          style={{
            paddingBottom: 'var(--ds-spacing-m)',
            overflow: 'hidden',
            transition: panelTransition,
          }}
        >
          {item.body && (
            <Text
              size="S"
              weight="low"
              color="medium"
              as="p"
              style={{ margin: 0, whiteSpace: 'pre-line', ...MEDIA_TEXT_SUBTITLE_BODY_STYLE.body }}
            >
              {item.body}
            </Text>
          )}
        </Collapsible.Panel>
      </div>
    </Collapsible.Root>
  )
}

export function MediaText5050Block({
  variant,
  imagePosition = 'right',
  emphasis,
  minimalBackgroundStyle,
  surfaceColour,
  spacingTop: _spacingTop,
  spacingBottom: _spacingBottom,
  headline,
  items = [],
  media,
  imageSlot,
  imageState,
}: MediaText5050BlockProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [accordionOpenIndex, setAccordionOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const hasMedia = media?.src && media.src.trim() !== ''
  const mediaFirst = imagePosition === 'left'
  const surfaceProps = getSurfaceProviderProps(emphasis)
  const cell = useGridCell('Default')
  const { columns } = useGridBreakpoint()
  const isStacked = columns < 8

  const aspectRatio = media?.aspectRatio ? ASPECT_RATIOS[media.aspectRatio] : undefined
  const isVideo = media?.type === 'video'
  const useStreamImage = imageState && imageSlot && media?.type === 'image'

  const mediaContent =
    hasMedia &&
    media &&
    (() => {
      if (isVideo) {
        return (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio,
              overflow: 'hidden',
              borderRadius: 'var(--ds-radius-card-m)',
            }}
          >
            <VideoWithControls
              src={media.src}
              poster={media.poster}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )
      }

      if (useStreamImage) {
        return (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio,
              overflow: 'hidden',
              borderRadius: 'var(--ds-radius-card-m)',
            }}
          >
            <StreamImage
              slot={imageSlot!}
              imageState={imageState!}
              aspectRatio={aspectRatio ? aspectRatio.replace(/\s/g, '') : undefined}
            />
          </div>
        )
      }

      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio,
            overflow: 'hidden',
            borderRadius: 'var(--ds-radius-card-m)',
          }}
        >
          <Image
            src={media.src}
            alt={media.alt ?? ''}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )
    })()

  /** 50/50 grid: 10 cols, 5 each side. Stack on mobile. */
  const SIDE_BY_SIDE_COLS = 10
  const HALF_COLS = 5
  const COL_GAP = 'var(--ds-spacing-2xl)'

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isStacked ? '1fr' : `repeat(${SIDE_BY_SIDE_COLS}, 1fr)`,
    gap: isStacked ? 'var(--ds-spacing-3xl)' : COL_GAP,
    alignItems: 'stretch',
  }

  const textColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: MEDIA_TEXT_SUBTITLE_BODY_STYLE.gap,
    alignItems: 'flex-start',
    minWidth: 0,
    ...(!isStacked &&
      (mediaFirst
        ? { paddingLeft: 'var(--ds-spacing-2xl)' }
        : { paddingRight: 'var(--ds-spacing-2xl)' })),
  }

  const bgColor = useBlockBackgroundColor(emphasis, surfaceColour)
  const useGradient = emphasis === 'minimal' && minimalBackgroundStyle === 'gradient'
  const background = bgColor
    ? useGradient
      ? `linear-gradient(to bottom, white 0%, ${bgColor} 100%)`
      : bgColor
    : undefined

  const blockBgWrapper = (children: React.ReactNode) =>
    background ? (
      <div
        style={{
          width: '100vw',
          maxWidth: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
          background,
          boxSizing: 'border-box',
          paddingBlockStart: 'var(--ds-spacing-4xl)',
          paddingBlockEnd: 'var(--ds-spacing-4xl)',
          minHeight: 1,
        }}
      >
        {children}
      </div>
    ) : (
      children
    )

  /** Variant 1: Paragraphs – 1 item = feature size (larger), 2+ items = editorial size (smaller, stacked). Spacing matches accordion: headline→first item = gap; between items = border + padding. */
  const isFeatureSize = items.length === 1
  const paragraphItemGap = MEDIA_TEXT_SUBTITLE_BODY_STYLE.gap
  const headlineToBodyGap = 'var(--ds-spacing-l)'
  const paragraphsContent = (
    <div style={textColumnStyle}>
      {headline && (
        <Headline
          size="M"
          weight="high"
          as="h2"
          style={{
            margin: 0,
            marginBottom: items.length > 0 ? headlineToBodyGap : undefined,
            fontSize: TYPOGRAPHY.h3,
            whiteSpace: 'pre-line',
          }}
        >
          {headline}
        </Headline>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: paragraphItemGap,
            paddingTop: i > 0 ? 'var(--ds-spacing-m)' : undefined,
            paddingBottom: i < items.length - 1 ? 'var(--ds-spacing-m)' : undefined,
            borderBottom:
              i < items.length - 1 ? '1px solid var(--ds-color-border-subtle)' : undefined,
          }}
        >
          {item.subtitle && (
            <Headline
              size={isFeatureSize ? 'L' : 'S'}
              weight="high"
              as={isFeatureSize ? 'h2' : 'h3'}
              style={{
                margin: 0,
                ...MEDIA_TEXT_SUBTITLE_BODY_STYLE.subtitle,
                whiteSpace: 'pre-line',
              }}
            >
              {item.subtitle}
            </Headline>
          )}
          {item.body && (
            <Text
              size={isFeatureSize ? 'L' : 'S'}
              weight="low"
              color="medium"
              as="p"
              style={{ margin: 0, whiteSpace: 'pre-line', ...MEDIA_TEXT_SUBTITLE_BODY_STYLE.body }}
            >
              {item.body}
            </Text>
          )}
        </div>
      ))}
    </div>
  )

  /** Variant 2: Accordion – items as collapsible (subtitle = header, body = content). Same text container structure as paragraphs. */
  const accordionContent = (
    <div style={{ ...textColumnStyle, gap: 0 }}>
      {headline && (
        <Headline
          size="M"
          weight="high"
          as="h2"
          style={{
            margin: 0,
            marginBottom: items.length > 0 ? headlineToBodyGap : undefined,
            fontSize: TYPOGRAPHY.h3,
            whiteSpace: 'pre-line',
          }}
        >
          {headline}
        </Headline>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'stretch',
          minWidth: 0,
          width: '100%',
        }}
      >
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            isLast={i === items.length - 1}
            open={accordionOpenIndex === i}
            onOpenChange={(open) => setAccordionOpenIndex(open ? i : null)}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  )

  const textContentByVariant = {
    paragraphs: paragraphsContent,
    accordion: accordionContent,
  }

  const textContent = textContentByVariant[variant]

  const textColumnWrapperStyle: React.CSSProperties = {
    ...textColumnStyle,
    ...(!isStacked && {
      gridColumn: mediaFirst ? `${HALF_COLS + 1} / span ${HALF_COLS}` : `1 / span ${HALF_COLS}`,
      alignSelf: 'stretch',
      justifyContent: 'center',
    }),
  }

  const mediaColumn = (
    <div
      style={{
        position: 'relative',
        minWidth: 0,
        ...(!isStacked && { gridColumn: `span ${HALF_COLS}` }),
      }}
    >
      {mediaContent}
    </div>
  )

  const gridContent = (
    <GridBlock as="section">
      <div style={{ ...cell, position: 'relative' }}>
        <div style={gridStyle}>
          {mediaFirst ? (
            <>
              {mediaColumn}
              <div style={textColumnWrapperStyle}>{textContent}</div>
            </>
          ) : (
            <>
              <div style={textColumnWrapperStyle}>{textContent}</div>
              {mediaColumn}
            </>
          )}
        </div>
      </div>
    </GridBlock>
  )

  /** Stacked: when no media, show text only (e.g. accordion-only preview) */
  const stackedContent = !hasMedia ? (
    <GridBlock as="section">
      <div style={{ ...cell, ...textColumnStyle }}>
        {textContent}
      </div>
    </GridBlock>
  ) : (
    gridContent
  )

  return blockBgWrapper(
    <SurfaceProvider {...surfaceProps}>{stackedContent}</SurfaceProvider>
  )
}
