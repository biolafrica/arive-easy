import { QueryKey } from "@tanstack/react-query";

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
  include?: string[];
}

export interface QueryParams extends FilterParams {
  select?: string[];
  [key: string]: any;
}

export const queryKeys = {
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
    featured: () => [...queryKeys.properties.all, 'featured'] as const,
    similar: (id: string, limit?: number) =>
      [...queryKeys.properties.all, 'similar', id, { limit }] as const,
  },

  mortgages: {
    all: ['mortgages'] as const,
    lists: () => [...queryKeys.mortgages.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.mortgages.lists(), params] as const,
    details: () => [...queryKeys.mortgages.all, 'detail'] as const,
    detail: (id: string, params?: QueryParams) =>
      [...queryKeys.mortgages.details(), id, params] as const,
    infinite: (params?: FilterParams) =>
      [...queryKeys.mortgages.all, 'infinite', params] as const,
  },

  articles: {
    all: ['articles'] as const,
    lists: () => [...queryKeys.articles.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.articles.lists(), params] as const,
    details: () => [...queryKeys.articles.all, 'detail'] as const,
    detail: (slug: string) =>
      [...queryKeys.articles.details(), slug] as const,
    related: (id: string, limit?: number) =>
      [...queryKeys.articles.all, 'related', id, { limit }] as const,
  },

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
  },

  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.documents.lists(), params] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.documents.details(), id] as const,
    templates: (params?: FilterParams) =>
      [...queryKeys.documents.all, 'templates', params] as const,
    partners: (params?: FilterParams) =>
      [...queryKeys.documents.all, 'partners', params] as const,
    transactions: (params?: FilterParams) =>
      [...queryKeys.documents.all, 'transactions', params] as const,
  },

  preApprovals: {
    all: ['pre-approvals'] as const,
    lists: () => [...queryKeys.preApprovals.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.preApprovals.lists(), params] as const,
    details: () => [...queryKeys.preApprovals.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.preApprovals.details(), id] as const,
  },

  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.applications.lists(), params] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.applications.details(), id] as const,
  },

  offers: {
    all: ['offers'] as const,
    lists: () => [...queryKeys.offers.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.offers.lists(), params] as const,
    details: () => [...queryKeys.offers.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.offers.details(), id] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (params?: FilterParams) =>
      [...queryKeys.notifications.lists(), params] as const,
    count: () => [...queryKeys.notifications.all, 'count'] as const,
  },

  analytics: {
    all: ['analytics'] as const,
    dashboard: (period?: string) =>
      [...queryKeys.analytics.all, 'dashboard', period] as const,
    mortgagePayments: (period?: string) =>
      [...queryKeys.analytics.all, 'mortgage-payments', period] as const,
  },

  resource: <T extends string>(resource: T) => ({
    all: [resource] as const,
    lists: () => [resource, 'list'] as const,
    list: (params?: FilterParams): QueryKey => [resource, 'list', params],
    details: () => [resource, 'detail'] as const,
    detail: (id: string, params?: QueryParams): QueryKey => [resource, 'detail', id, params],
    search: (query: string, params?: SearchParams): QueryKey => [resource, 'search', query, params],
  }),

} as const;

export const invalidatePatterns = {
  all: (resource: string) => [resource],
  lists: (resource: string) => [resource, 'list'],
  detail: (resource: string, id: string) => [resource, 'detail', id],
};


export type PropertyKeys =
  | typeof queryKeys.properties.all
  | ReturnType<typeof queryKeys.properties.lists>
  | ReturnType<typeof queryKeys.properties.list>
  | ReturnType<typeof queryKeys.properties.details>
  | ReturnType<typeof queryKeys.properties.detail>
  | ReturnType<typeof queryKeys.properties.infinite>
  | ReturnType<typeof queryKeys.properties.featured>
  | ReturnType<typeof queryKeys.properties.similar>;

export type MortgageKeys =
  | typeof queryKeys.mortgages.all
  | ReturnType<typeof queryKeys.mortgages.lists>
  | ReturnType<typeof queryKeys.mortgages.list>
  | ReturnType<typeof queryKeys.mortgages.details>
  | ReturnType<typeof queryKeys.mortgages.detail>
  | ReturnType<typeof queryKeys.mortgages.infinite>;

export type ArticleKeys =
  | typeof queryKeys.articles.all
  | ReturnType<typeof queryKeys.articles.lists>
  | ReturnType<typeof queryKeys.articles.list>
  | ReturnType<typeof queryKeys.articles.details>
  | ReturnType<typeof queryKeys.articles.detail>
  | ReturnType<typeof queryKeys.articles.related>;

export type UserKeys =
  | typeof queryKeys.users.all
  | ReturnType<typeof queryKeys.users.lists>
  | ReturnType<typeof queryKeys.users.list>
  | ReturnType<typeof queryKeys.users.details>
  | ReturnType<typeof queryKeys.users.detail>
  | ReturnType<typeof queryKeys.users.current>
  | ReturnType<typeof queryKeys.users.profile>;

export type DocumentKeys =
  | typeof queryKeys.documents.all
  | ReturnType<typeof queryKeys.documents.lists>
  | ReturnType<typeof queryKeys.documents.list>
  | ReturnType<typeof queryKeys.documents.details>
  | ReturnType<typeof queryKeys.documents.detail>
  | ReturnType<typeof queryKeys.documents.templates>
  | ReturnType<typeof queryKeys.documents.partners>
  | ReturnType<typeof queryKeys.documents.transactions>;

export type PreApprovalKeys =
  | typeof queryKeys.preApprovals.all
  | ReturnType<typeof queryKeys.preApprovals.lists>
  | ReturnType<typeof queryKeys.preApprovals.list>
  | ReturnType<typeof queryKeys.preApprovals.details>
  | ReturnType<typeof queryKeys.preApprovals.detail>;

export type ApplicationKeys =
  | typeof queryKeys.applications.all
  | ReturnType<typeof queryKeys.applications.lists>
  | ReturnType<typeof queryKeys.applications.list>
  | ReturnType<typeof queryKeys.applications.details>
  | ReturnType<typeof queryKeys.applications.detail>;

export type OfferKeys =
  | typeof queryKeys.offers.all
  | ReturnType<typeof queryKeys.offers.lists>
  | ReturnType<typeof queryKeys.offers.list>
  | ReturnType<typeof queryKeys.offers.details>
  | ReturnType<typeof queryKeys.offers.detail>;

export type NotificationKeys =
  | typeof queryKeys.notifications.all
  | ReturnType<typeof queryKeys.notifications.lists>
  | ReturnType<typeof queryKeys.notifications.list>
  | ReturnType<typeof queryKeys.notifications.count>;

export type AnalyticsKeys =
  | typeof queryKeys.analytics.all
  | ReturnType<typeof queryKeys.analytics.dashboard>
  | ReturnType<typeof queryKeys.analytics.mortgagePayments>;

export type QueryKeysType = typeof queryKeys;