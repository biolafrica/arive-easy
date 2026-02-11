import { Button } from '@/components/primitives/Button';

interface TableHeaderProps {
  title: string;
  subtitle?: string;
  createLabel?: string;
  onCreate?: () => void;
  actions?: React.ReactNode;
}


export function TableHeader({
  title,
  subtitle,
  createLabel = 'Create',
  onCreate,
  actions,
}: TableHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-heading">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-secondary mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions}

        {onCreate && (
          <Button onClick={onCreate}>
            {createLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
