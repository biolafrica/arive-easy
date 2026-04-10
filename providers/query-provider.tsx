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


const defaultQueryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.error('Query error:', {
        code: error?.error?.code ?? error?.code ?? 'UNKNOWN',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      console.error('Mutation error:', {
        code: error?.error?.code ?? error?.code ?? 'UNKNOWN',
        mutationKey: mutation.options.mutationKey,
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
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
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export { useQueryClient, QueryClient } from '@tanstack/react-query';
export type { QueryClientConfig };

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