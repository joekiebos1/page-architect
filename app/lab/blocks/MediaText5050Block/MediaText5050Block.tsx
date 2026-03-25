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
import { Grid, useCell } from '../../../components/blocks/Grid'
import { WidthCap } from '../../../blocks/WidthCap'
import { useGridBreakpoint } from '../../../../lib/utils/use-grid-breakpoint'
import { VideoWithControls } from '../../../components/blocks/VideoWithControls'
import { StreamImage } from '../../../components/blocks/StreamImage'
import { getSurfaceProviderProps, useBlockBackgroundColor } from '../../../../lib/utils/block-surface'
import { EDGE_TO_EDGE_BREAKOUT } from '../../../../lib/utils/edge-to-edge'
import type { MediaText5050BlockProps, MediaText5050Item } from '../../../blocks/MediaText5050Block/MediaText5050Block.types'
import {
  LAB_TYPOGRAPHY_VARS,
  labHeadlineBlockTitleAlt,
  labTextBody,
  labTextBodyLead,
} from '../../../../lib/typography/block-typography'
import { LabBlockFramingCallToActions } from '../../components/LabBlockFramingCallToActions'
import {
  labBlockFramingDescriptionStyle,
  labBlockFramingDescriptionTextProps,
  labBlockFramingHeadlineProps,
  labBlockFramingIntroStackStyle,
  labBlockFramingTitleStyle,
  labBlockFramingToContentGap,
} from '../../../../lib/lab/lab-block-framing-typography'
import { hasLabBlockFraming } from '../../../../lib/lab/has-lab-block-framing'

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
                    as="h3"
                    {...labHeadlineBlockTitleAlt}
                    style={{
                      margin: 0,
                      width: '100%',
                      fontSize: LAB_TYPOGRAPHY_VARS.h5,
                      lineHeight: 1.4,
                      whiteSpace: 'pre-line',
                      fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
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
            <Text as="p" {...labTextBody} style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {item.body}
            </Text>
          )}
        </Collapsible.Panel>
      </div>
    </Collapsible.Root>
  )
}

