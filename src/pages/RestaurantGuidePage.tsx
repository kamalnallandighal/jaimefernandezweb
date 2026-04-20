import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Check, UtensilsCrossed, MapPin, Star } from 'lucide-react'
import Footer from '@/components/Footer'
import { useWindowWidth } from '@/lib/useWindowWidth'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined
const BG = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80'

const label: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: '#999', display: 'block', marginBottom: '8px',
}

const underline: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '17px', fontWeight: 300,
  color: '#002349', backgroundColor: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(0,35,73,0.25)',
  borderRadius: 0, outline: 'none',
  width: '100%', padding: '12px 0',
}

const PERKS = [
  { icon: UtensilsCrossed, title: 'Chef\'s Table Picks', desc: 'Where Scottsdale\'s top agents and executives actually dine.' },
  { icon: MapPin,          title: 'Hidden Gems',         desc: 'Under-the-radar spots locals guard jealously.' },
  { icon: Star,            title: 'Occasion Guide',      desc: 'The right restaurant for every moment — from closing dinners to anniversaries.' },
]

export default function RestaurantGuidePage() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const setInput = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'Restaurant Guide', date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Scottsdale Dining Guide | Jaime Fernandez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Photo hero */}
      <section style={{ position: 'relative', padding: isMobile ? '140px 24px 100px' : '180px 48px 120px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={BG} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,35,73,0.92)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', textAlign: 'center', color: '#ffffff' }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '28px' }}>
            Exclusive Content
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(42px, 6vw, 80px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 28px' }}>
            The Connoisseur's Guide to Scottsdale Dining
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.70)', lineHeight: 1.75, margin: '0 auto 0', maxWidth: '600px' }}>
            An insider's curated collection of the most exclusive tables, hidden gems, and culinary experiences across 85254 and North Scottsdale — compiled by someone who actually lives here.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section style={{ backgroundColor: '#ffffff', padding: isMobile ? '64px 24px' : '96px 48px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '40px' : '56px', marginBottom: '80px' }}>
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Icon size={22} color="#C29B40" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 400, color: '#002349', marginBottom: '12px' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C29B40', margin: '0 auto 40px' }} />
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '16px' }}>
              Get Instant Access
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.7, marginBottom: '40px' }}>
              Enter your name and email and we'll send the guide directly to your inbox — completely free.
            </p>

            {submitted ? (
              <div>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Check size={28} color="#C29B40" strokeWidth={1.5} />
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '12px' }}>
                  Check Your Inbox
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', fontWeight: 300, color: '#999' }}>
                  The guide is on its way to {form.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <span style={label}>Your Name *</span>
                  <input required style={underline} value={form.name} onChange={setInput('name')} placeholder="Jane Smith" />
                </div>
                <div>
                  <span style={label}>Email Address *</span>
                  <input required type="email" style={underline} value={form.email} onChange={setInput('email')} placeholder="jane@example.com" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    backgroundColor: loading ? '#999' : '#C29B40',
                    color: '#ffffff', border: 'none',
                    padding: '22px 48px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                    width: '100%',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#002349' }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                >
                  {loading ? 'Sending...' : 'Send Me the Guide'}
                </button>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: '#bbb', lineHeight: 1.6 }}>
                  No spam. Unsubscribe anytime. Your info is never sold.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
