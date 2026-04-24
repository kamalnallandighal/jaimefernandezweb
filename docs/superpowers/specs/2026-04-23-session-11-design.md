# Session 11 Design Spec
Date: 2026-04-23

## Overview
Six changes to the Jaime Fernandez real estate website, across the header, hero, forms, MagicZip section, and two new/converted subpages.

---

## 1. Header Updates

### 1a. Phone number font size
- File: `src/components/StickyHeader.tsx`
- Change `fontSize` on the phone `<a>` element from `'13px'` to `'17px'`
- Keep `fontWeight: 700` and `letterSpacing: '0.12em'`

### 1b. RLSIR logo height matches "Call Now" button
- The "Call Now" button has `padding: '14px 36px'` + `fontSize: '13px'` → natural height ~41px
- Logo container is currently `width: '170px', height: '38px'`
- Change both `<img>` tags to `height: '41px', width: 'auto'` (drop the fixed-width `width: '170px'`)
- Update the `<NavLink>` container to `height: '41px'` and remove the fixed `width: '170px'` — let it size from the image

---

## 2. Hero Headline Font — Tenor Sans

### Font
- Add `Tenor Sans` from Google Fonts (weight 400 only — it only has one weight)
- Add to `index.html` `<link>` preconnect + stylesheet import

### HeroSection.tsx changes
- `fontFamily`: `"'Tenor Sans', sans-serif"` (replaces Cormorant Garamond)
- `fontStyle`: remove italic (Tenor Sans has no italic)
- `fontWeight`: `400` (Tenor Sans only has 400)
- `textTransform`: `'uppercase'`
- `lineHeight`: `0.92` (tight, same feel — slightly adjusted from 0.88 since Tenor Sans has more x-height)
- Size: keep existing `clamp(76px, 10vw, 136px)` desktop / `clamp(52px, 14vw, 80px)` mobile
- The "Fernandez" indent stays as-is on desktop, removed on mobile

---

## 3. Forms — Name + (Email OR Phone) Rule

### Applies to these three forms only:
- `src/pages/StartSearch.tsx` (Step 4 contact info)
- `src/pages/HomeEvalPage.tsx` (contact section) — will be replaced by wizard (see §4)
- `src/pages/LetsStayInTouch.tsx` (full-page form) — currently name+phone required, email optional → keep as-is, already satisfies the rule

### Does NOT change (stays name + email only):
- `src/components/LetsStayInTouchSection.tsx` (homepage section)
- `src/pages/RestaurantGuidePage.tsx`
- New 85254 page Let's Stay in Touch form

### Implementation pattern for StartSearch step 4:
- Email field: remove `required` attribute, change label to `"Email"`
- Phone field: already exists, change label to `"Phone"`
- Add helper text below both fields: `"We'll need at least one way to reach you"`
- `canProceed` on step 4: `name.trim() !== '' && (email.trim() !== '' || phone.trim() !== '')`
- Submit button disabled state uses same condition

---

## 4. Home Eval Subpage — Step-by-Step Wizard

### Route
- `/home-eval` — existing route, replaces `HomeEvalPage.tsx`
- Still `noindex, nofollow`

### Hero CTA update
- `src/components/HeroSection.tsx`: "Free Home Valuation" button changes from `scrollTo('home-eval')` to `navigate('/home-eval')`

### Wizard steps (4 steps, matching StartSearch pattern)
- Progress bar (gold, animates per step)
- Slide transition (Framer Motion AnimatePresence)

**Step 1 — Address**
- Heading: *"What's the address of your property?"*
- Single text input: Property Address (required to proceed)
- `canProceed`: address not empty

**Step 2 — Timeline**
- Heading: *"When are you thinking of selling?"*
- Pill group: `['Ready to sell now', '1–3 months', '3–6 months', '6–12 months', 'Just curious about value']`
- `canProceed`: timeline selected (if skipped user can still proceed — make timeline optional, add "Skip" link)

**Step 3 — Contact**
- Heading: *"Where should Jaime send your analysis?"*
- Name (required), Email, Phone — email OR phone required
- Helper: "We'll need at least one way to reach you"
- `canProceed`: name not empty AND (email or phone not empty)

