'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { VerificationActionCard } from './ActionCard';
import { DiditVerificationStatus, IdentityVerificationData, VerificationType } from '@/type/common/didit';

interface VerificationClientViewProps {
  hasPaid: boolean;
  application_id: string;
  verificationData?: IdentityVerificationData;
  onStatusUpdate?: () => void;
}

export default function VerificationClientView({ 
  hasPaid, application_id, verificationData, onStatusUpdate,
}: VerificationClientViewProps) {

  const router = useRouter();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  const [homeCountryStatus, setHomeCountryStatus] = useState<DiditVerificationStatus>(
    verificationData?.home_country_status || 'not_started'
  );

  const [immigrationStatus, setImmigrationStatus] = useState<DiditVerificationStatus>(
    verificationData?.immigration_status || 'not_started'
  );

  const [overallStatus, setOverallStatus] = useState(
    verificationData?.overall_status || 'not_started'
  );
  
  const [isHomeCountryLoading, setIsHomeCountryLoading] = useState(false);
  const [isImmigrationLoading, setIsImmigrationLoading] = useState(false);

  // Handle payment
  const onPay = async () => {
    setPaymentError(null);
    setIsPaymentLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const { url } = await response.json();
      if (!url) throw new Error('No checkout URL received');

      window.location.href = url;
    } catch (err) {
      console.error('Payment error:', err);
      const message = err instanceof Error ? err.message : 'Payment failed';
      toast.error(message);
      setPaymentError(message);
      setIsPaymentLoading(false);
    }
  };

  const startVerification = async (verificationType: VerificationType) => {

    const setLoading = verificationType === 'home_country' ? setIsHomeCountryLoading : setIsImmigrationLoading;
    setLoading(true);

    try {
      const response = await fetch('/api/didit/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id,
          verification_type: verificationType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start verification');
      }

      const { url, } = await response.json();
      console.log('retrieved url ', url);

      if (!url) throw new Error('No verification URL received');

      if (verificationType === 'home_country') {
        setHomeCountryStatus('in_progress');
      } else {
        setImmigrationStatus('in_progress');
      }

      window.location.href = url;
      toast.success('Verification started! Complete the process in the new window.');

      pollVerificationStatus();

    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start verification');
    } finally {
      setLoading(false);
    }
  };

  const pollVerificationStatus = useCallback(async () => {
    let attempts = 0;
    const maxAttempts = 60;

    const poll = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(`/api/didit/check-status?applicationId=${application_id}`);
        const data = await response.json();

        if (!data.success) {
          console.error('Status check failed:', data.error);
          return;
        }

        setHomeCountryStatus(data.home_country_status);
        setImmigrationStatus(data.immigration_status);
        setOverallStatus(data.overall_status);

        if (data.overall_status === 'approved') {
          clearInterval(poll);
          toast.success('Identity verification completed successfully!');
          if (onStatusUpdate) onStatusUpdate();
          setTimeout(() => router.refresh(), 2000);
        } else if (data.overall_status === 'failed') {
          clearInterval(poll);
          toast.error('Verification failed. Please try again.');
          if (onStatusUpdate) onStatusUpdate();
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          toast.info('Verification is taking longer than expected. We\'ll notify you via email once complete.');
        }
      } catch (error) {
        console.error('Error polling status:', error);
        if (attempts >= 5) {
          clearInterval(poll);
        }
      }
    }, 10000);

    return () => clearInterval(poll);
  }, [application_id, onStatusUpdate, router]);

  useEffect(() => {
    if (hasPaid && (homeCountryStatus === 'in_progress' || immigrationStatus === 'in_progress')) {
      pollVerificationStatus();
    }
  }, [hasPaid, homeCountryStatus, immigrationStatus, pollVerificationStatus]);

  const getStatusLabel = (status: DiditVerificationStatus): string => {
    const labels: Record<DiditVerificationStatus, string> = {
      not_started: 'Start Verification',
      in_progress: 'In Progress',
      in_review: 'Under Review',
      approved: 'Verified',
      declined: 'Retry Verification',
      expired: 'Retry Verification',
      abandoned: 'Resume Verification',
      kyc_expired: 'Retry Verification',
    };
    return labels[status];
  };

  const isVerificationDisabled = (status: DiditVerificationStatus): boolean => {
    return !hasPaid || status === 'approved' || status === 'in_progress' || status === 'in_review';
  };

  const isVerificationComplete = (status: DiditVerificationStatus): boolean => {
    return status === 'approved';
  };

  const canRetry = (status: DiditVerificationStatus): boolean => {
    return ['declined', 'expired', 'abandoned', 'kyc_expired'].includes(status);
  };

  return (
    <div className="space-y-6">
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{paymentError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <VerificationActionCard
          title="Pay Verification Fee"
          description="Complete the one-time processing fee to unlock identity verification."
          actionLabel={hasPaid ? 'Payment Completed' : 'Pay $100'}
          onAction={onPay}
          disabled={hasPaid || isPaymentLoading}
          isLoading={isPaymentLoading}
          isCompleted={hasPaid}
        />
      </div>

      {hasPaid && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Identity Verification
          </h3>
          <p className="text-sm text-gray-600">
            You need to verify both your home country identity (Nigerian passport) and your immigration status (US/Canada ID).
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <VerificationActionCard
              title="Home Country ID"
              description="Verify your Nigerian passport or national ID card."
              actionLabel={getStatusLabel(homeCountryStatus)}
              onAction={() => startVerification('home_country')}
              disabled={isVerificationDisabled(homeCountryStatus) || isHomeCountryLoading}
              isLoading={isHomeCountryLoading}
              isCompleted={isVerificationComplete(homeCountryStatus)}
            />

            <VerificationActionCard
              title="Immigration ID"
              description="Verify your US Green Card, Work Permit, or Canadian PR/Work Permit."
              actionLabel={getStatusLabel(immigrationStatus)}
              onAction={() => startVerification('immigration')}
              disabled={isVerificationDisabled(immigrationStatus) || isImmigrationLoading}
              isLoading={isImmigrationLoading}
              isCompleted={isVerificationComplete(immigrationStatus)}
            />
          </div>
        </div>
      )}

      {(homeCountryStatus === 'in_progress' || immigrationStatus === 'in_progress') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <ArrowPathIcon className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-blue-900">Verification in Progress</p>
            <p className="text-sm text-blue-700 mt-1">
              Complete the verification in the new window. This page will update automatically.
            </p>
          </div>
        </div>
      )}

      {(homeCountryStatus === 'in_review' || immigrationStatus === 'in_review') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <ArrowPathIcon className="h-5 w-5 text-yellow-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Under Review</p>
            <p className="text-sm text-yellow-700 mt-1">
              Your documents are being reviewed. We'll notify you once complete.
            </p>
          </div>
        </div>
      )}

      {overallStatus === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">✓ Identity Fully Verified</p>
            <p className="text-sm text-green-700 mt-1">
              Both verifications complete. Your application is now under review.
            </p>
          </div>
        </div>
      )}

      {(canRetry(homeCountryStatus) || canRetry(immigrationStatus)) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">Verification Needs Attention</p>
            <p className="text-sm text-amber-700 mt-1">
              One or more verifications need to be retried. Please ensure you have clear photos of your documents.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}