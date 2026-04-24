import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { JAIME } from '@/lib/constants'

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // On non-homepage routes the header is always white (no transparent hero)
  const isHomePage = location.pathname === '/'
  const isWhite = !isHomePage || scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBookACall = () => {
    setMenuOpen(false)
    if (isHomePage) {
      document.getElementById('calendly')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#calendly')
    }
  }

  const linkColor = isWhite ? '#002349' : '#ffffff'
  const linkMuted = isWhite ? 'rgba(0,35,73,0.65)' : 'rgba(255,255,255,0.80)'

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-50"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          paddingLeft: '48px',
          paddingRight: '48px',
          paddingTop: '28px',
          paddingBottom: '28px',
        }}
        animate={{
          backgroundColor: isWhite ? '#ffffff' : 'rgba(0,0,0,0)',
          borderBottom: isWhite ? '1px solid #e5e7eb' : '1px solid transparent',
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Logo — left column, left-aligned */}
        <NavLink
          to="/"
          className="no-underline"
          style={{ position: 'relative', height: '41px', display: 'block', justifySelf: 'start' }}
        >
          <img
            src="/assets/logos/RLSIR_Horz_white.png"
            alt="Russ Lyon Sotheby's International Realty"
            style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', height: '41px', width: 'auto', opacity: isWhite ? 0 : 1, transition: 'opacity 0.5s ease' }}
          />
          <img
            src="/assets/logos/RLSIR_Horz_blue.png"
            alt="Russ Lyon Sotheby's International Realty"
            style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', height: '41px', width: 'auto', opacity: isWhite ? 1 : 0, transition: 'opacity 0.5s ease' }}
          />
        </NavLink>

        {/* Center nav — center column, truly centered on page */}
        <div className="hidden md:flex items-center" style={{ gap: '52px' }}>
          {[
            { label: 'Home', to: '/', exact: true },
            { label: 'Blog', to: '/blog', exact: false },
          ].map(({ label, to, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              style={({ isActive }) => ({
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? linkColor : linkMuted,
                transition: 'color 0.25s ease',
                borderBottom: isActive ? '1px solid #C29B40' : '1px solid transparent',
                paddingBottom: '2px',
              })}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = linkColor)}
              onMouseLeave={e => {
                const isActive = exact ? location.pathname === to : location.pathname.startsWith(to)
                ;(e.currentTarget as HTMLElement).style.color = isActive ? linkColor : linkMuted
              }}
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleBookACall}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: linkMuted,
              background: 'none',
              border: 'none',
              borderBottom: '1px solid transparent',
              paddingBottom: '2px',
              cursor: 'pointer',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = linkColor)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = linkMuted)}
          >
            Book a Call
          </button>
        </div>

        {/* Right: phone + CTA — right column, right-aligned */}
        <div className="hidden md:flex items-center" style={{ gap: '32px', justifySelf: 'end' }}>
          <a
            href={`tel:${JAIME.phone.replace(/\./g, '')}`}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: isWhite ? '#002349' : '#ffffff',
              textDecoration: 'none',
              transition: 'color 0.5s ease',
            }}
          >
            {JAIME.phone}
          </a>
          <button
            onClick={handleBookACall}
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              backgroundColor: '#C29B40',
              color: '#ffffff',
              border: 'none',
              padding: '14px 36px',
              cursor: 'pointer',
              borderRadius: 0,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d4af55')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C29B40')}
          >
            Call Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1 cursor-pointer bg-transparent border-none"
          style={{ color: isWhite ? '#002349' : '#ffffff', gridColumn: '3', justifySelf: 'end' }}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 z-40 md:hidden"
            style={{ top: '96px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 32px 28px', gap: '18px' }}>
              {[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }].map(({ label, to }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', color: isActive ? '#002349' : 'rgba(0,35,73,0.55)', fontWeight: isActive ? 700 : 400, padding: '8px 0', borderBottom: '1px solid rgba(0,35,73,0.06)' })}
                >
                  {label}
                </NavLink>
              ))}
              <button onClick={handleBookACall} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(0,35,73,0.06)', cursor: 'pointer', padding: '8px 0', color: 'rgba(0,35,73,0.55)', fontWeight: 400 }}>
                Book a Call
              </button>
              <a href={`tel:${JAIME.phone.replace(/\./g, '')}`} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', fontWeight: 700, color: '#002349', textDecoration: 'none', padding: '10px 0' }}>
                {JAIME.phone}
              </a>
              <img src="/assets/logos/RLSIR_Horz_blue.png" alt="Russ Lyon Sotheby's" style={{ width: '110px', opacity: 0.7, marginTop: '4px' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
