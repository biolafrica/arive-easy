
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

    const { payment_ids, payment_method_id } = body;

    if (!payment_ids || !Array.isArray(payment_ids) || payment_ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one payment must be selected' }, { status: 400 }
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
        { error: 'Mortgage is not in a valid state for manual payment' },{ status: 400 }
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
    const totalAmountCents = Math.round(totalAmount * 100);

    console.log('Total amount for selected payments:', totalAmount);

    const paymentNumbers = selectedPayments.map(p => `#${p.payment_number}`).join(', ');
    const description = selectedPayments.length === 1
    ? `Mortgage Payment #${selectedPayments[0].payment_number}`
    : `Mortgage Payments ${paymentNumbers}`;

    console.log('Creating PaymentIntent with description:', description);


    const paymentMethodType = mortgage.payment_method_type || 'card';
    const paymentMethodTypes: string[] = [];
    
    if (paymentMethodType === 'us_bank_account' || paymentMethodType === 'acss_debit') {
      paymentMethodTypes.push('acss_debit');
    }
    paymentMethodTypes.push('card');
    paymentMethodTypes.push('link');

    console.log('Payment method types for PaymentIntent:', paymentMethodTypes);

    const paymentIntentParams:Stripe.PaymentIntentCreateParams = {
      amount: totalAmountCents,
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
        payment_type: 'manual_mortgage_payment',
      },
    };

    console.log('Initial PaymentIntent parameters:', paymentIntentParams);

    if(payment_method_id){
      paymentIntentParams.payment_method = payment_method_id;
      paymentIntentParams.confirm = true;
      paymentIntentParams.off_session = false;
      paymentIntentParams.return_url = `https://www.usekletch.com/user-dashboard/properties/${mortgageId}/mortgages`;

      const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);

      if (paymentMethod.type === 'us_bank_account') {
        paymentIntentParams.payment_method_options = {
          us_bank_account: {
            financial_connections: {
              permissions: ['payment_method'],
            },
          },
        };
        paymentIntentParams.mandate_data = {
          customer_acceptance: {
            type: 'online',
            online: {
              ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
              user_agent: request.headers.get('user-agent') || 'unknown',
            },
          },
        };
      } else if (paymentMethod.type === 'acss_debit') {
        paymentIntentParams.payment_method_options = {
          acss_debit: {
            mandate_options: {
              payment_schedule: 'sporadic',
              transaction_type: 'personal',
            },
          },
        };
      }

    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    const updateMortgagePayment = await mortgagePayment.updateMany(payment_ids, {
      status: 'processing',
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString(),
    })
    if (!updateMortgagePayment) {console.error('Failed to update mortgage payments with processing status:')}

    console.log('Created PaymentIntent:', paymentIntent);



    const transaction = await transactionQueryBuilder.create({
      user_id: user.id,
      application_id: mortgage.application_id,
      mortgage_id: mortgageId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: totalAmount,
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


    if (payment_method_id) {
      console.log('Confirming PaymentIntent immediately with payment method:', payment_method_id);

      return NextResponse.json({
        payment_intent_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        requires_action: paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation',
        transaction_id: transaction?.id,
        amount: totalAmount,
        payments: selectedPayments.map(p => ({
          id: p.id,
          payment_number: p.payment_number,
          amount: p.amount,
          due_date: p.due_date,
        })),
      });
    }

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
    console.error('Create manual payment error:', error);
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

    console.log('Confirming payment for PaymentIntent ID:', payment_intent_id, 'with payment IDs:', payment_ids);

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

    console.log('Retrieved PaymentIntent:', paymentIntent);

    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
      const paymentIdsArray = Array.isArray(payment_ids) ? payment_ids : payment_ids.split(',');

      console.log('Updating mortgage payments to succeeded status for payment IDs:', paymentIdsArray);

      const updatePayments =  await mortgagePayment.updateMany(paymentIdsArray, {
        status: 'succeeded',
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: payment_intent_id,
        updated_at: new Date().toISOString(),
      })

      if (!updatePayments) {
        console.error('Failed to update mortgage payments to succeeded status for PaymentIntent ID:', payment_intent_id)
        throw new Error('Failed to update payment records')
      }

      const newPaymentsMade = (mortgage.payments_made || 0) + paymentIdsArray.length;
      const totalPayments = mortgage.number_of_payments || mortgage.total_payments;
      const isCompleted = newPaymentsMade >= totalPayments;

      console.log(`Updated payments to succeeded. New payments made: ${newPaymentsMade}. Mortgage completed: ${isCompleted}`);

      // Get next scheduled payment date
      const { data: nextPayment } = await supabaseAdmin
      .from('mortgage_payments')
      .select('due_date')
      .eq('mortgage_id', mortgageId)
      .eq('status', 'scheduled')
      .order('payment_number', { ascending: true })
      .limit(1)
      .single();

      await mortgageQueryBuilder.update(mortgageId, {
        payments_made: newPaymentsMade,
        status: isCompleted ? 'completed' : 'active',
        next_payment_date: nextPayment?.due_date || null,
        completed_at: isCompleted ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      });

      const { error: transactionError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', payment_intent_id);

      if (transactionError) {
        console.error('Failed to update transaction:', transactionError);
      }

      return NextResponse.json({
        success: true,
        payments_completed: paymentIdsArray.length,
        new_total_paid: newPaymentsMade,
        is_mortgage_completed: isCompleted,
        next_payment_date: nextPayment?.due_date || null,
      });

    }

    if (['requires_payment_method', 'canceled', 'requires_action'].includes(paymentIntent.status)) {
      const paymentIdsArray = Array.isArray(payment_ids) ? payment_ids : payment_ids.split(',');

      console.log('Payment failed or requires action. Reverting payments for payment IDs:', paymentIdsArray);

      // Get payment details to determine if they were overdue
      const { data: paymentsToRevert } = await supabaseAdmin
      .from('mortgage_payments')
      .select('id, due_date')
      .in('id', paymentIdsArray);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Revert each payment
      for (const payment of paymentsToRevert || []) {
        const dueDate = new Date(payment.due_date);
        dueDate.setHours(0, 0, 0, 0);
        const isOverdue = dueDate < today;

        console.log(`Reverting payment ID: ${payment.id}. Due date: ${payment.due_date}. Is overdue: ${isOverdue}`);

        await mortgagePayment.update(payment.id, {
          status: isOverdue ? 'failed' : 'scheduled',
          failure_reason: paymentIntent.last_payment_error?.message || 'Payment was not completed',
          updated_at: new Date().toISOString(),
        })
      }

      await supabaseAdmin
      .from('transactions')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', payment_intent_id);

      return NextResponse.json({
        success: false,
        error: paymentIntent.last_payment_error?.message || 'Payment was not completed',
        status: paymentIntent.status,
      });
    }

    return NextResponse.json(
      { error: `Unexpected payment status: ${paymentIntent.status}` },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}