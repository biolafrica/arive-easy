'use client';

import { IdentityVerificationData } from '@/type/common/didit';
import { PaymentCard } from './PaymentCard';
import { IdentityVerificationCards } from './IdentityVerificationCard';

interface VerificationClientViewProps {
  hasPaid: boolean;
  application_id: string;
  verificationData?: IdentityVerificationData;
  onStatusUpdate?: () => void;
}

export default function VerificationClientView({ 
  hasPaid, 
  application_id, 
  verificationData, 
  onStatusUpdate,
}: VerificationClientViewProps) {
  return (
    <div className="space-y-6">
      <PaymentCard 
        hasPaid={hasPaid} 
        applicationId={application_id} 
      />

      {hasPaid && (
        <IdentityVerificationCards
          applicationId={application_id}
          verificationData={verificationData}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
}