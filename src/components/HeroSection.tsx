import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWindowWidth } from '@/lib/useWindowWidth'

const POSTER = 'https://images.unsplash.com/photo-1710793311332-a2c7d3c3ad3f?w=1920&q=80'

const STATS = [
  { value: '320+', label: 'Homes Sold' },
  { value: '$2.1B', label: 'Volume' },
  { value: '#1',   label: 'Scottsdale Agent' },
]

export default function HeroSection() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const navigate = useNavigate()


  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        height: '100svh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '94px',
        paddingBottom: '110px',
      }}
    >
      {/* Background — video + poster fallback */}
      <div className="absolute inset-0 z-0">
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <video
          className="absolute inset-0 w-full h-full object-cover hero-video"
          autoPlay muted loop playsInline aria-hidden="true"
          src="/assets/videos/hero.mov"
          poster={POSTER}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 38%)' }}
        />
      </div>

      {/* Hero content */}
      <div
        className="relative z-10 w-full"
        style={{
          paddingLeft: isMobile ? '24px' : 'clamp(48px, 8vw, 120px)',
          paddingRight: isMobile ? '24px' : '24px',
          transform: 'translateY(-5%)',
        }}
      >
        <div style={{ maxWidth: isMobile ? '100%' : '1100px' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}
          >
            <span style={{ display: 'block', width: '32px', height: '1px', backgroundColor: '#C29B40', flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: isMobile ? '10px' : '12px',
              fontWeight: 600,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#C29B40',
            }}>
              Scottsdale Luxury Real Estate
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.38 }}
            style={{
              fontFamily: "'Tenor Sans', sans-serif",
              fontSize: isMobile ? 'clamp(42px, 11vw, 64px)' : 'clamp(60px, 8vw, 108px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              lineHeight: 0.92,
              color: '#ffffff',
              margin: 0,
              marginBottom: '44px',
              textShadow: '0 2px 24px rgba(0,0,0,0.35)',
            }}
          >
            Jaime
            <br />
            <span style={{
              marginLeft: isMobile ? '0' : 'clamp(52px, 8.5vw, 132px)',
              display: 'inline-block',
            }}>
              Fernandez
            </span>
          </motion.h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72 }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              gap: isMobile ? '14px' : '20px',
              maxWidth: isMobile ? '320px' : 'none',
            }}
          >
            <button
              onClick={() => navigate('/home-eval')}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                backgroundColor: '#C29B40',
                color: '#002349',
                border: 'none',
                padding: isMobile ? '18px 32px' : '20px 52px',
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d4af55')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C29B40')}
            >
              Free Home Valuation
            </button>
            <button
              onClick={() => navigate('/start-your-search')}
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1.5px solid rgba(255,255,255,0.65)',
                padding: isMobile ? '18px 32px' : '20px 52px',
                cursor: 'pointer',
                borderRadius: 0,
                backdropFilter: 'blur(6px)',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.90)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)'
              }}
            >
              Start Your Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stat bar */}
      <motion.div
        className="absolute bottom-0 left-0 w-full z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1 }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(194,155,64,0.45)',
          paddingTop: isMobile ? '24px' : '36px',
          paddingBottom: isMobile ? '24px' : '36px',
          paddingLeft: isMobile ? '24px' : '64px',
          paddingRight: isMobile ? '24px' : '64px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '0 28px' : '0 80px' }}>
          {STATS.map((stat, i) => (
            <div key={stat.value} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {i > 0 && !isMobile && (
                <span style={{
                  position: 'absolute',
                  left: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1px',
                  height: '40px',
                  backgroundColor: 'rgba(194,155,64,0.30)',
                }} />
              )}
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: isMobile ? '32px' : '44px',
                fontStyle: 'italic',
                color: '#C29B40',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {stat.value}
              </span>
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.80)',
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
