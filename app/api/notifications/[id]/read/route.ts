import { NotificationBase } from "@/type/pages/dashboard/notification";
import { requireAuth } from "@/utils/server/authMiddleware";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notificationQueryBuilder = new SupabaseQueryBuilder<NotificationBase>('notifications');
    const verifiedNotification = await notificationQueryBuilder.findOneByCondition({
      id: id, 
      user_id: user.id
    });

    if (!verifiedNotification) {
      return NextResponse.json({ error: 'No notification' }, { status: 404 });
    }

    const notification = await notificationQueryBuilder.update(verifiedNotification.id, {
      status: 'read',
      read_at: new Date().toISOString()
    });

    if (!notification) return NextResponse.json({ error: 'No notification' }, { status: 404 });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('notification reading updating error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}