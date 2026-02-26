type TextImageBlockProps = {
  title?: string | null
  body?: string | null
  image?: string | null
  imagePosition?: 'left' | 'right' | null
}

export function TextImageBlock({ title, body, image, imagePosition }: TextImageBlockProps) {
  const isImageLeft = imagePosition === 'left'

  return (
    <section style={{ padding: '4rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: image ? (isImageLeft ? '1fr 1fr' : '1fr 1fr') : '1fr',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {image && isImageLeft && (
          <div style={{ order: 1 }}>
            <img
              src={image}
              alt={title || ''}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
          </div>
        )}
        <div style={{ order: isImageLeft ? 2 : 1 }}>
          {title && (
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              {title}
            </h2>
          )}
          {body && (
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#444' }}>{body}</p>
          )}
        </div>
        {image && !isImageLeft && (
          <div style={{ order: 2 }}>
            <img
              src={image}
              alt={title || ''}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
