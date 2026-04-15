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
- react-markdown — blog post body rendering
- react-helmet-async — SEO meta tags on all pages
- Lucide React — icons

## Design System

### Colors
- --navy:        #002349  (primary dark, section backgrounds)
- --gold:        #C29B40  (accent ONLY — never large fills)
- --gold-light:  #d4af55  (hover states)
- --sand:        #EDE8DF  (light section backgrounds)
- --grey-text:   #666666  (body copy)
- --grey-accent: #999999  (secondary text, labels)
- --white:       #ffffff  (text on dark, card backgrounds)

### Typography
- Display/Headlines: Cormorant Garamond (Google Font) — weights 300, 400, 600, italic variants
- Body/UI: Source Sans 3 (Google Font) — weights 300, 400, 600

### Section Rhythm (alternating light/dark)
- Hero          → dark (video background)
- About         → light (sand #EDE8DF)
- 85254         → dark (navy #002349)
- Home Eval     → light (sand #EDE8DF)
- Restaurant    → dark (photo background + overlay)
- Reviews       → light (sand #EDE8DF)
- Calendly      → light (slightly grey #F5F3EF)
- Footer        → dark (navy #002349)

### Design Philosophy
- Luxury Arizona — Scottsdale desert warmth meets Sotheby's refinement
- Every section has generous whitespace — never crowded
- Gold is accent only — thin lines, hover states, key text. Never a large background fill.
- Let background photos/video do the visual heavy lifting
- This is a sales funnel disguised as a luxury website

## ADRE Legal Compliance (Decision Made)
Arizona ADRE advertising law requires brokerage name/logo visible at all times.

**FixedBrokerageBadge has been REMOVED** from App.tsx by client request.
Compliance is satisfied by RLSIR logo in StickyHeader (always visible) and Footer.
Do NOT re-add the FixedBrokerageBadge unless Jaime/McGuire explicitly request it.

## Logo Assets
Location: /public/assets/logos/

- RLSIR_Horz_white.png → Dark backgrounds, fixed badge, header over hero
- RLSIR_Horz_blue.png  → Light/cream/sand backgrounds
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
- /blog         → Blog index
- /blog/:slug   → Individual blog post
- /blog/admin   → Blog admin (password protected)
- /resources    → PDF viewer placeholder (not built yet)

### Navigation (StickyHeader)
- Left: RLSIR_Horz_white.png logo (~120px wide)
- Center: HOME | BLOG | BOOK A CALL
- Right: 480.758.9000 + gold "CALL NOW" button
- Behavior: transparent over hero, transitions to solid white on scroll
- BOOK A CALL scrolls to #calendly on homepage, navigates to /#calendly from other pages

## Homepage Sections (in scroll order)

### 1. Hero
- Full viewport (100svh)
- Background: HTML5 video element (autoPlay muted loop playsInline)
  - Video src is EMPTY — client will provide B-roll footage
  - Never add a fake src URL
  - Poster/fallback image: warm Arizona desert luxury home at dusk
    (infinity pool, desert landscaping, golden hour light, cacti)
- Overlay: rgba(0,0,0,0.38) warm dark — NOT navy blue
- Content left-aligned, positioned center-left of viewport:
  - Eyebrow: "SCOTTSDALE LUXURY REAL ESTATE" in gold, tiny caps, tracking-widest
  - Headline line 1: "Jaime" — Cormorant Garamond ~80px, font-weight 300, italic, white
  - Headline line 2: "Fernandez" — same style, same size
  - Two CTA buttons horizontal with gap:
    Button 1: gold filled, navy text, sharp corners — "GET A HOME VALUATION"
    Button 2: white outline, white text, sharp corners — "START YOUR SEARCH"
- Stat bar pinned to very bottom of hero:
  - Thin gold separator line above
  - "320+" / "$2.1B" / "#1" in large gold Cormorant Garamond
  - Labels below: "HOMES SOLD" / "VOLUME" / "SCOTTSDALE AGENT" in white tiny caps

### 2. About
- Background: sand #EDE8DF
- Two column layout (50/50):
  - Left: professional headshot placeholder (grey rectangle, not circle avatar)
  - Right:
    - "MEET JAIME FERNANDEZ" gold eyebrow, tracking-widest
    - Large Cormorant navy headline (2-3 lines)
    - 2 paragraph bio in Source Sans 3, grey-text
    - Two stats below:
      "320+" large italic Cormorant gold / "HOMES SOLD" tiny caps gold label
      "$2.1B" large italic Cormorant gold / "LIFETIME VOLUME" tiny caps gold label

### 3. Magic Zip / 85254 Advantage
- Background: navy #002349
- Two column layout:
  - Left column:
    - "MARKET INSIGHT" gold eyebrow, tracking-widest
    - "The 85254" in Cormorant, large, white
    - "Advantage" in Cormorant, large, italic, gold (#C29B40)
    - Body text explaining Scottsdale address + Phoenix property taxes, white/70
    - Gold left-border pull quote:
      "The best-kept secret in Scottsdale is actually in Phoenix."
    - "Explore 85254 →" gold text link
  - Right column: white card with subtle shadow
    - "The Magic Zip Code" italic Cormorant navy headline
    - Explanation body text in grey
    - Two data points in large gold Cormorant:
      "14%" / "ANNUAL APPREC."
      "22 Days" / "AVG MARKET TIME"

### 4. Home Evaluation (Multi-Step Form) — BUILT
- Background: sand #EDE8DF
- Eyebrow: "Complimentary · Expert · Delivered Within 24 Hours" in gold tiny caps
- Headline: "Know Your Home's True Value" italic Cormorant navy
- Subhead: "A personalized market analysis from Scottsdale's #1 agent — not an algorithm."
- White floating card, subtle shadow, no rounded corners, max-width 720px
  - Gold progress bar (3px, fills left to right across steps)
  - Header: "STEP X OF 3" left + step name right in gold tiny caps

- **Step 1 — Property Address**
  - Uncontrolled input (no React value prop) — required to prevent focus-loss bug
  - AddressInput is a self-contained isolated component: no parent state during typing
  - Google Places Autocomplete: types: ['address'], country: 'us'
  - Validates street_number in address_components (rejects city/neighborhood picks)
  - Fallback: accepts any typed text >5 chars when VITE_GOOGLE_PLACES_API_KEY is empty
  - Lock icon + confidentiality note below

- **Step 2 — Property Type**
  - 2×2 card grid: Single Family / Townhouse / Condo / Custom Luxury
  - Gold circle checkmark on selected card, gold border

- **Step 3 — Contact + TCPA**
  - Name, Phone, Email — underline-style labeled inputs
  - TCPA checkbox with full legal disclosure text
  - Submit disabled until all fields filled + checkbox checked
  - "Get My Valuation" navy button → POST to VITE_SHEET_BEST_URL

- Success state: gold circle check, "Thank you, [First Name]." personalized

⚠️ CRITICAL: Address input MUST remain uncontrolled (no value= prop).
   Adding a controlled value prop re-introduces the focus-loss bug.
   Step visibility uses display:block/none (never unmounts step 1) not AnimatePresence.

### 5. Restaurant Guide
- Background: full-section blurred fine dining photo
  with rgba(0,20,45,0.75) dark overlay — NOT a flat color, NOT flat navy
- Centered layout:
  - "EXCLUSIVE CONTENT" gold eyebrow, tracking-widest
  - Large italic white Cormorant headline
  - Muted white subtext, max-width 600px
  - Email input (translucent white border) + gold "DOWNLOAD GUIDE" button side by side
  - "No spam. One email. That's it." in tiny white/50 below

### 6. Reviews — BUILT (real client reviews injected)
- Background: sand #EDE8DF
- "TESTIMONIALS" gold eyebrow + "What Clients Say" italic Cormorant navy, centered
- Three white cards side by side, generous padding:
  - Filled gold stars ★★★★★ — NEVER outline stars
  - Italic Cormorant quote, navy
  - Thin gold (#C29B40) divider line
  - Client name in bold navy, Source Sans 3
  - Location in gold tiny caps, tracking-widest
- Live reviews (from client-provided screenshot, Session 5):
  1. "His attention to detail and professional approach really stand out. Every step
     feels organized and well thought out. You can tell he values doing things the right way."
     — Kevin R., Scottsdale, AZ
  2. "Jaime's sharp, responsive, and clearly knows his stuff. No fluff — just focus and follow-through."
     — Tyler S., Scottsdale, AZ
  3. "Jaime makes me feel completely comfortable and heard from the beginning.
     You can tell he genuinely cares about the people he works with."
     — Jenna S., Scottsdale, AZ

### 7. Calendly — BUILT (live embed)
- Background: light grey #F5F3EF
- White card, two column layout (420px left / flex-1 right)
- Left column (bordered right):
  - "Secure Your Private Consultation." italic Cormorant navy, large
  - Body text in Source Sans 3, grey
  - Contact info with Lucide icons: Phone / Mail / MapPin
- Right column: Calendly inline widget (NOT an iframe)
  - Loads widget.js script via useEffect (single load, no duplicates)
  - URL: https://calendly.com/brogan-mcguire-creative/30min
  - Params: ?hide_event_type_details=1&hide_gdpr_banner=1 (removes Calendly chrome)
  - Height: 700px fixed (no internal scroll)
  - Falls back to a polished placeholder card if JAIME.calendly === '#'
  - "Powered by Calendly" label removed from UI
- To update URL: change JAIME.calendly in src/lib/constants.ts

### 8. Footer
- Background: navy #002349
- Three column layout:
  - Left: "Jaime Fernandez" large white Cormorant
    Legal disclaimer below in tiny white/40:
    "Jaime Fernandez is a licensed real estate agent in the state of Arizona,
    affiliated with Russ Lyon Sotheby's International Realty. All information
    deemed reliable but not guaranteed. Equal Housing Opportunity.
    Sotheby's International Realty® and the Sotheby's International Realty Logo
    are service marks licensed to Sotheby's International Realty Affiliates LLC
    and used with permission. Each office is independently owned and operated."
  - Center: NAVIGATE column
    Home | Blog | Book a Call | Home Valuation
  - Right: LEGAL column
    Privacy Policy | Terms of Service | Fair Housing | Accessibility
- Bottom row:
  - Left: "© 2025 Jaime Fernandez. All rights reserved."
  - Right: Instagram + Facebook icons

## Blog System

### Design Reference
Sotheby's International Realty blog aesthetic:
- Pure white background throughout
- Editorial magazine feel — no card borders, no shadows
- Images carry all visual weight
- Category labels: tiny gold uppercase tracking-widest
- Section headers: italic Cormorant + full-width gold rule underneath
- Asymmetric featured grid: 1 large post left + 2x2 smaller posts right

### Blog Index (/blog)
- Header: RLSIR blue logo left, HOME | BLOG | BOOK A CALL center, phone + CALL NOW right
- Masthead: Large "The Narrative" italic Cormorant title, centered, gold rule below
- Category filter bar: ALL | MARKET INSIGHTS | NEIGHBORHOODS | BUYER GUIDES | SELLER GUIDES | 85254
- Asymmetric featured grid (55% large left / 45% 2x2 right)
- Per-category sections with gold rule dividers below
- "Stay Informed" email newsletter capture at bottom of page

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
- Password: JaimeAdmin2024! (hardcoded at top of BlogAdmin.tsx — easy to change)
- Two views: LIST VIEW and EDITOR VIEW
- List view: table of all posts (drafts + published), edit + delete actions
- Editor: title input → auto-generates slug, category select, tag pills,
  excerpt with 160 char counter, cover image URL with live preview,
  markdown body textarea, auto read-time calculator, collapsible SEO section
  with live Google preview, published toggle
- Supabase CRUD operations with framer-motion toast notifications
- Delete requires confirmation dialog (shadcn Dialog)

## Supabase

### Environment Variables
VITE_SUPABASE_URL= (get from supabase.com → project → Settings → API)
VITE_SUPABASE_ANON_KEY= (same location)

### Posts Table
Full SQL schema is in a comment block inside src/lib/supabase.ts — copy and run
in the Supabase SQL editor to create the table and set up RLS policies.

Key fields: id, title, slug, excerpt, body, cover_image_url, category,
tags (text array), published (boolean), published_at, seo_title,
seo_description, read_time_minutes, created_at, updated_at

RLS Policies:
- Public can SELECT where published = true
- Admin full access policy (frontend enforces password, not Supabase auth)

## Environment Variables (.env.local)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_PLACES_API_KEY=
VITE_SHEET_BEST_URL=

All four are currently empty. Do not add placeholder text values —
leave them empty so the null guards in the code work correctly.

## File Structure
src/
  components/
    StickyHeader.tsx         ← Nav, transparent to solid white on scroll
    HeroSection.tsx          ← Video bg, left-aligned name, CTAs, stat bar
    AboutSection.tsx         ← Headshot + bio + stats
    MagicZipSection.tsx      ← 85254 explainer, navy + white card
    HomeEvalSection.tsx      ← Multi-step animated form
    RestaurantGuideSection.tsx ← Photo bg + email lead capture
    ReviewsSection.tsx       ← 3 testimonial cards
    CalendlySection.tsx      ← Calendly embed, two column
    Footer.tsx               ← Legal, nav columns, social icons
    FixedBrokerageBadge.tsx  ← ADRE compliance, always visible fixed
    PostCard.tsx             ← Blog card in large/small/grid variants
    ErrorBoundary.tsx        ← Catches crashes, shows error instead of blank
    ui/                      ← shadcn components auto-generated here
  pages/
    HomePage.tsx             ← Assembles all sections in order
    Blog.tsx                 ← Blog index page
    BlogPost.tsx             ← Individual post page
    BlogAdmin.tsx            ← Password-protected CMS
    Resources.tsx            ← Placeholder (HighNote replacement, not built yet)
  lib/
    supabase.ts              ← Supabase client + Post type + SQL schema comment
    constants.ts             ← Jaime's contact info and site constants
    utils.ts                 ← shadcn cn() utility
  App.tsx                    ← BrowserRouter + HelmetProvider + all Routes
  main.tsx                   ← Entry point, ReactLenis root, ErrorBoundary
  index.css                  ← Design tokens, shadcn overrides, .prose-jaime styles

## Build Status

### Completed
- Full project scaffold and all npm dependencies installed
- Design system: CSS custom properties, Tailwind config, shadcn overrides
- React Router with all 5 routes wired
- Lenis smooth scroll wrapping the app
- HelmetProvider + ErrorBoundary in main.tsx
- Supabase client with null guard (app won't crash without credentials)
- Blog index page (/blog) with asymmetric grid and category filters
- Individual blog post page (/blog/:slug) with SEO + JSON-LD
- Blog admin page (/blog/admin) with full editor and Supabase CRUD
- PostCard component with large/small/grid size variants
- .prose-jaime CSS class for markdown body styling
- .env.local file created with empty variable slots
- **Session 4:** All homepage sections rebuilt from Stitch MCP "The Final Definitive Home Page"
  - StickyHeader — transparent → white on scroll, logo cross-fades white/blue
  - HeroSection — video bg (empty src), poster fallback, left-aligned, Fernandez indent, stat bar bottom
    - Poster: https://images.unsplash.com/photo-1710793311332-a2c7d3c3ad3f?w=1920&q=80
  - AboutSection — 5/7 grid, grey placeholder, bio, stats
  - MagicZipSection — navy bg, pull quote, white card with shadow
  - RestaurantGuideSection — photo bg + navy overlay, email form
  - Footer — navy, 3-col, legal copy, social links
- **Session 5:**
  - CalendlySection — live Calendly inline widget (brogan-mcguire-creative/30min), no chrome, 700px height
  - HomeEvalSection — full 3-step form (Address → Property Type → Contact+TCPA)
    - Google Places Autocomplete wired, Sheet.best POST on submit
    - Uncontrolled address input pattern (prevents focus-loss bug)
    - Headline rewritten: "Know Your Home's True Value" + expert/24hr messaging
  - ReviewsSection — real client reviews injected (Kevin R., Tyler S., Jenna S.)
  - FixedBrokerageBadge removed from App.tsx (client decision)
  - global.d.ts — Window.Calendly + Window.google Maps types added
  - src/lib/constants.ts — JAIME.calendly set to live Calendly URL

### Needs Building (Priority Order)
1. Add VITE_GOOGLE_PLACES_API_KEY to .env.local (getting key now)
2. Add VITE_SHEET_BEST_URL to .env.local for form submissions
3. Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY for blog
4. GSAP scroll-triggered section reveal animations
5. Mobile responsiveness audit across all sections
6. Vercel deployment

## Approved Design
Final design was approved after iterating through Google Stitch and Subframe.
All section designs are locked. Key decisions:

HERO: Video background (empty src, poster fallback), "Jaime / Fernandez"
italic two-line left-aligned in Cormorant ~80px, two rectangular CTA buttons,
stat bar pinned to bottom with gold numbers.

COLOR SYSTEM: Sand #EDE8DF for light sections, Navy #002349 for dark sections,
Gold #C29B40 as accent only. Never deviate from these exact values.

TYPOGRAPHY: Cormorant Garamond italic for all display headlines,
Source Sans 3 for all body copy and UI text.

85254 SECTION: Navy background, left column with headline + pull quote,
right column with white card containing "The Magic Zip Code" + two data stats.

FORM: White floating card on sand background, gold progress bar,
2x2 selection cards with gold border on selected state, one step at a time.

RESTAURANT: Dark photo background with navy overlay (NOT flat navy color),
centered email input + gold button side by side.

REVIEWS: White cards on sand, FILLED gold stars, italic quote, gold divider,
bold name, gold location label in tiny caps.

CALENDLY: White card two-column, left contact info, right real calendar embed.

FOOTER: Navy, three column, full legal disclaimer, nav + legal links, social icons.

BLOG: White editorial magazine aesthetic, asymmetric featured grid,
gold rule section dividers, no card borders or shadows anywhere.

## Stitch MCP — Design Reference

Stitch is a Google design tool connected via MCP. The approved homepage design lives here.

### How to Connect Stitch MCP
In Claude Code settings (`~/.claude/claude_code_config.json` or via `/mcp` command), add:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@google/stitch-mcp"]
    }
  }
}
```

Or if using the Claude desktop app, go to Settings → MCP Servers → Add Server.
Verify connection: run `/mcp` in Claude Code — "stitch" should appear under Available.

### Approved Design Location
- **Project:** "Scottsdale Luxury Real Estate"
- **Screen:** "The Final Definitive Home Page"
- Tools: `mcp__stitch__list_projects` → `mcp__stitch__list_screens` → `mcp__stitch__get_screen`
- Getting raw HTML: use `curl` on the Stitch download URL (WebFetch summarizes, curl returns literal HTML)

### What Stitch Is Used For
- Reference for section layouts, spacing, and color decisions when rebuilding components
- All approved section designs are locked — do not redesign without checking Stitch first
- If user asks to "match the Stitch design," pull the HTML and translate Tailwind classes to inline styles

## Critical Rules for Claude Code
1. Never hallucinate shadcn component props — check actual source
   in src/components/ui/ before using any component
2. All Supabase operations must have try/catch blocks
3. FixedBrokerageBadge has been REMOVED — do not add it back
4. Hero video src must remain empty — never add a fake URL
5. Gold color is always exactly #C29B40 — never use any other value
6. Review stars must always be filled gold (★) never outline (☆)
7. Restaurant section background must be a photo with overlay, never flat color
8. Build and verify one section at a time before moving to the next
9. Run npx tsc --noEmit after each section to catch TypeScript errors early
10. The HighNote/resources page is NOT being built yet — leave as placeholder
11. HomeEvalSection address input MUST stay uncontrolled (no value= prop on the input).
    AnimatePresence must NOT wrap step 1. Steps use display:block/none, never unmount step 1.
    Violating this re-introduces the focus-loss typing bug.
12. Calendly URL lives in JAIME.calendly in src/lib/constants.ts — update it there only
