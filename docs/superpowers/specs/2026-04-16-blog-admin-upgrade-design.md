# Blog Admin Upgrade — Design Spec
Date: 2026-04-16

## Overview
Upgrade the existing `/blog/admin` page to support:
1. Username + password login (replacing password-only)
2. Supabase Storage image uploads (cover photo + inline body images)
3. Mandatory cover photo enforcement before publishing
4. All existing functionality preserved (tags, SEO, markdown body, categories, publish/draft, delete)

## 1. Authentication

**Current:** Single password field, checks against hardcoded `ADMIN_PASSWORD = 'JaimeAdmin2024!'`

**New:**
- Two fields: Username + Password
- Credentials: `jaime` / `Test123` (hardcoded at top of `BlogAdmin.tsx`)
- Same localStorage persistence: `blog_admin_auth = 'authenticated'`
- Same shake animation on failure
- UI: username input on top, password below, same navy full-screen gate design

Constants at top of file:
```ts
const ADMIN_USERNAME = 'jaime'
const ADMIN_PASSWORD = 'Test123'
```

## 2. Image Uploads via Supabase Storage

**Bucket:** `blog-images` (public bucket, must be created in Supabase dashboard)

**Upload utility** (inline in BlogAdmin.tsx):
```ts
async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('blog-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
  return data.publicUrl
}
```

### 2a. Cover Photo Upload (mandatory)
- UI: drag-and-drop zone + "Browse files" button
- Accepts `image/*` only
- On file select → immediately upload to Supabase Storage → store returned public URL in `coverUrl` state
- Show upload progress spinner during upload
- Show image preview (full-width, max-height 200px, object-cover) after upload
- Show "×" button to remove/replace cover
- Keep secondary "Paste URL" toggle for power users
- **Required to publish:** if `coverUrl` is empty when user clicks "Save & Publish", block with toast error: "Cover photo is required to publish"
- Draft saves are allowed without cover photo

### 2b. Inline Body Image Upload
- Small "Insert Image" button above the markdown textarea
- Click → file picker → upload → insert `![image description](url)` at cursor position in textarea
- Shows upload spinner inline on the button during upload

## 3. Supabase Storage Bucket Policy

Add to the SQL comment block in `supabase.ts`:

```sql
-- Storage: run in Supabase Storage policies tab
-- Create bucket named "blog-images" with Public enabled via dashboard
-- Then add this policy:
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admin upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images');
```

## 4. Validation Changes

`save()` function updated:
- If `publishOverride === true` (or `published === true`) and `coverUrl` is empty → toast error, return early
- Cover image URL is now saved as `cover_image_url` — no schema change needed

## 5. Files Changed

| File | Change |
|------|--------|
| `src/pages/BlogAdmin.tsx` | Username+password login, image upload UI, mandatory cover validation |
| `src/lib/supabase.ts` | Add storage bucket SQL instructions to comment block |

## 6. No Schema Changes Needed

`cover_image_url text` already exists in the posts table. No migration required.

## Out of Scope
- Rich text / WYSIWYG editor (markdown stays as-is)
- Scheduled publishing
- Post duplication
- Image gallery/library browser
