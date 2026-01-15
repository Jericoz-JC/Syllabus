'use client'

import { memo } from 'react'
import { EventBadge } from './event-badge'
import type { SyllabusEvent } from '@/types'

interface EventsTableProps {
  events: SyllabusEvent[]
}

function EventsTableComponent({ events }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-background-card rounded p-12 text-center text-dim">
        No events found in this syllabus
      </div>
    )
  }

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    if (isNaN(dateA)) return 1
    if (isNaN(dateB)) return -1
    return dateA - dateB
  })

  return (
    <div className="bg-background-card rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-background-elevated border-b border-border">
            <th className="px-4 py-3 text-left text-[0.65rem] font-semibold tracking-wider uppercase text-dim">
              Date
            </th>
            <th className="px-4 py-3 text-left text-[0.65rem] font-semibold tracking-wider uppercase text-dim">
              Type
            </th>
            <th className="px-4 py-3 text-left text-[0.65rem] font-semibold tracking-wider uppercase text-dim">
              Title
            </th>
            <th className="px-4 py-3 text-left text-[0.65rem] font-semibold tracking-wider uppercase text-dim">
              Weight
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event, index) => (
            <tr
              key={index}
              className="border-b border-border last:border-0 hover:bg-background-elevated transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="px-4 py-3 text-foreground">{event.dueDate || 'TBD'}</td>
              <td className="px-4 py-3">
                <EventBadge type={event.type} />
              </td>
              <td className="px-4 py-3 text-foreground">{event.title || '—'}</td>
              <td className="px-4 py-3 text-muted">{event.weight || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const EventsTable = memo(EventsTableComponent)
