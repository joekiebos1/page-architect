type FeatureItem = {
  title?: string | null
  description?: string | null
}

type FeatureGridBlockProps = {
  title?: string | null
  items?: FeatureItem[] | null
}

export function FeatureGridBlock({ title, items }: FeatureGridBlockProps) {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      {title && (
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
          {title}
        </h2>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
        }}
      >
        {items?.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '1.5rem',
              background: '#f9f9f9',
              borderRadius: 8,
              border: '1px solid #eee',
            }}
          >
            {item.title && (
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
            )}
            {item.description && (
              <p style={{ fontSize: '0.9375rem', color: '#555', lineHeight: 1.5 }}>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
