'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CourseCard } from './course-card'
import { EventsTable } from './events-table'
import { StatsBar } from './stats-bar'
import { RawPanel } from './raw-panel'
import type { ExtractionResult } from '@/types'

interface ResultsSectionProps {
  result: ExtractionResult
  onClear: () => void
  onDownload: () => void
}

export function ResultsSection({ result, onClear, onDownload }: ResultsSectionProps) {
  const [showRaw, setShowRaw] = useState(false)
  const data = result.extracted

  if (!data) return null

  return (
    <section className="mt-12 pt-12 border-t border-border animate-slide-up">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <h2 className="font-serif text-3xl italic font-normal text-foreground">
          Extracted Events
        </h2>
        <div className="flex gap-2">
          <Button variant="primary" onClick={onDownload}>
            Download .md
          </Button>
          <Button variant="secondary" onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? 'Hide' : 'Raw'}
          </Button>
          <Button variant="secondary" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>

      <CourseCard
        courseName={data.courseName}
        instructor={data.instructor}
        semester={data.semester}
      />

      <EventsTable events={data.events || []} />

      <StatsBar
        eventCount={data.events?.length || 0}
        model={result.model}
        tokens={result.usage?.total_tokens}
      />

      {showRaw && <RawPanel result={result} />}
    </section>
  )
}
