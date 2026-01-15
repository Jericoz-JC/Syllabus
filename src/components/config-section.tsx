'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toaster'
import type { Model } from '@/types'

interface ConfigSectionProps {
  apiKey: string
  setApiKey: (key: string) => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  models: Model[]
  hasServerKey: boolean
}

export function ConfigSection({
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  models,
  hasServerKey,
}: ConfigSectionProps) {
  const { toast } = useToast()

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openrouter_key', apiKey)
      toast({ title: 'API key saved', variant: 'success' })
    }
  }

  const modelOptions = models.map((m) => ({ value: m.id, label: m.name }))

  return (
    <section className="flex flex-col gap-4 py-6 mb-8 animate-fade-in">
      {!hasServerKey && (
        <div className="grid grid-cols-[100px_1fr_auto] items-center gap-4">
          <label className="text-xs font-medium tracking-wider uppercase text-dim">
            API Key
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
          />
          <Button variant="secondary" onClick={handleSaveKey}>
            Save
          </Button>
        </div>
      )}

      <div className="grid grid-cols-[100px_1fr_auto] items-center gap-4">
        <label className="text-xs font-medium tracking-wider uppercase text-dim">
          Model
        </label>
        <Select
          options={modelOptions}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        />
        <span className="w-[60px]" />
      </div>
    </section>
  )
}
