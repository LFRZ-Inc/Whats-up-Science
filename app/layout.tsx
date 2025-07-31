import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "What's Up Science - Science, from scientists. Not influencers.",
  description: 'A platform where verified scientists share their knowledge and insights with the world.',
  keywords: 'science, newsletter, scientists, research, academic, verified',
  authors: [{ name: "What's Up Science Team" }],
  openGraph: {
    title: "What's Up Science",
    description: 'Science, from scientists. Not influencers.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 