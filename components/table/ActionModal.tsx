import { Button } from "@/components/primitives/Button";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export interface ActionModalConfig {
  approve: {
    title: string;
    buttonText: string;
    variant: 'filled' | 'outline' | 'danger';
    inputType: 'array' | 'string' | 'none';
    inputLabel?: string;
    inputPlaceholder?: string;
    inputDescription?: string;
    required?: boolean;
  };

  decline: {
    title: string;
    buttonText: string;
    variant: 'filled' | 'outline' | 'danger';
    inputType: 'array' | 'string' | 'none';
    inputLabel?: string;
    inputPlaceholder?: string;
    inputDescription?: string;
    required?: boolean;
  };
}

export interface ActionModalData {
  action: 'approve' | 'decline';
  notes?: string;
  items?: string[];
}

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActionModalData) => Promise<void>;
  config: ActionModalConfig;
  isUpdating?: boolean;
}

export const ActionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  config, 
  isUpdating = false 
}: ActionModalProps) => {
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);
  const [stringValue, setStringValue] = useState('');
  const [arrayItems, setArrayItems] = useState<string[]>(['']);
  const [error, setError] = useState('');

  const handleActionClick = (type: 'approve' | 'decline') => {
    setActionType(type);
    setStringValue('');
    setArrayItems(['']);
    setError('');
  };

  const handleAddItem = () => {
    setArrayItems([...arrayItems, '']);
  };

  const handleRemoveItem = (index: number) => {
    if (arrayItems.length > 1) {
      setArrayItems(arrayItems.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...arrayItems];
    newItems[index] = value;
    setArrayItems(newItems);
    if (error) setError('');
  };

  const handleStringChange = (value: string) => {
    setStringValue(value);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!actionType) return;

    const currentConfig = config[actionType];
    
    if (currentConfig.required) {
      if (currentConfig.inputType === 'array') {
        const filteredItems = arrayItems.filter(item => item.trim() !== '');
        if (filteredItems.length === 0) {
          setError(`At least one ${currentConfig.inputLabel?.toLowerCase() || 'item'} is required`);
          return;
        }
      } else if (currentConfig.inputType === 'string') {
        if (!stringValue.trim()) {
          setError(`${currentConfig.inputLabel || 'Note'} is required`);
          return;
        }
      }
    }

    const submitData: ActionModalData = {
      action: actionType,
    };

    // Add notes/items based on input type
    if (currentConfig.inputType === 'array') {
      const filteredItems = arrayItems.filter(item => item.trim() !== '');
      if (filteredItems.length > 0) {
        submitData.items = filteredItems;
      }
    } else if (currentConfig.inputType === 'string' && stringValue.trim()) {
      submitData.notes = stringValue.trim();
    }

    try {
      await onSubmit(submitData);
      onClose();
      setActionType(null);
      setStringValue('');
      setArrayItems(['']);
      setError('');
    } catch (error) {
      setError('Failed to process action. Please try again.');
    }
  };

  const handleClose = () => {
    onClose();
    setActionType(null);
    setStringValue('');
    setArrayItems(['']);
    setError('');
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {!actionType ? (
          <>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Choose Action</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant={config.approve.variant}
                  className="flex-1"
                  onClick={() => handleActionClick('approve')}
                  disabled={isUpdating}
                >
                  {config.approve.buttonText}
                </Button>
                <Button
                  variant={config.decline.variant}
                  className="flex-1"
                  onClick={() => handleActionClick('decline')}
                  disabled={isUpdating}
                >
                  {config.decline.buttonText}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {config[actionType].title}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {config[actionType].inputType !== 'none' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {config[actionType].inputLabel}
                    {config[actionType].required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {config[actionType].inputDescription && (
                    <p className="text-sm text-gray-500 mb-4">
                      {config[actionType].inputDescription}
                    </p>
                  )}
                </div>
              )}

              {config[actionType].inputType === 'none' && (
                <h4>Are You sure you want Accept the offer</h4>
              )}

              {config[actionType].inputType === 'string' && (
                <textarea
                  value={stringValue}
                  onChange={(e) => handleStringChange(e.target.value)}
                  placeholder={config[actionType].inputPlaceholder}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              )}

              {config[actionType].inputType === 'array' && (
                <>
                  <div className="space-y-3">
                    {arrayItems.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                          placeholder={`${config[actionType].inputPlaceholder || ''} ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {arrayItems.length > 1 && (
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
                    Add another {config[actionType].inputLabel?.toLowerCase() || 'item'}
                  </button>
                </>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setActionType(null)}
                disabled={isUpdating}
              >
                Back
              </Button>
              <Button
                variant={config[actionType].variant}
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {`Confirm ${config[actionType].buttonText}`}
              </Button>
            </div>

          </>
        )}

      </div>
    </div>
  );
};