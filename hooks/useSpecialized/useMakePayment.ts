import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'us_bank_account' | 'acss_debit';
  display: string;
  brand?: string;
  last4: string;
  isDefault: boolean;
}

interface CreatePaymentParams {
  mortgageId: string;
  paymentIds: string[];
  paymentMethodId?: string;
}

interface CreatePaymentResult {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  transaction_id?: string;
  status?: string;
  requires_action?: boolean;
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
  next_payment_date?: string | null;
}

interface FetchPaymentMethodsResult {
  payment_methods: SavedPaymentMethod[];
  default_payment_method_id?: string | null;
}

interface HandlePaymentActionResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export function useMakePayment() {
  const queryClient = useQueryClient();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFetchingMethods, setIsFetchingMethods] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);


  const fetchPaymentMethods = useCallback(async (
    mortgageId: string
  ): Promise<FetchPaymentMethodsResult> => {
    setIsFetchingMethods(true);
    setError(null);

    try {
      const response = await fetch(`/api/mortgages/${mortgageId}/payment-methods`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch payment methods');
      }

      const data = await response.json();
      setSavedPaymentMethods(data.payment_methods || []);
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payment methods';
      setError(message);
      console.error('Fetch payment methods error:', err);
      return { payment_methods: [] };
    } finally {
      setIsFetchingMethods(false);
    }
  }, []);


  const createPayment = useCallback(async (
    params: CreatePaymentParams
  ): Promise<CreatePaymentResult> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/mortgages/${params.mortgageId}/make-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_ids: params.paymentIds,
          payment_method_id: params.paymentMethodId,
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


  const payWithSavedMethod = useCallback(async (params: {
    mortgageId: string;
    paymentIds: string[];
    paymentMethodId: string;
  }): Promise<{ success: boolean; requiresAction: boolean; clientSecret?: string; paymentIntentId?: string }> => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await createPayment({
        mortgageId: params.mortgageId,
        paymentIds: params.paymentIds,
        paymentMethodId: params.paymentMethodId,
      });

      if (result.status === 'succeeded') {
        return {
          success: true,
          requiresAction: false,
          paymentIntentId: result.payment_intent_id,
        };
      }

      if (result.requires_action || result.status === 'requires_action' || result.status === 'requires_confirmation') {
        return {
          success: false,
          requiresAction: true,
          clientSecret: result.client_secret,
          paymentIntentId: result.payment_intent_id,
        };
      }

      if (result.status === 'processing') {
        return {
          success: true,
          requiresAction: false,
          paymentIntentId: result.payment_intent_id,
        };
      }

      return {
        success: false,
        requiresAction: true,
        clientSecret: result.client_secret,
        paymentIntentId: result.payment_intent_id,
      };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process payment';
      setError(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [createPayment]);


  const handlePaymentAction = useCallback(async (
    clientSecret: string,
    paymentIntentId: string
  ): Promise<HandlePaymentActionResult> => {
    setIsProcessingAction(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        return { success: false, error: confirmError.message };
      }

      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        return { success: true, paymentIntentId: paymentIntent.id };
      }

      setError('Payment was not completed');
      return { success: false, error: 'Payment was not completed' };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment action failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsProcessingAction(false);
    }
  }, []);


  const confirmPayment = useCallback(async (
    params: ConfirmPaymentParams
  ): Promise<ConfirmPaymentResult> => {
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

      if (result.success) {
        toast.success(
          params.paymentIds.length > 1
            ? `${params.paymentIds.length} payments completed successfully!`
            : 'Payment completed successfully!'
        );

        queryClient.invalidateQueries({ queryKey: ['mortgages', params.mortgageId] });
        queryClient.invalidateQueries({ queryKey: ['mortgage-payments'] });
        queryClient.invalidateQueries({ queryKey: ['mortgages'] });
      }

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
    setIsFetchingMethods(false);
    setIsProcessingAction(false);
    setSavedPaymentMethods([]);
    setError(null);
  }, []);


  return {
    fetchPaymentMethods,
    savedPaymentMethods,
    isFetchingMethods,

    createPayment,
    isCreating,

    payWithSavedMethod,

    handlePaymentAction,
    isProcessingAction,

    confirmPayment,
    isConfirming,

    error,
    clearError,
    reset,
  };
}

export type { SavedPaymentMethod, CreatePaymentResult, ConfirmPaymentResult };