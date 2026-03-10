import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { Mortgage } from '@/type/pages/dashboard/mortgage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id: mortgageId } = await params;

    const mortgageQueryBuilder = new SupabaseQueryBuilder<Mortgage>("mortgages");

    const mortgage = await mortgageQueryBuilder.findOneByCondition({
      id: mortgageId,
      user_id: user.id,
    });

    if (!mortgage) {
      return NextResponse.json(
        { error: 'Mortgage not found' }, { status: 404 }
      );
    }

    if (!mortgage.stripe_customer_id) {
      return NextResponse.json(
        { payment_methods: [] }
      );
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: mortgage.stripe_customer_id,
    });

    console.log('Stripe payment methods:', paymentMethods);

    // Also get the customer to find the default payment method
    const customer = await stripe.customers.retrieve(mortgage.stripe_customer_id);
    const defaultPaymentMethodId = 
      typeof customer !== 'string' && !customer.deleted
        ? customer.invoice_settings?.default_payment_method as string
        : null;

    console.log('Stripe customer:', customer);

    // Transform to our format
    const formattedMethods = paymentMethods.data.map(pm => {
      let display = '';
      let last4 = '';
      let brand = '';

      if (pm.type === 'card' && pm.card) {
        brand = pm.card.brand || '';
        last4 = pm.card.last4 || '';
        display = `${brand.toUpperCase()} •••• ${last4}`;
      } else if (pm.type === 'us_bank_account' && pm.us_bank_account) {
        last4 = pm.us_bank_account.last4 || '';
        display = `${pm.us_bank_account.bank_name || 'Bank'} •••• ${last4}`;
      } else if (pm.type === 'acss_debit' && pm.acss_debit) {
        last4 = pm.acss_debit.last4 || '';
        display = `${pm.acss_debit.bank_name || 'Bank'} •••• ${last4}`;
      }

      console.log('Formatted payment method:', { id: pm.id, type: pm.type, display, brand, last4 });

      return {
        id: pm.id,
        type: pm.type as 'card' | 'us_bank_account' | 'acss_debit',
        display,
        brand,
        last4,
        isDefault: pm.id === defaultPaymentMethodId,
      };
    });

    // Sort: default first, then by type
    formattedMethods.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });

    console.log('Final formatted payment methods:', formattedMethods);

    return NextResponse.json({
      payment_methods: formattedMethods,
      default_payment_method_id: defaultPaymentMethodId,
    });

  } catch (error) {
    console.error('Fetch payment methods error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}