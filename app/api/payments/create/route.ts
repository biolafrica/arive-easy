import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { paymentService, PaymentType } from '@/utils/server/paymentService';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { application_id, payment_type, amount, seller_id, property_id, description,} = body;

    if (!application_id || !payment_type) {
      return NextResponse.json(
        { error: 'application_id and payment_type are required' }, { status: 400 }
      );
    }

    const validPaymentTypes: PaymentType[] = [
      'processing_fee',
      'legal_fee',
      'valuation_fee',
      'escrow_down_payment',
    ];

    if (!validPaymentTypes.includes(payment_type)) {
      return NextResponse.json(
        { error: 'Invalid payment type' },{ status: 400 }
      );
    }

    const result = await paymentService.createPaymentSession({
      userId: user.id,
      userEmail: user.email || '',
      userName: user.user_metadata?.name || 'Unknown',
      applicationId: application_id,
      paymentType: payment_type,
      amount,
      sellerId: seller_id,
      propertyId: property_id,
      description,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.details }, { status: 400 }
      );
    }

    return NextResponse.json({
      url: result.url,
      sessionId: result.sessionId,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },{ status: 500 }
    );
  }
}