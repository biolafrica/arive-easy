import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { UserBase } from '@/type/user';
import { requireAuth } from '@/utils/server/authMiddleware';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { PreApprovalBase } from '@/type/pages/dashboard/approval';
import { Mortgage } from '@/type/pages/dashboard/mortgage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
    const preApprovalQueryBuilder = new SupabaseQueryBuilder<PreApprovalBase>("pre_approvals");
    const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");
    const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
    
    const { application_id, user_country } = body;
    if (!application_id) {
      return NextResponse.json(
        { error: 'Application ID is required' }, { status: 400 }
      );
    }

    const application = await applicationQueryBuilder.findOneByCondition({
      id: application_id,
      user_id: user.id,
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' }, { status: 404 }
      );
    }

    if (!application.monthly_payment || !application.approved_loan_amount) {
      return NextResponse.json(
        { error: 'Application is not ready for payment setup. Missing loan terms.' },
        { status: 400 }
      );
    }

    // Check if direct debit is already set up
    const existingMortgage = await mortgageQueryBuilder.findOneByCondition({ 
      application_id: application_id 
    });
   
    if (existingMortgage?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'Direct debit is already set up for this application' }, { status: 400 }
      );
    }

    // Get user and pre-approval data
    const applicationUser = await userQueryBuilder.findById(application.user_id);
    const pre_approvals = await preApprovalQueryBuilder.findById(application.pre_approval_id);
    
    // Get or create Stripe customer
    let stripeCustomerId = applicationUser?.stripe_customer_id;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: pre_approvals?.personal_info?.email || applicationUser?.email,
        name: `${pre_approvals?.personal_info?.first_name} ${pre_approvals?.personal_info?.last_name}`,
        metadata: {
          user_id: user.id,
          application_id: application_id,
        },
      });
      
      stripeCustomerId = customer.id;

      await userQueryBuilder.update(user.id, {
        stripe_customer_id: customer.id,
      });
    }

    // Determine payment method types based on country
    const country = user_country || pre_approvals?.personal_info?.residence_country || 'canada';
    const isCanadian = country === 'CA' || country === 'canada' || country === 'Canada';
    
    let paymentMethodTypes: ('acss_debit' | 'us_bank_account' | 'card')[];
    let paymentMethodOptions: Stripe.SetupIntentCreateParams['payment_method_options'] = {};

    if (!isCanadian) {
      // Canadian Pre-Authorized Debit
      paymentMethodTypes = ['acss_debit', 'card'];
      paymentMethodOptions = {
        acss_debit: {
          mandate_options: {
            payment_schedule: 'interval',
            interval_description: 'Monthly mortgage payment on the agreed date',
            transaction_type: 'personal',
          },
          currency: 'usd', // Transactions in USD as per requirement
        },
      };
    } else {
      // US ACH Direct Debit
      paymentMethodTypes = ['us_bank_account', 'card'];
      paymentMethodOptions = {
        us_bank_account: {
          financial_connections: {
            permissions: ['payment_method', 'balances'],
          },
          verification_method: 'automatic',
        },
      };
    }

    // Create SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: paymentMethodTypes,
      payment_method_options: paymentMethodOptions,
      metadata: {
        application_id: application_id,
        user_id: user.id,
        monthly_amount: application.monthly_payment.toString(),
        country: country,
      },
      usage: 'off_session', // For recurring payments
    });

    // Prepare mortgage data
    const mortgageData = {
      application_id: application_id,
      user_id: user.id,
      
      // Loan details from application
      property_price: application.property_price,
      down_payment_made: application.down_payment_amount,
      approved_loan_amount: application.approved_loan_amount,
      interest_rate_annual: application.interest_rate,
      loan_term_months: application.loan_term_months,
      
      // Payment schedule from bank terms
      monthly_payment: application.monthly_payment,
      total_payments: application.total_payment,
      first_payment_date: application.first_payment_date,
      last_payment_date: application.last_payment_date,
      payment_day_of_month: application.payment_day_of_month,
      
      // Stripe references
      stripe_customer_id: stripeCustomerId,
      stripe_setup_intent_id: setupIntent.id,
      
      // Status - pending until user adds payment method
      status: 'pending_payment_method' as const,
      payments_made: 0,
      
      updated_at: new Date().toISOString(),
    };

    let mortgageId: string;

    if (existingMortgage) {
      // Update existing mortgage record
      const updateMortgage = await mortgageQueryBuilder.update(existingMortgage.id, mortgageData);
      
      if (!updateMortgage) {
        console.error('Failed to update mortgage record');
        throw new Error('Failed to update mortgage record');
      }
      mortgageId = existingMortgage.id;
    } else {
      // Create new mortgage record
      const newMortgage = await mortgageQueryBuilder.create({
        ...mortgageData,
        created_at: new Date().toISOString(),
      });

      if (!newMortgage) {
        console.error('Failed to create mortgage record');
        throw new Error('Failed to create mortgage record');
      }
      mortgageId = newMortgage.id;
    }

    // Update application - stage is NOT completed yet, user still needs to add payment method
    await applicationQueryBuilder.update(application_id, {
      direct_debit_status: 'pending_setup',
      updated_at: new Date().toISOString(),
      stages_completed: {
        ...application.stages_completed,
        mortgage_activation: {
          completed: false, // NOT completed - user still needs to add payment method
          completed_at: undefined,
          status: 'in_progress', // Stage is in progress
          data: {
            direct_debit_status: 'pending_setup',
            current_step: 'payment_method', // User is moving to payment_method step
            mortgage_id: mortgageId,
            setup_intent_id: setupIntent.id,
            client_secret: setupIntent.client_secret,
          }
        }
      },
    });

    return NextResponse.json({
      client_secret: setupIntent.client_secret,
      setup_intent_id: setupIntent.id,
      mortgage_id: mortgageId,
      customer_id: stripeCustomerId,
    });

  } catch (error) {
    console.error('Direct debit initiation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate direct debit setup' },
      { status: 500 }
    );
  }
}