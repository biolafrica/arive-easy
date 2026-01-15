import { Button } from "@/components/primitives/Button";
import { useAuthContext } from "@/providers/auth-provider";
import { PreApprovalBase, PreAprovalStatus } from "@/type/pages/dashboard/approval";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface PreApprovalActionsProps {
  pre_approvals: PreApprovalBase;
  onSubmit: (values: PreAprovalStatus) => Promise<void>;
  isUpdating: boolean;
}

export const PreApprovalActions = ({ pre_approvals, onSubmit, isUpdating }: PreApprovalActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);
  const [items, setItems] = useState<string[]>(['']);
  const [error, setError] = useState('');

  const { user} = useAuthContext();

  const handleActionClick = (type:any) => {
    setActionType(type);
    setShowModal(true);
    setItems(['']);
    setError('');
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index:number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index:number, value:any) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    const filteredItems = items.filter(item => item.trim() !== '');

    if (actionType === 'decline' && filteredItems.length === 0) {
      setError('At least one rejection reason is required');
      return;
    }

    const data: PreAprovalStatus = {
      status: actionType === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: `${user?.id}`, 
      updated_at: new Date().toISOString(),
    };

    if (actionType === 'approve' && filteredItems.length > 0) {
      data.conditions = filteredItems;
    } else if (actionType === 'decline') {
      data.rejection_reasons = filteredItems;
    }

    try {
      await onSubmit(data);
      setShowModal(false);

      setActionType(null);
      setItems(['']);
      setError('');
    } catch (error) {
      setError('Failed to update status. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setActionType(null);
    setItems(['']);
    setError('');
  };

  const isPending = pre_approvals.status === "pending";
  const isProcessed = pre_approvals.status === "approved" || pre_approvals.status === "rejected";


  return (
    <>
      <div className="flex items-center gap-5 p-5 mt-5">
        <Button
          variant={isPending ? "filled" : "outline"} 
          className={`flex-1 ${isProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleActionClick('approve')}
          disabled={!isPending || isUpdating}
        >
          {isProcessed ? 'Approve' : 'Approve Application'}
        </Button>

        <Button 
          className={`flex-1 ${isProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
          variant={isPending ? "danger" : "outline"}
          onClick={() => handleActionClick('decline')}
          disabled={!isPending || isUpdating}
        >
          {isProcessed ? 'Decline' : 'Decline Application'}
        </Button>
      </div>

      {isProcessed && (
        <div className="text-center text-sm text-gray-500 -mt-3 mb-3">
          This application has already been {pre_approvals.status}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between p-6 border-b">

              <h2 className="text-xl font-semibold text-gray-900">
                {actionType === 'approve' ? 'Approve Application' : 'Decline Application'}
              </h2>

              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === 'approve' 
                    ? 'Conditions (Optional)' 
                    : 'Rejection Reasons (Required)'}
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  {actionType === 'approve'
                    ? 'Add any conditions that apply to this approval. Leave empty if none.'
                    : 'Please provide at least one reason for declining this application.'}
                </p>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      placeholder={`Enter ${actionType === 'approve' ? 'condition' : 'reason'} ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddItem}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Add {actionType === 'approve' ? 'another condition' : 'another reason'}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'filled' : 'danger'}
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {`Confirm ${actionType === 'approve' ? 'Approval' : 'Decline'}`}
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
