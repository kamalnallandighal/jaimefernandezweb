# Jaime Fernandez Real Estate Website — Master Context

## Project Overview
Luxury real estate website for Jaime Fernandez, agent at Russ Lyon Sotheby's International Realty, Scottsdale AZ.
Built by Kamal for McGuire Creative (Erik Youngberg-Aspelin + Brogan McGuire). Real paid client project — $1,200 budget.
Quality and attention to detail are non-negotiable.

## People
- **Client:** Jaime Fernandez — luxury real estate agent
- **Brokerage:** Russ Lyon Sotheby's International Realty
- **Agency:** McGuire Creative
- **Developer:** Kamal (USC junior, CS + Business)
- **Jaime's phone:** 480.758.9000
- **Jaime's email:** jaime@jfscottsdalehomes.com
- **Jaime's license:** #SA712810000
- **Office:** 6900 E Camelback Rd, Ste 110, Scottsdale AZ 85251

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui (fully customized to brand tokens)
- Framer Motion — UI animations, multi-step form transitions
- Lenis (@lenis/react) — smooth scroll, wraps entire app
- GSAP + ScrollTrigger — scroll-driven section reveals
- React Hook Form + Zod — form validation
- React Router DOM — multi-page routing
- Supabase — blog post database
- TipTap (@tiptap/react + extensions) — WYSIWYG blog body editor
- marked — legacy markdown→HTML conversion on post load
- dompurify — HTML sanitization for blog post rendering
- react-helmet-async — SEO meta tags on all pages
- Lucide React — icons

## Design System

### Colors
- --navy:        #002349  (primary dark, section backgrounds)
- --gold:        #C29B40  (accent ONLY — never large fills)
- --gold-light:  #d4af55  (hover states)
- --grey-text:   #666666  (body copy)
- --grey-accent: #999999  (secondary text, labels)
- --white:       #ffffff  (light section backgrounds, card backgrounds)

