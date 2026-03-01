import { CreateNotificationPayload, NotificationBase } from '@/type/pages/dashboard/notification';
import { SupabaseQueryBuilder } from '../supabase/queryBuilder';

export async function createNotification(
  payload: CreateNotificationPayload
): Promise<NotificationBase | null> {

  const notificationQueryBuilder = new SupabaseQueryBuilder<NotificationBase>("notifications")

  const data = notificationQueryBuilder.create({
    ...payload,
    status: 'unread',
    email_sent: false,
  })

  if (!data) {
    console.error('[createNotification] DB insert failed:');
    return null;
  }

  return data;
}