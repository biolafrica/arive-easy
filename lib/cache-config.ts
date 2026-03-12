import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export type InterfaceType = 'client' | 'admin' | 'buyer';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const CACHE_CONFIGS = {
  client: {
    queries: {
      staleTime: 5 * MINUTE,     // Data considered fresh for 5 minutes
      cacheTime: 30 * MINUTE,     // Keep in cache for 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },

  admin: {
    queries: {
      staleTime: 0,               // Always stale, refetch on every access
      cacheTime: 5 * MINUTE,       // Keep in cache for 5 minutes (for back navigation)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 2,
      retryDelay: 1000,
    },
    mutations: {
      retry: 0,                   // No retries for admin actions (avoid duplicates)
    },
  },

  buyer: {
    queries: {
      staleTime: 1 * MINUTE,      // Data considered fresh for 1 minute
      cacheTime: 10 * MINUTE,      // Keep in cache for 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: 1,
    },
  },
} as const;

export const DATA_TYPE_CONFIGS = {
  // Static or rarely changing data
  static: {
    staleTime: 1 * HOUR,
    cacheTime: 2 * HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // User-specific data that changes frequently
  userDynamic: {
    staleTime: 0,
    cacheTime: 5 * MINUTE,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },

  // Lists that update moderately
  list: {
    staleTime: 2 * MINUTE,
    cacheTime: 10 * MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // Real-time or critical data
  realtime: {
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000, // Poll every 30 seconds
  },

  // Search results
  search: {
    staleTime: 5 * MINUTE,
    cacheTime: 15 * MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // Infinite scroll data
  infinite: {
    staleTime: 5 * MINUTE,
    cacheTime: 30 * MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
} as const;

// Helper function to get cache config based on interface and data type
export function getCacheConfig(
  interfaceType: InterfaceType,
  dataType?: keyof typeof DATA_TYPE_CONFIGS
): Partial<UseQueryOptions<any, any, any, any>> {
  const baseConfig = CACHE_CONFIGS[interfaceType].queries;
  
  if (dataType) {
    return {
      ...baseConfig,
      ...DATA_TYPE_CONFIGS[dataType],
    };
  }
  
  return baseConfig;
}

// Helper function to get mutation config
export function getMutationConfig(
  interfaceType: InterfaceType
): Partial<UseMutationOptions<any, any, any, any>> {
  return CACHE_CONFIGS[interfaceType].mutations;
}

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
    search: {
      staleTime: 3 * MINUTE,
      cacheTime: 15 * MINUTE,
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
    search: {
      staleTime: 3 * MINUTE,
      cacheTime: 15 * MINUTE,
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
    list: {
      staleTime: 0,
      cacheTime: 5 * MINUTE,
    },
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

  transactions: {
    list: {
      staleTime: 5 * MINUTE,
      cacheTime: 15 * MINUTE,
    },
    summary: {
      staleTime: 10 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
  },

  mortgagePayments: {
    list: {
      staleTime: 5 * MINUTE,
      cacheTime: 15 * MINUTE,
    },
    summary: {
      staleTime: 10 * MINUTE,
      cacheTime: 30 * MINUTE,
    },
     detail: {
      staleTime: 1 * MINUTE,
      cacheTime: 5 * MINUTE,
    },
  },

  offers: {
    list: {
      staleTime: 5 * MINUTE,
      cacheTime: 15 * MINUTE,
    },
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
    public: {
      staleTime: 10 * MINUTE,
      cacheTime: 1 * HOUR,
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
    reports: {
      staleTime: 30 * MINUTE,
      cacheTime: 2 * HOUR,
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
    statistics: {
      staleTime: 2 * MINUTE,
      cacheTime: 10 * MINUTE,
    },
    eligibility: {
      staleTime: 5 * MINUTE,        
      cacheTime: 15 * MINUTE,
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

// Export type for entity cache configs
export type EntityCacheConfig = typeof ENTITY_CACHE_CONFIGS; 

// Helper to get entity-specific cache config
export function getEntityCacheConfig<
  E extends keyof EntityCacheConfig,
  T extends keyof EntityCacheConfig[E]
>(entity: E, type: T): EntityCacheConfig[E][T] {
  return ENTITY_CACHE_CONFIGS[entity][type];
}