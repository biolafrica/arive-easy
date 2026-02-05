import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface InitiateSetupParams {
  application_id: string;
  user_country: string;
}

interface SetupResult {
  client_secret: string;
  setup_intent_id: string;
  mortgage_id: string;
}

interface ConfirmSetupParams {
  application_id: string;
  setup_intent_id: string;
  payment_method_id: string;
}

export function useDirectDebitSetup() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Mutation to initiate direct debit setup
  const initiateMutation = useMutation({
    mutationFn: async (params: InitiateSetupParams): Promise<SetupResult> => {
      const response = await fetch('/api/direct-debit/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate setup');
      }

      return response.json();
    },
    onSuccess: () => {
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  // Mutation to confirm setup after payment method is added
  const confirmMutation = useMutation({
    mutationFn: async (params: ConfirmSetupParams) => {
      const response = await fetch('/api/direct-debit/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm setup');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setError(null);
      toast.success('Automatic payments have been set up successfully!');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['applications', variables.application_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['mortgages', variables.application_id] 
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  return {
    // Initiate setup
    initiateSetup: initiateMutation.mutateAsync,
    isInitiating: initiateMutation.isPending,
    setupData: initiateMutation.data,

    // Confirm setup
    confirmSetup: confirmMutation.mutateAsync,
    isConfirming: confirmMutation.isPending,

    // Error state
    error,
    clearError: () => setError(null),
  };
}

// Hook for fetching mortgage/direct debit status
export function useMortgageStatus(applicationId: string) {
  const queryClient = useQueryClient();

  const fetchStatus = async () => {
    const response = await fetch(`/api/mortgages?application_id=${applicationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch mortgage status');
    }
    return response.json();
  };

  return {
    refetch: () => queryClient.invalidateQueries({ 
      queryKey: ['mortgages', applicationId] 
    }),
  };
}