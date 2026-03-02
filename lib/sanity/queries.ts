export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  sections[]{
    _type,
    _key,
    _type == "hero" => {
      variant,
      spacing,
      productName,
      headline,
      subheadline,
      ctaText,
      ctaLink,
      cta2Text,
      cta2Link,
      "image": coalesce(imageUrl, image.asset->url)
    },
    _type == "featureGrid" => {
      spacing,
      title,
      titleLevel,
      items[]{
        title,
        description
      }
    },
      _type == "mediaTextBlock" => {
      spacing,
      eyebrow,
      subhead,
      title,
      titleLevel,
      body,
      bulletList,
      ctaText,
      ctaLink,
      cta2Text,
      cta2Link,
      "image": coalesce(imageUrl, image.asset->url),
      "video": coalesce(videoUrl, video.asset->url),
      size,
      template,
      contentWidth,
      imagePosition,
      align,
      overlayAlignment,
      stackImagePosition,
      stackAlignment,
      imageAspectRatio
    },
    _type == "fullBleedVerticalCarousel" => {
      spacing,
      items[]{
        title,
        description,
        "image": coalesce(imageUrl, image.asset->url),
        "video": coalesce(videoUrl, video.asset->url)
      }
    },
    _type == "carousel" => {
      spacing,
      title,
      titleLevel,
      cardSize,
      items[]{
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
      spacing,
      title,
        titleLevel,
        items[]{
          title,
          description,
          icon
        }
      }
    }
  }`

export const allPagesQuery = `*[_type == "page"]{
  _id,
  title,
  "slug": slug.current
}`
