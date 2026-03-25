import { ApplicationBase } from "@/type/pages/dashboard/application";
import { useCrud } from "../useCrud";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo } from "react";
import { createEntityHooks } from "./useFactory";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { captureError } from "@/utils/auth/captureError";


interface PaymentStatus {
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  amount: number;
  receipt_url: string | null;
  transaction_id?: string;
  payment_date?: string;
}

export type StageType = 'identity' | 'property' | 'terms' | 'payment' | 'mortgage';

interface CompleteStageParams {
  applicationId: string;
  stageType: StageType;
  stageData: any;
}

const applicationHooks = createEntityHooks<
  ApplicationBase,
  'applications', 
  'list',
  'detail'
>({
  resource: 'applications',
  cacheKey: 'applications',
  listSubKey: 'list',
  detailSubKey: 'detail',
  buyerInterface: 'buyer',
  ownerField: 'user_id',
  createInterface: 'buyer',
});

export const useApplications = applicationHooks.useOwnerList;
export const useAdminApplications = applicationHooks.useAdminList;

export function useUpdateApplication() {
  const router = useRouter();
  const { update, isUpdating } = applicationHooks.useUpdate();

  const updateApplication = async (
    id: string,
    data: Partial<ApplicationBase>,
    options?: {
      redirectOnSuccess?: boolean;
      redirectPath?: string;
      successMessage?: string;
    }
  ) => {
    try {
      const result = await update(id, data);

      if (!result) return result;

      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      if (options?.redirectOnSuccess) {
        router.push(options.redirectPath ?? '/user-dashboard/applications');
      }

      return result;

    } catch (error) {
      captureError(error, { component: 'user-update-application', action: 'update-data' });
      const message = error instanceof Error ? error.message : 'Failed to update application';
      toast.error(message);
      throw error;
    }
  };
  
  return {
    updateApplication,
    isUpdating,
  };
}

export function useApplicationStageUpdates(application: ApplicationBase) {
  const { updateApplication, isUpdating } = useUpdateApplication();

  const updatePropertySelection = async (data: {
    property_id: string;
    property_name: string;
    property_price: number;
    developer_id:string;
    type: 'mortgage' | 'outright';
  }) => {
    return updateApplication(application.id, {
      property_id: data.property_id,
      property_price: data.property_price,
      developer_id:data.developer_id,
      property_name:data.property_name,
      stages_completed: {
        ...application.stages_completed,
        property_selection: {
          completed: false,
          completed_at: '',
          status: 'in_progress',
          data: {
            status: 'sent',
            reason: '',
            submitted_at: new Date().toISOString(),
            property_name: data.property_name,
            type: data.type,
            property_id: data.property_id,
          }
        }
      }
    }, 
    {successMessage: 'Selected Property submitted successfully'}
  )};
  
  const updateIdentityVerification = async (data: {
    kyc_session_id: string;
    kyc_result: any;
    kyc_status: string;
  }) => {
    return updateApplication(application.id,
      {
        stages_completed: {
          ...application.stages_completed,
          identity_verification: {
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed',
            kyc_status: 'success',
          }
        },
        current_stage: 'terms_agreement',
        current_step: 7
      }, 
      {successMessage: 'Identity verified successfully'}
    )
  };
  
  const updateTermsAgreement = async (data: {
    terms_accepted: boolean;
    contract_signed: boolean;
    [key: string]: any;
  }) => {
    return updateApplication(application.id, {
      stages_completed: {
        ...application.stages_completed,
        terms_agreement: {
          completed: true,
          completed_at: new Date().toISOString(),
          status: 'completed',
          data
        }
      },
      current_stage: 'payment_setup',
      current_step: 8
    }, {
      successMessage: 'Terms accepted successfully'
    });
  };
  
  const updatePaymentSetup = async (data: {
    payment_method: string;
    stripe_payment_method_id?: string;
    down_payment_amount: number;
    [key: string]: any;
  }) => {
    return updateApplication(application.id, {
      down_payment_amount: data.down_payment_amount,
      stages_completed: {
        ...application.stages_completed,
        payment_setup: {
          completed: true,
          completed_at: new Date().toISOString(),
          status: 'completed',
          data
        }
      },
      current_stage: 'mortgage_activation',
      current_step: 9
    }, {
      successMessage: 'Payment setup completed'
    });
  };
  
  const updateMortgageActivation = async (data: {
    mortgage_activated: boolean;
    [key: string]: any;
  }) => {
    return updateApplication(application.id, {
      status: 'active',
      stages_completed: {
        ...application.stages_completed,
        mortgage_activation: {
          completed: true,
          completed_at: new Date().toISOString(),
          status: 'completed',
          data: {
            ...data,
            direct_debit_status: 'active',
            direct_debit_creation_date: new Date().toISOString(),
            current_step: 'success',
          }
        }
      },
      mortgage_start_date: new Date().toISOString()
    }, {
      successMessage: 'Mortgage activated successfully!',
      redirectOnSuccess: true,
      redirectPath: `/user-dashboard/applications`
    });
  };
  
  return {
    updatePropertySelection,
    updateIdentityVerification,
    updateTermsAgreement,
    updatePaymentSetup,
    updateMortgageActivation,
    isUpdating
  };
}

export function usePaymentStatus(sessionId: string | null) {
  return useQuery<PaymentStatus>({
    queryKey: ['payment-status', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID provided');
      
      const response = await fetch(`/api/payments/verify-payment?session_id=${sessionId}`);
      
      if (!response.ok) throw new Error('Failed to verify payment status');
      
      const data = await response.json();
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000; 
      
      return data.status === 'succeeded' || data.status === 'failed' || data.status === 'cancelled' ? false : 2000;
    },
    staleTime: 1000,
    retry: 3,
  });
}

export function useApplicationByProperty(propertyId?: string) {
  const crud = useCrud<ApplicationBase>({
    resource: 'applications',
    interfaceType: 'buyer',
  });

  const queryParams = useMemo(() => {
    if (!propertyId) return null;
    
    return {
      filters: {
        property_id: propertyId,
      },
      limit: 1,
    };
  }, [propertyId]);

  const { data, isLoading, error } = crud.useGetAll(queryParams || undefined);

  const application = data?.data?.[0] || null;

  return {
    application,
    isLoading,
    error,
    ...crud,
  };
}


async function completeStageRequest(params: CompleteStageParams): Promise<ApplicationBase> {
  const { applicationId, stageType, stageData } = params;

  const response = await fetch(`/api/applications/${applicationId}/complete-stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stageType,
      stageData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to complete stage');
  }

  const result = await response.json();
  return result.data;
}

export function useStageCompletion(applicationId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: completeStageRequest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });

      const messages: Record<StageType, string> = {
        identity: 'Identity verification completed',
        property: 'Property selection completed',
        terms: 'Terms and agreement completed',
        payment: 'Payment setup completed',
        mortgage: 'Mortgage activated successfully',
      };

      toast.success(messages[variables.stageType]);
    },
    onError: (error: Error, variables) => {
      captureError(error, {
        component: `useStageCompletion for ${variables.stageType}` ,
        action: 'complete-stage',
      });

      toast.error(error.message || 'Failed to complete stage');
    },
  });

  return {
    completeStage: mutation.mutateAsync,
    isCompleting: mutation.isPending,
  };
}