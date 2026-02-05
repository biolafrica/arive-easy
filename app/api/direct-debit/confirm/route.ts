import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { Mortgage } from '@/type/pages/dashboard/mortgage';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { PreApprovalBase } from '@/type/pages/dashboard/approval';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
// import { sendEmail, getDirectDebitConfirmationEmailTemplate } from '@/utils/server/sendEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
    const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
    const preApprovalQueryBuilder = new SupabaseQueryBuilder<PreApprovalBase>("pre_approvals");

    const { application_id, setup_intent_id, payment_method_id } = body;

    if (!application_id || !setup_intent_id || !payment_method_id) {
      return NextResponse.json(
        { error: 'Missing required fields' }, { status: 400 }
      );
    }

    // Verify the SetupIntent
    const setupIntent = await stripe.setupIntents.retrieve(setup_intent_id);
    
    if (setupIntent.status !== 'succeeded' && setupIntent.status !== 'processing') {
      return NextResponse.json(
        { error: `SetupIntent status is ${setupIntent.status}. Expected succeeded or processing.` },
        { status: 400 }
      );
    }

    // Get the mortgage record
    const mortgage = await mortgageQueryBuilder.findOneByCondition({
      application_id: application_id,
    });

    if (!mortgage) {
      return NextResponse.json(
        { error: 'Mortgage record not found' }, { status: 404 }
      );
    }

    // Get application for additional details
    const application = await applicationQueryBuilder.findById(application_id);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' }, { status: 404 }
      );
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(payment_method_id, {
      customer: mortgage.stripe_customer_id,
    });

    // Set as default payment method
    await stripe.customers.update(mortgage.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: payment_method_id,
      },
    });

    // Get payment method details for record
    const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
    const paymentMethodType = paymentMethod.type;
    
    // Determine payment method display name
    let paymentMethodDisplay = '';
    if (paymentMethodType === 'us_bank_account' && paymentMethod.us_bank_account) {
      paymentMethodDisplay = `${paymentMethod.us_bank_account.bank_name} ****${paymentMethod.us_bank_account.last4}`;
    } else if (paymentMethodType === 'acss_debit' && paymentMethod.acss_debit) {
      paymentMethodDisplay = `${paymentMethod.acss_debit.bank_name || 'Bank'} ****${paymentMethod.acss_debit.last4}`;
    } else if (paymentMethodType === 'card' && paymentMethod.card) {
      paymentMethodDisplay = `${paymentMethod.card.brand?.toUpperCase()} ****${paymentMethod.card.last4}`;
    }

    // Determine status based on SetupIntent status
    // For bank debits, 'processing' means async verification is pending
    const isProcessing = setupIntent.status === 'processing';
    const directDebitStatus = isProcessing ? 'pending_verification' : 'active';
    const mortgageStatus = isProcessing ? 'pending_verification' : 'active';

    // Create a Price object for the subscription
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: Math.round(mortgage.monthly_payment * 100), // Convert to cents
      recurring: {
        interval: 'month',
      },
      product_data: {
        name: `Mortgage Payment - ${application?.application_number || application_id}`,
        metadata: {
          application_id: application_id,
          mortgage_id: mortgage.id,
        },
      },
    });

    // Calculate billing cycle anchor for the payment day
    const billingCycleAnchor = calculateBillingCycleAnchor(
      mortgage.first_payment_date,
      mortgage.payment_day_of_month
    );

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: mortgage.stripe_customer_id,
      items: [{ price: price.id }],
      default_payment_method: payment_method_id,
      billing_cycle_anchor: billingCycleAnchor,
      proration_behavior: 'none',
      payment_settings: {
        payment_method_types: [paymentMethodType] as Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[],
        save_default_payment_method: 'on_subscription',
      },
      metadata: {
        application_id: application_id,
        mortgage_id: mortgage.id,
        total_payments: mortgage.total_payments.toString(),
      },
      // Cancel after all payments are made
      cancel_at: mortgage.last_payment_date 
        ? Math.floor(new Date(mortgage.last_payment_date).getTime() / 1000) + (30 * 24 * 60 * 60)
        : undefined,
    });

    // Update mortgage record with subscription details
    const updateMortgage = await mortgageQueryBuilder.update(mortgage.id, {
      stripe_subscription_id: subscription.id,
      stripe_payment_method_id: payment_method_id,
      stripe_price_id: price.id,
      payment_method_type: paymentMethodType || 'card',
      payment_method_display: paymentMethodDisplay,
      status: mortgageStatus,
      activated_at: isProcessing ? undefined : new Date().toISOString(),
      next_payment_date: mortgage.first_payment_date,
      updated_at: new Date().toISOString(),
    });

    if (!updateMortgage) {
      console.error('Failed to update mortgage record');
      // Don't fail the request - subscription is already created
    }

    // Update application status AND stage completion
    await applicationQueryBuilder.update(application_id, {
      direct_debit_status: directDebitStatus,
      current_stage: 'mortgage_activation',
      status: isProcessing ? 'pending_verification' : 'active',
      mortgage_start_date: isProcessing ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stages_completed: {
        ...application.stages_completed,
        mortgage_activation: {
          completed: true, // Stage is completed - user has done their part
          completed_at: new Date().toISOString(),
          status: 'completed',
          data: {
            direct_debit_status: directDebitStatus,
            current_step: 'success',
            mortgage_id: mortgage.id,
            subscription_id: subscription.id,
            payment_method_display: paymentMethodDisplay,
            is_pending_verification: isProcessing,
            // Clear sensitive data
            client_secret: undefined,
            setup_intent_id: undefined,
          }
        }
      }
    });

    // Create initial payment schedule records
    await createPaymentSchedule(supabaseAdmin, mortgage, subscription.id);

    // Send confirmation email
    const preApproval = await preApprovalQueryBuilder.findById(application.pre_approval_id);
    const userEmail = preApproval?.personal_info?.email || user.email;
    const userName = `${preApproval?.personal_info?.first_name} ${preApproval?.personal_info?.last_name}`;

    // Uncomment when email is set up:
    // if (userEmail) {
    //   sendEmail({
    //     to: userEmail,
    //     subject: isProcessing 
    //       ? 'Bank Verification in Progress - Ariveasy'
    //       : 'Automatic Payments Set Up Successfully - Ariveasy',
    //     html: getDirectDebitConfirmationEmailTemplate({
    //       userName,
    //       monthlyPayment: mortgage.monthly_payment,
    //       firstPaymentDate: mortgage.first_payment_date,
    //       paymentDayOfMonth: mortgage.payment_day_of_month,
    //       paymentMethodDisplay,
    //       totalPayments: mortgage.total_payments,
    //       applicationNumber: application?.application_number,
    //       isPendingVerification: isProcessing,
    //     }),
    //   }).catch(err => console.error('Failed to send confirmation email:', err));
    // }

    return NextResponse.json({
      success: true,
      subscription_id: subscription.id,
      mortgage_id: mortgage.id,
      status: mortgageStatus,
      is_pending_verification: isProcessing,
    });

  } catch (error) {
    console.error('Direct debit confirmation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm direct debit setup' },
      { status: 500 }
    );
  }
}

