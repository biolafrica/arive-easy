import { ActionModal, ActionModalConfig, ActionModalData } from "@/components/common/ActionModal";
import { Button } from "@/components/primitives/Button";
import { useAuthContext } from "@/providers/auth-provider";
import { PreApprovalBase, PreAprovalStatus, } from "@/type/pages/dashboard/approval";
import { useState } from "react";


interface PreApprovalActionsProps {
  pre_approvals: PreApprovalBase;
  onSubmit: (values: PreAprovalStatus) => Promise<void>;
  isUpdating: boolean;
}

const PRE_APPROVAL_CONFIG: ActionModalConfig = {
  approve: {
    title: 'Approve Application',
    buttonText: 'Approve',
    variant: 'filled',
    inputType: 'array',
    inputLabel: 'Conditions (Optional)',
    inputPlaceholder: 'Enter condition',
    inputDescription: 'Add any conditions that apply to this approval. Leave empty if none.',
    required: false,
  },
  decline: {
    title: 'Decline Application',
    buttonText: 'Decline',
    variant: 'danger',
    inputType: 'array',
    inputLabel: 'Rejection Reasons (Required)',
    inputPlaceholder: 'Enter reason',
    inputDescription: 'Please provide at least one reason for declining this application.',
    required: true,
  },
};

export const PreApprovalActions = ({ pre_approvals, onSubmit, isUpdating }: PreApprovalActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthContext();

  const isPending = pre_approvals.status === "pending";
  const isProcessed = pre_approvals.status === "approved" || pre_approvals.status === "rejected";

  const handleModalSubmit = async (data: ActionModalData) => {
    const submitData: PreAprovalStatus = {
      status: data.action === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: `${user?.id}`,
      updated_at: new Date().toISOString(),
      completed_steps: data.action === 'approve' ? pre_approvals.completed_steps : 0,
      is_complete: data.action === 'approve' ? pre_approvals.is_complete : false,
      current_step: data.action === 'approve' ? pre_approvals.current_step : 1,
    };

    if (data.action === 'approve' && data.items && data.items.length > 0) {
      submitData.conditions = data.items;
    } else if (data.action === 'decline' && data.items) {
      submitData.rejection_reasons = data.items;
    }

    await onSubmit(submitData);
  };

  return (
    <>
      <div className="flex items-center gap-5 p-5 mt-5">
        <Button
          variant={isPending ? "filled" : "outline"}
          className={`flex-1 ${isProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setShowModal(true)}
          disabled={!isPending || isUpdating}
        >
          {isProcessed ? 'Application Actions' : 'Review Application'}
        </Button>
      </div>

      {isProcessed && (
        <div className="text-center text-sm text-gray-500 -mt-3 mb-3">
          This application has already been {pre_approvals.status}
        </div>
      )}

      <ActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        config={PRE_APPROVAL_CONFIG}
        isUpdating={isUpdating}
      />
    </>
  );
};
