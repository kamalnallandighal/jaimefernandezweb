import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type Post } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

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

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
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

// ─── Post List ────────────────────────────────────────────────────────────────

interface PostListProps {
  posts: Post[]
  loading: boolean
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}

function PostList({ posts, loading, onEdit, onDelete }: PostListProps) {
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-12 animate-pulse space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p
          className="font-display"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: '#002349' }}
        >
          No posts yet. Click &quot;New Post&quot; to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            {['Title', 'Category', 'Status', 'Date', 'Actions'].map((h) => (
              <th
                key={h}
                className="font-body pb-3 text-left"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#999999',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b transition-colors hover:bg-gray-50"
              style={{ borderColor: 'rgba(0,0,0,0.04)' }}
            >
              <td className="py-4 pr-6">
                <p
                  className="font-display font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: '#002349' }}
                >
                  {post.title}
                </p>
              </td>
              <td className="py-4 pr-6">
                <span className="font-body" style={{ fontSize: '0.75rem', color: '#999999' }}>
                  {post.category || '—'}
                </span>
              </td>
              <td className="py-4 pr-6">
                {post.published ? (
                  <span
                    className="font-body px-2 py-1"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                    }}
                  >
                    Published
                  </span>
                ) : (
                  <span
                    className="font-body px-2 py-1"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                    }}
                  >
                    Draft
                  </span>
                )}
              </td>
              <td className="py-4 pr-6">
                <span className="font-body" style={{ fontSize: '0.75rem', color: '#999999' }}>
                  {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                </span>
              </td>
              <td className="py-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => onEdit(post)}
                    className="font-body bg-transparent border-none cursor-pointer hover:underline"
                    style={{ fontSize: '0.75rem', color: '#C29B40' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(post)}
                    className="font-body bg-transparent border-none cursor-pointer hover:underline"
                    style={{ fontSize: '0.75rem', color: '#ef4444' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Post Editor ──────────────────────────────────────────────────────────────

interface PostEditorProps {
  post: Post | null
  onBack: () => void
  onSave: () => void
  addToast: (msg: string, success: boolean) => void
}

function PostEditor({ post, onBack, onSave, addToast }: PostEditorProps) {
  const isNew = !post
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugEdited, setSlugEdited] = useState(!!post)
  const [category, setCategory] = useState(post?.category || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url || '')
  const [body, setBody] = useState(post?.body || '')
  const [readTime, setReadTime] = useState(post?.read_time_minutes || 0)
  const [autoReadTime, setAutoReadTime] = useState(0)
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [seoDesc, setSeoDesc] = useState(post?.seo_description || '')
  const [published, setPublished] = useState(post?.published || false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const tagInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugEdited])

  // Auto-calculate read time
  useEffect(() => {
    const words = countWords(body)
    const auto = Math.ceil(words / 200) || 1
    setAutoReadTime(auto)
    setReadTime(auto)
  }, [body])

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,/g, '')
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const save = async (publishOverride?: boolean) => {
    if (!title.trim() || !body.trim()) {
      addToast('Title and body are required', false)
      return
    }
    setSaving(true)
    const shouldPublish = publishOverride !== undefined ? publishOverride : published
    const publishedAt = shouldPublish && !post?.published_at ? new Date().toISOString() : post?.published_at || null

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
    }

    try {
      if (!supabase) throw new Error('Supabase not configured')
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

  const googlePreviewTitle = (seoTitle || title).slice(0, 60)
  const googlePreviewDesc = (seoDesc || excerpt).slice(0, 160)

  return (
    <div className="pb-24">
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="font-display w-full outline-none border-b pb-2 bg-transparent transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.875rem',
              color: '#002349',
              borderColor: 'rgba(194,155,64,0.3)',
            }}
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="font-body" style={{ fontSize: '0.75rem', color: '#999999' }}>
              URL: /blog/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
              className="font-body outline-none border-b bg-transparent flex-1"
              style={{ fontSize: '0.75rem', color: '#999999', borderColor: 'rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-8">
          <label
            className="font-body block mb-2"
            style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-body w-full px-3 py-2.5 outline-none border bg-white cursor-pointer"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <label
            className="font-body block mb-2"
            style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
          >
            Tags
          </label>
          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag + Enter or comma to add"
            className="font-body w-full px-3 py-2.5 outline-none border"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-body flex items-center gap-2 px-3 py-1"
                  style={{
                    backgroundColor: '#002349',
                    color: 'white',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="bg-transparent border-none cursor-pointer text-white/60 hover:text-white"
                    style={{ fontSize: '0.875rem', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div className="mb-8">
          <label
            className="font-body block mb-2"
            style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
          >
            Excerpt <span style={{ color: '#cccccc' }}>(used for SEO meta description)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="font-body w-full px-3 py-2.5 outline-none border resize-none"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          />
          <p
            className="font-body mt-1 text-right"
            style={{ fontSize: '0.75rem', color: excerpt.length > 160 ? '#ef4444' : '#999999' }}
          >
            {excerpt.length} / 160
          </p>
        </div>

        {/* Cover Image URL */}
        <div className="mb-8">
          <label
            className="font-body block mb-2"
            style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
          >
            Cover Image URL
          </label>
          <input
            type="text"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://..."
            className="font-body w-full px-3 py-2.5 outline-none border"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          />
          {coverUrl && (
            <img
              src={coverUrl}
              alt="Cover preview"
              className="mt-2 object-cover"
              style={{ maxHeight: '8rem', width: 'auto' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>

        {/* Body */}
        <div className="mb-8">
          <label
            className="font-body block mb-1"
            style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
          >
            Content <span style={{ color: '#cccccc' }}>(Markdown supported)</span>
          </label>
          <p
            className="font-body mb-2"
            style={{ fontSize: '10px', color: '#999999' }}
          >
            **bold** | *italic* | # Heading | [link](url) | ![image](url)
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className="font-mono w-full px-3 py-3 outline-none border resize-y"
            style={{ fontSize: '0.8125rem', color: '#333', borderColor: 'rgba(0,0,0,0.12)', lineHeight: 1.6 }}
          />
        </div>

        {/* Read Time */}
        <div className="mb-8">
          <label
            className="font-body block mb-2"
            style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
          >
            Read Time (minutes)
          </label>
          <input
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
            className="font-body px-3 py-2.5 outline-none border w-24"
            style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
          />
          <p className="font-body mt-1" style={{ fontSize: '0.75rem', color: '#999999' }}>
            Auto-calculated: {autoReadTime} min
          </p>
        </div>

        {/* SEO Section (collapsible) */}
        <div className="mb-8 border-t pt-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setSeoOpen(!seoOpen)}
            className="font-body bg-transparent border-none cursor-pointer"
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C29B40',
            }}
          >
            SEO Settings {seoOpen ? '−' : '+'}
          </button>

          <AnimatePresence>
            {seoOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="mt-6 space-y-6">
                  {/* SEO Title */}
                  <div>
                    <label
                      className="font-body block mb-2"
                      style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
                    >
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="font-body w-full px-3 py-2.5 outline-none border"
                      style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
                    />
                    <p
                      className="font-body mt-1 text-right"
                      style={{ fontSize: '0.75rem', color: seoTitle.length > 60 ? '#ef4444' : '#999999' }}
                    >
                      {seoTitle.length} / 60
                    </p>
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label
                      className="font-body block mb-2"
                      style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
                    >
                      SEO Description
                    </label>
                    <textarea
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      rows={3}
                      className="font-body w-full px-3 py-2.5 outline-none border resize-none"
                      style={{ fontSize: '0.875rem', color: '#002349', borderColor: 'rgba(0,0,0,0.12)' }}
                    />
                    <p
                      className="font-body mt-1 text-right"
                      style={{ fontSize: '0.75rem', color: seoDesc.length > 160 ? '#ef4444' : '#999999' }}
                    >
                      {seoDesc.length} / 160
                    </p>
                  </div>

                  {/* Google Preview */}
                  <div>
                    <p
                      className="font-body mb-2"
                      style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999999' }}
                    >
                      Google Preview
                    </p>
                    <div className="border p-4" style={{ borderColor: 'rgba(0,0,0,0.12)', maxWidth: '540px' }}>
                      <p style={{ fontSize: '1.125rem', color: '#1a0dab', cursor: 'pointer' }} className="font-body">
                        {googlePreviewTitle || 'Post title will appear here'}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#006621' }} className="font-body">
                        yoursite.com/blog/{slug || 'post-slug'}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#545454', marginTop: '2px' }} className="font-body">
                        {googlePreviewDesc || 'Excerpt or SEO description will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Published Toggle */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: '#C29B40' }}
            />
            <div>
              <span className="font-body font-semibold" style={{ fontSize: '0.875rem', color: '#002349' }}>
                Published
              </span>
              <p className="font-body" style={{ fontSize: '0.75rem', color: '#999999' }}>
                Unpublished posts are only visible to admins
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4 border-t bg-white"
        style={{ borderColor: 'rgba(0,0,0,0.06)', zIndex: 50 }}
      >
        <button
          onClick={onBack}
          className="font-body bg-transparent border-none cursor-pointer transition-colors hover:text-navy"
          style={{ fontSize: '0.875rem', color: '#999999' }}
        >
          ← Back to posts
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="font-body px-6 py-2.5 border cursor-pointer transition-colors disabled:opacity-50"
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#002349',
              borderColor: '#002349',
              backgroundColor: 'white',
            }}
          >
            Save Draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="font-body px-6 py-2.5 cursor-pointer transition-colors disabled:opacity-50"
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              backgroundColor: '#C29B40',
              color: '#002349',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Save &amp; Publish
          </button>
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
    if (localStorage.getItem('blog_admin_auth') === 'authenticated') {
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchPosts()
  }, [authed])

  const fetchPosts = async () => {
    setPostsLoading(true)
    try {
      if (!supabase) return
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
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

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setView('editor')
  }

  const handleNew = () => {
    setEditingPost(null)
    setView('editor')
  }

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

  const handleSave = async () => {
    await fetchPosts()
    setView('list')
  }

  const logout = () => {
    localStorage.removeItem('blog_admin_auth')
    window.location.reload()
  }

  if (!authed) {
    return <LoginGate onSuccess={() => setAuthed(true)} />
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Admin Header */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ backgroundColor: '#002349' }}
      >
        <img
          src="/assets/logos/RLSIR_Horz_white.png"
          alt="Russ Lyon Sotheby's International Realty"
          style={{ width: '100px', opacity: 0.8 }}
        />
        <p
          className="font-display text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem' }}
        >
          Blog Admin
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNew}
            className="font-body cursor-pointer px-5 py-2 border-none transition-colors"
            style={{
              backgroundColor: '#C29B40',
              color: '#002349',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            New Post
          </button>
          <button
            onClick={logout}
            className="font-body cursor-pointer px-5 py-2 border transition-colors"
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              backgroundColor: 'transparent',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Views */}
      {view === 'list' && (
        <PostList
          posts={posts}
          loading={postsLoading}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {view === 'editor' && (
        <PostEditor
          post={editingPost}
          onBack={() => setView('list')}
          onSave={handleSave}
          addToast={addToast}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post?</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm" style={{ color: '#666666' }}>
            This cannot be undone. The post will be permanently deleted.
          </p>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="font-body px-5 py-2 border cursor-pointer"
              style={{ fontSize: '0.875rem', color: '#002349', borderColor: '#002349', backgroundColor: 'white' }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="font-body px-5 py-2 border-none cursor-pointer"
              style={{ fontSize: '0.875rem', color: 'white', backgroundColor: '#ef4444' }}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
