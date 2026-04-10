import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export type InterfaceType = 'client' | 'admin' | 'buyer';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const CACHE_CONFIGS = {
  client: {
    queries: {
      staleTime: 5 * MINUTE,
      cacheTime: 30 * MINUTE,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    // Mutations must never retry. A failed POST/PUT/DELETE that gets a 4xx
    // (conflict, validation, forbidden) would fire again and produce a second
    // request + a second error toast. Only transient network errors are worth
    // retrying, and React Query mutation retry does not distinguish error types.
    mutations: {
      retry: 0,
    },
  },

  admin: {
    queries: {
      staleTime: 0,
      cacheTime: 5 * MINUTE,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 2,
      retryDelay: 1000,
    },
    mutations: {
      retry: 0,
    },
  },

  buyer: {
    queries: {
      staleTime: 1 * MINUTE,
      cacheTime: 10 * MINUTE,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: 0,
    },
  },
} as const;

// ─── Data type overrides (used inside useCrud / useInfiniteList) ──────────────

const DATA_TYPE_CONFIGS = {
  infinite: {
    staleTime: 5 * MINUTE,
    cacheTime: 30 * MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
} as const;

// Helper to get interface-level cache config (used by useCrud / useInfiniteList)
export function getCacheConfig(
  interfaceType: InterfaceType,
  dataType?: keyof typeof DATA_TYPE_CONFIGS
): Partial<UseQueryOptions<any, any, any, any>> {
  const baseConfig = CACHE_CONFIGS[interfaceType].queries;
  if (dataType) {
    return { ...baseConfig, ...DATA_TYPE_CONFIGS[dataType] };
  }
  return baseConfig;
}

// Helper to get mutation config (used by useCrud)
export function getMutationConfig(
  interfaceType: InterfaceType
): Partial<UseMutationOptions<any, any, any, any>> {
  return CACHE_CONFIGS[interfaceType].mutations;
}

// ─── Entity-specific cache configs ───────────────────────────────────────────
//
// Only entries that are referenced by a createEntityHooks call
// (via cacheKey + listSubKey / detailSubKey) or by a direct
// getEntityCacheConfig() call in a hook file are kept here.
//
// Removed entirely: transactions, mortgagePayments (as a top-level key)
// Removed sub-keys:  mortgages.search, preApprovals.statistics/eligibility/byStatus/byProperty,
//                    applications.byStatus/statistics, offers.statistics,
//                    profile.public, analytics.reports, notifications.count (moved inline)

export const ENTITY_CACHE_CONFIGS = {

  properties: {
    list: {
      staleTime: 5 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
    detail: {
      staleTime: 10 * MINUTE,
      cacheTime: 1 * HOUR,
    },
  },

  mortgages: {
    list: {
      staleTime: 5 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
    detail: {
      staleTime: 10 * MINUTE,
      cacheTime: 1 * HOUR,
    },
  },

  articles: {
    list: {
      staleTime: 10 * MINUTE,
      cacheTime: 1 * HOUR,
    },
    detail: {
      staleTime: 30 * MINUTE,
      cacheTime: 2 * HOUR,
    },
  },

  documents: {
    // detailSubKey used by all three document factory instances
    detail: {
      staleTime: 0,
      cacheTime: 2 * MINUTE,
    },
    templates: {
      staleTime: 10 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
    partners: {
      staleTime: 5 * MINUTE,
      cacheTime: 15 * MINUTE,
    },
    transactions: {
      staleTime: 0,
      cacheTime: 5 * MINUTE,
    },
  },

  offers: {
    list: {
      staleTime: 5 * MINUTE,
      cacheTime: 15 * MINUTE,
    },
    // detailSubKey in offerHooks is 'summary'
    summary: {
      staleTime: 10 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
  },

  profile: {
    own: {
      staleTime: 5 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
  },

  users: {
    list: {
      staleTime: 0,
      cacheTime: 5 * MINUTE,
    },
    detail: {
      staleTime: 2 * MINUTE,
      cacheTime: 10 * MINUTE,
    },
  },

  notifications: {
    list: {
      staleTime: 0,
      cacheTime: 5 * MINUTE,
      refetchInterval: 60000,
    },
    count: {
      staleTime: 0,
      cacheTime: 1 * MINUTE,
      refetchInterval: 30000,
    },
  },

  analytics: {
    dashboard: {
      staleTime: 5 * MINUTE,
      cacheTime: 15 * MINUTE,
    },
  },

  preApprovals: {
    list: {
      staleTime: 30 * 1000,
      cacheTime: 5 * MINUTE,
    },
    detail: {
      staleTime: 1 * MINUTE,
      cacheTime: 5 * MINUTE,
    },
  },

  applications: {
    list: {
      staleTime: 30 * 1000,
      cacheTime: 5 * MINUTE,
    },
    detail: {
      staleTime: 1 * MINUTE,
      cacheTime: 5 * MINUTE,
    },
  },

} as const;

export type EntityCacheConfig = typeof ENTITY_CACHE_CONFIGS;

export function getEntityCacheConfig<
  E extends keyof EntityCacheConfig,
  T extends keyof EntityCacheConfig[E]
>(entity: E, type: T): EntityCacheConfig[E][T] {
  return ENTITY_CACHE_CONFIGS[entity][type];
}