'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCrud } from '@/hooks/useCrud';
import { NotificationBase } from '@/type/pages/dashboard/notification';
import { getEntityCacheConfig } from '@/lib/cache-config';
import { queryKeys } from '@/lib/query-keys';
import apiClient from '@/lib/api-client';

export function useNotifications(params?: Record<string, unknown>) {
  const crud = useCrud<NotificationBase>({
    resource: 'notifications',
    interfaceType: 'buyer',
    cacheConfig: getEntityCacheConfig('notifications', 'list'),
    showNotifications: false,
  });

  const { data, isLoading, error } = crud.useGetAll(params);

  return {
    notifications: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

// ── Unread count (polls every 30s) ──────────────────────────────
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