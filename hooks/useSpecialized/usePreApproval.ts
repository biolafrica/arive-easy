
import { useCrud } from '../useCrud';
import { getEntityCacheConfig } from '@/lib/cache-config';
import { useInfiniteList } from '../useInfiniteList';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import apiClient, { ApiResponse } from '@/lib/api-client';
import { useAuthContext } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PreApprovalBase, PreApprovalWithProperty } from '@/type/pages/dashboard/approval';

// Basic CRUD operations for pre-approvals
export function usePreApprovals(params?: any) {
  const crud = useCrud<PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    cacheConfig: getEntityCacheConfig('preApprovals', 'list'),
  });
  
  const { data, isLoading, error } = crud.useGetAll(params);
  
  return {
    preApprovals: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    ...crud,
  };
}

// Single pre-approval detail
export function usePreApproval(id: string) {
  const crud = useCrud<PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    cacheConfig: getEntityCacheConfig('preApprovals', 'detail'),
  });
  
  const { data, isLoading, error } = crud.useGetOne(id);
  
  return {
    preApproval: data,
    isLoading,
    error,
    ...crud,
  };
}

// Infinite scroll for pre-approvals
export function useInfinitePreApprovals(params?: any) {
  return useInfiniteList<PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    params,
    limit: 15,
    autoFetch: true,
  });
}

// Pre-approvals filtered by status
export function usePreApprovalsByStatus(status: string, params?: any) {
  return useQuery({
    queryKey: queryKeys.preApprovals.byStatus(status, params),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PreApprovalBase[]>>('/api/pre-approvals', {
        status,
        ...params,
      });
      return response.data || [];
    },
    ...getEntityCacheConfig('preApprovals', 'list'),
  });
}

// Pre-approvals for a specific property
export function usePreApprovalsByProperty(propertyId: string, params?: any) {
  return useQuery({
    queryKey: queryKeys.preApprovals.byProperty(propertyId, params),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PreApprovalBase[]>>('/api/pre-approvals', {
        property_id: propertyId,
        ...params,
      });
      return response.data || [];
    },
    enabled: !!propertyId,
    ...getEntityCacheConfig('preApprovals', 'list'),
  });
}

// Pre-approval statistics
export function usePreApprovalStatistics() {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.preApprovals.statistics(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        expired: number;
      }>>('/api/pre-approvals/statistics');
      
      return response.data;
    },
    enabled: !!user?.id,
    ...getEntityCacheConfig('preApprovals', 'statistics'),
  });
}

// Check eligibility for pre-approval
export function usePreApprovalEligibility(propertyId?: string) {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.preApprovals.eligibility(propertyId),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{
        eligible: boolean;
        reasons?: string[];
        maxAmount?: number;
        requirements?: string[];
      }>>('/api/pre-approvals/eligibility', {
        property_id: propertyId,
      });
      
      return response.data;
    },
    enabled: !!user?.id,
    ...getEntityCacheConfig('preApprovals', 'eligibility'),
  });
}

// Create pre-approval with custom success handling
export function useCreatePreApproval() {
  const router = useRouter();
  const { user } = useAuthContext();
  
  const { create, isCreating } = useCrud<PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      create: (data: PreApprovalBase) => {
        toast.success('Pre-approval submitted successfully!');
        router.push(`/dashboard/pre-approvals/${data.id}`);
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || 'Failed to submit pre-approval';
        toast.error(message);
      },
    },
  });
  
  const submitPreApproval = async (data: Partial<PreApprovalBase>) => {
    if (!user?.id) {
      toast.error('Please login to submit a pre-approval');
      return;
    }
    
    return create({ ...data, user_id: user.id });
  };
  
  return {
    submitPreApproval,
    isSubmitting: isCreating,
  };
}

// Update pre-approval status (for admin use)
export function useUpdatePreApprovalStatus() {
  const { update, isUpdating } = useCrud<PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'admin',
    showNotifications: true,
    onSuccess: {
      update: (data: PreApprovalBase) => {
        toast.success(`Pre-approval ${data.status}`);
      },
    },
    onError: {
      update: (error) => {
        toast.error(error?.error?.message || 'Failed to update status');
      },
    },
  });
  
  const updateStatus = async (id: string, status: string, notes?: string) => {
    return update(id, { status, guidance_notes: notes });
  };
  
  return {
    updateStatus,
    isUpdating,
  };
}

// Infinite list with property details (if you need joined data)
export function useInfinitePreApprovalsWithProperties(params?: any) {
  return useInfiniteList<PreApprovalWithProperty>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    params: {
      ...params,
      include: ['property'], // Request to include property data
    },
    limit: 15,
    autoFetch: true,
  });
}