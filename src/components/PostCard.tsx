import { Link } from 'react-router-dom'
import type { Post } from '@/lib/supabase'

interface PostCardProps {
  post: Post
  size: 'large' | 'small' | 'grid'
  className?: string
}

function ImageBox({
  url,
  alt,
  aspectClass,
}: {
  url: string | null
  alt: string
  aspectClass: string
}) {
  return (
    <div className={`relative overflow-hidden ${aspectClass} w-full`}>
      {url ? (
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: '#eceae5' }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '3rem',
              color: 'rgba(194,155,64,0.35)',
              fontStyle: 'italic',
            }}
          >
            JF
          </span>
        </div>
      )}
    </div>
  )
}

function CategoryTag({ category }: { category: string | null }) {
  if (!category) return null
  return (
    <span
      style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#C29B40',
        display: 'block',
        marginBottom: '12px',
      }}
    >
      {category}
    </span>
  )
}

export default function PostCard({ post, size, className = '' }: PostCardProps) {
  if (size === 'large') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={`block cursor-pointer group ${className}`}
        style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
              className="group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#eceae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', color: 'rgba(194,155,64,0.35)', fontStyle: 'italic' }}>JF</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,23,49,0.92) 0%, rgba(0,23,49,0.55) 40%, transparent 70%)',
          }} />

          {/* Overlaid text */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 40px 36px' }}>
            {post.category && (
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#C29B40',
                display: 'block',
                marginBottom: '12px',
              }}>
                {post.category}
              </span>
            )}
            <h2
              className="group-hover:text-[#C29B40] transition-colors duration-300"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.15,
                color: '#ffffff',
                margin: 0,
                marginBottom: post.excerpt ? '12px' : 0,
              }}
            >
              {post.title}
            </h2>
            {post.excerpt && (
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.65,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (size === 'small') {
    return (
      <Link to={`/blog/${post.slug}`} className={`block cursor-pointer group ${className}`} style={{ textDecoration: 'none' }}>
        <ImageBox url={post.cover_image_url} alt={post.title} aspectClass="aspect-square" />
        <div style={{ paddingTop: '16px' }}>
          <CategoryTag category={post.category} />
          <h3
            className="group-hover:text-[#C29B40] transition-colors duration-300"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.4rem',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.3,
              color: '#002349',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h3>
        </div>
      </Link>
    )
  }

  // grid — 3-column secondary feed style
  return (
    <Link to={`/blog/${post.slug}`} className={`block cursor-pointer group ${className}`} style={{ textDecoration: 'none' }}>
      <ImageBox url={post.cover_image_url} alt={post.title} aspectClass="aspect-[3/2]" />
      <div style={{ paddingTop: '20px' }}>
        <CategoryTag category={post.category} />
        <h3
          className="group-hover:text-[#C29B40] transition-colors duration-300"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.5rem',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.25,
            color: '#002349',
            margin: 0,
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              color: '#888',
              lineHeight: 1.7,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
