'use client'

import type { ExtractionResult } from '@/types'

interface RawPanelProps {
  result: ExtractionResult
}

export function RawPanel({ result }: RawPanelProps) {
  return (
    <div className="mt-6 bg-background-elevated rounded overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-4 py-2 bg-background-card border-b border-border">
        <span className="text-xs tracking-wider uppercase text-dim">Raw Response</span>
        <span className="text-xs text-muted">{result.model}</span>
      </div>
      <div className="p-4 max-h-80 overflow-auto">
        <pre className="text-xs text-muted whitespace-pre-wrap break-words font-mono">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  )
}
