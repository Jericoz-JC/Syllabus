export const config = {
  runtime: 'edge'
}

const FREE_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (1M ctx)' },
  { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo V2 Flash (256K ctx)' },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 (164K ctx)' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder (262K ctx)' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (131K ctx)' },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron 12B VL (vision)' }
]

export default function handler() {
  return Response.json(FREE_MODELS)
}
