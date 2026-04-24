# Session 11 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 8 changes: header polish, Tenor Sans hero font, email-OR-phone form validation, MagicZip stat replacement, Home Eval wizard, and new /85254 subpage.

**Architecture:** All changes are isolated to existing React components and one new page file. No new shared utilities needed — each task is self-contained. The new /85254 page follows the exact pattern of existing hidden subpages.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide React, React Router DOM, Google Fonts

---

## File Map

| File | Action | What changes |
|---|---|---|
| `index.html` | Modify | Add Tenor Sans to Google Fonts import |
| `src/components/StickyHeader.tsx` | Modify | Phone font 13→17px, logo height matches button |
| `src/components/HeroSection.tsx` | Modify | Tenor Sans font on h1, CTA navigates to /home-eval |
| `src/components/MagicZipSection.tsx` | Modify | Replace 2-stat grid with 3-callout feature list, add /85254 link |
| `src/pages/StartSearch.tsx` | Modify | Step 4: email OR phone required (not both) |
| `src/pages/HomeEvalPage.tsx` | Rewrite | 4-step wizard: Address → Timeline → Contact → Love Note |
| `src/pages/MagicZipPage.tsx` | Create | New /85254 subpage: hero + story + feature list + email form |
| `src/App.tsx` | Modify | Add `/85254` route pointing to MagicZipPage |

---

### Task 1: Add Tenor Sans Google Font

**Files:**
- Modify: `index.html:11`

- [ ] **Step 1: Add Tenor Sans to the Google Fonts URL**

Replace line 11 in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Source+Sans+3:wght@300;400;500;700&family=Tenor+Sans&display=swap" rel="stylesheet" />
```

(Add `&family=Tenor+Sans` before `&display=swap` — Tenor Sans only has weight 400, no variants needed.)

- [ ] **Step 2: Verify font loads**

Run `npx tsc --noEmit` — expect 0 errors.
Then open dev server (`npm run dev`) and in browser devtools → Network tab, filter "tenor" — confirm `fonts.gstatic.com` request for Tenor Sans appears.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Tenor Sans Google Font"
```

---

### Task 2: Header — Phone Size + Logo Height

**Files:**
- Modify: `src/components/StickyHeader.tsx`

- [ ] **Step 1: Increase phone number font size**

In `StickyHeader.tsx`, find the phone `<a>` element (around line 128–141). Change `fontSize: '13px'` to `fontSize: '17px'`:

```tsx
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
```

- [ ] **Step 2: Match logo height to Call Now button**

The Call Now button has `padding: '14px 36px'` + `fontSize: '13px'` ≈ 41px natural height.

Find the `<NavLink>` logo container (line ~55–70). Update the container and both `<img>` tags:

```tsx
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
```

