/**
 * Lab layout – wraps content for grid debug styling.
 * LabGridOverlay renders here so it appears on all lab routes (hero, carousel, media stacked, etc.).
 */

import { LabGridOverlay } from './GridOverlay'

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-show-grid">
      {children}
      <LabGridOverlay />
    </div>
  )
}
