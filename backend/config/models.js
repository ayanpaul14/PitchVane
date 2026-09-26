export const GROQ_DEFAULT_MODEL = 'openai/gpt-oss-120b';
export const GROQ_FALLBACK_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
];

/**
 * Executes a chat completion with automatic model fallback
 */
export async function createGroqChatCompletion(groq, options) {
  let lastError = null;

  for (const model of GROQ_FALLBACK_MODELS) {
    try {
      const response = await groq.chat.completions.create({
        ...options,
        model,
      });
      return response;
    } catch (err) {
      lastError = err;
      console.warn(`[Groq Model ${model} failed, trying next]:`, err.message);
    }
  }

  throw lastError;
}
