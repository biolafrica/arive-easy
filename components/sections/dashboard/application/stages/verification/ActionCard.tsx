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

        <button
          disabled={disabled}
          onClick={onAction}
          className={`
            mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium
            ${
              disabled
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }
          `}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
