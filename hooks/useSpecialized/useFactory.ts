import { useMemo } from "react";
import { FilterParams } from "@/lib/query-keys";
import { useAuthContext } from "@/providers/auth-provider";
import type { UseQueryOptions } from '@tanstack/react-query'
import { InterfaceType, getEntityCacheConfig, type EntityCacheConfig} from "@/lib/cache-config";
import { useCrud } from "../useCrud";
import { useInfiniteList } from "../useInfiniteList";


type CacheConfig = Partial<UseQueryOptions<any, any, any, any>>;

interface EntityHookConfig<
  T,
  K extends keyof EntityCacheConfig,
  ListKey extends keyof EntityCacheConfig[K],
  DetailKey extends keyof EntityCacheConfig[K],
> {
  resource: string;
  cacheKey: K;
  listSubKey: ListKey;       
  detailSubKey: DetailKey; 
  buyerInterface?: 'buyer' | 'client';
  ownerField?: string;
  developerField?: string;
  createInterface?: 'buyer' | 'admin' | 'client';

}

export function createEntityHooks<
  T extends { id: string },
  K extends keyof EntityCacheConfig,
  ListKey extends keyof EntityCacheConfig[K],
  DetailKey extends keyof EntityCacheConfig[K],
>(config: EntityHookConfig<T, K, ListKey, DetailKey>
) {
  const {
    resource,
    cacheKey,
    listSubKey,
    detailSubKey,
    buyerInterface = 'client',
    ownerField,
    developerField,
    createInterface
  } = config;

  function useList(params?: any) {
    const crud = useCrud<T>({
      resource,
      interfaceType: buyerInterface,
      cacheConfig: getEntityCacheConfig(cacheKey, listSubKey)   as CacheConfig,
    });

    const { data, isLoading, error } = crud.useGetAll(params);

    return {
      items: data?.data ?? [],
      pagination: data?.pagination,
      isLoading,
      error,
      ...crud,
    };
  }

  function useDetail(id: string, params?: any) {
    const crud = useCrud<T>({
      resource,
      interfaceType: buyerInterface,
      cacheConfig: getEntityCacheConfig(cacheKey, detailSubKey) as CacheConfig,
    });

    const { data, isLoading, error } = crud.useGetOne(id, params);

    return {
      item: data,
      isLoading,
      error,
      ...crud,
    };
  }

  function useInfinite(params?: FilterParams) {
    return useInfiniteList<T>({
      resource,
      interfaceType: buyerInterface,
      params,
      limit: 15,
      autoFetch: true,
    });
  }

  function useOwnerList(params?: any) {
    const { user, loading: isUserLoading } = useAuthContext();

    const crud = useCrud<T>({
      resource,
      interfaceType: 'buyer',
      optimisticUpdate: true,
      invalidateOnMutation: true,
    });

    const queryParams = useMemo(() => {
      if (!user?.id || !ownerField) return null;

      return {
        ...params,
        filters: {
          ...params?.filters,
          [ownerField]: user.id,
        },
      };
    }, [params, user?.id]);

    const { data, isLoading, error } = crud.useGetAll(
      queryParams ?? undefined,
      !isUserLoading && !!user?.id
    );

    return {
      items: data?.data ?? [],
      pagination: data?.pagination,
      isLoading: isLoading || isUserLoading,
      error,
      ...crud,
    };
  }

  function useSellerList(params?: any) {
    const { user, loading: isUserLoading } = useAuthContext();

    const crud = useCrud<T>({
      resource,
      interfaceType: 'buyer',
      optimisticUpdate: true,
      invalidateOnMutation: true,
    });

    const queryParams = useMemo(() => {
      if (!user?.id || !developerField) return null;

      return {
        ...params,
        filters: {
          ...params?.filters,
          [developerField]: user.id,
        },
      };
    }, [params, user?.id]);

    const { data, isLoading, error } = crud.useGetAll(
      queryParams ?? undefined,
      !isUserLoading && !!user?.id
    );

    return {
      items: data?.data ?? [],
      pagination: data?.pagination,
      isLoading: isLoading || isUserLoading,
      error,
      ...crud,
    };
  }

  function useAdminList(params?: any) {
    const crud = useCrud<T>({
      resource,
      interfaceType: 'admin',
      optimisticUpdate: true,
      invalidateOnMutation: true,
    });

    const { data, isLoading, error } = crud.useGetAll(params);

    return {
      items: data?.data ?? [],
      pagination: data?.pagination,
      isLoading,
      error,
      ...crud,
    };
  }

  function useUpdate(options?: {
    interfaceType?: InterfaceType;
    optimisticUpdate?: boolean;
  }) {
    const { update, isUpdating } = useCrud<T>({
      resource,
      interfaceType: options?.interfaceType ?? 'buyer',
      showNotifications: false,
      optimisticUpdate: options?.optimisticUpdate ?? false,
    });

    return { update, isUpdating };
  }

  function useCreate() {
    const { create, isCreating } = useCrud<T>({
      resource,
      interfaceType: config.createInterface ?? 'buyer',
      showNotifications: false,
      optimisticUpdate: false,
    });

    return { create, isCreating };
  }

  return {
    useList,
    useDetail,
    useInfinite,
    useOwnerList,
    useSellerList,
    useAdminList,
    useUpdate,
    useCreate,
  };
}