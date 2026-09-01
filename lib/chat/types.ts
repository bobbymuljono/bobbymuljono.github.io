// Shared types for the pluggable chat-generation layer.
// Embeddings always run on Gemini (Anthropic has no embeddings API); only the
// chat *generation* is switchable between providers via the CHAT_PROVIDER env var.

export type Turn = { role: 'user' | 'model'; text: string };

export type Usage = { inputTokens: number | null; outputTokens: number | null };

export interface ChatOptions {
  system: string;
  history: Turn[];
  message: string;
  maxOutputTokens: number;
  temperature?: number;
}

export interface ChatProvider {
  /** Short identifier, e.g. "gemini" or "anthropic". */
  name: string;
  /** The concrete model id used for generation (logged to Supabase). */
  model: string;
  /** Stream the reply as text chunks; write token counts into `usage` as they arrive. */
  streamChat(opts: ChatOptions, usage: Usage): AsyncGenerator<string>;
}
