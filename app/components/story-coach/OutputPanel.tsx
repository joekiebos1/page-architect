'use client'

import { useEffect, useState } from 'react'
import { Headline, Text, SurfaceProvider } from '@marcelinodzn/ds-react'
import type { StoryCoachState, StoryCoachResult, Block } from './types'

const LOADING_MESSAGES = [
  'Reading the brief...',
  'Finding the central truth...',
  'Building the arc...',
  'Placing the blocks...',
  'Checking every claim has its proof...',
]

type OutputPanelProps = {
  state: StoryCoachState
  productName?: string
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 'var(--ds-typography-label-s)',
  fontWeight: 'var(--ds-typography-weight-high)',
  color: 'var(--ds-color-text-medium)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 'var(--ds-spacing-m)',
  paddingBottom: 'var(--ds-spacing-s)',
  borderBottom: '1px solid var(--ds-color-stroke-subtle)',
}

function ResultView({ result, productName }: { result: StoryCoachResult; productName?: string }) {
  const setup = result.blocks.filter((b) => b.section === 'setup')
  const engage = result.blocks.filter((b) => b.section === 'engage')
  const resolve = result.blocks.filter((b) => b.section === 'resolve')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-2xl)' }}>
      <header style={{ marginBottom: 'var(--ds-spacing-l)' }}>
        <Headline level={1} style={{ marginBottom: 'var(--ds-spacing-xs)' }}>
          {productName || result.primaryEmotion}
        </Headline>
        <Text
          appearance="secondary"
          style={{
            fontSize: 'var(--ds-typography-body-xs)',
            fontWeight: 'var(--ds-typography-weight-medium)',
          }}
        >
          {result.blocks.length} blocks — {setup.length} setup · {engage.length} engage · {resolve.length} resolve
        </Text>
      </header>

      <section>
        <div style={sectionHeaderStyle}>RTBs</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--ds-spacing-l)',
          }}
        >
          <RTBRow label="Emotional" value={result.rtbs.emotional} />
          <RTBRow label="Rational" value={result.rtbs.rational} />
          <RTBRow label="Social" value={result.rtbs.social} />
          <RTBRow label="Proud of" value={result.rtbs.proud} />
        </div>
      </section>

      <section>
        <div style={sectionHeaderStyle}>Narrative arc</div>
        <div
          style={{
            padding: 'var(--ds-spacing-m)',
            border: '1px solid var(--ds-color-stroke-subtle)',
            marginBottom: 'var(--ds-spacing-l)',
          }}
        >
          <Text
            size="S"
            as="p"
            style={{
              margin: 0,
              fontWeight: 'var(--ds-typography-weight-medium)',
              color: 'var(--ds-color-text-medium)',
            }}
          >
            Central truth
          </Text>
          <Text size="M" as="p" style={{ margin: 'var(--ds-spacing-xs) 0 0' }}>
            {result.centralTruth}
          </Text>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)' }}>
          <ArcSection title="Hook" items={result.hook} />
          <ArcSection title="Middle" items={result.middle} />
          <ArcSection title="Close" items={result.close} />
        </div>
      </section>

      <section>
        <div style={sectionHeaderStyle}>Block structure</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {result.blocks.map((block) => (
            <BlockRow key={block.num} block={block} />
          ))}
        </div>
      </section>
    </div>
  )
}

function RTBRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 'var(--ds-spacing-m)',
        border: '1px solid var(--ds-color-stroke-subtle)',
      }}
    >
      <Text
        size="XS"
        as="span"
        style={{
          display: 'block',
          fontWeight: 'var(--ds-typography-weight-medium)',
          marginBottom: 'var(--ds-spacing-xs)',
          color: 'var(--ds-color-text-medium)',
        }}
      >
        {label}
      </Text>
      <Text size="S" as="p" style={{ margin: 0 }}>
        {value}
      </Text>
    </div>
  )
}

function ArcSection({ title, items }: { title: string; items: Record<string, string> }) {
  return (
    <div
      style={{
        border: '1px solid var(--ds-color-stroke-subtle)',
        padding: 'var(--ds-spacing-m)',
      }}
    >
      <Text
        size="S"
        as="span"
        style={{
          fontWeight: 'var(--ds-typography-weight-high)',
          color: 'var(--ds-color-text-high)',
        }}
      >
        {title}
      </Text>
      <div style={{ marginTop: 'var(--ds-spacing-m)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-m)' }}>
        {Object.entries(items).map(([key, value]) => (
          <div key={key}>
            <Text
              size="XS"
              as="span"
              style={{ color: 'var(--ds-color-text-medium)', textTransform: 'capitalize' }}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <Text size="S" as="p" style={{ margin: 'var(--ds-spacing-2xs) 0 0' }}>
              {value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlockRow({ block }: { block: Block }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 80px 1fr',
        gap: 'var(--ds-spacing-m)',
        alignItems: 'start',
        padding: 'var(--ds-spacing-m)',
        borderBottom: '1px solid var(--ds-color-stroke-subtle)',
      }}
    >
      <Text
        size="S"
        as="span"
        style={{
          fontWeight: 'var(--ds-typography-weight-high)',
          color: 'var(--ds-color-text-medium)',
        }}
      >
        {block.num}
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-2xs)' }}>
        <Text
          size="XS"
          as="span"
          style={{
            fontWeight: 'var(--ds-typography-weight-medium)',
            color: 'var(--ds-color-text-low)',
            textTransform: 'capitalize',
          }}
        >
          {block.type}
        </Text>
        <Text
          size="XS"
          as="span"
          style={{
            color: 'var(--ds-color-text-low)',
            textTransform: 'capitalize',
          }}
        >
          {block.section}
        </Text>
      </div>
      <div>
        <Text size="S" as="p" style={{ margin: '0 0 var(--ds-spacing-xs)', fontWeight: 'var(--ds-typography-weight-medium)' }}>
          {block.headline}
        </Text>
        <Text size="XS" as="p" style={{ margin: 0, color: 'var(--ds-color-text-medium)' }}>
          {block.job}
        </Text>
      </div>
    </div>
  )
}

export function OutputPanel({ state, productName }: OutputPanelProps) {
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])

  useEffect(() => {
    if (state.status !== 'loading') return
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[i])
    }, 1800)
    return () => clearInterval(interval)
  }, [state.status])

  if (state.status === 'idle') {
    return (
      <SurfaceProvider level={0}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--ds-spacing-2xl)',
          }}
        >
          <Text appearance="secondary" style={{ fontSize: 'var(--ds-typography-body-xs)' }}>
            Enter a product name and generate to see the narrative arc.
          </Text>
        </div>
      </SurfaceProvider>
    )
  }

  if (state.status === 'loading') {
    return (
      <SurfaceProvider level={0}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--ds-spacing-2xl)',
          }}
        >
          <Text style={{ fontSize: 'var(--ds-typography-body-xs)' }}>{loadingMessage}</Text>
        </div>
      </SurfaceProvider>
    )
  }

  if (state.status === 'error') {
    return (
      <SurfaceProvider level={0}>
        <div style={{ padding: 'var(--ds-spacing-2xl)' }}>
          <Text appearance="negative" style={{ fontSize: 'var(--ds-typography-body-xs)' }}>
            {state.error}
          </Text>
        </div>
      </SurfaceProvider>
    )
  }

  if (state.status === 'success' && state.result) {
    return (
      <SurfaceProvider level={0}>
        <div style={{ padding: 'var(--ds-spacing-2xl)' }}>
          <ResultView result={state.result} productName={productName} />
        </div>
      </SurfaceProvider>
    )
  }

  return null
}
