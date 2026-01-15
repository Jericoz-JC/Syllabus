export type EventType = 'assignment' | 'midterm' | 'final' | 'quiz' | 'project' | 'other'

export interface SyllabusEvent {
  type: EventType
  title: string
  dueDate: string
  description?: string
  weight?: string
}

export interface ExtractedData {
  courseName: string
  instructor: string
  semester: string
  events: SyllabusEvent[]
}

export interface ExtractionResult {
  success: boolean
  extracted?: ExtractedData
  markdown?: string
  model?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  error?: string
  rawResponse?: string
  reasoning?: string
}

export interface Model {
  id: string
  name: string
}

export interface ServerConfig {
  hasServerKey: boolean
  message: string
}
