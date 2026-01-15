# Syllabus Parser

Extract due dates, midterms, and assignments from university syllabus PDFs using AI.

## Features

- **Drag-and-drop PDF upload** — Simply drop your syllabus file
- **Free AI models** via OpenRouter (no cost)
- **Structured extraction** — Dates, events, and weights parsed to JSON
- **Markdown export** — Ready for Notion, Obsidian, or any notes app
- **Clean editorial UI** — Minimal, distraction-free design

## How It Works

### 1. PDF Text Extraction
When you upload a PDF, the app uses **pdf-parse** to extract raw text from the document. This text preserves the content structure including course information, schedules, and assignment details.

### 2. LLM Processing via OpenRouter
The extracted text is sent to an AI model through [OpenRouter](https://openrouter.ai). The app uses a structured **system prompt** that instructs the model to:

- Identify course metadata (name, instructor, semester)
- Extract ALL dates: assignments, exams, quizzes, projects, presentations
- Convert relative dates ("Week 3") to absolute dates when possible
- Categorize events by type: `assignment`, `midterm`, `final`, `quiz`, `project`, `other`
- Return structured JSON with ISO date format (YYYY-MM-DD)

### 3. The Extraction Prompt
The AI receives this system instruction:

```
You are a syllabus parser. Extract all important dates, deadlines, 
and events from the provided syllabus text.

Return a JSON object with this structure:
{
  "courseName": "Course title",
  "instructor": "Professor name", 
  "semester": "e.g., Spring 2026",
  "events": [
    {
      "type": "assignment|midterm|final|quiz|project|other",
      "title": "Event name",
      "dueDate": "YYYY-MM-DD",
      "description": "Brief description (optional)",
      "weight": "Percentage of grade (optional)"
    }
  ]
}
```

The model uses **temperature 0.1** for consistent, deterministic outputs — essential for structured data extraction.

### 4. Markdown Generation
Once parsed, the app converts the JSON response into clean Markdown, grouped by event type and sorted by date. Export with one click.

---

## Free Models

| Model | Context | Notes |
|-------|---------|-------|
| **MiMo V2 Flash** | 256K | Default. Xiaomi's MoE model, excellent reasoning. |
| **Llama 3.3 70B** | 131K | Meta's general-purpose model, GPT-4 level. |

Both models are **100% free** on OpenRouter.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000

## Setup

1. Get an API key from [OpenRouter](https://openrouter.ai/settings/keys) (free)
2. Paste it in the app
3. Upload a syllabus PDF
4. Download extracted dates as Markdown

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/syllabus-parser)

Set `OPENROUTER_API_KEY` in environment variables for server-side key support.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **PDF Parsing**: pdf-parse
- **AI Gateway**: OpenRouter API
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## License

MIT
