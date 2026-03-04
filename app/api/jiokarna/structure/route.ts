import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import Anthropic from '@anthropic-ai/sdk'
import type { PageBrief } from '../../../jiokarna/types'

/** Page Architect rules — product page structure principles. Sent when proposing structure. */
const ARCHITECT_RULES = readFileSync(
  join(process.cwd(), 'app', 'jiokarna', 'architect-rules-product-page.md'),
  'utf-8'
)

/** Component library: block purposes and options for content managers. */
const BLOCK_LIBRARY = `
## Component library (use only these blocks)

### hero
Full-width or compact hero. Use for page opening, product launch, campaign hero.
Options: variant (category | product | ghost | fullscreen), productName, headline, subheadline, ctaText, ctaLink, cta2Text, cta2Link, image.

### mediaTextBlock
Media + text. Flexible layout for features, intros, CTAs.
Options:
- template: SideBySide (50/50), HeroOverlay (full bleed), Stacked (image above/below), TextOnly (no media — use for CTA banners)
- size: hero (largest), feature (standard), editorial (compact)
- blockBackground: ghost | minimal | subtle | bold
- blockAccent: primary | secondary | neutral
- imagePosition: left | right (for SideBySide)
- contentWidth: XS | S | M | Default | Wide | edgeToEdge
Slots: eyebrow, title, subhead, body, bulletList (max 6), ctaText, ctaLink, cta2Text, cta2Link, image, video.

### cardGrid
Grid of 2, 3, or 4 cards. Use for feature comparison, benefits, product highlights.
Options: columns (2 | 3 | 4), blockSurface (ghost | minimal | subtle | bold), blockAccent (primary | secondary | neutral).
Per card: cardStyle (image-above | text-on-colour | text-on-image), title, description, image, video, ctaText, ctaLink.
Slots: title, items[].

### carousel
Horizontal carousel of cards. Use for product features, testimonials, media showcases.
Options:
- cardSize: compact (3 per row) | medium (2 per row, 4:5) | large (1 per row, 2:1)
- surface: ghost | minimal | subtle | bold
- blockAccent: primary | secondary | neutral
Slots: title, items[] (each: title, description, image, video, link, ctaText, aspectRatio 4:5 | 8:5 | 2:1).

### proofPoints
Text + icon strip. Use for top-of-page reasons to believe, trust signals.
Options: blockSurface (ghost | minimal | subtle | bold), blockAccent (primary | secondary | neutral).
Slots: title, items[] (title, description, icon).

## Block-level options (apply to blocks that support them)
- blockSurface / surface: ghost (no background) | minimal (neutral grey) | subtle (primary tint) | bold (brand colour)
- blockAccent: primary (brand) | secondary (brand secondary) | neutral (grey)
`

