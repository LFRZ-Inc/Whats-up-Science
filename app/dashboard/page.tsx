'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Newsletter } from '@/lib/types'
import { formatDate, formatRelativeTime } from '@/lib/utils'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [stats, setStats] = useState({
    totalNewsletters: 0,
    totalViews: 0,
    totalSubscribers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && profile?.is_verified) {
      fetchDashboardData()
    }
  }, [user, profile])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's newsletters
      const { data: newslettersData, error: newslettersError } = await supabase
        .from('newsletters')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })

      if (newslettersError) {
        console.error('Error fetching newsletters:', newslettersError)
      } else {
        setNewsletters(newslettersData || [])
      }

      // Calculate stats
      const totalViews = newslettersData?.reduce((sum, nl) => sum + (nl.view_count || 0), 0) || 0
      const totalNewsletters = newslettersData?.length || 0

      // Fetch subscriber count
      const { count: subscriberCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user?.id)

      setStats({
        totalNewsletters,
        totalViews,
        totalSubscribers: subscriberCount || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNewsletter = async (id: string) => {
    if (confirm('Are you sure you want to delete this newsletter?')) {
      try {
        const { error } = await supabase
          .from('newsletters')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting newsletter:', error)
        } else {
          setNewsletters(prev => prev.filter(nl => nl.id !== id))
          fetchDashboardData() // Refresh stats
        }
      } catch (error) {
        console.error('Error deleting newsletter:', error)
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-deepBlue mb-4">Please sign in to access your dashboard</h1>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile?.is_verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-deepBlue mb-4">Account Verification Required</h1>
            <p className="text-gray-600 mb-6">
              Your account is pending verification. You'll be able to access the dashboard once your credentials are verified.
            </p>
            <p className="text-sm text-gray-500">
              We'll notify you via email when your account is approved.
            </p>
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deepBlue mb-2">
            Hey {profile?.full_name?.split(' ')[0]}, what's up in your field today?
          </h1>
          <p className="text-gray-600">
            Welcome to your scientist dashboard. Share your latest research and insights with the community.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-3xl font-bold text-deepBlue">{stats.totalNewsletters}</p>
              </div>
              <div className="w-12 h-12 bg-mintGreen rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-deepBlue">{stats.totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-mintGreen rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subscribers</p>
                <p className="text-3xl font-bold text-deepBlue">{stats.totalSubscribers}</p>
              </div>
              <div className="w-12 h-12 bg-mintGreen rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Create Newsletter Button */}
        <div className="mb-8">
          <Link href="/create">
            <Button size="lg" className="btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Newsletter
            </Button>
          </Link>
        </div>

        {/* Newsletters List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-deepBlue mb-6">Your Newsletters</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepBlue mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading your newsletters...</p>
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters yet</h3>
              <p className="text-gray-600 mb-4">Start sharing your research by creating your first newsletter.</p>
              <Link href="/create">
                <Button>Create Your First Newsletter</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {newsletters.map((newsletter) => (
                <div key={newsletter.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-deepBlue mb-1">
                        <Link href={`/newsletter/${newsletter.slug}`} className="hover:underline">
                          {newsletter.title}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{formatDate(newsletter.created_at)}</span>
                        <span>•</span>
                        <span>{newsletter.view_count} views</span>
                        <span>•</span>
                        <span className={newsletter.is_public ? 'text-green-600' : 'text-orange-600'}>
                          {newsletter.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                      {newsletter.tags && newsletter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newsletter.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag text-xs">
                              {tag}
                            </span>
                          ))}
                          {newsletter.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{newsletter.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/edit/${newsletter.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNewsletter(newsletter.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 