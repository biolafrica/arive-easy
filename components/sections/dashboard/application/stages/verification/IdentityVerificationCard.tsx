'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { VerificationActionCard } from './ActionCard';
import { DiditVerificationStatus, IdentityVerificationData, VerificationType } from '@/type/common/didit';

interface IdentityVerificationCardsProps {
  applicationId: string;
  verificationData?: IdentityVerificationData;
  onStatusUpdate?: () => void;
}

export function IdentityVerificationCards({ 
  applicationId, 
  verificationData,
  onStatusUpdate 
}: IdentityVerificationCardsProps) {
  const router = useRouter();
  
  const [homeCountryStatus, setHomeCountryStatus] = useState<DiditVerificationStatus>(
    (verificationData?.home_country_status as DiditVerificationStatus) || 'not_started'
  );
  const [immigrationStatus, setImmigrationStatus] = useState<DiditVerificationStatus>(
    (verificationData?.immigration_status as DiditVerificationStatus) || 'not_started'
  );
  const [overallStatus, setOverallStatus] = useState(
    verificationData?.overall_status || 'not_started'
  );
  
  const [isHomeCountryLoading, setIsHomeCountryLoading] = useState(false);
  const [isImmigrationLoading, setIsImmigrationLoading] = useState(false);

  useEffect(() => {
    const checkCurrentStatus = async () => {
      // Only check if something was in progress
      if (
        verificationData?.home_country_status === 'in_progress' ||
        verificationData?.immigration_status === 'in_progress'
      ) {
        try {
          const response = await fetch(`/api/didit/check-status?applicationId=${applicationId}`);
          const data = await response.json();
          
          if (data.success) {
            setHomeCountryStatus(data.home_country_status);
            setImmigrationStatus(data.immigration_status);
            setOverallStatus(data.overall_status);
            
            // Show appropriate toast based on what changed
            if (data.overall_status === 'approved') {
              toast.success('Identity verification completed successfully!');
              onStatusUpdate?.();
            } else if (
              data.home_country_status === 'approved' && 
              verificationData?.home_country_status !== 'approved'
            ) {
              toast.success('Home country ID verified! Now verify your immigration ID.');
            } else if (
              data.immigration_status === 'approved' && 
              verificationData?.immigration_status !== 'approved'
            ) {
              toast.success('Immigration ID verified! Now verify your home country ID.');
            }
          }
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }
    };
    
    checkCurrentStatus();
  }, [applicationId]);

  const startVerification = async (verificationType: VerificationType) => {
    const setLoading = verificationType === 'home_country' 
      ? setIsHomeCountryLoading 
      : setIsImmigrationLoading;
    
    setLoading(true);

    try {
      const response = await fetch('/api/didit/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: applicationId,
          verification_type: verificationType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start verification');
      }

      const { url } = await response.json();
      if (!url) throw new Error('No verification URL received');

      if (verificationType === 'home_country') {
        setHomeCountryStatus('in_progress');
      } else {
        setImmigrationStatus('in_progress');
      }

      window.location.href = url;

    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start verification');
      setLoading(false);
    }
  };

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

  const isDisabled = (status: DiditVerificationStatus): boolean => {
    return status === 'approved' || status === 'in_progress' || status === 'in_review';
  };

  const isComplete = (status: DiditVerificationStatus): boolean => {
    return status === 'approved';
  };

  const canRetry = (status: DiditVerificationStatus): boolean => {
    return ['declined', 'expired', 'abandoned', 'kyc_expired'].includes(status);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
        <p className="text-sm text-gray-600 mt-1">
          Verify both your home country identity and immigration status to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <VerificationActionCard
          title="Home Country ID"
          description="Nigerian passport or national ID card"
          actionLabel={getStatusLabel(homeCountryStatus)}
          onAction={() => startVerification('home_country')}
          disabled={isDisabled(homeCountryStatus) || isHomeCountryLoading}
          isLoading={isHomeCountryLoading}
          isCompleted={isComplete(homeCountryStatus)}
        />

        <VerificationActionCard
          title="Immigration ID"
          description="US Green Card, Work Permit, or Canadian PR"
          actionLabel={getStatusLabel(immigrationStatus)}
          onAction={() => startVerification('immigration')}
          disabled={isDisabled(immigrationStatus) || isImmigrationLoading}
          isLoading={isImmigrationLoading}
          isCompleted={isComplete(immigrationStatus)}
        />
      </div>

      <StatusAlerts
        homeCountryStatus={homeCountryStatus}
        immigrationStatus={immigrationStatus}
        overallStatus={overallStatus}
        canRetry={canRetry}
      />
    </div>
  );
}

function StatusAlerts({
  homeCountryStatus,
  immigrationStatus,
  overallStatus,
  canRetry,
}: {
  homeCountryStatus: DiditVerificationStatus;
  immigrationStatus: DiditVerificationStatus;
  overallStatus: string;
  canRetry: (status: DiditVerificationStatus) => boolean;
}) {
  if (homeCountryStatus === 'in_progress' || immigrationStatus === 'in_progress') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <ArrowPathIcon className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-900">Verification in Progress</p>
          <p className="text-sm text-blue-700 mt-1">
            Complete the verification in the opened page. Return here when done.
          </p>
        </div>
      </div>
    );
  }

  if (homeCountryStatus === 'in_review' || immigrationStatus === 'in_review') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
        <ArrowPathIcon className="h-5 w-5 text-yellow-600 animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-900">Under Review</p>
          <p className="text-sm text-yellow-700 mt-1">
            Your documents are being reviewed. We'll notify you once complete.
          </p>
        </div>
      </div>
    );
  }

  if (overallStatus === 'approved') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-900">✓ Identity Fully Verified</p>
          <p className="text-sm text-green-700 mt-1">
            Both verifications complete. You can proceed to the next step.
          </p>
        </div>
      </div>
    );
  }

  if (canRetry(homeCountryStatus) || canRetry(immigrationStatus)) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
        <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-900">Verification Needs Attention</p>
          <p className="text-sm text-amber-700 mt-1">
            Please retry with clear, well-lit photos of your documents.
          </p>
        </div>
      </div>
    );
  }

  return null;
}