import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { Mortgage } from '@/type/pages/dashboard/mortgage';
import { UserBase } from '@/type/user';
import { sendEmail } from '@/utils/email/send_email';
import { generalPaymentReceipt, paymentReceiptBody } from '@/utils/email/templates/payment-receipt';
import { getPaymentFailedEmailTemplate, getPaymentSuccessEmailTemplate } from '@/utils/email/templates/direct-debit';
import { createNotification } from '@/utils/notifications/createNotification';
import { buildNotificationPayload } from '@/utils/notifications/notificationContent';
import { formatUSD } from '@/lib/formatter';
import { PropertyBase } from '@/type/pages/property';
import { logger } from '@/utils/server/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover"
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEBHOOK_CONTEXT = { component: 'webhook', action: 'stripe' };

type PaymentType = 'escrow_down_payment' | 'legal_fee' | 'valuation_fee' | 'processing_fee' | string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      logger.warn('No signature found in webhook request', WEBHOOK_CONTEXT);
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logger.error(err, 'Webhook signature verification failed', WEBHOOK_CONTEXT);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    logger.info(`Processing webhook event: ${event.type}`, WEBHOOK_CONTEXT);

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
        logger.info(`Payment method attached: ${(event.data.object as Stripe.PaymentMethod).id}`, WEBHOOK_CONTEXT);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`, WEBHOOK_CONTEXT);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    logger.error(error, 'Webhook processing failed', WEBHOOK_CONTEXT);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const paymentType = session.metadata?.payment_type as PaymentType;

  logger.info(`Checkout completed: ${session.id} — type: ${paymentType}`, WEBHOOK_CONTEXT);

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
  logger.info(`Checkout expired: ${session.id}`, WEBHOOK_CONTEXT);

  await updateTransactionBySessionId(session.id, {
    status: 'cancelled',
    metadata: { cancelled_at: new Date().toISOString(), reason: 'session_expired' },
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  logger.info(`Payment intent succeeded: ${paymentIntent.id}`, WEBHOOK_CONTEXT);

  const mortgageId = paymentIntent.metadata?.mortgage_id;
  const paymentIds = paymentIntent.metadata?.payment_ids;

  if (mortgageId && paymentIds) {
    await handleManualMortgagePaymentSucceeded(paymentIntent);
    return;
  }

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
  logger.info(`Payment intent failed: ${paymentIntent.id}`, WEBHOOK_CONTEXT);

  const mortgageId = paymentIntent.metadata?.mortgage_id;
  const paymentIds = paymentIntent.metadata?.payment_ids;

  if (mortgageId && paymentIds) {
    await handleManualMortgagePaymentFailed(paymentIntent);
    return;
  }

  await updateTransactionByPaymentIntentId(paymentIntent.id, {
    status: 'failed',
    metadata: { failed_at: new Date().toISOString(), error: paymentIntent.last_payment_error },
  });
}

async function handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent) {
  const applicationId = setupIntent.metadata?.application_id;

  logger.info(`Setup intent succeeded: ${setupIntent.id}`, { ...WEBHOOK_CONTEXT, applicationId });

  if (!applicationId) return;

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_setup_intent_id: setupIntent.id
  });

  if (!mortgage || (mortgage.status !== 'pending_verification' && mortgage.status !== 'pending_payment_method')) {
    logger.info(`Mortgage not pending verification: ${mortgage?.status}`, WEBHOOK_CONTEXT);
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
          status: 'current',
          data: {
            ...application.stages_completed?.mortgage_activation?.data,
            direct_debit_status: 'active',
            is_pending_verification: false,
          }
        }
      }
    });
  }

  logger.info(`Bank verification completed for mortgage ${mortgage.id}`, WEBHOOK_CONTEXT);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionId(invoice);
  const paymentIntentId = getPaymentIntentId(invoice);

  logger.info(`Invoice payment succeeded: ${invoice.id}`, { ...WEBHOOK_CONTEXT, extra: { subscription_id: subscriptionId } });

  if (!subscriptionId) return;

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const mortgage = await mortgageQueryBuilder.findOneByCondition({
    stripe_subscription_id: subscriptionId
  });

  if (!mortgage) {
    logger.error(new Error('Mortgage not found'), `Mortgage not found for subscription: ${subscriptionId}`, WEBHOOK_CONTEXT);
    return;
  }

  const { data: nextPayment, error: findError } = await supabaseAdmin
    .from('mortgage_payments')
    .select('*')
    .eq('mortgage_id', mortgage.id)
    .eq('status', 'scheduled')
    .order('payment_number', { ascending: true })
    .limit(1)
    .single();

  if (findError || !nextPayment) {
    logger.warn(`No scheduled payment found for mortgage: ${mortgage.id}`, WEBHOOK_CONTEXT);
  }

  let paymentId: string | null = null;
  let paymentNumber: number = (mortgage.payments_made || 0) + 1;

  if (nextPayment) {
    const { data: updatedPayment, error: updateError } = await supabaseAdmin
      .from('mortgage_payments')
      .update({
        status: 'succeeded',
        stripe_invoice_id: invoice.id,
        stripe_payment_intent_id: paymentIntentId,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', nextPayment.id)
      .select()
      .single();

    if (updateError) {
      logger.error(updateError, 'Failed to update payment record', WEBHOOK_CONTEXT);
    } else {
      paymentId = updatedPayment.id;
      paymentNumber = updatedPayment.payment_number;
    }
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

  const { error: transactionError } = await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: mortgage.user_id,
      application_id: mortgage.application_id,
      mortgage_id: mortgage.id,
      mortgage_payment_id: paymentId,
      stripe_payment_intent_id: paymentIntentId,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      type: 'mortgage_payment',
      description: `Mortgage payment ${newPaymentsMade} of ${mortgage.number_of_payments || mortgage.total_payments}`,
      metadata: { 
        payment_number: paymentNumber, 
        subscription_id: subscriptionId,
        invoice_id: invoice.id,
      },
    });

  if (transactionError) {
    logger.error(transactionError, 'Failed to create transaction', WEBHOOK_CONTEXT);
  }

  const application = await applicationQueryBuilder.findById(mortgage.application_id);
  const user = await userQueryBuilder.findById(mortgage.user_id);

  if (user?.email) {
    sendEmail({
      to: user.email,
      subject: 'Payment Successful - Kletch',
      html: getPaymentSuccessEmailTemplate({
        userName: user.name || 'Customer', 
        amount: invoice.amount_paid,
        paymentNumber: newPaymentsMade,
        totalPayments: mortgage.total_payments,
        numberOfPayments: mortgage.number_of_payments,
        monthlyPayment: mortgage.monthly_payment,
        nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
        applicationNumber: application?.application_number || '',
      }),
    }).catch(err => logger.error(err, 'Failed to send payment success email', WEBHOOK_CONTEXT));

    if (application) {
      try {
        await createNotification(
          buildNotificationPayload('subscription_payment_success', {
            user_id: user.id,
            application_id: application.id,
            property_id: application.property_id,
            payment_id: paymentId || mortgage.id,
            type: 'subscription_payment_success',
            channel: 'in_app',
            metadata: {
              amount: formatUSD({ amount: invoice.amount_paid / 100 }),
              currency: 'USD',
              cta_url: `/user-dashboard/properties/${mortgage.id}/mortgages`,
              property_name: application.property_name,
              reference_number: mortgage.id
            },
          })
        );
      } catch (notificationError) {
        logger.error(notificationError, 'Failed to create in-app notification', WEBHOOK_CONTEXT);
      }
    }
  }

  logger.info(`Mortgage payment ${newPaymentsMade}/${mortgage.total_payments} succeeded for ${mortgage.id}`, WEBHOOK_CONTEXT);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionId(invoice);
  const paymentIntentId = getPaymentIntentId(invoice);

  logger.info(`Invoice payment failed: ${invoice.id}`, { ...WEBHOOK_CONTEXT, extra: { subscription_id: subscriptionId } });

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
        amount: invoice.amount_due,
        failureReason: invoice.last_finalization_error?.message || 'Your payment could not be processed',
        retryDate: invoice.next_payment_attempt 
          ? new Date(invoice.next_payment_attempt * 1000).toISOString().split('T')[0]
          : null,
        applicationNumber: application?.application_number || '',
        updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/mortgages/${mortgage.id}`,
      }),
    }).catch(err => logger.error(err, 'Failed to send payment failure email', WEBHOOK_CONTEXT));

    await createNotification(
      buildNotificationPayload('subscription_payment_success', {
        user_id: user.id,
        application_id: application.id,
        property_id: application.property_id,
        payment_id: mortgage.id,
        type: 'subscription_payment_failed',
        channel: 'in_app',
        metadata: {
          amount: formatUSD({ amount: invoice.amount_due, fromCents: true }),
          currency: 'USD',
          cta_url: `/user-dashboard/properties/${mortgage.id}/mortgages`,
          property_name: application.property_name,
          reference_number: mortgage.id
        },
      })
    );
  }

  logger.info(`Mortgage payment failed for ${mortgage.id}`, WEBHOOK_CONTEXT);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  logger.info(`Subscription updated: ${subscription.id}`, WEBHOOK_CONTEXT);

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
  logger.info(`Subscription cancelled: ${subscription.id}`, WEBHOOK_CONTEXT);

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

    await updateTermsStageData(applicationId, {
      [`${escrowType}_amount`]: originalAmount,
      [`${escrowType}_status`]: 'escrowed',
      [`${escrowType}_transaction_id`]: transaction.id,
      [`${escrowType}_date`]: new Date().toISOString(),
    });
  }

  await updatePropertyStatus(applicationId || '');

  if (userId) {
    await sendPaymentConfirmationEmail(userId, {
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      transactionId: transaction.id,
      applicationId: applicationId || '',
      type: 'Escrow',
      subject: 'Escrow Payment Confirmed - Kletch',
    });

    await createNotification(
      buildNotificationPayload('down_payment_success', {
        user_id: userId,
        application_id: applicationId,
        type: 'down_payment_success',
        payment_id: transaction.id,
        channel: 'in_app',
        metadata: {
          application_number: applicationId,
          currency: 'USD',
          amount: `${session.amount_total}`,
          cta_url: `/user-dashboard/applications`,
        },
      })
    );
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

    await createNotification(
      buildNotificationPayload(`${feeType}_success`, {
        user_id: userId,
        application_id: applicationId,
        type: `${feeType}_success`,
        payment_id: transaction.id,
        channel: 'in_app',
        metadata: {
          application_number: applicationId,
          currency: 'USD',
          amount: `${session.amount_total}`,
          cta_url: `/user-dashboard/applications`,
        },
      })
    );
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
      subject: 'Payment Receipt - Kletch',
    });

    await createNotification(
      buildNotificationPayload('processing_fee_success', {
        user_id: userId,
        application_id: applicationId,
        type: 'processing_fee_success',
        payment_id: transaction.id,
        channel: 'in_app',
        metadata: {
          application_number: applicationId,
          currency: 'USD',
          amount: `${session.amount_total}`,
          cta_url: `/user-dashboard/applications`,
        },
      })
    );
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
    logger.error(error, 'Failed to update transaction by session ID', WEBHOOK_CONTEXT);
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
    logger.error(error, 'Failed to update transaction by payment intent ID', WEBHOOK_CONTEXT);
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

async function updateTermsStageData(applicationId: string, stageDataUpdate: Record<string, any>): Promise<void> {
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const application = await applicationQueryBuilder.findById(applicationId);
  if (!application) return;

  const currentStageData = application.stages_completed?.terms_agreement?.data || {};

  await applicationQueryBuilder.update(applicationId, {
    stages_completed: {
      ...application.stages_completed,
      terms_agreement: {
        ...application.stages_completed?.terms_agreement,
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

    logger.info(`Payment confirmation email sent to: ${user.email}`, WEBHOOK_CONTEXT);
  } catch (error) {
    logger.error(error, 'Failed to send payment confirmation email', WEBHOOK_CONTEXT);
  }
}

async function sendReceiptUrlEmail(userId: string, receiptUrl: string): Promise<void> {
  try {
    const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
    const user = await userQueryBuilder.findById(userId);
    if (!user?.email) return;

    await sendEmail({
      to: user.email,
      subject: 'Your Payment Receipt is Ready - Kletch',
      html: generalPaymentReceipt({
        userName: user.name,
        receiptUrl,
      })
    });
    logger.info(`Receipt URL email sent to: ${user.email}`, WEBHOOK_CONTEXT);
  } catch (error) {
    logger.error(error, 'Failed to send receipt URL email', WEBHOOK_CONTEXT);
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

async function updatePropertyStatus(applicationId: string): Promise<void> {
  const propertyQueryBuilder = new SupabaseQueryBuilder<PropertyBase>("properties");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const application = await applicationQueryBuilder.findById(applicationId);
  if (!application || !application.property_id) return;

  await propertyQueryBuilder.update(application.property_id, {
    status: 'reserved',
    updated_at: new Date().toISOString(),
  });
}

async function handleManualMortgagePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { mortgage_id, user_id, payment_ids, payment_count, payment_numbers } = paymentIntent.metadata;

  logger.info(`Manual mortgage payment succeeded: ${paymentIntent.id}`, {
    ...WEBHOOK_CONTEXT,
    extra: { mortgage_id, payment_ids },
  });

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const mortgage = await mortgageQueryBuilder.findById(mortgage_id);
  if (!mortgage) {
    logger.error(new Error('Mortgage not found'), `Mortgage not found: ${mortgage_id}`, WEBHOOK_CONTEXT);
    return;
  }

  const paymentIdArray = payment_ids.split(',');
  const numPayments = parseInt(payment_count || '1');

  const { error: updateError } = await supabaseAdmin
    .from('mortgage_payments')
    .update({
      status: 'succeeded',
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString(),
    })
    .in('id', paymentIdArray);

  if (updateError) {
    logger.error(updateError, 'Failed to update mortgage payments', WEBHOOK_CONTEXT);
  }

  await supabaseAdmin
    .from('transactions')
    .update({
      status: 'succeeded',
      metadata: {
        completed_at: new Date().toISOString(),
        completed_via: 'webhook',
      },
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  const newPaymentsMade = (mortgage.payments_made || 0) + numPayments;
  const isCompleted = newPaymentsMade >= mortgage.total_payments;

  const { data: nextScheduled } = await supabaseAdmin
    .from('mortgage_payments')
    .select('due_date')
    .eq('mortgage_id', mortgage_id)
    .eq('status', 'scheduled')
    .order('payment_number', { ascending: true })
    .limit(1)
    .single();

  await mortgageQueryBuilder.update(mortgage_id, {
    payments_made: newPaymentsMade,
    last_payment_date_actual: new Date().toISOString(),
    next_payment_date: nextScheduled?.due_date || null,
    status: isCompleted ? 'completed' : 'active',
    completed_at: isCompleted ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  });

  const user = await userQueryBuilder.findById(user_id);
  const application = await applicationQueryBuilder.findById(mortgage.application_id);

  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Payment Successful - ${numPayments > 1 ? `${numPayments} Payments` : 'Mortgage Payment'} - Kletch`,
      html: getPaymentSuccessEmailTemplate({
        userName: user.name || 'Customer',
        amount: paymentIntent.amount,
        paymentNumber: newPaymentsMade,
        numberOfPayments: mortgage.number_of_payments,
        monthlyPayment: mortgage.monthly_payment,
        totalPayments: mortgage.total_payments,
        nextPaymentDate: nextScheduled?.due_date || mortgage.last_payment_date,
        applicationNumber: application?.application_number || '',
      }),
    }).catch(err => logger.error(err, 'Failed to send manual payment success email', WEBHOOK_CONTEXT));

    await createNotification(
      buildNotificationPayload('subscription_payment_success', {
        user_id: user.id,
        application_id: application?.id,
        property_id: application?.property_id,
        payment_id: paymentIntent.id,
        type: 'subscription_payment_success',
        channel: 'in_app',
        metadata: {
          amount: formatUSD({ amount: paymentIntent.amount, fromCents: true }),
          currency: 'USD',
          payment_count: numPayments,
          payment_numbers: payment_numbers,
          cta_url: `/user-dashboard/properties/${mortgage_id}/mortgages`,
          property_name: application?.property_name,
          reference_number: mortgage_id,
        },
      })
    );
  }

  logger.info(`Manual mortgage payment completed: ${numPayments} payment(s) for mortgage ${mortgage_id}`, WEBHOOK_CONTEXT);
}

async function handleManualMortgagePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { mortgage_id, user_id, payment_ids } = paymentIntent.metadata;

  logger.info(`Manual mortgage payment failed: ${paymentIntent.id}`, {
    ...WEBHOOK_CONTEXT,
    extra: { mortgage_id },
  });

  const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

  const paymentIdArray = payment_ids?.split(',') || [];

  const { data: payments } = await supabaseAdmin
    .from('mortgage_payments')
    .select('id, due_date')
    .in('id', paymentIdArray);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const payment of payments || []) {
    const dueDate = new Date(payment.due_date);
    dueDate.setHours(0, 0, 0, 0);
    const isOverdue = dueDate < today;

    await supabaseAdmin
      .from('mortgage_payments')
      .update({
        status: isOverdue ? 'failed' : 'scheduled',
        failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);
  }

  await supabaseAdmin
    .from('transactions')
    .update({
      status: 'failed',
      metadata: {
        failed_at: new Date().toISOString(),
        error: paymentIntent.last_payment_error?.message,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  const mortgage = await mortgageQueryBuilder.findById(mortgage_id);
  if (!mortgage) return;

  const { count: failedCount } = await supabaseAdmin
    .from('mortgage_payments')
    .select('*', { count: 'exact', head: true })
    .eq('mortgage_id', mortgage_id)
    .eq('status', 'failed');

  if (failedCount && failedCount > 0) {
    await mortgageQueryBuilder.update(mortgage_id, {
      status: 'payment_failed',
      updated_at: new Date().toISOString(),
    });
  }

  const user = await userQueryBuilder.findById(user_id);
  const application = await applicationQueryBuilder.findById(mortgage.application_id);

  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: 'Payment Failed - Action Required - Kletch',
      html: getPaymentFailedEmailTemplate({
        userName: user.name || 'Customer',
        amount: paymentIntent.amount,
        failureReason: paymentIntent.last_payment_error?.message || 'Your payment could not be processed',
        retryDate: null,
        applicationNumber: application?.application_number || '',
        updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard/mortgages/${mortgage_id}`,
      }),
    }).catch(err => logger.error(err, 'Failed to send manual payment failure email', WEBHOOK_CONTEXT));

    await createNotification(
      buildNotificationPayload('subscription_payment_failed', {
        user_id: user.id,
        application_id: application?.id,
        property_id: application?.property_id,
        payment_id: paymentIntent.id,
        type: 'subscription_payment_failed',
        channel: 'in_app',
        metadata: {
          amount: formatUSD({ amount: paymentIntent.amount, fromCents: true }),
          currency: 'USD',
          error: paymentIntent.last_payment_error?.message,
          cta_url: `/user-dashboard/properties/${mortgage_id}/mortgages`,
          property_name: application?.property_name,
          reference_number: mortgage_id,
        },
      })
    );
  }

  logger.info(`Manual mortgage payment failed for mortgage ${mortgage_id}`, WEBHOOK_CONTEXT);
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is working',
    timestamp: new Date().toISOString(),
    path: '/api/webhook/stripe'
  });
}