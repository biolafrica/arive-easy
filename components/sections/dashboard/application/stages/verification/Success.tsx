'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePaymentStatus } from '@/hooks/useSpecialized/useApplications';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/primitives/Button';
import { PAYMENT_TYPES, PaymentType } from '@/data/pages/dashboard/transaction';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const paymentType = (searchParams.get('type') || 'processing_fee') as PaymentType;
  
  const { data, isLoading, isError, error } = usePaymentStatus(sessionId);

  const paymentConfig = PAYMENT_TYPES[paymentType] || PAYMENT_TYPES.processing_fee;

  useEffect(() => {
    if (data?.status === 'failed' || data?.status === 'cancelled') {
      setTimeout(() => {
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/payment-cancelled?type=${paymentType}`);
      }, 3000);
    }
  }, [data?.status, router, paymentType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">
            Verifying your {paymentType.replace('_', ' ')} payment...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Payment Verification Failed
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {error instanceof Error ? error.message : 'Unable to verify payment status'}
            </p>
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/`)}
              className="mt-6 w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isSuccessful = data?.status === 'succeeded';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {isSuccessful ? (
            <>
              <div className="relative mb-6">
                <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500" />
                <div className={`absolute -bottom-2 -right-2 p-2 bg-white rounded-full border-2 border-white shadow-lg ${paymentConfig.bgColor}`}>
                  <paymentConfig.icon className={`h-6 w-6 ${paymentConfig.iconColor}`} />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {paymentConfig.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {paymentConfig.description}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-gray-500">Amount Paid:</span>
                    <p className="font-semibold text-lg">${(data.amount / 100).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">Payment Type:</span>
                    <p className="font-semibold capitalize">
                      {paymentType.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-500">Status:</span>
                    <p className="font-semibold text-green-600">
                      {paymentType === 'escrow' ? 'Secured' : 'Completed'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">Date:</span>
                    <p className="font-semibold">
                      {new Date(data.payment_date || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg text-left mb-6 ${paymentConfig.bgColor} ${paymentConfig.borderColor} border`}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <paymentConfig.icon className={`h-5 w-5 mr-2 ${paymentConfig.iconColor}`} />
                  What happens next:
                </h3>
                <ul className="space-y-2">
                  {paymentConfig.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className={`mr-2 mt-1 ${paymentConfig.iconColor}`}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {data.receipt_url && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <a 
                    href={data.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Official Receipt
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
              <XCircleIcon className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment {data?.status || 'Pending'}
              </h1>
              <p className="text-gray-600 mb-6">
                Your {paymentType.replace('_', ' ')} payment is currently being processed. Please check back later.
              </p>
            </>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/applications`)}
              className="w-full"
              size="lg"
            >
              View Application Status
            </Button>
            
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/`)}
              variant="outline"
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            {paymentConfig.emailMessage}
          </p>
        </div>
      </div>
    </div>
  );
}