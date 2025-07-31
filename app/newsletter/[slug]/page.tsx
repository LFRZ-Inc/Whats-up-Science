'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Newsletter, Comment } from '@/lib/types'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function NewsletterDetailPage() {
  const params = useParams()
  const { user, profile } = useAuth()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchNewsletter()
      fetchComments()
      checkSubscription()
    }
  }, [params.slug, user])

  const fetchNewsletter = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select(`
          *,
          author:users!newsletters_author_id_fkey (
            id,
            full_name,
            field_of_study,
            institution,
            is_verified,
            profile_image_url
          )
        `)
        .eq('slug', params.slug)
        .eq('is_public', true)
        .single()

      if (error) {
        console.error('Error fetching newsletter:', error)
        return
      }

      setNewsletter(data)

      // Increment view count
      await supabase.rpc('increment_view_count', {
        newsletter_uuid: data.id
      })
    } catch (error) {
      console.error('Error fetching newsletter:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users!comments_author_id_fkey (
            id,
            full_name,
            field_of_study,
            institution,
            is_verified
          )
        `)
        .eq('newsletter_id', newsletter?.id)
        .is('parent_id', null)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setComments(data || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const checkSubscription = async () => {
    if (!user || !newsletter) return

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('subscriber_id', user.id)
        .eq('author_id', newsletter.author_id)
        .single()

      if (!error && data) {
        setIsSubscribed(true)
      }
    } catch (error) {
      // Subscription doesn't exist
      setIsSubscribed(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user || !newsletter) return

    setSubscribing(true)
    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from('subscriptions')
          .delete()
          .eq('subscriber_id', user.id)
          .eq('author_id', newsletter.author_id)

        if (!error) {
          setIsSubscribed(false)
        }
      } else {
        // Subscribe
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            subscriber_id: user.id,
            author_id: newsletter.author_id
          })

        if (!error) {
          setIsSubscribed(true)
        }
      }
    } catch (error) {
      console.error('Error toggling subscription:', error)
    } finally {
      setSubscribing(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newsletter || !commentContent.trim()) return

    setSubmittingComment(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: commentContent.trim(),
          newsletter_id: newsletter.id,
          author_id: user.id
        })

      if (error) {
        console.error('Error submitting comment:', error)
      } else {
        setCommentContent('')
        fetchComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-deepBlue mb-4">Newsletter Not Found</h1>
            <p className="text-gray-600">The newsletter you're looking for doesn't exist or is private.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Newsletter Header */}
          <article className="card mb-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-deepBlue mb-4">{newsletter.title}</h1>
              
              {/* Author Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-mintGreen rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-deepBlue">
                      {newsletter.author?.full_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deepBlue">
                      {newsletter.author?.full_name}
                    </h3>
                    <p className="text-gray-600">
                      {newsletter.author?.field_of_study} • {newsletter.author?.institution}
                    </p>
                  </div>
                </div>

                {user && newsletter.author_id !== user.id && (
                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    variant={isSubscribed ? "outline" : "default"}
                    className={isSubscribed ? "text-green-600 border-green-200" : ""}
                  >
                    {subscribing ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
                <span>{formatDate(newsletter.created_at)}</span>
                <span>•</span>
                <span>{newsletter.view_count} views</span>
                {newsletter.tags && newsletter.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex space-x-2">
                      {newsletter.tags.map((tag) => (
                        <span key={tag} className="tag text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Newsletter Content */}
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {newsletter.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Comments Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-deepBlue mb-6">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts on this research..."
                  className="input-field min-h-[100px] mb-4"
                  required
                />
                <Button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Sign in to leave a comment</p>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-mintGreen rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-deepBlue">
                          {comment.author?.full_name?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-deepBlue">
                            {comment.author?.full_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 