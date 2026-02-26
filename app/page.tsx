import Link from 'next/link'
import { client } from '../lib/sanity/client'
import { allPagesQuery } from '../lib/sanity/queries'
import { BlockRenderer } from './components/BlockRenderer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  let pages: { _id: string; title: string; slug: string }[] = []
  try {
    pages = await client.fetch<{ _id: string; title: string; slug: string }[]>(allPagesQuery) ?? []
  } catch {
    // No Sanity project configured or fetch failed
  }

  if (!pages?.length) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 720, margin: '0 auto' }}>
        <h1>Page Architect</h1>
        <p>No pages yet. Create a page in Sanity Studio.</p>
        <p>
          Run <code>npm run dev</code> for Sanity Studio, then add a page with blocks.
        </p>
      </main>
    )
  }

  const firstPage = pages[0]
  let pageData: {
    _id: string
    title: string
    slug: string
    sections: unknown[]
  } | null = null
  try {
    pageData = await client.fetch<{
    _id: string
    title: string
    slug: string
    sections: unknown[]
  }>(
    `*[_type == "page" && _id == $id][0]{
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
  }`,
      { id: firstPage._id }
    )
  } catch {
    pageData = null
  }

  if (!pageData) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 720, margin: '0 auto' }}>
        <h1>Page Architect</h1>
        <p>Could not load page. Check your Sanity project ID and dataset in .env</p>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'system-ui' }}>
      <header
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/" style={{ fontWeight: 600, color: '#111', textDecoration: 'none' }}>
          Page Architect
        </Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          {pages.map((p) => (
            <Link
              key={p._id}
              href={p.slug === 'home' ? '/' : `/${p.slug}`}
              style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}
            >
              {p.title}
            </Link>
          ))}
        </nav>
      </header>
      <BlockRenderer blocks={pageData?.sections} />
    </main>
  )
}
