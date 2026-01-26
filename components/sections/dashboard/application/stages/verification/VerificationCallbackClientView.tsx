'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  applicationId: string;
}

export default function VerificationCallbackClientView({ applicationId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'partial' | 'pending' | 'failed'>('loading');
  const [message, setMessage] = useState('Checking verification status...');
  const [subMessage, setSubMessage] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Give webhook time to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch(`/api/didit/check-status?applicationId=${applicationId}`);
        const data = await response.json();

        if (!data.success) {
          setStatus('failed');
          setMessage('Unable to check verification status.');
          setSubMessage('Please return to your application to see the current status.');
          return;
        }

        const { home_country_status, immigration_status, overall_status } = data;

        if (overall_status === 'approved') {
          setStatus('success');
          setMessage('Identity Verification Complete! 🎉');
          setSubMessage('Both your home country ID and immigration ID have been verified. You can now proceed to the next step.');
        } else if (overall_status === 'failed') {
          setStatus('failed');
          setMessage('Verification Failed');
          setSubMessage(data.error_message || 'Please return to your application to retry the verification.');
        } else if (home_country_status === 'approved' && immigration_status !== 'approved') {
          setStatus('partial');
          setMessage('Home Country ID Verified ✓');
          setSubMessage('Great progress! Now verify your immigration ID to complete the process.');
        } else if (immigration_status === 'approved' && home_country_status !== 'approved') {
          setStatus('partial');
          setMessage('Immigration ID Verified ✓');
          setSubMessage('Great progress! Now verify your home country ID to complete the process.');
        } else if (home_country_status === 'in_review' || immigration_status === 'in_review') {
          setStatus('pending');
          setMessage('Verification Under Review');
          setSubMessage('Your documents are being reviewed. We\'ll notify you via email once complete.');
        } else if (home_country_status === 'declined' || immigration_status === 'declined') {
          setStatus('failed');
          setMessage('Verification Needs Attention');
          setSubMessage('One of your verifications was not successful. Please return to retry with clearer documents.');
        } else {
          setStatus('pending');
          setMessage('Verification Processing');
          setSubMessage('Please return to your application to check the status or continue verification.');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatus('failed');
        setMessage('An error occurred');
        setSubMessage('Please return to your application.');
      }
    };

    checkStatus();
  }, [applicationId]);

  const handleReturn = () => {
    router.push(`/user-dashboard/applications/${applicationId}`);
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <ArrowPathIcon className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />;
      case 'success':
        return <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />;
      case 'partial':
        return <CheckCircleIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />;
      case 'pending':
        return <ArrowPathIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />;
      case 'failed':
        return <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'partial':
        return 'Continue Verification';
      case 'success':
        return 'Continue to Next Step';
      default:
        return 'Return to Application';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {getIcon()}
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h1>
        
        {subMessage && (
          <p className="text-gray-600 mb-6">{subMessage}</p>
        )}
        
        {status !== 'loading' && (
          <Button onClick={handleReturn} className="w-full">
            {getButtonText()}
          </Button>
        )}
      </div>
    </div>
  );
}