(Remove the fixed `width: '170px'` from container and images — width is now auto-derived from the 41px height.)

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/StickyHeader.tsx
git commit -m "feat: header — larger phone number, logo height matches Call Now button"
```

---

### Task 3: Hero Headline — Tenor Sans Font + CTA to /home-eval

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] **Step 1: Swap h1 font to Tenor Sans uppercase**

Find the `<motion.h1>` element (around line 90–114). Replace its style:

```tsx
<motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.0, delay: 0.38 }}
  style={{
    fontFamily: "'Tenor Sans', sans-serif",
    fontSize: isMobile ? 'clamp(52px, 14vw, 80px)' : 'clamp(76px, 10vw, 136px)',
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
```

- [ ] **Step 2: Update "Free Home Valuation" CTA to navigate to /home-eval**

Find the first CTA button (around line 129–148). Change `onClick` from `() => scrollTo('home-eval')` to `() => navigate('/home-eval')`:

```tsx
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
```

(`navigate` is already imported via `useNavigate` at the top of HeroSection.tsx.)

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: hero — Tenor Sans uppercase headline, Free Home Valuation navigates to /home-eval"
```

---

### Task 4: MagicZip — Replace Stats with Feature Callouts + /85254 Link

**Files:**
- Modify: `src/components/MagicZipSection.tsx`

- [ ] **Step 1: Add new imports**

At the top of `MagicZipSection.tsx`, update the import line. Add `GraduationCap, MapPin, Compass` from lucide-react and `useNavigate` from react-router-dom:

```tsx
import { GraduationCap, MapPin, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWindowWidth } from '@/lib/useWindowWidth'
```

- [ ] **Step 2: Add useNavigate hook inside component**

At the top of the `MagicZipSection` function body, after `const isMobile = ...`:

```tsx
const navigate = useNavigate()
```

- [ ] **Step 3: Replace the 2-stat grid with feature callouts**

Find the `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>` block (around line 47–54) and replace it entirely with this feature callout list, plus the /85254 link below:

```tsx
{/* Feature callouts — replace old stat grid */}
<div style={{ display: 'flex', flexDirection: 'column' }}>
  {[
    {
      icon: GraduationCap,
      label: 'A-Rated Schools',
      desc: 'Scottsdale Unified — top 5 school district in Arizona.',
    },
    {
      icon: MapPin,
      label: 'Best of Both Cities',
      desc: 'Scottsdale address. Phoenix city tax rate.',
    },
    {
      icon: Compass,
      label: 'Prime Location',
      desc: 'Minutes to Kierland, Old Town & DC Ranch.',
    },
  ].map(({ icon: Icon, label, desc }, i) => (
    <div
      key={label}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '20px 0',
        borderTop: i === 0 ? '1px solid rgba(0,35,73,0.08)' : 'none',
        borderBottom: '1px solid rgba(0,35,73,0.08)',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <Icon size={18} color="#C29B40" strokeWidth={1.5} />
      </div>
      <div>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#002349', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', fontWeight: 300, color: '#666', lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>
    </div>
  ))}
</div>

{/* Link to /85254 subpage */}
<button
  onClick={() => navigate('/85254')}
  style={{
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.20em',
    textTransform: 'uppercase',
    color: '#C29B40',
    background: 'none',
    border: 'none',
    padding: '16px 0 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'opacity 0.2s ease',
  }}
  onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
>
  Learn more about 85254 →
</button>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/MagicZipSection.tsx
git commit -m "feat: magic zip — replace unverified stats with feature callouts, add /85254 link"
```

---

### Task 5: StartSearch — Email OR Phone Required

**Files:**
- Modify: `src/pages/StartSearch.tsx`

- [ ] **Step 1: Update `canProceed` for step 4**

Find the `canProceed` declaration (around line 96–100). Update the step 4 condition:

```tsx
const canProceed =
  step === 1 ? bedrooms !== '' && bathrooms !== '' :
  step === 2 ? budget !== '' :
  step === 3 ? timeline !== '' && lender !== '' :
  name.trim() !== '' && (email.trim() !== '' || phone.trim() !== '')
```

- [ ] **Step 2: Update step 4 form fields**

Find the step 4 form JSX (around line 373–431). Update the Email and Phone field sections:

```tsx
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
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/StartSearch.tsx
git commit -m "feat: start search — email or phone required (not both)"
```

---

### Task 6: Home Eval Page — 4-Step Wizard

**Files:**
- Rewrite: `src/pages/HomeEvalPage.tsx`

- [ ] **Step 1: Replace HomeEvalPage.tsx with the 4-step wizard**

Full replacement of `src/pages/HomeEvalPage.tsx`:

```tsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'
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

  const [address,  setAddress]  = useState('')
  const [timeline, setTimeline] = useState('')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [loveNote, setLoveNote] = useState('')

  const canProceed =
    step === 1 ? address.trim() !== '' :
    step === 2 ? true :  // timeline is optional — always can proceed
    step === 3 ? name.trim() !== '' && (email.trim() !== '' || phone.trim() !== '') :
    true // step 4 love note is optional

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
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(42px, 6vw, 80px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 28px' }}>
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
                  {/* Skip link on step 2 and 4 */}
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/HomeEvalPage.tsx
git commit -m "feat: home eval — 4-step wizard (address, timeline, contact, love note)"
```

---

### Task 7: New /85254 Subpage

**Files:**
- Create: `src/pages/MagicZipPage.tsx`

- [ ] **Step 1: Create MagicZipPage.tsx**

```tsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Compass, Check } from 'lucide-react'
import Footer from '@/components/Footer'
import { useWindowWidth } from '@/lib/useWindowWidth'

const SHEET_URL = import.meta.env.VITE_SHEET_BEST_URL as string | undefined

const FEATURES = [
  {
    icon: GraduationCap,
    label: 'A-Rated Schools',
    desc: 'Scottsdale Unified — top 5 school district in Arizona. 29 of 30 schools rated A or B.',
  },
  {
    icon: MapPin,
    label: 'Best of Both Cities',
    desc: 'Scottsdale mailing address. Phoenix city limits. The tax rate advantage is real.',
  },
  {
    icon: Compass,
    label: 'Prime Location',
    desc: 'Minutes to Kierland Commons, Old Town Scottsdale, DC Ranch, and the valley\'s finest dining.',
  },
]

const underline: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '17px', fontWeight: 300,
  color: '#002349', backgroundColor: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(0,35,73,0.25)',
  borderRadius: 0, outline: 'none',
  width: '100%', padding: '12px 0',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: '#999', display: 'block', marginBottom: '14px',
}

export default function MagicZipPage() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const canSubmit = name.trim() !== '' && email.trim() !== ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, source: '85254 Page', date: new Date().toISOString() }),
        })
      }
    } catch (_) { /* fail silently */ }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>The 85254 Advantage | Jaime Fernandez</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero — navy */}
      <section style={{ backgroundColor: '#002349', padding: isMobile ? '120px 24px 80px' : '160px 48px 100px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '28px' }}>
              The Magic Zip Code
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22 }}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(48px, 7vw, 96px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.0, margin: '0 0 36px' }}
          >
            The 85254<br />
            <span style={{ color: '#C29B40' }}>Advantage</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: 0 }}
          >
            A pocket of Arizona with a prestigious Scottsdale mailing address that sits within Phoenix city limits — delivering the best of both worlds to homeowners who know where to look.
          </motion.p>
        </div>
      </section>

      {/* Story + Feature list — white */}
      <section style={{ backgroundColor: '#ffffff', padding: isMobile ? '80px 24px' : '128px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '64px' : '96px', alignItems: 'start' }}>

          {/* Left: story */}
          <div>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
              Why It Matters
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontStyle: 'italic', fontWeight: 300, color: '#002349', lineHeight: 1.1, margin: '0 0 36px' }}>
              Scottsdale Prestige.<br />Phoenix Economics.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.8, margin: 0 }}>
                The 85254 zip code occupies a unique geographic anomaly: a Scottsdale mailing address on a property that technically sits within Phoenix city limits. For homeowners, this translates into meaningful financial advantages — lower municipal tax rates and utility costs — while retaining everything that makes a Scottsdale address desirable.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.8, margin: 0 }}>
                The Scottsdale Unified School District — which serves 85254 — holds an "A" rating from the state of Arizona and ranks among the top 5 school districts in the entire state (Niche, 2026). With 29 of 30 schools rated A or B, it's consistently one of the strongest academic environments in the Southwest.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.8, margin: 0 }}>
                Jaime has closed more transactions in this corridor than any other agent — and knows the streets, the lot sizes, the hidden value, and the pockets within 85254 that consistently outperform the rest of the market.
              </p>
            </div>

            {/* Pull quote */}
            <div style={{ borderLeft: '1px solid rgba(194,155,64,0.35)', paddingLeft: '28px', marginTop: '48px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px, 2vw, 22px)', fontStyle: 'italic', color: '#C29B40', lineHeight: 1.5, margin: 0 }}>
                "The best-kept secret in Scottsdale is actually in Phoenix."
              </p>
            </div>
          </div>

          {/* Right: feature callouts */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    padding: '28px 0',
                    borderTop: i === 0 ? '1px solid rgba(0,35,73,0.08)' : 'none',
                    borderBottom: '1px solid rgba(0,35,73,0.08)',
                  }}
                >
                  <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#C29B40" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#002349', marginBottom: '8px' }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: '#666', lineHeight: 1.7 }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Let's Stay in Touch — navy */}
      <section style={{ backgroundColor: '#002349', padding: isMobile ? '80px 24px' : '128px 48px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: '#C29B40', display: 'block', marginBottom: '24px' }}>
            Stay Ahead
          </span>

          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(194,155,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                <Check size={28} color="#C29B40" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 48px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', marginBottom: '16px' }}>
                You're on the list.
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.75 }}>
                Jaime will send you 85254 market intel, off-market opportunities, and neighborhood updates.
              </p>
            </motion.div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 56px)', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, margin: '0 0 16px' }}>
                Stay Ahead of the<br />85254 Market
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.60)', lineHeight: 1.75, marginBottom: '48px' }}>
                Get off-market opportunities, neighborhood intel, and market updates — directly from Jaime.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <span style={{ ...labelStyle, color: 'rgba(255,255,255,0.50)' }}>Your Name *</span>
                  <input
                    required
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.70)')}
                    onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)')}
                  />
                </div>
                <div>
                  <span style={{ ...labelStyle, color: 'rgba(255,255,255,0.50)' }}>Email Address *</span>
                  <input
                    required
                    type="email"
                    style={{ ...underline, color: '#ffffff', borderBottomColor: 'rgba(255,255,255,0.25)' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.70)')}
                    onBlur={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.20em', textTransform: 'uppercase',
                    backgroundColor: loading || !canSubmit ? 'rgba(194,155,64,0.35)' : '#C29B40',
                    color: '#ffffff', border: 'none',
                    padding: '22px 64px',
                    cursor: loading || !canSubmit ? 'default' : 'pointer',
                    transition: 'background-color 0.2s ease',
                    marginTop: '8px',
                  }}
                  onMouseEnter={e => { if (!loading && canSubmit) (e.currentTarget as HTMLElement).style.backgroundColor = '#d4af55' }}
                  onMouseLeave={e => { if (!loading && canSubmit) (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40' }}
                >
                  {loading ? 'Sending...' : 'Stay Connected'}
                </button>
              </form>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.35)', marginTop: '20px' }}>
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/MagicZipPage.tsx
git commit -m "feat: add /85254 subpage — story, feature callouts, email form"
```

---

### Task 8: Wire /85254 Route in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import MagicZipPage and add route**

Add the import at the top of `src/App.tsx` with the other page imports:

```tsx
import MagicZipPage from '@/pages/MagicZipPage'
```

Add the route inside `<Routes>`, after the existing `/stay-in-touch` route:

```tsx
<Route path="/85254" element={<MagicZipPage />} />
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: register /85254 route for MagicZipPage"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Header phone 13→17px (Task 2)
- ✅ RLSIR logo height matches Call Now (Task 2)
- ✅ Tenor Sans uppercase on hero headline (Task 3)
- ✅ Hero CTA navigates to /home-eval (Task 3)
- ✅ MagicZip stats replaced with feature callouts (Task 4)
- ✅ /85254 link added to MagicZipSection (Task 4)
- ✅ StartSearch email OR phone required (Task 5)
- ✅ HomeEvalPage as 4-step wizard (Task 6)
- ✅ New /85254 page created (Task 7)
- ✅ Route registered (Task 8)
- ✅ LetsStayInTouchSection unchanged (name+email only — no task needed)
- ✅ RestaurantGuidePage unchanged (name+email only — no task needed)
- ✅ LetsStayInTouch.tsx page unchanged (already satisfies name + phone OR email)

**Placeholder scan:** No TBDs, no "similar to" references, all code is complete.

**Type consistency:**
- `EvalStep = 1 | 2 | 3 | 4` used consistently in Task 6
- `FEATURES` array typed inline in Task 7
- All imports verified against existing codebase patterns
