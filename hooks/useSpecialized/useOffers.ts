import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useCrud } from "../useCrud";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { toast } from "sonner";
import { getEntityCacheConfig } from "@/lib/cache-config";
import { useMemo } from "react";
import { createEntityHooks } from "./useFactory";
import { captureError } from "@/utils/auth/captureError";
import { refresh } from "next/cache";

const offerHooks = createEntityHooks<
  OfferBase,
  'offers',
  'list',
  'summary'
>({
  resource: 'offers',
  cacheKey: 'offers',
  listSubKey: 'list',
  detailSubKey: 'summary',
  createInterface: 'buyer'
});

export const useAdminOffers = offerHooks.useAdminList;

export function useSellerOffers(params?: any, propertyId?: string) {
  const { user, loading: isUserLoading } = useAuthContext();

  const crud = useCrud<OfferBase>({
    resource: 'offers',
    interfaceType: 'buyer',
    showNotifications: false,
    optimisticUpdate: false,
    invalidateOnMutation: false,
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
    
    return { ...params, filters };
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
    refresh
  };
}

export function useCreateOffer() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { create, isCreating } = offerHooks.useCreate();
  
  const submitOffer = async (data: Partial<OfferBase>) => {
    if (!user?.id) {
      toast.error('Please sign in to submit an offer');
      return;
    }

    try {
      const result = await create({
        ...data,
        user_id: user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      toast.success('Offer submitted successfully');

      if (result?.id) {
        router.push(`/dashboard/offers/${result.id}`);
      }
      return result;

    } catch (error) {
      captureError(error, { component: 'useCreateOffer', action: 'submit-offer' });
      // Branch on known business-rule violations; never forward raw server text
      const raw = error instanceof Error ? error.message : '';
      if (raw.includes('already submitted')) {
        toast.error('You have already submitted an offer for this property');
      } else if (raw.includes('not available')) {
        toast.error('This property is no longer available for offers');
      } else {
        toast.error('Failed to submit your offer. Please try again.');
      }
      throw error;
    }
  };
  
  return {
    submitOffer,
    isSubmitting: isCreating,
  };
}

export function useSellerOfferActions() {
  const { user } = useAuthContext();
  const { update, isUpdating } = offerHooks.useUpdate();

  const acceptOffer = async (offerId: string, developerId: string, notes?: string) => {
    if (!user?.id) {
      toast.error('Please sign in to accept offers');
      return;
    }

    try {
      const result = await update(offerId, {
        status: 'accepted',
        updated_at: new Date().toISOString(),
        developer_id: developerId,
      });
      toast.success('Offer accepted successfully');
      return result;
    } catch (error) {
      captureError(error, { component: 'useSellerOfferActions', action: 'accept-offer' });
      toast.error('Failed to accept the offer. Please try again.');
      throw error;
    }
  };

  const rejectOffer = async (offerId: string, developerId: string, reason?: string) => {
    if (!user?.id) {
      toast.error('Please sign in to reject offers');
      return;
    }

    try {
      const result = await update(offerId, {
        status: 'declined',
        rejection_note: reason,
        updated_at: new Date().toISOString(),
        developer_id: developerId,
      });
      toast.success('Offer declined');
      return result;
    } catch (error) {
      captureError(error, { component: 'useSellerOfferActions', action: 'reject-offer' });
      toast.error('Failed to decline the offer. Please try again.');
      throw error;
    }
  };

  return {
    acceptOffer,
    rejectOffer,
    isUpdating,
  };
}