import { Button } from "@/components/primitives/Button";

interface VerificationActionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  disabled?: boolean;
  status?: 'ready' | 'locked' | 'completed';
}

export function VerificationActionCard({
  title,
  description,
  actionLabel,
  onAction,
  disabled,
  status = 'ready',
}: VerificationActionCardProps) {
  return (
    <div
      className={`
        rounded-xl border p-6 transition
        ${disabled ? 'bg-muted opacity-60' : 'bg-white'}
      `}
    >
      <div className="space-y-3">
        <h4 className="font-semibold text-heading">
          {title}
        </h4>

        <p className="text-sm text-secondary">
          {description}
        </p>

        <Button
          disabled={disabled}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