export function LabMediaText5050Block({
  variant,
  paragraphColumnLayout,
  imagePosition = 'right',
  emphasis,
  minimalBackgroundStyle,
  surfaceColour,
  spacingTop: _spacingTop,
  spacingBottom: _spacingBottom,
  headline,
  description,
  callToActions,
  blockFramingAlignment = 'left',
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
  const { isStacked, isMobile } = useGridBreakpoint()

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

  /** Side-by-side: gutter between columns matches page grid; text inset toward gutter (aligned with production). */
  const INNER_COLUMN_GAP = 'var(--ds-grid-gutter)'
  const TEXT_COLUMN_INSET = 'var(--ds-spacing-3xl)'
  const textColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-spacing-m)',
    alignItems: 'flex-start',
    minWidth: 0,
    ...(!isStacked &&
      (mediaFirst
        ? { paddingLeft: TEXT_COLUMN_INSET }
        : { paddingRight: TEXT_COLUMN_INSET })),
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
          ...EDGE_TO_EDGE_BREAKOUT,
          background,
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

  /** Paragraphs: single layout = larger type (size only, same weight as multi). */
  const useSingleParagraphColumn =
    variant === 'paragraphs' &&
    (paragraphColumnLayout === 'single' ||
      (paragraphColumnLayout == null && items.length === 1))
  const paragraphItemGap = 'var(--ds-spacing-m)'
  const showBlockFraming = hasLabBlockFraming(headline, description, callToActions)
  const framingTextAlign = blockFramingAlignment === 'center' ? 'center' : 'left'
  const framingStackStyle: React.CSSProperties = {
    ...labBlockFramingIntroStackStyle,
    alignItems: framingTextAlign === 'center' ? 'center' : 'flex-start',
    textAlign: framingTextAlign,
  }
  const framingTitleStyleMerged: React.CSSProperties = {
    ...labBlockFramingTitleStyle(isMobile),
    textAlign: framingTextAlign,
  }
  const framingDescriptionStyleMerged: React.CSSProperties = {
    ...labBlockFramingDescriptionStyle,
    textAlign: framingTextAlign,
  }
  const blockFramingIntro = showBlockFraming ? (
    <div style={framingStackStyle}>
      {headline && (
        <Headline size="M" as="h2" {...labBlockFramingHeadlineProps} style={framingTitleStyleMerged}>
          {headline}
        </Headline>
      )}
      {description && (
        <Text
          as="p"
          {...labBlockFramingDescriptionTextProps}
          style={framingDescriptionStyleMerged}
        >
          {description}
        </Text>
      )}
      <LabBlockFramingCallToActions
        actions={callToActions}
        align={blockFramingAlignment === 'center' ? 'center' : 'left'}
      />
    </div>
  ) : null

  const paragraphsContent = (
    <div style={textColumnStyle}>
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
              size="M"
              as={useSingleParagraphColumn ? 'h2' : 'h3'}
              {...labHeadlineBlockTitleAlt}
              style={{
                margin: 0,
                fontSize: useSingleParagraphColumn ? LAB_TYPOGRAPHY_VARS.h4 : LAB_TYPOGRAPHY_VARS.h5,
                lineHeight: 1.4,
                whiteSpace: 'pre-line',
                fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
              }}
            >
              {item.subtitle}
            </Headline>
          )}
          {item.body && (
            <Text
              as="p"
              {...(useSingleParagraphColumn ? labTextBodyLead : labTextBody)}
              style={{ margin: 0, whiteSpace: 'pre-line' }}
            >
              {item.body}
            </Text>
          )}
        </div>
      ))}
    </div>
  )

  /** Variant 2: Accordion – items as collapsible (subtitle = header, body = content). */
  const accordionContent = (
    <div style={{ ...textColumnStyle, gap: 0 }}>
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

  const textOnlyCell = useCell('L')

  /** Inner 50/50 grid – single cell in page grid, inner grid for layout control. Vertically centered. */
  const innerGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: INNER_COLUMN_GAP,
    alignItems: 'center',
    minWidth: 0,
  }

  /** Stacked: WidthCap only. Side-by-side: Grid + cell + inner 50/50 grid. */
  const stackedContent = !hasMedia ? (
    <Grid as="section">
      <div style={{ ...textOnlyCell, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {blockFramingIntro != null ? (
          <div style={{ marginBottom: labBlockFramingToContentGap, width: '100%' }}>{blockFramingIntro}</div>
        ) : null}
        {textContent}
      </div>
    </Grid>
  ) : isStacked ? (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-3xl)' }}>
      {blockFramingIntro != null ? (
        <WidthCap contentWidth="L">
          <div style={{ width: '100%' }}>{blockFramingIntro}</div>
        </WidthCap>
      ) : null}
      {mediaFirst ? (
        <>
          <WidthCap contentWidth="XL">
            <div style={{ position: 'relative', minWidth: 0 }}>{mediaContent}</div>
          </WidthCap>
          <WidthCap contentWidth="L">
            <div style={textColumnStyle}>{textContent}</div>
          </WidthCap>
        </>
      ) : (
        <>
          <WidthCap contentWidth="L">
            <div style={textColumnStyle}>{textContent}</div>
          </WidthCap>
          <WidthCap contentWidth="XL">
            <div style={{ position: 'relative', minWidth: 0 }}>{mediaContent}</div>
          </WidthCap>
        </>
      )}
    </section>
  ) : (
    <Grid as="section">
      <div style={{ ...textOnlyCell, minWidth: 0 }}>
        {blockFramingIntro != null ? (
          <div style={{ marginBottom: labBlockFramingToContentGap, width: '100%' }}>{blockFramingIntro}</div>
        ) : null}
        <div style={innerGridStyle}>
          {mediaFirst ? (
            <>
              <div style={{ position: 'relative', minWidth: 0 }}>{mediaContent}</div>
              <div style={{ ...textColumnStyle, minWidth: 0 }}>{textContent}</div>
            </>
          ) : (
            <>
              <div style={{ ...textColumnStyle, minWidth: 0 }}>{textContent}</div>
              <div style={{ position: 'relative', minWidth: 0 }}>{mediaContent}</div>
            </>
          )}
        </div>
      </div>
    </Grid>
  )

  return blockBgWrapper(
    <SurfaceProvider {...surfaceProps}>{stackedContent}</SurfaceProvider>
  )
}