// Helper function to calculate billing cycle anchor
function calculateBillingCycleAnchor(firstPaymentDate: string | null, paymentDayOfMonth: number): number {
  if (firstPaymentDate) {
    return Math.floor(new Date(firstPaymentDate).getTime() / 1000);
  }

  // If no first payment date, use next occurrence of payment day
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth(), paymentDayOfMonth);
  
  // If the day has passed this month, use next month
  if (targetDate <= now) {
    targetDate.setMonth(targetDate.getMonth() + 1);
  }

  return Math.floor(targetDate.getTime() / 1000);
}

// Helper function to create payment schedule records
async function createPaymentSchedule(
  supabaseAdmin: any, 
  mortgage: any, 
  subscriptionId: string
) {
  const payments = [];
  const startDate = new Date(mortgage.first_payment_date);
  
  for (let i = 0; i < mortgage.total_payments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    payments.push({
      mortgage_id: mortgage.id,
      application_id: mortgage.application_id,
      payment_number: i + 1,
      amount: mortgage.monthly_payment,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'scheduled',
      stripe_subscription_id: subscriptionId,
    });
  }

  // Insert in batches of 50
  for (let i = 0; i < payments.length; i += 50) {
    const batch = payments.slice(i, i + 50);
    const { error } = await supabaseAdmin
      .from('mortgage_payments')
      .insert(batch);
    
    if (error) {
      console.error('Failed to create payment schedule batch:', error);
    }
  }
}