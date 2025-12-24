import { useCrud,} from './useCrud';
import { useInfiniteList} from './useInfiniteList';
import { queryKeys } from '../lib/query-keys';
import { getEntityCacheConfig } from '../lib/cache-config';
import { ApiResponse, apiClient } from '../lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PropertyBase, PropertyData } from '@/type/pages/property';
import { ApiError } from 'next/dist/server/api-utils';
import { toNumber } from '@/lib/formatter';
import { ArticleBase} from '@/type/pages/article';
import { useRouter } from 'next/navigation';
import { UserBase } from '@/type/user';
import { useAuthContext } from '@/providers/auth-provider';


export function useProperties(params?: any) {
  const crud = useCrud<PropertyBase>({
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
  const crud = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('properties', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id);
  
  return {
    property: data,
    isLoading,
    error,
    ...crud,
  };
}

export function useInfiniteProperties(params?: any) {
  return useInfiniteList<PropertyBase>({
    resource: 'properties',
    interfaceType: 'client',
    params,
    limit: 15,
    autoFetch: true,
  });
}

export function useFeaturedProperties() {
  return useQuery<PropertyData[], ApiError>({
    queryKey: queryKeys.properties.featured(),
    queryFn: async (): Promise<PropertyData[]> => {

      const response = await apiClient.get<ApiResponse<PropertyData[]>>('/api/properties', {
        is_featured: true,
        limit: 3,
      });

      return response.data ?? []; 
    },
    ...getEntityCacheConfig('properties', 'list'),
  });
}

export function useSimilarProperties(
  currentProperty: PropertyBase | undefined,
  limit = 3
) {
  return useQuery({
    queryKey: queryKeys.properties.similar(currentProperty?.id || '', limit),
    queryFn: async () => {
      if (!currentProperty) return [];
      
      const response = await apiClient.get<ApiResponse<PropertyData[]>>('/api/properties', {
        city: currentProperty.city,
        property_type: currentProperty.property_type,
        'price.gte': toNumber(currentProperty.price, { min: 0 }) * 0.8,
        'price.lte': toNumber(currentProperty.price, { min: 0 }) * 1.2,  
        'id.neq': currentProperty.id,  
        limit,
      });
      
      return response.data ;
    },
    enabled: !!currentProperty,
    ...getEntityCacheConfig('properties', 'list'),
  });
}

export function useArticles(params?: any) {
  const crud = useCrud<ArticleBase>({
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


export function useArticle(id: string) {
  const crud = useCrud<ArticleBase>({
    resource: 'articles',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('articles', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id);
  
  return {
    article: data,
    isLoading,
    error,
    ...crud,
  };
}

export function useInfiniteArticles(params?: any) {
  return useInfiniteList<ArticleBase>({
    resource: 'articles',
    interfaceType: 'client',
    params,
    limit: 15,
    autoFetch: true,
  });
}

export function useRelatedArticles(
  currentArticle: ArticleBase | undefined,
  limit = 3
) {
  return useQuery({
    queryKey: queryKeys.articles.related(currentArticle?.id || '', limit),
    queryFn: async () => {
      if (!currentArticle) return [];
      
      const response = await apiClient.get<ApiResponse<ArticleBase[]>>('/api/articles', {
        category: currentArticle.category,
        'id.neq': currentArticle.id,  
        limit,
      });
      
      return response.data ;
    },
    enabled: !!currentArticle,
    ...getEntityCacheConfig('articles', 'list'),
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

export function useCurrentUsers() {
  const { user, loading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('No user logged in');
      }
      const response = await apiClient.get<UserBase>(`/api/user/me?id=${user.id}`);
      return response;
    },
    enabled: !!user?.id && !authLoading,
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

export function useUserRegistration() {
  const router = useRouter();
  const {
    create,
  } = useCrud({
    resource: 'user',
    interfaceType: 'client', 
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (data:UserBase) => {
        router.push('/auth/verify-email-sent')
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || "Registration failed";
        
        if (message.includes("already registered")) {
          toast.error("This email is already registered. Please login instead.");
        } else {
          toast.error(message);
        }
      },
    },
  });


  return create
}

