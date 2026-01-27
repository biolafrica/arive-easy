import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { requireAuth } from "@/utils/server/authMiddleware";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request:NextRequest){

  try {
    const user = await requireAuth();
    const queryBuilder = new SupabaseQueryBuilder<TransactionBase>("transactions");

    const body = await request.json()
    const {application_id} = body;

    const existingTransaction = await queryBuilder.findOneByCondition({
      application_id:application_id, 
      user_id: user.id, 
      type:"processing fee",
      status : "succeeded",
    })

    if (existingTransaction) {
      return NextResponse.json({ error: 'Payment already processed for this application' }, { status: 400 } );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[
        {
          price_data:{
            currency:'usd',
            product_data:{
              name: "Application Processing Fee",
              description:"One-time processing fee for application verification"
            },
            unit_amount:10000,
          },
          quantity:1
        },
      ],
      mode:'payment',
      success_url:`${process.env.NEXT_PUBLIC_API_URL}/test/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${process.env.NEXT_PUBLIC_API_URL}/test/cancelled`,
      metadata:{
        user_id: user.id,
        application_id:application_id,
        user_email:user.email || '',
      },
      customer_email:user.email
    })

    await queryBuilder.create({
      user_id:user.id,
      user_name:user.user_metadata.name,
      application_id: application_id,
      stripe_session_id: session.id,
      amount:10000,
      currency:'usd',
      status:"pending",
      type:"processing fee",
      metadata:{
        session_url: session.url,
        expires_at: new Date(session.expires_at * 1000).toISOString(),
      }
    })

    return NextResponse.json({
      url:session.url,
      sessionId: session.id
    })
        
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json( { error: 'Failed to create payment session' },{ status: 500 });
    
  }
}