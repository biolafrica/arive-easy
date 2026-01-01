import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const queryBuilder = new SupabaseQueryBuilder<TransactionBase>("transactions");
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  try {
    if (!sessionId) { 
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 } )
    }

    const transaction = await queryBuilder.findOneByCondition({
      stripe_session_id: sessionId
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' },{ status: 404 } );
    }

    return NextResponse.json({
      status: transaction.status,
      amount: transaction.amount,
      receipt_url: transaction.receipt_url,
      transaction_id: transaction.id,
      payment_date: transaction.created_at
    });
    
  } catch (error) {
    console.error('Error fetching transaction', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
    
  }

}