'use client'

import { useRef, useEffect } from 'react'
import { Headline, Text, SurfaceProvider, Card } from '@marcelinodzn/ds-react'

type Message = { role: 'user' | 'assistant'; content: string }

type InterviewScreenProps = {
  intentData: { pageName: string; pageType: string; intent: string; briefContent?: string }
  messages: Message[]
  isThinking: boolean
  onSendMessage: (content: string) => Promise<void>
  onReady: () => void
}

export function InterviewScreen({
  intentData,
  messages,
  isThinking,
  onSendMessage,
  onReady,
}: InterviewScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const textarea = form.querySelector('textarea')
    const text = textarea?.value.trim()
    if (!text || isThinking) return
    textarea!.value = ''
    await onSendMessage(text)
  }

  const lastAssistant = messages.filter((m) => m.role === 'assistant').pop()
  const isReady = lastAssistant?.content.toUpperCase().includes('READY')

  return (
    <SurfaceProvider level={0}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingBlock: 'var(--ds-spacing-2xl)' }}>
        <Headline level={1} style={{ marginBottom: 'var(--ds-spacing-xs)' }}>
          Clarifying questions
        </Headline>
        <Text
          appearance="secondary"
          style={{ marginBottom: 'var(--ds-spacing-l)', fontSize: 'var(--ds-typography-body-xs)' }}
        >
          {intentData.pageName} - {intentData.pageType}
        </Text>

        <Card surface="subtle" style={{ marginBottom: 'var(--ds-spacing-l)' }}>
          <div
            ref={scrollRef}
            style={{
              maxHeight: 400,
              overflowY: 'auto',
              padding: 'var(--ds-spacing-m)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--ds-spacing-m)',
            }}
          >
            {messages.length === 0 && !isThinking && (
              <Text appearance="secondary" style={{ fontSize: 'var(--ds-typography-body-xs)' }}>
                Answer the questions below. When we have enough context, we will propose a page structure.
              </Text>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                  borderRadius: 8,
                  background: m.role === 'user' ? 'var(--ds-color-neutral-bold)' : 'var(--ds-color-background-subtle)',
                  color: m.role === 'user' ? 'var(--ds-color-background)' : 'var(--ds-color-text-high)',
                  fontSize: 'var(--ds-typography-body-xs)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            ))}
            {isThinking && (
              <div
                style={{
                  padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                  fontSize: 'var(--ds-typography-body-xs)',
                  color: 'var(--ds-color-text-medium)',
                }}
              >
                Thinking...
              </div>
            )}
          </div>

          {isReady ? (
            <div style={{ padding: 'var(--ds-spacing-m)', borderTop: '1px solid var(--ds-color-stroke-divider)' }}>
              <button
                type="button"
                onClick={onReady}
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
                Propose structure
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                padding: 'var(--ds-spacing-m)',
                borderTop: '1px solid var(--ds-color-stroke-divider)',
              }}
            >
              <textarea
                name="message"
                placeholder="Your answer..."
                disabled={isThinking}
                rows={2}
                style={{
                  width: '100%',
                  padding: 'var(--ds-spacing-s)',
                  borderRadius: 8,
                  border: '1px solid var(--ds-color-stroke-divider)',
                  fontSize: 'var(--ds-typography-body-xs)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  marginBottom: 'var(--ds-spacing-s)',
                }}
              />
              <button
                type="submit"
                disabled={isThinking}
                style={{
                  padding: 'var(--ds-spacing-s) var(--ds-spacing-m)',
                  background: 'var(--ds-color-neutral-bold)',
                  color: 'var(--ds-color-background)',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 'var(--ds-typography-weight-high)',
                  fontSize: 'var(--ds-typography-label-m)',
                  cursor: isThinking ? 'not-allowed' : 'pointer',
                  opacity: isThinking ? 0.7 : 1,
                }}
              >
                {isThinking ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </Card>
      </div>
    </SurfaceProvider>
  )
}
