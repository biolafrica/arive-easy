import { UserBase } from '@/type/user';
import { paymentReceiptBody } from '@/utils/email/payment-receipt';
import { sendEmail } from '@/utils/email/send_email';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: "2025-12-15.clover" 
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const queryBuilder = new SupabaseQueryBuilder<UserBase>("users");

  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No signature found in webhook request');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const { data: transaction, error: updateError } = await supabaseAdmin
          .from('transactions')
          .update({
            status: 'succeeded',
            stripe_payment_intent_id: session.payment_intent as string | null,
            payment_method: session.payment_method_types?.[0] || 'card',
            metadata: {
              completed_at: new Date().toISOString(),
              customer_details: session.customer_details,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update transaction' },
            { status: 500 }
          );
        }

        const user = await queryBuilder.findById(session.metadata?.user_id || '');

        if (session.metadata?.application_id) {
          const { error: appUpdateError } = await supabaseAdmin
            .from('applications')
            .update({
              processing_fee_payment_status: 'paid',
              processing_fee_payment_day: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', session.metadata.application_id);
          
          if (appUpdateError) {
            console.error('Failed to update application:', appUpdateError);
          } else {
            console.log('Application updated successfully');
          }
        }

        if (user?.email && transaction) {
          try {
            await sendEmail({
              to: user.email,
              subject: 'Payment Receipt - Ariveasy',
              html: paymentReceiptBody({
                userName: user.name || 'Customer',
                amount: session.amount_total || 10000,
                currency: session.currency || 'usd',
                transactionId: transaction.id,
                receiptUrl: '',
                applicationId: session.metadata?.application_id || '',
                paymentDate: new Date().toISOString(),
              }),
            });
            console.log('Receipt email sent to:', user.email);
          } catch (emailError) {
            console.error('Failed to send receipt email:', emailError);
          }
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        await supabaseAdmin
          .from('transactions')
          .update({
            status: 'cancelled',
            metadata: {
              cancelled_at: new Date().toISOString(),
              reason: 'session_expired',
            },
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id);

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const charges = await stripe.charges.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        if (charges.data.length > 0 && charges.data[0].receipt_url) {
          const { data: transaction } = await supabaseAdmin
            .from('transactions')
            .update({
              receipt_url: charges.data[0].receipt_url,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .select()
            .single();

          if (transaction) {
            const user = await queryBuilder.findById(transaction.user_id);

            if (user?.email && charges.data[0].receipt_url) {
              try {
                await sendEmail({
                  to: user.email,
                  subject: 'Your Payment Receipt is Ready - Ariveasy',
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <h2 style="color: #4F46E5;">Your Receipt is Ready!</h2>
                      <p>Dear ${user.name || 'Customer'},</p>
                      <p>Your official Stripe receipt for the application processing fee is now available.</p>
                      <div style="margin: 30px 0;">
                        <a href="${charges.data[0].receipt_url}" 
                           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
                          Download Receipt PDF
                        </a>
                      </div>
                      <p style="color: #6b7280; font-size: 14px;">
                        This receipt serves as your official payment confirmation. Please save it for your records.
                      </p>
                    </div>
                  `,
                });
                console.log('✅ Receipt URL email sent to:', user.email);
              } catch (emailError) {
                console.error('❌ Failed to send receipt URL email:', emailError);
              }
            }
          }
        }
        
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await supabaseAdmin
          .from('transactions')
          .update({
            status: 'failed',
            metadata: {
              failed_at: new Date().toISOString(),
              error: paymentIntent.last_payment_error,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}