**Step 4 — Love Note (optional)**
- Heading: *"Why do you love your home?"* with subtitle "Jaime loves knowing what makes a property special."
- Textarea (optional)
- Submit button: "Get My Free Valuation"
- Also a "Skip & Submit" link that submits immediately without love note

### Success state
- Same as current: gold check circle, thank-you message, call button

---

## 5. MagicZip Section — Replace Stats with Feature Callouts

### File: `src/components/MagicZipSection.tsx`

### Replace the 2-stat grid (`14% Annual Apprec.` / `22 Days Avg Market Time`) with 3 feature callout rows

**New content in the white card (below the existing paragraph):**
```
┌─────────────────────────────────────────────────┐
│  [GraduationCap icon]  A-Rated Schools           │
│    Scottsdale Unified — top 5 district in AZ    │
├─────────────────────────────────────────────────┤
│  [MapPin icon]         Best of Both Cities       │
│    Scottsdale address. Phoenix city tax rate.   │
├─────────────────────────────────────────────────┤
│  [Compass icon]        Prime Location            │
│    Minutes to Kierland, Old Town & DC Ranch     │
└─────────────────────────────────────────────────┘
```

Each row: icon (gold, 18px, Lucide) + label (Source Sans 3, 11px, 700, navy, uppercase) + description (Source Sans 3, 13px, 300, grey).
Rows separated by `1px solid rgba(0,35,73,0.08)` dividers.

---

## 6. New 85254 Subpage

### Route
- `/85254` — new route, add to `App.tsx`
- `noindex, nofollow`
- New file: `src/pages/MagicZipPage.tsx`

### Page structure

**Hero (navy #002349)**
- Eyebrow: "The Magic Zip Code" in gold
- H1: *"The 85254 Advantage"* — Cormorant Garamond italic 300, large
- Subhead: the existing MagicZip section description paragraph

**Story section (white)**
- Two-column layout (single col mobile): left = expanded content, right = feature list
- Left expanded content (3 paragraphs):
  1. The dual-city reality (Scottsdale address, Phoenix limits)
  2. School district story (SUSD A-rated, top 5 in AZ, 29 of 30 schools A or B)
  3. Lifestyle paragraph (lot sizes, proximity, what Jaime knows about this corridor)
- Right: same 3-callout feature list from §5 (A-Rated Schools / Best of Both Cities / Prime Location)
- Pull quote from homepage: *"The best-kept secret in Scottsdale is actually in Phoenix."*

**Let's Stay in Touch (navy)**
- Centered, same visual style as `LetsStayInTouchSection`
- Headline: *"Stay Ahead of the 85254 Market"*
- Subhead: "Get off-market opportunities and neighborhood intel — directly from Jaime."
- Form: Name (required) + Email (required) → Submit
- No phone field

### 85254 link in MagicZipSection
- Add a text link at the bottom of the left column: "Learn more about 85254 →"
- Navigates to `/85254`
- Style: gold, Source Sans 3, 11px, 700, uppercase, letter-spacing

---

## Summary of Files to Create/Modify

| File | Action |
|---|---|
| `index.html` | Add Tenor Sans Google Font |
| `src/components/StickyHeader.tsx` | Phone size, logo height |
| `src/components/HeroSection.tsx` | Tenor Sans font, navigate to /home-eval |
| `src/components/MagicZipSection.tsx` | Replace stat grid with feature callouts, add /85254 link |
| `src/pages/StartSearch.tsx` | Email OR phone required |
| `src/pages/HomeEvalPage.tsx` | Rewrite as 4-step wizard |
| `src/pages/MagicZipPage.tsx` | Create new page |
| `src/App.tsx` | Add /85254 route |

## Files NOT changing
- `LetsStayInTouchSection.tsx` — stays name + email only
- `RestaurantGuidePage.tsx` — stays name + email only
- `LetsStayInTouch.tsx` (page) — already satisfies name + (phone OR email) rule
- `HomeEvalSection.tsx` — stays on homepage as-is, hero CTA now bypasses it to /home-eval
