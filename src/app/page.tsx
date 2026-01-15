'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { ConfigSection } from '@/components/config-section'
import { Dropzone } from '@/components/dropzone'
import { ResultsSection } from '@/components/results-section'
import { useSyllabusParser } from '@/hooks/use-syllabus-parser'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { Model, ServerConfig } from '@/types'

export default function Home() {
  const [apiKey, setApiKey] = useLocalStorage('openrouter_key', '')
  const [selectedModel, setSelectedModel] = useLocalStorage('selected_model', '')
  const [models, setModels] = useState<Model[]>([])
  const [hasServerKey, setHasServerKey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {
    result,
    isProcessing,
    progressLabel,
    processFile,
    clearResults,
    downloadMarkdown,
  } = useSyllabusParser(apiKey, selectedModel, hasServerKey)

  // Fetch config and models in parallel on mount
  useEffect(() => {
    async function init() {
      try {
        // Fetch both in parallel
        const [configRes, modelsRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/models'),
        ])

        // Process config
        if (configRes.ok) {
          const config: ServerConfig = await configRes.json()
          setHasServerKey(config.hasServerKey)
        }

        // Process models
        if (modelsRes.ok) {
          const modelsData: Model[] = await modelsRes.json()
          setModels(modelsData)
          // Set default model if none selected
          if (!selectedModel && modelsData.length > 0) {
            setSelectedModel(modelsData[0].id)
          }
        }
      } catch (error) {
        console.error('Error initializing:', error)
        // Fallback models
        const fallback = [
          { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo V2 Flash (256K ctx)' },
          { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (131K ctx)' },
        ]
        setModels(fallback)
        if (!selectedModel) {
          setSelectedModel(fallback[0].id)
        }
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, []) // Only run once on mount

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-4xl italic text-accent mb-4">Loading...</div>
          <p className="text-dim text-sm">Initializing Syllabus Parser</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_min(720px,100%)_1fr] px-6 min-h-screen">
      <div className="col-start-2">
        <Header />

        <ConfigSection
          apiKey={apiKey}
          setApiKey={setApiKey}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
          hasServerKey={hasServerKey}
        />

        <Dropzone
          onFileSelect={processFile}
          isProcessing={isProcessing}
          progressLabel={progressLabel}
        />

        {result?.success && result.extracted && (
          <ResultsSection
            result={result}
            onClear={clearResults}
            onDownload={downloadMarkdown}
          />
        )}

        <footer className="py-16 pt-8 text-center text-[0.7rem] tracking-wider uppercase text-dim">
          Compare AI models for syllabus extraction
        </footer>
      </div>
    </div>
  )
}
