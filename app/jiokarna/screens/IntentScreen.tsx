'use client'

import { Headline, Text, SurfaceProvider, Card, CardBody } from '@marcelinodzn/ds-react'
import type { IntentFormData, PageType } from '../types'

const PAGE_TYPES: { value: PageType; label: string }[] = [
  { value: 'campaign', label: 'Campaign' },
  { value: 'product-launch', label: 'Product launch' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'category', label: 'Category' },
  { value: 'other', label: 'Other' },
]

type IntentScreenProps = {
  data: IntentFormData
  onChange: (data: IntentFormData) => void
  onSubmit: () => void
}

export function IntentScreen({ data, onChange, onSubmit }: IntentScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <SurfaceProvider level={0}>
      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: 560, margin: '0 auto', paddingBlock: 'var(--ds-spacing-2xl)' }}>
          <Headline level={1} style={{ marginBottom: 'var(--ds-spacing-l)' }}>
            Page intent
          </Headline>
          <Text
            appearance="secondary"
            style={{ marginBottom: 'var(--ds-spacing-2xl)', fontSize: 'var(--ds-typography-body-xs)' }}
          >
            Describe the page you want to produce. We&apos;ll ask a few clarifying questions, then propose a structure.
          </Text>

          <Card surface="subtle" style={{ marginBottom: 'var(--ds-spacing-l)' }}>
            <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)' }}>
              <div>
                <label
                  htmlFor="pageName"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  Page name
                </label>
                <input
                  id="pageName"
                  type="text"
                  value={data.pageName}
                  onChange={(e) => onChange({ ...data, pageName: e.target.value })}
                  placeholder="e.g. New Product Launch"
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 8,
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="pageType"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  Page type
                </label>
                <select
                  id="pageType"
                  value={data.pageType}
                  onChange={(e) => onChange({ ...data, pageType: e.target.value as PageType })}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 8,
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background)',
                  }}
                >
                  {PAGE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="intent"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  Intent
                </label>
                <textarea
                  id="intent"
                  value={data.intent}
                  onChange={(e) => onChange({ ...data, intent: e.target.value })}
                  placeholder="What should this page accomplish? Who is it for?"
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 8,
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background)',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="briefContent"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-medium)',
                  }}
                >
                  Optional brief content
                </label>
                <textarea
                  id="briefContent"
                  value={data.briefContent ?? ''}
                  onChange={(e) => onChange({ ...data, briefContent: e.target.value || undefined })}
                  placeholder="Any existing copy, notes, or constraints..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 8,
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background)',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </CardBody>
          </Card>

          <button
            type="submit"
            style={{
              padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
              background: 'var(--ds-color-neutral-bold)',
              color: 'var(--ds-color-background)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'var(--ds-typography-weight-high)',
              fontSize: 'var(--ds-typography-label-m)',
              cursor: 'pointer',
            }}
          >
            Continue to interview
          </button>
        </div>
      </form>
    </SurfaceProvider>
  )
}
