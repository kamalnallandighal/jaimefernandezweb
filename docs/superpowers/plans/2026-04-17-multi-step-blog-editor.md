# Multi-Step Blog Editor with TipTap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-page PostEditor with a 3-step wizard (Write → Details & SEO → Cover) and a TipTap WYSIWYG rich text editor, updating BlogPost.tsx to render HTML instead of markdown.

**Architecture:** PostEditor gains a `step` state (1|2|3) with Framer Motion slide transitions. A new `RichTextEditor` component wraps TipTap with a WordPress-like toolbar. Body field changes from markdown string to HTML string; BlogPost.tsx renders with dangerouslySetInnerHTML + DOMPurify. Existing posts with markdown content auto-convert to HTML on load via `marked`.

**Tech Stack:** TipTap (@tiptap/react, @tiptap/starter-kit, extensions), marked (markdown→HTML), dompurify (XSS sanitization), Framer Motion (already installed), React + TypeScript + Vite

---

### Task 1: Install dependencies

**Files:** none (package.json updated by npm)

- [ ] **Step 1: Install TipTap, marked, dompurify**

```bash
cd /Users/knallandighal/Documents/Websites/jaime-fernandez
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-link @tiptap/extension-image marked dompurify @types/dompurify
```

Expected: packages install without errors

---

### Task 2: Create RichTextEditor component

