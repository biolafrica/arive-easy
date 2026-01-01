'use client'

import { useRouter } from "next/navigation";
import { VerificationActionCard } from "./ActionCard";
import { loadStripe } from '@stripe/stripe-js'
import { useState } from "react";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface Response{
  url:string;
  sessionId:string
}

export default function VerificationClientView({
  hasPaid,
  application_id
}: {
  hasPaid: boolean;
  application_id:string
}){
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onPay=async()=>{
    setError(null);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id:application_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create payment session')
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const { url, sessionId } = await response.json();

      if (!url) {
        throw new Error('No checkout URL received');
      }

      window.location.href = url;
      
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err instanceof Error ? err.message : 'Payment failed')
      setError(err instanceof Error ? err.message : 'Payment failed');
    }

  }
  const onVerify=()=>{console.log("veified")}
  
  return(
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <VerificationActionCard
          title="Pay Verification Fee"
          description="Complete the one-time processing fee to unlock identity verification."
          actionLabel={hasPaid ? 'Payment Completed' : 'Pay $100'}
          onAction={onPay}
          disabled={hasPaid}
        />

        <VerificationActionCard
          title="Verify Your Identity"
          description="Verify your identity securely once payment is confirmed."
          actionLabel="Start Verification"
          onAction={onVerify}
          disabled={!hasPaid}
        />
      </div>
  )
}