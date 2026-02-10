import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { Mortgage } from '@/type/pages/dashboard/mortgage';
import { UserBase } from '@/type/user';
import { sendEmail } from '@/utils/email/send_email';
import { paymentReceiptBody } from '@/utils/email/payment-receipt';
import { getPaymentFailedEmailTemplate, getPaymentSuccessEmailTemplate } from '@/utils/email/direct-debit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover"
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PaymentType = 'escrow_down_payment' | 'legal_fee' | 'valuation_fee' | 'processing_fee' | string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No signature found in webhook request');
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'setup_intent.succeeded':
        await handleSetupIntentSucceeded(event.data.object as Stripe.SetupIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
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
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const paymentType = session.metadata?.payment_type as PaymentType;

  console.log('Checkout completed:', { sessionId: session.id, paymentType });

  if (!paymentType) {
    await processGenericPayment(session);
    return;
  }

  if (paymentType.startsWith('escrow_')) {
    await processEscrowPayment(session, paymentType);
  } else {
    switch (paymentType) {
      case 'legal_fee':
      case 'valuation_fee':
        await processFeePayment(session, paymentType);
        break;
      case 'processing_fee':
      default:
        await processGenericPayment(session);
    }
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  console.log('Checkout expired:', session.id);

  await updateTransactionBySessionId(session.id, {
    status: 'cancelled',
    metadata: { cancelled_at: new Date().toISOString(), reason: 'session_expired' },
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const charges = await stripe.charges.list({ payment_intent: paymentIntent.id, limit: 1 });
  
  if (charges.data.length > 0 && charges.data[0].receipt_url) {
    const transaction = await updateTransactionByPaymentIntentId(paymentIntent.id, {
      receipt_url: charges.data[0].receipt_url,
    });

    if (transaction?.user_id) {
      await sendReceiptUrlEmail(transaction.user_id, charges.data[0].receipt_url);
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  await updateTransactionByPaymentIntentId(paymentIntent.id, {
    status: 'failed',
    metadata: { failed_at: new Date().toISOString(), error: paymentIntent.last_payment_error },
  });
}

async function handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent) {
  const applicationId = setupIntent.metadata?.application_id;
  
  console.log('Setup intent succeeded:', { id: setupIntent.id, applicationId });

  if (!applicationId) return;

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_setup_intent_id: setupIntent.id
  });

  if (!mortgage || (mortgage.status !== 'pending_verification' && mortgage.status !== 'pending_payment_method')) {
    console.log('Mortgage not pending verification:', mortgage?.status);
    return;
  }

  await mortgageQueryBuilder.update(mortgage.id, {
    status: 'active',
    activated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

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
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionId(invoice);
  const paymentIntentId = getPaymentIntentId(invoice);

  console.log('Invoice payment succeeded:', { invoiceId: invoice.id, subscriptionId });

  if (!subscriptionId) return;

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");


  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscriptionId
  });

  if (!mortgage) {
    console.error('Mortgage not found for subscription:', subscriptionId);
    return;
  }

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
  }

  const newPaymentsMade = (mortgage.payments_made || 0) + 1;
  const isCompleted = newPaymentsMade >= mortgage.total_payments;
  const nextPaymentDate = new Date(invoice.period_end * 1000);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  await mortgageQueryBuilder.update(mortgage.id, {
    payments_made: newPaymentsMade,
    last_payment_date_actual: new Date().toISOString(),
    next_payment_date: isCompleted ? '' : nextPaymentDate.toISOString().split('T')[0],
    status: isCompleted ? 'completed' : 'active',
    completed_at: isCompleted ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  });

  await supabaseAdmin.from('transactions').insert({
    user_id: mortgage.user_id,
    application_id: mortgage.application_id,
    mortgage_id: mortgage.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: 'completed',
    type: 'mortgage_payment',
    description: `Mortgage payment ${newPaymentsMade} of ${mortgage.total_payments}`,
    metadata: { payment_number: newPaymentsMade, subscription_id: subscriptionId },
  });

  const application = await applicationQueryBuilder.findById(mortgage.application_id);
  const user = await userQueryBuilder.findById(mortgage.user_id);

  if (user?.email) {
    sendEmail({
      to: user.email,
      subject: 'Payment Successful - Kletch',
      html: getPaymentSuccessEmailTemplate({
        userName: user.name || 'Customer', 
        amount: invoice.amount_paid / 100,
        paymentNumber: newPaymentsMade,
        totalPayments: mortgage.total_payments,
        nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
        applicationNumber: application?.application_number || '',
      }),
    }).catch(err => console.error('Failed to send payment success email:', err));
  }
  console.log(`Mortgage payment ${newPaymentsMade}/${mortgage.total_payments} succeeded for ${mortgage.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionId(invoice);
  const paymentIntentId = getPaymentIntentId(invoice);

  console.log('Invoice payment failed:', { invoiceId: invoice.id, subscriptionId });

  if (!subscriptionId) return;

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscriptionId
  });

  if (!mortgage) return;

  await supabaseAdmin
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

  await mortgageQueryBuilder.update(mortgage.id, {
    status: 'payment_failed',
    updated_at: new Date().toISOString(),
  });

  const application = await applicationQueryBuilder.findById(mortgage.application_id);

  const user = await userQueryBuilder.findById(mortgage.user_id);
  
  if (user?.email) {
    sendEmail({
      to: user.email,
      subject: 'Payment Failed - Action Required - Kletch',
      html: getPaymentFailedEmailTemplate({
        userName: user.name || 'Customer',
        amount: invoice.amount_due / 100,
        failureReason: invoice.last_finalization_error?.message || 'Your payment could not be processed',
        retryDate: invoice.next_payment_attempt 
          ? new Date(invoice.next_payment_attempt * 1000).toISOString().split('T')[0]
          : null,
        applicationNumber: application?.application_number || '',
        updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/applications`,
      }),
    }).catch(err => console.error('Failed to send payment failure email:', err));
  }

  console.log(`Mortgage payment failed for ${mortgage.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscription.id
  });

  if (!mortgage) return;

  const statusMap: Record<string, string> = {
    past_due: 'payment_failed',
    canceled: 'cancelled',
    unpaid: 'cancelled',
    paused: 'paused',
    active: 'active',
  };

  await mortgageQueryBuilder.update(mortgage.id, {
    status: statusMap[subscription.status] || 'active',
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  console.log('Subscription cancelled:', subscription.id);

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscription.id
  });

  if (!mortgage) return;

  const isCompleted = mortgage.payments_made >= mortgage.total_payments;
  const status = isCompleted ? 'completed' : 'cancelled';

  await mortgageQueryBuilder.update(mortgage.id, {
    status,
    cancelled_at: status === 'cancelled' ? new Date().toISOString() : undefined,
    completed_at: status === 'completed' ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  });

  if (status === 'cancelled') {
    await supabaseAdmin
      .from('mortgage_payments')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('mortgage_id', mortgage.id)
      .eq('status', 'scheduled');
  }
}

async function processEscrowPayment(session: Stripe.Checkout.Session, paymentType: string) {
  const applicationId = session.metadata?.application_id;
  const userId = session.metadata?.user_id;
  const originalAmount = parseInt(session.metadata?.original_amount || '0');
  const escrowType = paymentType.replace('escrow_', '');

  const transaction = await updateTransactionBySessionId(session.id, {
    status: 'succeeded',
    stripe_payment_intent_id: session.payment_intent as string | null,
    payment_method: session.payment_method_types?.[0] || 'card',
    state: 'holding',
    metadata: {
      completed_at: new Date().toISOString(),
      customer_details: session.customer_details,
      escrow_status: 'held',
    },
  });

  if (!transaction) return;

  if (applicationId) {
    const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

    if (escrowType === 'down_payment') {
      await applicationQueryBuilder.update(applicationId, {
        down_payment_amount: originalAmount,
        updated_at: new Date().toISOString(),
      });
    }

    await updatePaymentStageData(applicationId, {
      [`${escrowType}_amount`]: originalAmount,
      [`${escrowType}_status`]: 'escrowed',
      [`${escrowType}_transaction_id`]: transaction.id,
      [`${escrowType}_date`]: new Date().toISOString(),
    });
  }

  if (userId) {
    await sendPaymentConfirmationEmail(userId, {
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      transactionId: transaction.id,
      applicationId: applicationId || '',
      type: 'Escrow',
      subject: 'Escrow Payment Confirmed - Kletch',
    });
  }
}

async function processFeePayment(session: Stripe.Checkout.Session, feeType: 'legal_fee' | 'valuation_fee') {
  const applicationId = session.metadata?.application_id;
  const userId = session.metadata?.user_id;
  const originalAmount = parseInt(session.metadata?.original_amount || '0');

  const transaction = await updateTransactionBySessionId(session.id, {
    status: 'succeeded',
    stripe_payment_intent_id: session.payment_intent as string | null,
    payment_method: session.payment_method_types?.[0] || 'card',
    metadata: { completed_at: new Date().toISOString(), customer_details: session.customer_details },
  });

  if (!transaction) return;

  if (applicationId) {
    const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

    await applicationQueryBuilder.update(applicationId, {
      [`${feeType}_payment_status`]: 'paid',
      [`${feeType}_payment_date`]: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await updatePaymentStageData(applicationId, {
      [`${feeType}_status`]: 'paid',
      [`${feeType}_transaction_id`]: transaction.id,
      [`${feeType}_date`]: new Date().toISOString(),
      [`${feeType}_amount`]: originalAmount,
    });
  }

  if (userId) {
    const typeLabel = feeType === 'legal_fee' ? 'Legal' : 'Valuation';
    await sendPaymentConfirmationEmail(userId, {
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      transactionId: transaction.id,
      applicationId: applicationId || '',
      type: typeLabel,
      subject: `${typeLabel} Fee Payment Confirmed - Kletch`,
    });
  }
}

async function processGenericPayment(session: Stripe.Checkout.Session) {
  const applicationId = session.metadata?.application_id;
  const userId = session.metadata?.user_id;

  const transaction = await updateTransactionBySessionId(session.id, {
    status: 'succeeded',
    stripe_payment_intent_id: session.payment_intent as string | null,
    payment_method: session.payment_method_types?.[0] || 'card',
    metadata: { completed_at: new Date().toISOString(), customer_details: session.customer_details },
  });

  if (!transaction) return;

  if (applicationId) {
    await supabaseAdmin
      .from('applications')
      .update({
        processing_fee_payment_status: 'paid',
        processing_fee_payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);
  }

  if (userId) {
    await sendPaymentConfirmationEmail(userId, {
      amount: session.amount_total || 10000,
      currency: session.currency || 'usd',
      transactionId: transaction.id,
      applicationId: applicationId || '',
      type: 'Application Processing',
      subject: 'Payment Receipt - Ariveasy',
    });
  }
}

async function updateTransactionBySessionId(
  sessionId: string,
  data: Record<string, any>
): Promise<{ id: string; user_id: string } | null> {
  const { data: transaction, error } = await supabaseAdmin
    .from('transactions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('stripe_session_id', sessionId)
    .select('id, user_id')
    .single();

  if (error) {
    console.error('Failed to update transaction:', error);
    return null;
  }
  return transaction;
}

async function updateTransactionByPaymentIntentId(
  paymentIntentId: string,
  data: Record<string, any>
): Promise<{ id: string; user_id: string } | null> {
  const { data: transaction, error } = await supabaseAdmin
    .from('transactions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select('id, user_id')
    .single();

  if (error) {
    console.error('Failed to update transaction:', error);
    return null;
  }
  return transaction;
}

async function updatePaymentStageData(applicationId: string, stageDataUpdate: Record<string, any>): Promise<void> {
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const application = await applicationQueryBuilder.findById(applicationId);
  if (!application) return;

  const currentStageData = application.stages_completed?.payment_setup?.data || {};

  await applicationQueryBuilder.update(applicationId, {
    stages_completed: {
      ...application.stages_completed,
      payment_setup: {
        ...application.stages_completed?.payment_setup,
        status: 'current',
        completed: false,
        data: { ...currentStageData, ...stageDataUpdate },
      },
    },
  });
}

async function sendPaymentConfirmationEmail(
  userId: string,
  params: { amount: number; currency: string; transactionId: string; applicationId: string; type: string; subject: string }
): Promise<void> {
  try {
    const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
    const user = await userQueryBuilder.findById(userId);
    if (!user?.email) return;

    await sendEmail({
      to: user.email,
      subject: params.subject,
      html: paymentReceiptBody({
        userName: user.name || 'Customer',
        amount: params.amount,
        currency: params.currency,
        transactionId: params.transactionId,
        receiptUrl: '',
        applicationId: params.applicationId,
        paymentDate: new Date().toISOString(),
        type: params.type,
      }),
    });
    console.log(`Payment confirmation email sent to: ${user.email}`);
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
  }
}

async function sendReceiptUrlEmail(userId: string, receiptUrl: string): Promise<void> {
  try {
    const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
    const user = await userQueryBuilder.findById(userId);
    if (!user?.email) return;

    await sendEmail({
      to: user.email,
      subject: 'Your Payment Receipt is Ready - Ariveasy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">Your Receipt is Ready!</h2>
          <p>Dear ${user.name || 'Customer'},</p>
          <p>Your official Stripe receipt is now available.</p>
          <div style="margin: 30px 0;">
            <a href="${receiptUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Download Receipt PDF
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This receipt serves as your official payment confirmation.</p>
        </div>
      `,
    });
    console.log(`Receipt URL email sent to: ${user.email}`);
  } catch (error) {
    console.error('Failed to send receipt URL email:', error);
  }
}

function getSubscriptionId(invoice: Stripe.Invoice): string | undefined {
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return undefined;
  return typeof subscription === 'string' ? subscription : (subscription as Stripe.Subscription).id;
}

function getPaymentIntentId(invoice: Stripe.Invoice): string | undefined {
  const paymentData = invoice.payments?.data?.[0];
  const paymentIntent = paymentData?.payment?.payment_intent;
  if (!paymentIntent) return undefined;
  return typeof paymentIntent === 'string' ? paymentIntent : (paymentIntent as Stripe.PaymentIntent).id;
}