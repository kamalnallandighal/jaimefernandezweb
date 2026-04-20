import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { marked } from 'marked'
import { supabase, type Post } from '@/lib/supabase'
import { generateSEO } from '@/lib/seoAI'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useWindowWidth } from '@/lib/useWindowWidth'
import RichTextEditor from '@/components/RichTextEditor'

const ADMIN_USERNAME = 'jaime'
const ADMIN_PASSWORD = 'Test123'

const CATEGORIES = [
  'Market Insights',
  'Neighborhoods',
  'Buyer Guides',
  'Seller Guides',
  '85254',
  'Other',
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

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

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg {
  id: number
  message: string
  success: boolean
}

function Toast({ toast, onDismiss }: { toast: ToastMsg; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="font-body text-sm px-5 py-3 text-white"
      style={{ backgroundColor: toast.success ? '#002349' : '#ef4444', minWidth: '220px' }}
    >
      {toast.message}
    </motion.div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────

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
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ backgroundColor: '#002349' }}>
      <img
        src="/assets/logos/RLSIR_Horz_white.png"
        alt="Russ Lyon Sotheby's International Realty"
        style={{ width: '160px', marginBottom: '3rem', opacity: 0.85 }}
      />
      <p className="font-display text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.875rem' }}>
        Blog Admin
      </p>
      <motion.div
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '320px' }}
      >
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
          className="font-body w-full px-4 py-3 outline-none mb-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
        />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
          className="font-body w-full px-4 py-3 outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
        />
        {errorMsg && (
          <p className="font-body text-center mt-2" style={{ fontSize: '0.875rem', color: '#C29B40' }}>{errorMsg}</p>
        )}
        <button onClick={tryLogin}
          className="font-body w-full py-3 mt-4 transition-colors duration-200 cursor-pointer"
          style={{ backgroundColor: '#C29B40', color: '#002349', border: 'none', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}
        >
          Enter
        </button>
      </motion.div>
    </div>
  )
}

// ─── Post List ────────────────────────────────────────────────────────────────

interface PostListProps {
  posts: Post[]
  loading: boolean
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}

