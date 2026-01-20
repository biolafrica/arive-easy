import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { useCrud } from "../useCrud";
import { useAuthContext } from "@/providers/auth-provider";
import { useMemo } from "react";

export function useTransactions(params?: any) {
  const { user, loading: isUserLoading } = useAuthContext();
  
  const crud = useCrud<TransactionBase>({
    resource: 'transactions',
    interfaceType: 'buyer',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });

  const queryParams = useMemo(() => {
    if (!user?.id) return null; 
    
    return {
      ...params,
      filters: {
        ...params?.filters,
        user_id: user.id,
      },
    };
  }, [params, user?.id]);


  const { data, isLoading, error } = crud.useGetAll(
    queryParams || undefined, 
    !isUserLoading && !!user?.id 
  );

  return {
    transactions: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading || isUserLoading,
    error,
    ...crud,
  };
}

export function useAdminTransactions(params?: any) {
  const crud = useCrud<TransactionBase>({
    resource: 'transactions',
    interfaceType: 'admin',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });

  const { data, isLoading, error } = crud.useGetAll(params);

  return {
    transactions: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading,
    error,
    ...crud,
  };
}

