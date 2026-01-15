'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface Toast {
  id: string
  title: string
  variant?: 'default' | 'success' | 'error'
}

interface ToasterContextValue {
  toasts: Toast[]
  toast: (options: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToasterContext = React.createContext<ToasterContextValue | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToasterContext)
  if (!context) {
    // Return a no-op if outside provider (for SSR)
    return {
      toast: () => {},
      toasts: [],
      dismiss: () => {},
    }
  }
  return context
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...options, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToasterContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToasterContext.Provider>
  )
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'animate-slide-in px-4 py-3 rounded border shadow-lg',
            'flex items-center justify-between gap-4 min-w-[200px]',
            t.variant === 'success' && 'bg-success/10 border-success/30 text-success',
            t.variant === 'error' && 'bg-exam/10 border-exam/30 text-exam',
            !t.variant && 'bg-background-card border-border text-foreground'
          )}
        >
          <span className="text-sm">{t.title}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-dim hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