function PostList({ posts, loading, onEdit, onDelete }: PostListProps) {
  const width = useWindowWidth()
  const isMobile = width < 768

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-12 animate-pulse space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: '#002349' }}>
          No posts yet. Click &quot;New Post&quot; to get started.
        </p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        {posts.map((post) => (
          <div key={post.id} style={{ backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '16px 0' }}>
            <p className="font-display mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: '#002349', lineHeight: 1.4 }}>
              {post.title}
            </p>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {post.category && (
                <span className="font-body" style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>{post.category}</span>
              )}
              <span className="font-body px-2 py-0.5" style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: post.published ? '#f0fdf4' : '#f3f4f6', color: post.published ? '#15803d' : '#6b7280' }}>
                {post.published ? 'Published' : 'Draft'}
              </span>
              <span className="font-body" style={{ fontSize: '0.75rem', color: '#999' }}>
                {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
              </span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => onEdit(post)} className="font-body bg-transparent border-none cursor-pointer hover:underline" style={{ fontSize: '0.75rem', color: '#C29B40' }}>Edit</button>
              <button onClick={() => onDelete(post)} className="font-body bg-transparent border-none cursor-pointer hover:underline" style={{ fontSize: '0.75rem', color: '#ef4444' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            {['Title', 'Category', 'Status', 'Date', 'Actions'].map((h) => (
              <th key={h} className="font-body pb-3 text-left" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b transition-colors hover:bg-gray-50" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <td className="py-4 pr-6">
                <p className="font-display font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: '#002349' }}>{post.title}</p>
              </td>
              <td className="py-4 pr-6">
                <span className="font-body" style={{ fontSize: '0.75rem', color: '#999' }}>{post.category || '—'}</span>
              </td>
              <td className="py-4 pr-6">
                <span className="font-body px-2 py-1" style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: post.published ? '#f0fdf4' : '#f3f4f6', color: post.published ? '#15803d' : '#6b7280' }}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="py-4 pr-6">
                <span className="font-body" style={{ fontSize: '0.75rem', color: '#999' }}>
                  {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                </span>
              </td>
              <td className="py-4">
                <div className="flex gap-4">
                  <button onClick={() => onEdit(post)} className="font-body bg-transparent border-none cursor-pointer hover:underline" style={{ fontSize: '0.75rem', color: '#C29B40' }}>Edit</button>
                  <button onClick={() => onDelete(post)} className="font-body bg-transparent border-none cursor-pointer hover:underline" style={{ fontSize: '0.75rem', color: '#ef4444' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Post Editor (3-step wizard) ──────────────────────────────────────────────

interface PostEditorProps {
  post: Post | null
  onBack: () => void
  onSave: () => void
  addToast: (msg: string, success: boolean) => void
}

const STEP_LABELS = ['Write', 'Details & SEO', 'Cover'] as const

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
}

function PostEditor({ post, onBack, onSave, addToast }: PostEditorProps) {
  const isNew = !post

  // ── Step state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState(1)

  // ── Form state ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugEdited, setSlugEdited] = useState(!!post)
  const [category, setCategory] = useState(post?.category || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url || '')
  const [body, setBody] = useState<string>(() => {
    const raw = post?.body || ''
    if (!raw) return ''
    // Auto-convert legacy markdown to HTML
    if (!raw.trim().startsWith('<')) return String(marked.parse(raw))
    return raw
  })
  const [readTime, setReadTime] = useState(post?.read_time_minutes || 0)
  const [readTimeEdited, setReadTimeEdited] = useState(!!post?.read_time_minutes)
  const [autoReadTime, setAutoReadTime] = useState(0)
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [seoDesc, setSeoDesc] = useState(post?.seo_description || '')
  const [published, setPublished] = useState(post?.published || false)
  const [featured, setFeatured] = useState(post?.featured || false)
  const [saving, setSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [showCoverUrlInput, setShowCoverUrlInput] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  // ── AI auto-fill ──────────────────────────────────────────────────────────
  const runAI = async () => {
    if (!title.trim() || !body.trim()) {
      addToast('Write a title and some content first', false)
      return
    }
    setAiLoading(true)
    try {
      // Pull previous posts for context so the AI learns over time
      const previousPosts = supabase
        ? (await supabase.from('posts').select('title, tags, category').eq('published', true).order('published_at', { ascending: false }).limit(20)).data ?? []
        : []

      const result = await generateSEO(title, body, previousPosts)

      if (result.category && CATEGORIES.includes(result.category)) setCategory(result.category)
      if (result.tags?.length > 0) setTags(result.tags)
      if (result.excerpt) setExcerpt(result.excerpt)
      if (result.seo_title) setSeoTitle(result.seo_title)
      if (result.seo_description) setSeoDesc(result.seo_description)

      addToast('SEO fields filled ✓ — review and adjust as needed', true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI request failed'
      addToast(msg.includes('VITE_CLAUDE_API_KEY') ? 'Claude API key not configured yet' : 'AI failed — try again', false)
      console.error('[SEO AI]', err)
    } finally {
      setAiLoading(false)
    }
  }

  const coverFileRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  // ── Auto-generate slug from title ─────────────────────────────────────────
  useEffect(() => {
    if (!slugEdited && title) setSlug(generateSlug(title))
  }, [title, slugEdited])

  // ── Auto-calculate read time from HTML body ────────────────────────────────
  useEffect(() => {
    const text = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = text.split(' ').filter(Boolean).length
    const auto = Math.ceil(words / 200) || 1
    setAutoReadTime(auto)
    if (!readTimeEdited) setReadTime(auto)
  }, [body, readTimeEdited])

  // ── Tag helpers ───────────────────────────────────────────────────────────
  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,/g, '')
    if (tag && !tags.includes(tag)) setTags([...tags, tag])
    setTagInput('')
  }
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
  }
  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  // ── Cover photo ───────────────────────────────────────────────────────────
  const handleCoverFile = async (file: File) => {
    if (coverUploading) return
    if (!file.type.startsWith('image/')) { addToast('Please select an image file', false); return }
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

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = async (publishOverride?: boolean) => {
    if (!title.trim() || !body.trim()) { addToast('Title and body are required', false); return }
    const shouldPublish = publishOverride !== undefined ? publishOverride : published
    if (shouldPublish && !coverUrl.trim()) { addToast('Cover photo is required to publish', false); return }
    setSaving(true)
    const publishedAt =
      shouldPublish && !post?.published_at ? new Date().toISOString() : post?.published_at || null

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      body: body.trim(),
      cover_image_url: coverUrl.trim() || null,
      category: category || null,
      tags: tags.length > 0 ? tags : null,
      published: shouldPublish,
      published_at: publishedAt,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDesc.trim() || null,
      read_time_minutes: readTime || null,
      featured,
    }

    try {
      if (!supabase) throw new Error('Supabase not configured')

      if (featured) {
        const { data: existingFeatured } = await supabase
          .from('posts').select('id').eq('featured', true).neq('id', post?.id ?? '').limit(1)
        if (existingFeatured && existingFeatured.length > 0) {
          await supabase.from('posts').update({ featured: false }).eq('id', existingFeatured[0].id)
          addToast('Replaced previous featured post', true)
        }
      }

      if (isNew) {
        const { error } = await supabase.from('posts').insert([payload])
        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', post.id)
        if (error) throw error
      }
      addToast('Post saved successfully ✓', true)
      onSave()
    } catch {
      addToast('Failed to save post', false)
    } finally {
      setSaving(false)
    }
  }

  // ── Step navigation ───────────────────────────────────────────────────────
  const goTo = (s: 1 | 2 | 3, dir: 1 | -1) => { setDirection(dir); setStep(s) }
  const next = () => step < 3 && goTo((step + 1) as 1 | 2 | 3, 1)
  const prev = () => step > 1 && goTo((step - 1) as 1 | 2 | 3, -1)

  const googlePreviewTitle = (seoTitle || title).slice(0, 60)
  const googlePreviewDesc = (seoDesc || excerpt).slice(0, 160)

  // ── Step 1: Write ─────────────────────────────────────────────────────────
  const step1Content = (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="font-display w-full outline-none border-b pb-3 bg-transparent"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '2rem',
            color: '#002349',
            borderColor: 'rgba(194,155,64,0.35)',
          }}
        />
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="font-body" style={{ fontSize: '0.75rem', color: '#999' }}>/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
            className="font-body outline-none border-b bg-transparent flex-1"
            style={{ fontSize: '0.75rem', color: '#999', borderColor: 'rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <RichTextEditor
        value={body}
        onChange={setBody}
        onImageUpload={async (file) => {
          const url = await uploadImage(file)
          addToast('Image inserted ✓', true)
          return url
        }}
      />
    </div>
  )

  // ── Step 2: Details & SEO ─────────────────────────────────────────────────
  const step2Content = (
    <div style={{ maxWidth: '720px' }}>

      {/* AI auto-fill button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div>
          <p className="font-body" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#002349', fontWeight: 600 }}>
            Details &amp; SEO
          </p>
          <p className="font-body" style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            Fill manually or let AI analyze your post
          </p>
        </div>
        <button
          onClick={runAI}
          disabled={aiLoading}
          title={aiLoading ? 'Analyzing your post...' : 'Use Claude AI to generate SEO-optimized metadata'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: aiLoading ? 'rgba(194,155,64,0.10)' : '#002349',
            color: aiLoading ? '#C29B40' : '#ffffff',
            border: aiLoading ? '1px solid rgba(194,155,64,0.30)' : '1px solid #002349',
            cursor: aiLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => { if (!aiLoading) { (e.currentTarget as HTMLElement).style.backgroundColor = '#C29B40'; (e.currentTarget as HTMLElement).style.borderColor = '#C29B40' } }}
          onMouseLeave={e => { if (!aiLoading) { (e.currentTarget as HTMLElement).style.backgroundColor = '#002349'; (e.currentTarget as HTMLElement).style.borderColor = '#002349' } }}
        >
          {aiLoading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Auto-fill with AI
            </>
          )}
        </button>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '24px' }}>
        <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Category
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="font-body w-full px-3 py-2.5 outline-none border bg-white cursor-pointer"
          style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: '24px' }}>
        <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Tags
        </label>
        <input
          ref={tagInputRef}
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag + Enter or comma"
          className="font-body w-full px-3 py-2.5 outline-none border"
          style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
        />
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-body"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px',
                  backgroundColor: 'rgba(0,35,73,0.07)',
                  color: '#002349',
                  borderRadius: '9999px',
                  border: '1px solid rgba(0,35,73,0.15)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {tag}
                <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1rem', lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div style={{ marginBottom: '24px' }}>
        <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Excerpt <span style={{ color: '#ccc', textTransform: 'none', letterSpacing: 0 }}>(shown on blog index + meta description)</span>
        </label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
          className="font-body w-full px-3 py-2.5 outline-none border resize-none"
          style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
        />
        <p className="font-body text-right mt-1" style={{ fontSize: '0.75rem', color: excerpt.length > 160 ? '#ef4444' : '#999' }}>
          {excerpt.length} / 160
        </p>
      </div>

      {/* Read time */}
      <div style={{ marginBottom: '24px' }}>
        <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Read Time (minutes)
        </label>
        <input type="number" value={readTime}
          onChange={(e) => { setReadTime(parseInt(e.target.value) || 0); setReadTimeEdited(true) }}
          className="font-body px-3 py-2.5 outline-none border w-24"
          style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
        />
        <p className="font-body mt-1" style={{ fontSize: '0.75rem', color: '#999' }}>
          Auto-calculated: {autoReadTime} min
        </p>
      </div>

      {/* Featured toggle */}
      <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
            style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#C29B40', cursor: 'pointer', flexShrink: 0 }}
          />
          <div>
            <span className="font-body font-semibold" style={{ fontSize: '0.875rem', color: '#002349' }}>
              <span style={{ color: '#C29B40', marginRight: '4px' }}>★</span>
              Feature this post
            </span>
            <p className="font-body" style={{ fontSize: '0.75rem', color: '#999' }}>
              Mark as the hero story on the blog homepage
            </p>
          </div>
        </label>
      </div>

      {/* SEO */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <p className="font-body" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C29B40', marginBottom: '16px' }}>
          SEO Settings
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>SEO Title</label>
          <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
            className="font-body w-full px-3 py-2.5 outline-none border"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          />
          <p className="font-body mt-1 text-right" style={{ fontSize: '0.75rem', color: seoTitle.length > 60 ? '#ef4444' : '#999' }}>
            {seoTitle.length} / 60
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>SEO Description</label>
          <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3}
            className="font-body w-full px-3 py-2.5 outline-none border resize-none"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          />
          <p className="font-body mt-1 text-right" style={{ fontSize: '0.75rem', color: seoDesc.length > 160 ? '#ef4444' : '#999' }}>
            {seoDesc.length} / 160
          </p>
        </div>

        {/* Google SERP preview */}
        <div>
          <p className="font-body" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
            Google Preview
          </p>
          <div style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '16px' }}>
            <p className="font-body" style={{ fontSize: '1rem', color: '#1a0dab' }}>{googlePreviewTitle || 'Post title will appear here'}</p>
            <p className="font-body" style={{ fontSize: '0.75rem', color: '#006621' }}>jfscottsdalehomes.com/blog/{slug || 'post-slug'}</p>
            <p className="font-body" style={{ fontSize: '0.75rem', color: '#545454', marginTop: '2px' }}>{googlePreviewDesc || 'Excerpt or SEO description will appear here...'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Step 3: Cover ─────────────────────────────────────────────────────────
  const step3Content = (
    <div style={{ maxWidth: '640px' }}>
      <input ref={coverFileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); e.target.value = '' }}
      />

      <div style={{ marginBottom: '16px' }}>
        <label className="font-body block" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Cover Photo <span style={{ color: '#ef4444' }}>*</span>{' '}
          <span style={{ color: '#ccc', textTransform: 'none', letterSpacing: 0 }}>(required to publish)</span>
        </label>

        <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%' }}>
          {coverUrl && !coverUploading ? (
            <>
              <img src={coverUrl} alt="Cover preview"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <button onClick={() => { setCoverUrl(''); setShowCoverUrlInput(false) }}
                style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', fontSize: '1rem', lineHeight: 1, cursor: 'pointer', zIndex: 1 }}
                title="Remove cover photo"
              >×</button>
            </>
          ) : (
            <div
              style={{
                position: 'absolute', inset: 0,
                border: '2px dashed',
                borderColor: coverUploading ? '#C29B40' : 'rgba(0,35,73,0.2)',
                backgroundColor: coverUploading ? 'rgba(194,155,64,0.04)' : 'rgba(0,35,73,0.02)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: coverUploading ? 'default' : 'pointer',
              }}
              onClick={() => !coverUploading && coverFileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleCoverFile(f) }}
            >
              {coverUploading
                ? <p className="font-body" style={{ fontSize: '0.875rem', color: '#C29B40' }}>Uploading...</p>
                : <>
                    <p className="font-body" style={{ fontSize: '0.8125rem', color: '#002349' }}>
                      Drag & drop or <span style={{ color: '#C29B40', textDecoration: 'underline' }}>browse</span>
                    </p>
                    <p className="font-body" style={{ fontSize: '0.6875rem', color: '#999', marginTop: '4px' }}>JPG, PNG, WebP — 16:9</p>
                  </>
              }
            </div>
          )}
        </div>

        <button onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
          className="font-body bg-transparent border-none cursor-pointer mt-2"
          style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999' }}
        >
          {showCoverUrlInput ? '− Hide URL input' : '+ Paste URL instead'}
        </button>
        {showCoverUrlInput && (
          <div style={{ marginTop: '8px' }}>
            <input type="text" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..."
              className="font-body w-full px-3 py-2.5 outline-none border"
              style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
            />
          </div>
        )}
      </div>

      {/* Published toggle */}
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
            style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#C29B40', cursor: 'pointer', flexShrink: 0 }}
          />
          <div>
            <span className="font-body font-semibold" style={{ fontSize: '0.875rem', color: '#002349' }}>Published</span>
            <p className="font-body" style={{ fontSize: '0.75rem', color: '#999' }}>Unpublished posts are only visible to admins</p>
          </div>
        </label>
      </div>
    </div>
  )

  return (
    <div style={{ paddingBottom: '88px' }}>
      {/* ── Step tabs ── */}
      <div style={{ padding: '0 48px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid rgba(0,0,0,0.06)' }}>
          {STEP_LABELS.map((label, i) => {
            const s = (i + 1) as 1 | 2 | 3
            const isActive = step === s
            const isDone = step > s
            return (
              <button
                key={s}
                onClick={() => s !== step && goTo(s, s > step ? 1 : -1)}
                className="font-body"
                style={{
                  padding: '14px 28px',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #002349' : '2px solid transparent',
                  marginBottom: '-2px',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? '#002349' : isDone ? '#C29B40' : '#999',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: isActive ? '#002349' : isDone ? '#C29B40' : 'rgba(0,0,0,0.12)',
                    color: isActive || isDone ? 'white' : '#999',
                    fontSize: '9px', fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? '✓' : s}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Step content ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 48px 0', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {step === 1 && step1Content}
            {step === 2 && step2Content}
            {step === 3 && step3Content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom action bar ── */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 32px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: 'white',
          zIndex: 50,
        }}
      >
        {/* Left: back */}
        <button
          onClick={step === 1 ? onBack : prev}
          className="font-body bg-transparent border-none cursor-pointer transition-colors hover:text-navy"
          style={{ fontSize: '0.875rem', color: '#999' }}
        >
          ← {step === 1 ? 'All posts' : STEP_LABELS[step - 2]}
        </button>

        {/* Center: step dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              onClick={() => s !== step && goTo(s, s > step ? 1 : -1)}
              style={{
                width: s === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: s === step ? '#002349' : step > s ? '#C29B40' : 'rgba(0,0,0,0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="font-body px-5 py-2.5 border cursor-pointer transition-colors disabled:opacity-50"
            style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#002349', borderColor: '#002349', backgroundColor: 'white' }}
          >
            Save Draft
          </button>
          {step < 3 ? (
            <button
              onClick={next}
              className="font-body px-5 py-2.5 cursor-pointer transition-colors"
              style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: '#002349', color: 'white', border: 'none', fontWeight: 600 }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="font-body px-5 py-2.5 cursor-pointer transition-colors disabled:opacity-50"
              style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: '#C29B40', color: '#002349', border: 'none', fontWeight: 600 }}
            >
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function BlogAdmin() {
  const [authed, setAuthed] = useState(false)
  const [view, setView] = useState<'list' | 'editor'>('list')
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  useEffect(() => {
    if (localStorage.getItem('blog_admin_auth') === 'authenticated') setAuthed(true)
  }, [])

  useEffect(() => {
    if (authed) fetchPosts()
  }, [authed])

  const fetchPosts = async () => {
    setPostsLoading(true)
    try {
      if (!supabase) return
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      setPosts(data || [])
    } catch {
      // silently fail
    } finally {
      setPostsLoading(false)
    }
  }

  const addToast = (message: string, success: boolean) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, success }])
  }

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const handleEdit = (post: Post) => { setEditingPost(post); setView('editor') }
  const handleNew = () => { setEditingPost(null); setView('editor') }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      if (!supabase) throw new Error('Supabase not configured')
      const { error } = await supabase.from('posts').delete().eq('id', deleteTarget.id)
      if (error) throw error
      addToast('Post deleted', true)
      await fetchPosts()
    } catch {
      addToast('Failed to delete post', false)
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleSave = async () => { await fetchPosts(); setView('list') }

  const logout = () => { localStorage.removeItem('blog_admin_auth'); window.location.reload() }

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />

  return (
    <div className="bg-white min-h-screen">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-8 py-4" style={{ backgroundColor: '#002349' }}>
        <Link to="/">
          <img src="/assets/logos/RLSIR_Horz_white.png" alt="Russ Lyon Sotheby's International Realty" style={{ width: '100px', opacity: 0.8, display: 'block' }} />
        </Link>
        <p className="font-display text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem' }}>
          Blog Admin
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/blog"
            className="font-body"
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          >
            View Blog →
          </Link>
          <button onClick={handleNew}
            className="font-body cursor-pointer px-5 py-2 border-none transition-colors"
            style={{ backgroundColor: '#C29B40', color: '#002349', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}
          >
            New Post
          </button>
          <button onClick={logout}
            className="font-body cursor-pointer px-5 py-2 border transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: 'transparent' }}
          >
            Logout
          </button>
        </div>
      </div>

      {view === 'list' && <PostList posts={posts} loading={postsLoading} onEdit={handleEdit} onDelete={setDeleteTarget} />}
      {view === 'editor' && <PostEditor post={editingPost} onBack={() => setView('list')} onSave={handleSave} addToast={addToast} />}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Post?</DialogTitle></DialogHeader>
          <p className="font-body text-sm" style={{ color: '#666' }}>This cannot be undone. The post will be permanently deleted.</p>
          <DialogFooter className="gap-2">
            <button onClick={() => setDeleteTarget(null)} className="font-body px-5 py-2 border cursor-pointer" style={{ fontSize: '0.875rem', color: '#002349', borderColor: '#002349', backgroundColor: 'white' }}>Cancel</button>
            <button onClick={handleDelete} className="font-body px-5 py-2 border-none cursor-pointer" style={{ fontSize: '0.875rem', color: 'white', backgroundColor: '#ef4444' }}>Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={dismissToast} />)}
        </AnimatePresence>
      </div>
    </div>
  )
}
