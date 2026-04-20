import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Check } from 'lucide-react'
import Footer from '@/components/Footer'
import { JAIME } from '@/lib/constants'
import { useWindowWidth } from '@/lib/useWindowWidth'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

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

export default function LetsStayInTouch() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [form, setForm] = useState({ name: '', phone: '', email: '' })
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
          body: JSON.stringify({ ...form, source: "Let's Stay in Touch", date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Let's Stay in Touch | Jaime Fernandez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Full-page centered layout */}
      <section style={{ backgroundColor: '#002349', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '120px 24px 80px' : '160px 48px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 36px' }}>
                <Check size={32} color="#C29B40" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 56px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
                Great to Meet You
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '40px' }}>
                Jaime will be in touch soon. In the meantime, feel free to reach out directly.
              </p>
              <a href={`tel:${JAIME.phone.replace(/\./g, '')}`} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', backgroundColor: '#C29B40', color: '#ffffff', textDecoration: 'none', padding: '18px 48px', display: 'inline-block' }}>
                {JAIME.phone}
              </a>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
                  Jaime Fernandez
                </span>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(40px, 7vw, 72px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 24px' }}>
                  Let's Stay<br />in Touch
                </h1>
                <div style={{ width: '40px', height: '1px', backgroundColor: '#C29B40', margin: '0 auto 24px' }} />
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.75 }}>
                  Whether you're buying, selling, or just keeping an eye on the market — drop your info and Jaime will stay connected.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div>
                  <span style={{ ...label, color: 'rgba(255,255,255,0.50)' }}>Your Name *</span>
                  <input
                    required
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={form.name}
                    onChange={setInput('name')}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <span style={{ ...label, color: 'rgba(255,255,255,0.50)' }}>Phone Number *</span>
                  <input
                    required
                    type="tel"
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={form.phone}
                    onChange={setInput('phone')}
                    placeholder="(480) 000-0000"
                  />
                </div>
                <div>
                  <span style={{ ...label, color: 'rgba(255,255,255,0.50)' }}>Email (optional)</span>
                  <input
                    type="email"
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={form.email}
                    onChange={setInput('email')}
                    placeholder="jane@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.name || !form.phone}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    backgroundColor: loading ? '#666' : '#C29B40',
                    color: '#ffffff', border: 'none',
                    padding: '22px 64px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                    marginTop: '8px',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#d4af55' }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                >
                  {loading ? 'Sending...' : 'Stay Connected'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
