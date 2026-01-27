import { ApplicationBase } from "@/type/pages/dashboard/application";
import { useCrud } from "../useCrud";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import apiClient from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/auth-provider";
import { useMemo } from "react";


export function useApplicationStatistics() {
  return useQuery({
    queryKey: queryKeys.applications.statistics(),
    queryFn: async () => {
      const response = await apiClient.get('/api/applications/statistics');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useApplications(params?: any) {
  const { user, loading: isUserLoading } = useAuthContext();

  const crud = useCrud<ApplicationBase>({
    resource: 'applications',
    interfaceType: 'buyer',
    optimisticUpdate: true,
    invalidateOnMutation: true,
  });

  const queryParams = useMemo(() => {
    if (!user?.id) return null; 
    
    return {
      ...params,
      filters: {
        ...params?.filters,
        user_id: user.id,
      },
    };
  }, [params, user?.id]);


  const { data, isLoading, error } = crud.useGetAll(
    queryParams || undefined, 
    !isUserLoading && !!user?.id 
  );

  return {
    applications: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading || isUserLoading,
    error,
    ...crud,
  };
  
}

export function useUpdateApplication() {
  const router = useRouter();
  
  const { update, isUpdating } = useCrud<ApplicationBase>({
    resource: 'applications',
    interfaceType: 'buyer',
    showNotifications: true,
    optimisticUpdate: false,
    onSuccess: {
      update: (data: ApplicationBase) => {
        toast.success('Application updated successfully!');
      },
    },
    onError: {
      update: (error) => {
        const message = error?.error?.message || 'Failed to update application';
        toast.error(message);
      },
    },
  });
  
  const updateApplication = async (
    id: string,
    data: Partial<ApplicationBase>,
    options?: {
      redirectOnSuccess?: boolean;
      redirectPath?: string;
      successMessage?: string;
    }
  ) => {
    const result = await update(id, data);
    
    if (options?.redirectOnSuccess && result) {
      const path = options.redirectPath || `/user-dashboard/applications`;
      router.push(path);
    }
    
    if (options?.successMessage) {
      toast.success(options.successMessage);
    }
    
    return result;
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
            type: data.type
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
        kyc_status: data.kyc_status,
        kyc_session_id: data.kyc_session_id,
        kyc_result: data.kyc_result,
        kyc_verified_at: new Date().toISOString(),
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
      terms_accepted_at: new Date().toISOString(),
      contract_signed_at: new Date().toISOString(),
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
      payment_method: data.payment_method,
      stripe_payment_method_id: data.stripe_payment_method_id,
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
          data
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

interface PaymentStatus {
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  amount: number;
  receipt_url: string | null;
  transaction_id?: string;
  payment_date?: string;
}

export function usePaymentStatus(sessionId: string | null) {
  return useQuery<PaymentStatus>({
    queryKey: ['payment-status', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID provided');
      
      const response = await fetch(`/api/stripe/verify-payment?session_id=${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to verify payment status');
      }
      
      const data = await response.json();
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000; 
      
      return data.status === 'succeeded' || data.status === 'failed' || data.status === 'cancelled' 
        ? false
        : 2000;
    },
    staleTime: 1000,
    retry: 3,
  });
}