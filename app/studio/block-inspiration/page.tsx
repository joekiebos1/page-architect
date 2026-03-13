'use client'

import { useState } from 'react'
import { Headline, Text } from '@marcelinodzn/ds-react'
import { BLOCK_CATALOGUE, type BlockCatalogueEntry } from './block-catalogue'

const grey = {
  label: 'rgba(0, 0, 0, 0.65)',
  secondary: 'rgba(0, 0, 0, 0.48)',
  border: 'rgba(0, 0, 0, 0.06)',
}

function BlockCard({
  entry,
  onClick,
}: {
  entry: BlockCatalogueEntry
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 'var(--ds-spacing-s)',
        padding: 'var(--ds-spacing-m)',
        border: `1px solid ${grey.border}`,
        borderRadius: 'var(--ds-radius-m)',
        background: 'var(--ds-color-background-ghost)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = grey.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: 180 }}>
        <entry.Preview />
      </div>
      <Headline
        size="XS"
        weight="medium"
        as="h3"
        style={{ margin: 0, color: 'var(--ds-color-text-high)' }}
      >
        {entry.name}
      </Headline>
      {entry.tier === 'lab' && (
        <span
          style={{
            fontSize: 'var(--ds-typography-label-xs)',
            color: grey.secondary,
          }}
        >
          Lab
        </span>
      )}
    </button>
  )
}

function BlockDetailModal({
  entry,
  onClose,
}: {
  entry: BlockCatalogueEntry
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-detail-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--ds-spacing-2xl)',
        background: 'rgba(0, 0, 0, 0.4)',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--ds-color-background-ghost)',
          borderRadius: 'var(--ds-radius-l)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
          padding: 'var(--ds-spacing-2xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--ds-spacing-m)', marginBottom: 'var(--ds-spacing-l)' }}>
          <div>
            <Headline
              id="block-detail-title"
              level={2}
              style={{ margin: 0, marginBottom: 'var(--ds-spacing-xs)', fontWeight: 'var(--ds-typography-weight-medium)' }}
            >
              {entry.name}
            </Headline>
            {entry.tier === 'lab' && (
              <span style={{ fontSize: 'var(--ds-typography-label-s)', color: grey.secondary }}>
                Lab block
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: 'var(--ds-spacing-xs)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1.25rem',
              lineHeight: 1,
              color: grey.secondary,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <Text
          size="M"
          as="p"
          style={{ marginBottom: 'var(--ds-spacing-xl)', color: grey.label, lineHeight: 1.5 }}
        >
          {entry.description}
        </Text>

        <div style={{ marginBottom: 'var(--ds-spacing-m)' }}>
          <Headline
            size="XS"
            weight="medium"
            as="h3"
            style={{ margin: 0, marginBottom: 'var(--ds-spacing-s)', color: 'var(--ds-color-text-high)' }}
          >
            Creative uses
          </Headline>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--ds-spacing-l)',
              color: grey.label,
              fontSize: 'var(--ds-typography-body-s)',
              lineHeight: 1.6,
            }}
          >
            {entry.creativeUses.map((use, i) => (
              <li key={i} style={{ marginBottom: 'var(--ds-spacing-xs)' }}>
                {use}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            padding: 'var(--ds-spacing-m)',
            background: 'var(--ds-color-background-subtle)',
            borderRadius: 'var(--ds-radius-m)',
            border: `1px solid ${grey.border}`,
          }}
        >
          <Headline
            size="XS"
            weight="medium"
            as="h3"
            style={{ margin: 0, marginBottom: 'var(--ds-spacing-s)', color: 'var(--ds-color-text-high)' }}
          >
            Preview
          </Headline>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <entry.Preview />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlockInspirationPage() {
  const [selected, setSelected] = useState<BlockCatalogueEntry | null>(null)

  return (
    <div
      style={{
        padding: 'var(--ds-spacing-2xl)',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      <Headline
        level={2}
        style={{
          marginBottom: 'var(--ds-spacing-s)',
          fontWeight: 'var(--ds-typography-weight-medium)',
          color: 'var(--ds-color-text-high)',
        }}
      >
        Block Inspiration
      </Headline>
      <Text
        style={{
          marginBottom: 'var(--ds-spacing-2xl)',
          fontSize: 'var(--ds-typography-body-s)',
          color: grey.label,
          lineHeight: 1.5,
        }}
      >
        Browse all blocks. Click a block for details and creative use ideas.
      </Text>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--ds-spacing-l)',
        }}
      >
        {BLOCK_CATALOGUE.map((entry) => (
          <BlockCard key={entry.id} entry={entry} onClick={() => setSelected(entry)} />
        ))}
      </div>

      {selected && (
        <BlockDetailModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
