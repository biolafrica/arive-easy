

import {useState } from '../useInfiniteList';
import apiClient from '@/lib/api-client'; 
import { useAuthContext } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as stage from '@/type/pages/dashboard/approval';
import { useEffect, } from 'react';
import { createEntityHooks } from './useFactory';

const preApprovalHooks = createEntityHooks<
  stage.PreApprovalBase,
  'preApprovals',
  'list',
  'detail'
>({
  resource: 'pre-approvals',
  cacheKey: 'preApprovals',
  listSubKey: 'list',
  detailSubKey: 'detail',
  buyerInterface: 'buyer',
  ownerField: 'user_id',
  createInterface: 'buyer',
});

export const usePreApprovals  = preApprovalHooks.useList;
export const useAdminPrepApprovals = preApprovalHooks.useAdminList;

export function useCreatePreApproval() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { create, isCreating } = preApprovalHooks.useCreate()
  
  const submitPreApproval = async (data: Partial<stage.PreApprovalBase>) => {
    if (!user?.id) {
      toast.error('Please login to submit a pre-approval');
      return;
    }

    try {
      const result = await create({ ...data, user_id: user.id });
      if (result?.id) {
        router.push(`/user-dashboard/applications/${result.id}/pre-approvals`);
      }
      return result;
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Failed to submit pre-approval';
      toast.error(message);
      throw error;
    }
  };
  
  return {
    submitPreApproval,
    isSubmitting: isCreating,
  };
}

export function useUpdatePreApproval() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { update, isUpdating } = preApprovalHooks.useUpdate()
  
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

    const { guidance_notes, ...allowedData } = data as any;
    
    try {
      const result = await update(id, allowedData);

      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      if (options?.redirectOnSuccess && result) {
        const stages =
        result.current_step === 1 ? 'employment-info' :
        result.current_step === 2 ? 'property-info' :
        result.current_step === 3 ? 'document-info' :
        'success';

        const path = options.redirectPath ??
        `/user-dashboard/applications/${id}/pre-approval/${stages}`;

        router.push(path);
      }

      return result;

    } catch (error) {
      const message = error instanceof Error
        ? error.message : 'Failed to update pre-approval';
      if (message.includes('cannot update')) {
        toast.error('This pre-approval can no longer be edited');
      } else if (message.includes('missing required')) {
        toast.error('Please fill in all required fields');
      } else {
        toast.error(message);
      }

      throw error;
    }

  };
  
  return {
    updatePreApproval,
    isUpdating,
  };
}

export function useAdminUpdatePreApproval() {
  const { update, isUpdating } = preApprovalHooks.useUpdate({
    interfaceType: 'admin',
  });

  const adminUpdatePreApproval = async (
    id: string,
    data: Partial<stage.PreApprovalBase> & {
      conditions?: string[];
      rejection_reasons?: string[];
      guidance_notes?: string;
      status?: string;
      max_loan_amount?: number;
      current_step?: number;
      completed_steps: number;
      is_complete: boolean;
    }
  ) => {
    try {
      const result = await update(id, {
        ...data,
        reviewed_at: new Date().toISOString(),
      });

      const statusMessage =
        data.status === 'approved' ? 'Pre-approval approved successfully!' :
        data.status === 'rejected' ? 'Pre-approval rejected' :
        'Pre-approval updated successfully!';

      toast.success(statusMessage);
      return result;

    } catch (error) {
      toast.error( 
        error instanceof Error ? error.message : 'Failed to update pre-approval'
      );
      throw error;
    }
  };

  return {
    adminUpdatePreApproval,
    isUpdating,
  };
}