**NOTE: Sand/tan (#EDE8DF) has been removed from the design.** All light sections now use pure white (#ffffff). The old "sand" references in earlier docs are obsolete.

### Section Rhythm (alternating white/navy)
- Hero          → dark (video background)
- About         → white (#ffffff)
- 85254         → dark (navy #002349)
- Home Eval     → white (#ffffff)
- Restaurant    → dark (photo background + navy overlay)
- Reviews       → white (#ffffff)
- Calendly      → dark (navy #002349)
- Footer        → dark (navy #002349)

### Typography
- Display/Headlines: Cormorant Garamond (Google Font) — weights 300, 400, 600, italic variants
- Body/UI: Source Sans 3 (Google Font) — weights 300, 400, 600

### Design Philosophy
- Luxury Arizona — Scottsdale desert warmth meets Sotheby's refinement
- Every section has generous whitespace — never crowded
- Gold is accent only — thin lines, hover states, key text. Never a large background fill.
- Strictly alternate white and navy sections — never two light or two dark sections in a row (except Restaurant which always stays as photo bg)
- This is a sales funnel disguised as a luxury website

## Responsive Design
All sections are fully responsive using `src/lib/useWindowWidth.ts` hook.

Breakpoints:
- Mobile: `< 768px`
- Tablet: `>= 768px && < 1024px`
- Desktop: `>= 1024px`

Key mobile behaviors:
- **Hero video:** CSS class `hero-video` + `transform: scale(1.5)` in index.css zooms into center third on mobile
- **Hero content:** Headline reduces to `clamp(52px, 14vw, 80px)`, Fernandez indent removed, CTAs stack vertically
- **About / MagicZip / Calendly:** Multi-column grids collapse to single column
- **Reviews:** 3 cols → 2 cols tablet → 1 col mobile
- **Footer:** 3-col grid collapses to single column, bottom row stacks
- **All sections:** `128px 48px` padding reduces to `80px 24px` on mobile
- **StickyHeader:** Mobile hamburger menu via Tailwind `hidden md:hidden`; desktop nav hidden on mobile

## ADRE Legal Compliance (Decision Made)
Arizona ADRE advertising law requires brokerage name/logo visible at all times.

**FixedBrokerageBadge has been REMOVED** from App.tsx by client request.
Compliance is satisfied by RLSIR logo in StickyHeader (always visible) and Footer.
Do NOT re-add the FixedBrokerageBadge unless Jaime/McGuire explicitly request it.

## Logo Assets
Location: /public/assets/logos/

- RLSIR_Horz_white.png → Dark backgrounds, header when transparent over hero
- RLSIR_Horz_blue.png  → White/light backgrounds, header when scrolled
- RLSIR_Horz_black.png → Print/special use only
- RLSIR_Vert_white.png → Do NOT use in UI (too tall)
- RLSIR_Vert_blue.png  → Do NOT use in UI (too tall)

Rules:
- Always use horizontal version in UI
- Never substitute text for the logo image
- Dark bg = white version, Light bg = blue version

## Site Architecture

### Routes
- /             → HomePage (full one-page scroll)
- /blog         → Blog index ("The Narrative")
- /blog/:slug   → Individual blog post
- /blog/admin   → Blog admin (password protected)
- /resources    → PDF viewer placeholder (not built yet)

### Navigation (StickyHeader)
- Layout: CSS Grid `1fr auto 1fr` — logo left, nav center, phone+CTA right
- Left: RLSIR logo (170px wide), crossfades white↔blue
- Center: HOME | BLOG | BOOK A CALL
- Right: 480.758.9000 + gold "CALL NOW" button
- **Behavior on `/` (homepage):** transparent over hero video → smooth ease-in to solid white after scrolling 50px
- **Behavior on all other routes (`/blog`, `/blog/:slug`, etc.):** always solid white with border-b from the moment the page loads. No transparent state.
- BOOK A CALL scrolls to #calendly on homepage, navigates to /#calendly from other pages
- `isWhite = !isHomePage || scrolled` drives all color decisions

## Hero Video
- File: `/public/assets/videos/hero.mov` (copied from client's desktop)
- Poster fallback: `https://images.unsplash.com/photo-1710793311332-a2c7d3c3ad3f?w=1920&q=80`
- Overlay: `rgba(0,0,0,0.55)` flat dark + bottom vignette `linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 38%)`
- Video src is now set — do NOT clear it or replace it with a placeholder

## Homepage Sections (in scroll order)

### 1. Hero
- Full viewport (100svh), min-height 600px
- paddingTop: 94px (header clearance), paddingBottom: 110px (stat bar clearance)
- Content left-aligned: `paddingLeft: clamp(48px, 8vw, 120px)` desktop, 24px mobile
- Eyebrow: gold rule + "SCOTTSDALE LUXURY REAL ESTATE" in gold tiny caps
- Headline: "Jaime" / "Fernandez" two-line, Cormorant italic 300 weight, `clamp(76px, 10vw, 136px)` desktop
  - "Fernandez" has `marginLeft: clamp(52px, 8.5vw, 132px)` indent — REMOVED on mobile
- CTAs: "Free Home Valuation" (gold, navy text) → scrolls to #home-eval; "Start Your Search" (outline) → navigates to /start-your-search
- Stat bar pinned bottom: 320+ / $2.1B / #1, gold numbers in Cormorant italic, gold vertical dividers (hidden on mobile)

### 2. About
- Background: white #ffffff
- Grid: `5fr 7fr` desktop → single column mobile
- Photo: `jaime.jpeg` served from `/public/assets/jaime.jpeg`, objectFit cover, objectPosition center top
- Stats: 1fr 1fr grid, gold Cormorant italic numbers

### 3. Magic Zip / 85254 Advantage
- Background: navy #002349
- Grid: `1fr 1fr` desktop → single column mobile
- Decorative corner border div: hidden on mobile (position absolute, could overflow)
- White card: `padding: 64px` desktop → `40px 32px` mobile

### 4 & 5. Home Evaluation + Connoisseur's Guide (side-by-side)
- On desktop: `1fr 1fr` CSS grid in HomePage wraps both sections side-by-side
- On mobile: stacks vertically (grid collapses to `1fr`)
- Both GSAP scroll trigger IDs (`#home-eval`, `#restaurant`) remain on inner section elements

#### Home Evaluation
- Background: white #ffffff
- Card shadow: `0 20px 60px rgba(0,35,73,0.10)`
- **5-step flow:** Address → Property Type → Selling Timeline → Contact Info → "Why do you love your home?" (optional)
- Step 5 has "Get My Valuation" submit + "Skip this step" link (loveNote is optional)
- Step label/content/nav padding reduces on mobile (56px → 24px horizontal)

⚠️ CRITICAL: Address input MUST remain uncontrolled (no value= prop).
   AnimatePresence must NOT wrap step 1. Steps use display:block/none, never unmount step 1.
   Google Places uses PlaceAutocompleteElement (v=alpha, importLibrary). NOT the legacy Autocomplete class.

#### Connoisseur's Guide (Restaurant)
- Background: full-section photo with `rgba(0,35,73,0.90)` navy overlay — NOT flat navy
- Stretches to fill the grid row height matching HomeEvalSection
- Form already uses `flexWrap: 'wrap'` so input + button stack naturally on mobile

### 6. Reviews
- Background: white #ffffff
- Grid: `repeat(3, 1fr)` desktop → `repeat(2, 1fr)` tablet → `1fr` mobile
- FILLED gold stars only (★) — never outline
- Three live client reviews: Kevin R., Tyler S., Jenna S. (all Scottsdale, AZ)

### 7. Calendly
- Background: navy #002349
- White card with heavy shadow: `0 25px 80px rgba(0,0,0,0.45)`
- Layout: row (420px left + flex-1 right) desktop → column mobile
- Left/right divider: `borderRight` on desktop → `borderBottom` on mobile
- Calendly URL: lives in JAIME.calendly in src/lib/constants.ts — update there only
- Widget loads via useEffect, falls back to polished placeholder if URL is '#'

### 8. Footer
- Background: navy #002349
- Grid: `2fr 1fr 1fr` desktop → single column mobile
- Bottom row: `justify-content: space-between` desktop → column + gap mobile
- Full legal disclaimer with license number
- Instagram + Facebook links

## GSAP Scroll Animations
- Registered in App.tsx: `gsap.registerPlugin(ScrollTrigger)`
- Lenis integration: `useLenis(() => ScrollTrigger.update())` inside HomePage
- `ScrollTrigger.config({ ignoreMobileResize: true })`
- REVEAL_SECTIONS: `['#about', '#magic-zip', '#home-eval', '#restaurant', '#reviews', '#calendly']`
  - **Footer is intentionally excluded** — no fade-in on footer
- Each section: `opacity 0→1, y 40→0, duration 0.85, power2.out, start: 'top 85%', once: true`
- Children stagger: `y 24→0` only (no opacity on children — parent opacity carries them)

## Blog System

### Design Reference
Implemented from Stitch MCP screen "The Final Narrative Blog" in the "Scottsdale Luxury Real Estate" project.

### Blog Index (/blog)
- Always-white header (no transparent state — StickyHeader `isWhite` always true on /blog)
- Masthead: "The Narrative" — large italic Cormorant `clamp(4rem, 10vw, 8rem)`, navy, centered, gold rule below
- Category nav: sticky below header, gold active underline, filters posts client-side
  - Categories: ALL | Market Insights | Neighborhoods | Buyer Guides | Seller Guides | 85254
- **Asymmetric featured grid:** 55% large post (portrait 4:5 image) left + 45% 2×2 small posts (square images) right
- **Secondary 3-column feed:** posts 6–8 shown with 3:2 landscape images + excerpt
- **Newsletter section:** warm cream bg (#f5f3ef), underline email input, "Subscribe" text button
- Footer: uses main site `<Footer />` component (navy, full legal)

### PostCard variants
- `large`: aspect-[4/5] portrait image, italic Cormorant 300 weight title, excerpt — for featured hero post
- `small`: aspect-square image, smaller italic title — for 2×2 grid
- `grid`: aspect-[3/2] landscape image, 2xl italic title, excerpt — for 3-col secondary feed

### Individual Post (/blog/:slug)
- Full-width cover image, max-height 70vh
- Post header: category tag + title + byline + gold rule
- Body: react-markdown rendered with .prose-jaime CSS class
- Tags section below body
- "More from Jaime" related posts (3 cards)
- Navy CTA strip at very bottom
- JSON-LD Article schema injected for Google SEO
- Full Helmet meta tags per post (title, description, og:image, canonical)

### Blog Admin (/blog/admin)
- Login: username `jaime`, password `Test123` (constants `ADMIN_USERNAME` / `ADMIN_PASSWORD` at top of BlogAdmin.tsx)
- StickyHeader is hidden on /blog/admin — admin renders its own full navy header via `AppShell` in App.tsx
- Two views: LIST VIEW and EDITOR VIEW
- Supabase CRUD operations with framer-motion toast notifications
- Delete requires confirmation dialog (shadcn Dialog)
- Cover photo: drag-and-drop upload to Supabase Storage (`blog-images` bucket) — required to publish, optional for drafts
- Inline image upload: "+ Insert Image" button above markdown body inserts `![image](url)` at cursor
- Auto read time (calculated from word count, locked when user manually edits)
- SEO fields (title, description) with live Google SERP preview — collapsible section

## Supabase

### Environment Variables
VITE_SUPABASE_URL= (Settings → General → Project URL in Supabase dashboard)
VITE_SUPABASE_ANON_KEY= (Settings → API → Publishable key — the `sb_publishable_...` format works with supabase-js v2.103+)

**Status: CONFIGURED** — both vars are set in .env.local and on Vercel.

### Posts Table
Full SQL schema is in a comment block inside src/lib/supabase.ts.
**Status: CREATED** — schema has been run in Supabase SQL Editor.

Key fields: id, title, slug, excerpt, body, cover_image_url, category,
tags (text array), published (boolean), published_at, seo_title,
seo_description, read_time_minutes, created_at, updated_at

RLS Policies:
- Public can SELECT where published = true
- Admin full access policy (frontend enforces password, not Supabase auth)

### Storage
Bucket: `blog-images` (public) — **CREATED**
Policies: public read, admin insert, admin delete — **APPLIED**
Used for: cover photos and inline body images uploaded via blog admin

## Environment Variables (.env.local)
VITE_SUPABASE_URL=✓ configured
VITE_SUPABASE_ANON_KEY=✓ configured
VITE_GOOGLE_PLACES_API_KEY=✓ configured (home eval address autocomplete working)
VITE_SHEET_BEST_URL= (still empty — all lead-capture forms will fail silently until set, or until Supabase migration)
CLAUDE_API_KEY= (no VITE_ prefix — server-side only in Vercel env vars, NOT in .env.local — activates AI SEO autofill)

Leave empty vars blank — null guards in the code handle missing values gracefully.

## File Structure
src/
  components/
    StickyHeader.tsx          ← Nav; transparent on homepage, always white on other routes
    HeroSection.tsx           ← Video bg, left-aligned, stat bar, mobile-responsive
    AboutSection.tsx          ← 5/7 grid → single col mobile, white bg
    MagicZipSection.tsx       ← Navy bg, 1fr 1fr grid → single col mobile
    HomeEvalSection.tsx       ← Multi-step form, PlaceAutocompleteElement
    RestaurantGuideSection.tsx ← Photo bg + navy overlay
    ReviewsSection.tsx        ← 3→2→1 col responsive, white bg
    CalendlySection.tsx       ← Navy bg, row→column mobile, Calendly embed
    Footer.tsx                ← Navy, responsive grid, used on homepage + blog
    FixedBrokerageBadge.tsx   ← REMOVED from use — do not add back
    PostCard.tsx              ← Blog card: large (4:5) / small (square) / grid (3:2)
    RichTextEditor.tsx        ← TipTap WYSIWYG editor with WordPress-style toolbar (used in BlogAdmin)
    ErrorBoundary.tsx         ← Catches crashes, shows error instead of blank
    ui/                       ← shadcn components auto-generated here
  pages/
    Blog.tsx                  ← "The Narrative" blog index, Newsletter, uses Footer
    BlogPost.tsx              ← Individual post page
    BlogAdmin.tsx             ← Password-protected CMS with 3-step wizard + AI SEO autofill
    Resources.tsx             ← Placeholder (not built yet)
    StartSearch.tsx           ← Hidden: buyer intake form (/start-search)
    HomeEvalPage.tsx          ← Hidden: home valuation form (/home-eval)
    BookACall.tsx             ← Hidden: full-page Calendly (/book-a-call)
    RestaurantGuidePage.tsx   ← Hidden: restaurant guide capture (/restaurant-guide)
    LetsStayInTouch.tsx       ← Hidden: name+phone form (/lets-stay-in-touch)
  components/
    LetsStayInTouchSection.tsx ← Homepage section between Calendly and Footer
  lib/
    supabase.ts               ← Supabase client + Post type + SQL schema comment
    seoAI.ts                  ← AI SEO utility — calls /api/seo-ai serverless function
    constants.ts              ← Jaime's contact info and site constants (incl. JAIME.calendly)
    useWindowWidth.ts         ← Responsive hook, used in all sections
    utils.ts                  ← shadcn cn() utility
api/
  seo-ai.ts                   ← Vercel serverless function — holds CLAUDE_API_KEY server-side, calls Anthropic
  App.tsx                     ← BrowserRouter + HelmetProvider + AppShell (hides StickyHeader on /blog/admin) + Routes + GSAP setup + HomePage
  main.tsx                    ← Entry point, ReactLenis root, ErrorBoundary
  index.css                   ← Design tokens, shadcn overrides, .prose-jaime, hero-video mobile zoom
  global.d.ts                 ← Window.Calendly + Window.google types

## Build Status

### Completed
- Full project scaffold and all npm dependencies installed
- Design system: CSS custom properties, Tailwind config, shadcn overrides
- React Router with all 5 routes wired
- Lenis smooth scroll + GSAP ScrollTrigger section reveals
- Blog index, individual post, and admin pages — fully built
- PostCard component (large/small/grid) matching "The Final Narrative Blog" Stitch design
- All homepage sections built and styled
- **Session 6:**
  - Color scheme shifted: sand removed, white/navy alternating rhythm locked in
  - Hero video: `hero.mov` copied from Desktop to `/public/assets/videos/hero.mov`
  - Full mobile responsiveness: `useWindowWidth` hook, all sections responsive
  - Hero video mobile zoom: CSS `scale(1.5)` via `.hero-video` class
  - CalendlySection: navy background (#002349), heavy card shadow
  - ReviewsSection: white background (#ffffff)
  - Footer fade-in scroll animation removed from GSAP
  - StickyHeader: always white on non-homepage routes (`isWhite = !isHomePage || scrolled`)
  - Blog (/blog): rebuilt from Stitch "The Final Narrative Blog" design
    - "The Narrative" masthead, asymmetric grid, secondary 3-col feed, newsletter
    - Uses main Footer component instead of custom blog footer strip
- **Session 7:**
  - Vercel deployment live
  - Supabase fully configured: posts table created, RLS policies applied
  - Storage bucket `blog-images` created with public read + admin write policies
  - Blog admin upgraded: username+password login (jaime/Test123)
  - Cover photo: drag-and-drop upload to Supabase Storage (mandatory to publish)
  - Inline image upload in markdown body editor (inserts at cursor)
  - Auto read-time calculation (locks when manually edited)
  - Route bug fixed: `/blog/admin` was matching `/blog/:slug` — reordered routes
  - AppShell pattern: StickyHeader hidden on /blog/admin route
  - VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY configured in .env.local and Vercel
- **Session 8:**
  - Vercel env var fix: `vite.config.ts` now uses `define` to explicitly map `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` from `process.env`
  - Blog redesign (built on `blog-redesign` branch, merged to main session 9):
    - Blog index: featured post driven by `featured` flag, responsive ALL view grid, uniform 3-col grid on category filter
    - Admin editor: two-column desktop layout, 16:9 cover photo box, rounded tag pills, ★ featured toggle
    - Individual post: fluid header padding (`clamp`), related posts use `grid` PostCard variant
    - `Post` type updated: `featured: boolean` field added to `src/lib/supabase.ts`
  - Supabase SQL run: `ALTER TABLE posts ADD COLUMN featured boolean NOT NULL DEFAULT false;`
- **Session 11 (current):**
  - StickyHeader: phone number font size increased 13→17px; RLSIR logo container fixed to `width: 184px, height: 41px` with `height: auto` on img tags
  - Hero headline: swapped from Cormorant Garamond italic to **Tenor Sans uppercase** (`font-family: 'Tenor Sans'`, weight 400) — more presence, easier to read for elderly; `clamp(60px, 8vw, 108px)` desktop / `clamp(42px, 11vw, 64px)` mobile
  - Hero CTA "Free Home Valuation" now navigates to `/home-eval` (was scrolling to #home-eval)
  - MagicZipSection: replaced unverifiable 14%/22-day stats with 3 qualitative feature callout rows (GraduationCap/MapPin/Compass icons); added "Learn more about 85254 →" button linking to `/85254`
  - New `/85254` subpage (`MagicZipPage.tsx`): navy hero + white story section + navy email form; noindex/nofollow
  - `src/lib/validation.ts` (new): `isValidEmail` and `isValidPhone` shared utilities
  - Email + phone format validation added across ALL 7 form locations:
    - HomeEvalSection (homepage), HomeEvalPage, StartSearch, LetsStayInTouch page, LetsStayInTouchSection (homepage), RestaurantGuidePage, MagicZipPage
    - Touch-based (error shows on blur); red `#e53e3e` on light bg, `#fc8181` on navy bg
  - HomeEvalPage (`/home-eval`) rebuilt as 4-step wizard: Address → Timeline → Contact → Love Note
    - Step 3 requires name + (valid email OR valid phone) + TCPA consent
  - LetsStayInTouch page/section + RestaurantGuidePage: kept as name+email only (no phone)
  - Blog: removed category filter nav (ALL | MARKET INSIGHTS | etc.) — single unified feed
  - HomeEvalPage h1 "What Is Your Home Worth?" sized to `clamp(28px, 4vw, 52px)` with `whiteSpace: 'nowrap'` to fit one line
  - Tenor Sans added to Google Fonts URL in `index.html`
  - Multiple Vercel build errors fixed: removed unused `scrollTo`, `navGap`, `isMobile` vars; fixed temporal dead zone in StartSearch validation state declarations
- **Session 10:**
  - 5 hidden lead-capture subpages added (noindex/nofollow, not in nav):
    - `/start-search` — buyer intake form: bedrooms, bathrooms, budget, areas, timeline, lender status, property type, name/email/phone
    - `/home-eval` — dedicated home valuation: address + timeline pills + name/email/phone + gold stats strip
    - `/book-a-call` — full-page Calendly embed with navy info panel (reuses CalendlyWidget logic)
    - `/restaurant-guide` — richer restaurant guide with 3 feature icons + name/email form
    - `/lets-stay-in-touch` — full-page dark navy layout, name + phone (required) + email (optional)
  - `LetsStayInTouchSection` added to homepage between CalendlySection and Footer (white bg, name + email inline form)
  - All forms POST to `VITE_SHEET_BEST_URL` when configured; show success state regardless
  - NOTE: Forms will be migrated to Supabase lead storage in a future session (decided in session 10)
  - AI-powered SEO autofill on blog admin Step 2:
    - "Auto-fill with AI" button at top of Details & SEO step
    - Calls `api/seo-ai.ts` Vercel serverless function (key never exposed to client)
    - Uses Claude Haiku (`claude-haiku-4-5-20251001`) — cheap, ~cents per post
    - Fetches last 20 published posts from Supabase as context so AI learns over time and avoids tag repetition
    - Fills: category, tags, excerpt, SEO title, SEO description
    - Hard character limits enforced server-side with word-boundary trimming (no mid-word cuts)
    - Requires `CLAUDE_API_KEY` (no VITE_ prefix) in Vercel env vars — NOT yet configured
  - `vercel.json` updated: `/api/*` routes exempted from SPA rewrite so serverless functions work
  - `@vercel/node` added as devDependency for serverless function types
- **Session 9:**
  - Blog admin PostEditor replaced with 3-step wizard: Write → Details & SEO → Cover
    - Step 1: Title + slug + TipTap WYSIWYG editor (full WordPress-style toolbar)
    - Step 2: Category, tags, excerpt, read time, featured toggle, SEO title/desc, Google SERP preview
    - Step 3: 16:9 cover photo upload, published toggle — Publish button
    - Framer Motion slide transitions between steps; step tabs + pill dots nav in bottom bar
  - TipTap replaces plain textarea — body field now stores HTML (was markdown)
  - Legacy markdown posts auto-convert to HTML on load via `marked`
  - BlogPost.tsx: swapped `react-markdown` for `dangerouslySetInnerHTML` + DOMPurify sanitization
  - `RichTextEditor.tsx` created: reusable TipTap wrapper with full toolbar
  - ProseMirror + prose-jaime HTML styles added to `index.css`
  - Admin header: RLSIR logo now links to homepage; "View Blog →" link added
  - `ScrollToTop` component in App.tsx: every route change scrolls to top (⚠️ WORK IN PROGRESS — not fully working yet; Lenis + browser scroll restoration fighting each other on home→blog navigation)
  - VITE_GOOGLE_PLACES_API_KEY confirmed configured and working
  - `blog-redesign` branch merged to main and deployed to Vercel

### Needs Building (Priority Order)
1. Add `CLAUDE_API_KEY` to Vercel env vars to activate AI SEO autofill
2. Migrate all lead-capture forms (hidden pages + homepage) from SHEET_BEST_URL to Supabase leads table
3. Real headshot photo for About section (currently grey placeholder)
4. Client to provide actual Calendly URL (currently using brogan-mcguire-creative/30min)
5. Add VITE_SHEET_BEST_URL to .env.local + Vercel (interim, until Supabase migration done)

## Approved Design (Locked)

HERO: `hero.mov` video, "Jaime / Fernandez" **Tenor Sans uppercase** two-line left-aligned, two CTA buttons, stat bar bottom. "Free Home Valuation" CTA navigates to `/home-eval`.

COLOR SYSTEM: White (#ffffff) for light sections, Navy (#002349) for dark sections. Sand is gone.
Gold (#C29B40) as accent only. Never deviate from these exact hex values.

TYPOGRAPHY: Cormorant Garamond italic for all display headlines, Source Sans 3 for all body/UI.

85254 SECTION: Navy bg, two-col (single col mobile), pull quote, white card with stats.

FORM: White floating card, gold progress bar, 2×2 property type cards with gold border on selected.

RESTAURANT: Photo bg + navy overlay. Never flat color.

REVIEWS: White bg, FILLED gold stars only, italic quote, gold divider line, 3→2→1 col responsive.

CALENDLY: Navy bg, white card, row desktop / column mobile, real Calendly inline widget.

FOOTER: Navy, 3-col grid (single col mobile), full legal disclaimer, social links.

BLOG: "The Narrative" masthead, portrait featured image, 2×2 small grid, 3-col secondary feed, newsletter.
No card borders or shadows on blog cards. Images carry all visual weight.

## Stitch MCP — Design Reference

Stitch is a Google design tool connected via MCP. Project: "Scottsdale Luxury Real Estate"

### Key Screens
- "The Final Definitive Home Page" → source of truth for homepage section designs
- "The Final Narrative Blog" → source of truth for /blog design (implemented Session 6)

### How to Use
- Tools: `mcp__stitch__list_projects` → `mcp__stitch__list_screens` → `mcp__stitch__get_screen`
- Get raw HTML: use `curl` on the download URL (WebFetch summarizes; curl returns literal HTML)
- Translate Tailwind classes → inline styles when implementing in React components

## Critical Rules for Claude Code
1. Never hallucinate shadcn component props — check src/components/ui/ first
2. All Supabase operations must have try/catch blocks
3. FixedBrokerageBadge has been REMOVED — do not add it back
4. Hero video src is `/assets/videos/hero.mov` — do NOT clear or replace it
5. Gold color is always exactly #C29B40 — never use any other value
6. Review stars must always be filled gold (★) never outline (☆)
7. Restaurant section background must be a photo with overlay, never flat color
8. Sand/tan color (#EDE8DF) is obsolete — use white (#ffffff) for light sections
9. Run `npx tsc --noEmit` after each change to catch TypeScript errors early
10. The resources page is NOT being built yet — leave as placeholder
11. HomeEvalSection address input MUST stay uncontrolled (no value= prop).
    AnimatePresence must NOT wrap step 1. Steps use display:block/none.
    Google Places: use PlaceAutocompleteElement via importLibrary (v=alpha). NOT legacy Autocomplete.
12. Calendly URL lives in JAIME.calendly in src/lib/constants.ts — update there only
13. StickyHeader: `isWhite = !isHomePage || scrolled` — transparent only on homepage before scroll
14. useWindowWidth hook is in src/lib/useWindowWidth.ts — import it whenever adding responsive logic
15. Footer is used on both homepage (inside HomePage component) and blog page (imported in Blog.tsx)
