import { NavLink } from 'react-router-dom'
import { JAIME } from '@/lib/constants'
import { useWindowWidth } from '@/lib/useWindowWidth'

export default function Footer() {
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <footer style={{ backgroundColor: '#002349', padding: isMobile ? '64px 24px' : '96px 48px', color: '#ffffff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
          gap: isMobile ? '48px' : '64px',
          marginBottom: '64px',
        }}>

          {/* Brand + legal */}
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? '28px' : '36px', fontStyle: 'italic', color: '#ffffff', marginBottom: '32px' }}>
              Jaime Fernandez
            </div>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.40)', lineHeight: 1.8, maxWidth: '480px', margin: 0 }}>
              Jaime Fernandez is a licensed real estate professional with Russ Lyon Sotheby's International Realty. License {JAIME.license}. Sotheby's International Realty and the Sotheby's International Realty logo are registered service marks used with permission. Each office is independently owned and operated. Information deemed reliable but not guaranteed. Equal Housing Opportunity.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '32px' }}>
              Navigate
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Blog', to: '/blog' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.60)')}
                  >{label}</NavLink>
                </li>
              ))}
              {['Book a Call', 'Home Valuation'].map(label => (
                <li key={label}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)', cursor: 'default' }}>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '32px' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['Privacy Policy', 'Terms of Service', 'Fair Housing', 'Accessibility'].map(label => (
                <li key={label}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)' }}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '20px' : '0',
        }}>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '10px', fontWeight: 400, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)' }}>
            © 2025 Jaime Fernandez. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { label: 'Instagram', href: JAIME.instagram },
              { label: 'Facebook',  href: '#' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C29B40')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.60)')}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
