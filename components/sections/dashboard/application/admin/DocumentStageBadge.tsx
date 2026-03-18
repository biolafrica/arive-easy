import { Badge } from '@/components/primitives/Badge';
import { humanizeSnakeCase } from '@/utils/common/humanizeSnakeCase';

interface DocumentStatusBadgeProps {
  documentType: string;
  status: 'sent' | 'partially_signed' | 'completed';
  signaturesCompleted?: number;
  signaturesTotal?: number;
}

export function DocumentStatusBadge({
  documentType,
  status,
  signaturesCompleted,
  signaturesTotal,
}: DocumentStatusBadgeProps) {
  const statusConfig = {
    sent: {
      variant: 'warning' as const,
      label: 'Awaiting Signatures',
    },
    partially_signed: {
      variant: 'info' as const,
      label: `Partially Signed (${signaturesCompleted}/${signaturesTotal})`,
    },
    completed: {
      variant: 'success' as const,
      label: 'Fully Signed',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{humanizeSnakeCase(documentType)}</span>
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    </div>
  );
}