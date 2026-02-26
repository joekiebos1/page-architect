import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '../../lib/sanity/client'
import { pageBySlugQuery, allPagesQuery } from '../../lib/sanity/queries'
import { BlockRenderer } from '../components/BlockRenderer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  params: Promise<{ slug: string }>
}

export default async function PageBySlug({ params }: Props) {
  const { slug } = await params
  const pageData = await client.fetch<{
    _id: string
    title: string
    slug: string
    sections: unknown[]
  } | null>(pageBySlugQuery, { slug })

  if (!pageData) notFound()

  const pages = await client.fetch<{ _id: string; title: string; slug: string }[]>(allPagesQuery)

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
          {pages?.map((p) => (
            <Link
              key={p._id}
              href={p.slug === 'home' ? '/' : `/${p.slug}`}
              style={{
                color: p.slug === slug ? '#111' : '#666',
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: p.slug === slug ? 600 : 400,
              }}
            >
              {p.title}
            </Link>
          ))}
        </nav>
      </header>
      <BlockRenderer blocks={pageData.sections} />
    </main>
  )
}
