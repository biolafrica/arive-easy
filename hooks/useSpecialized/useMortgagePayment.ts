import { MortgagePayment, MortgagePaymentRPCData } from "@/type/pages/dashboard/mortgage";
import { createEntityHooks } from "./useFactory";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import apiClient from "@/lib/api-client";


const mortgagePaymentHooks = createEntityHooks< 
  MortgagePayment,
  'mortgages',
  'list',
  'detail' 
>({
  resource: 'mortgage-payments',
  cacheKey: 'mortgages',
  listSubKey: 'list',
  detailSubKey: 'detail',
});

export const useMortgagePayments = mortgagePaymentHooks.useList;
export const useMortgagePayment = mortgagePaymentHooks.useDetail;
export const useAdminMortgagePayment = mortgagePaymentHooks.useAdminList

export function useMonthlyMortgagePayments() {
  const { user, loading: isUserLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.analytics.mortgagePayments('monthly'),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: MortgagePaymentRPCData[] }>('/api/mortgage-payments/monthly');
      const result = response?.data ?? response;
      if (!Array.isArray(result)) {
        throw new Error('Unexpected response shape from monthly mortgage payments');
      }
      return result; 
    },
    
    enabled: !!user?.id && !isUserLoading && user?.user_metadata?.role === 'admin',
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false, 
    refetchOnMount: false,
    refetchOnReconnect: false,      
    retry: 3,                   
  });
}