# Lab — Sizing & Responsive Framework

Overview of everything that defines how elements are sized in the Lab. Single reference to avoid confusion.

---

## 1. Breakpoint Sources (two systems)

### A. Viewport → Platform (ds-tokens)

| Viewport width | Platform       | Used for |
|----------------|----------------|----------|
| &lt; 768px     | Mobile (360)   | DS tokens, DsProvider |
| &lt; 1440px    | Tablet (768)   | DS tokens |
| &lt; 1920px    | Desktop (1440) | DS tokens |
| ≥ 1920px       | Desktop (1920) | DS tokens |

**Source:** `getPlatformForWidth(w)` in `use-grid-breakpoint.ts`, from `@marcelinodzn/ds-tokens` `getBreakpoints()`.

### B. Viewport → Grid columns

| Viewport width | Columns | Used for |
|----------------|---------|----------|
| &lt; 768px     | 4       | GridBlock, useGridCell, BlockContainer |
| &lt; 1440px    | 8       | GridBlock, useGridCell, BlockContainer |
| ≥ 1440px       | 12      | GridBlock, useGridCell, BlockContainer |

**Source:** `useGridBreakpoint().columns` — derived from platform (DS `Grid/columns` per platform).

**Lab rule:** Use `columns` for layout decisions. `columns <= 4` = mobile, `columns <= 8` = tablet, `columns === 12` = desktop.

---

## 2. Layout primitives

### useGridBreakpoint()

**Returns:** `GridBreakpoint`

| Property | Mobile (4 cols) | Tablet (8 cols) | Desktop (12 cols) |
|----------|----------------|-----------------|--------------------|
| `columns` | 4 | 8 | 12 |
| `margin`, `gutter` | (internal) | Use `var(--ds-grid-margin)`, `var(--ds-grid-gutter)` in CSS |
| `contentMaxXS` | `100%` | `100%` | px (4 cols) |
| `contentMaxS` | `100%` | `100%` | px (6 cols) |
| `contentMaxM` | `100%` | `100%` | px (8 cols) |
| `contentMaxDefault` | `100%` | `100%` | px (10 cols) |
| `contentMaxWide` | `100%` | `100%` | px (12 cols) |
| `isDesktop` | false | false | true (viewport ≥ 1440) |
| `gridMaxWidth` | undefined | undefined | px (capped) |

**Important:** `contentMax*` are `100%` when `!isDesktop` (viewport &lt; 1440). On desktop they are pixel values (capped at ~1346px).

### useGridCell(contentWidth)

**Returns:** `{ gridColumn: "start / span N" }`

Use inside `GridBlock` to span content. Centred within the grid.

| contentWidth | Mobile (4) | Tablet (8) | Desktop (12) |
|--------------|------------|------------|--------------|
| XS | 4 | 4 | 4 |
| S | 4 | 6 | 6 |
| M | 4 | 6 | 8 |
| Default | 4 | 6 | 10 |
| Wide | 4 | 8 | 12 |

### BlockContainer(contentWidth)

**Renders:** a div with `maxWidth` from `useGridBreakpoint()`.

| contentWidth | Maps to |
|--------------|---------|
| XS | contentMaxXS |
| S | contentMaxS |
| M | contentMaxM |
| Default | contentMaxDefault |
| Wide | contentMaxWide |
| edgeToEdge | Full viewport, capped 1920px |
| full | 100%, no max-width |

### GridBlock

**Renders:** CSS grid with `var(--ds-grid-columns)`, `var(--ds-grid-gutter)`, `var(--ds-grid-margin)`, `maxWidth: gridMaxWidth` (desktop only).

---

## 3. Responsive helpers (lib/responsive-breakpoint.ts)

**Use `columns` from `useGridBreakpoint()`.**

