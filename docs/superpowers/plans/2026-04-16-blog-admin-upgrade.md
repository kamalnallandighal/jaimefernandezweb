# Blog Admin Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade BlogAdmin with username+password login, Supabase Storage image uploads (cover mandatory, inline body images), and cover photo enforcement on publish.

**Architecture:** All changes are isolated to `src/pages/BlogAdmin.tsx` and `src/lib/supabase.ts`. No new files needed. The `uploadImage` helper uploads to the `blog-images` Supabase Storage public bucket and returns a public URL. Cover image state drives both the preview UI and the publish gate.

**Tech Stack:** React, TypeScript, Supabase JS client (`supabase.storage`), Framer Motion (existing), Tailwind CSS

---

### Task 1: Update login credentials and add username field

**Files:**
- Modify: `src/pages/BlogAdmin.tsx` (LoginGate component, constants at top)

- [ ] **Step 1: Update the credential constants at the top of the file**

Replace lines 6-6 (the `ADMIN_PASSWORD` constant):

```ts
const ADMIN_USERNAME = 'jaime'
const ADMIN_PASSWORD = 'Test123'
```

- [ ] **Step 2: Update the LoginGate component state and logic**

Replace the entire `LoginGate` function (lines 67–143) with:

```tsx
function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [shake, setShake] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const tryLogin = () => {
    if (username.trim().toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('blog_admin_auth', 'authenticated')
      onSuccess()
    } else {
      setShake(true)
      setErrorMsg('Incorrect username or password')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: '#002349' }}
    >
      <img
        src="/assets/logos/RLSIR_Horz_white.png"
        alt="Russ Lyon Sotheby's International Realty"
        style={{ width: '160px', marginBottom: '3rem', opacity: 0.85 }}
      />
      <p
        className="font-display text-white mb-8"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.875rem' }}
      >
        Blog Admin
      </p>
      <motion.div
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '320px' }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
          className="font-body w-full px-4 py-3 outline-none mb-2"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
          className="font-body w-full px-4 py-3 outline-none"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
        />
        {errorMsg && (
          <p
            className="font-body text-center mt-2"
            style={{ fontSize: '0.875rem', color: '#C29B40' }}
          >
            {errorMsg}
          </p>
        )}
        <button
          onClick={tryLogin}
          className="font-body w-full py-3 mt-4 transition-colors duration-200 cursor-pointer"
          style={{
            backgroundColor: '#C29B40',
            color: '#002349',
            border: 'none',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Enter
        </button>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 3: Build and check for TypeScript errors**

```bash
cd /Users/knallandighal/Documents/Websites/jaime-fernandez && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BlogAdmin.tsx
git commit -m "feat: add username field to blog admin login (jaime/Test123)"
```

---

### Task 2: Add uploadImage utility and update supabase.ts storage docs

**Files:**
- Modify: `src/pages/BlogAdmin.tsx` (add uploadImage function after imports)
- Modify: `src/lib/supabase.ts` (add storage bucket SQL/policy instructions to comment block)

- [ ] **Step 1: Add the uploadImage helper to BlogAdmin.tsx**

Add this function after the `formatDate` function (after line 35, before the Toast interface):

```ts
async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('blog-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
  return data.publicUrl
}
```

- [ ] **Step 2: Add storage bucket instructions to supabase.ts comment block**

In `src/lib/supabase.ts`, append to the end of the SQL comment block (before the closing `*/`):

```sql
-- STORAGE SETUP (run after creating "blog-images" public bucket in dashboard):
-- In Supabase Dashboard → Storage → New Bucket → name: blog-images → Public: ON
-- Then in SQL Editor run:
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admin upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images');

