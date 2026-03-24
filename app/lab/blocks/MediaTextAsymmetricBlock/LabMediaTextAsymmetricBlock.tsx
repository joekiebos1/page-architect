'use client'

import { useRouter } from 'next/navigation'
import { Headline, Text, Icon, IcChevronDown, IcChevronUp } from '@marcelinodzn/ds-react'
import { Collapsible } from '@base-ui/react/collapsible'
import { Grid, useCell } from '../../../components/blocks/Grid'
import { useGridBreakpoint } from '../../../../lib/utils/use-grid-breakpoint'
import {
  getHeadlineSize,
  getChildLevel,
  normalizeHeadingLevel,
  type HeadingLevel,
} from '../../../../lib/utils/semantic-headline'
import {
  LAB_TYPOGRAPHY_VARS,
  labHeadlineBlockTitleAlt,
  labTextBody,
  labTextBodyLead,
  labTextSubtitle,
} from '../../../../lib/typography/block-typography'
import type {
  LabMediaTextAsymmetricBlockProps,
  LabMediaTextAsymmetricParagraphRow,
} from './LabMediaTextAsymmetricBlock.types'
import type {
  MediaTextAsymmetricFaqItem,
  MediaTextAsymmetricLinkItem,
} from '../../../blocks/MediaTextAsymmetricBlock/MediaTextAsymmetricBlock.types'

function handleLinkPress(href: string, router: ReturnType<typeof useRouter>) {
  if (href.startsWith('/')) router.push(href)
  else window.location.href = href
}

function ParagraphRow({
  row,
  itemLevel,
  router,
  openInNewTab,
}: {
  row: LabMediaTextAsymmetricParagraphRow & { body: string }
  itemLevel: HeadingLevel
  router: ReturnType<typeof useRouter>
  openInNewTab?: boolean
}) {
  const textProps =
    row.bodyTypography === 'large'
      ? labTextBodyLead
      : { ...labTextBody, size: 'M' as const, color: 'medium' as const }
  const hasLink = row.linkText && row.linkUrl
  const linkProps = hasLink
    ? openInNewTab
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : { onClick: (e: React.MouseEvent) => { e.preventDefault(); handleLinkPress(row.linkUrl!, router) } }
    : {}
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-spacing-xs)',
      }}
    >
      {row.title && String(row.title).trim().length > 0 && (
        <Text
          as={itemLevel}
          {...labTextSubtitle}
          style={{ margin: 0, whiteSpace: 'pre-line' }}
        >
          {row.title}
        </Text>
      )}
      <Text
        as="p"
        {...textProps}
        style={{
          margin: 0,
          whiteSpace: 'pre-line',
        }}
      >
        {row.body}
      </Text>
      {hasLink && (
        <a
          href={row.linkUrl!}
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
          {row.linkText}
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

function paragraphRowsWithBody(rows: LabMediaTextAsymmetricParagraphRow[] | null | undefined) {
  if (rows == null || !Array.isArray(rows)) return []
  return rows.filter(
    (r): r is LabMediaTextAsymmetricParagraphRow & { body: string } =>
      r != null && typeof r.body === 'string' && r.body.trim().length > 0,
  )
}

export function LabMediaTextAsymmetricBlock({
  blockTitle,
  variant: contentVariant = 'paragraphs',
  paragraphRows,
  items,
  size: _size = 'feature',
  openLinksInNewTab,
}: LabMediaTextAsymmetricBlockProps) {
  const router = useRouter()
  const blockTitleLevel = normalizeHeadingLevel('h3')
  const itemLevel = getChildLevel(blockTitleLevel)
  const headlineSize = getHeadlineSize(blockTitleLevel)
  const cell = useCell('L')
  const { isStacked } = useGridBreakpoint()
  const items_ = (items ?? []).filter((i) => i != null) as (MediaTextAsymmetricFaqItem | MediaTextAsymmetricLinkItem)[]
  const isParagraphs = contentVariant === 'paragraphs'
  const rows_ = paragraphRowsWithBody(paragraphRows)

  if (isParagraphs && rows_.length === 0 && !blockTitle) return null
  if (!isParagraphs && items_.length === 0 && !blockTitle) return null

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

  const mainColumnContent = isParagraphs ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-spacing-l)',
      }}
    >
      {rows_.map((row, i) => {
        const key = row._key != null && row._key !== '' ? row._key : `pr-${i}`
        return (
          <ParagraphRow
            key={key}
            row={row}
            itemLevel={itemLevel}
            router={router}
            openInNewTab={openLinksInNewTab}
          />
        )
      })}
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: contentVariant === 'faq' ? 0 : 0,
      }}
    >
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isStacked ? '1fr' : 'minmax(0, 1fr) minmax(0, 2fr)',
    columnGap: 0,
    rowGap: isStacked ? 'var(--ds-spacing-2xl)' : 0,
    alignItems: 'start',
  }

  /** Title track: 1fr — text + padding after it. */
  const titleColumnStyle: React.CSSProperties = {
    minWidth: 0,
    ...(isStacked ? {} : { paddingInlineEnd: 'var(--ds-spacing-xl)' }),
  }

  /** Main track: 2fr — padding before content, then body. Full width of the cell (no production line-length cap). */
  const mainColumnStyle: React.CSSProperties = {
    minWidth: 0,
    ...(isStacked
      ? { paddingInline: 0, marginInline: 0 }
      : { paddingInlineStart: 'var(--ds-spacing-xl)', paddingInlineEnd: 0, marginInline: 0 }),
    justifySelf: 'stretch',
    width: '100%',
    maxWidth: 'none',
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
