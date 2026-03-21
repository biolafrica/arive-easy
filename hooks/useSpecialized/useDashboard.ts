import apiClient from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getEntityCacheConfig } from '@/lib/cache-config';
import * as analytics from "@/type/pages/dashboard/analytics";
import { ADMIN_ANALYTICS_FALLBACK } from "@/data/pages/dashboard/analytics";


export function useUserDashboardAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.analytics.dashboard('user'),
    queryFn: async () => {
      const response = await apiClient.get<analytics.UserDashboardAnalytics>(`/api/analytics/user/dashboard`, {
        userId: user?.id
      });
      
      return response || {
        totalApplications: 0,
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
      const response = await apiClient.get<analytics.UserTransactionAnalytics>(`/api/analytics/user/transaction`, {
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
      const response = await apiClient.get<analytics.SellerDashboardAnalytics>(`/api/analytics/seller/dashboard`, {
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
      const response = await apiClient.get<analytics.SellerTransactionAnalytics>(`/api/analytics/seller/transaction`, {
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

export function useAdminDashboardAnalytics() {
  const { user, loading: isUserLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.analytics.dashboard('admin'),
    queryFn: async () => {
      const response = await apiClient.get<analytics.AdminDashboardAnalytics>(
        '/api/analytics/admin/dashboard'
      );
      return response || ADMIN_ANALYTICS_FALLBACK;
    },
    // change to admin later
    enabled: !!user?.id && !isUserLoading && user?.user_metadata?.role === 'admin',
    ...getEntityCacheConfig('analytics', 'dashboard'),
  });
}