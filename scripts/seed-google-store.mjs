#!/usr/bin/env node
/**
 * Seed Sanity with Google Store–style Pixel 10 Pro product page.
 * Mapping follows docs/google-store-block-mapping.md.
 * Uses external image/video URLs from store.google.com/gb/product/pixel_10_pro (no upload).
 * Run: node --env-file=.env scripts/seed-google-store.mjs
 */

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || projectId === 'your-project-id') {
  console.error('Set SANITY_STUDIO_PROJECT_ID in .env')
  process.exit(1)
}
if (!token) {
  console.error('Set SANITY_API_TOKEN in .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Image URLs extracted from store.google.com/gb/product/pixel_10_pro (document order from HTML)
// Base URLs - add =s1200 for 1200px width
const B = (id) => `https://lh3.googleusercontent.com/${id}=s1200`
// UK page – verified via scripts/verify-google-store-uk.mjs. Omit image where Google has none.
const IMG = {
  hero: B('9EB5TlJd0HySceMnILIKLuw6-p1ttfyRo1o3poX6yU1YUuUvYXmMU8a0_AM2ccFQoOaq7t8ud5ildnBt09MIQAaw3sHaFwdTAOax'),
  // Pro camera system (4 items – have images)
  lens1: B('Tlxoza3QEmiGvGFtzoE0M-NWnDbumssS4gCu6zJbzRaZXG-m1mN3cfc4v8A46SohY28bISvNNoeS1ZRG4YbH4bxMIHTMTqttcQ'),
  lens2: B('2zq_PLuDxs1tIrmC3d2J7yySZ2rYzxkJVsY_dZkbu9OVAaA5l8V34WtEZW_SgXDTSDFnCpbbm3pvVJlCPacIZessW8q1I47-bxg'),
  lens3: B('Kvwj6FwngXLfJsErrhIIwXl5nVDg_7DUtVDHS9v7RUPmrfjT1b8nrHLT7SsmYzGPjdqRovh2kNsFbDb_bZLV3ps-SmMm0zni4w'),
  lens4: B('RjDMbGF4nUuxUIkdz8Fb9URPNn43UNPsDhrvvt73ew6dQVP67RfoZ_HkZ083lI6Q86nPlC1DFeX3mBZEDdZgb8uyJ0-SE3bilD0'),
  // Super steady v4 (50 MP portraits – has image)
  v4portrait: B('31cx6g1WWOvcoNciQCszRU0IbH9LySL0-qZNzk7y_y3H4KsC914EjpC8Zl5B4_iVkhGQkpriuJ10CNT--lK_5zcq37AaFJh1sHIy'),
  // As resilient (2 items – have images)
  durable1: B('aALYJbyEjJQTmt38agAk2TYZN5hyDtfnc5JzNNg3pPP4ePiJoYEzcYbIZ6r7ThmSN650GmrOjWMWb6TH6BLgWWUnycU0Fgbk0g'),
  durable2: B('aALYJbyEjJQTmt38agAk2TYZN5hyDtfnc5JzNNg3pPP4ePiJoYEzcYbIZ6r7ThmSN650GmrOjWMWb6TH6BLgWWUnycU0Fgbk0g'),
  // Discover (2 items – have images)
  discover1: B('fBs8pTMRDjSunjW-OJun-lXL18KycdE7fWBix0i-FYslchU7ciTnn8I82S7Z7qQL3vootRqNlcTsNWSfrjIZDFqgnDA9Hz3gPIU'),
  discover2: B('oL-L2XDFijyBMPZbKCmzmOeQ_BvxXACUxIN2VV_HqU0Fu8dAZqDKQ0tpg8DaP5GRE_GsOqWlFPfdO76cb--CqoDjhnU-82tDEA'),
  // Add a little extra help (acc1, acc3, acc4 have images; acc2 has video only)
  acc1: B('kPsPgeWuYT4F85I84iBsB0bzginxmjrYPXH0mdnOpbYD3YKmslvRtAwB0ZrmsZNJc1g9zoSutDGhEcQ74GRpEXxYmIDpxUqnGIc'),
  acc3: B('uB2uKeK5d2u-1iCvtl5-GNOACPOWo_Wh7qP08r1qbWrdjaN8Uiq54W3GTJy7delqrsezBHFjo1SOnSI_w4cHJ_NvECcNq1kFsw'),
  acc4: B('2xY3022h0GrBirC5F93RwVfS8Fn2iYVUfmFsO0GZHYeQ_cbV_5Cb43Mr7QnCcewRCjHEK4qB-qRzOsehFBaV1o-VZ6rL2eZCXQ'),
  // MediaTextBlocks (hero, camera intro, tensor – UK page has these)
  camera: B('1kI1np67VLpqtS2EaR8se56N3gFf_XTrra8PDdQBlZsaJMxyKMWIX931uezRMAUEfq77vU5qhpYFqM-pp7FDRSYVpeArkBYAO6tS'),
  tensor: B('4K04JiFEQI7XjxJi43E5oUuns12OFz7kRtXkbDdcPaiXsADwUKNIQIyyZXVvLigVMbFK1GzNpJysYGK8Tx7BCVjlFac-V-YGwAI'),
}
// Video URLs from UK page – verified via scripts/verify-carousel-videos.mjs (closest video to each title in HTML)
const V = (id) => `https://storage.googleapis.com/mannequin/blobs/${id}.mp4`
const VIDEO = {
  // New on Pixel 10 Pro (7 items)
  n1: V('2163532b-3e1f-4546-84f8-616b5c522551'), // Nano Banana
  n2: V('aac37598-7ca8-4ef6-8ad4-f26da4d0c54a'), // Simply describe your idea
  n3: V('d5a36d23-74be-45af-8937-f14ad449b169'), // Video Boost
  n4: V('86962f0c-4ffc-495e-bb8f-0d514b164e38'), // Magic Cue
  n5: V('3e1678a1-6316-44a8-9c58-c72b6d9faf2f'), // Pro Zoom
  n6: V('97f0628e-3948-4ed9-8c6f-a522abae9486'), // Talk with Gemini
  n7: V('3df03642-e505-4e1c-97aa-7ba5d9e4d81f'), // Camera Coach
  // What Gemini can do (5 items)
  g1: V('5a0c76b4-88b2-42ce-8e9a-5152889742a8'), // Set your creative ideas in motion
  g2: V('30fbaad9-171a-4c46-8f93-370440404e93'), // Talk to Gemini about anything you see
  g3: V('734a66bf-33aa-4146-9929-846d023f7702'), // Ask Gemini about anything
  g4: null, // Talk through whatever's on your screen – no video
  g5: V('cc15d6c6-ddca-4663-8095-6ab8079fbbb2'), // Ask Gemini to multitask
  // More ways to work wonders (3 items)
  w1: V('ac7f95d8-f61a-405b-8773-7f80acb63265'), // Magic Cue
  w2: V('68f12f2c-2c4f-49d9-9e6b-5a9b5181c7d9'), // Real-time call translations
  w3: V('c7aff745-d1a8-4cdb-bcb3-7088d2764c94'), // Circle to Search
  // Super steady videos (4 items)
  v1: V('2d024def-9b6f-4da5-8f29-24fec09f572a'), // 20x video zoom
  v2: V('683775d5-80e4-4b85-be9d-a1020fe5b060'), // Low-light videos
  v3: null, // 100x zoom – no video
  v4: null, // 50 MP portraits – no video
  // AI for your photo finish (4 items)
  a1: V('c29cbd57-da64-459f-aa3b-30b2d0b05754'), // Camera Coach
  a2: V('7e3da29f-e622-45fa-a3ae-8a8e62160c8d'), // Magic Editor
  a3: V('27727425-5d5c-491f-807a-2e12ca89d381'), // Auto Best Take
  a4: V('cc73f977-b98f-48c2-ae71-ed89c2aef9bd'), // Add Me
  // Add a little extra help (4 items)
  acc2: V('c4392ce8-3b3b-4907-ab6c-d758fffbc410'), // Pixelsnap Charger
  // MediaTextBlock – Pixel 10 Pro camera intro (exploded view of interior hardware)
  cameraIntro: 'https://storage.googleapis.com/mannequin/blobs/d7262233-7794-43c2-9ad7-83d77dd65104.mov',
}
async function seed() {
  console.log('Seeding Google Store product page (external URLs, no upload)...')

  const sections = [
    // 1. HeroBlock – product hero (matches Google)
    {
      _type: 'hero',
      _key: 'hero',
      variant: 'product',
      spacing: 'medium',
      productName: 'Pixel 10 Pro',
      headline: 'Meet the new status pro.',
      subheadline: 'From £999 or £27.75/month with 36-month financing',
      ctaText: 'Buy',
      ctaLink: 'https://store.google.com/gb/config/pixel_10_pro?hl=en-GB',
      cta2Text: 'Get estimate for trade-in',
      cta2Link: 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB',
      imageUrl: IMG.hero,
    },
    // 2. ProofPointsBlock – Unbelievable camera. Advanced AI. (icon + title + description per item)
    {
      _type: 'proofPoints',
      _key: 'pp-camera-ai',
      spacing: 'medium',
      title: 'Unbelievable camera. Advanced AI.',
      titleLevel: 'h2',
      items: [
        { _key: 'c1', title: 'Our highest quality photos and videos.', description: 'The most advanced AI on Pixel.', icon: 'IcStar' },
        { _key: 'c2', title: 'Next-gen chip for peak AI performance.', description: '', icon: 'IcThunderstorm' },
        { _key: 'c3', title: 'Impeccably designed in two sizes.', description: '', icon: 'IcCheckboxOn' },
        { _key: 'c4', title: '7 years of new features and updates.', description: '', icon: 'IcSecured' },
      ],
    },
    // 3. CarouselBlock – New on Pixel 10 Pro (large 8-col cards, 8:5)
    {
      _type: 'carousel',
      _key: 'car-new',
      spacing: 'large',
      title: 'New on Pixel 10 Pro.',
      titleLevel: 'h2',
      cardSize: 'large',
      items: [
        { _type: 'cardItem', _key: 'n1', title: 'With Nano Banana in Gemini, take your photos even further', description: 'Imagine yourself in different scenes, combine creative elements, make specific edits and more. It\'s easier than ever to bring your ideas to life.', videoUrl: VIDEO.n1, aspectRatio: '8:5' },
        { _type: 'cardItem', _key: 'n2', title: 'Simply describe your idea', description: 'Pixel will create a high-quality short video with sound for you.', videoUrl: VIDEO.n2, aspectRatio: '8:5' },
        { _type: 'cardItem', _key: 'n3', title: 'Make high-motion scenes feel cinematic', description: 'Improved stabilisation powered by Video Boost.', videoUrl: VIDEO.n3, aspectRatio: '8:5' },
        { _type: 'cardItem', _key: 'n4', title: 'Magic Cue', description: 'All-new AI for Pixel that gives you the info you need, right as you need it.', videoUrl: VIDEO.n4, aspectRatio: '8:5' },
        { _type: 'cardItem', _key: 'n5', title: 'Pro Zoom with up to 100x zoom range', description: 'The longest, sharpest zoom of any Pixel.', videoUrl: VIDEO.n5, aspectRatio: '8:5' },
        { _type: 'cardItem', _key: 'n6', title: 'Talk with Gemini about anything you see', description: 'Using your camera in Gemini Live.', videoUrl: VIDEO.n6, aspectRatio: '8:5' },
        { _type: 'cardItem', _key: 'n7', title: 'Meet Camera Coach', description: 'Uses Gemini models to read the scene and help you set up the best pic.', videoUrl: VIDEO.n7, aspectRatio: '8:5' },
      ],
    },
    // 4. MediaTextBlock – The power of Gemini intro
    {
      _type: 'mediaTextBlock',
      _key: 'mt-intro-gemini',
      spacing: 'medium',
      contentWidth: 'default',
      size: 'feature',
      template: 'TextOnly',
      title: 'The power of Gemini, supercharged on Pixel.',
      body: "Google's most capable AI is built into the most powerful Pixel yet, enabled by the new Google Tensor G5 chip custom-designed for the latest Gemini innovations.",
    },
    // 5. CarouselBlock – Gemini features (alternating media-only → text-only)
    {
      _type: 'carousel',
      _key: 'car-gemini',
      spacing: 'large',
      title: 'What Gemini can do',
      titleLevel: 'h2',
      items: [
        // 1. Media only (video)
        { _type: 'cardItem', _key: 'g1-m', videoUrl: VIDEO.g1, aspectRatio: '4:5' },
        // 2. Text only
        { _type: 'cardItem', _key: 'g1-t', title: 'Set your creative ideas in motion', description: 'Create a high-quality short video, complete with natural-sounding audio, simply by describing your idea.', aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/articles/video-generation-on-gemini/', ctaText: 'Read more' },
        // 3. Media only
        { _type: 'cardItem', _key: 'g2-m', videoUrl: VIDEO.g2, aspectRatio: '4:5' },
        // 4. Text only
        { _type: 'cardItem', _key: 'g2-t', title: 'Talk to Gemini about anything you see', description: 'Share your camera in Gemini Live to have a back-and-forth chat about what\'s around you.', aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/gemini-ai-assistant/', ctaText: 'Read more' },
        // 5. Media only
        { _type: 'cardItem', _key: 'g3-m', videoUrl: VIDEO.g3, aspectRatio: '4:5' },
        // 6. Text only
        { _type: 'cardItem', _key: 'g3-t', title: 'Ask Gemini about anything, from anywhere', description: 'Go Live with Gemini to have a natural, free-flowing conversation. Just start talking to get info, brainstorm ideas and more.', aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/gemini-ai-assistant/', ctaText: 'Read more' },
        // 7. Media only (g4 has no video; use g5)
        { _type: 'cardItem', _key: 'g5-m', videoUrl: VIDEO.g5, aspectRatio: '4:5' },
        // 8. Text only
        { _type: 'cardItem', _key: 'g4-t', title: 'Talk through whatever\'s on your screen', description: 'Curious about something you\'re browsing? Just ask Gemini for more details.', aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/gemini-ai-assistant/', ctaText: 'Read more' },
        // 9. Text only (g5 – g4 has no video, so one extra text card)
        { _type: 'cardItem', _key: 'g5-t', title: 'Ask Gemini to multitask across your apps', description: 'Save time by asking Gemini to find info and get things done for you - like checking your calendar, then texting a reminder.', aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/articles/gemini-app-extensions/', ctaText: 'Read more' },
      ],
    },
    // 6. MediaTextBlock – Unlock Google AI Pro banner
    {
      _type: 'mediaTextBlock',
      _key: 'mt-ai-pro',
      spacing: 'medium',
      contentWidth: 'default',
      size: 'feature',
      template: 'TextOnly',
      title: 'Unlock Google AI Pro for a year on us (£227 value).',
      body: 'Boost your productivity and creativity with more access to new and powerful features in the Gemini app plus 2 TB of cloud storage.',
      cta2Text: 'Learn more',
      cta2Link: 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB',
    },
    // 7. CarouselBlock – Gemini on Pixel (2 cards: Gemini + Google AI Pro)
    {
      _type: 'carousel',
      _key: 'car-gemini-plan',
      spacing: 'large',
      title: 'Gemini on Pixel.',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'gp1', title: 'Gemini', description: 'Get a built-in AI assistant that helps you write, plan, learn and get things done. Share your camera or screen in Gemini Live. Go live with Gemini whenever it\'s easier to just talk. Brainstorm ideas, write stories and plan big projects.', aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/gemini-ai-assistant/', ctaText: 'Learn more' },
        { _type: 'cardItem', _key: 'gp2', title: 'Google AI Pro', description: 'Unlock more access to our powerful features and most capable AI models. Deep Research. Create 8-second videos with Veo 3.1. NotebookLM. Flow. 2 TB of cloud storage.', aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixel_10_pro?hl=en-GB', ctaText: 'Learn more' },
      ],
    },
    // 8. CarouselBlock – More ways to work wonders (3 cards, 2:1)
    {
      _type: 'carousel',
      _key: 'car-wonders',
      spacing: 'large',
      title: 'More ways to work wonders with Google AI.',
      titleLevel: 'h2',
      cardSize: 'large',
      items: [
        { _type: 'cardItem', _key: 'w1', title: 'The right info, right when you need it.', description: 'Introducing Magic Cue, a suite of new AI-powered capabilities for Pixel that proactively suggests helpful information, right as you need it. A friend texts asking the location for dinner? Magic Cue can surface the answer ready to share with a tap.', videoUrl: VIDEO.w1, aspectRatio: '2:1', link: 'https://store.google.com/intl/en_uk/ideas/articles/magic-cue/', ctaText: 'Explore Magic Cue' },
        { _type: 'cardItem', _key: 'w2', title: 'Real-time call translations, in their natural voice.', description: 'Live Translate can now translate what each caller says using the sound of their voice - so phone conversations in different languages feel more authentic.', videoUrl: VIDEO.w2, aspectRatio: '2:1' },
        { _type: 'cardItem', _key: 'w3', title: 'Searching has come full circle.', description: 'Just use your finger to draw a circle around what you want more info about - like an image, text or video. Pixel finds it fast, straight from the app you\'re in.', videoUrl: VIDEO.w3, aspectRatio: '2:1', link: 'https://store.google.com/intl/en_uk/ideas/articles/circle-to-search/', ctaText: 'Explore Circle to Search' },
      ],
    },
    // 9. MediaTextBlock – Pixel 10 Pro camera intro (edge-to-edge video)
    {
      _type: 'mediaTextBlock',
      _key: 'mt-camera-intro',
      spacing: 'large',
      size: 'feature',
      contentWidth: 'edgeToEdge',
      title: 'The Pixel 10 Pro camera. Next-level everything.',
      body: "Pixel's pro camera makes everything look cinematic by default, even in low light. Bring out incredible details with 50 MP portraits, our most advanced AI for 100x zoom, and steadier videos in up to 8K.",
      template: 'Stacked',
      stackImagePosition: 'top',
      stackAlignment: 'center',
      imageAspectRatio: '16:9',
      imageUrl: IMG.camera,
      videoUrl: VIDEO.cameraIntro,
    },
    // 10. CarouselBlock – Camera lenses (4 cards)
    {
      _type: 'carousel',
      _key: 'car-lenses',
      spacing: 'large',
      title: 'Pro camera system',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'l1', title: '48 MP ultrawide', description: 'Play up any angle like a pro. Go into greater detail with super-sharp Macro Focus, or capture sweeping, wide-angle landscape shots.', imageUrl: IMG.lens1, aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'l2', title: '50 MP wide', description: 'Our best camera yet. Capture beautiful portraits and vivid low-light photos and videos with its ƒ/1.68 aperture.', imageUrl: IMG.lens2, aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'l3', title: '48 MP telephoto', description: "Pixel 10 Pro's upgraded 5x telephoto lens has our longest and best zoom quality ever. Up to 100x Pro Res Zoom.", imageUrl: IMG.lens3, aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'l4', title: '42 MP front-facing', description: "Pixel's widest selfie camera with autofocus features a 103° field of view. Sharper selfies from any angle.", imageUrl: IMG.lens4, aspectRatio: '4:5' },
      ],
    },
    // 11. CarouselBlock – Super steady videos (4 sub-features)
    {
      _type: 'carousel',
      _key: 'car-video',
      spacing: 'large',
      title: 'Super steady videos. Super easy.',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'v1', title: 'Up to 20x the video zoom power', description: 'Zoom in up to 20x with Super Res Zoom Video, enabled by a powerful telephoto lens and advanced processing.', videoUrl: VIDEO.v1, aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'v2', title: 'Low-light videos get a glow-up', description: 'Night Sight Video brings out the best, highest-quality 8K recordings on a Pixel.', videoUrl: VIDEO.v2, aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'v3', title: '100x. Pixel\'s longest zoom ever', description: 'Zoom like never before with up to 100x Pro Zoom. Powered by an upgraded telephoto camera and all-new AI imaging.', aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'v4', title: '50 MP portraits from a smartphone', description: "Pixel's best portrait quality to date. Get high-res images worthy of professional editing and printing right from your phone.", imageUrl: IMG.v4portrait, aspectRatio: '4:5' },
      ],
    },
    // 12. CarouselBlock – AI for your photo finish (4 cards)
    {
      _type: 'carousel',
      _key: 'car-ai-photo',
      spacing: 'large',
      title: 'AI for your photo finish.',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'a1', title: 'Snap your best pics with coaching from Gemini.',
          description: 'Camera Coach uses Gemini models to read the scene, offer you suggestions and help you find the best angle and lighting.', videoUrl: VIDEO.a1, aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/articles/camera-coach/', ctaText: 'Explore Camera Coach' },
        { _type: 'cardItem', _key: 'a2', title: 'Talk about easy photo editing.', description: 'Making studio-quality edits is effortless with Google Photos. Adjust the focus, change the background, and move objects with a few taps.', videoUrl: VIDEO.a2, aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/articles/magic-editor/', ctaText: 'Explore Magic Editor' },
        { _type: 'cardItem', _key: 'a3', title: 'Group pics the whole group loves.', description: 'With Pixel, it\'s a snap to take shareable group pics. Pixel can automatically find and combine similar photos into one where everyone looks their best.', videoUrl: VIDEO.a3, aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/articles/pixel-best-take', ctaText: 'Explore Auto Best Take' },
        { _type: 'cardItem', _key: 'a4', title: 'Take the picture. And be in it, too.', description: 'With the updated Add Me, it\'s even easier to make sure no one\'s left out of the photo. Add the photographer to bigger groups.', videoUrl: VIDEO.a4, aspectRatio: '4:5', link: 'https://store.google.com/intl/en_uk/ideas/articles/pixel-add-me/', ctaText: 'Explore Add Me' },
      ],
    },
    // 13. CarouselBlock – As resilient (2 product views: On desk / In hand)
    {
      _type: 'carousel',
      _key: 'car-durable',
      spacing: 'large',
      title: 'As resilient as it is brilliant.',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'd1', title: 'On desk', description: 'Luxuriously refined with a silky matte glass back, polished frame and beautiful diamond-cut camera bar.', imageUrl: IMG.durable1, aspectRatio: '4:5' },
        { _type: 'cardItem', _key: 'd2', title: 'In hand', description: 'Spacecraft-grade aluminium and Corning® Gorilla® Glass Victus® 2 for all-around scratch and drop resistance.', imageUrl: IMG.durable2, aspectRatio: '4:5' },
      ],
    },
    // 14. MediaTextBlock – Breakthrough performance
    {
      _type: 'mediaTextBlock',
      _key: 'mt-tensor',
      spacing: 'large',
      contentWidth: 'default',
      size: 'feature',
      title: 'Breakthrough performance.',
      subhead: 'Next-gen chip for the ultimate AI experience on a phone.',
      body: "The new Google Tensor G5 chip is Pixel's biggest leap in performance yet. It's custom built with a TPU that's up to 60% more powerful and a CPU that's 34% faster on average for Google's most-advanced AI and performance.",
      cta2Text: 'Explore Google Tensor',
      cta2Link: 'https://store.google.com/intl/en_uk/ideas/articles/google-tensor-pixel-smartphone/',
      template: 'SideBySide',
      imagePosition: 'right',
      imageAspectRatio: '4:3',
      imageUrl: IMG.tensor,
    },
    // 15. MediaTextBlock – Pixel Drops
    {
      _type: 'mediaTextBlock',
      _key: 'mt-drops',
      spacing: 'medium',
      contentWidth: 'default',
      size: 'feature',
      template: 'TextOnly',
      title: 'Get that new-phone feeling every few months.',
      subhead: "Unlock what's next for your phone with Pixel Drops.",
      body: 'Get regular automatic updates that amp up your Pixel\'s helpfulness by bringing you new and improved features for the camera, Gemini and more.',
      cta2Text: 'Explore Pixel Drops',
      cta2Link: 'https://store.google.com/gb/magazine/pixel_drop?hl=en-GB',
    },
    // 16. ProofPointsBlock – Protects you and your data
    {
      _type: 'proofPoints',
      _key: 'pp1',
      spacing: 'large',
      title: 'Protects you and your data.',
      titleLevel: 'h2',
      items: [
        { _key: 's1', title: 'Pixel helps secure your messages', description: 'Pixel helps protect you against spam, scams, and phishing in messages by letting you know if a text seems sketchy.', icon: 'IcLock' },
        { _key: 's2', title: 'Automatically locks if it\'s lost or stolen', description: 'If a theft is detected, Theft Detection automatically locks your phone to give you peace of mind that your sensitive information stays private.', icon: 'IcProtection' },
        { _key: 's3', title: 'Security and OS updates for 7 years', description: 'Pixel has extra layers of protection to keep your info safe. And it gets regular updates for 7 years to help keep your phone secure over time.', icon: 'IcSecured' },
        { _key: 's4', title: 'Going off the grid? Pixel has you covered', description: 'Your Pixel comes with a two year trial of Satellite SOS. Connect to emergency services via satellite to get help and share your location.', icon: 'IcCheckboxOn' },
      ],
    },
    // 17. CarouselBlock – Discover the world of Pixel (2 cards: Watch, Buds)
    {
      _type: 'carousel',
      _key: 'car-discover',
      spacing: 'large',
      title: 'Discover the world of Pixel.',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'dc1', title: 'Unlock your full potential with the Pixel Watch', description: 'Control your camera, unlock your phone (or find it) and even know who\'s at your door when you pair your phone with the Pixel Watch 4.', imageUrl: IMG.discover1, aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixel_watch_4?hl=en-GB', ctaText: 'Learn more' },
        { _type: 'cardItem', _key: 'dc2', title: 'Connect with Pixel Buds for better clarity and focus', description: 'With Fast Pair, Pixel Buds instantly connect to your phone for crystal clear calls, dynamic spatial audio and hands-free help with Gemini.', imageUrl: IMG.discover2, aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixel_buds_pro_2?hl=en-GB', ctaText: 'Learn more' },
      ],
    },
    // 18. CarouselBlock – Add a little extra help (4 accessories)
    {
      _type: 'carousel',
      _key: 'car-accessories',
      spacing: 'large',
      title: 'Add a little extra help.',
      titleLevel: 'h2',
      items: [
        { _type: 'cardItem', _key: 'acc1', title: 'Pixel 10, Pro, Pro XL Case', description: 'Protection that meets your style.', imageUrl: IMG.acc1, aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixel_10_pro_phone_case?hl=en-GB', ctaText: 'Learn more' },
        { _type: 'cardItem', _key: 'acc2', title: 'Pixelsnap Charger', description: 'Fast wireless charging.', videoUrl: VIDEO.acc2, aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixelsnap_charger?hl=en-GB', ctaText: 'Learn more' },
        { _type: 'cardItem', _key: 'acc3', title: 'Pixelsnap Ring Stand', description: 'Hold your phone anywhere.', imageUrl: IMG.acc3, aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixelsnap_ring_stand?hl=en-GB', ctaText: 'Learn more' },
        { _type: 'cardItem', _key: 'acc4', title: 'Pixelsnap Charger with Stand', description: 'Charge and stand in one.', imageUrl: IMG.acc4, aspectRatio: '4:5', link: 'https://store.google.com/gb/product/pixelsnap_charger_stand?hl=en-GB', ctaText: 'Learn more' },
      ],
    },
    // 19. ProofPointsBlock – Why buy on the Google Store (icon-based, not image carousel)
    {
      _type: 'proofPoints',
      _key: 'pp2',
      spacing: 'large',
      title: 'Why buy on the Google Store?',
      titleLevel: 'h2',
      items: [
        { _key: 'wb1', title: 'Finance your Pixel', description: '0% APR for 24 months. Pay over time with no interest.', icon: 'IcAddCircle' },
        { _key: 'wb2', title: 'Preferred Care for added protection', description: 'Extended warranty and accidental damage protection.', icon: 'IcProtection' },
        { _key: 'wb3', title: 'Free of charge delivery and returns', description: 'Fast, free shipping on all orders.', icon: 'IcRocket' },
        { _key: 'wb4', title: 'Trade in your old phone for money back', description: 'Get credit for your old phone. Apply at checkout.', icon: 'IcCelebration' },
      ],
    },
  ]

  const pixelPage = {
    _type: 'page',
    _id: 'page-pixel-10-pro',
    title: 'Pixel 10 Pro',
    slug: { _type: 'slug', current: 'pixel-10-pro' },
    sections,
  }

  await client.createOrReplace(pixelPage)
  console.log('Created page: Pixel 10 Pro (slug: pixel-10-pro)')
  console.log('Visit /pixel-10-pro to see the product page.')
  console.log('CarouselBlock used 9 times (matches Google page horizontal carousels).')
  console.log('')
  console.log('Verification: node scripts/verify-google-store-uk.mjs')
  console.log('(Requires: curl -sL https://store.google.com/gb/product/pixel_10_pro?hl=en-GB -o /tmp/pixel-uk.html)')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
