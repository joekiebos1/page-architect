# Shared components

This directory is split by agent:

- **BlockRenderer.tsx** → content-agent (mapping Sanity → block props; only for props blocks already support)
- **GridBlock.tsx**, **VideoWithControls.tsx**, **Cards/** → blocks-agent (block layout, media, and card library)

Invoke `/content-agent` or `/blocks-agent` accordingly.
