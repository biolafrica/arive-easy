'use client'

import { Button } from '@/components/primitives/Button';
import { getStepPath, usePreApprovalState } from '@/hooks/useSpecialized/usePreApproval';
import { Skeleton } from '@/utils/skeleton';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PreApprovalSuccess({id}:{id:string}) {
  console.log('PreApprovalSuccess id:', id);
  const router = useRouter()
  const {preApproval, isLoading } = usePreApprovalState(id);
  console.log('PreApprovalSuccess preApproval:', preApproval);

  useEffect(() => {
    if (!isLoading && preApproval) {
      if (!preApproval.is_complete || preApproval.completed_steps < 4) {
        console.log('yes Redirecting to current step');
        const path = getStepPath(preApproval.current_step, preApproval.id, )
        router.push(path);
      }
    }
  }, [isLoading, preApproval]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-orange-50">
        <CheckBadgeIcon className="h-14 w-14 text-secondary" />
      </div>

      <h1 className="text-3xl font-semibold text-heading sm:text-4xl">
        Application Submitted Successfully!
      </h1>

      <p className="mt-4 text-base text-secondary sm:text-lg">
        Thank you for submitting your mortgage pre-approval application.
        We’ll review your information and get back to you within
        <span className="font-medium text-heading"> 24–48 hours</span>.
      </p>

      <div className="mt-10 rounded-xl bg-orange-50 p-6 text-left">
        <h3 className="mb-3 font-medium text-heading">
          What happens next?
        </h3>

        <ul className="space-y-2 text-sm text-secondary">
          <li>• We’ll review your application and documents</li>
          <li>• You’ll receive an email when pre-approved</li>
          <li>• Complete final verification from your dashboard</li>
          <li>• Proceed to full mortgage approval</li>
        </ul>
      </div>

      <div className="mt-10">
        <Button size="lg" onClick={()=>router.push('/user-dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
