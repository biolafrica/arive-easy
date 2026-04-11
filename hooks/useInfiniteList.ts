import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
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
  cacheConfig?: Partial<UseInfiniteQueryOptions>;
  autoFetch?: boolean;
}

export interface UseInfiniteListReturn<T> {
  items: T[];
  totalItems: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: ApiError | null;
  fetchNextPage: () => void;
  refresh: () => void;
  // Attach to the bottom sentinel element for auto-loading when autoFetch=true
  loadMoreRef: (node?: Element | null) => void;
}

export function useInfiniteList<T>({
  resource,
  interfaceType = 'client',
  params = {},
  limit = 20,
  enabled = true,
  transform = (data) => data,
  cacheConfig = {},
  autoFetch = false,
}: UseInfiniteListConfig<T>): UseInfiniteListReturn<T> {
  const endpoint = `/api/${resource}`;
  const keys = queryKeys.resource(resource);
  const defaultCacheConfig = getCacheConfig(interfaceType, 'infinite');

  const {
    onSuccess: _s,
    onError: _e,
    onSettled: _st,
    ...v5SafeConfig
  } = ({ ...defaultCacheConfig, ...cacheConfig } as any);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<
    PaginatedResponse<T>,
    ApiError,
    InfiniteData<PaginatedResponse<T>>,
    QueryKey,
    number
  >({
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
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    enabled,
    ...v5SafeConfig,
  });

  // Intersection observer — only wires up auto-loading when autoFetch=true
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '100px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && autoFetch) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, autoFetch]);

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalItems = data?.pages[0]?.pagination.total ?? 0;

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    items,
    totalItems,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    error: error as ApiError | null,
    fetchNextPage,
    refresh,
    loadMoreRef: ref,
  };
}