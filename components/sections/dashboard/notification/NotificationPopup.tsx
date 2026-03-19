'use client';

import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { NotificationBase } from '@/type/pages/dashboard/notification';
import { 
  useMarkAllNotificationsAsRead, 
  useMarkNotificationAsRead, 
  useNotifications, 
  useUnreadNotificationCount 
} from '@/hooks/useSpecialized/useNotifications';
import { useRouter } from 'next/navigation';

interface NotificationItemProps{
  notification: NotificationBase;
  onRead: (id: string) => void;
}

function NotificationItem({ notification, onRead}:NotificationItemProps) {
  const isUnread = notification.status === 'unread';
  const router = useRouter()
  const url = notification.metadata.cta_url || ''

  const handleClick = () => {
    if (isUnread) onRead(notification.id);

    if (!url) return;

    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url);
    }
  };


  return (
    <div
      onClick={handleClick}
      className={`flex gap-3 px-4 py-3 cursor-pointer transition hover:bg-muted ${
        isUnread ? 'bg-orange-50/60' : ''
      }`}
    >
      <div className="mt-1.5 flex-shrink-0">
        <span
          className={`block h-2 w-2 rounded-full ${
            isUnread ? 'bg-orange-500' : 'bg-transparent'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isUnread ? 'font-semibold text-heading' : 'font-medium text-heading'}`}>
          {notification.title}
        </p>
        <p className="text-sm text-secondary mt-0.5 leading-snug line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-secondary mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

export function NotificationPopup({ open }: { open: boolean }) {
  const { items:notifications, isLoading } = useNotifications({ limit: 20 });
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsAsRead();

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-xl z-50 overflow-hidden">

      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-heading">Notifications</p>
          {unreadCount > 0 && (
            <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-xs font-semibold text-white leading-none">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={isPending}
            className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
          >
            <CheckIcon className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
        {isLoading ? (
          <div className="flex flex-col gap-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-2 w-2 mt-2 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-secondary">
            <BellIcon className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">You're all caught up</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={markRead} />
          ))
        )}
      </div>
    </div>
  );
}