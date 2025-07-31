import Link from 'next/link'
import { formatDate, truncateText } from '@/lib/utils'
import { Newsletter } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface NewsletterCardProps {
  newsletter: Newsletter & {
    author: {
      full_name: string
      field_of_study: string
      institution: string
    }
  }
}

export function NewsletterCard({ newsletter }: NewsletterCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              <Link 
                href={`/newsletter/${newsletter.slug}`}
                className="hover:text-deepBlue transition-colors"
              >
                {newsletter.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm">
              {truncateText(newsletter.content, 150)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {newsletter.tags?.map((tag, index) => (
            <span 
              key={index}
              className="tag text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div>
            <div className="font-medium text-deepBlue">{newsletter.author.full_name}</div>
            <div className="text-xs">{newsletter.author.institution}</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{formatDate(newsletter.published_at || new Date())}</span>
          <span>•</span>
          <span>{newsletter.view_count} views</span>
        </div>
      </CardFooter>
    </Card>
  )
} 