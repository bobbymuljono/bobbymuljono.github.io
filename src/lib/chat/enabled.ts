// On/off switch for "Bobby AI" — gates both the launch button (ChatBot.astro)
// and the API endpoint (pages/api/chat.ts).
//
// In `npm run dev` the chatbot is ALWAYS enabled so it can be tested locally
// without touching the production flag (import.meta.env.DEV is true only under
// the dev server). Production builds honor ENABLED_IN_PROD only — flip it to
// true and redeploy to take the chatbot live.
const ENABLED_IN_PROD = true;
export const CHAT_ENABLED = import.meta.env.DEV || ENABLED_IN_PROD;
