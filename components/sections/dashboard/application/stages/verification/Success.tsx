'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePaymentStatus } from '@/hooks/useSpecialized/useApplications';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/primitives/Button';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const { data, isLoading, isError, error } = usePaymentStatus(sessionId);

  useEffect(() => {
    if (data?.status === 'failed' || data?.status === 'cancelled') {
      setTimeout(() => {
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/test/cancelled`);
      }, 3000);
    }
  }, [data?.status, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {isSuccessful ? (
            <>
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Payment Successful!
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Your ${(data.amount / 100).toFixed(2)} processing fee has been received.
              </p>
              
              {data.receipt_url && (
                <div className="mt-6">
                  <a 
                    href={data.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Download Receipt
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
              <XCircleIcon className="mx-auto h-12 w-12 text-yellow-500" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Payment {data?.status || 'Pending'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Your payment is currently being processed. Please check back later.
              </p>
            </>
          )}

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard/applications`)}
              className="w-full"
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

          <p className="mt-4 text-xs text-gray-500">
            A receipt has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  );
}