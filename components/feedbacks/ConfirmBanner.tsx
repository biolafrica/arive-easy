"use client"

import { MouseEvent, useEffect, useRef } from 'react'
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '../primitives/Button'

type BannerVariant = 'default' | 'danger' | 'warning'

interface ConfirmBannerProps {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: BannerVariant
  loading?: boolean
  confirmButtonIcon?: React.ReactNode
  showIcon?: boolean
}

const ConfirmBanner: React.FC<ConfirmBannerProps> = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  confirmButtonIcon,
  showIcon = true
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !loading) {
          onCancel()
        }
      }
      document.addEventListener('keydown', handleEscape)
      dialogRef.current?.focus()
      
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }

    return undefined
  }, [open, onCancel, loading])

  if (!open) return null

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel()
    }
  }

  const handleDialogClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const getConfirmButtonVariant = (): 'filled' | 'danger' => {
    return variant === 'danger' ? 'danger' : 'filled'
  }

  const getVariantIcon = () => {
    if (!showIcon) return null
    
    const iconMap = {
      danger: <TrashIcon className="w-5 h-5" />,
      warning: <ExclamationTriangleIcon className="w-5 h-5" />,
      default: null
    }
    
    return confirmButtonIcon || iconMap[variant]
  }

  const getHeaderConfig = () => {
    const configs = {
      danger: {
        icon: <ExclamationTriangleIcon className="w-6 h-6" />,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      },
      warning: {
        icon: <ExclamationTriangleIcon className="w-6 h-6" />,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      },
      default: {
        icon: null,
        iconBg: '',
        iconColor: ''
      }
    }
    
    return configs[variant]
  }

  const headerConfig = getHeaderConfig()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        ref={dialogRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={handleDialogClick}
        tabIndex={-1}
      >
  
        {headerConfig.icon && showIcon && (
          <div className="flex justify-center pt-6 pb-2">
            <div className={`${headerConfig.iconBg} ${headerConfig.iconColor} rounded-full p-3`}>
              {headerConfig.icon}
            </div>
          </div>
        )}

        <div className="p-6">
          
          <h3 id="dialog-title" className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
            {title}
          </h3>
          
          <p id="dialog-description" className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={onCancel}
              disabled={loading}
              className="order-2 sm:order-1"
            >
              {cancelText}
            </Button>
            
            <Button
              variant={getConfirmButtonVariant()}
              size="md"
              fullWidth
              onClick={onConfirm}
              loading={loading}
              loadingText="Processing..."
              leftIcon={!loading ? getVariantIcon() : undefined}
              className="order-1 sm:order-2"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmBanner