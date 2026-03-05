
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { Mortgage, MortgagePayment } from '@/type/pages/dashboard/mortgage';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { TransactionBase } from '@/type/pages/dashboard/transactions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

interface RouteParams {
  params: Promise<{ id: string }>;
}


export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id: mortgageId } = await params;
    const body = await request.json();

    const { payment_ids } = body;

    if (!payment_ids || !Array.isArray(payment_ids) || payment_ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one payment must be selected' },
        { status: 400 }
      );
    }

    const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
    const transactionQueryBuilder = new SupabaseQueryBuilder<TransactionBase>("transactions");
    const mortgagePayment = new SupabaseQueryBuilder<MortgagePayment>("mortgage_payments");

    const mortgage = await mortgageQueryBuilder.findOneByCondition({
      id: mortgageId,
      user_id: user.id,
    });

    if (!mortgage) {
      return NextResponse.json(
        { error: 'Mortgage not found' }, { status: 404 }
      );
    }

    if (!['active', 'payment_failed'].includes(mortgage.status)) {
      return NextResponse.json(
        { error: `Cannot make payment on mortgage with status: ${mortgage.status}` },{ status: 400 }
      );
    }

    console.log('Fetching selected payments with IDs:', payment_ids);

    const { data: selectedPayments, error: paymentsError } = await supabaseAdmin
    .from('mortgage_payments')
    .select('*')
    .eq('mortgage_id', mortgageId)
    .in('id', payment_ids)
    .in('status', ['failed', 'scheduled'])
    .order('payment_number', { ascending: true });

    if (paymentsError || !selectedPayments || selectedPayments.length === 0) {
      return NextResponse.json(
        { error: 'No valid payments found for the selected IDs' },{ status: 404 }
      );
    }

    const totalAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
    const amountInCents = Math.round(totalAmount * 100);

    const paymentNumbers = selectedPayments.map(p => `#${p.payment_number}`).join(', ');
    const description = selectedPayments.length === 1
    ? `Mortgage Payment #${selectedPayments[0].payment_number}`
    : `Mortgage Payments ${paymentNumbers}`;


    const paymentMethodType = mortgage.payment_method_type || 'card';
    
    const paymentMethodTypes: string[] = [];
    
    if (paymentMethodType === 'us_bank_account' || paymentMethodType === 'acss_debit') {
      paymentMethodTypes.push('us_bank_account');
      paymentMethodTypes.push('acss_debit');
    }

    paymentMethodTypes.push('card');
    paymentMethodTypes.push('link');

    console.log('Payment method types for PaymentIntent:', paymentMethodTypes);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: mortgage.stripe_customer_id,
      payment_method: mortgage.stripe_payment_method_id,
      payment_method_types: paymentMethodTypes as Stripe.PaymentIntentCreateParams['payment_method_types'],
      description,
      metadata: {
        mortgage_id: mortgageId,
        user_id: user.id,
        payment_ids: payment_ids.join(','),
        payment_count: selectedPayments.length.toString(),
        payment_numbers: paymentNumbers,
      },
      ...(paymentMethodType === 'us_bank_account' && {
        payment_method_options: {
          us_bank_account: {
            financial_connections: {
              permissions: ['payment_method'],
            },
          },
        },
        mandate_data: {
          customer_acceptance: {
            type: 'online',
            online: {
              ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
              user_agent: request.headers.get('user-agent') || 'Unknown',
            },
          },
        },
      }),
      ...(paymentMethodType === 'acss_debit' && {
        payment_method_options: {
          acss_debit: {
            mandate_options: {
              payment_schedule: 'sporadic',
              transaction_type: 'personal',
            },
          },
        },
      }),
    });

    const transaction = await transactionQueryBuilder.create({
      user_id: user.id,
      application_id: mortgage.application_id,
      mortgage_id: mortgageId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: totalAmount * 100,
      currency: 'usd',
      status: 'pending',
      type: 'mortgage_payment',
      description,
      metadata: {
        payment_ids,
        payment_numbers: selectedPayments.map(p => p.payment_number),
        initiated_at: new Date().toISOString(),
        payment_type:'mortgage_payment',
        session_url: null,
        expires_at:""
      },
    })


    if (!transaction) {console.error('Failed to create transaction:')}

    await mortgagePayment.updateMany(payment_ids, {
      status: 'processing',
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: totalAmount,
      transaction_id: transaction?.id,
      payments: selectedPayments.map(p => ({
        id: p.id,
        payment_number: p.payment_number,
        amount: p.amount,
        due_date: p.due_date,
      })),
    });

  } catch (error) {
    console.error('Make payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    );
  }
}


export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id: mortgageId } = await params;
    const body = await request.json();

    const { payment_intent_id, payment_ids } = body;

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: 'payment_intent_id is required' },{ status: 400 }
      );
    }


    const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
    const mortgagePayment = new SupabaseQueryBuilder<MortgagePayment>("mortgage_payments");

    const mortgage = await mortgageQueryBuilder.findOneByCondition({
      id: mortgageId,
      user_id: user.id,
    });

    if (!mortgage) {
      return NextResponse.json(
        { error: 'Mortgage not found' },{ status: 404 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {

      if (['canceled', 'payment_failed'].includes(paymentIntent.status)) {
        const originalPaymentIds = paymentIntent.metadata.payment_ids?.split(',') || payment_ids || [];
        
        console.log('Payment failed or canceled. Reverting payment statuses for IDs:', originalPaymentIds);

        const { data: payments } = await supabaseAdmin
        .from('mortgage_payments')
        .select('id, due_date')
        .in('id', originalPaymentIds);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const payment of payments || []) {
          const dueDate = new Date(payment.due_date);
          dueDate.setHours(0, 0, 0, 0);
          const isOverdue = dueDate < today;
           
          await mortgagePayment.update(payment.id, {
            status: isOverdue ? 'failed' : 'scheduled',
            updated_at: new Date().toISOString(),
          })

        }

        console.log('Payment statuses reverted successfully for PaymentIntent ID:', payment_intent_id);
      }

      return NextResponse.json(
        { error: `Payment not successful. Status: ${paymentIntent.status}` },{ status: 400 }
      );
    }

    const paidPaymentIds = paymentIntent.metadata.payment_ids?.split(',') || payment_ids || [];
    const paymentCount = parseInt(paymentIntent.metadata.payment_count || '1');

    console.log('Payment succeeded. Updating records for payment IDs:', paidPaymentIds);

    await mortgagePayment.updateMany(paidPaymentIds, {
      status: 'succeeded',
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: payment_intent_id,
      updated_at: new Date().toISOString(),
    })

    await supabaseAdmin
    .from('transactions')
    .update({
      status: 'succeeded',
      metadata: {
        completed_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', payment_intent_id);

    const newPaymentsMade = (mortgage.payments_made || 0) + paymentCount;
    const isCompleted = newPaymentsMade >= mortgage.total_payments;

    console.log('Updating mortgage record. New payments made:', newPaymentsMade, 'Is mortgage completed?', isCompleted);

    const { data: nextScheduled } = await supabaseAdmin
    .from('mortgage_payments')
    .select('due_date')
    .eq('mortgage_id', mortgageId)
    .eq('status', 'scheduled')
    .order('payment_number', { ascending: true })
    .limit(1)
    .single();

    console.log('Next scheduled payment after update:', nextScheduled);

    await mortgageQueryBuilder.update(mortgageId, {
      payments_made: newPaymentsMade,
      last_payment_date_actual: new Date().toISOString(),
      next_payment_date: nextScheduled?.due_date || null,
      status: isCompleted ? 'completed' : 'active',
      completed_at: isCompleted ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      payments_completed: paymentCount,
      new_total_paid: newPaymentsMade,
      is_mortgage_completed: isCompleted,
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}