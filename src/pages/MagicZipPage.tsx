import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Compass, Check } from 'lucide-react'
import Footer from '@/components/Footer'
import { useWindowWidth } from '@/lib/useWindowWidth'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

const FEATURES = [
  {
    icon: GraduationCap,
    label: 'A-Rated Schools',
    desc: 'Scottsdale Unified — top 5 school district in Arizona. 29 of 30 schools rated A or B.',
  },
  {
    icon: MapPin,
    label: 'Best of Both Cities',
    desc: 'Scottsdale mailing address. Phoenix city limits. The tax rate advantage is real.',
  },
  {
    icon: Compass,
    label: 'Prime Location',
    desc: "Minutes to Kierland Commons, Old Town Scottsdale, DC Ranch, and the valley's finest dining.",
  },
]

const underline: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '17px', fontWeight: 300,
  color: '#002349', backgroundColor: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(0,35,73,0.25)',
  borderRadius: 0, outline: 'none',
  width: '100%', padding: '12px 0',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: '#999', display: 'block', marginBottom: '14px',
}

export default function MagicZipPage() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const canSubmit = name.trim() !== '' && email.trim() !== ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, source: '85254 Page', date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>The 85254 Advantage | Jaime Fernandez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero — navy */}
      <section style={{ backgroundColor: '#002349', padding: isMobile ? '120px 24px 80px' : '160px 48px 100px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '28px' }}>
              The Magic Zip Code
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22 }}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(48px, 7vw, 96px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.0, margin: '0 0 36px' }}
          >
            The 85254<br />
            <span style={{ color: '#C29B40' }}>Advantage</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: 0 }}
          >
            A pocket of Arizona with a prestigious Scottsdale mailing address that sits within Phoenix city limits — delivering the best of both worlds to homeowners who know where to look.
          </motion.p>
        </div>
      </section>

      {/* Story + Feature list — white */}
      <section style={{ backgroundColor: '#ffffff', padding: isMobile ? '80px 24px' : '128px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '64px' : '96px', alignItems: 'start' }}>

          {/* Left: story */}
          <div>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
              Why It Matters
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', lineHeight: 1.1, margin: '0 0 36px' }}>
              Scottsdale Prestige.<br />Phoenix Economics.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.8, margin: 0 }}>
                The 85254 zip code occupies a unique geographic anomaly: a Scottsdale mailing address on a property that technically sits within Phoenix city limits. For homeowners, this translates into meaningful financial advantages — lower municipal tax rates and utility costs — while retaining everything that makes a Scottsdale address desirable.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.8, margin: 0 }}>
                The Scottsdale Unified School District — which serves 85254 — holds an "A" rating from the state of Arizona and ranks among the top 5 school districts in the state (Niche, 2026). With 29 of 30 schools rated A or B, it's consistently one of the strongest academic environments in the Southwest.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.8, margin: 0 }}>
                Jaime has closed more transactions in this corridor than any other agent — and knows the streets, the lot sizes, the hidden value, and the pockets within 85254 that consistently outperform the broader market.
              </p>
            </div>

            {/* Pull quote */}
            <div style={{ borderLeft: '1px solid rgba(194,155,64,0.35)', paddingLeft: '28px', marginTop: '48px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px, 2vw, 22px)', fontStyle: 'italic', color: '#C29B40', lineHeight: 1.5, margin: 0 }}>
                "The best-kept secret in Scottsdale is actually in Phoenix."
              </p>
            </div>
          </div>

          {/* Right: feature callouts */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '20px',
                    padding: '28px 0',
                    borderTop: i === 0 ? '1px solid rgba(0,35,73,0.08)' : 'none',
                    borderBottom: '1px solid rgba(0,35,73,0.08)',
                  }}
                >
                  <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#C29B40" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#002349', marginBottom: '8px' }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.7 }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Let's Stay in Touch — navy */}
      <section style={{ backgroundColor: '#002349', padding: isMobile ? '80px 24px' : '128px 48px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
            Stay Ahead
          </span>

          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                <Check size={28} color="#C29B40" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 48px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', marginBottom: '16px' }}>
                You're on the list.
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.75 }}>
                Jaime will send you 85254 market intel, off-market opportunities, and neighborhood updates.
              </p>
            </motion.div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 56px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 16px' }}>
                Stay Ahead of the<br />85254 Market
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.75, marginBottom: '48px' }}>
                Get off-market opportunities, neighborhood intel, and market updates — directly from Jaime.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <span style={{ ...labelStyle, color: 'rgba(255,255,255,0.50)' }}>Your Name *</span>
                  <input
                    required
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.70)')}
                    onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)')}
                  />
                </div>
                <div>
                  <span style={{ ...labelStyle, color: 'rgba(255,255,255,0.50)' }}>Email Address *</span>
                  <input
                    required
                    type="email"
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.70)')}
                    onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    backgroundColor: loading || !canSubmit ? 'rgba(194,155,64,0.35)' : '#C29B40',
                    color: '#ffffff', border: 'none',
                    padding: '22px 64px',
                    cursor: loading || !canSubmit ? 'default' : 'pointer',
                    transition: 'background-color 0.2s ease',
                    marginTop: '8px',
                  }}
                  onMouseEnter={e => { if (!loading && canSubmit) (e.currentTarget as HTMLElement).style.backgroundColor = '#d4af55' }}
                  onMouseLeave={e => { if (!loading && canSubmit) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                >
                  {loading ? 'Sending...' : 'Stay Connected'}
                </button>
              </form>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.35)', marginTop: '20px' }}>
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
