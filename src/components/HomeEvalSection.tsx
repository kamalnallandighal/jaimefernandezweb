import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Home, Building2, Building, Gem, Lock, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { useWindowWidth } from '@/lib/useWindowWidth'

// ─── Constants ───────────────────────────────────────────────────────────────

const PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined
const SHEET_URL  = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

const PROPERTY_TYPES = [
  { id: 'single-family', icon: Home,      label: 'Single Family',   desc: 'Detached residential home' },
  { id: 'townhouse',     icon: Building2,  label: 'Townhouse',       desc: 'Multi-level attached home' },
  { id: 'condo',         icon: Building,   label: 'Condo',           desc: 'Condominium or apartment'  },
  { id: 'custom-luxury', icon: Gem,        label: 'Custom / Luxury', desc: 'Estate or custom build'    },
] as const

type PropertyType = typeof PROPERTY_TYPES[number]['id']
type Step = 1 | 2 | 3

const labelStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: '#999', display: 'block', marginBottom: '8px',
}

const underlineInput: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '17px', fontWeight: 300,
  color: '#002349', backgroundColor: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(0,35,73,0.25)',
  borderRadius: 0, outline: 'none',
  width: '100%', padding: '12px 0',
}

// ─── Isolated address input ───────────────────────────────────────────────────
// Uses PlaceAutocompleteElement (new Places API, v=alpha).
// The PAC element IS its own input — appended into containerRef.
// confirmedRef avoids stale-closure reads inside event listeners.
// Step 1 is never unmounted (display:block/none) — see parent JSX.

interface AddressInputProps {
  onConfirmed: (address: string) => void
  onCleared: () => void
}

