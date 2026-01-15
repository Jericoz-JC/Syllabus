'use client'

import { ToasterProvider, Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToasterProvider>
      {children}
      <Toaster />
    </ToasterProvider>
  )
}
