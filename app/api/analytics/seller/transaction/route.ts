import { NextRequest, NextResponse } from 'next/server';
import { createQueryBuilder } from '@/utils/supabase/queryBuilder';
import { SellerTransactionAnalytics } from '@/type/pages/dashboard/analytics';
import { requireAuth } from '@/utils/server/authMiddleware';


export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (user.user_metadata.role !== 'seller') {
      return NextResponse.json(
        { error: 'Unauthorized Role'},{ status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }

    const transactionsQB = createQueryBuilder('transactions');

    const [
      totalEscrow,
      totalRevenue,
      pendingRevenue
    ] = await Promise.all([
      transactionsQB.sumWithConditions('amount', {
        seller_id: sellerId,
        type: 'escrow_down_payment',
        status: 'succeeded',
        state: 'holding'
      }),
      
      transactionsQB.sumWithConditions('amount', {
        seller_id: sellerId,
        status: 'succeeded'
      }),
      
      transactionsQB.sumWithConditions('amount', {
        seller_id: sellerId,
        status: 'pending'
      })
    ]);

    const analytics: SellerTransactionAnalytics = {
      totalEscrow, 
      totalRevenue, 
      pendingRevenue
    }

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error: any) {
    console.error('Seller transaction analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction analytics' },{ status: 500 }
    );
  }
}