// Product graph derived from site navigation XML.
// Used by Claude to make informed CTA destination decisions.
// Update this as the site grows.
const PRODUCT_GRAPH = `
Mobile ecosystem:
- Prepaid, Postpaid, International (plans)
- Apps & Services: MyJio, JioPC, JioTV+, JioGames, JioPhotos, JioSaavn, JioNews, JioAICloud, JioHome, JioJoin, JioMeet, JioSphere, JioCentrex, JioGate, Home surveillance, JioMart, JioFinance, JioHealth, JioPOSLite, JioTranslate, JioChat, JioMessages, JioSafe
- Devices

Home ecosystem:
- Browse plans, Apps & services, Devices

Business ecosystem:
  Connectivity:
    - Cloud Connect, MPLS VPN, Internet Leased Line, GrowNet Solutions, JioBusiness Solution, Jio True 5G, JioFi, SD-WAN, Managed Wi-Fi
    - Voice & collab: IP Centrex, Jio Meet, SIP Trunk, Toll Free Service
    - Security: DDoS Mitigation, Threat & Vulnerability Management, NetSensor, CyberSOC
    - Mobile: Jio True 5G, JioConnect, JioFi, Jio 4G Service
    - CPaaS (JioCX): JioCX SMS, JioCX Email, JioCX Voice, JioCX RCS, JioCX WhatsApp, JioCX Alerts, JioCX EasyPhone, JioCX EasyListing
    - Jio Ads
  Cloud:
    - AICloud: OCR, Document Translation, Entity Extraction, Language Translation, Speech Translation, Text to Speech, Speech to Text, Sentiment Analysis, Content Summarisation, PII Detection & Redaction, Content Moderation, Transcription, Video Analytics
    - CloudXP: Onboarding, Provisioning, Process Automation, Cost Engineering, Resource Management, AIOps, FinOps (Cost Analysis, Cost Governance, Cost Chargeback, Spot Savings), SecOps (SIEM, VA, RA)
    - MS Azure
  IoT:
    - Energy & Sustainability: Diesel Generator, Smart HVAC, Sub metering, Smart Lighting, Temperature Monitoring, Jio Smart Microinverter
    - Operation Efficiency: Digital Signages, Workforce Management, Fleet management, Asset tracking, Battery management system, Battery swapping solution
    - Connected Vehicle: Fleet management, AvniOS, EV charging, Vehicle telematics, JioXplor, Jio auto apps suite
    - Safety & Security: Jio Secure, Smart Outdoor lighting, Jio Talkie
    - Agriculture: JioKrishi, JioGauSamridhhi
    - Payments Platform: Voice Box, Smart Standee, Jio POS
    - Devices: JioTag Air, JioTag go
    - Industries: Retail, Manufacturing, BFSI, Hospitality, Healthcare, Real Estate/Smart Cities, Automotive Logistics, Energy & utilities
  5G Solutions:
    - Radio Products: 5G Radio Products, 5G Outdoor Small Cell, 5G mmWave Radio, Indoor Small Cell, 5G NR Macro gNodeB, Pico Small Cell
    - Core: 5G on the Edge, Network Slicing, Unified Subscriber Data Management, Converged Policy Control, 5G Charging & Policy Gateway, 5G Analytics Engine
    - Technologies: AI Networks, Edge Computing, MLaaS, 5G Advanced, Network Slicing, 6G
`

