'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { VerificationActionCard } from './ActionCard';

interface PaymentCardProps {
  hasPaid: boolean;
  applicationId: string;
}

export function PaymentCard({ hasPaid, applicationId }: PaymentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicationId }),
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
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <VerificationActionCard
        title="Pay Verification Fee"
        description="Complete the one-time processing fee to unlock identity verification."
        actionLabel={hasPaid ? 'Payment Completed' : 'Pay $100'}
        onAction={handlePay}
        disabled={hasPaid || isLoading}
        isLoading={isLoading}
        isCompleted={hasPaid}
      />
    </div>
  );
}