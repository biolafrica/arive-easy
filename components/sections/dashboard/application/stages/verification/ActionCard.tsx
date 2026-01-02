import { Button } from "@/components/primitives/Button";
import {CheckCircleIcon } from "@heroicons/react/24/outline";

interface VerificationActionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
  isCompleted?: boolean;
  icon?: React.ReactNode;
}

export function VerificationActionCard({
  title,
  description,
  actionLabel,
  onAction,
  disabled = false,
  isLoading = false,
  isCompleted = false,
}: VerificationActionCardProps) {

  return (
    <div className={`
      border rounded-lg p-6 transition-all
      ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
      ${disabled && !isCompleted ? 'opacity-60' : ''}
    `}>
      <div className="space-y-4">
        {isCompleted && (
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {description}
          </p>
        </div>
        
        <Button
          onClick={onAction}
          disabled={disabled || isLoading}
          className="w-full"
          variant={isCompleted ? "outline" : "filled"}
          loading={isLoading}
        >   
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}