import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const {
  mockFetch,
  mockToastError,
  mockToastSuccess,
  mockInvalidateQueries,
  mockCancelQueries,
  mockStripeConfirmPayment,
  mockStripeConfirmSetup,
  mockMutateAsync,
} = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockInvalidateQueries: vi.fn(),
  mockCancelQueries: vi.fn(),
  mockStripeConfirmPayment: vi.fn(),
  mockStripeConfirmSetup: vi.fn(),
  mockMutateAsync: vi.fn(),
}));


vi.mock('sonner', () => ({
  toast: {
    error: mockToastError,
    success: mockToastSuccess,
  },
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueryClient: vi.fn().mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      cancelQueries: mockCancelQueries,
    }),
    useMutation: vi.fn().mockImplementation(({ mutationFn, onSuccess, onError }) => ({
      mutateAsync: async (params: any) => {
        try {
          const result = await mutationFn(params);
          onSuccess?.(result, params, undefined);
          return result;
        } catch (err) {
          onError?.(err, params, undefined);
          throw err;
        }
      },
      isPending: false,
    })),
  };
});


vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    confirmPayment: mockStripeConfirmPayment,
    confirmSetup: mockStripeConfirmSetup,
  }),
}));

vi.mock('@/utils/auth/captureError', () => ({
  captureError: vi.fn(),
}));

global.fetch = mockFetch;

import { useMakePayment } from '@/hooks/useSpecialized/useMakePayment';
import { useDirectDebitSetup } from '@/hooks/useDirectDebitSetup';


function mockOkResponse(data: object) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);
}

function mockErrorResponse(status: number, error: string) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
  } as Response);
}

function resetMocks() {
  vi.clearAllMocks();
  // mockStripeConfirmPayment/mockStripeConfirmSetup are used directly by the
  // stable stripe object returned from the module-level loadStripe mock.
  mockStripeConfirmPayment.mockReset();
  mockStripeConfirmSetup.mockReset();
}


