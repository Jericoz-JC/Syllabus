'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/toaster'
import type { ExtractionResult } from '@/types'

interface ParserState {
  result: ExtractionResult | null
  isProcessing: boolean
  progressLabel: string
}

export function useSyllabusParser(apiKey: string, model: string, hasServerKey: boolean) {
  const [state, setState] = useState<ParserState>({
    result: null,
    isProcessing: false,
    progressLabel: '',
  })
  const { toast } = useToast()

  const processFile = useCallback(
    async (file: File) => {
      if (!hasServerKey && !apiKey) {
        toast({ title: 'Enter your OpenRouter API key first', variant: 'error' })
        return
      }

      setState({
        result: null,
        isProcessing: true,
        progressLabel: 'Extracting text from PDF...',
      })

      try {
        // Upload PDF
        const formData = new FormData()
        formData.append('file', file)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const text = await uploadRes.text()
          throw new Error(`Upload failed: ${uploadRes.status} - ${text.slice(0, 100)}`)
        }

        const uploadData = await uploadRes.json()

        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Failed to parse PDF')
        }

        // Extract with AI
        setState((prev) => ({
          ...prev,
          progressLabel: 'Analyzing with AI...',
        }))

        const extractRes = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: uploadData.text,
            model,
            apiKey,
          }),
        })

        if (!extractRes.ok) {
          const text = await extractRes.text()
          throw new Error(`Extraction failed: ${extractRes.status} - ${text.slice(0, 100)}`)
        }

        const result: ExtractionResult = await extractRes.json()

        if (!result.success) {
          throw new Error(result.error || 'Extraction failed')
        }

        setState({
          result,
          isProcessing: false,
          progressLabel: '',
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Processing failed'
        toast({ title: message, variant: 'error' })
        setState({
          result: null,
          isProcessing: false,
          progressLabel: '',
        })
      }
    },
    [apiKey, model, hasServerKey, toast]
  )

  const clearResults = useCallback(() => {
    setState({
      result: null,
      isProcessing: false,
      progressLabel: '',
    })
  }, [])

  const downloadMarkdown = useCallback(() => {
    const markdown = state.result?.markdown
    const name = state.result?.extracted?.courseName || 'syllabus'
    if (!markdown) return

    const filename = name.replace(/[^a-z0-9]/gi, '_') + '.md'
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({ title: `Downloaded ${filename}`, variant: 'success' })
  }, [state.result, toast])

  return {
    ...state,
    processFile,
    clearResults,
    downloadMarkdown,
  }
}
