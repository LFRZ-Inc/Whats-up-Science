'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'

interface CommentFormProps {
  newsletterId: string
  onCommentAdded: () => void
  className?: string
}

export function CommentForm({ newsletterId, onCommentAdded, className }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsSubmitting(true)
    try {
      // This would be implemented when Supabase is set up
      // For now, just simulate the action
      console.log('Adding comment:', { newsletterId, content, userId: user.id })
      
      setContent('')
      onCommentAdded()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className={`text-center p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-600">Please log in to leave a comment.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Add a comment
          </label>
          <Textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts on this research..."
            className="min-h-[100px]"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
          className="btn-primary"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
} 