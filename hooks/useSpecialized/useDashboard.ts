import apiClient from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getEntityCacheConfig } from '@/lib/cache-config';
import { SellerDashboardAnalytics, SellerTransactionAnalytics, UserDashboardAnalytics, UserTransactionAnalytics } from "@/type/pages/dashboard/analytics";


export function useUserDashboardAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.analytics.dashboard('user'),
    queryFn: async () => {
      const response = await apiClient.get<UserDashboardAnalytics>(`/api/analytics/user/dashboard`, {
        userId: user?.id
      });
      
      return response || {
        totalApplications: 1,
        propertiesOwned: 0,
        totalDownPayments: 0
      };
    },
    enabled: !!user?.id && !isUserLoading, 
    ...getEntityCacheConfig('analytics', 'dashboard') 
  });
}

export function useUserTransactionAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.analytics.dashboard('user'),
    queryFn: async () => {
      const response = await apiClient.get<UserTransactionAnalytics>(`/api/analytics/user/transaction`, {
        userId: user?.id
      });
      
      return response || {
        totalEscrow: 0,
        pendingTransactions: 0,
        totalSpent: 0
      };
    },
    enabled: !!user?.id && !isUserLoading, 
    ...getEntityCacheConfig('analytics', 'dashboard') 
  });
}

export function useSellerDashboardAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.analytics.dashboard('seller'),
    queryFn: async () => {
      const response = await apiClient.get<SellerDashboardAnalytics>(`/api/analytics/seller/dashboard`, {
        developerId: user?.id
      });
      return response || {
        totalPendingOffers: 0,
        activeListings: 0,
        escrowTransactionCount: 0,
        totalEscrowBalance: 0
      };
    },
    enabled: !!user?.id && !isUserLoading,
    ...getEntityCacheConfig('analytics', 'dashboard'), 
  });
}

export function useSellerTransactionAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.analytics.dashboard('seller'),
    queryFn: async () => {
      const response = await apiClient.get<SellerTransactionAnalytics>(`/api/analytics/seller/transaction`, {
        developerId: user?.id
      });
      return response || {
        totalEscrow: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
      };
    },
    enabled: !!user?.id && !isUserLoading,
    ...getEntityCacheConfig('analytics', 'dashboard'), 
  });
}