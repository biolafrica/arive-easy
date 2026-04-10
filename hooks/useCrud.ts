import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, PaginatedResponse, ApiError } from '../lib/api-client';
import { queryKeys, FilterParams, QueryParams } from '../lib/query-keys';
import { InterfaceType, getCacheConfig, getMutationConfig } from '../lib/cache-config';
import { InfiniteData } from '@tanstack/react-query';

export interface UseCrudConfig<T> {
  resource: string;
  interfaceType?: InterfaceType;
  baseUrl?: string;
  queryKey?: readonly unknown[];
  cacheConfig?: Partial<UseQueryOptions<any, any, any, any>>;
  optimisticUpdate?: boolean;
  invalidateOnMutation?: boolean;
  showNotifications?: boolean;

  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
  };

  transform?: (data: any) => T;
  onSuccess?: {
    create?: (data: T) => void;
    update?: (data: T) => void;
    delete?: (id: string) => void;
  };
  onError?: {
    create?: (error: ApiError) => void;
    update?: (error: ApiError) => void;
    delete?: (error: ApiError) => void;
  };
}

export function useCrud<T extends { id: string }>({
  resource,
  interfaceType = 'client',
  baseUrl,
  queryKey,
  cacheConfig,
  optimisticUpdate = true,
  invalidateOnMutation = true,
  showNotifications = true,
  messages = {},
  transform = (data) => data,
  onSuccess = {},
  onError = {},
}: UseCrudConfig<T>) {
  const queryClient = useQueryClient();
  const endpoint = baseUrl || `/api/${resource}`;

  const defaultCacheConfig = getCacheConfig(interfaceType);
  const mutationConfig = getMutationConfig(interfaceType);
  const finalCacheConfig = { ...defaultCacheConfig, ...cacheConfig };

  const keys = queryKey
    ? {
        all: queryKey,
        lists: () => [...queryKey, 'list'] as const,
        list: (params?: any) => [...queryKey, 'list', params] as const,
        details: () => [...queryKey, 'detail'] as const,
        detail: (id: string, params?: any) => [...queryKey, 'detail', id, params] as const,
        search: (query: string, params?: any) => [...queryKey, 'search', query, params] as const,
      }
    : queryKeys.resource(resource);

  // ─────────────────────────────────────────────────────────────────────────
  // Notification helpers — factory is the single toast source.
  // error() never accepts raw API text; only pre-written user-friendly strings.
  // ─────────────────────────────────────────────────────────────────────────
  const notify = {
    success: (message: string) => {
      if (showNotifications) toast.success(message);
    },
    error: (userMessage: string) => {
      if (showNotifications) toast.error(userMessage);
    },
  };

  const invalidateQueries = async () => {
    if (invalidateOnMutation) {
      await queryClient.invalidateQueries({ queryKey: keys.all });
    }
  };

  // ============ GET ALL ============
  const useGetAll = (params?: FilterParams, enabled = true) => {
    return useQuery<PaginatedResponse<T>, ApiError>({
      queryKey: keys.list(params),
      queryFn: async () => {
        const response = await apiClient.get<PaginatedResponse<T>>(endpoint, params);
        return {
          ...response,
          data: response.data.map(transform),
        };
      },
      enabled,
      ...finalCacheConfig,
    });
  };

  // ============ GET ONE ============
  const useGetOne = (id: string, params?: QueryParams, enabled = true) => {
    return useQuery<T, ApiError>({
      queryKey: keys.detail(id, params),
      queryFn: async () => {
        const response = await apiClient.get<T>(endpoint, { id, ...params });
        return transform(response);
      },
      enabled: enabled && !!id,
      ...finalCacheConfig,
    });
  };

  // ============ CREATE ============
  type CreateContext = { previousItems: PaginatedResponse<T> | undefined };

  const createMutation = useMutation<T, ApiError, Partial<T>, CreateContext>({
    mutationFn: async (data) => {
      const response = await apiClient.post<T>(endpoint, data);
      return transform(response);
    },
    onMutate: async (newItem): Promise<CreateContext> => {
      await queryClient.cancelQueries({ queryKey: keys.all });
      const previousItems = queryClient.getQueryData<PaginatedResponse<T>>(keys.lists());
      if (previousItems && optimisticUpdate) {
        queryClient.setQueryData<PaginatedResponse<T>>(keys.lists(), {
          ...previousItems,
          data: [{ ...newItem, id: `temp-${Date.now()}` } as T, ...previousItems.data],
        });
      }
      return { previousItems };
    },
    onError: (error, _newItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(keys.lists(), context.previousItems);
      }
      notify.error(messages.createError || 'Something went wrong. Please try again.');
      onError.create?.(error);
    },
    onSuccess: (data) => {
      notify.success(messages.createSuccess || 'Created successfully');
      onSuccess.create?.(data);
    },
    onSettled: () => {
      invalidateQueries();
    },
    ...mutationConfig,
  });



  // ============ UPDATE ============
  type UpdateContext = {
    previousList?: PaginatedResponse<T>;
    previousItem?: T;
  };

  const updateMutation = useMutation<T, ApiError, { id: string; data: Partial<T> }, UpdateContext>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put<T>(`${endpoint}?id=${id}`, data);
      return transform(response);
    },
    onMutate: async ({ id, data }): Promise<UpdateContext> => {
      if (!optimisticUpdate) return {};
      await queryClient.cancelQueries({ queryKey: keys.all });
      const previousList = queryClient.getQueryData<PaginatedResponse<T>>(keys.lists());
      const previousItem = queryClient.getQueryData<T>(keys.detail(id, {}));
      if (previousList) {
        queryClient.setQueryData<PaginatedResponse<T>>(keys.lists(), {
          ...previousList,
          data: previousList.data.map(item =>
            item.id === id ? { ...item, ...data } : item
          ),
        });
      }
      if (previousItem) {
        queryClient.setQueryData<T>(keys.detail(id), { ...previousItem, ...data });
      }
      return { previousList, previousItem };
    },
    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(keys.lists(), context.previousList);
      }
      if (context?.previousItem) {
        queryClient.setQueryData(keys.detail(variables.id, {}), context.previousItem);
      }
      notify.error(messages.updateError || 'Failed to save changes. Please try again.');
      onError.update?.(error);
    },
    onSuccess: (data) => {
      notify.success(messages.updateSuccess || 'Changes saved successfully');
      onSuccess.update?.(data);
    },
    onSettled: () => {
      invalidateQueries();
    },
    ...mutationConfig,
  });



  // ============ DELETE ============
  type DeleteContext = {
    previousLists?: [readonly unknown[], any][];
    previousInfinite?: [readonly unknown[], InfiniteData<PaginatedResponse<T>> | undefined][];
  };

  const deleteMutation = useMutation<void, ApiError, string, DeleteContext>({
    mutationFn: async (id) => {
      await apiClient.delete(`${endpoint}?id=${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: keys.all });
      const listEntries = queryClient.getQueriesData({ queryKey: keys.lists() });
      listEntries.forEach(([queryKey, listData]) => {
        if (listData && typeof listData === 'object' && 'pages' in listData) {
          queryClient.setQueryData<InfiniteData<PaginatedResponse<T>>>(queryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.filter((item: any) => item.id !== id),
                pagination: {
                  ...page.pagination,
                  total: Math.max(0, (page.pagination?.total ?? 1) - 1),
                },
              })),
            };
          });
        } else if (listData && (listData as any).data) {
          queryClient.setQueryData<PaginatedResponse<T>>(queryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.filter((item: any) => item.id !== id),
              pagination: {
                ...old.pagination,
                total: Math.max(0, (old.pagination?.total ?? 1) - 1),
              },
            };
          });
        }
      });
      queryClient.removeQueries({
        queryKey: [resource],
        predicate: (query) => query.queryKey.includes(id),
      });
      return { previousLists: listEntries } as DeleteContext;
    },
    onError: (error, _id, context) => {
      context?.previousLists?.forEach(([queryKey, listData]) => {
        if (listData) queryClient.setQueryData(queryKey, listData);
      });
      context?.previousInfinite?.forEach(([queryKey, infiniteData]) => {
        if (infiniteData) queryClient.setQueryData(queryKey, infiniteData);
      });
      notify.error(messages.deleteError || 'Failed to delete. Please try again.');
      onError.delete?.(error);
    },
    onSuccess: (_, id) => {
      notify.success(messages.deleteSuccess || 'Deleted successfully');
      onSuccess.delete?.(id);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists(), refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: [resource, 'infinite'], refetchType: 'active' });
    },
    ...mutationConfig,
  });
  

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: keys.all });
  };

  return {
    useGetAll,
    useGetOne,

    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<T>) => updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    refresh,
  };
}