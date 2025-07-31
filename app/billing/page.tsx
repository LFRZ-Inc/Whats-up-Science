'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SUBSCRIPTION_PLANS } from '@/lib/utils'

export default function BillingPage() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(profile?.subscription_tier || 'free')

  const handleUpgrade = async (plan: 'supporter' | 'science_box') => {
    if (!user) return

    setLoading(true)
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          userId: user.id,
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        // Redirect to Stripe checkout
        const stripe = await import('@stripe/stripe-js').then(({ loadStripe }) => 
          loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        )
        
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-deepBlue mb-4">Please sign in to access billing</h1>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-deepBlue mb-2">Billing & Subscriptions</h1>
            <p className="text-gray-600">
              Choose a plan that supports independent science communication
            </p>
          </div>

          {/* Current Plan */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-deepBlue mb-4">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium capitalize">{currentPlan} Plan</p>
                <p className="text-gray-600">
                  {currentPlan === 'free' && 'Basic access with ads'}
                  {currentPlan === 'supporter' && 'Ad-free experience with supporter benefits'}
                  {currentPlan === 'science_box' && 'Premium access with exclusive content'}
                </p>
              </div>
              {currentPlan !== 'free' && (
                <Button
                  onClick={handleManageBilling}
                  disabled={loading}
                  variant="outline"
                >
                  Manage Billing
                </Button>
              )}
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Supporter Plan */}
            <div className="card">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-deepBlue mb-2">
                  {SUBSCRIPTION_PLANS.supporter.name}
                </h3>
                <div className="text-3xl font-bold text-deepBlue mb-1">
                  $5<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Support independent science communication</p>
              </div>

              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_PLANS.supporter.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade('supporter')}
                disabled={loading || currentPlan === 'supporter' || currentPlan === 'science_box'}
                className="w-full"
                variant={currentPlan === 'supporter' ? 'outline' : 'default'}
              >
                {currentPlan === 'supporter' ? 'Current Plan' : 'Upgrade to Supporter'}
              </Button>
            </div>

            {/* Science Box Plan */}
            <div className="card border-2 border-deepBlue relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-deepBlue text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-deepBlue mb-2">
                  {SUBSCRIPTION_PLANS.science_box.name}
                </h3>
                <div className="text-3xl font-bold text-deepBlue mb-1">
                  $20<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Premium access with exclusive content</p>
              </div>

              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_PLANS.science_box.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade('science_box')}
                disabled={loading || currentPlan === 'science_box'}
                className="w-full"
                variant={currentPlan === 'science_box' ? 'outline' : 'default'}
              >
                {currentPlan === 'science_box' ? 'Current Plan' : 'Get Science Box'}
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-deepBlue mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-deepBlue mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to your current plan until the end of your billing period.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-deepBlue mb-2">What happens if I don't subscribe?</h3>
                <p className="text-gray-600">
                  Free users can still read all public newsletters and leave comments. You'll see ads to support the platform.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-deepBlue mb-2">How do I change my subscription plan?</h3>
                <p className="text-gray-600">
                  You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-deepBlue mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">
                  Yes, we use Stripe for secure payment processing. We never store your payment information on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="card mt-8 text-center">
            <h2 className="text-xl font-semibold text-deepBlue mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              Have questions about billing or subscriptions? We're here to help.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 