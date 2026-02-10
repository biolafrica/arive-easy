import { NextRequest, NextResponse } from 'next/server';
import { createQueryBuilder } from '@/utils/supabase/queryBuilder';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { Mortgage } from '@/type/pages/dashboard/mortgage';
import { TransactionBase } from '@/type/pages/dashboard/transactions';
import { requireAuth } from '@/utils/server/authMiddleware';

export interface UserDashboardAnalytics {
  totalApplications: number;
  propertiesOwned: number;
  totalTransactions: number;
  totalDownPayments: number;
}


export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },{ status: 400 }
      );
    }

    const applicationsQB = createQueryBuilder<ApplicationBase>('applications');
    const mortgagesQB = createQueryBuilder<Mortgage>('mortgages');
    const transactionsQB = createQueryBuilder<TransactionBase>('transactions');

    const [
      totalApplications,
      propertiesOwned,
      escrowTransactions,
      escrowTransactionsSum
    ] = await Promise.all([
      applicationsQB.countWithConditions({ user_id: userId }),

      mortgagesQB.countWithConditions({ user_id: userId }),

      transactionsQB.countWithConditions({
        user_id: userId,
        type: 'escrow_down_payment',
        status: 'succeeded'
      }),

      transactionsQB.sumWithConditions('amount', {
        user_id: userId,
        type: 'escrow_down_payment',
        status: 'succeeded'
      })
    ]);

    const analytics: UserDashboardAnalytics = {
      totalApplications,
      propertiesOwned,
      totalTransactions: escrowTransactions,
      totalDownPayments: escrowTransactionsSum
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error: any) {
    console.error('User analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}