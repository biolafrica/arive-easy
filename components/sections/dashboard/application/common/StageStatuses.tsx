import { cn } from '@/lib/utils';
import { ApplicationStageStatus } from '@/type/pages/dashboard/application';

interface Props {
  status: ApplicationStageStatus;
}

export function StageStatusBadge({ status }: Props) {
  const styles: Record<ApplicationStageStatus, string> = {
    completed: 'bg-green-100 text-green-700',
    current: 'bg-orange-100 text-orange-700',
    upcoming: 'bg-gray-100 text-gray-500',
    rejected: 'bg-red-100 text-red-700',
  };

  const labels: Record<ApplicationStageStatus, string> = {
    completed: 'Completed',
    current: 'Action Required',
    upcoming: 'Locked',
    rejected: 'Action Required',
  };

  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium',
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
