import apiClient from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getEntityCacheConfig } from '@/lib/cache-config';


export function useUserDashboardAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.analytics.dashboard('user'),
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/user/dashboard`, {
        userId: user?.id
      });
      return response;
    },
    enabled: !!user?.id && !isUserLoading, 
    ...getEntityCacheConfig('analytics', 'dashboard'), 
  });
}

export function useSellerDashboardAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.analytics.dashboard('seller'),
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/seller/dashboard`, {
        developerId: user?.id
      });
      return response;
    },
    enabled: !!user?.id && !isUserLoading,
    ...getEntityCacheConfig('analytics', 'dashboard'), 
  });
}