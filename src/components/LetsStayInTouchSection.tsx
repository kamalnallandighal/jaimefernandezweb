import { useState } from 'react'
import { useWindowWidth } from '@/lib/useWindowWidth'
import { isValidEmail } from '@/lib/validation'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

export default function LetsStayInTouchSection() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const emailError = emailTouched && form.email !== '' && !isValidEmail(form.email)

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
          body: JSON.stringify({ ...form, source: "Homepage — Let's Stay in Touch", date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="stay-in-touch" style={{ backgroundColor: '#ffffff', padding: isMobile ? '80px 24px' : '128px 48px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
          Stay Connected
        </span>

        {submitted ? (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 56px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '16px', lineHeight: 1.15 }}>
              You're on the list.
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7 }}>
              Jaime will be in touch with market updates and exclusive Scottsdale insights.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 56px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '16px', lineHeight: 1.15 }}>
              Let's Stay in Touch
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, marginBottom: '48px' }}>
              Get exclusive Scottsdale market updates, off-market opportunities, and local insights — directly from Jaime.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', justifyContent: 'center' }}>
              <input
                required
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '15px', fontWeight: 300,
                  color: '#002349', backgroundColor: 'transparent',
                  border: 'none', borderBottom: '1px solid rgba(0,35,73,0.25)',
                  outline: 'none', padding: '12px 0',
                  flex: isMobile ? '1 1 auto' : '0 1 220px',
                  minWidth: isMobile ? '100%' : '180px',
                }}
                placeholder="Your Name"
                value={form.name}
                onChange={setInput('name')}
              />
              <input
                required
                type="email"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '15px', fontWeight: 300,
                  color: '#002349', backgroundColor: 'transparent',
                  border: 'none', borderBottom: `1px solid ${emailError ? '#e53e3e' : 'rgba(0,35,73,0.25)'}`,
                  outline: 'none', padding: '12px 0',
                  flex: isMobile ? '1 1 auto' : '0 1 240px',
                  minWidth: isMobile ? '100%' : '200px',
                }}
                placeholder="Email Address"
                value={form.email}
                onChange={setInput('email')}
                onBlur={() => setEmailTouched(true)}
              />
              <button
                type="submit"
                disabled={loading || emailError}
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.20em', textTransform: 'uppercase',
                  backgroundColor: loading ? '#999' : '#002349',
                  color: '#ffffff', border: 'none',
                  padding: '16px 40px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#002349' }}
              >
                {loading ? 'Sending...' : 'Subscribe'}
              </button>
            </form>

            {emailError && (
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 400, color: '#e53e3e', marginTop: '8px' }}>
                Please enter a valid email address.
              </p>
            )}
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: '#bbb', marginTop: '12px' }}>
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
