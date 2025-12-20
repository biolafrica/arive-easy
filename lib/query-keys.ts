import { QueryKey } from "@tanstack/react-query";

// Base factory type
export interface QueryKeyFactory<TKeys extends Record<string, QueryKey>> {
  _def: TKeys;
  keys: () => TKeys[keyof TKeys];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  searchFields?: string[];
}

export interface FilterParams extends SearchParams {
  filters?: Record<string, any>;
  include?: string[];  // For joins/relations
}

export interface QueryParams extends FilterParams {
  select?: string[];
  [key: string]: any;
}

export const queryKeys = {
  // Base keys for each resource
  all: ['queries'] as const,

  // Properties (for client interface)
  properties: {
    all: ['properties'] as const,
    lists: () => [...queryKeys.properties.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.properties.lists(), params] as const,
    details: () => [...queryKeys.properties.all, 'detail'] as const,
    detail: (id: string, params?: QueryParams) => 
      [...queryKeys.properties.details(), id, params] as const,
    infinite: (params?: FilterParams) =>
      [...queryKeys.properties.all, 'infinite', params] as const,
    search: (query: string, params?: SearchParams) =>
      [...queryKeys.properties.all, 'search', query, params] as const,
    featured: () => [...queryKeys.properties.all, 'featured'] as const,
    byAgent: (agentId: string, params?: FilterParams) =>
      [...queryKeys.properties.all, 'by-agent', agentId, params] as const,
    similar: (id: string, limit?: number) =>
      [...queryKeys.properties.all, 'similar', id, { limit }] as const,
  },

  // Articles/Blog posts
  articles: {
    all: ['articles'] as const,
    lists: () => [...queryKeys.articles.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.articles.lists(), params] as const,
    details: () => [...queryKeys.articles.all, 'detail'] as const,
    detail: (slug: string) => 
      [...queryKeys.articles.details(), slug] as const,
    byCategory: (category: string, params?: PaginationParams) =>
      [...queryKeys.articles.all, 'by-category', category, params] as const,
    byAuthor: (authorId: string, params?: PaginationParams) =>
      [...queryKeys.articles.all, 'by-author', authorId, params] as const,
    trending: (limit?: number) =>
      [...queryKeys.articles.all, 'trending', { limit }] as const,
    related: (id: string, limit?: number) =>
      [...queryKeys.articles.all, 'related', id, { limit }] as const,
  },

  // Users/Profiles
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
    profile: (id?: string) => 
      [...queryKeys.users.all, 'profile', id || 'me'] as const,
    preferences: () => [...queryKeys.users.all, 'preferences'] as const,
  },

  // Generic CRUD factory for any resource
  resource: <T extends string>(resource: T) => ({
    all: [resource] as const,
    lists: () => [resource, 'list'] as const,
    list: (params?: FilterParams): QueryKey => 
      [resource, 'list', params],
    details: () => [resource, 'detail'] as const,
    detail: (id: string, params?: QueryParams): QueryKey => 
      [resource, 'detail', id, params],
    search: (query: string, params?: SearchParams): QueryKey => 
      [resource, 'search', query, params],
  }),

} as const;

// Helper functions for invalidation
export const invalidatePatterns = {
  // Invalidate all queries for a resource
  all: (resource: string) => [resource],
  
  // Invalidate all list queries for a resource
  lists: (resource: string) => [resource, 'list'],
  
  // Invalidate a specific item
  detail: (resource: string, id: string) => [resource, 'detail', id],
  
  // Invalidate by prefix
  byPrefix: (...prefix: string[]) => prefix,
};

// Type helpers for extracting query key types
export type PropertyKeys = 
  | typeof queryKeys.properties.all
  | ReturnType<typeof queryKeys.properties.lists>
  | ReturnType<typeof queryKeys.properties.list>
  | ReturnType<typeof queryKeys.properties.details>
  | ReturnType<typeof queryKeys.properties.detail>
  | ReturnType<typeof queryKeys.properties.infinite>
  | ReturnType<typeof queryKeys.properties.search>
  | ReturnType<typeof queryKeys.properties.featured>
  | ReturnType<typeof queryKeys.properties.byAgent>
  | ReturnType<typeof queryKeys.properties.similar>;

export type ArticleKeys = 
  | typeof queryKeys.articles.all
  | ReturnType<typeof queryKeys.articles.lists>
  | ReturnType<typeof queryKeys.articles.list>
  | ReturnType<typeof queryKeys.articles.details>
  | ReturnType<typeof queryKeys.articles.detail>
  | ReturnType<typeof queryKeys.articles.byCategory>
  | ReturnType<typeof queryKeys.articles.byAuthor>
  | ReturnType<typeof queryKeys.articles.trending>
  | ReturnType<typeof queryKeys.articles.related>;

export type UserKeys = 
  | typeof queryKeys.users.all
  | ReturnType<typeof queryKeys.users.lists>
  | ReturnType<typeof queryKeys.users.list>
  | ReturnType<typeof queryKeys.users.details>
  | ReturnType<typeof queryKeys.users.detail>
  | ReturnType<typeof queryKeys.users.current>
  | ReturnType<typeof queryKeys.users.profile>
  | ReturnType<typeof queryKeys.users.preferences>;

// Export for use in queries
export type QueryKeysType = typeof queryKeys;