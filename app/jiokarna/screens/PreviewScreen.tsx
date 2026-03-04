'use client'

import { useState, useEffect } from 'react'
import { Headline, Text, SurfaceProvider, Button } from '@marcelinodzn/ds-react'
import { BlockRenderer } from '../../components/BlockRenderer'
import { briefToBlocks } from '../briefToBlocks'
import type { PageBrief } from '../types'

type PreviewScreenProps = {
  brief: PageBrief
  onApprove: () => void
  onBack: () => void
}

export function PreviewScreen({ brief, onApprove, onBack }: PreviewScreenProps) {
  const [sanityImageUrls, setSanityImageUrls] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/jiokarna/images')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.urls)) setSanityImageUrls(data.urls)
      })
      .catch(() => {})
  }, [])

  const blocks = briefToBlocks(brief, sanityImageUrls)

  return (
    <SurfaceProvider level={0}>
      <div style={{ marginBottom: 'var(--ds-spacing-2xl)' }}>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            paddingBlock: 'var(--ds-spacing-l)',
            paddingInline: 'var(--ds-spacing-m)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--ds-spacing-m)',
          }}
        >
          <div>
            <Headline level={1} style={{ margin: 0, marginBottom: 'var(--ds-spacing-2xs)', fontSize: 'var(--ds-typography-h4)' }}>
              Page preview
            </Headline>
            <Text appearance="secondary" style={{ fontSize: 'var(--ds-typography-body-xs)' }}>
              {brief.meta.pageName} · Preview of proposed structure
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 'var(--ds-spacing-m)' }}>
            <Button onPress={onBack} appearance="secondary" contained={false} size="M" attention="high">
              Back to structure
            </Button>
            <Button onPress={onApprove} appearance="neutral" size="M" attention="high">
              Approve & export
            </Button>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--ds-color-stroke-subtle)',
            background: 'var(--ds-color-background-ghost)',
            minHeight: '60vh',
          }}
        >
          <BlockRenderer blocks={blocks} />
        </div>
      </div>
    </SurfaceProvider>
  )
}
