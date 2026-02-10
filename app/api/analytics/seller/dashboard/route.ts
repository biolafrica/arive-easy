import { NextRequest, NextResponse } from 'next/server';
import { createQueryBuilder } from '@/utils/supabase/queryBuilder';
import { OfferBase } from '@/type/pages/dashboard/offer';
import { PropertyBase } from '@/type/pages/property';
import { TransactionBase } from '@/type/pages/dashboard/transactions';
import { requireAuth } from '@/utils/server/authMiddleware';

export interface SellerDashboardAnalytics {
  totalPendingOffers: number;
  activeListings: number;
  totalEscrowBalance: number;
  escrowTransactionCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (user.user_metadata.role !== 'seller') {
      return NextResponse.json(
        { error: 'Unauthorized Role'},{ status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json(
        { error: 'Developer ID is required' },
        { status: 400 }
      );
    }

    const offersQB = createQueryBuilder<OfferBase>('offers');
    const propertiesQB = createQueryBuilder<PropertyBase>('properties');
    const transactionsQB = createQueryBuilder<TransactionBase>('transactions');

    const [
      totalPendingOffers,
      activeListings,
      escrowTransactionCount,
      totalEscrowBalance
    ] = await Promise.all([
      offersQB.countWithConditions({
        developer_id: developerId,
        status: 'pending'
      }),

      propertiesQB.countWithConditions({
        developer_id: developerId,
        is_active: true
      }),

      transactionsQB.countWithConditions({
        developer_id: developerId,
        type: 'escrow_down_payment',
        status: 'succeeded',
        state: 'holding'
      }),

      transactionsQB.sumWithConditions('amount', {
        developer_id: developerId,
        type: 'escrow_down_payment',
        status: 'succeeded',
        state: 'holding'
      })
    ]);

    const analytics: SellerDashboardAnalytics = {
      totalPendingOffers,
      activeListings,
      totalEscrowBalance,
      escrowTransactionCount
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error: any) {
    console.error('Seller analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}