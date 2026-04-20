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

const BEDROOMS = ['1', '2', '3', '4', '5+']
const BATHROOMS = ['1', '1.5', '2', '2.5', '3', '4+']
const BUDGETS = ['Under $1M', '$1M – $2M', '$2M – $3M', '$3M – $5M', '$5M+']
const TIMELINES = ['Ready now', '1–3 months', '3–6 months', '6–12 months', 'Just exploring']
const LENDER = ['Yes — pre-approved', 'Yes — in process', 'No — need a referral', 'Cash buyer']
const AREAS = ['85254 / North Scottsdale', 'Scottsdale Old Town', 'Paradise Valley', 'Arcadia / Biltmore', 'Phoenix', 'Open to suggestions']
const PROPERTY = ['Single Family', 'Condo / Townhome', 'Land / Lot', 'Investment Property']

function PillGroup({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
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
              letterSpacing: '0.05em',
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

export default function StartSearch() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    bedrooms: '', bathrooms: '', budget: '',
    timeline: '', lender: '', areas: '',
    propertyType: '', notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (v: string) => setForm(f => ({ ...f, [field]: v }))
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
          body: JSON.stringify({ ...form, source: 'Start Your Search', date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Start Your Search | Jaime Fernandez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero */}
      <section style={{ backgroundColor: '#002349', padding: isMobile ? '120px 24px 80px' : '160px 48px 100px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', color: '#ffffff' }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '28px' }}>
            Buyer Intake
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(42px, 6vw, 80px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 28px' }}>
            Find Your Perfect Home
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }}>
            Share a few details and Jaime will personally curate listings that match your vision.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ backgroundColor: '#ffffff', padding: isMobile ? '64px 24px 80px' : '96px 48px 128px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <Check size={32} color="#C29B40" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '20px' }}>
                Thank You, {form.name.split(' ')[0]}
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
                Jaime will review your preferences and reach out within 24 hours with curated listings.
              </p>
              <a href={`tel:${JAIME.phone.replace(/\./g, '')}`} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', backgroundColor: '#002349', color: '#ffffff', textDecoration: 'none', padding: '18px 48px', display: 'inline-block' }}>
                Call {JAIME.phone}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>

              {/* Contact */}
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 400, color: '#002349', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,35,73,0.10)' }}>
                  Your Contact Info
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px' }}>
                  <div>
                    <span style={label}>Full Name *</span>
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
              </div>

              {/* Property preferences */}
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 400, color: '#002349', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,35,73,0.10)' }}>
                  Your Dream Home
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>Bedrooms</span>
                    <PillGroup options={BEDROOMS} value={form.bedrooms} onChange={set('bedrooms')} />
                  </div>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>Bathrooms</span>
                    <PillGroup options={BATHROOMS} value={form.bathrooms} onChange={set('bathrooms')} />
                  </div>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>Budget Range</span>
                    <PillGroup options={BUDGETS} value={form.budget} onChange={set('budget')} />
                  </div>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>Property Type</span>
                    <PillGroup options={PROPERTY} value={form.propertyType} onChange={set('propertyType')} />
                  </div>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>Areas of Interest</span>
                    <PillGroup options={AREAS} value={form.areas} onChange={set('areas')} />
                  </div>
                </div>
              </div>

              {/* Timeline & lender */}
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 400, color: '#002349', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,35,73,0.10)' }}>
                  Timeline & Financing
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>When are you looking to buy?</span>
                    <PillGroup options={TIMELINES} value={form.timeline} onChange={set('timeline')} />
                  </div>
                  <div>
                    <span style={{ ...label, marginBottom: '16px' }}>Are you working with a lender?</span>
                    <PillGroup options={LENDER} value={form.lender} onChange={set('lender')} />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span style={label}>Anything else Jaime should know? (optional)</span>
                <textarea
                  value={form.notes}
                  onChange={setInput('notes')}
                  rows={4}
                  placeholder="Style preferences, must-haves, deal-breakers..."
                  style={{
                    ...underline,
                    resize: 'vertical',
                    borderBottom: '1px solid rgba(0,35,73,0.25)',
                    paddingTop: '12px',
                  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    backgroundColor: loading ? '#999' : '#002349',
                    color: '#ffffff',
                    border: 'none',
                    padding: '22px 64px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#002349' }}
                >
                  {loading ? 'Sending...' : 'Send to Jaime'}
                </button>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 300, color: '#999', marginTop: '16px', lineHeight: 1.6 }}>
                  Your information is never sold or shared. Jaime will reach out personally.
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
