import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { Mortgage } from '@/type/pages/dashboard/mortgage';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { UserBase } from '@/type/user';
// import { sendEmail, getPaymentSuccessEmailTemplate, getPaymentFailedEmailTemplate } from '@/utils/server/sendEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'setup_intent.succeeded':
        // Handle bank verification completion for async bank debits
        await handleSetupIntentSucceeded(event.data.object as Stripe.SetupIntent);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case 'payment_method.attached':
        console.log('Payment method attached:', (event.data.object as Stripe.PaymentMethod).id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ============================================
// SETUP INTENT SUCCEEDED
// This fires when bank verification completes for async bank debits
// ============================================
async function handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent) {
  console.log('Handling SetupIntent succeeded:', setupIntent.id);

  const applicationId = setupIntent.metadata?.application_id;
  if (!applicationId) {
    console.log('SetupIntent has no application_id in metadata, skipping');
    return;
  }

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  // Find the mortgage by setup_intent_id
  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_setup_intent_id: setupIntent.id
  });

  if (!mortgage) {
    console.log('No mortgage found for SetupIntent:', setupIntent.id);
    return;
  }

  // Only update if currently pending verification
  if (mortgage.status !== 'pending_verification' && mortgage.status !== 'pending_payment_method') {
    console.log('Mortgage not pending verification, current status:', mortgage.status);
    return;
  }

  // Update mortgage to active
  await mortgageQueryBuilder.update(mortgage.id, {
    status: 'active',
    activated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Update application
  const application = await applicationQueryBuilder.findById(applicationId);
  if (application) {
    await applicationQueryBuilder.update(applicationId, {
      direct_debit_status: 'active',
      status: 'active',
      mortgage_start_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stages_completed: {
        ...application.stages_completed,
        mortgage_activation: {
          ...application.stages_completed?.mortgage_activation,
          completed: false,
          status  : 'current',
            data: {
            ...application.stages_completed?.mortgage_activation?.data,
            direct_debit_status: 'active',
            is_pending_verification: false,
          }
        }
      }
    });
  }

  console.log(`Bank verification completed for mortgage ${mortgage.id}`);

  // TODO: Send email notification that bank is verified
}

// ============================================
// PAYMENT SUCCEEDED
// ============================================
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle both string and object types for subscription
  const subscriptionId = getSubscriptionId(invoice);
  const paymentIntentId = getPaymentIntentId(invoice);
  
  console.log('Handling payment succeeded for invoice', invoice.id, 'subscription', subscriptionId);

  if (!subscriptionId) {
    console.log('Invoice not associated with a subscription');
    return;
  }

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const transactionQueryBuilder = new SupabaseQueryBuilder("transactions");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");

  // Get mortgage by subscription ID
  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscriptionId
  });

  if (!mortgage) {
    console.error('Mortgage not found for subscription:', subscriptionId);
    return;
  }

  // Update payment record - find the next scheduled payment
  const { data: payment, error: paymentError } = await supabaseAdmin
    .from('mortgage_payments')
    .update({
      status: 'succeeded',
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: paymentIntentId,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('mortgage_id', mortgage.id)
    .eq('status', 'scheduled')
    .order('payment_number', { ascending: true })
    .limit(1)
    .select()
    .single();

  if (paymentError) {
    console.error('Failed to update payment record:', paymentError);
  } else {
    console.log('Updated payment record for mortgage', mortgage.id, 'payment ID:', payment?.id);
  }

  // Update mortgage record
  const newPaymentsMade = (mortgage.payments_made || 0) + 1;
  const periodEnd = new Date(invoice.period_end * 1000);
  const nextPaymentDate = new Date(periodEnd);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  // Check if this is the last payment
  const isCompleted = newPaymentsMade >= mortgage.total_payments;

  const updatedMortgage = await mortgageQueryBuilder.update(mortgage.id, {
    payments_made: newPaymentsMade,
    last_payment_date_actual: new Date().toISOString(),
    next_payment_date: isCompleted ? '' : nextPaymentDate.toISOString().split('T')[0],
    status: isCompleted ? 'completed' : 'active',
    completed_at: isCompleted ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  });

  console.log('Updated mortgage record:', updatedMortgage?.id, 'payments made:', newPaymentsMade);

  // Create transaction record
  await transactionQueryBuilder.create({
    user_id: mortgage.user_id,
    application_id: mortgage.application_id,
    mortgage_id: mortgage.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid / 100, // Convert from cents
    currency: invoice.currency,
    status: 'completed',
    type: 'mortgage_payment',
    description: `Mortgage payment ${newPaymentsMade} of ${mortgage.total_payments}`,
    metadata: {
      payment_number: newPaymentsMade,
      subscription_id: subscriptionId,
    },
  });

  // TODO: Send success email
  // const user = await userQueryBuilder.findById(mortgage.user_id);

  console.log(`Payment succeeded for mortgage ${mortgage.id}, payment ${newPaymentsMade}/${mortgage.total_payments}`);
}

// ============================================
// PAYMENT FAILED
// ============================================
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionId(invoice);
  const paymentIntentId = getPaymentIntentId(invoice);

  console.log('Handling payment failed for invoice', invoice.id, 'subscription', subscriptionId);

  if (!subscriptionId) {
    return;
  }

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscriptionId
  });

  if (!mortgage) {
    console.error('Mortgage not found for subscription:', subscriptionId);
    return;
  }

  // Update the next scheduled payment to failed
  const { error: paymentError } = await supabaseAdmin
    .from('mortgage_payments')
    .update({
      status: 'failed',
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: paymentIntentId,
      failure_reason: invoice.last_finalization_error?.message || 'Payment failed',
      updated_at: new Date().toISOString(),
    })
    .eq('mortgage_id', mortgage.id)
    .eq('status', 'scheduled')
    .order('payment_number', { ascending: true })
    .limit(1);

  if (paymentError) {
    console.error('Failed to update payment record:', paymentError);
  }

  // Increment retry count
  const {data:m} = await supabaseAdmin
    .from('mortgage_payments')
    .update({
      retry_count: supabaseAdmin.rpc('increment_retry_count'),
    })
    .eq('mortgage_id', mortgage.id)
    .eq('status', 'failed')
    .order('payment_number', { ascending: true })
    .limit(1);
    
  console.log('Incremented retry count for payment, new retry count:', m );
  
  // Update mortgage status
  await mortgageQueryBuilder.update(mortgage.id, {
    status: 'payment_failed',
    updated_at: new Date().toISOString(),
  });

  // TODO: Send failure email
  // const user = await userQueryBuilder.findById(mortgage.user_id);

  console.log(`Payment failed for mortgage ${mortgage.id}`);
}

