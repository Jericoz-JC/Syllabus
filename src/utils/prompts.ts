export const EXTRACTION_PROMPT = `You are a syllabus parser. Extract all important dates, deadlines, and events from the provided syllabus text.

Return a JSON object with this exact structure:
{
  "courseName": "Course title",
  "instructor": "Professor name",
  "semester": "e.g., Spring 2026",
  "events": [
    {
      "type": "assignment|midterm|final|quiz|project|other",
      "title": "Event name",
      "dueDate": "YYYY-MM-DD format",
      "description": "Brief description (optional)",
      "weight": "Percentage of grade (optional)"
    }
  ]
}

Guidelines:
- Extract ALL dates mentioned: assignments, exams, quizzes, projects, presentations
- Convert relative dates (e.g., "Week 3") to actual dates if semester start is known
- If exact date unknown, estimate based on context
- Include weight/percentage if mentioned
- Type should be: assignment, midterm, final, quiz, project, or other
- Always use YYYY-MM-DD format for dates
- If year is not specified, assume 2025 academic year
- Return ONLY valid JSON, no markdown or extra text`

export const FREE_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (1M ctx) - Recommended' },
  { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo V2 Flash (256K ctx)' },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 (164K ctx)' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder (262K ctx)' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (131K ctx)' },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron 12B VL (vision)' }
]
