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

const TIMELINES = [
  'Ready to sell now',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  'Just curious about value',
]

function PillGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options.map(opt => {
        const selected = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '12px', fontWeight: selected ? 600 : 400,
              padding: '10px 20px',
              border: `1px solid ${selected ? '#C29B40' : 'rgba(0,35,73,0.18)'}`,
              backgroundColor: selected ? '#C29B40' : 'transparent',
              color: selected ? '#ffffff' : '#002349',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function HomeEvalPage() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [form, setForm] = useState({ address: '', timeline: '', name: '', email: '', phone: '', notes: '', loveNote: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const setInput = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'Home Evaluation', date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Free Home Valuation | Jaime Fernandez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero */}
      <section style={{ backgroundColor: '#002349', padding: isMobile ? '120px 24px 80px' : '160px 48px 100px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', color: '#ffffff' }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '28px' }}>
            Seller Services
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(42px, 6vw, 80px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 28px' }}>
            What Is Your Home Worth?
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }}>
            Get an accurate picture of your home's value with zero obligation, with a free comprehensive market analysis.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <div style={{ backgroundColor: '#C29B40', padding: '24px 48px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          {[
            ['320+', 'Transactions Closed'],
            ['$2.1B', 'Total Sales Volume'],
            ['24 hrs', 'Average Response Time'],
          ].map(([num, text]) => (
            <div key={text} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontStyle: 'italic', fontWeight: 300, color: '#ffffff' }}>{num}</div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', marginTop: '4px' }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <section style={{ backgroundColor: '#ffffff', padding: isMobile ? '64px 24px 80px' : '96px 48px 128px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <Check size={32} color="#C29B40" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '20px' }}>
                Request Received
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
                Jaime will personally review your property and reach out within 24 hours with a detailed market analysis.
              </p>
              <a href={`tel:${JAIME.phone.replace(/\./g, '')}`} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', backgroundColor: '#002349', color: '#ffffff', textDecoration: 'none', padding: '18px 48px', display: 'inline-block' }}>
                Call {JAIME.phone}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

              {/* Address */}
              <div>
                <span style={label}>Property Address *</span>
                <input
                  required
                  style={underline}
                  value={form.address}
                  onChange={setInput('address')}
                  placeholder="123 E Camelback Rd, Scottsdale, AZ 85251"
                />
              </div>

              {/* Timeline */}
              <div>
                <span style={{ ...label, marginBottom: '16px' }}>When are you thinking of selling?</span>
                <PillGroup
                  options={TIMELINES}
                  value={form.timeline}
                  onChange={v => setForm(f => ({ ...f, timeline: v }))}
                />
              </div>

              {/* Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px' }}>
                <div>
                  <span style={label}>Your Name *</span>
                  <input required style={underline} value={form.name} onChange={setInput('name')} placeholder="Jane Smith" />
                </div>
                <div>
                  <span style={label}>Email *</span>
                  <input required type="email" style={underline} value={form.email} onChange={setInput('email')} placeholder="jane@example.com" />
                </div>
                <div>
                  <span style={label}>Phone</span>
                  <input type="tel" style={underline} value={form.phone} onChange={setInput('phone')} placeholder="(480) 000-0000" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <span style={label}>Anything else? <span style={{ color: '#bbb', fontWeight: 300, letterSpacing: 0 }}>(optional)</span></span>
                <textarea
                  value={form.notes}
                  onChange={setInput('notes')}
                  rows={3}
                  placeholder="Recent renovations, unique features, or any questions..."
                  style={{ ...underline, resize: 'vertical', paddingTop: '12px' }}
                />
              </div>

              {/* Love note — optional, placed after contact capture */}
              <div>
                <span style={label}>Why do you love your home? <span style={{ color: '#bbb', fontWeight: 300, letterSpacing: 0 }}>(optional)</span></span>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', fontWeight: 300, color: '#aaa', lineHeight: 1.6, margin: '0 0 12px' }}>
                  Jaime loves knowing what makes a property special before writing the analysis.
                </p>
                <textarea
                  value={form.loveNote}
                  onChange={setInput('loveNote')}
                  rows={3}
                  placeholder="The backyard at sunset, the kitchen we renovated, walkable to everything..."
                  style={{ ...underline, resize: 'vertical', paddingTop: '12px' }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email || !form.address}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    backgroundColor: loading ? '#999' : '#002349',
                    color: '#ffffff', border: 'none',
                    padding: '22px 64px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#002349' }}
                >
                  {loading ? 'Sending...' : 'Get My Free Valuation'}
                </button>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 300, color: '#999', marginTop: '16px' }}>
                  No obligation. Your information is never sold or shared.
                </p>
              </div>

            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
