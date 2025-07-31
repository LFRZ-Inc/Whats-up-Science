import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Branding */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-deepBlue rounded-full mb-6">
              <svg className="w-10 h-10 text-mintGreen" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-deepBlue mb-4">
              What's Up Science
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Science, from scientists. Not influencers.
            </p>
          </div>

          {/* Hero Description */}
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join a community where verified scientists share cutting-edge research, 
            insights, and discoveries. No clickbait, no sensationalism—just real science 
            from real researchers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/browse">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Read Public Science
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-4">
                Join as Scientist
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="card text-center">
              <div className="w-12 h-12 bg-mintGreen rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-deepBlue mb-2">Verified Scientists</h3>
              <p className="text-gray-600">Only authenticated researchers can publish content, ensuring quality and credibility.</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-mintGreen rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-deepBlue mb-2">Real Research</h3>
              <p className="text-gray-600">Access cutting-edge findings and insights directly from the source.</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-mintGreen rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-deepBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-deepBlue mb-2">Community</h3>
              <p className="text-gray-600">Connect with fellow researchers and science enthusiasts worldwide.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-deepBlue mb-8 text-center">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">0</div>
                <div className="text-gray-600">Verified Scientists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">0</div>
                <div className="text-gray-600">Published Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">0</div>
                <div className="text-gray-600">Active Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deepBlue mb-2">0</div>
                <div className="text-gray-600">Research Fields</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 