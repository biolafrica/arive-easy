import { useState } from "react";
import * as stripes from '@stripe/react-stripe-js';
import * as icon from "@heroicons/react/24/outline";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "@/components/primitives/Button";
import { formatDate, formatUSD } from "@/lib/formatter";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentGroup {
  id: string;
  paymentNumber: number;
  amount: number;
  dueDate: string;
  status: 'failed' | 'scheduled' | 'succeeded';
  isOverdue: boolean;
}

interface PaymentSelectViewProps {
  paymentList: PaymentGroup[];
  selectedPaymentIds: Set<string>;
  togglePayment: (id: string) => void;
  selectAllUpTo: (id: string) => void;
  paymentMethodDisplay?: string ;
}

interface PaymentConfirmViewProps {
  clientSecret: string;
  totalAmount: number;
  selectedPayments: PaymentGroup[];
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

export function PaymentSelectView({
  paymentList,
  selectedPaymentIds,
  togglePayment,
  selectAllUpTo,
  paymentMethodDisplay,
}: PaymentSelectViewProps) {

  if (paymentList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <icon.CheckCircleIcon className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
        <p className="text-gray-500 text-center">
          You have no pending payments at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <icon.InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Select one or more payments to process. The earliest payment is pre-selected.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Tip: Click "Select up to here" to select multiple consecutive payments.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {paymentList.map((payment) => {
          const isSelected = selectedPaymentIds.has(payment.id);
          const isFailed = payment.status === 'failed';
          const isOverdue = payment.isOverdue;

          return (
            <div
              key={payment.id}
              className={`relative rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : isFailed
                  ? 'border-red-200 bg-red-50'
                  : isOverdue
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => togglePayment(payment.id)}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <icon.CheckIcon className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      Payment #{payment.paymentNumber}
                    </span>
                    {isFailed && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Failed
                      </span>
                    )}
                    {isOverdue && !isFailed && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Due {formatDate(payment.dueDate)}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    isFailed ? 'text-red-700' : 'text-gray-900'
                  }`}>
                    {formatUSD({ amount: payment.amount })}
                  </p>
                </div>
              </button>

              {!isSelected && payment.paymentNumber > 1 && (
                <button
                  onClick={() => selectAllUpTo(payment.id)}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                >
                  Select up to here
                </button>
              )}
            </div>
          );
        })}
      </div>
  
    </div>
  );
}

export function PaymentConfirmView({
  clientSecret,
  totalAmount,
  selectedPayments,
  onSuccess,
  onBack,
}: PaymentConfirmViewProps) {
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      borderRadius: '8px',
    },
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <icon.ArrowLeftIcon className="w-4 h-4" />
        Back to selection
      </button>

      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <p className="text-sm text-blue-600 mb-1">Total Payment</p>
        <p className="text-3xl font-bold text-blue-700">
          {formatUSD({ amount: totalAmount })}
        </p>
        <p className="text-sm text-blue-500 mt-2">
          {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Payments included:</p>
        <div className="space-y-1">
          {selectedPayments.map(p => (
            <div key={p.id} className="flex justify-between text-sm">
              <span className="text-gray-600">Payment #{p.paymentNumber}</span>
              <span className="text-gray-900">{formatUSD({ amount: p.amount })}</span>
            </div>
          ))}
        </div>
      </div>

      <stripes.Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <PaymentForm onSuccess={onSuccess} />
      </stripes.Elements>
    </div>
  );
}

function PaymentForm({ onSuccess }: { onSuccess: (paymentIntentId: string) => void }) {
  const stripe = stripes.useStripe();
  const elements = stripes.useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    console.log('Stripe confirmPayment result:', { submitError, paymentIntent });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment was not completed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <stripes.PaymentElement />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </span>
        ) : (
          'Confirm Payment'
        )}
      </Button>
    </form>
  );
}

export function PaymentSuccessView({
  totalAmount,
  paymentCount,
  onClose,
}: {
  totalAmount: number;
  paymentCount: number;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <icon.CheckCircleIcon className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 text-center mb-2">
        Your payment of {formatUSD({ amount: totalAmount })} has been processed.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        {paymentCount} payment{paymentCount !== 1 ? 's' : ''} completed
      </p>
      <Button onClick={onClose} className="w-full max-w-xs">
        Done
      </Button>
    </div>
  );
}

export function PaymentErrorView({
  error,
  onRetry,
  onClose,
}: {
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-6">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <icon.XCircleIcon className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
      <p className="text-gray-600 text-center mb-8">
        {error || 'There was an error processing your payment. Please try again.'}
      </p>
      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onRetry} className="flex-1">
          Try Again
        </Button>
      </div>
    </div>
  );
}