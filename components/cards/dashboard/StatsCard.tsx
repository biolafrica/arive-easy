import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subText?: string;
}

export function StatsCard({
  icon,
  title,
  value,
  subText,
}: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-primary">
        {icon}
      </div>

      <div>
        <p className="text-sm text-secondary">
          {title}
        </p>

        <p className="text-2xl font-semibold text-heading">
          {value}
        </p>

        {subText && (
          <p className="mt-1 text-xs text-secondary">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
}
