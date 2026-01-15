import { cn } from '@/lib/utils'
import type { EventType } from '@/types'

interface EventBadgeProps {
  type: EventType | string
}

export function EventBadge({ type }: EventBadgeProps) {
  const badgeClass = cn(
    'badge',
    type === 'midterm' || type === 'final' ? 'badge-exam' : '',
    type === 'assignment' ? 'badge-assignment' : '',
    type === 'quiz' ? 'badge-quiz' : '',
    type === 'project' ? 'badge-project' : '',
    type === 'other' || !['midterm', 'final', 'assignment', 'quiz', 'project'].includes(type)
      ? 'badge-other'
      : ''
  )

  return <span className={badgeClass}>{type}</span>
}
