'use client'

import { useRouter } from 'next/navigation'
import { Headline, Text, Icon, IcChevronDown, IcChevronUp } from '@marcelinodzn/ds-react'
import { Collapsible } from '@base-ui/react/collapsible'
import { Grid, useCell } from '../../components/blocks/Grid'
import { useGridBreakpoint } from '../../../lib/utils/use-grid-breakpoint'
import {
  getHeadlineSize,
  getChildLevel,
  normalizeHeadingLevel,
  type HeadingLevel,
} from '../../../lib/utils/semantic-headline'
import {
  LAB_TYPOGRAPHY_VARS,
  labHeadlineBlockTitleAlt,
  labTextBody,
  labTextBodyLead,
  labTextSubtitle,
} from '../../../lib/typography/block-typography'
import type {
  MediaTextAsymmetricBlockProps,
  MediaTextAsymmetricTextItem,
  MediaTextAsymmetricFaqItem,
  MediaTextAsymmetricLinkItem,
  MediaTextAsymmetricLongFormParagraph,
} from './MediaTextAsymmetricBlock.types'

function handleLinkPress(href: string, router: ReturnType<typeof useRouter>) {
  if (href.startsWith('/')) router.push(href)
  else window.location.href = href
}

/** Paragraph variant row (CMS `textList`). */
function ParagraphRow({
  item,
  itemLevel,
  router,
  openInNewTab,
}: {
  item: MediaTextAsymmetricTextItem
  itemLevel: HeadingLevel
  router: ReturnType<typeof useRouter>
  openInNewTab?: boolean
}) {
  const hasLink = item.linkText && item.linkUrl
  const linkProps = hasLink
    ? openInNewTab
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : { onClick: (e: React.MouseEvent) => { e.preventDefault(); handleLinkPress(item.linkUrl!, router) } }
    : {}
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-spacing-xs)',
      }}
    >
      {item.title && (
        <Text
          as={itemLevel}
          {...labTextSubtitle}
          style={{ margin: 0, whiteSpace: 'pre-line' }}
        >
          {item.title}
        </Text>
      )}
      {item.body && (
        <Text
          as="p"
          {...labTextBody}
          style={{
            margin: 0,
            whiteSpace: 'pre-line',
          }}
        >
          {item.body}
        </Text>
      )}
      {hasLink && (
        <a
          href={item.linkUrl!}
          {...linkProps}
          style={{
            fontSize: LAB_TYPOGRAPHY_VARS.labelM,
            fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
            color: 'var(--ds-color-text-interactive)',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginTop: 'var(--ds-spacing-xs)',
          }}
        >
          {item.linkText}
        </a>
      )}
    </div>
  )
}

function FaqItem({
  item,
  itemLevel,
}: {
  item: MediaTextAsymmetricFaqItem
  itemLevel: HeadingLevel
}) {
  return (
    <Collapsible.Root defaultOpen={false}>
      <div
        style={{
          borderBottom: '1px solid var(--ds-color-border-subtle)',
        }}
      >
        <Collapsible.Trigger
          render={(props, state) => (
            <button
              {...props}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 'var(--ds-spacing-m)',
                padding: 'var(--ds-spacing-m) 0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              {item.title && (
                <Text
                  as={itemLevel}
                  {...labTextSubtitle}
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-line',
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
              )}
              <span style={{ display: 'flex', flexShrink: 0 }}>
                <Icon
                  asset={state?.open ? <IcChevronUp /> : <IcChevronDown />}
                  size="S"
                  appearance="secondary"
                />
              </span>
            </button>
          )}
        />
        <Collapsible.Panel
          style={{
            paddingBottom: 'var(--ds-spacing-m)',
          }}
        >
          {item.body && (
            <Text
              as="p"
              {...labTextBody}
              style={{
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {item.body}
            </Text>
          )}
        </Collapsible.Panel>
      </div>
    </Collapsible.Root>
  )
}

function LinksItem({
  item,
  router,
  openInNewTab,
}: {
  item: MediaTextAsymmetricLinkItem
  router: ReturnType<typeof useRouter>
  openInNewTab?: boolean
}) {
  const hasLink = item.subtitle && item.linkUrl
  if (!hasLink) return null
  const linkProps = openInNewTab
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault()
          handleLinkPress(item.linkUrl!, router)
        },
      }
  return (
    <a
      href={item.linkUrl!}
      {...linkProps}
      style={{
        display: 'block',
        fontSize: LAB_TYPOGRAPHY_VARS.labelM,
        fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
        color: 'var(--ds-color-text-interactive)',
        textDecoration: 'underline',
        cursor: 'pointer',
        paddingBlock: 'var(--ds-spacing-xs)',
        whiteSpace: 'pre-line',
      }}
    >
      {item.subtitle}
    </a>
  )
}

