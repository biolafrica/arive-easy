
import { useCrud } from '../useCrud';
import { getEntityCacheConfig } from '@/lib/cache-config';
import { useInfiniteList, useState } from '../useInfiniteList';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import apiClient, { ApiResponse } from '@/lib/api-client';
import { useAuthContext } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as stage from '@/type/pages/dashboard/approval';
import { useEffect } from 'react';


// Single pre-approval detail
export function usePreApproval(id: string) {
  const crud = useCrud<stage.PreApprovalBase>({
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
  return useInfiniteList<stage.PreApprovalBase>({
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
      const response = await apiClient.get<ApiResponse<stage.PreApprovalBase[]>>('/api/pre-approvals', {
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
      const response = await apiClient.get<ApiResponse<stage.PreApprovalBase[]>>('/api/pre-approvals', {
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


// Infinite list with property details (if you need joined data)
export function useInfinitePreApprovalsWithProperties(params?: any) {
  return useInfiniteList<stage.PreApprovalWithProperty>({
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

export function usePreApprovals(params?: any) {
  const crud = useCrud<stage.PreApprovalBase>({
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

export function useCreatePreApproval() {
  const router = useRouter();
  const { user } = useAuthContext();
  
  const { create, isCreating } = useCrud<stage.PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    showNotifications: false,
    optimisticUpdate: false,
    onSuccess: {
      create: (data: stage.PreApprovalBase) => {
        router.push(`/user-dashboard/applications/${data.id}/pre-approvals`);
      },
    },
    onError: {
      create: (error) => {
        const message = error?.error?.message || 'Failed to submit pre-approval';
        toast.error(message);
      },
    },
  });
  
  const submitPreApproval = async (data: Partial<stage.PreApprovalBase>) => {
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

export function useUpdatePreApproval() {
  const router = useRouter();
  const { user } = useAuthContext();
  
  const { update, isUpdating } = useCrud<stage.PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'buyer',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      update: (data: stage.PreApprovalBase) => {
        toast.success('Pre-approval updated successfully!');
      },
    },
    onError: {
      update: (error) => {
        const message = error?.error?.message || 'Failed to update pre-approval';
        
        if (message.includes('cannot update')) {
          toast.error('This pre-approval can no longer be edited');
        } else if (message.includes('missing required')) {
          toast.error('Please fill in all required fields');
        } else {
          toast.error(message);
        }
      },
    },
  });
  
  const updatePreApproval = async (
    id: string, 
    data: Partial<stage.PreApprovalBase>,
    options?: {
      redirectOnSuccess?: boolean;
      redirectPath?: string;
      successMessage?: string;
    }
  ) => {
    if (!user?.id) {
      toast.error('Please login to update pre-approval');
      return;
    }

    const { 
      status, 
      conditions, 
      rejection_reasons,
      guidance_notes,
      reviewed_at,
      reviewed_by,
      ...allowedData 
    } = data as any;
    
    const result = await update(id, allowedData);


    if (options?.redirectOnSuccess && result) {
      const stages = result.current_step === 1 ?'employment-info':result.current_step === 2 ?'property-info':result.current_step === 3?'document-info':'success';
      const path = options.redirectPath || `/user-dashboard/applications/${id}/pre-approval/${stages}`;
      router.push(path);
    }

    
    if (options?.successMessage) {
      toast.success(options.successMessage);
    }
    
    return result;
  };
  
  return {
    updatePreApproval,
    isUpdating,
  };
}

export function useAdminUpdatePreApproval() {

  const { update, isUpdating } = useCrud<stage.PreApprovalBase>({
    resource: 'pre-approvals',
    interfaceType: 'admin',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      update: (data: stage.PreApprovalBase) => {
        const statusMessage = data.status === 'approved' 
          ? 'Pre-approval approved successfully!' 
          : data.status === 'rejected'
          ? 'Pre-approval rejected'
          : 'Pre-approval updated successfully!';
        
        toast.success(statusMessage);
      },
    },
    onError: {
      update: (error) => {
        toast.error(error?.error?.message || 'Failed to update pre-approval');
      },
    },
  });
  
  const adminUpdatePreApproval = async (
    id: string,
    data: Partial<stage.PreApprovalBase> & {
      conditions?: string[];
      rejection_reasons?: string[];
      guidance_notes?: string;
      status?: string;
      max_loan_amount?:number;
    }

  ) => {
    return update(id, {
      ...data,
      reviewed_at: new Date().toISOString(),
    });
  };
  
  return {
    adminUpdatePreApproval,
    isUpdating,
  };
}

export function usePreApprovalStages(preApprovalId: string) {
  const { updatePreApproval, isUpdating } = useUpdatePreApproval();

  const updatePersonalInfo = async (data: { 
    personal_info: stage.PersonalInfoType; 
    current_step: number; 
    completed_steps: number 
  }) => {
    return updatePreApproval(preApprovalId, data, {
      successMessage: 'Personal information saved',
      redirectOnSuccess: true,
      redirectPath: `/user-dashboard/applications/${preApprovalId}/pre-approval/employment-info`
    });
  };

  const updateEmploymentInfo = async (data: { 
    employment_info: stage.EmploymentInfoType; 
    current_step: number; 
    completed_steps: number 
  }) => {
    return updatePreApproval(preApprovalId, data, {
      successMessage: 'Employment information saved',
      redirectOnSuccess: true,
      redirectPath: `/user-dashboard/applications/${preApprovalId}/pre-approval/property-info`
    });
  };

  const updatePropertyInfo = async (data: { 
    property_info: stage.PropertyPreferenceType; 
    current_step: number; 
    completed_steps: number 
  }) => {
    return updatePreApproval(preApprovalId, data, {
      successMessage: 'Property information saved',
      redirectOnSuccess: true,
      redirectPath: `/user-dashboard/applications/${preApprovalId}/pre-approval/document-info`
    });
  };

  const updateDocumentInfo = async (data: { 
    document_info: stage.DocumentInfoType; 
    current_step: number; 
    completed_steps: number 
  }) => {
    return updatePreApproval(preApprovalId, data, {
      successMessage: 'Document information saved',
      redirectOnSuccess: true,
      redirectPath: `/user-dashboard/applications/${preApprovalId}/pre-approval/success`
    });
  };
  
  
  return {
    updatePersonalInfo,
    updateEmploymentInfo,
    updatePropertyInfo,
    updateDocumentInfo,
    isUpdating,
  };
}

export function usePreApprovalState(preApprovalId: string) {
  const router = useRouter();
  const [preApproval, setPreApproval] = useState<stage.PreApprovalBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { preApprovals, isLoading: fetchingPreApprovals } = usePreApprovals({
    filters: {
      id: preApprovalId
    }
  });

  useEffect(() => {
    if (!fetchingPreApprovals) {
      if (!preApprovals || preApprovals.length === 0) {
        toast.error('Invalid pre-approval application');
        router.push('/user-dashboard');
        return;
      }

      const currentPreApproval = preApprovals[0];
      
      if (currentPreApproval.status !== 'draft') {
        toast.error('This pre-approval has already been submitted');
        router.push('/user-dashboard');
        return;
      }

      setPreApproval(currentPreApproval);
      setIsLoading(false);
    }
  }, [preApprovals, fetchingPreApprovals, router, preApprovalId]);

  const validateStepAccess = (requiredStep: number): boolean => {
    if (!preApproval) return false;

    const canAccess = requiredStep <= preApproval.current_step || preApproval.completed_steps >= requiredStep;
    
    if (!canAccess) {
      const nextStep = getStepPath(preApproval.current_step, preApprovalId);
      router.push(nextStep);
      return false;
    }
    
    return true;
  };


  return {
    preApproval,
    isLoading,
    validateStepAccess,
    getStepPath
  };
}


export const getStepPath = (step: number, id: string): string => {
  const basePath = `/user-dashboard/applications/${id}/pre-approval`;
  
  switch(step) {
    case 0:
      return `/user-dashboard/applications/${id}/pre-approval`;
    case 1:
      return `${basePath}/personal-info`;
    case 2:
      return `${basePath}/employment-info`;
    case 3:
      return `${basePath}/property-info`;
    case 4:
      return `${basePath}/document-info`;
    default:
      return basePath;
  }
};

