'use client';

import React from 'react';
import { 
  QueryClient, 
  QueryClientProvider, 
  QueryClientConfig, 
  MutationCache,
  QueryCache
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';


const defaultQueryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (error: any) => {
      // Handle query errors globally if needed
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      console.error('Mutation error:', error);
      if (error?._skipGlobalErrorHandler) return;
      const message = error?.error?.message || error?.message || 'An error occurred';
      toast.error(message);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000, // v5 renaming
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
};

function makeQueryClient() {
  return new QueryClient(defaultQueryClientConfig);
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Initialize the client
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Re-export core types/hooks
export { useQueryClient, QueryClient } from '@tanstack/react-query';
export type { QueryClientConfig };

/**
 * UTILITIES
 * These should be used inside Client Components.
 * Note: For prefetching on Server Components, use queryClient.prefetchQuery directly.
 */
export const cacheUtils = {
  invalidateQueries: (queryKey: readonly unknown[]) => {
    return getQueryClient().invalidateQueries({ queryKey });
  },
  setQueryData: <T,>(queryKey: readonly unknown[], data: T) => {
    getQueryClient().setQueryData(queryKey, data);
  },
  getQueryData: <T,>(queryKey: readonly unknown[]): T | undefined => {
    return getQueryClient().getQueryData<T>(queryKey);
  },
};
