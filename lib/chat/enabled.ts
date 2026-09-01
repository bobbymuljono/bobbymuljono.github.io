// Chat on/off flag — isomorphic (imported by BOTH the ChatBot client component
// and the server /api/chat route, so it must not touch server-only APIs).
//
// Ports src/lib/chat/enabled.ts. In dev the chat is always enabled (so it can be
// tested locally); in production it's gated by the source-level ENABLED_IN_PROD
// boolean. As of the migration ENABLED_IN_PROD is true — the chatbot is live.
//
// `process.env.NODE_ENV` is statically inlined by Next at build time (safe to
// reference in client code — it's not a secret), replacing Astro's `import.meta.env.DEV`.
const ENABLED_IN_PROD = true;

export const CHAT_ENABLED =
  process.env.NODE_ENV !== 'production' || ENABLED_IN_PROD;
