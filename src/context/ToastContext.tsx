import { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '../components/Toast'

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    visible: boolean
  }>({
    message: '',
    type: 'info',
    visible: false,
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      message,
      type,
      visible: true,
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
