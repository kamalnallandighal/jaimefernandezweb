import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
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
    onMouseDown={(e) => {
      e.preventDefault()
      onClick()
    }}
    disabled={disabled}
    title={title}
    style={{
      padding: '5px 8px',
      border: 'none',
      borderRadius: '3px',
      cursor: disabled ? 'default' : 'pointer',
      backgroundColor: active ? 'rgba(0,35,73,0.12)' : 'transparent',
      color: active ? '#002349' : disabled ? '#ccc' : '#555',
      fontSize: '13px',
      lineHeight: 1,
      fontWeight: active ? 700 : 400,
      transition: 'background-color 0.1s',
      minWidth: '28px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onMouseEnter={(e) => {
      if (!disabled)
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = active
          ? 'rgba(0,35,73,0.18)'
          : 'rgba(0,0,0,0.06)'
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = active
        ? 'rgba(0,35,73,0.12)'
        : 'transparent'
    }}
  >
    {children}
  </button>
)

const Divider = () => (
  <span
    style={{
      width: '1px',
      backgroundColor: 'rgba(0,0,0,0.12)',
      alignSelf: 'stretch',
      margin: '2px 6px',
      display: 'inline-block',
      flexShrink: 0,
    }}
  />
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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
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
        style:
          'min-height: calc(100vh - 340px); padding: 24px 20px; outline: none; font-family: "Source Sans 3", sans-serif; font-size: 16px; line-height: 1.8; color: #333;',
      },
    },
  })

  // Sync when value changes externally (e.g. loading an existing post)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (current !== value && value !== undefined) {
      isUpdatingRef.current = true
      editor.commands.setContent(value || '')
      isUpdatingRef.current = false
    }
  }, [value, editor])

  if (!editor) return null

  const handleLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL:', prev ?? 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
    }
  }

  const handleImageUrl = () => {
    const url = window.prompt('Image URL:')
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run()
  }

  const handleImageFile = async (file: File) => {
    if (!onImageUpload) return
    try {
      const url = await onImageUpload(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      // caller shows toast
    }
  }

  const activeColor = (editor.getAttributes('textStyle').color as string) || '#002349'

  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'white' }}>
      {/* ── Toolbar ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1px',
          padding: '8px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#fafafa',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <Divider />

        {/* Lists + blockquote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="2" cy="3.5" r="1.5" />
            <rect x="5" y="2.75" width="8" height="1.5" rx="0.75" />
            <circle cx="2" cy="7" r="1.5" />
            <rect x="5" y="6.25" width="8" height="1.5" rx="0.75" />
            <circle cx="2" cy="10.5" r="1.5" />
            <rect x="5" y="9.75" width="8" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <text x="0" y="5" fontSize="5" fontWeight="700">1.</text>
            <rect x="5" y="2.75" width="8" height="1.5" rx="0.75" />
            <text x="0" y="9" fontSize="5" fontWeight="700">2.</text>
            <rect x="5" y="6.25" width="8" height="1.5" rx="0.75" />
            <text x="0" y="13" fontSize="5" fontWeight="700">3.</text>
            <rect x="5" y="9.75" width="8" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M1 3h4v4H3a2 2 0 01-2-2V3zm6 0h4v4H9a2 2 0 01-2-2V3z" opacity="0.7" />
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Link + Image */}
        <ToolbarButton onClick={handleLink} active={editor.isActive('link')} title="Insert / edit link">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5.5 8.5a3.5 3.5 0 005 0l1.5-1.5a3.5 3.5 0 00-5-5L5.5 3.5" strokeLinecap="round" />
            <path d="M8.5 5.5a3.5 3.5 0 00-5 0L2 7a3.5 3.5 0 005 5l1.5-1.5" strokeLinecap="round" />
          </svg>
        </ToolbarButton>
        <ToolbarButton onClick={handleImageUrl} title="Insert image from URL">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="2" width="12" height="10" rx="1" />
            <circle cx="4.5" cy="5.5" r="1.5" />
            <path d="M1 10l3-3 2.5 2.5L9 7l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarButton>
        {onImageUpload && (
          <>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleImageFile(f)
                e.target.value = ''
              }}
            />
            <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Upload image">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 9V2M4 5l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11h10" strokeLinecap="round" />
              </svg>
            </ToolbarButton>
          </>
        )}

        <Divider />

        {/* Text color */}
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
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1 }}>A</span>
            <span style={{ width: '14px', height: '3px', backgroundColor: activeColor, borderRadius: '1px' }} />
          </span>
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align left"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="1" y="5.5" width="8" height="1.5" rx="0.75" />
            <rect x="1" y="9" width="12" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="3" y="5.5" width="8" height="1.5" rx="0.75" />
            <rect x="1" y="9" width="12" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align right"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="5" y="5.5" width="8" height="1.5" rx="0.75" />
            <rect x="1" y="9" width="12" height="1.5" rx="0.75" />
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 7a5 5 0 105 5" strokeLinecap="round" />
            <path d="M2 3v4h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 7a5 5 0 10-5 5" strokeLinecap="round" />
            <path d="M12 3v4H8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarButton>
      </div>

      {/* ── Editor content area ── */}
      <EditorContent editor={editor} />
    </div>
  )
}
