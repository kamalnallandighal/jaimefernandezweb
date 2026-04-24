import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase, type Post } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import Footer from '@/components/Footer'
import { useWindowWidth } from '@/lib/useWindowWidth'


// ─── Loading skeleton ────────────────────────────────────────────────────────

function ShimmerGrid() {
  const width = useWindowWidth()
  const hPad = width < 768 ? '24px' : '48px'

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `0 ${hPad} 96px` }}>
      <div style={{ display: 'grid', gridTemplateColumns: width >= 1024 ? '55% 1fr' : '1fr', gap: '48px', marginBottom: '96px' }}>
        <div style={{ animation: 'pulse 1.5s infinite' }}>
          <div style={{ backgroundColor: '#eceae5', aspectRatio: '4/5', width: '100%', marginBottom: '32px' }} />
          <div style={{ backgroundColor: '#eceae5', height: '12px', width: '80px', marginBottom: '16px' }} />
          <div style={{ backgroundColor: '#eceae5', height: '40px', width: '80%', marginBottom: '12px' }} />
          <div style={{ backgroundColor: '#eceae5', height: '20px', width: '100%' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div style={{ backgroundColor: '#eceae5', aspectRatio: '1', width: '100%', marginBottom: '16px' }} />
              <div style={{ backgroundColor: '#eceae5', height: '10px', width: '60px', marginBottom: '10px' }} />
              <div style={{ backgroundColor: '#eceae5', height: '18px', width: '90%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ padding: '160px 48px', textAlign: 'center' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '16px' }}>
        Coming Soon
      </p>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: '#999' }}>
        Market insights and local expertise — check back soon.
      </p>
    </div>
  )
}

function ErrorState() {
  return (
    <div style={{ padding: '160px 48px', textAlign: 'center' }}>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', color: '#999' }}>
        Could not load posts. Please try again later.
      </p>
    </div>
  )
}

// ─── Newsletter ──────────────────────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const width = useWindowWidth()
  const hPad = width < 768 ? '24px' : '48px'

  return (
    <section style={{ backgroundColor: '#f5f3ef', padding: `96px ${hPad}`, textAlign: 'center', marginTop: '96px' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: '#002349', margin: 0, marginBottom: '20px' }}>
        Stay Informed
      </h2>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 48px' }}>
        Curated insights on Arizona luxury real estate, delivered to your inbox monthly.
      </p>
      {done ? (
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#C29B40' }}>
          You're on the list.
        </p>
      ) : (
        <form
          onSubmit={e => { e.preventDefault(); setDone(true) }}
          style={{ display: 'flex', gap: '0', maxWidth: '440px', margin: '0 auto' }}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            style={{
              flex: 1,
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              color: '#002349',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(0,35,73,0.25)',
              padding: '12px 0',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
            onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
          />
          <button
            type="submit"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: '#002349',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #002349',
              padding: '12px 0 12px 32px',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#C29B40'
              e.currentTarget.style.borderBottomColor = '#C29B40'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#002349'
              e.currentTarget.style.borderBottomColor = '#002349'
            }}
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const width = useWindowWidth()

  const hPad = width < 768 ? '24px' : '48px'
  const isDesktop = width >= 1024
  const isTablet = width >= 768 && width < 1024
  const isMobile = width < 768

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!supabase) throw new Error('Supabase not configured')
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
        if (fetchError) throw fetchError
        setPosts(data || [])
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Find featured post: first post with featured === true, fallback to posts[0]
  const featuredIndex = posts.findIndex(p => p.featured === true)
  const featuredLarge: Post | undefined = featuredIndex !== -1 ? posts[featuredIndex] : posts[0]
  const rest: Post[] = featuredLarge
    ? posts.filter((_, i) => i !== (featuredIndex !== -1 ? featuredIndex : 0))
    : []

  const featuredSmall = rest.slice(0, 4)
  const secondaryFeed = rest.slice(4, 7)

  // Category nav gap
  const navGap = isMobile ? '0 16px' : '0 40px'

  return (
    <>
      <Helmet>
        <title>The Narrative | Jaime Fernandez</title>
        <meta name="description" content="Market insights, neighborhood guides, and local expertise from Scottsdale's leading luxury real estate agent." />
        <meta property="og:title" content="The Narrative | Jaime Fernandez" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://jfscottsdalehomes.com/blog" />
      </Helmet>

      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>

        {/* Masthead */}
        <div style={{ paddingTop: '128px', paddingBottom: '64px', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#002349',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            The Narrative
          </h1>
          <div style={{ width: '64px', height: '1px', backgroundColor: '#C29B40', margin: '24px auto 0' }} />
        </div>

        {/* States */}
        {loading && <ShimmerGrid />}
        {!loading && error && <ErrorState />}
        {!loading && !error && posts.length === 0 && <EmptyState />}

        {!loading && !error && posts.length > 0 && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `80px ${hPad} 0` }}>

            <>
              {/* Asymmetric Featured Grid */}
                <section style={{
                  display: 'grid',
                  gridTemplateColumns: isDesktop && featuredSmall.length > 0 ? '55% 1fr' : '1fr',
                  gap: isDesktop ? '64px' : '40px',
                  marginBottom: '96px',
                  alignItems: 'start',
                }}>
                  {featuredLarge && <PostCard post={featuredLarge} size="large" />}

                  {featuredSmall.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 24px' }}>
                      {featuredSmall.map(post => (
                        <PostCard key={post.id} post={post} size="small" />
                      ))}
                    </div>
                  )}
                </section>

                {/* Secondary 3-column feed */}
                {secondaryFeed.length > 0 && (
                  <section style={{
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    paddingTop: '80px',
                    marginBottom: '96px',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr', gap: '48px' }}>
                      {secondaryFeed.map(post => (
                        <PostCard key={post.id} post={post} size="grid" />
                      ))}
                    </div>
                  </section>
                )}
            </>

          </div>
        )}

        {/* Newsletter */}
        <Newsletter />

        {/* Main site footer */}
        <Footer />
      </div>
    </>
  )
}
