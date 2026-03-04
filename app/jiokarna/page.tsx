import type { Metadata } from 'next'
import { JioKarnaPage } from './JioKarnaPage'

export const metadata: Metadata = {
  title: 'JioKarna',
}

export default function JioKarnaRoute() {
  return <JioKarnaPage />
}
