
import { PreApprovalStatus } from '@/type/pages/dashboard/home';
import { formatDate } from '@/lib/formatter';
import Modal from '@/components/common/ContentModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  createdAt: string;
  updatedAt?: string;
  referenceNumber?: string;
}

export function PreApprovalStatusModal({
  isOpen,
  onClose,
  createdAt,
  updatedAt,
  referenceNumber,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Under Review"
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
          <p className="text-sm font-medium text-yellow-800">
            Currently being reviewed by our team
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your pre-approval application has been submitted and is currently
            under review. Our team is carefully evaluating your information.
            You will be notified once a decision has been made.
          </p>
        </div>

        <div className="rounded-lg border divide-y text-sm">
          {referenceNumber && (
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-500">Reference No.</span>
              <span className="font-medium text-gray-900">{referenceNumber}</span>
            </div>
          )}
          <div className="flex justify-between px-4 py-3">
            <span className="text-gray-500">Submitted On</span>
            <span className="font-medium text-gray-900">{formatDate(createdAt)}</span>
          </div>
          {updatedAt && (
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-500">Last Updated</span>
              <span className="font-medium text-gray-900">{formatDate(updatedAt)}</span>
            </div>
          )}
          <div className="flex justify-between px-4 py-3">
            <span className="text-gray-500">Status</span>
             <span className="inline-flex items-center gap-1.5 font-medium text-yellow-700">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              Under Review
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Typical review time is 1–3 business days. Check your email for updates.
        </p>
      </div>
    </Modal>
  );
}