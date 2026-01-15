import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { cors } from '@elysiajs/cors'
import { uploadRoutes } from './routes/upload'
import { extractRoutes } from './routes/extract'
import { FREE_MODELS } from './utils/prompts'

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: 'styles',
    prefix: '/styles'
  }))
  .use(staticPlugin({
    assets: 'scripts',
    prefix: '/scripts'
  }))
  .use(uploadRoutes)
  .use(extractRoutes)
  .get('/api/models', () => FREE_MODELS)
  .get('/api/config', () => ({
    hasServerKey: !!process.env.OPENROUTER_API_KEY,
    message: process.env.OPENROUTER_API_KEY
      ? 'API key configured on server'
      : 'Enter your OpenRouter API key'
  }))
  .get('/', () => Bun.file('index.html'))
  .listen(3000)

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    SYLLABUS PARSER                        ║
║═══════════════════════════════════════════════════════════║
║  Server running at http://localhost:${app.server?.port}                 ║
║                                                           ║
║  API Endpoints:                                           ║
║    POST /api/upload   - Upload PDF                        ║
║    POST /api/extract  - Extract with AI                   ║
║    GET  /api/models   - List available models             ║
╚═══════════════════════════════════════════════════════════╝
`)
