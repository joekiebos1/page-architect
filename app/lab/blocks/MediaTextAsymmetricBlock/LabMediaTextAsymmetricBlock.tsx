'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  labPlainBodyStyle,
  labTextBody,
  labTextSubtitle,
} from '../../../../lib/typography/block-typography'
import type {
  LabMediaTextAsymmetricBlockProps,
  LabMediaTextAsymmetricImageAspectRatio,
  LabMediaTextAsymmetricParagraphRow,
} from './LabMediaTextAsymmetricBlock.types'
import type {
  MediaTextAsymmetricFaqItem,
  MediaTextAsymmetricLinkItem,
} from '../../../../lib/blocks/media-text-asymmetric-shared.types'

const MAIN_IMAGE_ASPECT_CSS: Record<LabMediaTextAsymmetricImageAspectRatio, string> = {
  '5:4': '5 / 4',
  '1:1': '1 / 1',
  '4:5': '4 / 5',
}

function handleLinkPress(href: string, router: ReturnType<typeof useRouter>) {
  if (href.startsWith('/')) router.push(href)
  else window.location.href = href
}

function MainColumnImage({
  src,
  alt,
  aspectRatio,
}: {
  src: string
  alt: string
  aspectRatio: LabMediaTextAsymmetricImageAspectRatio
}) {
  const ar = MAIN_IMAGE_ASPECT_CSS[aspectRatio]
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: ar,
        overflow: 'hidden',
        borderRadius: 'var(--ds-radius-card-m)',
      }}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 40vw" />
    </div>
  )
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
          style={{
            margin: 0,
            whiteSpace: 'pre-line',
            fontSize: LAB_TYPOGRAPHY_VARS.h5,
            fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
          }}
        >
          {row.title}
        </Text>
      )}
      <Text
        as="p"
        {...labTextBody}
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
          style={labPlainBodyStyle({
            marginTop: 'var(--ds-spacing-xs)',
            textDecoration: 'underline',
            cursor: 'pointer',
          })}
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
                    fontWeight: LAB_TYPOGRAPHY_VARS.weightMedium,
                  }}
                >
                  {item.title}
                </Text>
              )}
              <span style={{ display: 'flex', flexShrink: 0 }}>
                <Icon
                  asset={state?.open ? <IcChevronUp /> : <IcChevronDown />}
                  size="L"
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
  paragraphLayout,
  singleColumnBody,
  paragraphRows,
  items,
  mainImageSrc,
  imageAspectRatio,
  imageAlt,
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
  const isImage = contentVariant === 'image'
  const resolvedParagraphLayout =
    paragraphLayout === 'single' ? 'single' : 'multi'
  const singleBodyTrimmed =
    typeof singleColumnBody === 'string' ? singleColumnBody.trim() : ''
  const rows_ = paragraphRowsWithBody(paragraphRows)
  const imageSrc = typeof mainImageSrc === 'string' && mainImageSrc.trim().length > 0 ? mainImageSrc.trim() : ''
  const resolvedAspect: LabMediaTextAsymmetricImageAspectRatio =
    imageAspectRatio === '5:4' || imageAspectRatio === '1:1' || imageAspectRatio === '4:5' ? imageAspectRatio : '4:5'
  const showTitleColumn = typeof blockTitle === 'string' && blockTitle.trim().length > 0

  if (
    isParagraphs &&
    resolvedParagraphLayout === 'single' &&
    singleBodyTrimmed.length === 0 &&
    !showTitleColumn
  ) {
    return null
  }
  if (isParagraphs && resolvedParagraphLayout === 'multi' && rows_.length === 0 && !showTitleColumn) return null
  if (isImage && !imageSrc && !showTitleColumn) return null
  if (!isParagraphs && !isImage && items_.length === 0 && !showTitleColumn) return null

  const titleContent = showTitleColumn ? (
    <Headline
      size={headlineSize}
      as={blockTitleLevel}
      {...labHeadlineBlockTitleAlt}
      style={{
        margin: 0,
        fontSize: LAB_TYPOGRAPHY_VARS.h3,
        whiteSpace: 'pre-line',
      }}
    >
      {blockTitle}
    </Headline>
  ) : null

  const mainColumnContent = isParagraphs ? (
    resolvedParagraphLayout === 'single' ? (
      <Text
        as="div"
        {...labTextBody}
        size="M"
        color="medium"
        style={{
          margin: 0,
          whiteSpace: 'pre-line',
        }}
      >
        {singleBodyTrimmed}
      </Text>
    ) : (
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
    )
  ) : isImage ? (
    imageSrc ? (
      <MainColumnImage
        src={imageSrc}
        alt={(imageAlt != null && String(imageAlt).trim()) || ''}
        aspectRatio={resolvedAspect}
      />
    ) : null
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

  /**
   * Lab: inner grid — 10 tracks + DS gutter when side-by-side. Title 1–4 (optional);
   * main always 5 / span 6 so layout matches with or without visible title.
   */
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isStacked ? '1fr' : 'repeat(10, minmax(0, 1fr))',
    columnGap: !isStacked ? 'var(--ds-grid-gutter)' : 0,
    rowGap: isStacked && showTitleColumn ? 'var(--ds-spacing-3xl)' : 0,
    alignItems: 'start',
    minWidth: 0,
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
  }

  const titleColumnStyle: React.CSSProperties = {
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    ...(!isStacked && showTitleColumn
      ? { gridColumn: '1 / span 4', paddingInlineEnd: 'var(--ds-spacing-4xl)' }
      : {}),
  }

  const mainColumnStyle: React.CSSProperties = {
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    paddingInline: 0,
    marginInline: 0,
    justifySelf: 'stretch',
    width: '100%',
    ...(!isStacked ? { gridColumn: '5 / span 6' } : {}),
  }

  const cellWrapperStyle: React.CSSProperties = {
    ...cell,
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
  }

  return (
    <Grid as="section">
      <div style={cellWrapperStyle}>
        <div style={gridStyle}>
          {showTitleColumn && <div style={titleColumnStyle}>{titleContent}</div>}
          <div style={mainColumnStyle}>{mainColumnContent}</div>
        </div>
      </div>
    </Grid>
  )
}
