# Syllabus Parser

Extract due dates, midterms, and assignments from university syllabus PDFs using AI.

## Features

- Drag-and-drop PDF upload
- Multiple AI model support (all free via OpenRouter)
- Export to Markdown
- Compare model outputs
- Clean, editorial UI design

## Free Models Available

| Model | Context | Best For |
|-------|---------|----------|
| Gemini 2.0 Flash | 1M | Multimodal, recommended |
| MiMo V2 Flash | 256K | Reasoning |
| DeepSeek R1 | 164K | Open-source reasoning |
| Qwen3 Coder | 262K | Code generation |
| Llama 3.3 70B | 131K | General purpose |

## Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

Open http://localhost:3000

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/syllabus-parser)

Or manually:

```bash
vercel
```

## Setup

1. Get an API key from [OpenRouter](https://openrouter.ai/settings/keys)
2. Paste it in the app
3. Upload a syllabus PDF
4. Download the extracted dates as Markdown

## Tech Stack

- **Runtime**: Bun
- **Backend**: Elysia (local) / Vercel Edge Functions (deployed)
- **PDF Parsing**: unpdf
- **AI**: OpenRouter API
- **Frontend**: Vanilla HTML/CSS/JS

## License

MIT
