'use client'

import { useEffect, useState, useCallback } from 'react'
import * as outline from '@heroicons/react/24/outline'

type AlertType = 'success' | 'error' | 'warning'

interface AlertProps {
  type?: AlertType
  heading: string
  subheading?: string
  duration?: number
  onClose?: () => void
}

interface StyleConfig {
  bg: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconColor: string
}

const styleMap: Record<AlertType, StyleConfig> = {
  success: {
    bg: 'bg-[#243837]',
    icon: outline.CheckCircleIcon,
    iconColor: '#A8DF46'
  },
  error: {
    bg: 'bg-[#651a15]',
    icon: outline.XCircleIcon,
    iconColor: '#d63f35'
  },
  warning: {
    bg: 'bg-[#896f00]',
    icon: outline.ExclamationCircleIcon,
    iconColor: '#ffd41e'
  }
}

const Alert: React.FC<AlertProps> = ({
  type = 'success',
  heading,
  subheading,
  duration = 5000,
  onClose
}) => {
  const [visible, setVisible] = useState(true)

  const handleClose = useCallback(() => {
    setVisible(false)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [duration, handleClose])

  if (!visible) return null

  const { bg, icon: TypeIcon, iconColor } = styleMap[type]

  return (
    <div
      className={`${bg} fixed top-4 right-4 z-50 shadow rounded-[12px] p-4 flex items-start gap-3`}
      role="alert text-white"
      aria-live="polite"
    >
      <TypeIcon
        className="w-6 h-6 flex-shrink-0"
        style={{ color: iconColor }}
        aria-hidden="true"
      />

      <div className="flex-grow">
        <h4 className="font-medium text-white">{heading}</h4>
        {subheading && <p className="text-sm mt-1 opacity-90 text-white">{subheading}</p>}
      </div>

      <button
        onClick={handleClose}
        aria-label="Close alert"
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
        type="button"
      >
        <outline.XMarkIcon className="w-6 h-6 text-white" />
      </button>
        
    </div>
  )
}

export default Alert