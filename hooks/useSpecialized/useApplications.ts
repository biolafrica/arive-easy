import { ApplicationBase } from "@/type/pages/dashboard/application";
import { useCrud } from "../useCrud";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import apiClient from "@/lib/api-client";
import { useMemo, useState } from "react";


export function useApplicationStatistics() {
  return useQuery({
    queryKey: queryKeys.applications.statistics(),
    queryFn: async () => {
      const response = await apiClient.get('/api/applications/statistics');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useApplications(params?: any) {
  const [filters, setFilters] = useState({
    status: '',
    current_stage: '',
    search: '',
  });

  const crud = useCrud<ApplicationBase>({
    resource: 'applications',
    interfaceType: 'buyer',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });

  const queryParams = useMemo(() => {
    return { ...params };
  }, [params]);

  const { data, isLoading, error } = crud.useGetAll(queryParams);

  return {
    applications: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    filters,
    setFilters,
    ...crud,
  };
}