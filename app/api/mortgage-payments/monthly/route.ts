import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.app_metadata.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Role' }, { status: 401 });
    }

    const now = new Date();
    const dateParam = now.toISOString().split('T')[0];

    const { data, error } = await supabaseAdmin.rpc('get_monthly_mortgage_payments_with_mortgage', {
      target_date: dateParam
    });

    if (error) throw error;
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
   console.error('Monthly mortgage payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly payments', details: error.message },
      { status: 500 }
    );
  }
}