function longFormParagraphsWithText(paragraphs: MediaTextAsymmetricLongFormParagraph[] | null | undefined) {
  if (paragraphs == null || !Array.isArray(paragraphs)) return []
  return paragraphs.filter(
    (p): p is MediaTextAsymmetricLongFormParagraph & { text: string } =>
      p != null && typeof p.text === 'string' && p.text.trim().length > 0,
  )
}

export function MediaTextAsymmetricBlock({
  blockTitle,
  variant: contentVariant = 'textList',
  longFormParagraphs,
  items,
  size: _size = 'feature',
  openLinksInNewTab,
}: MediaTextAsymmetricBlockProps) {
  const router = useRouter()
  const blockTitleLevel = normalizeHeadingLevel('h3')
  const itemLevel = getChildLevel(blockTitleLevel)
  const headlineSize = getHeadlineSize(blockTitleLevel)
  const cell = useCell('L')
  const items_ = (items ?? []).filter((i) => i != null) as (
    | MediaTextAsymmetricTextItem
    | MediaTextAsymmetricFaqItem
    | MediaTextAsymmetricLinkItem
  )[]
  const isLongForm = contentVariant === 'longForm'
  const longFormParas_ = longFormParagraphsWithText(longFormParagraphs)

  if (!isLongForm && items_.length === 0 && !blockTitle) return null
  if (isLongForm && longFormParas_.length === 0 && !blockTitle) return null

  const titleContent = blockTitle ? (
    <Headline
      size={headlineSize}
      as={blockTitleLevel}
      {...labHeadlineBlockTitleAlt}
      style={{ margin: 0, fontSize: LAB_TYPOGRAPHY_VARS.h3, whiteSpace: 'pre-line' }}
    >
      {blockTitle}
    </Headline>
  ) : null

  const mainColumnContent = isLongForm ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-spacing-l)',
      }}
    >
      {longFormParas_.map((para, i) => {
        const textProps =
          para.bodyTypography === 'large'
            ? labTextBodyLead
            : { ...labTextBody, size: 'M' as const, color: 'medium' as const }
        const key = para._key != null && para._key !== '' ? para._key : `lfp-${i}`
        return (
          <Text
            key={key}
            as="p"
            {...textProps}
            style={{
              margin: 0,
              whiteSpace: 'pre-line',
            }}
          >
            {para.text}
          </Text>
        )
      })}
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: contentVariant === 'textList' ? 'var(--ds-spacing-l)' : 0,
      }}
    >
      {contentVariant === 'textList' &&
        items_.map((item, i) => (
          <ParagraphRow
            key={i}
            item={item as MediaTextAsymmetricTextItem}
            itemLevel={itemLevel}
            router={router}
            openInNewTab={openLinksInNewTab}
          />
        ))}
      {contentVariant === 'faq' &&
        items_.map((item, i) => (
          <FaqItem key={i} item={item as MediaTextAsymmetricFaqItem} itemLevel={itemLevel} />
        ))}
      {contentVariant === 'links' &&
        items_.map((item, i) => (
          <LinksItem key={i} item={item as MediaTextAsymmetricLinkItem} router={router} openInNewTab={openLinksInNewTab} />
        ))}
    </div>
  )

  const { isStacked, columnWidth, gutter } = useGridBreakpoint()

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isStacked ? '1fr' : '1fr 2fr',
    columnGap: 0,
    rowGap: isStacked ? 'var(--ds-spacing-2xl)' : 0,
    alignItems: 'start',
  }

  const titleColumnStyle: React.CSSProperties = {
    minWidth: 0,
    ...(isStacked ? {} : { paddingInlineEnd: 'var(--ds-spacing-xl)' }),
  }

  const mainMaxWidth =
    !isStacked && columnWidth > 0 ? `calc(100% - ${columnWidth + gutter}px)` : undefined

  const mainColumnStyle: React.CSSProperties = {
    minWidth: 0,
    paddingInline: 0,
    marginInline: 0,
    maxWidth: mainMaxWidth,
    justifySelf: 'start',
    width: '100%',
  }

  return (
    <Grid as="section">
      <div style={{ ...cell, minWidth: 0 }}>
        <div style={gridStyle}>
          <div style={titleColumnStyle}>{titleContent}</div>
          <div style={mainColumnStyle}>{mainColumnContent}</div>
        </div>
      </div>
    </Grid>
  )
}