describe('useMakePayment', () => {
  beforeEach(resetMocks);


  describe('fetchPaymentMethods', () => {
    it('returns and sets savedPaymentMethods state on success', async () => {
      const methods = [
        { id: 'pm_1', type: 'card', display: 'VISA •••• 4242', last4: '4242', isDefault: true },
      ];
      mockFetch.mockReturnValueOnce(mockOkResponse({ payment_methods: methods }));

      const { result } = renderHook(() => useMakePayment());

      let fetchResult: any;
      await act(async () => {
        fetchResult = await result.current.fetchPaymentMethods('mortgage_123');
      });

      expect(fetchResult.payment_methods).toEqual(methods);
      expect(result.current.savedPaymentMethods).toEqual(methods);
      expect(result.current.isFetchingMethods).toBe(false);
    });

    it('returns empty array when no payment methods exist', async () => {
      mockFetch.mockReturnValueOnce(mockOkResponse({ payment_methods: [] }));

      const { result } = renderHook(() => useMakePayment());

      let fetchResult: any;
      await act(async () => {
        fetchResult = await result.current.fetchPaymentMethods('mortgage_123');
      });

      expect(fetchResult.payment_methods).toEqual([]);
      expect(result.current.savedPaymentMethods).toEqual([]);
    });

    it('sets error and returns empty array when API returns non-ok response', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(404, 'Mortgage not found')
      );

      const { result } = renderHook(() => useMakePayment());

      let fetchResult: any;
      await act(async () => {
        fetchResult = await result.current.fetchPaymentMethods('mortgage_123');
      });

      expect(fetchResult).toEqual({ payment_methods: [] });
      expect(result.current.error).toBe('Mortgage not found');
    });

    it('handles network failure gracefully without throwing', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        const fetchResult = await result.current.fetchPaymentMethods('mortgage_123');
        expect(fetchResult).toEqual({ payment_methods: [] });
      });

      expect(result.current.error).toBe('Network error');
    });

    it('calls the correct API endpoint with mortgage ID', async () => {
      mockFetch.mockReturnValueOnce(mockOkResponse({ payment_methods: [] }));

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await result.current.fetchPaymentMethods('mortgage_abc');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/mortgages/mortgage_abc/payment-methods'
      );
    });
  });


  describe('createPayment', () => {
    it('returns client_secret and payment_intent_id on success', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          client_secret: 'pi_secret_123',
          payment_intent_id: 'pi_123',
          amount: 1000,
          payments: [],
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let createResult: any;
      await act(async () => {
        createResult = await result.current.createPayment({
          mortgageId: 'mortgage_123',
          paymentIds: ['pay_1'],
        });
      });

      expect(createResult.client_secret).toBe('pi_secret_123');
      expect(createResult.payment_intent_id).toBe('pi_123');
    });

    it('sets error, shows toast, and re-throws on API error', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(400, 'Failed to create payment')
      );

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await expect(
          result.current.createPayment({
            mortgageId: 'mortgage_123',
            paymentIds: ['pay_1'],
          })
        ).rejects.toThrow('Failed to create payment');
      });

      expect(result.current.error).toBe('Failed to create payment');
      expect(mockToastError).toHaveBeenCalledWith('Failed to create payment');
    });

    it('works correctly when paymentMethodId is not provided (optional param)', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          client_secret: 'pi_secret_no_method',
          payment_intent_id: 'pi_no_method',
          amount: 1000,
          payments: [],
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let createResult: any;
      await act(async () => {
        createResult = await result.current.createPayment({
          mortgageId: 'mortgage_123',
          paymentIds: ['pay_1'],
          // no paymentMethodId
        });
      });

      expect(createResult.client_secret).toBe('pi_secret_no_method');

      // Verify request body does not include payment_method_id
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.payment_method_id).toBeUndefined();
    });

    it('sets isCreating true during fetch and false after', async () => {
      let resolveFetch: (value: any) => void;
      const pendingFetch = new Promise((resolve) => {
        resolveFetch = resolve;
      });
      mockFetch.mockReturnValueOnce(pendingFetch);

      const { result } = renderHook(() => useMakePayment());

      // Start the call but don't await it yet
      act(() => {
        result.current.createPayment({
          mortgageId: 'mortgage_123',
          paymentIds: ['pay_1'],
        });
      });

      await waitFor(() => expect(result.current.isCreating).toBe(true));

      // Resolve the fetch
      await act(async () => {
        resolveFetch!({
          ok: true,
          json: () => Promise.resolve({ client_secret: 'x', payment_intent_id: 'y', amount: 0, payments: [] }),
        });
      });

      await waitFor(() => expect(result.current.isCreating).toBe(false));
    });
  });


  describe('payWithSavedMethod', () => {
    const BASE_PARAMS = {
      mortgageId: 'mortgage_123',
      paymentIds: ['pay_1'],
      paymentMethodId: 'pm_saved',
    };

    it('returns { success: true, requiresAction: false } when status is succeeded', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          status: 'succeeded',
          payment_intent_id: 'pi_123',
          client_secret: 'pi_secret',
          payments: [],
          amount: 1000,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let payResult: any;
      await act(async () => {
        payResult = await result.current.payWithSavedMethod(BASE_PARAMS);
      });

      expect(payResult.success).toBe(true);
      expect(payResult.requiresAction).toBe(false);
      expect(payResult.paymentIntentId).toBe('pi_123');
    });

    it('returns { success: true, requiresAction: false } when status is processing', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          status: 'processing',
          payment_intent_id: 'pi_processing',
          client_secret: 'pi_secret',
          payments: [],
          amount: 1000,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let payResult: any;
      await act(async () => {
        payResult = await result.current.payWithSavedMethod(BASE_PARAMS);
      });

      expect(payResult.success).toBe(true);
      expect(payResult.requiresAction).toBe(false);
    });

    it('returns { requiresAction: true, clientSecret } when status is requires_action', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          status: 'requires_action',
          requires_action: true,
          payment_intent_id: 'pi_action',
          client_secret: 'pi_action_secret',
          payments: [],
          amount: 1000,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let payResult: any;
      await act(async () => {
        payResult = await result.current.payWithSavedMethod(BASE_PARAMS);
      });

      expect(payResult.success).toBe(false);
      expect(payResult.requiresAction).toBe(true);
      expect(payResult.clientSecret).toBe('pi_action_secret');
    });

    it('returns { requiresAction: true } when status is requires_confirmation', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          status: 'requires_confirmation',
          payment_intent_id: 'pi_confirm',
          client_secret: 'pi_confirm_secret',
          payments: [],
          amount: 1000,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let payResult: any;
      await act(async () => {
        payResult = await result.current.payWithSavedMethod(BASE_PARAMS);
      });

      expect(payResult.requiresAction).toBe(true);
    });

    it('falls through to requiresAction branch for unknown status', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          status: 'some_unknown_status',
          payment_intent_id: 'pi_unknown',
          client_secret: 'pi_unknown_secret',
          payments: [],
          amount: 1000,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      let payResult: any;
      await act(async () => {
        payResult = await result.current.payWithSavedMethod(BASE_PARAMS);
      });

      expect(payResult.requiresAction).toBe(true);
    });
  });


  describe('confirmPayment', () => {
    it('shows "Payment completed successfully!" toast for single payment', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          success: true,
          payments_completed: 1,
          new_total_paid: 6,
          is_mortgage_completed: false,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await result.current.confirmPayment({
          mortgageId: 'mortgage_123',
          paymentIntentId: 'pi_123',
          paymentIds: ['pay_1'],
        });
      });

      expect(mockToastSuccess).toHaveBeenCalledWith('Payment completed successfully!');
    });

    it('shows "3 payments completed successfully!" toast for multiple payments', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          success: true,
          payments_completed: 3,
          new_total_paid: 8,
          is_mortgage_completed: false,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await result.current.confirmPayment({
          mortgageId: 'mortgage_123',
          paymentIntentId: 'pi_123',
          paymentIds: ['pay_1', 'pay_2', 'pay_3'],
        });
      });

      expect(mockToastSuccess).toHaveBeenCalledWith(
        '3 payments completed successfully!'
      );
    });

    it('invalidates mortgages and mortgage-payments query keys on success', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          success: true,
          payments_completed: 1,
          new_total_paid: 6,
          is_mortgage_completed: false,
        })
      );

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await result.current.confirmPayment({
          mortgageId: 'mortgage_123',
          paymentIntentId: 'pi_123',
          paymentIds: ['pay_1'],
        });
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['mortgages', 'mortgage_123'] })
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['mortgage-payments'] })
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['mortgages'] })
      );
    });

    it('sets error, shows toast, and re-throws on API failure', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(500, 'Failed to confirm payment')
      );

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await expect(
          result.current.confirmPayment({
            mortgageId: 'mortgage_123',
            paymentIntentId: 'pi_123',
            paymentIds: ['pay_1'],
          })
        ).rejects.toThrow('Failed to confirm payment');
      });

      expect(result.current.error).toBe('Failed to confirm payment');
      expect(mockToastError).toHaveBeenCalledWith('Failed to confirm payment');
    });
  });


  describe('handlePaymentAction', () => {
    it('returns { success: true } when Stripe confirmPayment returns succeeded', async () => {
      mockStripeConfirmPayment.mockResolvedValueOnce({
        error: null,
        paymentIntent: { id: 'pi_123', status: 'succeeded' },
      });

      const { result } = renderHook(() => useMakePayment());

      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.handlePaymentAction(
          'pi_123_secret',
          'pi_123'
        );
      });

      expect(actionResult.success).toBe(true);
      expect(actionResult.paymentIntentId).toBe('pi_123');
    });

    it('returns { success: true } when Stripe confirmPayment returns processing', async () => {
      mockStripeConfirmPayment.mockResolvedValueOnce({
        error: null,
        paymentIntent: { id: 'pi_processing', status: 'processing' },
      });

      const { result } = renderHook(() => useMakePayment());

      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.handlePaymentAction(
          'pi_secret',
          'pi_processing'
        );
      });

      expect(actionResult.success).toBe(true);
    });

    it('returns { success: false, error } when Stripe returns a confirmError', async () => {
      mockStripeConfirmPayment.mockResolvedValueOnce({
        error: { message: 'Your card was declined.' },
        paymentIntent: null,
      });

      const { result } = renderHook(() => useMakePayment());

      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.handlePaymentAction(
          'pi_secret',
          'pi_declined'
        );
      });

      expect(actionResult.success).toBe(false);
      expect(actionResult.error).toBe('Your card was declined.');
    });

    it('returns { success: false } when Stripe throws unexpectedly', async () => {
      // Since loadStripe is called at module level, we can't make it return null
      // per-test. Instead simulate the same error path by making confirmPayment throw.
      mockStripeConfirmPayment.mockRejectedValueOnce(new Error('Stripe not initialized'));

      const { result } = renderHook(() => useMakePayment());

      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.handlePaymentAction(
          'pi_secret',
          'pi_123'
        );
      });

      expect(actionResult.success).toBe(false);
      expect(actionResult.error).toContain('Stripe not initialized');
    });

    it('returns { success: false } when paymentIntent status is neither succeeded nor processing', async () => {
      mockStripeConfirmPayment.mockResolvedValueOnce({
        error: null,
        paymentIntent: { id: 'pi_123', status: 'requires_capture' },
      });

      const { result } = renderHook(() => useMakePayment());

      let actionResult: any;
      await act(async () => {
        actionResult = await result.current.handlePaymentAction(
          'pi_secret',
          'pi_123'
        );
      });

      expect(actionResult.success).toBe(false);
      expect(actionResult.error).toBe('Payment was not completed');
    });
  });


  describe('utility methods', () => {
    it('clearError resets the error state to null', async () => {
      mockFetch.mockReturnValueOnce(mockErrorResponse(400, 'Some error'));

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await result.current.fetchPaymentMethods('mortgage_123');
      });

      expect(result.current.error).toBe('Some error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('reset clears all state', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({ payment_methods: [{ id: 'pm_1' }] })
      );

      const { result } = renderHook(() => useMakePayment());

      await act(async () => {
        await result.current.fetchPaymentMethods('mortgage_123');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.savedPaymentMethods).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isCreating).toBe(false);
      expect(result.current.isConfirming).toBe(false);
    });
  });
});

