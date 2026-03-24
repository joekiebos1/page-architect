'use client'

import { useRef } from 'react'
import { Headline, Text, SurfaceProvider, Card, CardBody, Button } from '@marcelinodzn/ds-react'
import type { IntentFormData, PageTemplate, PageType } from '../types'

const TEMPLATES: { value: PageTemplate; label: string }[] = [
  { value: 'product-page', label: 'Product page' },
  { value: 'jio-story', label: 'Jio Story' },
]

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
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <SurfaceProvider level={0}>
      <form ref={formRef} onSubmit={handleSubmit}>
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

          <Card surface="minimal" style={{ marginBottom: 'var(--ds-spacing-l)' }}>
            <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)' }}>
              <div>
                <label
                  htmlFor="template"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  Page template
                </label>
                <select
                  id="template"
                  value={data.template}
                  onChange={(e) => {
                    const t = e.target.value as PageTemplate
                    onChange({
                      ...data,
                      template: t,
                      ...(t === 'jio-story' && { pageType: 'editorial' as PageType }),
                    })
                  }}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                  }}
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="product"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  {data.template === 'jio-story' ? 'Story title' : 'Product'}
                </label>
                <input
                  id="product"
                  type="text"
                  value={data.product}
                  onChange={(e) => onChange({ ...data, product: e.target.value })}
                  placeholder={data.template === 'jio-story' ? 'e.g. A farmer in Rajasthan' : 'e.g. JioSaavn'}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                  }}
                />
              </div>

              {data.template === 'product-page' && (
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
                      borderRadius: 'var(--ds-radius-card-s)',
                      border: '1px solid var(--ds-color-stroke-divider)',
                      fontSize: 'var(--ds-typography-body-xs)',
                      fontFamily: 'inherit',
                      color: 'var(--ds-color-text-high)',
                      background: 'var(--ds-color-background-ghost)',
                    }}
                  >
                    {PAGE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="audience"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  {data.template === 'jio-story' ? 'India context' : 'Audience'}
                </label>
                <input
                  id="audience"
                  type="text"
                  value={data.audience}
                  onChange={(e) => onChange({ ...data, audience: e.target.value })}
                  placeholder={data.template === 'jio-story' ? 'e.g. connectivity, aspiration, family, celebration' : 'e.g. Indian music lovers aged 18-35'}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="primaryAction"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  {data.template === 'jio-story' ? 'Primary action' : 'Primary action'}
                </label>
                <input
                  id="primaryAction"
                  type="text"
                  value={data.primaryAction}
                  onChange={(e) => onChange({ ...data, primaryAction: e.target.value })}
                  placeholder={data.template === 'jio-story' ? 'Read the story (implicit)' : 'What should the user do? e.g. Download the app'}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="keyMessage"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  {data.template === 'jio-story' ? 'Story angle' : 'Key message'}
                </label>
                <input
                  id="keyMessage"
                  type="text"
                  value={data.keyMessage}
                  onChange={(e) => onChange({ ...data, keyMessage: e.target.value })}
                  placeholder={data.template === 'jio-story' ? 'The specific human moment or initiative (one sentence)' : 'The one thing they should remember'}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="pagePath"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--ds-spacing-xs)',
                    fontSize: 'var(--ds-typography-label-s)',
                    fontWeight: 'var(--ds-typography-weight-medium)',
                    color: 'var(--ds-color-text-high)',
                  }}
                >
                  Page path
                </label>
                <input
                  id="pagePath"
                  type="text"
                  value={data.pagePath}
                  onChange={(e) => onChange({ ...data, pagePath: e.target.value })}
                  placeholder={data.template === 'jio-story' ? 'e.g. /stories/farmer-rajasthan' : 'e.g. /products/jiosaavn'}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                  }}
                />
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
                  {data.template === 'jio-story' ? 'Story details' : 'Intent'}
                </label>
                <textarea
                  id="intent"
                  value={data.intent}
                  onChange={(e) => onChange({ ...data, intent: e.target.value })}
                  placeholder={data.template === 'jio-story' ? 'Specific evidence, Jio\'s role, and what makes this story believable' : 'What should this page accomplish? Who is it for?'}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
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
                    borderRadius: 'var(--ds-radius-card-s)',
                    border: '1px solid var(--ds-color-stroke-divider)',
                    fontSize: 'var(--ds-typography-body-xs)',
                    fontFamily: 'inherit',
                    color: 'var(--ds-color-text-high)',
                    background: 'var(--ds-color-background-ghost)',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </CardBody>
          </Card>

          <Button
            onPress={() => formRef.current?.requestSubmit()}
            appearance="neutral"
            size="M"
            attention="high"
          >
            Continue to interview
          </Button>
        </div>
      </form>
    </SurfaceProvider>
  )
}
