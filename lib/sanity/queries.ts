export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  sections[]{
    _type,
    _key,
    _type == "hero" => {
      headline,
      subheadline,
      ctaText,
      ctaLink,
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
      "image": image.asset->url,
      imagePosition
    }
  }
}`

export const allPagesQuery = `*[_type == "page"]{
  _id,
  title,
  "slug": slug.current
}`
