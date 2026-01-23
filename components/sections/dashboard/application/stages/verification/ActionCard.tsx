import { Button } from '@/components/primitives/Button';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface VerificationActionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
  isCompleted?: boolean;
  icon?: React.ReactNode;
  secondaryInfo?: string;
}

export function VerificationActionCard({
  title,
  description,
  actionLabel,
  onAction,
  disabled = false,
  isLoading = false,
  isCompleted = false,
  secondaryInfo,
}: VerificationActionCardProps) {
  return (
    <div
      className={`
        border rounded-lg p-6 transition-all
        ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
        ${disabled && !isCompleted ? 'opacity-60' : ''}
      `}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            {secondaryInfo && (
              <p className="mt-2 text-xs text-gray-500">{secondaryInfo}</p>
            )}
          </div>
          {isCompleted && (
            <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 ml-4" />
          )}
          {isLoading && (
            <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin flex-shrink-0 ml-4" />
          )}
        </div>

        <Button
          onClick={onAction}
          disabled={disabled || isLoading}
          className="w-full"
          variant={isCompleted ? 'outline' : 'filled'}
          loading={isLoading}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

interface VerificationDetailCardProps {
  title: string;
  status: string;
  documentType?: string;
  documentNumber?: string;
  expiryDate?: string;
  verifiedAt?: string;
}

export function VerificationDetailCard({
  title,
  status,
  documentType,
  documentNumber,
  expiryDate,
  verifiedAt,
}: VerificationDetailCardProps) {
  const isVerified = status === 'approved';

  return (
    <div
      className={`
        border rounded-lg p-4
        ${isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <StatusBadge status={status} />
      </div>

      {isVerified && (
        <div className="space-y-2 text-sm">
          {documentType && (
            <div className="flex justify-between">
              <span className="text-gray-500">Document Type</span>
              <span className="text-gray-900 font-medium">{documentType}</span>
            </div>
          )}
          {documentNumber && (
            <div className="flex justify-between">
              <span className="text-gray-500">Document Number</span>
              <span className="text-gray-900 font-medium">
                {maskDocumentNumber(documentNumber)}
              </span>
            </div>
          )}
          {expiryDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Expiry Date</span>
              <span className="text-gray-900 font-medium">
                {formatDate(expiryDate)}
              </span>
            </div>
          )}
          {verifiedAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Verified On</span>
              <span className="text-gray-900 font-medium">
                {formatDate(verifiedAt)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    not_started: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Not Started' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
    in_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Review' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
    declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' },
    expired: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired' },
    abandoned: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Incomplete' },
    kyc_expired: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'KYC Expired' },
  };

  const { bg, text, label } = config[status] || config.not_started;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>
      {label}
    </span>
  );
}

function maskDocumentNumber(number: string): string {
  if (number.length <= 4) return number;
  return `****${number.slice(-4)}`;
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}