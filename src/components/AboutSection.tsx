import { useWindowWidth } from '@/lib/useWindowWidth'

export default function AboutSection() {
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <section id="about" style={{ backgroundColor: '#ffffff', padding: isMobile ? '80px 24px' : '128px 48px' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '5fr 7fr',
        gap: isMobile ? '48px' : '80px',
        alignItems: 'center',
      }}>

        {/* Headshot */}
        <div style={{ aspectRatio: isMobile ? '4/3' : '4/5', overflow: 'hidden' }}>
          <img
            src="/assets/jaime.jpeg"
            alt="Jaime Fernandez — Russ Lyon Sotheby's International Realty"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
        </div>

        {/* Content */}
        <div>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
            Meet Jaime Fernandez
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, color: '#002349', lineHeight: 1.1, margin: 0, marginBottom: '40px' }}>
            A legacy built on precision and desert luxury.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: '#43474e', lineHeight: 1.7, margin: 0 }}>
              With nearly two decades of experience in the Arizona luxury market, Jaime Fernandez has redefined the real estate experience. Specializing in high-end Scottsdale estates and the exclusive enclave of the 85254 zip code.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: '#43474e', lineHeight: 1.7, margin: 0 }}>
              Every transaction is handled with the same curation as a fine art gallery, ensuring that both buyers and sellers experience the pinnacle of Sotheby's international standards.
            </p>
          </div>
          {/* Stats */}
          <div style={{
            marginTop: '64px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: isMobile ? '32px' : '48px',
            borderTop: '1px solid rgba(194,155,64,0.25)',
            paddingTop: '48px',
          }}>
            {[{ value: '320+', label: 'Homes Sold' }, { value: '$2.1B', label: 'Lifetime Volume' }].map(stat => (
              <div key={stat.value}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px, 5vw, 48px)', fontStyle: 'italic', color: '#C29B40', lineHeight: 1, marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C29B40' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
