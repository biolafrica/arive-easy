'use client'

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePlaidLink } from 'react-plaid-link';
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { VerificationActionCard } from "./ActionCard";

export interface Response {
  url: string;
  sessionId: string;
}

interface VerificationClientViewProps {
  hasPaid: boolean;
  application_id: string;
  verificationStatus?: string;
  onStatusUpdate?: () => void;
}

export default function VerificationClientView({ 
  hasPaid, 
  application_id,
  verificationStatus = 'not_started',
  onStatusUpdate
}: VerificationClientViewProps) {

  const router = useRouter();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [currentVerificationStatus, setCurrentVerificationStatus] = useState(verificationStatus);

  const onPay = async () => {
    setPaymentError(null);
    setIsPaymentLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: application_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create payment session');
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const { url, sessionId } = await response.json();

      if (!url) {
        throw new Error('No checkout URL received');
      }

      window.location.href = url;
      
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err instanceof Error ? err.message : 'Payment failed');
      setPaymentError(err instanceof Error ? err.message : 'Payment failed');
      setIsPaymentLoading(false);
    }
  };

  const createLinkToken = useCallback(async () => {
    setIsVerificationLoading(true);
    try {
      const response = await fetch('/api/plaid/create-identity-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create verification session');
      }

      const data = await response.json();
      setLinkToken(data.linkToken);
      
    } catch (error) {
      console.error('Error creating link token:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start verification');
      setIsVerificationLoading(false);
    }
  }, [application_id]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: useCallback(
      async (public_token: string, metadata: any) => {
        console.log('Verification success:', metadata);
        
        // Update local status
        setCurrentVerificationStatus('pending');
        toast.success('Identity verification submitted successfully! We\'ll notify you once it\'s complete.');
        
        // Call parent callback if provided
        if (onStatusUpdate) {
          onStatusUpdate();
        }

        // Start polling for status updates
        pollVerificationStatus();
      },
      [onStatusUpdate]
    ),
    onEvent: useCallback((eventName: string, metadata: any) => {
      console.log('Plaid event:', eventName, metadata);
      
      if (eventName === 'ERROR') {
        toast.error('An error occurred during verification');
      }
    }, []),
    onExit: useCallback((err: any, metadata: any) => {
      console.log('Plaid exit:', err, metadata);
      
      if (err) {
        toast.error('Verification was cancelled or encountered an error');
      }
      
      // Clear link token so user can retry
      setLinkToken(null);
      setIsVerificationLoading(false);
    }, []),
  });

  const pollVerificationStatus = useCallback(async () => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 5 minutes max
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/plaid/check-status?applicationId=${application_id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setCurrentVerificationStatus('success');
          toast.success('Identity verified successfully! 🎉');
          clearInterval(poll);
          if (onStatusUpdate) onStatusUpdate();
          // Optionally redirect or refresh
          setTimeout(() => {
            router.refresh();
          }, 2000);
        } else if (data.status === 'failed') {
          setCurrentVerificationStatus('failed');
          toast.error('Identity verification failed. Please try again.');
          clearInterval(poll);
          if (onStatusUpdate) onStatusUpdate();
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          toast.info('Verification is taking longer than expected. We\'ll notify you via email once it\'s complete.');
        }
      } catch (error) {
        console.error('Error polling status:', error);
        if (attempts >= 3) {
          clearInterval(poll);
        }
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(poll);
  }, [application_id, onStatusUpdate, router]);

  const onVerify = async () => {
    if (linkToken && ready) {
      open();
    } else {
      await createLinkToken();
    }
  };

  useEffect(() => {
    if (linkToken && ready && isVerificationLoading) {
      open();
      setIsVerificationLoading(false);
    }
  }, [linkToken, ready, open, isVerificationLoading]);


  const getVerificationActionLabel = () => {
    switch (currentVerificationStatus) {
      case 'success':
        return 'Verification Completed';
      case 'pending':
        return 'Verification in Progress';
      case 'failed':
        return 'Retry Verification';
      default:
        return 'Start Verification';
    }
  };

  const isVerificationDisabled = () => {
    return !hasPaid || currentVerificationStatus === 'success' || currentVerificationStatus === 'pending' || isVerificationLoading;
  };

  return (
    <div className="space-y-6">

      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{paymentError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <VerificationActionCard
          title="Pay Verification Fee"
          description="Complete the one-time processing fee to unlock identity verification."
          actionLabel={hasPaid ? 'Payment Completed' : 'Pay $100'}
          onAction={onPay}
          disabled={hasPaid || isPaymentLoading}
          isLoading={isPaymentLoading}
          isCompleted={hasPaid}
        />

        <VerificationActionCard
          title="Verify Your Identity"
          description="Verify your identity securely once payment is confirmed."
          actionLabel={getVerificationActionLabel()}
          onAction={onVerify}
          disabled={isVerificationDisabled()}
          isLoading={isVerificationLoading}
          isCompleted={currentVerificationStatus === 'success'}
        />
      </div>

      {currentVerificationStatus === 'pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <ArrowPathIcon className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-blue-900">Verification in Progress</p>
            <p className="text-sm text-blue-700 mt-1">
              This usually takes a few minutes. We'll notify you once it's complete.
            </p>
          </div>
        </div>
      )}

      {currentVerificationStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900">✓ Identity Verified Successfully</p>
          <p className="text-sm text-green-700 mt-1">
            Your identity has been verified. Your application is now under review.
          </p>
        </div>
      )}

      {currentVerificationStatus === 'failed' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-900">Verification Failed</p>
          <p className="text-sm text-amber-700 mt-1">
            Please try again with clear photos of your ID and ensure all information matches your application.
          </p>
        </div>
      )}

    </div>
  );
}