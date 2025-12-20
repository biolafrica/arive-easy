import { useCrud,} from './useCrud';
import { useInfiniteList} from './useInfiniteList';
import { queryKeys } from '../lib/query-keys';
import { getEntityCacheConfig } from '../lib/cache-config';
import { apiClient } from '../lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';


export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented';
  images: string[];
  amenities: string[];
  agent_id: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export function useProperties(params?: any) {
  const crud = useCrud<Property>({
    resource: 'properties',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('properties', 'list'),
  });
  
  const { data, isLoading, error } = crud.useGetAll(params);
  
  return {
    properties: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function useProperty(id: string) {
  const crud = useCrud<Property>({
    resource: 'properties',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('properties', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id, { include: ['agent', 'similar'] });
  
  return {
    property: data,
    isLoading,
    error,
    ...crud,
  };
}

export function useInfiniteProperties(params?: any) {
  return useInfiniteList<Property>({
    resource: 'properties',
    interfaceType: 'client',
    params,
    limit: 20,
    autoFetch: true,
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: queryKeys.properties.featured(),
    queryFn: async () => {
      const response:any = await apiClient.get('/api/properties', {
        is_featured: true,
        limit: 2,
      });
      return response.data;
    },
    ...getEntityCacheConfig('properties', 'list'),
  });
}


export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  category: string;
  tags: string[];
  image_url?: string;
  published_at: string;
  view_count: number;
  reading_time: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export function useArticles(params?: any) {
  const crud = useCrud<Article>({
    resource: 'articles',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('articles', 'list'),
  });
  
  const { data, isLoading, error } = crud.useGetAll(params);
  
  return {
    articles: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get(`/api/articles/${slug}`);
      // Increment view count
      await apiClient.post(`/api/articles/${slug}/view`);
      return response;
    },
    ...getEntityCacheConfig('articles', 'detail'),
  });
}


export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  bio?: string;
  preferences?: Record<string, any>;
  role: 'admin' | 'agent' | 'buyer' | 'seller';
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      const response = await apiClient.get('/api/users/me');
      return response;
    },
    ...getEntityCacheConfig('profile', 'own'),
  });
}

export function useUserProfile(userId?: string) {
  const id = userId || 'me';
  
  return useQuery({
    queryKey: queryKeys.users.profile(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/users/${id}`);
      return response;
    },
    ...getEntityCacheConfig('profile', userId ? 'public' : 'own'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await apiClient.put('/api/users/me', data);
      return response;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      queryClient.setQueryData(queryKeys.users.current(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Failed to update profile');
    },
  });
}