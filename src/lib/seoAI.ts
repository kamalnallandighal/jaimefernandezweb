// ─── SEO AI Utility ───────────────────────────────────────────────────────────
// Calls our own /api/seo-ai serverless function (which holds the API key
// server-side). The browser never sees the key.

export interface SEOResult {
  category: string
  tags: string[]
  excerpt: string
  seo_title: string
  seo_description: string
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function generateSEO(
  title: string,
  htmlBody: string,
  previousPosts: Array<{ title: string; tags: string[] | null; category: string | null }>
): Promise<SEOResult> {
  const bodyText = stripHtml(htmlBody)

  const response = await fetch('/api/seo-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, bodyText, previousPosts }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(err.error ?? `Request failed: ${response.status}`)
  }

  return response.json() as Promise<SEOResult>
}
