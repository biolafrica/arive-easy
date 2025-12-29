'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/primitives/Button';
import { PreApprovalStatus } from '@/type/pages/dashboard/home';
import { PRE_APPROVAL_UI_CONFIG } from '@/data/pages/dashboard/home';
import { formatCurrency } from '@/lib/formatter';


interface Props {
  status: PreApprovalStatus;
  amount?: number;
  conditions?: string[];
  guidance?: string[];
  onPrimaryAction?: () => void | Promise<void>;
}

export function PreApprovalCard({
  status,
  amount,
  conditions,
  guidance,
  onPrimaryAction
}: Props) {
  const config = PRE_APPROVAL_UI_CONFIG[status];
  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-6 md:p-8 space-y-4',
        status === 'approved' && 'border-green-200 bg-green-50',
        status === 'approved_with_conditions' && 'border-blue-200 bg-blue-50',
        status === 'rejected_with_guidance' && 'border-red-200 bg-red-50',
        status === 'incomplete' && 'border-yellow-200 bg-yellow-50',
        status === 'not_started' && 'border-border bg-card'
      )}
    >
      <h3 className="text-lg font-semibold text-heading">
        {config.title}
      </h3>

      <p className="text-sm text-secondary max-w-2xl">
        {config.description}
      </p>

      {amount && (
        <div className="rounded-lg bg-white p-4 border">
          <p className="text-sm text-secondary">Approved Amount</p>
          <p className="text-2xl font-semibold text-heading">
            {formatCurrency(amount)}
          </p>
        </div>
      )}

      {conditions && conditions.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-secondary space-y-1">
          {conditions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}

      {guidance && guidance.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-secondary space-y-1">
          {guidance.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}

      <div className="pt-4">
        <Button onClick={handlePrimaryAction} >
          {config.primaryAction}
        </Button>
      </div>
    </div>
  );
}
