import { Mortgage } from "@/type/pages/dashboard/mortgage";
import { useCrud } from "../useCrud";
import { getEntityCacheConfig } from "@/lib/cache-config";

export function useMortgages(params?: any) {
  const crud = useCrud<Mortgage>({
    resource: 'mortgages',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('mortgages', 'list'),
  });
  
  const { data, isLoading, error } = crud.useGetAll(params);
  
  return {
    mortgages: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function useMortgage(id: string, params?: any) {
  const crud = useCrud<Mortgage>({
    resource: 'mortgages',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('mortgages', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id, params);
  
  return {
    mortgage: data,
    isLoading,
    error,
    ...crud,
  };
}