// ============================================
// SUBSCRIPTION UPDATED
// ============================================
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");

  console.log('Handling subscription update for subscription', subscription.id);

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscription.id
  });

  if (!mortgage) {
    console.log('No mortgage found for subscription:', subscription.id);
    return;
  }

  // Map Stripe status to our status
  let status: string = 'active';
  switch (subscription.status) {
    case 'past_due':
      status = 'payment_failed';
      break;
    case 'canceled':
    case 'unpaid':
      status = 'cancelled';
      break;
    case 'paused':
      status = 'paused';
      break;
    case 'active':
      status = 'active';
      break;
  }

  await mortgageQueryBuilder.update(mortgage.id, {
    status,
    updated_at: new Date().toISOString(),
  });

  console.log(`Subscription updated for mortgage ${mortgage.id}, new status: ${status}`);
}

// ============================================
// SUBSCRIPTION CANCELLED
// ============================================
async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");

  console.log('Handling subscription cancellation for subscription', subscription.id);

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscription.id
  });

  if (!mortgage) {
    console.log('No mortgage found for subscription:', subscription.id);
    return;
  }

  // Determine if completed or cancelled
  const isCompleted = mortgage.payments_made >= mortgage.total_payments;
  const status = isCompleted ? 'completed' : 'cancelled';

  await mortgageQueryBuilder.update(mortgage.id, {
    status,
    cancelled_at: status === 'cancelled' ? new Date().toISOString() : undefined,
    completed_at: status === 'completed' ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  });

  // Update remaining scheduled payments if cancelled
  if (status === 'cancelled') {
    await supabaseAdmin
      .from('mortgage_payments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('mortgage_id', mortgage.id)
      .eq('status', 'scheduled');
  }

  console.log(`Subscription ${status} for mortgage ${mortgage.id}`);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get subscription ID from invoice (handles both string and expanded object)
function getSubscriptionId(invoice: Stripe.Invoice): string | undefined {
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return undefined;
  
  if (typeof subscription === 'string') {
    return subscription;
  }
  
  // If it's an expanded Subscription object
  return (subscription as Stripe.Subscription).id;
}

// Get payment intent ID from invoice
function getPaymentIntentId(invoice: Stripe.Invoice): string | undefined {
  const paymentData = invoice.payments?.data?.[0];
  if (!paymentData) return undefined;
  
  const paymentIntent = paymentData.payment?.payment_intent;
  if (!paymentIntent) return undefined;
  
  if (typeof paymentIntent === 'string') {
    return paymentIntent;
  }
  
  // If it's an expanded PaymentIntent object
  return (paymentIntent as Stripe.PaymentIntent).id;
}