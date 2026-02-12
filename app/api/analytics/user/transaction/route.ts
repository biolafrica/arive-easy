import { NextRequest, NextResponse } from 'next/server';
import { createQueryBuilder } from '@/utils/supabase/queryBuilder';
import { UserTransactionAnalytics } from '@/type/pages/dashboard/analytics';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const transactionsQB = createQueryBuilder('transactions');

    const [
      totalEscrow,
      pendingTransactions,
      totalSpent
    ] = await Promise.all([
      transactionsQB.sumWithConditions('amount', {
        user_id: userId,
        type: 'escrow_down_payment',
        status: 'succeeded',
        state: 'holding'
      }),
      
      transactionsQB.countWithConditions({
        user_id: userId,
        status: 'pending'
      }),
      
      transactionsQB.sumWithConditions('amount', {
        user_id: userId,
        status: 'succeeded'
      })
    ]);

    const analytics: UserTransactionAnalytics = { 
      totalEscrow,
      pendingTransactions,
      totalSpent
    }

    return NextResponse.json({
      success: true,
      data:analytics
    });

  } catch (error: any) {
    console.error('User transaction analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction analytics' },
      { status: 500 }
    );
  }
}