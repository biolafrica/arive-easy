import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { count } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'unread');

    return NextResponse.json({ count: count ?? 0 });

  } catch (error) {
    console.error('notification unread-count error:', error);
    return NextResponse.json(
      { error: 'Failed to uread count' },
      { status: 500 }
    );
    
  }
}