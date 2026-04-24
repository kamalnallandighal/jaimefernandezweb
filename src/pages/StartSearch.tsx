import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Building2, Building, Gem, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import { JAIME } from '@/lib/constants'
import { useWindowWidth } from '@/lib/useWindowWidth'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

// ─── Options ─────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  { id: 'single-family', icon: Home,     label: 'Single Family',   desc: 'Detached home' },
  { id: 'condo',         icon: Building, label: 'Condo / Townhome', desc: 'Attached unit' },
  { id: 'land',          icon: Gem,      label: 'Land / Lot',       desc: 'Build your vision' },
  { id: 'investment',    icon: Building2,label: 'Investment',        desc: 'Rental or flip' },
] as const

const BEDROOMS  = ['1', '2', '3', '4', '5+']
const BATHROOMS = ['1', '1.5', '2', '2.5', '3', '4+']
const BUDGETS   = ['Under $1M', '$1M – $2M', '$2M – $3M', '$3M – $5M', '$5M+']
const AREAS     = ['85254 / North Scottsdale', 'Old Town Scottsdale', 'Paradise Valley', 'Arcadia / Biltmore', 'Greater Phoenix', 'Open to all areas']
const TIMELINES = ['Ready now', '1–3 months', '3–6 months', '6–12 months', 'Just exploring']
const LENDER    = ['Yes — pre-approved', 'Yes — in process', 'No — need a referral', 'Cash buyer']

type SearchStep = 1 | 2 | 3 | 4
type PropertyType = typeof PROPERTY_TYPES[number]['id']

// ─── Shared styles ────────────────────────────────────────────────────────────

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