| Function | Purpose |
|----------|---------|
| `isMobile(columns)` | `columns <= 4` |
| `isTablet(columns)` | `4 < columns <= 8` |
| `isDesktop(columns)` | `columns >= 12` |
| `useBreakpoint()` | Hook: returns `'mobile' | 'tablet' | 'desktop'` from columns |
| `getResponsiveCarouselCols(columns, cardSize)` | Visible carousel cards per breakpoint |
| `getAspectRatioForBreakpoint(baseRatio, columns)` | Landscape → portrait on mobile |

**Breakpoint constants:** `BREAKPOINT_COLUMNS = { mobile: 4, tablet: 8, desktop: 12 }`

---

## 4. Edge-to-edge (lib/edge-to-edge.ts)

| Export | Purpose |
|--------|---------|
| `EDGE_TO_EDGE_BREAKOUT` | Full viewport width (`100vw`, negative margins) |
| `useEdgeToEdgeMediaStyles()` | Inner container: `max-width: min(100vw, 1920px)`, rounded when capped |
| `EDGE_TO_EDGE_MAX_PX` | 1920 |

---

## 5. Decision flow — what to use when

```
Need to size content?
├── Inside GridBlock?
│   └── use useGridCell(contentWidth) for gridColumn
├── Standalone container (headings, carousel viewport)?
│   └── use BlockContainer(contentWidth) or contentMax* from useGridBreakpoint
├── Full viewport (media, backgrounds)?
│   └── use EDGE_TO_EDGE_BREAKOUT + useEdgeToEdgeMediaStyles
└── Carousel / card count / aspect ratio?
    └── use getResponsiveCarouselCols, getAspectRatioForBreakpoint from responsive-breakpoint
```

---

## 6. Layout decisions — use columns

| Question | Use |
|----------|-----|
| Mobile vs tablet vs desktop? | `columns <= 4` (mobile), `columns <= 8` (tablet), `columns >= 12` (desktop) |
| Stack vs side-by-side? | `columns < 8` → stack (e.g. HeroColour, MediaText5050) |
| Carousel visible cards? | `getResponsiveCarouselCols(columns, cardSize)` |
| Media aspect ratio on mobile? | `getAspectRatioForBreakpoint('2:1', columns)` |
| Touch targets? | `columns <= 4` → min 44px |

---

## 7. Current Lab usage (summary)

| Block | Uses |
|-------|------|
| CarouselBlock | useGridBreakpoint (columns, contentMaxDefault), BlockContainer |
| RotatingMediaBlock | useGridBreakpoint (columns), useGridCell('Wide'), BlockContainer('Wide') |
| FullBleedVerticalCarousel | useGridBreakpoint (columns), BlockContainer (Default, XS) |
| MediaText5050Block | useGridBreakpoint (columns), useGridCell('Default') |
| HeroColour | useGridBreakpoint (columns), useGridCell('Wide'), BlockContainer |
| TopNavBlock | useGridBreakpoint (contentMaxDefault, columns) |
| MediaZoomOutOnScroll | useGridBreakpoint (contentMaxDefault, columns) |
| LabCardGridBlock | useGridBreakpoint (columns), useGridCell('Default'), BlockContainer |
| IconGridBlock | useGridBreakpoint (columns), BlockContainer('Wide') |
| GridBlockCard | useGridCell('Wide') |

---

## 8. Potential confusion points

1. **`isDesktop` vs `columns >= 12`**  
   `isDesktop` = viewport ≥ 1440 (affects `contentMax*` px vs 100%).  
   `columns >= 12` = same viewport range for grid. Usually equivalent, but `isDesktop` is about pixel widths, `columns` is about layout.

2. **`contentMaxDefault` on mobile/tablet**  
   Returns `100%`, not a pixel value. Carousel viewport uses it — on mobile the viewport is full width.

3. **`columns < 8` vs `columns <= 8`**  
   Some blocks use `< 8` for stacking (tablet stacks). Others use `<= 8` for tablet.  
   **Recommendation:** Use `columns <= 4` (mobile), `columns <= 8` (tablet), `columns >= 12` (desktop) consistently. For “stack on tablet” use `columns < 12` or `columns <= 8` depending on intent.
