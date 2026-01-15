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

  // Documents (buyer dashboard)
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.documents.lists(), params] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.documents.details(), id] as const,
    byType: (type: string, params?: PaginationParams) =>
      [...queryKeys.documents.all, 'by-type', type, params] as const,
    recent: (limit?: number) =>
      [...queryKeys.documents.all, 'recent', { limit }] as const,
    shared: (params?: PaginationParams) =>
      [...queryKeys.documents.all, 'shared', params] as const,
  },

  preApprovals: {
    all: ['pre-approvals'] as const,
    lists: () => [...queryKeys.preApprovals.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.preApprovals.lists(), params] as const,
    details: () => [...queryKeys.preApprovals.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.preApprovals.details(), id] as const,
    byStatus: (status: string, params?: PaginationParams) =>
      [...queryKeys.preApprovals.all, 'by-status', status, params] as const,
    byProperty: (propertyId: string, params?: PaginationParams) =>
      [...queryKeys.preApprovals.all, 'by-property', propertyId, params] as const,
    statistics: () => [...queryKeys.preApprovals.all, 'statistics'] as const,
    eligibility: (propertyId?: string) =>
      [...queryKeys.preApprovals.all, 'eligibility', propertyId] as const,
  },

  // Applications
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.applications.lists(), params] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.applications.details(), id] as const,
    byStatus: (status: string, params?: PaginationParams) =>
      [...queryKeys.applications.all, 'by-status', status, params] as const,
    statistics: () => [...queryKeys.applications.all, 'statistics'] as const,
  },

  // transactions
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.transactions.lists(), params] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.transactions.details(), id] as const,
    history: (userId?: string, params?: PaginationParams) =>
      [...queryKeys.transactions.all, 'history', userId, params] as const,
    summary: (period?: string) =>
      [...queryKeys.transactions.all, 'summary', period] as const,
    methods: () => [...queryKeys.transactions.all, 'methods'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (params?: FilterParams) => 
      [...queryKeys.notifications.lists(), params] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    count: () => [...queryKeys.notifications.all, 'count'] as const,
  },

  // Analytics (admin dashboard)
  analytics: {
    all: ['analytics'] as const,
    dashboard: (period?: string) => 
      [...queryKeys.analytics.all, 'dashboard', period] as const,
    revenue: (startDate?: string, endDate?: string) =>
      [...queryKeys.analytics.all, 'revenue', { startDate, endDate }] as const,
    users: (period?: string) =>
      [...queryKeys.analytics.all, 'users', period] as const,
    properties: (period?: string) =>
      [...queryKeys.analytics.all, 'properties', period] as const,
    performance: (metric?: string, period?: string) =>
      [...queryKeys.analytics.all, 'performance', metric, period] as const,
  },

  // Settings
  settings: {
    all: ['settings'] as const,
    general: () => [...queryKeys.settings.all, 'general'] as const,
    notifications: () => [...queryKeys.settings.all, 'notifications'] as const,
    privacy: () => [...queryKeys.settings.all, 'privacy'] as const,
    billing: () => [...queryKeys.settings.all, 'billing'] as const,
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

export type DocumentKeys=
  | typeof queryKeys.documents.all
  | ReturnType<typeof queryKeys.documents.lists>
  | ReturnType<typeof queryKeys.documents.list>
  | ReturnType<typeof queryKeys.documents.details>
  | ReturnType<typeof queryKeys.documents.detail>
  | ReturnType<typeof queryKeys.documents.byType>
  | ReturnType<typeof queryKeys.documents.recent>
  | ReturnType<typeof queryKeys.documents.shared>

export type ApplicationKeys= 
  |typeof queryKeys.applications.all
  |ReturnType<typeof queryKeys.applications.lists>
  |ReturnType<typeof queryKeys.applications.list>
  |ReturnType<typeof queryKeys.applications.details>
  |ReturnType<typeof queryKeys.applications.detail>
  |ReturnType<typeof queryKeys.applications.byStatus>
  |ReturnType<typeof queryKeys.applications.statistics>

export type TransactionKeys= 
  |typeof queryKeys.transactions.all
  |ReturnType<typeof queryKeys.transactions.lists>
  |ReturnType<typeof queryKeys.transactions.list>
  |ReturnType<typeof queryKeys.transactions.details>
  |ReturnType<typeof queryKeys.transactions.detail>
  |ReturnType<typeof queryKeys.transactions.history>
  |ReturnType<typeof queryKeys.transactions.summary>
  |ReturnType<typeof queryKeys.transactions.methods>

export type NotificationKeys= 
  |typeof queryKeys.notifications.all
  |ReturnType<typeof queryKeys.notifications.lists>
  |ReturnType<typeof queryKeys.notifications.list>
  |ReturnType<typeof queryKeys.notifications.unread>
  |ReturnType<typeof queryKeys.notifications.count>

export type AnalyticsKeys= 
  |typeof queryKeys.analytics.all
  |ReturnType<typeof queryKeys.analytics.dashboard>
  |ReturnType<typeof queryKeys.analytics.revenue>
  |ReturnType<typeof queryKeys.analytics.users>
  |ReturnType<typeof queryKeys.analytics.properties>
  |ReturnType<typeof queryKeys.analytics.performance>

export type SettingsKeys= 
  |typeof queryKeys.settings.all
  |ReturnType<typeof queryKeys.settings.general>
  |ReturnType<typeof queryKeys.settings.notifications>
  |ReturnType<typeof queryKeys.settings.privacy>
  |ReturnType<typeof queryKeys.settings.billing>

export type PreApprovalKeys = 
  | typeof queryKeys.preApprovals.all
  | ReturnType<typeof queryKeys.preApprovals.lists>
  | ReturnType<typeof queryKeys.preApprovals.list>
  | ReturnType<typeof queryKeys.preApprovals.details>
  | ReturnType<typeof queryKeys.preApprovals.detail>
  | ReturnType<typeof queryKeys.preApprovals.byStatus>
  | ReturnType<typeof queryKeys.preApprovals.byProperty>
  | ReturnType<typeof queryKeys.preApprovals.statistics>
  | ReturnType<typeof queryKeys.preApprovals.eligibility>;

// Export for use in queries
export type QueryKeysType = typeof queryKeys;