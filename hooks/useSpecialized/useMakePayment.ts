
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CreatePaymentParams {
  mortgageId: string;
  paymentIds: string[];
}

interface CreatePaymentResult {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  transaction_id: string;
  payments: {
    id: string;
    payment_number: number;
    amount: number;
    due_date: string;
  }[];
}

interface ConfirmPaymentParams {
  mortgageId: string;
  paymentIntentId: string;
  paymentIds: string[];
}

interface ConfirmPaymentResult {
  success: boolean;
  payments_completed: number;
  new_total_paid: number;
  is_mortgage_completed: boolean;
}



export function useMakePayment() {

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (params: CreatePaymentParams): Promise<CreatePaymentResult> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/mortgages/${params.mortgageId}/make-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_ids: params.paymentIds,
        }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Confirm payment after Stripe processes it
  const confirmPayment = useCallback(async (params: ConfirmPaymentParams): Promise<ConfirmPaymentResult> => {
    setIsConfirming(true);
    setError(null);

    try {
      const response = await fetch(`/api/mortgages/${params.mortgageId}/make-payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent_id: params.paymentIntentId,
          payment_ids: params.paymentIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm payment');
      }

      const result = await response.json();
      console.log('Payment confirmation result:', result);

      toast.success(`Payment${params.paymentIds.length > 1 ? 's' : ''} completed successfully!`);

      queryClient.invalidateQueries({ queryKey: ['mortgages', params.mortgageId] });
      queryClient.invalidateQueries({ queryKey: ['mortgage-payments', params.mortgageId] });
      queryClient.invalidateQueries({ queryKey: ['mortgages'] });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm payment';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsConfirming(false);
    }
  }, [queryClient]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsCreating(false);
    setIsConfirming(false);
    setError(null);
  }, []);

  return {
    createPayment,
    isCreating,
    confirmPayment,
    isConfirming,
    error,
    clearError,
    reset,
  };
}