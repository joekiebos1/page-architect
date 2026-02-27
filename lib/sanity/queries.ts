export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  sections[]{
    _type,
    _key,
    _type == "hero" => {
      productName,
      headline,
      subheadline,
      ctaText,
      ctaLink,
      cta2Text,
      cta2Link,
      "image": image.asset->url
    },
    _type == "featureGrid" => {
      title,
      items[]{
        title,
        description
      }
    },
    _type == "textImageBlock" => {
      title,
      body,
      ctaText,
      ctaLink,
      "image": image.asset->url,
      template,
      imagePosition,
      overlayAlignment,
      stackImagePosition,
      stackAlignment,
      imageAspectRatio
    },
    _type == "fullBleedVerticalCarousel" => {
      items[]{
        title,
        description,
        "image": image.asset->url,
        "video": video.asset->url
      }
    },
      _type == "carousel" => {
        title,
        items[]{
          title,
          description,
          "image": image.asset->url,
          link,
          ctaText,
          aspectRatio
        }
      },
      _type == "proofPoints" => {
        title,
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
