'use client'

import { DsProvider } from '@marcelinodzn/ds-react'
import { DSFoundationsStyles } from './DSFoundationsStyles'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DsProvider platform="Desktop (1440)" colorMode="Light" density="Default" theme="JioHome">
      <DSFoundationsStyles />
      {children}
    </DsProvider>
  )
}
