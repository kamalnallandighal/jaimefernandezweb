import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { isValidEmail, isValidPhone } from '@/lib/validation'
import Footer from '@/components/Footer'
import { JAIME } from '@/lib/constants'
import { useWindowWidth } from '@/lib/useWindowWidth'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

const TIMELINES = [
  'Ready to sell now',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  'Just curious about value',
]

const labelStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: '#999', display: 'block', marginBottom: '14px',
}

const underline: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '17px', fontWeight: 300,
  color: '#002349', backgroundColor: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(0,35,73,0.25)',
  borderRadius: 0, outline: 'none',
  width: '100%', padding: '12px 0',
}

type EvalStep = 1 | 2 | 3 | 4

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
}

export default function HomeEvalPage() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [step,      setStep]      = useState<EvalStep>(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [phoneTouched, setPhoneTouched] = useState(false)

  const [address,  setAddress]  = useState('')
  const [timeline, setTimeline] = useState('')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [loveNote, setLoveNote] = useState('')

  const emailError = emailTouched && email !== '' && !isValidEmail(email)
  const phoneError = phoneTouched && phone !== '' && !isValidPhone(phone)

  const canProceed =
    step === 1 ? address.trim() !== '' :
    step === 2 ? true :
    step === 3 ? name.trim() !== '' && !emailError && !phoneError &&
      ((email.trim() !== '' && isValidEmail(email)) || (phone.trim() !== '' && isValidPhone(phone))) :
    true

  const goTo = (next: EvalStep, dir: number) => {
    setDirection(dir)
    setStep(next)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'Home Evaluation',
            Address: address, Timeline: timeline,
            Name: name, Email: email, Phone: phone,
            'Love Note': loveNote,
            Date: new Date().toISOString(),
          }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  const stepTitles: Record<EvalStep, string> = {
    1: 'Your property',
    2: 'Your timeline',
    3: 'Your contact',
    4: 'One last thing',
  }

  const stepHeadings: Record<EvalStep, React.ReactNode> = {
    1: <>What's the address<br />of your property?</>,
    2: <>When are you thinking<br />about selling?</>,
    3: <>Where should Jaime<br />send your analysis?</>,
    4: <>Why do you love<br />your home?</>,
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
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 52px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 28px', whiteSpace: 'nowrap' }}>
            What Is Your Home Worth?
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }}>
            Get an accurate picture of your home's value — free, no obligation, personally handled by Jaime.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section style={{ backgroundColor: '#ffffff', padding: isMobile ? '64px 24px 80px' : '96px 48px 128px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', padding: '80px 24px' }}
            >
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <Check size={32} color="#C29B40" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 48px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', marginBottom: '20px' }}>
                Request Received
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
                Jaime will personally review your property and reach out within 24 hours with a detailed market analysis.
              </p>
              <a
                href={`tel:${JAIME.phone.replace(/\./g, '')}`}
                style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', backgroundColor: '#002349', color: '#ffffff', textDecoration: 'none', padding: '18px 48px', display: 'inline-block' }}
              >
                Call {JAIME.phone}
              </a>
            </motion.div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,35,73,0.10)', overflow: 'hidden' }}>

              {/* Progress bar */}
              <div style={{ height: '3px', backgroundColor: 'rgba(194,155,64,0.15)' }}>
                <div style={{
                  height: '100%', backgroundColor: '#C29B40',
                  width: `${(step / 4) * 100}%`,
                  transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>

              {/* Step label */}
              <div style={{ padding: isMobile ? '20px 24px 0' : '28px 56px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb' }}>
                  Step {step} of 4
                </span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C29B40' }}>
                  {stepTitles[step]}
                </span>
              </div>

              {/* Animated step content */}
              <div style={{ padding: isMobile ? '32px 24px 0' : '44px 56px 0', minHeight: '360px', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 4vw, 42px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', margin: 0, marginBottom: '40px', lineHeight: 1.2 }}>
                      {stepHeadings[step]}
                    </h3>

                    {/* Step 1: Address */}
                    {step === 1 && (
                      <div>
                        <span style={labelStyle}>Property Address *</span>
                        <input
                          autoFocus
                          style={underline}
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="123 E Camelback Rd, Scottsdale, AZ 85251"
                          onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                          onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                        />
                      </div>
                    )}

                    {/* Step 2: Timeline */}
                    {step === 2 && (
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {TIMELINES.map(opt => {
                            const sel = timeline === opt
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setTimeline(opt)}
                                style={{
                                  fontFamily: "'Source Sans 3', sans-serif",
                                  fontSize: '14px', fontWeight: sel ? 600 : 300,
                                  textAlign: 'left', padding: '16px 20px',
                                  border: `1px solid ${sel ? '#C29B40' : 'rgba(0,35,73,0.12)'}`,
                                  backgroundColor: sel ? 'rgba(194,155,64,0.04)' : 'transparent',
                                  color: sel ? '#002349' : '#555',
                                  cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  transition: 'all 0.18s ease',
                                }}
                                onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(194,155,64,0.50)' }}
                                onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(0,35,73,0.12)' }}
                              >
                                {opt}
                                {sel && <Check size={14} color="#C29B40" strokeWidth={2.5} />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Contact */}
                    {step === 3 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div>
                          <span style={labelStyle}>Full Name *</span>
                          <input
                            style={underline}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Jane Smith"
                            onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                            onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                          <div>
                            <span style={labelStyle}>Email</span>
                            <input
                              type="email"
                              style={{ ...underline, borderBottomColor: emailError ? '#e53e3e' : 'rgba(0,35,73,0.25)' }}
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="jane@example.com"
                              onFocus={e => (e.currentTarget.style.borderBottomColor = emailError ? '#e53e3e' : '#002349')}
                              onBlur={e  => { setEmailTouched(true); e.currentTarget.style.borderBottomColor = emailError ? '#e53e3e' : 'rgba(0,35,73,0.25)' }}
                            />
                            {emailError && <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', color: '#e53e3e', display: 'block', marginTop: '6px' }}>Please enter a valid email address.</span>}
                          </div>
                          <div>
                            <span style={labelStyle}>Phone</span>
                            <input
                              type="tel"
                              style={{ ...underline, borderBottomColor: phoneError ? '#e53e3e' : 'rgba(0,35,73,0.25)' }}
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              placeholder="(480) 000-0000"
                              onFocus={e => (e.currentTarget.style.borderBottomColor = phoneError ? '#e53e3e' : '#002349')}
                              onBlur={e  => { setPhoneTouched(true); e.currentTarget.style.borderBottomColor = phoneError ? '#e53e3e' : 'rgba(0,35,73,0.25)' }}
                            />
                            {phoneError && <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', color: '#e53e3e', display: 'block', marginTop: '6px' }}>Please enter a valid phone number.</span>}
                          </div>
                        </div>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: '#bbb', margin: 0, lineHeight: 1.6 }}>
                          * We'll need at least one way to reach you — email or phone.
                        </p>
                      </div>
                    )}

                    {/* Step 4: Love Note */}
                    {step === 4 && (
                      <div>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', fontWeight: 300, color: '#999', lineHeight: 1.7, margin: '0 0 24px' }}>
                          Optional — but Jaime loves knowing what makes a property special before writing the analysis.
                        </p>
                        <textarea
                          value={loveNote}
                          onChange={e => setLoveNote(e.target.value)}
                          rows={4}
                          placeholder="The backyard at sunset, the kitchen we renovated, walkable to everything..."
                          style={{ ...underline, resize: 'vertical', paddingTop: '12px' }}
                          onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                          onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div style={{
                padding: isMobile ? '24px 24px 40px' : '32px 56px 48px',
                display: 'flex',
                justifyContent: step === 1 ? 'flex-end' : 'space-between',
                alignItems: 'center',
              }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => goTo((step - 1) as EvalStep, -1)}
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: '#aaa', background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#002349')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                  >
                    <ChevronLeft size={14} strokeWidth={2} /> Back
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {(step === 2 || step === 4) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 2) goTo(3, 1)
                        else handleSubmit()
                      }}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 400,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: '#bbb', background: 'none', border: 'none', cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
                    >
                      Skip
                    </button>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => canProceed && goTo((step + 1) as EvalStep, 1)}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.20em', textTransform: 'uppercase',
                        backgroundColor: canProceed ? '#C29B40' : 'rgba(194,155,64,0.30)',
                        color: '#ffffff', border: 'none',
                        padding: '18px 44px', cursor: canProceed ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={e => { if (canProceed) e.currentTarget.style.backgroundColor = 'rgba(194,155,64,0.85)' }}
                      onMouseLeave={e => { if (canProceed) e.currentTarget.style.backgroundColor = '#C29B40' }}
                    >
                      Continue <ChevronRight size={14} strokeWidth={2} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSubmit}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.20em', textTransform: 'uppercase',
                        backgroundColor: loading ? 'rgba(0,35,73,0.25)' : '#002349',
                        color: '#ffffff', border: 'none',
                        padding: '18px 44px',
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#C29B40' }}
                      onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#002349' }}
                    >
                      {loading ? 'Sending…' : 'Get My Free Valuation'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
