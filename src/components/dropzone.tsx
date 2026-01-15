'use client'

import { useCallback, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface DropzoneProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
  progressLabel: string
}

export function Dropzone({ onFileSelect, isProcessing, progressLabel }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragActive(false)
      const file = e.dataTransfer.files[0]
      if (file?.type === 'application/pdf') {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      e.target.value = '' // Reset for re-upload
    }
  }

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }

  return (
    <section
      className={cn(
        'relative py-20 px-8 border-2 border-dashed border-border rounded text-center',
        'transition-all duration-300 overflow-hidden',
        isDragActive && 'border-accent bg-accent-muted',
        !isProcessing && 'cursor-pointer hover:border-accent hover:bg-accent-muted/50',
        isProcessing && 'cursor-wait'
      )}
      onDragOver={(e) => {
        e.preventDefault()
        if (!isProcessing) setIsDragActive(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragActive(false)
      }}
      onDrop={!isProcessing ? handleDrop : undefined}
      onClick={handleClick}
    >
      <div className="relative z-10">
        <div
          className={cn(
            'font-serif text-6xl italic text-accent mb-6 transition-transform duration-300',
            isDragActive && 'scale-110 -rotate-3'
          )}
        >
          PDF
        </div>
        <p className="font-serif text-2xl italic mb-2 text-foreground">
          {isProcessing ? 'Processing...' : 'Drop your syllabus here'}
        </p>
        <p className="text-xs text-dim tracking-wider">
          {isProcessing ? progressLabel : 'or click to browse files'}
        </p>
      </div>

      {isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-background-elevated overflow-hidden">
          <div className="h-full w-1/4 bg-accent animate-progress-bar" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={handleFileInput}
      />
    </section>
  )
}
