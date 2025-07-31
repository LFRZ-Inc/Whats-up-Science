import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const d = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const SCIENTIFIC_FIELDS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'Engineering',
  'Medicine',
  'Psychology',
  'Neuroscience',
  'Astronomy',
  'Geology',
  'Environmental Science',
  'Materials Science',
  'Biochemistry',
  'Molecular Biology',
  'Genetics',
  'Ecology',
  'Climate Science',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Robotics',
  'Nanotechnology',
  'Quantum Physics',
  'Other'
] as const

export const SUBSCRIPTION_PLANS = {
  supporter: {
    name: 'Supporter',
    price: 500, // $5.00 in cents
    features: [
      'Ad-free experience',
      'Early access to new features',
      'Support independent science communication'
    ]
  },
  science_box: {
    name: 'Science Box',
    price: 2000, // $20.00 in cents
    features: [
      'All Supporter benefits',
      'Exclusive content from top scientists',
      'Monthly curated science digest',
      'Direct Q&A with featured scientists',
      'Priority support'
    ]
  }
} as const 