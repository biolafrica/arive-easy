import { MortgagePayment } from "@/type/pages/dashboard/mortgage";
import { useCrud } from "../useCrud";
import { getEntityCacheConfig } from "@/lib/cache-config";

export function useMortgagePayments(params?: any) {
  const crud = useCrud<MortgagePayment>({
    resource: 'mortgage-payments',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('mortgagePayments', 'list'),
  });
  
  const { data, isLoading, error } = crud.useGetAll(params);
  
  return {
    mortgagePayments: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function useMortgagePayment(id: string) {
  const crud = useCrud<MortgagePayment>({
    resource: 'mortgage-payments',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('mortgagePayments', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id);
  
  return {
    mortgagePayment: data,
    isLoading,
    error,
    ...crud,
  };
}