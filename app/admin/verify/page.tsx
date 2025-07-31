'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { User } from '@/lib/types'

export default function AdminVerifyPage() {
  const { user, profile } = useAuth()
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchPendingUsers()
    }
  }, [user])

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_verified', false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching pending users:', error)
      } else {
        setPendingUsers(data || [])
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (userId: string, approved: boolean) => {
    setProcessing(userId)
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_verified: approved,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user:', error)
      } else {
        // Refresh the list
        fetchPendingUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setProcessing(null)
    }
  }

  // Simple admin check - in production, you'd want proper admin roles
  const isAdmin = user?.email === 'admin@whatsupscience.com' // Replace with your admin email

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-deepBlue mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-deepBlue mb-2">Admin Verification Panel</h1>
            <p className="text-gray-600">
              Review and verify pending scientist applications
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">
                  {pendingUsers.length}
                </div>
                <div className="text-gray-600">Pending Verifications</div>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">
                  {pendingUsers.filter(u => u.verification_method === 'email').length}
                </div>
                <div className="text-gray-600">Email Verification</div>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">
                  {pendingUsers.filter(u => u.verification_method === 'orcid').length}
                </div>
                <div className="text-gray-600">ORCID Verification</div>
              </div>
            </div>
          </div>

          {/* Pending Users List */}
          <div className="card">
            <h2 className="text-xl font-semibold text-deepBlue mb-6">
              Pending Applications
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepBlue mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading pending applications...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending applications to review.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-mintGreen rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-deepBlue">
                              {user.full_name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-deepBlue">
                              {user.full_name}
                            </h3>
                            <p className="text-gray-600">{user.email}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Field of Study</p>
                            <p className="text-gray-600">{user.field_of_study}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Institution</p>
                            <p className="text-gray-600">{user.institution}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Verification Method</p>
                            <p className="text-gray-600 capitalize">{user.verification_method}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Applied</p>
                            <p className="text-gray-600">
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {user.orcid_id && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700">ORCID ID</p>
                            <a 
                              href={`https://orcid.org/${user.orcid_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-deepBlue hover:underline"
                            >
                              {user.orcid_id}
                            </a>
                          </div>
                        )}

                        {/* Verification indicators */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {user.verification_method === 'email' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Academic Email
                            </span>
                          )}
                          {user.verification_method === 'orcid' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ORCID Verified
                            </span>
                          )}
                          {user.verification_method === 'manual' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Manual Review Required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => handleVerification(user.id, true)}
                          disabled={processing === user.id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processing === user.id ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button
                          onClick={() => handleVerification(user.id, false)}
                          disabled={processing === user.id}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {processing === user.id ? 'Processing...' : 'Reject'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 