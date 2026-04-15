import { useState } from 'react'
import { useWindowWidth } from '@/lib/useWindowWidth'

const BG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80'

export default function RestaurantGuideSection() {
  const [email, setEmail] = useState('')
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <section id="restaurant" style={{ position: 'relative', padding: isMobile ? '96px 24px' : '192px 48px', overflow: 'hidden' }}>
      {/* Background photo + overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src={BG} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,35,73,0.90)' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '896px', margin: '0 auto', textAlign: 'center', color: '#ffffff' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '32px' }}>
          Exclusive Content
        </span>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px, 5.5vw, 72px)', fontStyle: 'italic', fontWeight: 300, margin: 0, marginBottom: '48px', lineHeight: 1.1 }}>
          The Connoisseur's Guide to Scottsdale Dining
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', fontWeight: 300, color: 'rgba(255,255,255,0.70)', marginBottom: '64px', lineHeight: 1.7, maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
          An insider's look at the most exclusive tables and hidden culinary gems in the 85254 and North Scottsdale area.
        </p>
        <form
          onSubmit={e => { e.preventDefault(); setEmail('') }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', maxWidth: '640px', margin: '0 auto' }}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            style={{
              flex: '1 1 240px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.30)',
              padding: '16px',
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '16px',
              color: '#ffffff',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              backgroundColor: '#C29B40',
              color: '#ffffff',
              border: 'none',
              padding: '16px 48px',
              cursor: 'pointer',
              borderRadius: 0,
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(194,155,64,0.88)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C29B40')}
          >
            Download Guide
          </button>
        </form>
      </div>
    </section>
  )
}
