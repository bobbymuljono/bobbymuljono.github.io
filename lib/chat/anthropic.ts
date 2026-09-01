// Claude (Anthropic) chat-generation provider.
import Anthropic from '@anthropic-ai/sdk';
import type { ChatOptions, ChatProvider, Usage } from './types';

const CHAT_MODEL = 'claude-haiku-4-5';

export function createAnthropicProvider(apiKey: string): ChatProvider {
  // The SDK auto-retries 429/5xx with backoff (maxRetries defaults to 2).
  const client = new Anthropic({ apiKey });

  return {
    name: 'anthropic',
    model: CHAT_MODEL,
    async *streamChat(opts: ChatOptions, usage: Usage) {
      const messages = [
        ...opts.history.map((t) => ({
          role: (t.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: t.text,
        })),
        { role: 'user' as const, content: opts.message },
      ];

      const stream = client.messages.stream({
        model: CHAT_MODEL,
        max_tokens: opts.maxOutputTokens,
        system: opts.system,
        messages,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield event.delta.text;
        }
      }

      const final = await stream.finalMessage();
      usage.inputTokens = final.usage.input_tokens ?? usage.inputTokens;
      usage.outputTokens = final.usage.output_tokens ?? usage.outputTokens;
    },
  };
}
