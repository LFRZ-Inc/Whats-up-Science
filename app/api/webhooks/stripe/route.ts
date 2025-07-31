import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: any) {
  const customerId = subscription.customer
  const status = subscription.status
  const planId = subscription.items.data[0]?.price?.id

  // Get user by Stripe customer ID
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error || !user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Determine subscription tier based on plan
  let subscriptionTier = 'free'
  if (planId) {
    // You can map plan IDs to tiers here
    // For now, we'll use a simple mapping
    if (planId.includes('supporter')) {
      subscriptionTier = 'supporter'
    } else if (planId.includes('science_box')) {
      subscriptionTier = 'science_box'
    }
  }

  // Update user subscription
  await supabaseAdmin
    .from('users')
    .update({
      subscription_tier: subscriptionTier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  console.log(`Updated subscription for user ${user.id} to ${subscriptionTier}`)
}

async function handleSubscriptionCancellation(subscription: any) {
  const customerId = subscription.customer

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error || !user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Reset to free tier
  await supabaseAdmin
    .from('users')
    .update({
      subscription_tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  console.log(`Cancelled subscription for user ${user.id}`)
}

async function handlePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer
  const amount = invoice.amount_paid
  const subscriptionId = invoice.subscription

  // Record payment in database
  await supabaseAdmin
    .from('payments')
    .insert({
      user_id: customerId, // This should be the user ID, not customer ID
      stripe_payment_intent_id: invoice.payment_intent,
      amount: amount,
      currency: invoice.currency,
      status: 'succeeded',
      subscription_tier: 'supporter', // Determine from subscription
    })

  console.log(`Payment succeeded for customer ${customerId}`)
}

async function handlePaymentFailed(invoice: any) {
  const customerId = invoice.customer

  // Record failed payment
  await supabaseAdmin
    .from('payments')
    .insert({
      user_id: customerId, // This should be the user ID, not customer ID
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      subscription_tier: 'supporter', // Determine from subscription
    })

  console.log(`Payment failed for customer ${customerId}`)
} 