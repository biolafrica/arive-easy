import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useCallback, useMemo } from 'react';
import { apiClient, PaginatedResponse, ApiError } from '../lib/api-client';
import { queryKeys, FilterParams } from '../lib/query-keys';
import { InterfaceType, getCacheConfig } from '../lib/cache-config';

export interface UseInfiniteListConfig<T> {
  resource: string;
  interfaceType?: InterfaceType;
  params?: Omit<FilterParams, 'page' | 'limit'>;
  limit?: number;
  enabled?: boolean;
  transform?: (data: any) => T;
  onSuccess?: (data: InfiniteData<PaginatedResponse<T>>) => void;
  onError?: (error: ApiError) => void;
  cacheConfig?: Partial<UseInfiniteQueryOptions>;
  autoFetch?: boolean;  // Auto fetch next page when scrolling
  threshold?: number;    // Intersection observer threshold
}

export interface UseInfiniteListReturn<T> {
  // Data
  items: T[];
  totalItems: number;
  totalPages: number;
  
  // States
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: ApiError | null;
  
  // Functions
  fetchNextPage: () => void;
  refresh: () => void;
  
  // For intersection observer
  loadMoreRef: (node?: Element | null) => void;
  
  // Utilities
  isItemLoaded: (index: number) => boolean;
  getItemAtIndex: (index: number) => T | undefined;
}

export function useInfiniteList<T>({
  resource,
  interfaceType = 'client',
  params = {},
  limit = 20,
  enabled = true,
  transform = (data) => data,
  onSuccess,
  onError,
  cacheConfig = {},
  autoFetch = false,
  threshold = 0.1,
}: UseInfiniteListConfig<T>): UseInfiniteListReturn<T> {
  // 1. Declare variables before using them in the hook
  const endpoint = `/api/${resource}`;
  const keys = queryKeys.resource(resource);
  const defaultCacheConfig = getCacheConfig(interfaceType, 'infinite');
  const finalCacheConfig = { ...defaultCacheConfig, ...cacheConfig };

  // 2. Sanitize config for TanStack v5 (removes onSuccess/onError from the object)
  const { 
    onSuccess: _s, 
    onError: _e, 
    onSettled: _st, 
    ...v5SafeConfig 
  } = (finalCacheConfig as any);

  // 3. Single useInfiniteQuery instance
  const {data,isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage,
    refetch} = useInfiniteQuery<
    PaginatedResponse<T>, ApiError, InfiniteData<PaginatedResponse<T>>,
    QueryKey,number >({
    queryKey: keys.list({ ...params, limit }),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await apiClient.get<PaginatedResponse<T>>(endpoint, {
        ...params,
        page: pageParam,
        limit,
      });
      return {
        ...response,
        data: response.data.map(transform),
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage 
        ? lastPage.pagination.page + 1 
        : undefined;
    },
    enabled,
    ...v5SafeConfig,
  });

  // 4. Correct Side Effects (v5 Replacement)
  useEffect(() => {
    if (data) onSuccess?.(data);
  }, [data, onSuccess]);

  useEffect(() => {
    if (isError && error) onError?.(error);
  }, [isError, error, onError]);

  // 5. Intersection observer for auto-loading
  const { ref, inView } = useInView({
    threshold,
    rootMargin: '100px',
  });
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && autoFetch) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, autoFetch]);
  
  // 6. Memoized Data Processing
  const items = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);
  
  const totalItems = data?.pages[0]?.pagination.total || 0;
  const totalPages = data?.pages[0]?.pagination.totalPages || 0;
  
  const isItemLoaded = useCallback((index: number) => {
    return index < items.length;
  }, [items.length]);
  
  const getItemAtIndex = useCallback((index: number) => {
    return items[index];
  }, [items]);
  
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  return {
    items,
    totalItems,
    totalPages,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    error: error as ApiError | null,
    fetchNextPage,
    refresh,
    loadMoreRef: ref,
    isItemLoaded,
    getItemAtIndex,
  };
}


// Virtual scrolling hook for large lists
export interface UseVirtualListConfig<T> extends UseInfiniteListConfig<T> {
  itemHeight: number;          // Fixed height of each item
  containerHeight: number;     // Height of the scroll container
  overscan?: number;          // Number of items to render outside visible area
}

// Export for convenience
import { useState } from 'react';
export { useState };