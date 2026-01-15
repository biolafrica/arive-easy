import {useQuery,useMutation, useQueryClient,UseQueryOptions} from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, PaginatedResponse, ApiError } from '../lib/api-client';
import { queryKeys, FilterParams, QueryParams } from '../lib/query-keys';
import { InterfaceType, getCacheConfig, getMutationConfig} from '../lib/cache-config';

// Generic CRUD hook configuration
export interface UseCrudConfig<T> {
  resource: string;                    // API endpoint (e.g., 'properties', 'documents')
  interfaceType?: InterfaceType;       // Interface context ('client', 'admin', 'buyer')
  baseUrl?: string;                    // Override base URL if needed
  queryKey?: readonly unknown[];       // Custom query key
  cacheConfig?: Partial<UseQueryOptions<any, any, any, any>>;  // Override cache config
  optimisticUpdate?: boolean;          // Enable optimistic updates
  invalidateOnMutation?: boolean;      // Auto-invalidate queries after mutation
  showNotifications?: boolean;         // Show toast notifications
  transform?: (data: any) => T;        // Transform response data
  onSuccess?: {                        // Success callbacks
    create?: (data: T) => void;
    update?: (data: T) => void;
    delete?: (id: string) => void;
  };
  onError?: {                          // Error callbacks
    create?: (error: ApiError) => void;
    update?: (error: ApiError) => void;
    delete?: (error: ApiError) => void;
  };
}

// Return type for the hook
export interface UseCrudReturn<T> {
  // Query states
  items: T[];
  item: T | undefined;
  pagination?: PaginatedResponse<T>['pagination'];
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  
  // Query functions
  getAll: (params?: FilterParams) => Promise<PaginatedResponse<T>>;
  getOne: (id: string, params?: QueryParams) => Promise<T>;
  search: (query: string, params?: FilterParams) => Promise<PaginatedResponse<T>>;
  
  // Mutation functions
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  
  // Bulk operations
  createMany?: (data: Partial<T>[]) => Promise<T[]>;
  updateMany?: (ids: string[], data: Partial<T>) => Promise<T[]>;
  removeMany?: (ids: string[]) => Promise<void>;
  