**Files:**
- Create: `src/components/RichTextEditor.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  onImageUpload?: (file: File) => Promise<string>
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick() }}
    disabled={disabled}
    title={title}
    style={{
      padding: '4px 7px',
      border: 'none',
      borderRadius: '3px',
      cursor: disabled ? 'default' : 'pointer',
      backgroundColor: active ? 'rgba(0,35,73,0.1)' : 'transparent',
      color: active ? '#002349' : disabled ? '#ccc' : '#555',
      fontSize: '13px',
      lineHeight: 1,
      fontWeight: active ? 700 : 400,
      transition: 'background-color 0.1s',
    }}
    onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = active ? 'rgba(0,35,73,0.15)' : 'rgba(0,0,0,0.06)' }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = active ? 'rgba(0,35,73,0.1)' : 'transparent' }}
  >
    {children}
  </button>
)

const Divider = () => (
  <span style={{ width: '1px', backgroundColor: 'rgba(0,0,0,0.1)', alignSelf: 'stretch', margin: '0 4px', display: 'inline-block' }} />
)

export default function RichTextEditor({ value, onChange, onImageUpload }: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const isUpdatingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        style: 'min-height: calc(100vh - 320px); padding: 20px; outline: none; font-family: Georgia, serif; font-size: 16px; line-height: 1.8; color: #333;',
      },
    },
  })

  // Sync external value changes (e.g. switching steps)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (current !== value) {
      isUpdatingRef.current = true
      editor.commands.setContent(value || '', false)
      isUpdatingRef.current = false
    }
  }, [value, editor])

  if (!editor) return null

  const handleLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL:', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const handleImageUrl = () => {
    const url = window.prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const handleImageFile = async (file: File) => {
    if (!onImageUpload) return
    try {
      const url = await onImageUpload(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      // silently fail — caller shows toast
    }
  }

  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'white' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2px',
          padding: '8px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#fafafa',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)"><b>B</b></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)"><i>I</i></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)"><u>U</u></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">≡</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">1.</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">"</ToolbarButton>

        <Divider />

        <ToolbarButton onClick={handleLink} active={editor.isActive('link')} title="Insert / edit link">🔗</ToolbarButton>
        <ToolbarButton onClick={handleImageUrl} title="Insert image from URL">🖼</ToolbarButton>
        {onImageUpload && (
          <>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }}
            />
            <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Upload image">⬆</ToolbarButton>
          </>
        )}

        <Divider />

        <input
          ref={colorInputRef}
          type="color"
          defaultValue="#002349"
          style={{ display: 'none' }}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
        <ToolbarButton
          onClick={() => colorInputRef.current?.click()}
          title="Text color"
          active={editor.isActive('textStyle') && !!editor.getAttributes('textStyle').color}
        >
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>A</span>
            <span style={{ width: '14px', height: '3px', backgroundColor: editor.getAttributes('textStyle').color || '#002349' }} />
          </span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">⬤L</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">⬤C</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">⬤R</ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↩</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↪</ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

- [ ] **Step 2: Add prose-jaime styles for TipTap output in index.css**

Add after existing `.prose-jaime` rules in `src/index.css`:

```css
/* TipTap editor content styling */
.ProseMirror h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 600; color: #002349; margin: 1.5rem 0 0.75rem; }
.ProseMirror h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; font-weight: 600; color: #002349; margin: 1.25rem 0 0.5rem; }
.ProseMirror h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.25rem; font-weight: 600; color: #002349; margin: 1rem 0 0.5rem; }
.ProseMirror p { margin: 0 0 1rem; }
.ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin: 0 0 1rem; }
.ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0 0 1rem; }
.ProseMirror blockquote { border-left: 3px solid #C29B40; padding-left: 1rem; margin: 1rem 0; color: #666; font-style: italic; }
.ProseMirror a { color: #C29B40; text-decoration: underline; }
.ProseMirror img { max-width: 100%; height: auto; margin: 1rem 0; }
.ProseMirror strong { font-weight: 700; }
.ProseMirror em { font-style: italic; }
.ProseMirror s { text-decoration: line-through; }
```

Also update `.prose-jaime` rules to cover rendered HTML (for BlogPost.tsx):

```css
.prose-jaime h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 600; color: #002349; margin: 1.5rem 0 0.75rem; }
.prose-jaime h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; font-weight: 600; color: #002349; margin: 1.25rem 0 0.5rem; }
.prose-jaime h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.25rem; font-weight: 600; color: #002349; margin: 1rem 0 0.5rem; }
.prose-jaime p { margin: 0 0 1rem; font-family: 'Source Sans 3', sans-serif; font-size: 1.0625rem; line-height: 1.8; color: #333; }
.prose-jaime ul { list-style: disc; padding-left: 1.5rem; margin: 0 0 1rem; }
.prose-jaime ol { list-style: decimal; padding-left: 1.5rem; margin: 0 0 1rem; }
.prose-jaime li { font-family: 'Source Sans 3', sans-serif; font-size: 1.0625rem; line-height: 1.8; color: #333; margin-bottom: 0.25rem; }
.prose-jaime blockquote { border-left: 3px solid #C29B40; padding-left: 1rem; margin: 1rem 0; color: #666; font-style: italic; }
.prose-jaime a { color: #C29B40; text-decoration: underline; }
.prose-jaime img { max-width: 100%; height: auto; margin: 1rem 0; }
.prose-jaime strong { font-weight: 700; }
.prose-jaime em { font-style: italic; }
```

---

### Task 3: Refactor PostEditor to 3-step wizard

**Files:**
- Modify: `src/pages/BlogAdmin.tsx` — replace PostEditor internals

Key changes:
1. Add `step: 1 | 2 | 3` state and `direction: 1 | -1` for slide animation
2. Add markdown detection + conversion on load via `marked`
3. Replace textarea body with `<RichTextEditor>`
4. Split form into 3 panels with AnimatePresence slide transitions
5. Replace sticky bottom bar with step-aware nav

Step content:
- **Step 1:** Title (big Cormorant input) + slug row + RichTextEditor
- **Step 2:** Category, Tags, Excerpt (160 char), Read time, Featured toggle, SEO title (60 char), SEO description (160 char), Google SERP preview
- **Step 3:** 16:9 cover photo (drag-and-drop + URL paste) + Published toggle

Bottom bar:
- Step 1: `← Back to posts` | `●○○` | `Save Draft` | `Next →`
- Step 2: `← Write` | `○●○` | `Save Draft` | `Next →`
- Step 3: `← Details` | `○○●` | `Save Draft` | `Publish`

---

### Task 4: Update BlogPost.tsx rendering

**Files:**
- Modify: `src/pages/BlogPost.tsx`

- [ ] **Step 1: Replace ReactMarkdown with DOMPurify + dangerouslySetInnerHTML**

Remove `import ReactMarkdown from 'react-markdown'`
Add `import DOMPurify from 'dompurify'`

Replace:
```tsx
<div className="prose-jaime">
  <ReactMarkdown>{post.body}</ReactMarkdown>
</div>
```

With:
```tsx
<div
  className="prose-jaime"
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body || '') }}
/>
```

---

### Task 5: TypeScript check

- [ ] **Step 1: Run tsc**

```bash
cd /Users/knallandighal/Documents/Websites/jaime-fernandez
npx tsc --noEmit
```

Expected: no errors
