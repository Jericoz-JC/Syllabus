interface StatsBarProps {
  eventCount: number
  model?: string
  tokens?: number
}

function formatModel(model?: string): string {
  if (!model) return '—'
  const parts = model.split('/')
  return parts[parts.length - 1].split(':')[0]
}

export function StatsBar({ eventCount, model, tokens }: StatsBarProps) {
  return (
    <div className="flex gap-8 py-6 mt-6 border-t border-border">
      <div className="text-center">
        <div className="text-2xl font-semibold text-accent">{eventCount}</div>
        <div className="text-xs tracking-wider uppercase text-dim">Events</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-semibold text-foreground">{formatModel(model)}</div>
        <div className="text-xs tracking-wider uppercase text-dim">Model</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-semibold text-foreground">
          {tokens?.toLocaleString() || '—'}
        </div>
        <div className="text-xs tracking-wider uppercase text-dim">Tokens</div>
      </div>
    </div>
  )
}
