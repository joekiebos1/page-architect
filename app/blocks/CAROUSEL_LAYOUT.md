# Carousel Layout Spec

Cards always live in a **Default-width** area (10/6/4 cols). Wide is only used when buttons are on the side.

## Breakpoints

- **Mobile**: columns ≤ 4
- **Tablet**: columns 8 (768px–1439px)
- **Desktop**: columns 12 (1440px+)

## Layout by breakpoint

### Desktop

| Size   | Cards visible | Card area width | Buttons   | Outer container |
|--------|---------------|-----------------|-----------|-----------------|
| Large  | 3 (center full, left/right clipped) | Default (10 cols) | Side      | Wide (10 + buttons) |
| Medium | 2             | Default (10 cols) | Bottom    | Default         |
| Compact| 3             | Default (10 cols) | Bottom    | Default         |

### Tablet

| Size   | Cards visible | Card area width | Buttons | Outer container |
|--------|---------------|-----------------|---------|-----------------|
| Large  | 1             | Default (6 cols), fluid | Bottom | Default |
| Medium | 2             | Default (6 cols), fixed 550px | Bottom | Default |
| Compact| 2             | Default (6 cols), fixed 360px | Bottom | Default |

### Mobile

| Size   | Cards visible | Card area width | Buttons | Outer container |
|--------|---------------|-----------------|---------|-----------------|
| Large  | 1             | 280px fixed     | Bottom  | Default         |
| Medium | 1             | 280px fixed     | Bottom  | Default         |
| Compact| 1             | 280px fixed     | Bottom  | Default         |

## Pagination

- One card per tap, all breakpoints
- **Compact & Medium:** Scroll cap — stop when the last card's right edge aligns with the Default grid right edge (no empty space to the right). When navigating backward from the end, step back by the same amount used for the last forward step.
- **Large:** Min 3 cards (enforced in Sanity). 3 cards in viewport: center full, left/right clipped. Page-based scroll. Forward at end: append first card, then reset on transition end. Back at start: prepend last card; forward past prepend: collapse. Nav buttons never disabled.

## Key rule

**Cards are never Wide.** Wide is only the total row when [left button] + [Default card area] + [right button].