function AddressInput({ onConfirmed, onCleared }: AddressInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const confirmedRef = useRef(false) // mirrors confirmed state without stale closure risk

  const [error,  setError]  = useState('')
  const [status, setStatus] = useState<'idle' | 'confirmed' | 'error'>('idle')

  useEffect(() => {
    // ── Fallback: no key → skip PAC entirely (handled in JSX below)
    if (!PLACES_KEY) return

    // ── Load Maps script once (v=alpha required for PlaceAutocompleteElement)
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${PLACES_KEY}&v=alpha&loading=async`
      s.async = true
      document.head.appendChild(s)
    }

    // ── Inject styles for the PAC element (once per document)
    const STYLE_ID = 'gmp-pac-overrides'
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = `
        gmp-place-autocomplete {
          width: 100%;
          display: block;
          --gmp-mat-outlined-input-border-radius: 0px;
          --gmp-filled-input-border-radius: 0px;
        }
        gmp-place-autocomplete input {
          font-family: 'Source Sans 3', sans-serif !important;
          font-size: 18px !important;
          font-weight: 300 !important;
          color: #002349 !important;
          background: transparent !important;
          border: none !important;
          border-bottom: 1px solid rgba(0,35,73,0.25) !important;
          border-radius: 0 !important;
          outline: none !important;
          width: 100% !important;
          padding: 12px 0 !important;
          box-shadow: none !important;
        }
        gmp-place-autocomplete input:focus {
          border-bottom-color: #002349 !important;
        }
      `
      document.head.appendChild(style)
    }

    let mounted = true

    const init = async () => {
      // Poll until importLibrary is available (script still loading)
      while (!window.google?.maps?.importLibrary) {
        await new Promise(r => setTimeout(r, 100))
        if (!mounted) return
      }
      if (!mounted || !containerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { PlaceAutocompleteElement } = await (window.google.maps.importLibrary('places') as Promise<any>)
      if (!mounted || !containerRef.current) return

      // Clear any children from a previous mount (Strict Mode double-invoke safety)
      containerRef.current.innerHTML = ''

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pac: any = new PlaceAutocompleteElement({
        types: ['address'],
        componentRestrictions: { country: 'us' },
      })
      pac.placeholder = 'Start typing your address…'
      containerRef.current.appendChild(pac)

      // Reset confirmation when user edits the field
      pac.addEventListener('input', () => {
        if (confirmedRef.current) {
          confirmedRef.current = false
          setStatus('idle')
          setError('')
          onCleared()
        }
      })

      // Handle place selection
      pac.addEventListener('gmp-select', async (event: Event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { placePrediction } = event as any
        if (!placePrediction) return
        try {
          const place = placePrediction.toPlace()
          await place.fetchFields({ fields: ['formattedAddress', 'addressComponents'] })

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasStreet = place.addressComponents?.some((c: any) =>
            c.types.includes('street_number')
          )
          if (!hasStreet) {
            setError('Please select a specific property address.')
            setStatus('error')
            confirmedRef.current = false
            return
          }
          confirmedRef.current = true
          setError('')
          setStatus('confirmed')
          onConfirmed(place.formattedAddress ?? '')
        } catch {
          setError('Could not load address details. Please try again.')
          setStatus('error')
        }
      })
    }

    init()

    return () => {
      mounted = false
      // Remove PAC element on unmount so Strict Mode remount gets a clean slate
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [onConfirmed, onCleared])

  return (
    <div>
      <label style={labelStyle}>Property Address</label>

      {/* PlaceAutocompleteElement mounts here when key is present */}
      {PLACES_KEY && (
        <div ref={containerRef} />
      )}

      {/* Fallback uncontrolled input when no API key */}
      {!PLACES_KEY && (
        <input
          type="text"
          autoComplete="off"
          placeholder="Start typing your address…"
          onBlur={e => {
            if (e.currentTarget.value.trim().length > 5) {
              confirmedRef.current = true
              setStatus('confirmed')
              setError('')
              onConfirmed(e.currentTarget.value.trim())
            }
          }}
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '18px', fontWeight: 300,
            color: '#002349', backgroundColor: 'transparent',
            border: 'none', borderRadius: 0, outline: 'none',
            width: '100%', padding: '12px 0',
            borderBottom: '1px solid rgba(0,35,73,0.25)',
          }}
        />
      )}

      {error && (
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', color: '#c0392b', margin: '8px 0 0' }}>
          {error}
        </p>
      )}
      {status === 'confirmed' && !error && (
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', color: '#C29B40', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Check size={12} strokeWidth={2.5} /> Address confirmed
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
        <Lock size={13} color="#bbb" strokeWidth={1.5} />
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', color: '#bbb' }}>
          Your information is kept strictly confidential
        </span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HomeEvalSection() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [step,        setStep]        = useState<Step>(1)
  const [_direction,  setDirection]   = useState(1)
  const [submitted,   setSubmitted]   = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [animating,   setAnimating]   = useState(false)

  // Step 1 — address committed only on confirmed
  const [confirmedAddress, setConfirmedAddress] = useState('')
  const addressValid = confirmedAddress !== ''

  // Step 2
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null)

  // Step 3
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [tcpa,  setTcpa]  = useState(false)

  // Stable callbacks for AddressInput — useCallback so they never change identity
  const handleAddressConfirmed = useCallback((addr: string) => setConfirmedAddress(addr), [])
  const handleAddressCleared   = useCallback(() => setConfirmedAddress(''), [])

  const canProceed = step === 1 ? addressValid : step === 2 ? propertyType !== null : name.trim() !== '' && phone.trim() !== '' && email.trim() !== '' && tcpa

  const goTo = (next: Step, dir: number) => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setStep(next)
    setTimeout(() => setAnimating(false), 320)
  }

  const handleSubmit = async () => {
    if (!canProceed || submitting) return
    setSubmitting(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Address: confirmedAddress,
            'Property Type': propertyType,
            Name: name, Phone: phone, Email: email,
            'Submitted At': new Date().toISOString(),
          }),
        })
      }
    } catch { /* fail silently */ } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const stepLabels: Record<Step, string> = {
    1: 'Property Address',
    2: 'Property Type',
    3: 'Your Information',
  }

  return (
    <section id="home-eval" style={{ backgroundColor: '#ffffff', padding: isMobile ? '80px 24px' : '128px 48px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Section eyebrow + headline */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.30em', textTransform: 'uppercase',
            color: '#C29B40', display: 'block', marginBottom: '16px',
          }}>
            Complimentary · Expert · Delivered Within 24 Hours
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontStyle: 'italic', fontWeight: 300,
            color: '#002349', margin: 0, marginBottom: '16px',
          }}>
            Know Your Home's True Value
          </h2>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '15px', fontWeight: 300,
            color: '#666', lineHeight: 1.7, margin: 0,
          }}>
            A personalized market analysis from Scottsdale's #1 agent — not an algorithm.
          </p>
        </div>

        {/* Success */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,35,73,0.10)', padding: '80px 56px', textAlign: 'center' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
              <Check size={28} color="#C29B40" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', fontStyle: 'italic', fontWeight: 300, color: '#002349', margin: 0, marginBottom: '20px' }}>
              Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
            </h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#666', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
              Jaime will personally review your property and be in touch within 24 hours with your complimentary valuation.
            </p>
          </motion.div>

        ) : (

        <div style={{ backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,35,73,0.10)', overflow: 'hidden' }}>

          {/* Gold progress bar */}
          <div style={{ height: '3px', backgroundColor: 'rgba(194,155,64,0.15)' }}>
            <div style={{
              height: '100%', backgroundColor: '#C29B40',
              width: `${(step / 3) * 100}%`,
              transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>

          {/* Step label row */}
          <div style={{ padding: isMobile ? '20px 24px 0' : '28px 56px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb' }}>
              Step {step} of 3
            </span>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C29B40' }}>
              {stepLabels[step]}
            </span>
          </div>

          {/* Step content — simple CSS show/hide, no AnimatePresence */}
          <div style={{ padding: isMobile ? '32px 24px 0' : '44px 56px 0' }}>

            {/* Step 1 — always mounted so the uncontrolled input persists */}
            <div style={{ display: step === 1 ? 'block' : 'none', minHeight: '320px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 4vw, 42px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', margin: 0, marginBottom: '52px', lineHeight: 1.2 }}>
                What is the address<br />of your property?
              </h3>
              {/* AddressInput is isolated — typing here NEVER triggers parent re-renders */}
              <AddressInput
                onConfirmed={handleAddressConfirmed}
                onCleared={handleAddressCleared}
              />
            </div>

            {/* Step 2 */}
            {step === 2 && (
              <div style={{ minHeight: '320px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 4vw, 42px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', margin: 0, marginBottom: '40px', lineHeight: 1.2 }}>
                  What type of property<br />are you looking to value?
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {PROPERTY_TYPES.map(({ id, icon: Icon, label, desc }) => {
                    const sel = propertyType === id
                    return (
                      <button
                        key={id}
                        onClick={() => setPropertyType(id)}
                        style={{
                          backgroundColor: sel ? 'rgba(194,155,64,0.04)' : '#fff',
                          padding: '28px 24px',
                          border: sel ? '1.5px solid #C29B40' : '1px solid rgba(0,35,73,0.12)',
                          cursor: 'pointer', textAlign: 'left',
                          display: 'flex', flexDirection: 'column', gap: '10px',
                          position: 'relative',
                          transition: 'border-color 0.2s ease, background-color 0.2s ease',
                        }}
                        onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(194,155,64,0.50)' }}
                        onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(0,35,73,0.12)' }}
                      >
                        {sel && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#C29B40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={10} color="#fff" strokeWidth={3} />
                          </div>
                        )}
                        <Icon size={26} color={sel ? '#C29B40' : '#74777f'} strokeWidth={1.5} />
                        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: sel ? '#002349' : '#43474e' }}>
                          {label}
                        </div>
                        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', fontWeight: 300, color: '#888', lineHeight: 1.4 }}>
                          {desc}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ minHeight: '320px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 4vw, 42px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', margin: 0, marginBottom: '40px', lineHeight: 1.2 }}>
                  Where should we send<br />your valuation?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '36px' }}>
                  {([
                    { id: 'eval-name',  type: 'text',  label: 'Full Name',      placeholder: 'Jane Smith',           value: name,  set: setName  },
                    { id: 'eval-phone', type: 'tel',   label: 'Phone Number',   placeholder: '(480) 555-0100',       value: phone, set: setPhone },
                    { id: 'eval-email', type: 'email', label: 'Email Address',  placeholder: 'jane@example.com',     value: email, set: setEmail },
                  ] as const).map(({ id, type, label, placeholder, value, set }) => (
                    <div key={id}>
                      <label style={labelStyle} htmlFor={id}>{label}</label>
                      <input
                        id={id} type={type} placeholder={placeholder}
                        value={value}
                        onChange={e => set(e.target.value)}
                        style={underlineInput}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = '#002349')}
                        onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(0,35,73,0.25)')}
                      />
                    </div>
                  ))}
                </div>

                {/* TCPA */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <div
                    role="checkbox" aria-checked={tcpa} tabIndex={0}
                    onClick={() => setTcpa(t => !t)}
                    onKeyDown={e => e.key === ' ' && setTcpa(t => !t)}
                    style={{
                      width: '16px', height: '16px', flexShrink: 0, marginTop: '2px',
                      border: tcpa ? '1.5px solid #C29B40' : '1.5px solid rgba(0,35,73,0.30)',
                      backgroundColor: tcpa ? '#C29B40' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    {tcpa && <Check size={10} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: '#888', lineHeight: 1.65, userSelect: 'none' }}>
                    I agree to be contacted by Jaime Fernandez via call, email, and text for real estate services. To opt out, you can reply "stop" at any time or reply "help" for assistance. You can also click the unsubscribe link in the emails. Message and data rates may apply. Message frequency may vary.
                  </span>
                </label>
              </div>
            )}
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
                onClick={() => goTo((step - 1) as Step, -1)}
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

            {step < 3 ? (
              <button
                onClick={() => canProceed && goTo((step + 1) as Step, 1)}
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
                onClick={handleSubmit}
                disabled={!canProceed || submitting}
                style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.20em', textTransform: 'uppercase',
                  backgroundColor: canProceed && !submitting ? '#002349' : 'rgba(0,35,73,0.25)',
                  color: '#ffffff', border: 'none',
                  padding: '18px 44px',
                  cursor: canProceed && !submitting ? 'pointer' : 'default',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={e => { if (canProceed) e.currentTarget.style.backgroundColor = 'rgba(0,35,73,0.82)' }}
                onMouseLeave={e => { if (canProceed) e.currentTarget.style.backgroundColor = '#002349' }}
              >
                {submitting ? 'Sending…' : 'Get My Valuation'}
              </button>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
