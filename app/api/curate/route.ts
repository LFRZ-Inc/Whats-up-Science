import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

interface CurationRequest {
  url: string
}

interface AIAnalysis {
  tldrSummary: string
  eli5Summary: string
  technicalSummary: string
  suggestedTags: string[]
  complexityScore: number
}

interface CurationResult {
  success: boolean
  data?: {
    title: string
    authorName?: string
    sourceName?: string
    sourceUrl: string
    publicationDate?: string
    imageUrl?: string
    aiAnalysis: AIAnalysis
    originalMarkdown: string
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<CurationResult>> {
  try {
    const { url }: CurationRequest = await request.json()

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    // Step 1: Fetch and Parse the Article
    console.log('Fetching article from:', url)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Step 2: Extract Metadata
    const title = extractTitle($)
    const authorName = extractAuthor($)
    const sourceName = extractSource($, url)
    const publicationDate = extractPublicationDate($)
    const imageUrl = extractImageUrl($, url)

    // Step 3: Extract and Clean Main Content
    const mainContent = extractMainContent($)
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
    
    // Configure turndown to preserve scientific formatting
    turndownService.addRule('preserveSubscripts', {
      filter: 'sub',
      replacement: (content: string) => `_${content}_`
    })
    
    turndownService.addRule('preserveSuperscripts', {
      filter: 'sup',
      replacement: (content: string) => `^${content}^`
    })

    const markdown = turndownService.turndown(mainContent)

    if (!markdown || markdown.trim().length < 100) {
      throw new Error('Could not extract sufficient content from the article')
    }

    // Step 4: AI Analysis with Google Gemini
    console.log('Analyzing content with AI...')
    const aiAnalysis = await analyzeWithAI(markdown)

    return NextResponse.json({
      success: true,
      data: {
        title,
        authorName,
        sourceName,
        sourceUrl: url,
        publicationDate,
        imageUrl,
        aiAnalysis,
        originalMarkdown: markdown
      }
    })

  } catch (error) {
    console.error('Curation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

async function analyzeWithAI(markdown: string): Promise<AIAnalysis> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `You are an expert science communicator and research analyst AI. Your task is to analyze a scientific article and return a structured JSON object with summaries, keywords, and a complexity score. Do not add any commentary or conversational text outside of the JSON object.

Analyze the following science article and provide the requested analysis in a JSON format.

**Article Content:**
\`\`\`markdown
${markdown}
\`\`\`

Required JSON Output Format:
{
  "tldrSummary": "A one-sentence summary of the core finding.",
  "eli5Summary": "A simple, analogy-driven explanation for a non-expert.",
  "technicalSummary": "A detailed 3-4 sentence summary for a scientific audience.",
  "suggestedTags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "complexityScore": 3
}

Rules:
- tldrSummary: Must be ONE sentence, capture the core finding
- eli5Summary: Use analogies, avoid jargon, explain like talking to a 5-year-old
- technicalSummary: 3-4 sentences, use appropriate scientific terminology
- suggestedTags: 5-10 relevant scientific keywords
- complexityScore: 1 (General Public) to 5 (Deep Expert Only)

Return ONLY the JSON object, no other text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean and parse the JSON response
    const cleanedText = text.replace(/```json\n?/, '').replace(/```\n?$/, '').trim()
    
    try {
      const aiAnalysis = JSON.parse(cleanedText) as AIAnalysis
      
      // Validate the response structure
      if (!aiAnalysis.tldrSummary || !aiAnalysis.eli5Summary || !aiAnalysis.technicalSummary || 
          !Array.isArray(aiAnalysis.suggestedTags) || typeof aiAnalysis.complexityScore !== 'number') {
        throw new Error('Invalid AI response structure')
      }

      // Ensure complexity score is within valid range
      aiAnalysis.complexityScore = Math.max(1, Math.min(5, Math.round(aiAnalysis.complexityScore)))

      return aiAnalysis
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanedText)
      throw new Error('Failed to parse AI analysis response')
    }

  } catch (error) {
    console.error('AI analysis error:', error)
    
    // Fallback analysis if AI fails
    return {
      tldrSummary: 'This scientific article presents new research findings in the field.',
      eli5Summary: 'Scientists discovered something new that could be important for understanding how things work.',
      technicalSummary: 'This research presents novel findings with potential implications for the scientific community. Further analysis would be needed to determine the specific significance and methodology employed.',
      suggestedTags: ['science', 'research', 'discovery', 'study', 'analysis'],
      complexityScore: 3
    }
  }
}

function extractTitle($: cheerio.CheerioAPI): string {
  // Try multiple selectors for title
  const selectors = [
    'h1',
    '[data-testid="headline"]',
    '.article-title',
    '.entry-title',
    'title'
  ]

  for (const selector of selectors) {
    const title = $(selector).first().text().trim()
    if (title && title.length > 10) {
      return title
    }
  }

  return 'Untitled Article'
}

function extractAuthor($: cheerio.CheerioAPI): string | undefined {
  const selectors = [
    '[data-testid="author-name"]',
    '.author-name',
    '.byline-author',
    '[rel="author"]',
    '.article-author'
  ]

  for (const selector of selectors) {
    const author = $(selector).first().text().trim()
    if (author && author.length > 2) {
      return author
    }
  }

  return undefined
}

function extractSource($: cheerio.CheerioAPI, url: string): string | undefined {
  // Try to extract from meta tags first
  const siteName = $('meta[property="og:site_name"]').attr('content')
  if (siteName) return siteName

  // Extract from URL domain
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return undefined
  }
}

function extractPublicationDate($: cheerio.CheerioAPI): string | undefined {
  const selectors = [
    'meta[property="article:published_time"]',
    'meta[name="publishdate"]',
    'time[datetime]',
    '.publication-date',
    '.article-date'
  ]

  for (const selector of selectors) {
    const element = $(selector).first()
    const date = element.attr('content') || element.attr('datetime') || element.text().trim()
    
    if (date) {
      try {
        return new Date(date).toISOString().split('T')[0]
      } catch {
        continue
      }
    }
  }

  return undefined
}

function extractImageUrl($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
  const selectors = [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    '.article-image img',
    '.featured-image img',
    'img[src*="featured"]'
  ]

  for (const selector of selectors) {
    const element = $(selector).first()
    const src = element.attr('content') || element.attr('src')
    
    if (src) {
      try {
        return new URL(src, baseUrl).href
      } catch {
        continue
      }
    }
  }

  return undefined
}

function extractMainContent($: cheerio.CheerioAPI): string {
  // Remove unwanted elements
  $('script, style, nav, header, footer, aside, .advertisement, .ads, .comments').remove()

  // Try multiple selectors for main content
  const contentSelectors = [
    'article',
    '[data-testid="article-body"]',
    '.article-content',
    '.entry-content',
    '.post-content',
    '.content',
    'main'
  ]

  for (const selector of contentSelectors) {
    const content = $(selector).first()
    if (content.length && content.text().trim().length > 200) {
      return content.html() || ''
    }
  }

  // Fallback: try to get the largest text block
  const paragraphs = $('p')
  let largestContent = ''
  let maxLength = 0

  paragraphs.each((_: number, element: any) => {
    const parent = $(element).parent()
    const parentText = parent.text().trim()
    if (parentText.length > maxLength) {
      maxLength = parentText.length
      largestContent = parent.html() || ''
    }
  })

  return largestContent
} 