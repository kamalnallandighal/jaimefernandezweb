# Blog Redesign — Design Spec
**Date:** 2026-04-17  
**Scope:** Blog index, individual post page, blog admin editor  
**Approach:** Option B — full redesign in one pass  

---

## 1. Database — `featured` flag

Add a `featured` boolean column to the Supabase `posts` table (default `false`).  
Only one post should be featured at a time. The admin enforces this via a warning UI (not a DB constraint).

```sql
ALTER TABLE posts ADD COLUMN featured boolean NOT NULL DEFAULT false;
```

Update the `Post` TypeScript type in `src/lib/supabase.ts` to include `featured: boolean`.

---

## 2. Blog Index (`/blog`) — `src/pages/Blog.tsx`

### Featured hero logic
- Query: fetch all published posts ordered by `published_at desc`.
- Featured post: the first post where `featured = true`. If none, fall back to the most recent post (index 0).
- The featured post is pulled out and rendered in the left hero slot.
- Remaining posts fill the 2×2 small grid (up to 4), then the 3-col secondary feed (next 3).

### ALL view layout (desktop → mobile)
- **Desktop:** `55% / 1fr` grid. Left = `large` PostCard (4:5 portrait). Right = 2×2 grid of `small` PostCards (square).
- **Tablet (< 1024px):** Same grid but featured large card goes full width, small 2×2 grid below it.
- **Mobile (< 768px):** Single column. Large card first. Small cards in a `1fr 1fr` 2-col grid below.

### Category-filtered view (any category ≠ ALL)
- Drop the asymmetric hero entirely.
- Render a uniform 3-column grid of `grid` PostCards (3:2 landscape).
- Responsive: 3 col desktop → 2 col tablet → 1 col mobile.

### Spacing fixes
- All horizontal padding: `clamp(24px, 5vw, 48px)` — replaces hardcoded `48px`.
- Category nav gap: `40px` desktop → `20px` on mobile (via responsive inline style using `useWindowWidth`).
- `ShimmerGrid` gets the same responsive padding treatment.

---

## 3. Admin Editor (`/blog/admin`) — `src/pages/BlogAdmin.tsx`

### PostEditor — two-column desktop layout
- **Desktop (≥ 1024px):** CSS Grid `1fr 420px`, metadata column on the RIGHT, body/title column on the LEFT.
  - Left column: title input (large Cormorant), slug field below it, then the full-height markdown body textarea.
  - Right column: cover photo, category, tags, excerpt, read time, featured toggle, SEO (collapsible), publish toggle. Sticky within the viewport so it doesn't scroll away while writing.
- **Tablet / Mobile (< 1024px):** Single column. Metadata fields stack above the body editor.

### Field-level improvements
- **Title:** Large Cormorant input at the top of the left column, full-width. Below it: `URL: /blog/[slug]` as a subtle read-only display that becomes editable on click (not always a raw input).
- **Cover photo:** Fixed `aspect-[16/9]` preview container. Dropzone fills the 16:9 box with dashed border. On upload, image fills the box with an `×` remove button overlay. Looks intentional, not a random height.
- **Category:** Styled select, unchanged. 
- **Tags:** Tag input unchanged (Enter/comma to add). Pills are rounded (`border-radius: 9999px`) with gold text on `rgba(0,35,73,0.08)` background — lighter and more modern than solid navy.
- **Featured toggle:** Gold star icon (★) + "Feature this post" label with a checkbox. If saving with `featured: true` and another post already has `featured: true`, show a warning toast: "Another post is already featured — this will replace it." The save proceeds and the old featured post gets `featured: false` via an additional update call.
- **SEO section:** Stays collapsible, unchanged content.
- **Read time:** Stays as number input, unchanged.
- **Publish toggle:** Stays as checkbox at bottom of metadata column.
- **Body textarea:** `min-height: calc(100vh - 200px)` on desktop so it fills the writing area. `resize-y` stays.

### PostList — mobile treatment
- Desktop: existing table layout (unchanged, it works fine on desktop).
- Mobile (< 768px): replace table with stacked cards. Each card shows: title (Cormorant), category + status badges in a row, date, Edit / Delete buttons.

---

## 4. Individual Post (`/blog/:slug`) — `src/pages/BlogPost.tsx`

### Mobile fixes
- Post header: reduce `pt-14` → `pt-8` on mobile (cover image already takes vertical space).
- Body container: `px-6` on mobile, `px-8` on tablet, centered `max-w-2xl` on desktop — already largely correct, just verify padding doesn't clip.

### Related posts
- Switch PostCard size from `small` (square) to `grid` (3:2 landscape) — more visual weight at the bottom of a long article.
- Section heading stays "More from Jaime".
- Grid: `1 col mobile → 2 col tablet → 3 col desktop` (already using Tailwind responsive classes ✓).

### No reading progress bar
*(Explicitly excluded per client preference — feels gimmicky.)*

---

## 5. PostCard — no new variants needed
Existing `large`, `small`, and `grid` variants cover all use cases. The category-filtered uniform grid uses the existing `grid` variant.

---

## Implementation Phases (for subagents)

### Phase 1 — Database + types
- Add `featured` column to Supabase via SQL.
- Update `Post` type in `src/lib/supabase.ts`.

### Phase 2 — Admin editor redesign
- Two-column layout in `PostEditor`.
- Featured toggle with conflict resolution.
- Cover photo 16:9 aspect fix.
- Tag pills rounded.
- PostList mobile card treatment.

### Phase 3 — Blog index redesign
- Featured post query logic.
- ALL view responsive grid (desktop/tablet/mobile).
- Category-filtered uniform grid.
- Spacing / padding responsive fixes.

### Phase 4 — Individual post polish
- Mobile padding fixes in `BlogPost.tsx`.
- Switch related posts to `grid` PostCard variant.

---

## Files Changed
- `src/lib/supabase.ts` — add `featured` to Post type
- `src/pages/Blog.tsx` — full responsive + featured logic
- `src/pages/BlogPost.tsx` — mobile fixes + related posts variant
- `src/pages/BlogAdmin.tsx` — full editor redesign
- Supabase SQL: `ALTER TABLE posts ADD COLUMN featured boolean NOT NULL DEFAULT false`
