import { useCrud,} from './useCrud';
import { useInfiniteList} from './useInfiniteList';
import { FilterParams, queryKeys } from '../lib/query-keys';
import { getEntityCacheConfig } from '../lib/cache-config';
import { ApiResponse, apiClient } from '../lib/api-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { toast } from 'sonner';
import { PropertyBase, PropertyData } from '@/type/pages/property';
import { ApiError } from 'next/dist/server/api-utils';
import { toNumber } from '@/lib/formatter';
import { ArticleBase} from '@/type/pages/article';
import { useRouter } from 'next/navigation';
import { UserAvatarForm, UserBase, } from '@/type/user';
import { useAuthContext } from '@/providers/auth-provider';
import { FavoriteBase, PropertyFavorite } from '@/type/pages/dashboard/favorite';
import { useEffect, useMemo } from 'react';


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

export function useAdminProperty(id: string) {
  const crud = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'admin',
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

export function useProperty(id: string) {
  const crud = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'client',
    cacheConfig: getEntityCacheConfig('properties', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id);
  

  useEffect(() => {
    if (data?.id) {
      apiClient.post(`/api/properties/${id}/view`)
      .catch(err => console.log('View tracking failed:', err));
    }
  }, [data?.id, id]);
  
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

export function useSellerInfiniteProperties(params?: FilterParams) {
  const stableParams = useMemo(() => ({ ...params,
    filters: params?.filters ? Object.fromEntries(
      Object.entries(params.filters).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
    ) : undefined,

    search: params?.search?.trim() || undefined,
  }), [ params?.filters, params?.search, params?.sortBy, params?.sortOrder, params?.limit ]);

  return useInfiniteList<PropertyBase>({
    resource: 'properties',
    interfaceType: 'buyer',
    params: stableParams,
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

export function useFavorites() {
  const { user } = useAuthContext();

  const { useGetAll, create, remove, isCreating, isDeleting } = useCrud<FavoriteBase>({
    resource: 'favorites',
    interfaceType: 'client',
    showNotifications: false, 
  });


  const { data: favoritesData, isLoading } = useGetAll(
    { filters: { user_id: user?.id } },!!user?.id
  );

  const favorites = favoritesData?.data || [];
  
  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast.error('Please login to save properties');
      return;
    }
    
    const existing = favorites.find(f => f.property_id === propertyId);
    
    try {
      if (existing) {
        await remove(existing.id);
        toast.success('Removed from favorites');
      } else {
        await create({ property_id: propertyId, user_id: user.id });
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  
  const isFavorited = (propertyId: string) => {
    if (!user) return false;
    return favorites.some(f => f.property_id === propertyId);
  };
  
  return {
    favorites,
    isLoading: isLoading && user,
    toggleFavorite,
    isFavorited,
    isToggling: isCreating || isDeleting,
  };
}

export function useInfiniteFavoriteProperties(params?: any) {
  return useInfiniteList<PropertyFavorite>({
    resource: 'favorites',
    interfaceType: 'buyer',
    params,
    limit: 15,
    autoFetch: true,
  });
}

export function usePropertyOffer() {
  return useMutation({
    mutationFn: async (propertyId: string) => {return apiClient.post(`/api/properties/${propertyId}/offer`)},
    onSuccess: () => {toast.success('Offer submitted successfully!')},
    onError: (error: any) => {toast.error(error?.error?.message || 'Failed to submit offer')},
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

export function useUpdateProfile() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserAvatarForm) => {
      let updateData: Partial<UserBase> = { ...data };
      
      if (data.avatarFile) {
        try {
          const avatarUrl = await apiClient.uploadToSupabase(
            data.avatarFile,
            'media', 
            `users/${user?.id}`
          );
          
          if (avatarUrl) {
            updateData.avatar = avatarUrl;
          }
        } catch (error) {
          console.error('Avatar upload failed:', error);
          throw new Error('Failed to upload avatar');
        }
        
        delete (updateData as any).avatarFile;
      }
      
      const response = await apiClient.put(`/api/user/me?id=${user?.id}`, updateData);
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

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
}

export function useSubscriber() {
  const router = useRouter();
  const {
    create,
  } = useCrud({
    resource: 'subscribers',
    interfaceType: 'client', 
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (data:Subscriber) => {
        toast.success("successfully subscribed")
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || "Subscription failed, try again";
        
        if (message.includes("duplicate key value violates unique constraint")) {
          toast.error("This email is already subscribed.");
        } else {
          toast.error(message);
        }
      },
    },
  });


  return create
}




