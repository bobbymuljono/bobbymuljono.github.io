// Provider selector. Set CHAT_PROVIDER=anthropic (or "claude") to use Claude;
// anything else (or unset) uses Gemini. Embeddings always use Gemini separately.
import type { ChatProvider } from './types';
import { createGeminiProvider } from './gemini';
import { createAnthropicProvider } from './anthropic';

export type { ChatOptions, ChatProvider, Turn, Usage } from './types';

interface ChatEnv {
  CHAT_PROVIDER?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

export function getChatProvider(env: ChatEnv): ChatProvider {
  const choice = (env.CHAT_PROVIDER || 'gemini').toLowerCase();

  if (choice === 'anthropic' || choice === 'claude') {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required when CHAT_PROVIDER=anthropic');
    }
    return createAnthropicProvider(env.ANTHROPIC_API_KEY);
  }

  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required when CHAT_PROVIDER=gemini');
  }
  return createGeminiProvider(env.GEMINI_API_KEY);
}
