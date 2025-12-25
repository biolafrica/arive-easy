import { ReactNode } from 'react';
import { Button } from '@/components/primitives/Button';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'filled' | 'outline' | 'ghost';
}

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actions?: EmptyStateAction[]; 
  minHeight?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  minHeight = 'min-h-[400px]',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${minHeight}`}
    >
      <div className="mb-6 text-gray-300">{icon}</div>

      <h3 className="mb-2 text-xl font-semibold text-heading">
        {title}
      </h3>

      {description && (
        <p className="mb-6 max-w-md text-secondary">
          {description}
        </p>
      )}

      {actions && actions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? 'outline'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
