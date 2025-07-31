export interface User {
  id: string
  email: string
  full_name: string
  field_of_study: string
  institution: string
  profile_image_url?: string
  is_verified: boolean
  verification_method: 'email' | 'orcid' | 'manual' | null
  orcid_id?: string
  subscription_tier: 'free' | 'supporter' | 'science_box'
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Newsletter {
  id: string
  title: string
  content: string
  slug: string
  tags: string[]
  is_public: boolean
  author_id: string
  author: User
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface Comment {
  id: string
  content: string
  newsletter_id: string
  author_id: string
  author: User
  parent_id?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  subscriber_id: string
  author_id: string
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  subscription_tier: 'supporter' | 'science_box'
  created_at: string
}

export type VerificationMethod = 'email' | 'orcid' | 'manual'
export type SubscriptionTier = 'free' | 'supporter' | 'science_box' 