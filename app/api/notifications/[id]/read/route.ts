import { requireAuth } from '@/utils/server/authMiddleware';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { NotificationBase } from '@/type/pages/dashboard/notification';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notificationQueryBuilder = new SupabaseQueryBuilder<NotificationBase>('notifications');

    const verifiedNotification = await notificationQueryBuilder.findOneByCondition({
      id: params.id,
      user_id : user.id
    })

    if(!verifiedNotification){
      return NextResponse.json({ error: 'No notification' }, { status: 404 });
    }

    const notification = notificationQueryBuilder.update(verifiedNotification.id, {
      status: 'read', read_at: new Date().toISOString() 
    })

    if (!notification) return NextResponse.json({ error: 'No notification' }, { status: 404 });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error('notification reading updating error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );

    
  }
}