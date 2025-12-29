'use client'

import { Button } from '@/components/primitives/Button';
import { usePreApprovalState, useUpdatePreApproval } from '@/hooks/useSpecialized/usePreApproval';
import { Skeleton } from '@/utils/skeleton';
import * as icon from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PreApprovalWelcome({id}:{id:string}) {
  const router = useRouter();
  const { preApproval, isLoading, validateStepAccess } = usePreApprovalState(id);
  const { updatePreApproval } = useUpdatePreApproval();
  
  useEffect(() => {
    if (!isLoading) {
      validateStepAccess(0);
    }
  }, [isLoading]);

  const handleStartPreApproval = async () => {
    try {
      await updatePreApproval(id, {
        current_step: 1,
        updated_at: new Date().toISOString()
      });
      
      router.push(`/user-dashboard/applications/${id}/pre-approval/personal-info`);
    } catch (error) {
      console.error('Failed to start pre-approval:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
        <icon.ShieldCheckIcon className="h-12 w-12 text-secondary" />
      </div>

      <h1 className="text-3xl font-semibold text-heading sm:text-4xl">
        Get Pre-Approved for Your Mortgage
      </h1>

      <p className="mt-4 text-base text-secondary sm:text-lg">
        Pre-approval helps you understand how much you can borrow and
        makes you a stronger, more confident buyer.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3 text-left">
        <InfoCard
          icon={<icon.CheckCircleIcon className="h-6 w-6 text-secondary" />}
          title="What you’ll get"
          items={[
            'Estimated loan amount',
            'Clear next steps',
            'Stronger buying position',
          ]}
        />

        <InfoCard
          icon={<icon.ShieldCheckIcon className="h-6 w-6 text-secondary" />}
          title="What we’ll need"
          items={[
            'Basic personal details',
            'Income & employment info',
            'Few documents',
          ]}
        />

        <InfoCard
          icon={<icon.ClockIcon className="h-6 w-6 text-secondary" />}
          title="How long it takes"
          items={[
            '10–15 minutes to apply',
            '24–48 hours review',
            'Email notification',
          ]}
        />
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button 
          size="lg" 
          onClick={handleStartPreApproval}
        >
          Start Pre-Approval
        </Button>

        <Button 
          size="lg" 
          variant="ghost" 
          onClick={() => router.push('/user-dashboard')}
        >
          Maybe later
        </Button>
      </div>
      
    </div>
  );
}


function InfoCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h4 className="font-medium text-heading">{title}</h4>
      </div>

      <ul className="space-y-2 text-sm text-secondary">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
