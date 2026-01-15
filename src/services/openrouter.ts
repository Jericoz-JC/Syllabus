interface OpenRouterRequest {
  apiKey: string
  model: string
  messages: Array<{ role: string; content: string }>
}

interface OpenRouterResponse {
  content: string
  model: string
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  reasoning?: string
}

export async function callOpenRouter(request: OpenRouterRequest): Promise<OpenRouterResponse> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${request.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Syllabus Parser Eval'
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: 0.1
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string; reasoning?: string } }>
    model: string
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  }
  const choice = data.choices[0]
  if (!choice) {
    throw new Error('No response from AI model')
  }

  return {
    content: choice.message.content,
    model: data.model,
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    reasoning: choice.message.reasoning
  }
}
