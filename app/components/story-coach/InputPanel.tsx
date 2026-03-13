'use client'

import { useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Headline, Text, SurfaceProvider, Button } from '@marcelinodzn/ds-react'
import type { StoryCoachInput } from './types'

const CHECKLIST: Record<string, { id: string; label: string }[]> = {
  whatItDoes: [
    { id: 'core', label: 'Core functionality' },
    { id: 'social', label: 'Social, family and sharing functionality' },
    { id: 'personalisation', label: 'Personalisation and intelligence' },
    { id: 'access', label: 'Access and pricing' },
    { id: 'privacy', label: 'Privacy, data, accessibility' },
  ],
  whatIsInIt: [
    { id: 'catalogue', label: 'Catalogue depth and breadth' },
    { id: 'languages', label: 'Language and regions' },
    { id: 'editorial', label: 'Editorial and curation' },
    { id: 'partners', label: 'Partner and exclusives' },
  ],
  builtFor: [
    { id: 'devices', label: 'Device range' },
    { id: 'network', label: 'Network conditions' },
    { id: 'india', label: 'Indian-specific adaptations' },
  ],
}

const grey = {
  border: 'rgba(0, 0, 0, 0.06)',
  label: 'rgba(0, 0, 0, 0.65)',
  secondary: 'rgba(0, 0, 0, 0.48)',
  tertiary: 'rgba(0, 0, 0, 0.36)',
}

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
  border: `1px solid ${grey.border}`,
  fontSize: 'var(--ds-typography-body-xs)',
  fontFamily: 'inherit',
  color: 'var(--ds-color-text-high)',
  background: 'transparent',
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
  whatItDoes: { core: false, social: false, personalisation: false, access: false, privacy: false },
  whatIsInIt: { catalogue: false, languages: false, editorial: false, partners: false },
  builtFor: { devices: false, network: false, india: false },
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
            padding: 'var(--ds-spacing-2xl)',
          }}
        >
          <Headline level={2} style={{ marginBottom: 'var(--ds-spacing-s)', fontWeight: 'var(--ds-typography-weight-medium)', color: 'var(--ds-color-text-high)', letterSpacing: '-0.02em' }}>
            Story Coach
          </Headline>
          <Text
            style={{
              marginBottom: 'var(--ds-spacing-2xs)',
              fontSize: 'var(--ds-typography-label-s)',
              fontWeight: 'var(--ds-typography-weight-medium)',
              color: grey.label,
              letterSpacing: '-0.01em',
            }}
          >
            Helps you craft stories for jio.com
          </Text>
          <Text
            style={{
              marginBottom: 'var(--ds-spacing-xl)',
              fontSize: 'var(--ds-typography-body-xs)',
              fontWeight: 'var(--ds-typography-weight-low)',
              color: grey.secondary,
              lineHeight: 1.5,
            }}
          >
            Fill in as much detail as possible to create a rich story that is uniquely Jio.
          </Text>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-l)', flex: 1 }}>
            <div>
              <label htmlFor="productName" style={labelStyles}>
                Product name <span style={{ color: grey.tertiary }}>*</span>
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
                Describe what the product does
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
                  marginBottom: 'var(--ds-spacing-xl)',
                }}
              >
                {CHECKLIST.whatItDoes.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 'var(--ds-spacing-xs) var(--ds-spacing-s)',
                      border: `1px solid ${grey.border}`,
                      fontSize: '12px',
                      fontWeight: 'var(--ds-typography-weight-low)',
                      color: checks.whatItDoes[item.id]
                        ? 'var(--ds-color-positive)'
                        : grey.tertiary,
                    }}
                  >
                    {checks.whatItDoes[item.id] ? '✓' : '✗'} {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="whatIsInIt" style={labelStyles}>
                Describe what is in the product or can be accessed through the product
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
                  marginBottom: 'var(--ds-spacing-xl)',
                }}
              >
                {CHECKLIST.whatIsInIt.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 'var(--ds-spacing-xs) var(--ds-spacing-s)',
                      border: `1px solid ${grey.border}`,
                      fontSize: '12px',
                      fontWeight: 'var(--ds-typography-weight-low)',
                      color: checks.whatIsInIt[item.id]
                        ? 'var(--ds-color-positive)'
                        : grey.tertiary,
                    }}
                  >
                    {checks.whatIsInIt[item.id] ? '✓' : '✗'} {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="builtFor" style={labelStyles}>
                What is it built for?
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
                  marginBottom: 'var(--ds-spacing-xl)',
                }}
              >
                {CHECKLIST.builtFor.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 'var(--ds-spacing-xs) var(--ds-spacing-s)',
                      border: `1px solid ${grey.border}`,
                      fontSize: '12px',
                      fontWeight: 'var(--ds-typography-weight-low)',
                      color: checks.builtFor[item.id]
                        ? 'var(--ds-color-positive)'
                        : grey.tertiary,
                    }}
                  >
                    {checks.builtFor[item.id] ? '✓' : '✗'} {item.label}
                  </div>
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
