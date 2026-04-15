import { Star } from 'lucide-react'
import { useWindowWidth } from '@/lib/useWindowWidth'

const REVIEWS = [
  {
    quote: "His attention to detail and professional approach really stand out. Every step feels organized and well thought out. You can tell he values doing things the right way.",
    name: 'Kevin R.',
    location: 'Scottsdale, AZ',
  },
  {
    quote: "Jaime's sharp, responsive, and clearly knows his stuff. No fluff — just focus and follow-through.",
    name: 'Tyler S.',
    location: 'Scottsdale, AZ',
  },
  {
    quote: "Jaime makes me feel completely comfortable and heard from the beginning. You can tell he genuinely cares about the people he works with.",
    name: 'Jenna S.',
    location: 'Scottsdale, AZ',
  },
]

export default function ReviewsSection() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  const cols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  return (
    <section id="reviews" style={{ backgroundColor: '#ffffff', padding: isMobile ? '80px 24px' : '128px 48px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '56px' : '96px' }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
            Testimonials
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px, 5.5vw, 72px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', margin: 0 }}>
            What Clients Say
          </h2>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '32px' }}>
          {REVIEWS.map(review => (
            <div key={review.name} style={{ backgroundColor: '#ffffff', padding: isMobile ? '36px 32px' : '48px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)' }}>
              {/* Filled stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill="#C29B40" color="#C29B40" />
                ))}
              </div>
              {/* Quote */}
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? '20px' : '22px', fontStyle: 'italic', color: '#000d22', lineHeight: 1.6, margin: 0, marginBottom: '36px' }}>
                "{review.quote}"
              </p>
              {/* Divider */}
              <div style={{ width: '48px', height: '1px', backgroundColor: '#C29B40', marginBottom: '28px' }} />
              {/* Attribution */}
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#002349' }}>
                {review.name}
              </div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#C29B40', marginTop: '8px' }}>
                {review.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
