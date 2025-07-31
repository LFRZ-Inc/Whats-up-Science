import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-deepBlue rounded-full mb-6">
              <svg className="w-10 h-10 text-mintGreen" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-deepBlue mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-deepBlue mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Go Home
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-4">
                Browse Science
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 