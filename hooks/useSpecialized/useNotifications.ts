'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationBase } from '@/type/pages/dashboard/notification';
import { getEntityCacheConfig } from '@/lib/cache-config';
import { queryKeys } from '@/lib/query-keys';
import apiClient from '@/lib/api-client';
import { createEntityHooks } from './useFactory';

const notificationHooks = createEntityHooks<
  NotificationBase, 
  'notifications', 
  'list', 
  'count'
>({
  resource: 'notifications',
  cacheKey: 'notifications',
  listSubKey: 'list',
  detailSubKey: 'count', 
  ownerField: "user_id"
});

export const useNotifications = notificationHooks.useOwnerList;

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.count(),
    queryFn: async () => {
      const res = await apiClient.get<{ count: number }>('/api/notifications/unread-count');
      return res.count;
    },
    ...getEntityCacheConfig('notifications', 'count'),
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.put(`/api/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.put('/api/notifications/read-all', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}