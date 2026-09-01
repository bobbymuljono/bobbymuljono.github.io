// Gemini chat-generation provider.
import { GoogleGenAI } from '@google/genai';
import type { ChatOptions, ChatProvider, Usage } from './types';

const CHAT_MODEL = 'gemini-3.5-flash';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createGeminiProvider(apiKey: string): ChatProvider {
  const ai = new GoogleGenAI({ apiKey });

  return {
    name: 'gemini',
    model: CHAT_MODEL,
    async *streamChat(opts: ChatOptions, usage: Usage) {
      const contents = [
        ...opts.history.map((t) => ({
          role: t.role === 'model' ? 'model' : 'user',
          parts: [{ text: t.text }],
        })),
        { role: 'user', parts: [{ text: opts.message }] },
      ];

      const params = {
        model: CHAT_MODEL,
        contents,
        config: {
          systemInstruction: opts.system,
          maxOutputTokens: opts.maxOutputTokens,
          temperature: opts.temperature ?? 0.6,
        },
      };

      // Retry transient overload (503) when starting the stream.
      let result;
      for (let i = 0; i < 3; i++) {
        try {
          result = await ai.models.generateContentStream(params);
          break;
        } catch (err) {
          const status = (err as { status?: number })?.status;
          if (status === 503 && i < 2) {
            await sleep(500 * (i + 1));
            continue;
          }
          throw err;
        }
      }
      if (!result) return;

      for await (const chunk of result) {
        if (chunk.text) yield chunk.text;
        const u = chunk.usageMetadata;
        if (u) {
          usage.inputTokens = u.promptTokenCount ?? usage.inputTokens;
          usage.outputTokens = u.candidatesTokenCount ?? usage.outputTokens;
        }
      }
    },
  };
}