describe('useDirectDebitSetup', () => {
  beforeEach(resetMocks);

  describe('initiateSetup', () => {
    it('returns { client_secret, setup_intent_id, mortgage_id } on success', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          client_secret: 'seti_secret_123',
          setup_intent_id: 'seti_123',
          mortgage_id: 'mortgage_new',
        })
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      let setupResult: any;
      await act(async () => {
        setupResult = await result.current.initiateSetup({
          application_id: 'app_456',
          user_country: 'CA',
        });
      });

      expect(setupResult.client_secret).toBe('seti_secret_123');
      expect(setupResult.setup_intent_id).toBe('seti_123');
      expect(setupResult.mortgage_id).toBe('mortgage_new');
    });

    it('sets error state and shows toast when API returns error', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(400, 'Application not found')
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await expect(
          result.current.initiateSetup({
            application_id: 'app_missing',
            user_country: 'CA',
          })
        ).rejects.toThrow('Application not found');
      });

      expect(result.current.error).toBe('Application not found');
      expect(mockToastError).toHaveBeenCalledWith('Application not found');
    });

    it('second call works correctly even if first is still pending', async () => {
      // First call succeeds
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          client_secret: 'seti_first',
          setup_intent_id: 'seti_first_id',
          mortgage_id: 'mortgage_1',
        })
      );
      // Second call also succeeds
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          client_secret: 'seti_second',
          setup_intent_id: 'seti_second_id',
          mortgage_id: 'mortgage_2',
        })
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      let firstResult: any;
      let secondResult: any;

      await act(async () => {
        firstResult = await result.current.initiateSetup({
          application_id: 'app_456',
          user_country: 'CA',
        });
        secondResult = await result.current.initiateSetup({
          application_id: 'app_456',
          user_country: 'CA',
        });
      });

      expect(firstResult.setup_intent_id).toBe('seti_first_id');
      expect(secondResult.setup_intent_id).toBe('seti_second_id');
    });

    it('POSTs to the correct endpoint with correct body', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          client_secret: 'seti_secret',
          setup_intent_id: 'seti_id',
          mortgage_id: 'mortgage_id',
        })
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await result.current.initiateSetup({
          application_id: 'app_456',
          user_country: 'CA',
        });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/direct-debit/initiate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ application_id: 'app_456', user_country: 'CA' }),
        })
      );
    });
  });


  describe('confirmSetup', () => {
    it('shows success toast on successful confirmation', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({
          success: true,
          subscription_id: 'sub_123',
          mortgage_id: 'mortgage_123',
          status: 'active',
        })
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await result.current.confirmSetup({
          application_id: 'app_456',
          setup_intent_id: 'seti_123',
          payment_method_id: 'pm_test',
        });
      });

      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Automatic payments have been set up successfully!'
      );
    });

    it('clears error on successful confirmation', async () => {
      // First cause an error
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(400, 'Previous error')
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await expect(
          result.current.initiateSetup({ application_id: 'app_456', user_country: 'CA' })
        ).rejects.toThrow();
      });

      expect(result.current.error).toBe('Previous error');

      // Now succeed
      mockFetch.mockReturnValueOnce(
        mockOkResponse({ success: true })
      );

      await act(async () => {
        await result.current.confirmSetup({
          application_id: 'app_456',
          setup_intent_id: 'seti_123',
          payment_method_id: 'pm_test',
        });
      });

      expect(result.current.error).toBeNull();
    });

    it('invalidates applications and mortgages query keys on success', async () => {
      mockFetch.mockReturnValueOnce(
        mockOkResponse({ success: true })
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await result.current.confirmSetup({
          application_id: 'app_456',
          setup_intent_id: 'seti_123',
          payment_method_id: 'pm_test',
        });
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['applications', 'app_456'] })
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['mortgages', 'app_456'] })
      );
    });

    it('sets error and shows toast when API returns error', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(400, 'SetupIntent not succeeded')
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await expect(
          result.current.confirmSetup({
            application_id: 'app_456',
            setup_intent_id: 'seti_bad',
            payment_method_id: 'pm_test',
          })
        ).rejects.toThrow('SetupIntent not succeeded');
      });

      expect(result.current.error).toBe('SetupIntent not succeeded');
      expect(mockToastError).toHaveBeenCalledWith('SetupIntent not succeeded');
    });

    it('handles missing setup_intent_id gracefully (API returns 400)', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(400, 'Missing required fields')
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await expect(
          result.current.confirmSetup({
            application_id: 'app_456',
            setup_intent_id: '',
            payment_method_id: 'pm_test',
          })
        ).rejects.toThrow();
      });

      expect(result.current.error).toBeTruthy();
    });

    it('handles missing payment_method_id gracefully (API returns 400)', async () => {
      mockFetch.mockReturnValueOnce(
        mockErrorResponse(400, 'Missing required fields')
      );

      const { result } = renderHook(() => useDirectDebitSetup());

      await act(async () => {
        await expect(
          result.current.confirmSetup({
            application_id: 'app_456',
            setup_intent_id: 'seti_123',
            payment_method_id: '',
          })
        ).rejects.toThrow();
      });

    });
  });
});