import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { HelmetProvider } from 'react-helmet-async'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StickyHeader from '@/components/StickyHeader'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import MagicZipSection from '@/components/MagicZipSection'
import HomeEvalSection from '@/components/HomeEvalSection'
import RestaurantGuideSection from '@/components/RestaurantGuideSection'
import ReviewsSection from '@/components/ReviewsSection'
import CalendlySection from '@/components/CalendlySection'
import Footer from '@/components/Footer'
import Resources from '@/pages/Resources'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import BlogAdmin from '@/pages/BlogAdmin'

gsap.registerPlugin(ScrollTrigger)

// Sections to reveal (hero is excluded — already animated by Framer Motion on load)
const REVEAL_SECTIONS = [
  '#about',
  '#magic-zip',
  '#home-eval',
  '#restaurant',
  '#reviews',
  '#calendly',
]

function HomePage() {
  // Keep ScrollTrigger positions in sync with Lenis virtual scroll
  useLenis(() => { ScrollTrigger.update() })

  useEffect(() => {
    // Prevent mobile browser bar resize from triggering ScrollTrigger recalcs
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      REVEAL_SECTIONS.forEach(selector => {
        const el = document.querySelector<HTMLElement>(selector)
        if (!el) return

        // 1. Section slides up and fades in as a unit
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%', // fires when section top is 15% into viewport
              once: true,
            },
          }
        )

        // 2. Stagger direct children — y only (parent opacity carries them,
        //    avoids layered opacity conflicts while still creating depth)
        const children = Array.from(el.children) as HTMLElement[]
        if (children.length >= 2) {
          gsap.fromTo(
            children,
            { y: 24 },
            {
              y: 0,
              duration: 0.70,
              stagger: 0.15,
              ease: 'power2.out',
              delay: 0.08,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              },
            }
          )
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MagicZipSection />
      <HomeEvalSection />
      <RestaurantGuideSection />
      <ReviewsSection />
      <CalendlySection />
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </HelmetProvider>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  // Disable browser scroll restoration so it doesn't fight Lenis
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, lenis])

  return null
}

function AppShell() {
  const location = useLocation()
  const isAdmin = location.pathname === '/blog/admin'
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <StickyHeader />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/admin" element={<BlogAdmin />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
    </>
  )
}