// ─── Pill button ─────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: '13px', fontWeight: selected ? 600 : 400,
        padding: '11px 22px',
        border: `1px solid ${selected ? '#C29B40' : 'rgba(0,35,73,0.18)'}`,
        backgroundColor: selected ? '#C29B40' : 'transparent',
        color: selected ? '#ffffff' : '#002349',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StartSearch() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [step,      setStep]      = useState<SearchStep>(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [bedrooms,     setBedrooms]     = useState('')
  const [bathrooms,    setBathrooms]    = useState('')
  const [budget,       setBudget]       = useState('')
  const [areas,        setAreas]        = useState('')
  const [timeline,     setTimeline]     = useState('')
  const [lender,       setLender]       = useState('')
  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [notes,        setNotes]        = useState('')

  // Step is valid when at least one key field is set
  const canProceed =
    step === 1 ? bedrooms !== '' && bathrooms !== '' :
    step === 2 ? budget !== '' :
    step === 3 ? timeline !== '' && lender !== '' :
    name.trim() !== '' && (email.trim() !== '' || phone.trim() !== '')

  const goTo = (next: SearchStep, dir: number) => {
    setDirection(dir)
    setStep(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'Start Your Search',
            'Property Type': propertyType,
            Bedrooms: bedrooms, Bathrooms: bathrooms,
            Budget: budget, Areas: areas,
            Timeline: timeline, Lender: lender,
            Name: name, Email: email, Phone: phone, Notes: notes,
            Date: new Date().toISOString(),
          }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  const stepTitles: Record<SearchStep, string> = {
    1: 'Your ideal home',
    2: 'Location & budget',
    3: 'Timing',
    4: 'Last step',
  }

  const stepHeadings: Record<SearchStep, React.ReactNode> = {
    1: <>What does your<br />dream home look like?</>,
    2: <>Where do you want<br />to be?</>,
    3: <>How soon are you<br />looking to buy?</>,
    4: <>Where should Jaime<br />send your matches?</>,
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
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
            Buyer Services
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(42px, 6vw, 80px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 28px' }}>
            Find Your Perfect Home
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }}>
            Tell Jaime what you're looking for — he'll personally curate listings that match your vision.
          </p>
        </div>
      </section>

      {/* Form wizard */}
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
                Thank You, {name.split(' ')[0]}
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
                Jaime will review your preferences and reach out personally within 24 hours with curated listings.
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
              <div style={{ padding: isMobile ? '32px 24px 0' : '44px 56px 0', minHeight: '420px', position: 'relative', overflow: 'hidden' }}>
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

                    {/* ── Step 1: Property type + beds + baths ── */}
                    {step === 1 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

                        {/* Property type cards */}
                        <div>
                          <span style={labelStyle}>Property Type</span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {PROPERTY_TYPES.map(({ id, icon: Icon, label, desc }) => {
                              const sel = propertyType === id
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => setPropertyType(id)}
                                  style={{
                                    backgroundColor: sel ? 'rgba(194,155,64,0.04)' : '#fff',
                                    padding: isMobile ? '20px 16px' : '24px 20px',
                                    border: `${sel ? '1.5px' : '1px'} solid ${sel ? '#C29B40' : 'rgba(0,35,73,0.12)'}`,
                                    cursor: 'pointer', textAlign: 'left',
                                    display: 'flex', flexDirection: 'column', gap: '8px',
                                    position: 'relative',
                                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                                  }}
                                  onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(194,155,64,0.50)' }}
                                  onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(0,35,73,0.12)' }}
                                >
                                  {sel && (
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#C29B40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Check size={9} color="#fff" strokeWidth={3} />
                                    </div>
                                  )}
                                  <Icon size={22} color={sel ? '#C29B40' : '#74777f'} strokeWidth={1.5} />
                                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: sel ? '#002349' : '#43474e' }}>
                                    {label}
                                  </div>
                                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 300, color: '#888' }}>
                                    {desc}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Bedrooms */}
                        <div>
                          <span style={labelStyle}>Bedrooms *</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {BEDROOMS.map(opt => (
                              <Pill key={opt} label={opt} selected={bedrooms === opt} onClick={() => setBedrooms(opt)} />
                            ))}
                          </div>
                        </div>

                        {/* Bathrooms */}
                        <div>
                          <span style={labelStyle}>Bathrooms *</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {BATHROOMS.map(opt => (
                              <Pill key={opt} label={opt} selected={bathrooms === opt} onClick={() => setBathrooms(opt)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Step 2: Budget + Areas ── */}
                    {step === 2 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                        <div>
                          <span style={labelStyle}>Budget Range *</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {BUDGETS.map(opt => (
                              <Pill key={opt} label={opt} selected={budget === opt} onClick={() => setBudget(opt)} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span style={labelStyle}>Areas of Interest</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {AREAS.map(opt => (
                              <Pill key={opt} label={opt} selected={areas === opt} onClick={() => setAreas(opt)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Step 3: Timeline + Lender ── */}
                    {step === 3 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                        <div>
                          <span style={labelStyle}>When are you looking to buy? *</span>
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
                        <div>
                          <span style={labelStyle}>Are you working with a lender? *</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {LENDER.map(opt => (
                              <Pill key={opt} label={opt} selected={lender === opt} onClick={() => setLender(opt)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Step 4: Contact info ── */}
                    {step === 4 && (
                      <form id="search-form" onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '28px' }}>
                            <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                              <span style={labelStyle}>Full Name *</span>
                              <input
                                required
                                style={underline}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Jane Smith"
                                onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                                onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                              />
                            </div>
                            <div>
                              <span style={labelStyle}>Email</span>
                              <input
                                type="email"
                                style={underline}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="jane@example.com"
                                onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                                onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                              />
                            </div>
                            <div>
                              <span style={labelStyle}>Phone</span>
                              <input
                                type="tel"
                                style={underline}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="(480) 000-0000"
                                onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                                onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                              />
                            </div>
                            <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: '#bbb', margin: 0, lineHeight: 1.6 }}>
                                * We'll need at least one way to reach you — email or phone.
                              </p>
                            </div>
                          </div>
                          <div>
                            <span style={{ ...labelStyle, marginBottom: '8px' }}>Anything else Jaime should know? <span style={{ color: '#bbb', fontWeight: 300, letterSpacing: 0 }}>(optional)</span></span>
                            <textarea
                              value={notes}
                              onChange={e => setNotes(e.target.value)}
                              rows={3}
                              placeholder="Style preferences, must-haves, deal-breakers..."
                              style={{ ...underline, resize: 'vertical', paddingTop: '12px' }}
                              onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                              onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                            />
                          </div>
                        </div>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: '#bbb', marginTop: '20px', lineHeight: 1.6 }}>
                          Your information is never sold or shared. Jaime will reach out personally.
                        </p>
                      </form>
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
                    onClick={() => goTo((step - 1) as SearchStep, -1)}
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

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => canProceed && goTo((step + 1) as SearchStep, 1)}
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
                    type="submit"
                    form="search-form"
                    disabled={loading || !canProceed}
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700,
                      letterSpacing: '0.20em', textTransform: 'uppercase',
                      backgroundColor: !loading && canProceed ? '#002349' : 'rgba(0,35,73,0.25)',
                      color: '#ffffff', border: 'none',
                      padding: '18px 44px',
                      cursor: !loading && canProceed ? 'pointer' : 'default',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => { if (!loading && canProceed) e.currentTarget.style.backgroundColor = '#C29B40' }}
                    onMouseLeave={e => { if (!loading && canProceed) e.currentTarget.style.backgroundColor = '#002349' }}
                  >
                    {loading ? 'Sending…' : 'Send to Jaime'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
