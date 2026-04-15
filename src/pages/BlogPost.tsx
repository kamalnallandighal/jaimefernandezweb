import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import { supabase, type Post } from '@/lib/supabase'
import PostCard from '@/components/PostCard'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Shimmer() {
  return (
    <div className="bg-white min-h-screen py-40">
      <div className="max-w-3xl mx-auto px-6 animate-pulse">
        <div className="h-3 w-24 bg-gray-200 rounded mb-6" />
        <div className="h-12 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="h-12 w-1/2 bg-gray-200 rounded mb-8" />
        <div className="h-px bg-gray-200 mb-10" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center py-40 text-center px-6">
      <p
        className="font-display font-light"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '8rem',
          color: '#C29B40',
          opacity: 0.3,
          lineHeight: 1,
        }}
      >
        404
      </p>
      <p
        className="font-display mt-4"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: '#002349' }}
      >
        This article has moved or doesn&apos;t exist.
      </p>
      <Link
        to="/blog"
        className="font-body mt-6 block underline transition-colors hover:text-gold-light"
        style={{ fontSize: '0.875rem', color: '#C29B40' }}
      >
        ← Back to Blog
      </Link>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        if (!supabase) { setNotFound(true); setLoading(false); return }
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (error || !data) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setPost(data)

        // Fetch related posts (same category first, then newest)
        const { data: related } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .neq('slug', slug)
          .order('published_at', { ascending: false })
          .limit(6)

        if (related) {
          // Sort: same category first
          const sameCat = related.filter((p) => p.category === data.category)
          const others = related.filter((p) => p.category !== data.category)
          setRelatedPosts([...sameCat, ...others].slice(0, 3))
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) return <Shimmer />
  if (notFound || !post) return <NotFound />

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: 'Jaime Fernandez',
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url,
    description: post.excerpt,
    publisher: {
      '@type': 'Organization',
      name: "Jaime Fernandez | Russ Lyon Sotheby's International Realty",
    },
  }

  return (
    <>
      <Helmet>
        <title>{post.seo_title || post.title} | Jaime Fernandez Scottsdale Real Estate</title>
        <meta name="description" content={post.seo_description || post.excerpt || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:image" content={post.cover_image_url || ''} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at || ''} />
        <meta property="article:author" content="Jaime Fernandez" />
        <link rel="canonical" href={`https://yoursite.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="bg-white min-h-screen">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="w-full" style={{ maxHeight: '70vh', overflow: 'hidden' }}>
            <img
              src={post.cover_image_url}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* Post Header */}
        <div className="max-w-3xl mx-auto px-6 pt-14 pb-8">
          {post.category && (
            <span
              className="font-body block mb-4"
              style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C29B40',
                fontWeight: 600,
              }}
            >
              {post.category}
            </span>
          )}
          <h1
            className="font-display font-semibold leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#002349',
            }}
          >
            {post.title}
          </h1>
          <div className="flex gap-6 items-center mt-5 flex-wrap">
            <span className="font-body" style={{ fontSize: '0.875rem', color: '#999999' }}>
              By Jaime Fernandez
            </span>
            {post.published_at && (
              <>
                <span style={{ color: '#cccccc' }}>|</span>
                <span className="font-body" style={{ fontSize: '0.875rem', color: '#999999' }}>
                  {formatDate(post.published_at)}
                </span>
              </>
            )}
            {post.read_time_minutes && (
              <>
                <span style={{ color: '#cccccc' }}>|</span>
                <span className="font-body" style={{ fontSize: '0.875rem', color: '#999999' }}>
                  {post.read_time_minutes} min read
                </span>
              </>
            )}
          </div>
          <div className="w-full h-px mt-10" style={{ backgroundColor: 'rgba(194,155,64,0.25)' }} />
        </div>

        {/* Post Body */}
        <div className="max-w-2xl mx-auto px-6 py-14">
          <div className="prose-jaime">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="max-w-2xl mx-auto px-6 pb-14">
            <div className="w-full h-px mb-6" style={{ backgroundColor: 'rgba(194,155,64,0.25)' }} />
            <p
              className="font-body mb-3"
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#999999',
              }}
            >
              Tags
            </p>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/blog?category=${encodeURIComponent(tag)}`)}
                  className="font-body bg-transparent border-none cursor-pointer transition-colors hover:text-gold"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#002349',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* More from Jaime */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="mb-10">
              <h2
                className="font-display italic"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.875rem',
                  color: '#002349',
                }}
              >
                More from Jaime
              </h2>
              <div className="w-full h-px mt-2" style={{ backgroundColor: 'rgba(194,155,64,0.3)' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} size="small" />
              ))}
            </div>
          </section>
        )}

        {/* CTA Strip */}
        <div className="bg-navy py-20 text-center px-6" style={{ backgroundColor: '#002349' }}>
          <p
            className="font-display italic"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: 'white',
            }}
          >
            Ready to find your home in Scottsdale?
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <Link
              to="/#home-eval"
              className="font-body inline-block px-8 py-3 transition-colors duration-200"
              style={{
                backgroundColor: '#C29B40',
                color: '#002349',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get a Home Valuation
            </Link>
            <Link
              to="/#calendly"
              className="font-body inline-block px-8 py-3 transition-colors duration-200"
              style={{
                border: '1px solid white',
                color: 'white',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
