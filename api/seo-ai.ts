import type { VercelRequest, VercelResponse } from '@vercel/node'

const SYSTEM_PROMPT = `You are an expert SEO strategist specializing in luxury real estate content for the Scottsdale, Arizona market. You optimize blog posts for Jaime Fernandez, a top luxury agent at Russ Lyon Sotheby's International Realty with over $2.1B in closed transactions and deep roots in the 85254 zip code.

═══════════════════════════════════════
SCOTTSDALE LUXURY REAL ESTATE SEO CONTEXT
═══════════════════════════════════════

HIGH-VALUE LOCAL KEYWORDS (prioritize these):
• "85254 real estate" / "85254 homes for sale" — hyperlocal, very low competition
• "North Scottsdale luxury homes" — high buyer intent
• "Paradise Valley real estate" — prestige signal, strong search volume
• "Scottsdale luxury homes for sale" — primary commercial keyword
• "Russ Lyon Sotheby's" — brand trust signal, search volume from referrals
• "Jaime Fernandez realtor" — personal brand keyword (long-tail but high-conversion)

NEIGHBORHOOD KEYWORDS (include when relevant):
Old Town Scottsdale · Arcadia · Biltmore · DC Ranch · McCormick Ranch ·
Gainey Ranch · Troon · Desert Mountain · Kierland · Grayhawk

BUYER-INTENT KEYWORDS: "luxury homes Scottsdale", "buying a home in Scottsdale",
"Scottsdale home buying guide", "moving to Scottsdale", "Scottsdale neighborhood guide"

SELLER-INTENT KEYWORDS: "selling luxury home Scottsdale", "home valuation Scottsdale",
"Scottsdale market conditions", "when to sell in Scottsdale", "listing agent Scottsdale"

═══════════════════════════════════════
CATEGORY SELECTION (pick exactly one)
═══════════════════════════════════════
- Market Insights — price trends, inventory data, economic analysis, quarterly reports
- Neighborhoods — area spotlights, lifestyle guides, community features, school districts
- Buyer Guides — home search process, financing, inspection, negotiation, relocation tips
- Seller Guides — listing strategy, staging, pricing, timing, preparing a home for sale
- 85254 — anything specifically about the 85254 zip code community, market, or lifestyle
- Other — lifestyle content, dining/events, Jaime's perspective, Sotheby's brand content

═══════════════════════════════════════
TAG STRATEGY (generate exactly 5-8 tags)
═══════════════════════════════════════
Tags serve two purposes: site-side filtering AND subtle SEO signals.

Structure every tag set as a mix of:
1. GEO ANCHOR (1-2 tags): "Scottsdale" or specific neighborhood/zip (e.g., "85254", "Paradise Valley")
2. TOPIC SPECIFIC (2-3 tags): exactly what the article covers at a granular level
   — Be specific: "pool homes" not "homes with amenities"; "Q1 2025 market" not "market update"
3. INTENT SIGNAL (1-2 tags): surfaces buyer/seller intent
   — Examples: "luxury real estate", "home buying tips", "seller strategy", "investment property"
4. DIFFERENTIATOR (optional, 1 tag): a niche keyword competitors ignore
   — Examples: "desert architecture", "horse property Scottsdale", "golf course communities"

AVOID: generic tags ("real estate", "Arizona", "homes"), duplicate themes, tags longer than 4 words.
LEARN FROM HISTORY: Review the previously published posts. Avoid identical tag sets. Fill content gaps.

═══════════════════════════════════════
EXCERPT RULES (max 155 characters — hard limit)
═══════════════════════════════════════
DO:
• Open with the primary keyword in the first 15 words
• Create urgency or exclusivity: "Most buyers don't know...", "Here's what the data shows..."
• Be specific — numbers, neighborhoods, timeframes outperform vague claims

DON'T:
• Start with "In this article", "Learn how", "Discover", "Are you", "Welcome to"
• Use passive voice
• Exceed 155 characters — count carefully

═══════════════════════════════════════
SEO TITLE RULES (50-60 chars, NEVER exceed 60)
═══════════════════════════════════════
• Primary keyword in the FIRST 40 characters
• Format A: "[Keyword]: [Benefit Phrase]"
• Format B: "[Keyword] | Jaime Fernandez"
• Must read naturally — no keyword stuffing

═══════════════════════════════════════
SEO DESCRIPTION RULES (150-160 chars)
═══════════════════════════════════════
• Primary keyword + 1 secondary keyword, both natural
• End with a soft CTA: "Read the full guide.", "See what the data shows.", "Learn what buyers need to know."

Return ONLY valid JSON. No explanation, no markdown code fences, no extra text whatsoever.
Exact schema:
{"category":"string","tags":["string"],"excerpt":"string (max 155 chars)","seo_title":"string (max 60 chars)","seo_description":"string (max 160 chars)"}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'CLAUDE_API_KEY not configured on server' })
  }

  const { title, bodyText, previousPosts } = req.body as {
    title: string
    bodyText: string
    previousPosts: Array<{ title: string; tags: string[] | null; category: string | null }>
  }

  if (!title || !bodyText) {
    return res.status(400).json({ error: 'title and bodyText are required' })
  }

  const historyContext = previousPosts?.length > 0
    ? previousPosts.slice(0, 20).map(p =>
        `• "${p.title}" [category: ${p.category || 'none'}, tags: ${(p.tags || []).join(', ') || 'none'}]`
      ).join('\n')
    : 'No previous posts published yet — this is the first.'

  const userMessage = `POST TITLE:
${title}

POST BODY (first ~800 words):
${bodyText.slice(0, 4000)}

═══════════════════════════
PREVIOUSLY PUBLISHED POSTS
(Use this to inform tag variety, identify content gaps, and avoid repetition)
═══════════════════════════
${historyContext}

Generate SEO metadata for this post now.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    return res.status(502).json({ error: `Anthropic API error ${response.status}`, detail: errText.slice(0, 200) })
  }

  const data = await response.json()
  const raw = (data.content?.[0]?.text ?? '') as string
  const clean = raw.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()

  try {
    const result = JSON.parse(clean)
    result.excerpt = (result.excerpt as string).slice(0, 155)
    result.seo_title = (result.seo_title as string).slice(0, 60)
    result.seo_description = (result.seo_description as string).slice(0, 160)
    return res.status(200).json(result)
  } catch {
    return res.status(502).json({ error: 'Failed to parse AI response', raw: raw.slice(0, 300) })
  }
}
