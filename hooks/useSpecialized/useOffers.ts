import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useCrud } from "../useCrud";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { toast } from "sonner";
import { getEntityCacheConfig } from "@/lib/cache-config";
import { useMemo } from "react";


export function useSellerOffers(params?: any, propertyId?: string) {
  const { user, loading: isUserLoading } = useAuthContext();

  const crud = useCrud<OfferBase>({
    resource: 'offers',
    interfaceType: 'buyer', 
    optimisticUpdate: true,
    invalidateOnMutation: true,
    cacheConfig: getEntityCacheConfig('offers', 'list'),
  });
  
  const queryParams = useMemo(() => {
    if (!user?.id) return null; 

      const filters: Record<string, any> = {
      ...params?.filters,
      developer_id: user.id,
    };
  
    if (propertyId) {
      filters.property_id = propertyId;
    }
    
    return {
      ...params,
      filters,
    };
  }, [params, user?.id, propertyId]);


  const { data, isLoading, error } = crud.useGetAll(
    queryParams || undefined, 
    !isUserLoading && !!user?.id 
  );

  return {
    offers: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading || isUserLoading,
    error,
    ...crud,
  };
}

export function useSellerOfferActions() {
  const { user } = useAuthContext();
  
  const { update, isUpdating } = useCrud<OfferBase>({
    resource: 'offers',
    interfaceType: 'buyer',
    showNotifications: true,
    optimisticUpdate: false, 
    onSuccess: {
      update: (data: OfferBase) => {
        const action = data.status === 'accepted' ? 'accepted' : 'rejected';
        toast.success(`Offer ${action} successfully`);
      },
    },
    onError: {
      update: (error) => {
        toast.error(error?.error?.message || 'Failed to update offer');
      },
    },
  });

  const acceptOffer = async (offerId: string, notes?: string) => {
    if (!user?.id) {
      toast.error('Please login to accept offers');
      return;
    }

    return update(offerId, {
      status: 'accepted',
      updated_at: new Date().toISOString(),
    });
  };

  const rejectOffer = async (offerId: string, reason?: string) => {
    if (!user?.id) {
      toast.error('Please login to reject offers');
      return;
    }

    return update(offerId, {
      status: 'declined',
      rejection_note:reason,
      updated_at: new Date().toISOString(),
      
    });
  };

  return {
    acceptOffer,
    rejectOffer,
    isUpdating,
  };
}

export function useCreateOffer() {
  const router = useRouter();
  const { user } = useAuthContext();
  
  const { create, isCreating } = useCrud<OfferBase>({
    resource: 'offers',
    interfaceType: 'buyer',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      create: (data: OfferBase) => {
        toast.success('Offer submitted successfully!');
        router.push(`/dashboard/offers/${data.id}`);
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || 'Failed to submit offer';
        
        if (message.includes('already submitted')) {
          toast.error('You have already submitted an offer for this property');
        } else if (message.includes('not available')) {
          toast.error('This property is no longer available for offers');
        } else {
          toast.error(message);
        }
      },
    },
  });
  
  const submitOffer = async (data: Partial<OfferBase>) => {
    if (!user?.id) {
      toast.error('Please login to submit an offer');
      return;
    }
    
    return create({
      ...data,
      user_id: user.id,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  };
  
  return {
    submitOffer,
    isSubmitting: isCreating,
  };
}

export function useAdminOffers(params?: any) {
  const crud = useCrud<OfferBase>({
    resource: 'offers',
    interfaceType: 'buyer', 
    optimisticUpdate: true,
    invalidateOnMutation: true,
    cacheConfig: getEntityCacheConfig('offers', 'list'),
  });

  const { data, isLoading, error } = crud.useGetAll(params);

  return {
    offers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}
