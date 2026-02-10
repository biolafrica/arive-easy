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

    const { application_id, amount, type, seller_id, property_id } = body;

    if (!application_id || !amount || !type || !seller_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'down_payment' && amount < 1000) {
      return NextResponse.json(
        { error: 'Minimum down payment amount not met' },
        { status: 400 }
      );
    }

    const existingTransaction = await transactionBuilder.findOneByCondition({
      application_id,
      user_id: user.id,
      type: `escrow_${type}`,
      status: 'succeeded'
    });

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Escrow payment already completed for this application' },
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
              name: `${type.replace('_', ' ').replace(/\b\w/g, (l:string) => l.toUpperCase())} - Escrow`,
              description: `Secure escrow payment for property purchase`,
              images: property_id ? [`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property_id}/image`] : undefined,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/test/success?session_id={CHECKOUT_SESSION_ID}&type=escrow`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/test/cancelled?type=escrow`,
      metadata: {
        user_id: user.id,
        application_id,
        seller_id,
        property_id,
        payment_type: `escrow_${type}`,
        original_amount: amount.toString(),
        user_email: user.email || '',
      },
      customer_email: user.email,
      payment_intent_data: {
        metadata: {
          escrow_type: type,
          application_id,
          seller_id,
          user_id: user.id,
        }
      }
    });

    const createdTransaction = await transactionBuilder.create({
      user_id: user.id,
      user_name: user.user_metadata.name,
      application_id,
      stripe_session_id: session.id,
      property_id,
      amount: amount * 100,
      currency: 'usd',
      status: 'pending',
      type: `escrow_${type}`,
      developer_id: seller_id,
      metadata: {
        session_url: session.url,
        expires_at: new Date(session.expires_at * 1000).toISOString(),
        property_id,
        escrow_status: 'pending',
        payment_type: type,
      }
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      escrowId: session.id 
    });

  } catch (error) {
    console.error('Escrow session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create escrow payment session' },
      { status: 500 }
    );
  }
}