'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface PeerInvitationProps {
  onInviteSent: (email: string, message: string) => void
  remainingInvites: number
  className?: string
}

export function PeerInvitation({ onInviteSent, remainingInvites, className }: PeerInvitationProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || remainingInvites <= 0) return

    setIsSubmitting(true)
    try {
      // This would integrate with your backend when set up
      console.log('Sending invitation:', { email, message })
      
      onInviteSent(email, message)
      setEmail('')
      setMessage('')
    } catch (error) {
      console.error('Error sending invitation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultMessage = `Hi there!

I'm a verified scientist on "What's Up Science" - a platform where researchers share their work directly with the public. I think you'd be a great addition to our community!

The platform is designed specifically for scientists to communicate their research in an accessible way, and I believe your expertise would be valuable to our readers.

You can learn more at: https://whatsupscience.com

Best regards,
[Your Name]`

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Invite Fellow Scientists</CardTitle>
            <CardDescription>
              Help grow our community by inviting trusted colleagues. You have {remainingInvites} invites remaining this month.
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-deepBlue">{remainingInvites}</div>
            <div className="text-sm text-gray-600">Invites Left</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-2">
              Colleague's Email Address
            </label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@university.edu"
              required
              disabled={remainingInvites <= 0}
            />
          </div>

          <div>
            <label htmlFor="invite-message" className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <Textarea
              id="invite-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={defaultMessage}
              className="min-h-[200px]"
              disabled={remainingInvites <= 0}
            />
            <p className="text-xs text-gray-500 mt-1">
              A personal message increases the likelihood of acceptance. You can customize the default message above.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting || remainingInvites <= 0 || !email.trim()}
              className="btn-primary"
            >
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
            {remainingInvites <= 0 && (
              <p className="text-sm text-red-600 flex items-center">
                You've used all your invites this month. More invites will be available next month.
              </p>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-deepBlue mb-2">Invitation Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Only invite colleagues you know personally and trust</li>
            <li>• Ensure they have a genuine interest in science communication</li>
            <li>• Respect their time and don't spam invitations</li>
            <li>• Invitees will still need to complete the verification process</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 