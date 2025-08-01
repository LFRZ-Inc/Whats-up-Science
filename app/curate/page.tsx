'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AIAnalysis {
  tldrSummary: string
  eli5Summary: string
  technicalSummary: string
  suggestedTags: string[]
  complexityScore: number
}

interface CurationResult {
  title: string
  authorName?: string
  sourceName?: string
  sourceUrl: string
  publicationDate?: string
  imageUrl?: string
  aiAnalysis: AIAnalysis
  originalMarkdown: string
}

export default function CuratePage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CurationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCurate = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/curate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to curate article')
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getComplexityText = (score: number) => {
    const levels = {
      1: 'General Public',
      2: 'High School Level',
      3: 'Undergraduate Level',
      4: 'Graduate Level',
      5: 'Expert Only'
    }
    return levels[score as keyof typeof levels] || 'Unknown'
  }

  const getComplexityColor = (score: number) => {
    if (score <= 2) return 'bg-green-100 text-green-800'
    if (score <= 3) return 'bg-yellow-100 text-yellow-800'
    if (score <= 4) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-deepBlue mb-4">
              AI Science Curator
            </h1>
            <p className="text-lg text-gray-600">
              Transform any science article into intelligent, multi-level summaries with our AI assistant
            </p>
          </div>

          {/* URL Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Curate a Science Article</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="url"
                  placeholder="Enter article URL (e.g., https://www.nature.com/articles/...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleCurate}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Analyzing...' : 'Curate Article'}
                </Button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue mx-auto mb-4"></div>
                <p className="text-gray-600">AI is analyzing the article...</p>
                <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Article Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl text-deepBlue">{result.title}</h2>
                      {result.authorName && (
                        <p className="text-gray-600 mt-1">By {result.authorName}</p>
                      )}
                      {result.sourceName && result.publicationDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          {result.sourceName} • {new Date(result.publicationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {result.imageUrl && (
                      <img 
                        src={result.imageUrl} 
                        alt={result.title}
                        className="w-24 h-24 object-cover rounded-lg ml-4"
                      />
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* AI Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>AI Analysis</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(result.aiAnalysis.complexityScore)}`}>
                      Level {result.aiAnalysis.complexityScore}: {getComplexityText(result.aiAnalysis.complexityScore)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* TL;DR Summary */}
                  <div>
                    <h3 className="font-semibold text-deepBlue mb-2">📝 TL;DR Summary</h3>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      {result.aiAnalysis.tldrSummary}
                    </p>
                  </div>

                  {/* ELI5 Summary */}
                  <div>
                    <h3 className="font-semibold text-deepBlue mb-2">🧒 Explain Like I'm 5</h3>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      {result.aiAnalysis.eli5Summary}
                    </p>
                  </div>

                  {/* Technical Summary */}
                  <div>
                    <h3 className="font-semibold text-deepBlue mb-2">🔬 Technical Summary</h3>
                    <p className="text-gray-700 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                      {result.aiAnalysis.technicalSummary}
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold text-deepBlue mb-2">🏷️ Suggested Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.aiAnalysis.suggestedTags.map((tag, index) => (
                        <span 
                          key={index}
                          className="tag text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Original Article Content */}
              <Card>
                <CardHeader>
                  <CardTitle>📄 Original Article Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.originalMarkdown}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4 justify-center">
                    <Button className="btn-primary">
                      Import to Platform
                    </Button>
                    <Button variant="outline" className="btn-outline">
                      Save as Draft
                    </Button>
                    <Button variant="outline" className="btn-outline">
                      Share Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 