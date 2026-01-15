export const config = {
  runtime: 'edge'
}

export default function handler() {
  const hasServerKey = !!process.env.OPENROUTER_API_KEY

  return Response.json({
    hasServerKey,
    message: hasServerKey
      ? 'API key configured on server'
      : 'Enter your OpenRouter API key'
  })
}
