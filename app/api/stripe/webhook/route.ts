import { ApplicationBase } from '@/type/pages/dashboard/application';
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
  const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");

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
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const isEscrowPayment = session.metadata?.payment_type?.startsWith('escrow_');
        const paymentType = session.metadata?.payment_type;
        
        if (isEscrowPayment) {
          const { data: transaction, error: updateError } = await supabaseAdmin
            .from('transactions')
            .update({
              status: 'succeeded',
              stripe_payment_intent_id: session.payment_intent as string | null,
              payment_method: session.payment_method_types?.[0] || 'card',
              metadata: {
                completed_at: new Date().toISOString(),
                customer_details: session.customer_details,
                escrow_status: 'held', 
              },
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_session_id', session.id)
            .select()
            .single();

          if (updateError) {
            console.error('Failed to update escrow transaction:', updateError);
            break;
          }

          if (session.metadata?.application_id && session.metadata?.payment_type) {
            const paymentType = session.metadata.payment_type.replace('escrow_', '');
            const updateData: any = {};

            if (paymentType === 'down_payment') {
              await applicationQueryBuilder.update(session.metadata.application_id,{
                down_payment_amount: parseInt(session.metadata.original_amount || '0'),
                updated_at: new Date().toISOString(),
              })

              updateData[`${paymentType}_amount`] = parseInt(session.metadata.original_amount || '0');
              updateData[`${paymentType}_status`] = 'escrowed';
              updateData[`${paymentType}_transaction_id`] = transaction.id;
              updateData[`${paymentType}_date`] = new Date().toISOString();
            }

            const application = await applicationQueryBuilder.findById(session.metadata.application_id)

            if (application) {
              const stageData = application.stages_completed?.payment_setup?.data || {};
              const updatedStageData = { ...stageData, ...updateData };

              await applicationQueryBuilder.update(session.metadata.application_id,{
                stages_completed: {
                  ...application.stages_completed,
                  payment_setup: {
                    ...application.stages_completed.payment_setup,
                    status:'current',
                    completed:false,
                    data: updatedStageData,
                  }
                },
                updated_at: new Date().toISOString(),
              })
          
            }
          }

          const user = await queryBuilder.findById(session.metadata?.user_id || '');
          if (user?.email && transaction) {

            try {
              await sendEmail({
                to: user.email,
                subject: 'Escrow Payment Confirmed - Kletch',
                html: paymentReceiptBody({
                  userName: user.name || 'Customer',
                  amount: session.amount_total || 0,
                  currency: session.currency || 'usd',
                  transactionId: transaction.id,
                  receiptUrl: '',
                  applicationId: session.metadata?.application_id || '',
                  paymentDate: new Date().toISOString(),
                  type:"Escrow"
                }),
              });

            } catch (emailError) {
              console.error('Failed to send escrow confirmation email:', emailError);
            }

          }
        }

        if (paymentType === 'legal_fee') {
          console.log("initiated legal fee payment", paymentType)
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

          if (!updateError && session.metadata?.application_id) {

            await applicationQueryBuilder.update(session.metadata.application_id,{
              legal_fee_payment_status: 'paid',
              legal_fee_payment_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            const application =await applicationQueryBuilder.findById(session.metadata.application_id)

            if (application) {
              const stageData = application.stages_completed?.payment_setup?.data || {};
              const updatedStageData = {
                ...stageData,
                legal_fee_status: 'paid',
                legal_fee_transaction_id: transaction?.id,
                legal_fee_date: new Date().toISOString(),
                legal_fee_amount:parseInt(session.metadata.original_amount || '0')

              };

              await applicationQueryBuilder.update(session.metadata.application_id,{
                stages_completed: {
                  ...application.stages_completed,
                  payment_setup: {
                    completed:false,
                    status:'current',
                    ...application.stages_completed?.payment_setup,
                    data: updatedStageData
                  }
                },
              })

            }
          }

          const user = await queryBuilder.findById(session.metadata?.user_id || '');
          if (user?.email && transaction) {

            try {
              await sendEmail({
                to: user.email,
                subject: 'Legal Fee Payment Confirmed - Kletch',
                html: paymentReceiptBody({
                  userName: user.name || 'Customer',
                  amount: session.amount_total || 0,
                  currency: session.currency || 'usd',
                  transactionId: transaction.id,
                  receiptUrl: '',
                  applicationId: session.metadata?.application_id || '',
                  paymentDate: new Date().toISOString(),
                  type:"Legal"
                }),
              });

            } catch (emailError) {
              console.error('Failed to send legal fee confirmation email:', emailError);
            }

          }

        }else if (paymentType === 'valuation_fee') {

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

          if (!updateError && session.metadata?.application_id) {

            await applicationQueryBuilder.update(session.metadata.application_id,{
              valuation_fee_payment_status: 'paid',
              valuation_fee_payment_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            const application = await applicationQueryBuilder.findById(session.metadata.application_id)

            if (application) {
              const stageData = application.stages_completed?.payment_setup?.data || {};
              const updatedStageData = {
                ...stageData,
                valuation_fee_status: 'paid',
                valuation_transaction_id: transaction?.id,
                valuation_fee_date: new Date().toISOString(),
                valuation_fee_amount:parseInt(session.metadata.original_amount || '0')
              };

              await applicationQueryBuilder.update(session.metadata.application_id,{
                stages_completed: {
                  ...application.stages_completed,
                  payment_setup: {
                    completed:false,
                    status:'current',
                    ...application.stages_completed?.payment_setup,
                    data: updatedStageData
                  }
                },
              })

            }
            
            const user = await queryBuilder.findById(session.metadata?.user_id || '');
            if (user?.email && transaction) {

              try {
                await sendEmail({
                  to: user.email,
                  subject: 'Valuation Fee Payment Confirmed - Kletch',
                  html: paymentReceiptBody({
                    userName: user.name || 'Customer',
                    amount: session.amount_total || 0,
                    currency: session.currency || 'usd',
                    transactionId: transaction.id,
                    receiptUrl: '',
                    applicationId: session.metadata?.application_id || '',
                    paymentDate: new Date().toISOString(),
                    type:"Valuation"
                  }),
                });

              } catch (emailError) {
                console.error('Failed to send valuation fee confirmation email:', emailError);
              }

            }

          }
        }else{

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

          if (session.metadata?.application_id) {
            const { error: appUpdateError } = await supabaseAdmin
              .from('applications')
              .update({
                processing_fee_payment_status: 'paid',
                processing_fee_payment_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', session.metadata.application_id);
            
            if (appUpdateError) {
              console.error('Failed to update application:', appUpdateError);
            } else {
              console.log('Application updated successfully');
            }
          }

          const user = await queryBuilder.findById(session.metadata?.user_id || '');
          if (user?.email && transaction) {
            try {
              await sendEmail({
                to: user.email,
                subject: 'Payment Receipt - Kletch',
                html: paymentReceiptBody({
                  userName: user.name || 'Customer',
                  amount: session.amount_total || 10000,
                  currency: session.currency || 'usd',
                  transactionId: transaction.id,
                  receiptUrl: '',
                  applicationId: session.metadata?.application_id || '',
                  paymentDate: new Date().toISOString(),
                  type:"Application Processing"
                }),
              });
              console.log('Receipt email sent to:', user.email);
            } catch (emailError) {
              console.error('Failed to send receipt email:', emailError);
            }
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
            console.log("send receipt to this user", user)

            if (user?.email && charges.data[0].receipt_url) {
              try {
                await sendEmail({
                  to: user.email,
                  subject: 'Your Payment Receipt is Ready - Kletch',
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