import { requireAuth } from '@/utils/server/authMiddleware';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function PUT() {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await supabaseAdmin
      .from('notifications')
      .update({ status: 'read', read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('status', 'unread');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('notification read all error:', error);
    return NextResponse.json(
      { error: 'Failed to read all' },
      { status: 500 }
    );
    
  }
}