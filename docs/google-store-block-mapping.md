# Google Store Pixel 10 Pro → Block Mapping

Analysis of [store.google.com/gb/product/pixel_10_pro](https://store.google.com/gb/product/pixel_10_pro?hl=en-GB) and mapping to our block library.

## Block inventory

| Block | Purpose |
|-------|---------|
| **HeroBlock** | Product hero, headline, CTAs, hero image |
| **MediaTextBlock** | Text + image (side-by-side, stacked, text-only) |
| **FeatureGridBlock** | Grid of title+description items (no images) |
| **CarouselBlock** | Horizontal scroll of cards (image + title + description + CTA) |
| **FullBleedVerticalCarousel** | Vertical scroll, full-bleed images/videos with overlay text |
| **ProofPointsBlock** | Icon + title + description (no images) |

---

## Google page structure (top to bottom)

### 1. Hero
- Product name: Pixel 10 Pro
- Price, financing
- CTAs: Buy, Save £150
- Size selector: Pro 6.3" / Pro XL 6.8" (horizontal image carousel at top)
- Trade-in promo

**→ HeroBlock** ✓

---

### 2. "Meet the new status pro"
- Duplicate hero-style block with price, CTAs, trade-in CTA

**→ HeroBlock** (or merge with #1)

---

### 3. "Unbelievable camera. Advanced AI."
- 5 bullet points
- CTAs: Compare phones, See it in action, Explore in 3D

**→ MediaTextBlock** (Stacked, centered-media-below) ✓

---

### 4. "New on Pixel 10 Pro"
- **Horizontal carousel** – 7 items, 8:5 aspect ratio
- Items: Nano Banana, describe your idea, Video Boost, Magic Cue, Pro Zoom 100x, Talk with Gemini, Camera Coach

**→ CarouselBlock** (7 cards, aspectRatio: '8:5') ✓

---

### 5. "The power of Gemini, supercharged on Pixel"
- Intro paragraph
- **Horizontal carousel** – 5 cards:
  - Set your creative ideas in motion
  - Talk to Gemini about anything you see
  - Ask Gemini about anything, from anywhere
  - Talk through whatever's on your screen
  - Ask Gemini to multitask across your apps
- Each: title, description, "Read more" link

**→ CarouselBlock** (5 cards) — *currently MediaTextBlock*

---

### 6. "Unlock Google AI Pro for a year on us"
- Promo banner

**→ MediaTextBlock** (TextOnly) ✓

---

### 7. "Gemini on Pixel"
- **Horizontal carousel / tabs** – 2 cards:
  - **Gemini**: 8 bullet features
  - **Google AI Pro**: 6 bullet features
- Each card has title + bullet list

**→ CarouselBlock** (2 cards, description = bullet list) or **FeatureGridBlock** — *currently FeatureGridBlock (2 items)*

---

### 8. "More ways to work wonders with Google AI"
- **Horizontal carousel** – 3 cards:
  - Magic Cue (right info, right when you need it)
  - Real-time call translations (Live Translate)
  - Circle to Search
- Each: title, description, CTA

**→ CarouselBlock** (3 cards) — *currently 3 separate MediaTextBlocks*

---

### 9. "The Pixel 10 Pro camera. Next-level everything."
- Intro paragraph

**→ MediaTextBlock** (Stacked, centered-media-below) ✓

---

### 10. Camera lenses
- **Horizontal carousel** – 4 cards:
  - 48 MP ultrawide
  - 50 MP wide
  - 48 MP telephoto
  - 42 MP front-facing
- Each: title, description, image

**→ CarouselBlock** (4 cards) — *currently 4 separate MediaTextBlocks*

---

### 11. "Super steady videos. Super easy."
- Intro
- **Horizontal carousel** – 4 sub-features:
  - Up to 20x video zoom
  - Low-light videos
  - 100x zoom
  - 50 MP portraits

**→ CarouselBlock** (4 cards) — *currently MediaTextBlock*

---

### 12. "AI for your photo finish"
- **Horizontal carousel** – 4 cards:
  - Camera Coach
  - Magic Editor
  - Auto Best Take
  - Add Me
- Each: title, CTA

**→ CarouselBlock** (4 cards) — *currently 4 separate MediaTextBlocks*

---

### 13. "As resilient as it is brilliant"
- **Horizontal carousel** – 2 product views:
  - On desk
  - In hand
- Plus: design quote, Gorilla Glass, Super Actua display

**→ CarouselBlock** (2 cards) — *currently MediaTextBlock*

---

### 14. "Breakthrough performance"
- Google Tensor G5, battery, Pixelsnap

**→ MediaTextBlock** ✓

---

### 15. "Get that new-phone feeling every few months"
- Pixel Drops

**→ MediaTextBlock** (TextOnly) ✓

---

### 16. "Protects you and your data"
- 4 items: Secure messages, Theft Detection, 7 years updates, Satellite SOS

**→ ProofPointsBlock** ✓

---

### 17. "Which Pixel is right for you?"
- **Comparison table** – 3 columns (Pro, 10, Pro Fold)
- Display, Camera, Performance, Storage

**→ FeatureGridBlock** (simplified) or future TableBlock

---

### 18. "Discover the world of Pixel"
- **Horizontal carousel** – 2 cards:
  - Pixel Watch
  - Pixel Buds
- Each: title, description, Learn more

**→ CarouselBlock** (2 cards) — *not in current seed*

---

### 19. "Add a little extra help"
- **Horizontal carousel** – 4 accessories:
  - Case, Charger, Ring Stand, Charger with Stand

**→ CarouselBlock** (4 cards) ✓

---

### 20. "Why buy on the Google Store?"
- **Horizontal carousel** – 4 cards:
  - Finance your Pixel
  - Preferred Care
  - Free delivery
  - Trade in
- Each: title, Learn more link

**→ CarouselBlock** (4 cards) — *currently ProofPointsBlock*

---

## Summary: CarouselBlock usage

| Google section | Cards | Current mapping | Correct mapping |
|----------------|-------|-----------------|-----------------|
| The power of Gemini | 5 | MediaTextBlock ×2 | **CarouselBlock** |
| Gemini on Pixel | 2 | FeatureGridBlock | CarouselBlock or FeatureGrid |
| More ways to work wonders | 3 | MediaTextBlock ×3 | **CarouselBlock** |
| Camera lenses | 4 | MediaTextBlock ×4 | **CarouselBlock** |
| Super steady videos | 4 | MediaTextBlock ×1 | **CarouselBlock** |
| AI for your photo finish | 4 | MediaTextBlock ×4 | **CarouselBlock** |
| As resilient as it is brilliant | 2 | MediaTextBlock ×1 | **CarouselBlock** |
| Discover the world of Pixel | 2 | — | **CarouselBlock** |
| Add a little extra help | 4 | CarouselBlock | CarouselBlock ✓ |
| Why buy on the Google Store | 4 | ProofPointsBlock | ProofPointsBlock ✓ (icon-based) |

**Total horizontal carousels on Google page: 10**  
**Current seed uses CarouselBlock: 1 time**
