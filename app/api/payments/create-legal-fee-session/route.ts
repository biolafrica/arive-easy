import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { TransactionBase } from '@/type/pages/dashboard/transactions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const transactionBuilder = new SupabaseQueryBuilder<TransactionBase>("transactions");

    const { application_id, amount, description } = body;
    if (!application_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid legal fee amount' },
        { status: 400 }
      );
    }

    const existingTransaction = await transactionBuilder.findOneByCondition({
      application_id,
      user_id: user.id,
      type: 'legal_fee',
      status: 'succeeded'
    });

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Legal fee already paid for this application' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Legal Processing Fee',
              description: description || 'Legal documentation and processing fee for property purchase',
            },
            unit_amount: amount * 100,
          },
          quantity: 1
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/test/success?session_id={CHECKOUT_SESSION_ID}&type=legal_fee`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/test/cancelled?type=legal_fee`,
      metadata: {
        user_id: user.id,
        application_id,
        payment_type: 'legal_fee',
        original_amount: amount.toString(),
        user_email: user.email || '',
      },
      customer_email: user.email,
      payment_intent_data: {
        metadata: {
          fee_type: 'legal',
          application_id,
          user_id: user.id,
        }
      }
    });

    await transactionBuilder.create({
      user_id: user.id,
      user_name: user.user_metadata.name,
      application_id,
      stripe_session_id: session.id,
      amount: amount * 100, 
      currency: 'usd',
      status: 'pending',
      type: 'legal_fee',
      metadata: {
        session_url: session.url,
        expires_at: new Date(session.expires_at * 1000).toISOString(),
        payment_type: 'legal',
      }
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Legal fee session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create legal fee payment session' },
      { status: 500 }
    );
  }
}