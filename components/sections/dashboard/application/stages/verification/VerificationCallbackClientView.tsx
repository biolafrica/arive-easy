'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function VerificationCallbackClientView({applicationId}:{applicationId:string}){
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [message, setMessage] = useState('Checking verification status...');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/didit/check-status?applicationId=${applicationId}`);
        const data = await response.json();

        if (!data.success) {
          setStatus('failed');
          setMessage('Unable to check verification status. Please return to your application.');
          return;
        }

        if (data.overall_status === 'approved') {
          setStatus('success');
          setMessage('Your identity has been verified successfully!');
        } else if (data.overall_status === 'failed') {
          setStatus('failed');
          setMessage('Verification could not be completed. Please try again.');
        } else if (
          data.home_country_status === 'in_progress' ||
          data.immigration_status === 'in_progress' ||
          data.home_country_status === 'in_review' ||
          data.immigration_status === 'in_review'
        ) {
          setStatus('pending');
          setMessage('Verification is being processed. You can close this window and return to your application.');
        } else {
          setStatus('pending');
          setMessage('Please return to your application to continue verification.');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatus('failed');
        setMessage('An error occurred. Please return to your application.');
      }
    };

    setTimeout(checkStatus, 2000);
  }, [applicationId]);

  const handleReturn = () => {
    router.push(`/user-dashboard/applications`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <ArrowPathIcon className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Verification
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Verification Complete
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={handleReturn} className="w-full">
              Return to Application
            </Button>
          </>
        )}

        {status === 'pending' && (
          <>
            <ArrowPathIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Verification In Progress
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={handleReturn} className="w-full">
              Return to Application
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Verification Issue
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={handleReturn} className="w-full">
              Return to Application
            </Button>
          </>
        )}
      </div>
    </div>
  );
}