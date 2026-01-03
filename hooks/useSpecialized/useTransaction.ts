import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { useCrud } from "../useCrud";
import { useAuthContext } from "@/providers/auth-provider";
import { useMemo } from "react";

export function useTransactions(params?: any) {
  const { user } = useAuthContext();

  const crud = useCrud<TransactionBase>({
    resource: 'transactions',
    interfaceType: 'buyer',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });


  const queryParams = useMemo(() => {
    const mergedParams = { ...params };
    if (user?.id) {
      mergedParams.filters = {
        ...mergedParams.filters,
        user_id: user.id,
      };
    }
    
    return mergedParams;
  }, [params, user?.id]);

  const { data, isLoading, error } = crud.useGetAll(queryParams);

  return {
    transactions: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}