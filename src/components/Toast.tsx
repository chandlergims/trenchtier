import { useEffect } from 'react'
import { ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import '../styles/Toast.css'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ExclamationCircleIcon className="toast-icon" />
      case 'success':
        return <CheckCircleIcon className="toast-icon" />
      default:
        return <InformationCircleIcon className="toast-icon" />
    }
  }

  return (
    <div className={`toast ${type}`}>
      {getIcon()}
      <p>{message}</p>
    </div>
  )
}

export default Toast