create policy "Admin delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images');
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BlogAdmin.tsx src/lib/supabase.ts
git commit -m "feat: add uploadImage utility + storage bucket docs"
```

---

### Task 3: Replace cover image URL input with drag-and-drop file upload

**Files:**
- Modify: `src/pages/BlogAdmin.tsx` (PostEditor component — cover image section)

- [ ] **Step 1: Add coverUploading state to PostEditor**

In the PostEditor function, add these new state variables alongside the existing ones (after `const [saving, setSaving] = useState(false)`):

```ts
const [coverUploading, setCoverUploading] = useState(false)
const [showCoverUrlInput, setShowCoverUrlInput] = useState(!!post?.cover_image_url && !post.cover_image_url.includes('supabase'))
const coverFileRef = useRef<HTMLInputElement>(null)
```

- [ ] **Step 2: Add handleCoverFile function inside PostEditor**

Add this function inside PostEditor, after the `removeTag` function:

```ts
const handleCoverFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    addToast('Please select an image file', false)
    return
  }
  setCoverUploading(true)
  try {
    const url = await uploadImage(file)
    setCoverUrl(url)
    setShowCoverUrlInput(false)
  } catch {
    addToast('Failed to upload image', false)
  } finally {
    setCoverUploading(false)
  }
}
```

- [ ] **Step 3: Replace the cover image URL section in PostEditor JSX**

Find and replace the entire "Cover Image URL" `<div className="mb-8">` block (the one starting with `<label ... Cover Image URL`) with:

```tsx
{/* Cover Photo */}
<div className="mb-8">
  <label
    className="font-body block mb-2"
    style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
  >
    Cover Photo <span style={{ color: '#ef4444' }}>*</span>{' '}
    <span style={{ color: '#cccccc', textTransform: 'none', letterSpacing: 0 }}>(required to publish)</span>
  </label>

  {/* Hidden file input */}
  <input
    ref={coverFileRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) handleCoverFile(file)
      e.target.value = ''
    }}
  />

  {/* Preview (shown after upload) */}
  {coverUrl && !coverUploading && (
    <div className="relative mb-3">
      <img
        src={coverUrl}
        alt="Cover preview"
        className="w-full object-cover"
        style={{ maxHeight: '220px', display: 'block' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
      <button
        onClick={() => { setCoverUrl(''); setShowCoverUrlInput(false) }}
        className="absolute top-2 right-2 font-body flex items-center justify-center cursor-pointer"
        style={{
          width: '28px',
          height: '28px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          border: 'none',
          fontSize: '1rem',
          lineHeight: 1,
        }}
        title="Remove cover photo"
      >
        ×
      </button>
    </div>
  )}

  {/* Upload zone (shown when no cover) */}
  {!coverUrl && (
    <div
      className="border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors"
      style={{
        borderColor: coverUploading ? '#C29B40' : 'rgba(0,35,73,0.2)',
        backgroundColor: coverUploading ? 'rgba(194,155,64,0.04)' : 'rgba(0,35,73,0.02)',
        padding: '2.5rem 1rem',
        minHeight: '140px',
      }}
      onClick={() => !coverUploading && coverFileRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) handleCoverFile(file)
      }}
    >
      {coverUploading ? (
        <p className="font-body" style={{ fontSize: '0.875rem', color: '#C29B40' }}>
          Uploading...
        </p>
      ) : (
        <>
          <p className="font-body mb-2" style={{ fontSize: '0.875rem', color: '#002349' }}>
            Drag & drop or{' '}
            <span style={{ color: '#C29B40', textDecoration: 'underline' }}>browse</span>
          </p>
          <p className="font-body" style={{ fontSize: '0.75rem', color: '#999999' }}>
            JPG, PNG, WebP recommended
          </p>
        </>
      )}
    </div>
  )}

  {/* URL toggle */}
  <button
    onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
    className="font-body bg-transparent border-none cursor-pointer mt-2"
    style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999999' }}
  >
    {showCoverUrlInput ? '− Hide URL input' : '+ Paste URL instead'}
  </button>

  {showCoverUrlInput && (
    <div className="mt-2">
      <input
        type="text"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
        placeholder="https://..."
        className="font-body w-full px-3 py-2.5 outline-none border"
        style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
      />
    </div>
  )}
</div>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogAdmin.tsx
git commit -m "feat: drag-and-drop cover photo upload via Supabase Storage"
```

---

### Task 4: Add inline image upload button to body markdown editor

**Files:**
- Modify: `src/pages/BlogAdmin.tsx` (PostEditor — body section)

- [ ] **Step 1: Add bodyUploading state and bodyRef to PostEditor**

Add alongside the existing state/refs inside PostEditor:

```ts
const [bodyUploading, setBodyUploading] = useState(false)
const bodyRef = useRef<HTMLTextAreaElement>(null)
const bodyImageInputRef = useRef<HTMLInputElement>(null)
```

- [ ] **Step 2: Add handleBodyImageInsert function inside PostEditor**

Add after `handleCoverFile`:

```ts
const handleBodyImageInsert = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    addToast('Please select an image file', false)
    return
  }
  setBodyUploading(true)
  try {
    const url = await uploadImage(file)
    const textarea = bodyRef.current
    if (textarea) {
      const start = textarea.selectionStart ?? body.length
      const end = textarea.selectionEnd ?? body.length
      const insertion = `![image](${url})`
      const newBody = body.slice(0, start) + insertion + body.slice(end)
      setBody(newBody)
      // Restore cursor position after the inserted text
      setTimeout(() => {
        textarea.selectionStart = start + insertion.length
        textarea.selectionEnd = start + insertion.length
        textarea.focus()
      }, 0)
    } else {
      setBody((prev) => prev + `\n![image](${url})`)
    }
    addToast('Image inserted ✓', true)
  } catch {
    addToast('Failed to upload image', false)
  } finally {
    setBodyUploading(false)
  }
}
```

- [ ] **Step 3: Update the body textarea section in PostEditor JSX**

Find the body `<div className="mb-8">` that contains the Content label and textarea. Replace the label + hint paragraph with:

```tsx
{/* Body */}
<div className="mb-8">
  <div className="flex items-center justify-between mb-1">
    <label
      className="font-body"
      style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
    >
      Content <span style={{ color: '#cccccc' }}>(Markdown supported)</span>
    </label>
    {/* Insert Image button */}
    <>
      <input
        ref={bodyImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleBodyImageInsert(file)
          e.target.value = ''
        }}
      />
      <button
        onClick={() => bodyImageInputRef.current?.click()}
        disabled={bodyUploading}
        className="font-body border-none cursor-pointer disabled:opacity-50 transition-opacity"
        style={{
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#C29B40',
          backgroundColor: 'transparent',
          padding: '2px 0',
        }}
      >
        {bodyUploading ? 'Uploading...' : '+ Insert Image'}
      </button>
    </>
  </div>
  <p
    className="font-body mb-2"
    style={{ fontSize: '10px', color: '#999999' }}
  >
    **bold** | *italic* | # Heading | [link](url) | ![image](url)
  </p>
  <textarea
    ref={bodyRef}
    value={body}
    onChange={(e) => setBody(e.target.value)}
    rows={20}
    className="font-mono w-full px-3 py-3 outline-none border resize-y"
    style={{ fontSize: '0.8125rem', color: '#333', borderColor: 'rgba(0,0,0,0.12)', lineHeight: 1.6 }}
  />
</div>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogAdmin.tsx
git commit -m "feat: inline image upload button inserts markdown at cursor"
```

---

### Task 5: Enforce cover photo required on publish

**Files:**
- Modify: `src/pages/BlogAdmin.tsx` (PostEditor `save` function)

- [ ] **Step 1: Update the save() validation block**

Find the `save` function in PostEditor. Replace the existing validation check:

```ts
if (!title.trim() || !body.trim()) {
  addToast('Title and body are required', false)
  return
}
```

With:

```ts
if (!title.trim() || !body.trim()) {
  addToast('Title and body are required', false)
  return
}
const shouldPublish = publishOverride !== undefined ? publishOverride : published
if (shouldPublish && !coverUrl.trim()) {
  addToast('Cover photo is required to publish', false)
  return
}
```

Also remove the duplicate `const shouldPublish = ...` line that appears later in the function (since we now declare it earlier). Find:

```ts
const shouldPublish = publishOverride !== undefined ? publishOverride : published
const publishedAt = shouldPublish && !post?.published_at ? new Date().toISOString() : post?.published_at || null
```

And replace with just:

```ts
const publishedAt = shouldPublish && !post?.published_at ? new Date().toISOString() : post?.published_at || null
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/BlogAdmin.tsx
git commit -m "feat: block publish if no cover photo, drafts still allowed"
```

---

### Task 6: Final build verification

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Run dev server and manually verify**

```bash
npm run dev
```

Checklist:
- [ ] Navigate to `/blog/admin`
- [ ] Login screen shows Username + Password fields
- [ ] Wrong credentials → shake + error message
- [ ] `jaime` / `Test123` → enters admin
- [ ] Click "New Post" → editor opens
- [ ] Cover photo section shows drag-and-drop zone
- [ ] Drag an image onto the zone → preview appears with × button
- [ ] Click × → zone reappears
- [ ] "Paste URL instead" toggle shows URL input
- [ ] "+ Insert Image" button above body editor → file picker → inserts `![image](url)` at cursor
- [ ] Click "Save & Publish" with no cover → toast: "Cover photo is required to publish"
- [ ] Click "Save Draft" with no cover → saves successfully
- [ ] Logout button works

- [ ] **Step 3: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: blog admin upgrade complete"
```
