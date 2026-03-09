import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { FilterParams, queryKeys } from '../lib/query-keys';
import { getEntityCacheConfig } from '../lib/cache-config';
import { ApiResponse, PaginatedResponse, apiClient } from '../lib/api-client';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthContext } from '@/providers/auth-provider';
import { toast } from 'sonner';
import { useCrud} from './useCrud';
import { useInfiniteList} from './useInfiniteList';
import { PropertyBase, PropertyData } from '@/type/pages/property';
import { toNumber } from '@/lib/formatter';
import { ArticleBase} from '@/type/pages/article';
import { UserAvatarForm, UserBase, } from '@/type/user';
import { FavoriteBase, PropertyFavorite } from '@/type/pages/dashboard/favorite';
import { Property } from '@/components/sections/dashboard/listing/property-form';


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

export function usesellerProperty(id: string) {
  const crud = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'buyer',
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
  const { user, loading: isUserLoading } = useAuthContext();

  const stableParams = useMemo(() => {
    if (!user?.id) return null;

    return {
      ...params,
      filters: {
        developer_id: user.id,
        ...(params?.filters
          ? Object.fromEntries(
              Object.entries(params.filters).filter(
                ([_, v]) => v !== '' && v !== undefined && v !== null
              )
            )
          : {}),
      },
      search: params?.search?.trim() || undefined,
    };
  }, [
    user?.id,
    params?.filters,
    params?.search,
    params?.sortBy,
    params?.sortOrder,
    params?.limit,
  ]);

  return useInfiniteList<Property>({
    resource: 'properties',
    interfaceType: 'buyer',
    params: stableParams || undefined,
    limit: 15,
    autoFetch: true,
    enabled: !!user?.id && !isUserLoading,
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

export function useAdminProperties(params?: any) {
  const crud = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'admin',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });

  const { data, isLoading, error } = crud.useGetAll(params);

  return {
    properties: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading,
    error,
    ...crud,
  };
}

export function useAdminPropertyActions() {
  const { update, isUpdating } = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'admin',
    showNotifications: true,
    optimisticUpdate: false, 
    
    onSuccess: {
      update: (data: PropertyBase) => {
        // Success message handled below based on action
      },
    },
    onError: {
      update: (error) => {
        toast.error(error?.error?.message || 'Failed to update property');
      },
    },
  });

  const toggleApproval = async (propertyId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    try {
      await update(propertyId, {
        is_active: newStatus,
        ...(newStatus && { updated_at: new Date().toISOString() }),
        ...(!newStatus && { updated_at: "" }),
      });
      
      toast.success(newStatus ? 'Property approved successfully' : 'Property unapproved successfully' );
    } catch (error) {
      // Error already handled by onError
    }
  };

  const toggleFeature = async (propertyId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    try {
      await update(propertyId, {
        is_featured: newStatus,
        ...(newStatus && { updated_at: new Date().toISOString() }),
        ...(!newStatus && { updated_at: "" }),
      });
      
      toast.success( newStatus ? 'Property added to featured' : 'Property removed from featured');
    } catch (error) {
      // Error already handled by onError
    }
  };


  return {
    toggleApproval,
    toggleFeature,
    isUpdating,
  };
}

export function useApplicationProperties(
  propertyId?: string,
  maxPrice?: number
) {
  const DEFAULT_PROPERTY_ID = '0ca3e480-6a3e-4c47-bed0-637386b5f64c';
  const isDefaultProperty = !propertyId || propertyId === DEFAULT_PROPERTY_ID;

  const {
    data: propertiesList,
    isLoading: isLoadingList,
    error: listError,
  } = useQuery({
    queryKey: queryKeys.properties.list({
      filters: {
        is_active: true,
        status: ['active', 'offers'],
        ...(maxPrice && { 'price.lte': maxPrice }),
      },
    }),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<PropertyBase>>(
        '/api/properties',
        {
          filters: {
            is_active: true,
            status: ['active', 'offers'],
            ...(maxPrice && { 'price.lte': maxPrice }),
          },
          sortBy: 'created_at',
          sortOrder: 'desc',
        }
      );
      return response;
    },
    enabled: isDefaultProperty,
    ...getEntityCacheConfig('properties', 'list'),
  });

  const {
    data: selectedProperty,
    isLoading: isLoadingSingle,
    error: singleError,
  } = useQuery({
    queryKey: queryKeys.properties.detail(propertyId || '', {}),
    queryFn: async () => {
      const response = await apiClient.get<PropertyBase>('/api/properties', {
        id: propertyId,
      });
      return response;
    },
    enabled: !isDefaultProperty && !!propertyId,
    ...getEntityCacheConfig('properties', 'detail'),
  });

  return {
    properties: isDefaultProperty ? (propertiesList?.data || []) : [],
    pagination: isDefaultProperty ? propertiesList?.pagination : undefined,
    
    property: !isDefaultProperty ? selectedProperty : null,
    
    isLoading: isDefaultProperty ? isLoadingList : isLoadingSingle,
    error: isDefaultProperty ? listError : singleError,
    
    mode: isDefaultProperty ? ('list' as const) : ('single' as const),
    isDefaultProperty,
    canSelectProperty: isDefaultProperty,
  };
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  
  const { remove, update, isDeleting, isUpdating } = useCrud<PropertyBase>({
    resource: 'properties',
    interfaceType: 'buyer',
    showNotifications: false,
    optimisticUpdate: false,
    invalidateOnMutation: true,
    onError: {
      delete: (error) => {
        const errorMessage = error?.error?.message || '';
        
        if (
          errorMessage.includes('foreign key constraint') ||
          errorMessage.includes('violates foreign key') ||
          errorMessage.includes('still referenced') ||
          errorMessage.includes('has related') ||
          errorMessage.includes('linked') ||
          errorMessage.includes('in use')
        ) {
          toast.error(
            'Cannot delete this property',
            {
              description: 'This property has active applications, offers, or other linked records. Please remove or archive those first.',
              duration: 5000,
            }
          );
        } else if (errorMessage.includes('not found')) {
          toast.error('Property not found or already deleted');
        } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
          toast.error('You do not have permission to delete this property');
        } else {
          toast.error('Failed to delete property', {
            description: errorMessage || 'An unexpected error occurred',
          });
        }
      },
    },
    onSuccess: {
      delete: () => {
        toast.success('Property deleted successfully');
      },
    },
  });

  const deleteProperty = async (propertyId: string): Promise<boolean> => {
    try {
      await remove(propertyId);
      return true;
    } catch (error) {
      return false;
    }
  };

  const archiveProperty = async (propertyId: string): Promise<boolean> => {
    try {
      await update(propertyId, {
        status: 'archived',
        updated_at: new Date().toISOString(),
      });
      
      toast.success('Property archived successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to archive property', {
        description: error?.error?.message || 'An unexpected error occurred',
      });
      return false;
    }
  };

  const removePropertyArchive = async (propertyId: string): Promise<boolean> => {
    try {
      await update(propertyId, {
        status: 'active',
        updated_at: new Date().toISOString(),
      });
      
      toast.success('Property removed from archive successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to remove property from archive', {
        description: error?.error?.message || 'An unexpected error occurred',
      });
      return false;
    }
  };

  return {
    deleteProperty,
    archiveProperty,
    removePropertyArchive,
    isDeleting: isDeleting || isUpdating,
  };
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


export function useAdminUsers(params?: any) {
  const crud = useCrud<UserBase>({
    resource: 'user',
    interfaceType: 'admin',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });

  const { data, isLoading, error } = crud.useGetAll(params);

  return {
    users: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading,
    error,
    ...crud,
  };
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




