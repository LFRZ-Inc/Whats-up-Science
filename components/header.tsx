'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-deepBlue rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-mintGreen" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-deepBlue">What's Up Science</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-700 hover:text-deepBlue transition-colors">
              Browse
            </Link>
            <Link href="/curate" className="text-gray-700 hover:text-deepBlue transition-colors">
              AI Curator
            </Link>
            {user && profile?.is_verified && (
              <Link href="/dashboard" className="text-gray-700 hover:text-deepBlue transition-colors">
                Dashboard
              </Link>
            )}
            {user && profile?.is_verified && (
              <Link href="/create" className="text-gray-700 hover:text-deepBlue transition-colors">
                Create
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-deepBlue transition-colors">
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.subscription_tier === 'free' && (
                  <Link href="/billing">
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-deepBlue transition-colors">
                    <div className="w-8 h-8 bg-mintGreen rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-deepBlue">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden sm:block">{profile?.full_name || user.email}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Settings
                      </Link>
                      <Link href="/billing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Billing
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Join as Scientist
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 