import { useWindowWidth } from '@/lib/useWindowWidth'

export default function MagicZipSection() {
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <section id="magic-zip" style={{ backgroundColor: '#002349', padding: isMobile ? '80px 24px' : '128px 48px', overflow: 'hidden', position: 'relative' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '48px' : '96px',
        alignItems: 'center',
      }}>

        {/* Left */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
            Market Insight
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(40px, 6vw, 96px)', fontWeight: 300, color: '#ffffff', lineHeight: 1.0, margin: 0, marginBottom: '40px' }}>
            The 85254
            <br />
            <span style={{ color: '#C29B40', fontStyle: 'italic' }}>Advantage</span>
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.70)', lineHeight: 1.8, margin: 0, marginBottom: '40px', maxWidth: '480px' }}>
            There's a pocket of Arizona with a prestigious Scottsdale mailing address that sits within Phoenix city limits. Homeowners enjoy Scottsdale schools, lifestyle, and amenities, while paying Phoenix property tax rates. The savings are significant. The address is everything.
          </p>
          <div style={{ borderLeft: '1px solid rgba(194,155,64,0.30)', paddingLeft: '32px' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px, 2vw, 24px)', fontStyle: 'italic', color: '#C29B40', lineHeight: 1.4, margin: 0 }}>
              "The best-kept secret in Scottsdale is actually in Phoenix."
            </p>
          </div>
        </div>

        {/* Right — white card */}
        <div style={{ position: 'relative' }}>
          <div style={{ backgroundColor: '#ffffff', padding: isMobile ? '40px 32px' : '64px', position: 'relative', zIndex: 10, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 36px)', fontStyle: 'italic', color: '#002349', margin: 0, marginBottom: '32px' }}>
              The Magic Zip Code
            </h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#43474e', lineHeight: 1.75, margin: 0, marginBottom: '48px' }}>
              Expansive lots, mature desert landscaping, and top-rated schools - minutes from Old Town, Kierland, and the valley's finest dining. Jaime has closed more transactions in this corridor than any other agent.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {[{ value: '14%', label: 'Annual Apprec.' }, { value: '22 Days', label: 'Avg Market Time' }].map(stat => (
                <div key={stat.value}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 36px)', fontStyle: 'italic', color: '#C29B40', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#002349', marginTop: '8px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative corner border — hidden on mobile */}
          {!isMobile && (
            <div style={{ position: 'absolute', right: '-48px', top: '-48px', width: '320px', height: '320px', border: '1px solid rgba(194,155,64,0.20)' }} />
          )}
        </div>
      </div>
    </section>
  )
}