  // Utility functions
  refresh: () => void;
  reset: () => void;
  setOptimisticData: (data: T[]) => void;
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
  transform = (data) => data,
  onSuccess = {},
  onError = {},
}: UseCrudConfig<T>) {
  const queryClient = useQueryClient();
  const endpoint = baseUrl || `/api/${resource}`;
  
  // Get cache configuration
  const defaultCacheConfig = getCacheConfig(interfaceType);
  const mutationConfig = getMutationConfig(interfaceType);
  const finalCacheConfig = { ...defaultCacheConfig, ...cacheConfig };
  
  // Generate query keys using the resource factory
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
  
  // Helper function to show notifications
  const notify = {
    success: (message: string) => {
      if (showNotifications) toast.success(message);
    },
    error: (message: string) => {
      if (showNotifications) toast.error(message);
    },
  };
  
  // Invalidation helper
  const invalidateQueries = async () => {
    if (invalidateOnMutation) {
      await queryClient.invalidateQueries({ queryKey: keys.all });
    }
  };

  // ============ GET ALL (All) ============
  const useGetAll = (params?: FilterParams, enabled = true) => {
    return useQuery<PaginatedResponse<T>, ApiError>({
      queryKey: keys.list(params),
      queryFn: async () => {
        const response = await apiClient.get<PaginatedResponse<T>>(endpoint, params);
        return { 
          ...response,
          data: response.data.map(transform)
        };
      },
      enabled, // Add this
      ...finalCacheConfig,
    });
  };

  // ============ GET ONE (Detail) ============
  const useGetOne = (id: string, params?: QueryParams, enabled = true) => {
    return useQuery<T, ApiError>({
      queryKey: keys.detail(id, params),
      queryFn: async () => {
        const response = await apiClient.get<T>(`${endpoint}`, { id, ...params });
        return transform(response);
      },
      enabled: enabled && !!id,
      ...finalCacheConfig,
    });
  };

  // ============ SEARCH ============
  const useSearch = (query: string, params?: FilterParams, enabled = true) => {
    return useQuery<PaginatedResponse<T>, ApiError>({
      queryKey: keys.search(query, params),
      queryFn: async () => {
        const response = await apiClient.get<PaginatedResponse<T>>(endpoint, {
          search: query,
          ...params,
        });
        return {
          ...response,
          data: response.data.map(transform),
        };
      },
      enabled: enabled && !!query,
      ...finalCacheConfig,
    });
  };

  // ============ CREATE ============
  type MyMutationContext = {
    previousItems: PaginatedResponse<T> | undefined;
  };
  const createMutation = useMutation<T, ApiError, Partial<T>, MyMutationContext>({
    mutationFn: async (data) => {
      const response = await apiClient.post<T>(endpoint, data);
      return transform(response);
    },
    onMutate: async (newItem): Promise<MyMutationContext> => {
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: keys.all });
      
      // Snapshot previous value
      const previousItems = queryClient.getQueryData<PaginatedResponse<T>>(keys.lists());
      
      // Optimistically update
      if (previousItems && optimisticUpdate) {
        queryClient.setQueryData<PaginatedResponse<T>>(keys.lists(), {
          ...previousItems,
          data: [{ ...newItem, id: `temp-${Date.now()}` } as T, ...previousItems.data],
        });
      }
      
      return { previousItems };
    },
    onError: (error, newItem, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(keys.lists(), context.previousItems);
      }
      notify.error(error.error?.message || 'Failed to create');
      onError.create?.(error);
    },
    onSuccess: (data) => {
      notify.success('Created successfully');
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
      if (!optimisticUpdate) return {}; // Return empty object to satisfy type
      
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
      // Rollback
      if (context?.previousList) {
        queryClient.setQueryData(keys.lists(), context.previousList);
      }
      if (context?.previousItem) {
        queryClient.setQueryData(keys.detail(variables.id, {}), context.previousItem);
      }
      notify.error(error.error?.message || 'Failed to update');
      onError.update?.(error);
    },
    onSuccess: (data) => {
      notify.success('Updated successfully');
      onSuccess.update?.(data);
    },
    onSettled: () => {
      invalidateQueries();
    },
    ...mutationConfig,
  });

  // ============ DELETE ============
  type DeleteContext = {
    previousList?: PaginatedResponse<T>;
  };

  const deleteMutation = useMutation<void, ApiError, string, DeleteContext>({
    mutationFn: async (id) => {
      await apiClient.delete(`${endpoint}?id=${id}`);
    },
    onMutate: async (id) => {
      if (!optimisticUpdate) return {};
      
      await queryClient.cancelQueries({ queryKey: keys.all });
      const previousList = queryClient.getQueryData<PaginatedResponse<T>>(keys.lists());

      if (previousList) {
        queryClient.setQueryData<PaginatedResponse<T>>(keys.lists(), {
          ...previousList,
          data: previousList.data.filter(item => item.id !== id),
          pagination: {
            ...previousList.pagination,
            total: previousList.pagination.total - 1,
          },
        });
      }
      
      return { previousList };
    },
    
    onError: (error, id, context) => {
      // Rollback
      if (context?.previousList) {
        queryClient.setQueryData(keys.lists(), context.previousList);
      }
      notify.error(error.error?.message || 'Failed to delete');
      onError.delete?.(error);
    },
    onSuccess: (_, id) => {
      notify.success('Deleted successfully');
      // Remove from cache - Fixed: pass empty params object
      queryClient.removeQueries({ queryKey: keys.detail(id, {}) });
      onSuccess.delete?.(id);
    },
    onSettled: () => {
      invalidateQueries();
    },
    ...mutationConfig,
  });

  // ============ BULK CREATE ============
  const createManyMutation = useMutation<T[], ApiError, Partial<T>[]>({
    mutationFn: async (data) => {
      const response = await apiClient.post<T[]>(`${endpoint}/bulk`, { items: data });
      return response.map(transform);
    },
    onSuccess: (data) => {
      notify.success(`Created ${data.length} items successfully`);
      invalidateQueries();
    },
    onError: (error) => {
      notify.error(error.error?.message || 'Failed to create items');
    },
    ...mutationConfig,
  });

  // ============ BULK UPDATE ============
  const updateManyMutation = useMutation<T[], ApiError, { ids: string[]; data: Partial<T> }>({
    mutationFn: async ({ ids, data }) => {
      const response = await apiClient.put<T[]>(`${endpoint}/bulk`, { ids, data });
      return response.map(transform);
    },
    onSuccess: (data) => {
      notify.success(`Updated ${data.length} items successfully`);
      invalidateQueries();
    },
    onError: (error) => {
      notify.error(error.error?.message || 'Failed to update items');
    },
    ...mutationConfig,
  });

  // ============ BULK DELETE ============
  const deleteManyMutation = useMutation<void, ApiError, string[]>({
    mutationFn: async (ids) => {
      await apiClient.delete(`${endpoint}/bulk?ids=${ids.join(',')}`);
    },
    onSuccess: (_, ids) => {
      notify.success(`Deleted ${ids.length} items successfully`);
      invalidateQueries();
    },
    onError: (error) => {
      notify.error(error.error?.message || 'Failed to delete items');
    },
    ...mutationConfig,
  });

  // Utility functions
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: keys.all });
  };

  const reset = () => {
    queryClient.removeQueries({ queryKey: keys.all });
  };

  const setOptimisticData = (data: T[]) => {
    queryClient.setQueryData<PaginatedResponse<T>>(keys.lists(), (old) => ({
      data,
      pagination: old?.pagination || {
        page: 1,
        limit: 10,
        total: data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }));
  };

  return {
    // Query hooks
    useGetAll,
    useGetOne,
    useSearch,
    
    // Mutations
    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<T>) => updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
    
    // Bulk operations
    createMany: createManyMutation.mutateAsync,
    updateMany: (ids: string[], data: Partial<T>) => 
      updateManyMutation.mutateAsync({ ids, data }),
    removeMany: deleteManyMutation.mutateAsync,
    
    // Mutation states - Fixed: React Query v5 uses isPending instead of isLoading
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Utility functions
    refresh,
    reset,
    setOptimisticData,
    
    // Direct access to mutations (for advanced use)
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      createMany: createManyMutation,
      updateMany: updateManyMutation,
      deleteMany: deleteManyMutation,
    },
  };
}