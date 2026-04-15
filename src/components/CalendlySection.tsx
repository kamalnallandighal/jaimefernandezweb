import { useEffect, useRef } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { JAIME } from '@/lib/constants'
import { useWindowWidth } from '@/lib/useWindowWidth'

function CalendlyWidget({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.head.appendChild(script)
    } else {
      if (window.Calendly && ref.current) {
        window.Calendly.initInlineWidget({
          url,
          parentElement: ref.current,
        })
      }
    }
  }, [url])

  return (
    <div
      ref={ref}
      className="calendly-inline-widget"
      data-url={`${url}?hide_event_type_details=1&hide_gdpr_banner=1`}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}

function CalendlyPlaceholder() {
  return (
    <div style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C29B40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontStyle: 'italic', color: '#002349', marginBottom: '12px' }}>
          Calendar Coming Soon
        </p>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', color: '#999', letterSpacing: '0.05em' }}>
          Calendly URL will be configured shortly
        </p>
      </div>
      <a
        href={`tel:${JAIME.phone.replace(/\./g, '')}`}
        style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', backgroundColor: '#002349', color: '#ffffff', textDecoration: 'none', padding: '20px 48px', display: 'inline-block' }}
      >
        Call to Book
      </a>
    </div>
  )
}

export default function CalendlySection() {
  const hasCalendly = JAIME.calendly && JAIME.calendly !== '#'
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <section id="calendly" style={{ backgroundColor: '#002349', padding: isMobile ? '80px 24px' : '128px 48px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 80px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: isMobile ? 'auto' : '700px',
          alignItems: 'stretch',
        }}>

          {/* Left */}
          <div style={{
            flex: isMobile ? '1 1 auto' : '0 0 420px',
            padding: isMobile ? '48px 32px' : '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: isMobile ? 'none' : '1px solid #f0eeea',
            borderBottom: isMobile ? '1px solid #f0eeea' : 'none',
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 4vw, 56px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', lineHeight: 1.15, margin: 0, marginBottom: '40px' }}>
              Secure Your Private Consultation
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#43474e', lineHeight: 1.7, marginBottom: '40px' }}>
              Select a date and time for an introductory consultation to discuss your luxury real estate goals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {[
                { icon: Phone, text: JAIME.phone, href: `tel:${JAIME.phone.replace(/\./g, '')}` },
                { icon: Mail,  text: JAIME.email, href: `mailto:${JAIME.email}` },
                { icon: MapPin, text: JAIME.office, href: undefined },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <Icon size={18} color="#C29B40" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '3px' }} />
                  {href ? (
                    <a href={href} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', fontWeight: 400, color: '#002349', textDecoration: 'none', lineHeight: 1.5 }}>{text}</a>
                  ) : (
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', fontWeight: 400, color: '#002349', lineHeight: 1.5 }}>{text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Calendly embed */}
          <div style={{ flex: 1, backgroundColor: '#fafafa', overflow: 'hidden', minHeight: isMobile ? '600px' : 'auto' }}>
            {hasCalendly
              ? <CalendlyWidget url={JAIME.calendly} />
              : <CalendlyPlaceholder />
            }
          </div>
        </div>
      </div>
    </section>
  )
}