export function usePreApprovalStages(preApprovalId: string) {
  const { updatePreApproval, isUpdating } = useUpdatePreApproval();
  const [isUploading, setIsUploading] = useState(false);

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
    document_info: stage.DocumentInfoTypes; 
    current_step: number; 
    completed_steps: number ;
    is_complete: boolean;
    status:string;
  }) => {
    try {
      setIsUploading(true)
      const documentInfoWithUrls = await processDocumentFiles(
        data.document_info,
        (files) => apiClient.uploadMultipleToSupabase(files, 'media', 'pre-approval-documents')
      );

      return updatePreApproval(preApprovalId, {
        ...data,
        document_info: documentInfoWithUrls
      }, {
        successMessage: 'Application Submitted Successfully!',
        redirectOnSuccess: true,
        redirectPath: `/user-dashboard/applications/${preApprovalId}/pre-approval/success`
      });

    } catch (error) {
      console.error('Document upload error:', error);
      toast.error('Failed to upload documents');
      throw error;

    } finally {
      setIsUploading(false);
    }
  
  };
  
  
  return {
    updatePersonalInfo,
    updateEmploymentInfo,
    updatePropertyInfo,
    updateDocumentInfo,
    isUpdating,
    isUploading
  };
}

export function usePreApprovalState(preApprovalId: string) {
  const router = useRouter();
  const [preApproval, setPreApproval] = useState<stage.PreApprovalBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { items:preApprovals, isLoading: fetchingPreApprovals, error, refresh } = usePreApprovals({
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
      
      if (currentPreApproval.status !== 'draft' && currentPreApproval.status !== 'pending' && currentPreApproval.status !== 'rejected') {
        toast.error('This pre-approval has already been completed');
        router.push('/user-dashboard');
        return;
      }

      setPreApproval(currentPreApproval);
      setIsLoading(false);
    }
  }, [preApprovals, fetchingPreApprovals, router, preApprovalId]);

  const validateStepAccess = (requiredStep: number): boolean => {
    if (!preApproval) return false;

    if (requiredStep === 5) {
      return preApproval.is_complete || preApproval.completed_steps === 4;
    }

    const canAccess = requiredStep <= preApproval.current_step || requiredStep <= preApproval.completed_steps;
    
    if (!canAccess) {
      const targetStep = preApproval.current_step;
      const nextPath = getStepPath(targetStep, preApprovalId);
      router.push(nextPath);
      return false;
    }
    
    return true;
  };

  const isStepCompleted = (step: number): boolean => {
    return preApproval ? preApproval.completed_steps >= step : false;
  };

  const getNextIncompleteStep = (): number => {
    if (!preApproval) return 1;
    return Math.min(preApproval.completed_steps + 1, 4);
  };



  return {
    preApproval,
    isLoading,
    error,
    refresh,
    validateStepAccess,
    getStepPath,
    isStepCompleted,
    getNextIncompleteStep
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
    case 5:
      return `${basePath}/success`;
    default:
      return basePath;
  }
};

export async function processDocumentFiles(
  formData: stage.DocumentInfoTypes,
  uploadFn: (files: Record<string, File | null>) => Promise<Record<string, string | null>>
): Promise<stage.DocumentInfoTypes> {
  const fileFields = ['pay_stubs', 'tax_returns', 'bank_statements', 'employment_verification'] as const;
  
  const filesToUpload: Record<string, File | null> = {};
  const existingUrls: Record<string, string | null> = {};
  
  fileFields.forEach(field => {
    const value = formData[field];
    if (value instanceof File) {
      filesToUpload[field] = value;
      existingUrls[field] = null;
    } else if (typeof value === 'string') {
      filesToUpload[field] = null;
      existingUrls[field] = value;
    } else {
      filesToUpload[field] = null;
      existingUrls[field] = null;
    }
  });
  
  const uploadedUrls = await uploadFn(filesToUpload);

  const finalUrls: Record<string, string | null> = {};
  fileFields.forEach(field => {
    finalUrls[field] = uploadedUrls[field] || existingUrls[field];
  });

  return {
    pay_stubs: finalUrls.pay_stubs,
    tax_returns: finalUrls.tax_returns,
    bank_statements: finalUrls.bank_statements,
    employment_verification: finalUrls.employment_verification,
  };
}

export function useAdminPreApprovalStatus(preApprovalId: string) {
  const { updatePreApproval, isUpdating } = useUpdatePreApproval();

  const updateStatus = async (data: stage.PreAprovalStatus) => {
    return updatePreApproval(preApprovalId, data, {
      successMessage: `Application ${data.status === 'approved' ? 'approved' : 'declined'} successfully`,
      redirectOnSuccess: true,
      redirectPath:'/admin-dashboard/applications'
    });
  };

  return {
    updateStatus,
    isUpdating,
  };
}