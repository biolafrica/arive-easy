'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { StageStatusBadge } from './StageStatuses';

export type ApplicationStageStatus = | 'completed' | 'current' | 'upcoming' | 'rejected';

export interface ApplicationStage {
  step: number;
  key: string;
  title: string;
  status: ApplicationStageStatus;

  completedAt?: string; 
  errorMessage?: string; 
}


interface AccordionProps {
  stages: ApplicationStage[];
  renderEditable: (stageKey: string) => React.ReactNode;
  renderReadOnly: (stageKey: string) => React.ReactNode;
}

export function ApplicationAccordion({
  stages,
  renderEditable,
  renderReadOnly,
}: AccordionProps) {
  const currentStage = stages.find(s => s.status === 'current')?.key;
  const [openKey, setOpenKey] = useState<string | null>(currentStage ?? null);

  return (
    <div className="space-y-4">
      {stages.map(stage => {
        const isOpen = openKey === stage.key;
        const isDisabled = stage.status === 'upcoming';
        const isReadOnly = stage.status === 'completed';

        return (
          <div
            key={stage.key}
            className={cn(
              'rounded-xl border transition',
              stage.status === 'rejected'
                ? 'border-red-300 bg-red-50'
                : 'border-border bg-white',
              isDisabled && 'opacity-60'
            )}
          >
   
            <button
              disabled={isDisabled}
              onClick={() =>
                setOpenKey(isOpen ? null : stage.key)
              }
              className={cn(
                'flex w-full items-center justify-between p-4 text-left',
                isDisabled && 'cursor-not-allowed'
              )}
            >
              <div>
                <h4 className="font-medium text-heading">
                  {stage.title}
                </h4>

                <p className="text-sm text-secondary">
                  {stage.status === 'current'
                    ? 'Ongoing'
                    : stage.completedAt
                    ? new Date(stage.completedAt).toLocaleDateString()
                    : ''}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StageStatusBadge status={stage.status} />

                <ChevronDownIcon
                  className={cn(
                    'h-5 w-5 text-secondary transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>
            </button>

            {isOpen && !isDisabled && (
              <div className="border-t border-border p-4 space-y-4">
                {stage.status === 'rejected' && stage.errorMessage && (
                  <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {stage.errorMessage}
                  </div>
                )}

                {isReadOnly
                  ? renderReadOnly(stage.key)
                  : renderEditable(stage.key)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
