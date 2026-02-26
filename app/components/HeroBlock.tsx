type HeroBlockProps = {
  headline?: string | null
  subheadline?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  image?: string | null
}

export function HeroBlock({ headline, subheadline, ctaText, ctaLink, image }: HeroBlockProps) {
  return (
    <section
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image}) center/cover` : '#f5f5f5',
        color: image ? '#fff' : '#111',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {headline && (
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            {headline}
          </h1>
        )}
        {subheadline && (
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {subheadline}
          </p>
        )}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: image ? '#fff' : '#111',
              color: image ? '#111' : '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              borderRadius: 6,
            }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  )
}
