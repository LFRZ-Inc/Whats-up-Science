'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { generateSlug } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

export default function CreateNewsletterPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isPublic: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!profile?.is_verified) {
      router.push('/dashboard')
      return
    }
  }, [user, profile, router])

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.title || formData.content) {
        // Auto-save to localStorage
        localStorage.setItem('newsletter-draft', JSON.stringify(formData))
        setAutoSaved(true)
        setTimeout(() => setAutoSaved(false), 2000)
      }
    }, 3000)

    return () => clearTimeout(autoSaveTimer)
  }, [formData])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('newsletter-draft')
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        setFormData(parsedDraft)
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content')
      setLoading(false)
      return
    }

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const slug = generateSlug(formData.title)

      const { data, error } = await supabase
        .from('newsletters')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          slug,
          tags,
          is_public: formData.isPublic,
          author_id: user?.id,
          published_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        setError(error.message)
      } else {
        // Clear draft
        localStorage.removeItem('newsletter-draft')
        router.push(`/newsletter/${slug}`)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => {
    localStorage.setItem('newsletter-draft', JSON.stringify(formData))
    setAutoSaved(true)
    setTimeout(() => setAutoSaved(false), 2000)
  }

  if (!user || !profile?.is_verified) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-deepBlue mb-2">Create Newsletter</h1>
            <p className="text-gray-600">
              Share your research and insights with the scientific community
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Auto-save indicator */}
          {autoSaved && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Draft auto-saved
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field text-xl"
                placeholder="Enter your newsletter title..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-field"
                placeholder="physics, quantum, research (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add relevant tags to help others discover your content
              </p>
            </div>

            {/* Visibility */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-700">
                  Make this newsletter public
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Public newsletters are visible to everyone. Private newsletters are only visible to you.
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Edit' : 'Preview'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>
                </div>
              </div>

              {showPreview ? (
                <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[400px]">
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content || '*Start writing your newsletter...*'}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="input-field min-h-[400px] font-mono text-sm"
                    placeholder="Write your newsletter content using Markdown...

# Headings
## Subheadings

**Bold text** and *italic text*

- Bullet points
- Lists

[Links](https://example.com)

![Images](image-url)

```code blocks```

> Blockquotes

And more..."
                    required
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Supports Markdown formatting. Use # for headings, ** for bold, * for italic, etc.
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                  className="btn-primary"
                >
                  {loading ? 'Publishing...' : 'Publish Newsletter'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-gray-500">
                {formData.content.length} characters
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
} 