const SYSTEM_PROMPT = `You are a senior digital strategist and content architect who specialises in brand websites for companies like Apple, Dyson, and Sonos — brands where storytelling, product beauty, and conversion work together. You help teams turn rough briefs into structured, narrative-led web pages.

You are opinionated. You push back when structure is weak. You ask precise questions. You are never vague. You know that a bad page structure wastes good content.

## Context
You are embedded in a tool used by designers, content editors, and storytellers. They are working on a brand website that combines premium product storytelling, campaigns, and some e-commerce. Think Apple.com in purpose and tone — window shopping, aspiration, clarity, and confidence.

The website uses a defined component library. You must propose page structures using only the components provided.

## Page Architect Rules (MUST FOLLOW)
The following rules define how product pages must be structured. Follow them strictly when proposing structure. Map: narrativeRole = section (setup | engage | resolve), component = block type, blockOptions = decisions, contentSlots.headline = headline (evocative creative direction). The output format below overrides the simplified format in the rules — you must output the full PageBrief JSON.

${ARCHITECT_RULES}

## Product Graph
A product graph is provided in each request representing the ecosystem of existing products on the site, organised by ecosystem (Mobile, Home, Business).

Use it exclusively for CTA destination decisions. When a section's topic connects to an existing product in the graph, that product is the CTA destination — not a generic or invented link.

Rules for using the product graph:
- Only suggest products that exist in the graph — never invent names or URLs
- Choose the most specific match — a sibling product beats a parent category
- Default to same ecosystem — cross-ecosystem links need a strong reason
- Pick the destination most valuable to the user reading that section, not the most convenient for the business
- URLs are placeholders for now — use the product name as the destination reference

## Structure Proposal Output
Output ONLY valid JSON matching this exact shape. No markdown, no explanation.

{
  "meta": {
    "pageName": "string",
    "pageType": "campaign | product-launch | editorial | category | other",
    "slug": "string (URL-friendly)",
    "intent": "string",
    "audience": "string",
    "primaryAction": "string",
    "keyMessage": "string"
  },
  "ia": {
    "proposedPath": "string (e.g. /products/new — placeholder, verify against live site)",
    "parentSection": "string",
    "relatedPages": [{ "title": "string", "path": "string", "relationship": "string" }],
    "existingConflicts": []
  },
  "sections": [
    {
      "order": 1,
      "sectionName": "string",
      "component": "string (use only: hero, mediaTextBlock, cardGrid, carousel, proofPoints)",
      "rationale": "string",
      "narrativeRole": "string",
      "contentSlots": {
        "headline": "string or null",
        "subhead": "string or null",
        "body": "string or null",
        "cta": {
          "label": "string or null",
          "destination": "product name from graph, or placeholder if none exists",
          "rationale": "string — why this destination was chosen"
        },
        "mediaType": "image | video | none | null",
        "items": "array or null"
      },
      "blockOptions": {
        "blockSurface": "ghost | minimal | subtle | bold | null",
        "blockAccent": "primary | secondary | neutral | null",
        "variant": "string or null (block-specific)",
        "size": "hero | feature | editorial | null (mediaTextBlock)",
        "template": "SideBySide | HeroOverlay | Stacked | TextOnly | null (mediaTextBlock)",
        "cardSize": "compact | medium | large | null (carousel)",
        "columns": "2 | 3 | 4 | null (cardGrid)"
      } | null,
      "crossLinks": [{ "label": "string", "destination": "string", "rationale": "string" }] | null,
      "flags": []
    }
  ],
  "launchChecklist": [],
  "status": "draft",
  "createdAt": "ISO timestamp",
  "version": 1
}

## Hard Rules
1. Never propose a component not in the component library provided.
2. Every page starts with hero (or mediaTextBlock for text-only pages).
3. Every page ends with a CTA-focused section (hero with CTAs, or mediaTextBlock with template TextOnly and CTAs) unless there is a very specific reason not to.
4. Page length: 12–25 blocks (minimum 12, maximum 25, target 14–18). Follow architect rules.
5. Never ask about visual design or technical implementation.
6. Always output the structured JSON — no markdown, no explanation, JSON only.
7. If you don't have enough information, say so and ask the specific question that unblocks you.
8. Never make up IA paths — use placeholders like "/[parent]/[slug]".
9. CTA destinations must come from the product graph — never invent a product name that isn't in it.
10. Cross-linking is a CTA decision. A section about music on a glasses page should CTA to the music product, not back to the glasses.
11. For modules with multiple items (cardGrid, carousel, proofPoints, etc.), use crossLinks to suggest per-item destinations from the product graph. Omit crossLinks when not relevant.
12. Use blockOptions to specify blockSurface, blockAccent, variant, size, template, etc. when relevant. Omit blockOptions when defaults are fine.`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
    }

    const { intentData, conversation } = await req.json()
    if (!intentData) {
      return NextResponse.json({ error: 'intentData required' }, { status: 400 })
    }

    const anthropic = new Anthropic({ apiKey })

    const conversationSummary = conversation
      ?.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join('\n\n')

    const userPrompt = `Page intent:
- Name: ${intentData.pageName || 'Untitled'}
- Type: ${intentData.pageType || 'other'}
- Intent: ${intentData.intent || 'Not specified'}
${intentData.briefContent ? `- Brief: ${intentData.briefContent}` : ''}

Interview conversation:
${conversationSummary || 'No conversation yet.'}

Product graph (use for CTA destinations only):
${PRODUCT_GRAPH}

${BLOCK_LIBRARY}

Propose the page structure as JSON. Output ONLY the JSON object, no markdown.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'No text in AI response' }, { status: 500 })
    }

    let parsed: PageBrief
    try {
      const text = textContent.text.trim().replace(/^```json?\s*|\s*```$/g, '')
      parsed = JSON.parse(text) as PageBrief
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from AI', raw: textContent.text }, { status: 500 })
    }

    if (!parsed.meta) parsed.meta = {} as PageBrief['meta']
    if (!parsed.ia) parsed.ia = {} as PageBrief['ia']
    if (!Array.isArray(parsed.sections)) parsed.sections = []
    parsed.createdAt = new Date().toISOString()
    parsed.version = 1
    parsed.status = 'draft'

    return NextResponse.json({ brief: parsed })
  } catch (err) {
    console.error('JioKarna structure error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
