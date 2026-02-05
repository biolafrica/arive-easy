'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import * as stripes from '@stripe/react-stripe-js';
import { Button } from "@/components/primitives/Button";
import * as icon from "@heroicons/react/24/outline";
import { formatUSD } from "@/lib/formatter";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ============================================
// TYPES
// ============================================

interface DirectDebitPaymentFormProps {
  clientSecret: string;
  applicationId: string;
  userCountry: string;
  monthlyAmount: number;
  onConfirm: (setupIntentId: string, paymentMethodId: string, status: 'succeeded' | 'processing') => Promise<void>;
  onBack: () => void;
  isConfirming: boolean;
}

// ============================================
// MAIN COMPONENT (Stripe Elements Wrapper)
// ============================================

export function DirectDebitPaymentForm({
  clientSecret,
  applicationId,
  userCountry,
  monthlyAmount,
  onConfirm,
  onBack,
  isConfirming,
}: DirectDebitPaymentFormProps) {

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '8px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #d1d5db',
        boxShadow: 'none',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid #2563eb',
        boxShadow: '0 0 0 1px #2563eb',
      },
      '.Label': {
        fontWeight: '500',
        marginBottom: '8px',
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          disabled={isConfirming}
        >
          <icon.ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      {/* Payment Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <icon.ShieldCheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Secure Bank Connection</h4>
            <p className="text-sm text-blue-700 mt-1">
              {userCountry === 'CA'
                ? 'Connect your Canadian bank account using Pre-Authorized Debit (PAD).'
                : 'Connect your US bank account using ACH Direct Debit.'
              }
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Monthly payment: <span className="font-semibold">{formatUSD({ amount: monthlyAmount })}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stripe Elements */}
      <stripes.Elements stripe={stripePromise} options={options}>
        <DirectDebitForm
          applicationId={applicationId}
          userCountry={userCountry}
          onConfirm={onConfirm}
          isConfirming={isConfirming}
        />
      </stripes.Elements>

      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <icon.LockClosedIcon className="w-4 h-4" />
        <span>Your bank information is encrypted and secure</span>
      </div>
    </div>
  );
}

// ============================================
// INNER FORM COMPONENT (Uses Stripe Hooks)
// ============================================

interface DirectDebitFormProps {
  applicationId: string;
  userCountry: string;
  onConfirm: (setupIntentId: string, paymentMethodId: string, status: 'succeeded' | 'processing') => Promise<void>;
  isConfirming: boolean;
}

function DirectDebitForm({
  applicationId,
  userCountry,
  onConfirm,
  isConfirming
}: DirectDebitFormProps) {
  const stripe = stripes.useStripe();
  const elements = stripes.useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const isLoading = isProcessing || isConfirming;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Confirm the SetupIntent with Stripe
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/user-dashboard/applications`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Handle Stripe-side errors
        setErrorMessage(error.message || 'An error occurred while setting up your payment method.');
        setIsProcessing(false);
        return;
      }

      if (!setupIntent) {
        setErrorMessage('No setup intent returned. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Step 2: Handle based on SetupIntent status
      const paymentMethodId = setupIntent.payment_method as string;

      if (setupIntent.status === 'succeeded') {
        // Card or instant bank verification - fully confirmed
        await onConfirm(setupIntent.id, paymentMethodId, 'succeeded');
        
      } else if (setupIntent.status === 'processing') {
        // Bank debit (ACH/ACSS) - verification is asynchronous
        // The webhook will update the status when Stripe confirms
        await onConfirm(setupIntent.id, paymentMethodId, 'processing');
        
      } else if (setupIntent.status === 'requires_action') {
        // Additional authentication needed (shouldn't happen with redirect: 'if_required')
        setErrorMessage('Additional verification required. Please complete the verification process.');
        setIsProcessing(false);
        
      } else {
        // Unexpected status
        setErrorMessage(`Unexpected status: ${setupIntent.status}. Please try again.`);
        setIsProcessing(false);
      }

    } catch (err) {
      console.error('Setup error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to complete setup. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          {userCountry === 'CA' ? 'Canadian Bank Account' : 'US Bank Account'}
        </h3>

        <stripes.PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: 'tabs',
            paymentMethodOrder: userCountry === 'CA'
              ? ['acss_debit', 'card']
              : ['us_bank_account', 'card'],
          }}
        />
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Mandate Agreement */}
      <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
        <p className="font-medium text-gray-700 mb-2">Authorization Agreement</p>
        {userCountry === 'CA' ? (
          <p>
            By providing your bank account information and confirming this payment, you authorize
            Ariveasy and Stripe, our payment service provider, to debit your bank account for the
            monthly mortgage payment amount. You can cancel this authorization at any time by
            contacting us. Payments are processed on the agreed payment date each month.
          </p>
        ) : (
          <p>
            By providing your bank account information and confirming this payment, you authorize
            Ariveasy to debit your bank account via ACH for the monthly mortgage payment amount.
            You can cancel this authorization at any time by contacting us. Payments typically
            take 3-5 business days to process.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading || !isReady}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isConfirming ? 'Activating...' : 'Processing...'}
          </span>
        ) : (
          'Authorize Automatic Payments'
        )}
      </Button>
    </form>
  );
}