'use client'

import { useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Headline, Text, SurfaceProvider, Button } from '@marcelinodzn/ds-react'
import type { StoryCoachInput } from './types'

const CHECKLIST: Record<string, { id: string; label: string }[]> = {
  whatItDoes: [
    { id: 'core', label: 'Core functionality' },
    { id: 'personalisation', label: 'Personalisation and intelligence' },
    { id: 'social', label: 'Social and sharing' },
    { id: 'settings', label: 'Settings and controls' },
    { id: 'access', label: 'Access and pricing' },
  ],
  whatIsInIt: [
    { id: 'catalogue', label: 'Catalogue depth and breadth' },
    { id: 'languages', label: 'Languages and regions' },
    { id: 'editorial', label: 'Editorial and curation' },
    { id: 'partners', label: 'Partners and exclusives' },
  ],
  builtFor: [
    { id: 'devices', label: 'Device range' },
    { id: 'network', label: 'Network conditions' },
    { id: 'household', label: 'Household and family use' },
    { id: 'india', label: 'Indian-specific adaptations' },
  ],
}

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
  border: '1px solid var(--ds-color-stroke-divider)',
  fontSize: 'var(--ds-typography-body-xs)',
  fontFamily: 'inherit',
  color: 'var(--ds-color-text-high)',
  background: 'var(--ds-color-background-ghost)',
  boxSizing: 'border-box',
}

const textareaStyles: React.CSSProperties = {
  ...inputStyles,
  resize: 'vertical',
  minHeight: 100,
}

const labelStyles: React.CSSProperties = {
  display: 'block',
  marginBottom: 'var(--ds-spacing-xs)',
  fontSize: 'var(--ds-typography-label-s)',
  fontWeight: 'var(--ds-typography-weight-medium)',
  color: 'var(--ds-color-text-high)',
}

type InputPanelProps = {
  onSubmit: (input: StoryCoachInput) => void
  isLoading: boolean
}

type ChecklistState = {
  whatItDoes: Record<string, boolean>
  whatIsInIt: Record<string, boolean>
  builtFor: Record<string, boolean>
}

const initialChecks: ChecklistState = {
  whatItDoes: { core: false, personalisation: false, social: false, settings: false, access: false },
  whatIsInIt: { catalogue: false, languages: false, editorial: false, partners: false },
  builtFor: { devices: false, network: false, household: false, india: false },
}

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [productName, setProductName] = useState('')
  const [whatItDoes, setWhatItDoes] = useState('')
  const [whatIsInIt, setWhatIsInIt] = useState('')
  const [builtFor, setBuiltFor] = useState('')
  const [checks, setChecks] = useState<ChecklistState>(initialChecks)

  const analyseField = useDebouncedCallback(
    async (field: string, text: string) => {
      if (text.trim().length < 30) return
      try {
        const res = await fetch('/api/story-coach/analyse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field, text }),
        })
        const data = await res.json()
        if (Array.isArray(data.covered)) {
          setChecks((prev) => ({
            ...prev,
            [field]: Object.fromEntries(
              CHECKLIST[field].map((item) => [item.id, data.covered.includes(item.id)])
            ),
          }))
        }
      } catch {
        // ignore
      }
    },
    2500
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ productName, whatItDoes, whatIsInIt, builtFor })
  }

  const canSubmit = productName.trim().length > 0 && !isLoading

  return (
    <SurfaceProvider level={0}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--ds-spacing-xl)',
          }}
        >
          <Headline level={2} style={{ marginBottom: 'var(--ds-spacing-xs)' }}>
            Story Coach
          </Headline>
          <Text
            appearance="secondary"
            style={{ marginBottom: 'var(--ds-spacing-xl)', fontSize: 'var(--ds-typography-body-xs)' }}
          >
            Product name is required. Add detail for a richer arc.
          </Text>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)', flex: 1 }}>
            <div>
              <label htmlFor="productName" style={labelStyles}>
                Product name <span style={{ color: 'var(--ds-color-negative)' }}>*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. JioSaavn"
                required
                style={inputStyles}
              />
            </div>

            <div>
              <label htmlFor="whatItDoes" style={labelStyles}>
                What does it do? <span style={{ color: 'var(--ds-color-text-low)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="whatItDoes"
                value={whatItDoes}
                onChange={(e) => {
                  setWhatItDoes(e.target.value)
                  analyseField('whatItDoes', e.target.value)
                }}
                rows={6}
                style={textareaStyles}
              />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--ds-spacing-s)',
                  marginTop: 'var(--ds-spacing-s)',
                  fontSize: 'var(--ds-typography-body-xs)',
                }}
              >
                {CHECKLIST.whatItDoes.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      color: checks.whatItDoes[item.id]
                        ? 'var(--ds-color-positive)'
                        : 'var(--ds-color-text-low)',
                    }}
                  >
                    {checks.whatItDoes[item.id] ? '✓' : '✗'} {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="whatIsInIt" style={labelStyles}>
                What is in it? <span style={{ color: 'var(--ds-color-text-low)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="whatIsInIt"
                value={whatIsInIt}
                onChange={(e) => {
                  setWhatIsInIt(e.target.value)
                  analyseField('whatIsInIt', e.target.value)
                }}
                rows={4}
                style={textareaStyles}
              />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--ds-spacing-s)',
                  marginTop: 'var(--ds-spacing-s)',
                  fontSize: 'var(--ds-typography-body-xs)',
                }}
              >
                {CHECKLIST.whatIsInIt.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      color: checks.whatIsInIt[item.id]
                        ? 'var(--ds-color-positive)'
                        : 'var(--ds-color-text-low)',
                    }}
                  >
                    {checks.whatIsInIt[item.id] ? '✓' : '✗'} {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="builtFor" style={labelStyles}>
                What is it built for? <span style={{ color: 'var(--ds-color-text-low)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="builtFor"
                value={builtFor}
                onChange={(e) => {
                  setBuiltFor(e.target.value)
                  analyseField('builtFor', e.target.value)
                }}
                rows={4}
                style={textareaStyles}
              />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--ds-spacing-s)',
                  marginTop: 'var(--ds-spacing-s)',
                  fontSize: 'var(--ds-typography-body-xs)',
                }}
              >
                {CHECKLIST.builtFor.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      color: checks.builtFor[item.id]
                        ? 'var(--ds-color-positive)'
                        : 'var(--ds-color-text-low)',
                    }}
                  >
                    {checks.builtFor[item.id] ? '✓' : '✗'} {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button
            onPress={() => formRef.current?.requestSubmit()}
            isDisabled={!canSubmit}
            appearance="neutral"
            size="M"
            attention="high"
            style={{ marginTop: 'var(--ds-spacing-xl)', alignSelf: 'flex-start' }}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
    </SurfaceProvider>
  )
}
