import { XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showCloseButton?: boolean;
  closeable?: boolean; 
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '2xl',
  showCloseButton = true,
  closeable = true,
  className = ""
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeable && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    if (closeable) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto ${className}`}>
        
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}

            {!title && <div />}
            
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={!closeable}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}