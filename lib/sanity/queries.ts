/** Canonical page sections projection. Use for both slug and id queries. */
const PAGE_SECTIONS_PROJECTION = `{
  _type,
  _key,
  _type == "hero" => {
    variant,
    spacingTop,
    spacingBottom,
    spacing,
    productName,
    headline,
    subheadline,
    ctaText,
    ctaLink,
    cta2Text,
    cta2Link,
    "image": coalesce(imageUrl, image.asset->url),
    videoUrl
  },
  _type == "cardGrid" => {
    spacingTop,
    spacingBottom,
    spacing,
    columns,
    title,
    surface,
    blockAccent,
    items[]{
      cardStyle,
      title,
      description,
      "image": coalesce(imageUrl, image.asset->url),
      "video": coalesce(videoUrl, video.asset->url),
      ctaText,
      ctaLink,
      surface
    }
  },
  _type == "mediaTextBlock" => {
    spacingTop,
    spacingBottom,
    spacing,
    eyebrow,
    subhead,
    title,
    body,
    bulletList,
    ctaText,
    ctaLink,
    cta2Text,
    cta2Link,
    "image": coalesce(imageUrl, image.asset->url),
    "video": coalesce(videoUrl, video.asset->url),
    template,
    imagePosition,
    overlayAlignment,
    stackImagePosition,
    stackAlignment,
    mediaSize,
    stackedMediaWidth,
    imageAspectRatio,
    blockBackground,
    blockAccent
  },
  _type == "carousel" => {
    spacingTop,
    spacingBottom,
    spacing,
    title,
    cardSize,
    surface,
    blockAccent,
    items[]{
      cardType,
      title,
      description,
      "image": coalesce(imageUrl, image.asset->url),
      "video": coalesce(videoUrl, video.asset->url),
      link,
      ctaText,
      aspectRatio
    }
  },
  _type == "proofPoints" => {
    spacingTop,
    spacingBottom,
    spacing,
    title,
    surface,
    blockAccent,
    items[]{
      title,
      description,
      icon
    }
  }
}`

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  sections[]${PAGE_SECTIONS_PROJECTION}
}`

export const pageByIdQuery = `*[_type == "page" && _id == $id][0]{
  _id,
  title,
  "slug": slug.current,
  sections[]${PAGE_SECTIONS_PROJECTION}
}`

export const allPagesQuery = `*[_type == "page"]{
  _id,
  title,
  "slug": slug.current
}`

export const labPageQuery = `*[_type == "labPage" && _id == "labPage"][0]{
  _id,
  title,
  description,
  hero{
    productName,
    headline,
    subheadline,
    ctaText,
    ctaLink,
    cta2Text,
    cta2Link,
    "image": coalesce(imageUrl, image.asset->url),
    imagePosition
  }
}`
