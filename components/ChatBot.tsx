'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { CHAT_ENABLED } from '@/lib/chat/enabled';
import './ChatBot.css';

// "Bobby AI" chat island. Ports the Astro vanilla-TS island to React, preserving
// the exact request contract and the RAW text/plain streaming read (NOT SSE) so
// it stays compatible with /api/chat.

type Turn = { role: 'user' | 'model'; text: string };
type Msg = {
  id: number;
  role: 'user' | 'bot';
  text: string;
  streaming: boolean;
  error?: boolean;
};

const endpoint = '/api/chat';

const STARTERS = [
  'What AI work have you done?',
  'What project are you most proud of?',
  'How do you build with AI as an analyst?',
  'How can I reach you?',
];

const Spark = () => (
  <svg
    className="bobbychat__spark"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 2c.4 3.6 2.4 5.6 6 6-3.6.4-5.6 2.4-6 6-.4-3.6-2.4-5.6-6-6 3.6-.4 5.6-2.4 6-6Z"
      fill="currentColor"
    />
    <path
      d="M18.5 13c.2 1.6 1 2.4 2.5 2.6-1.5.2-2.3 1-2.5 2.4-.2-1.6-1-2.4-2.5-2.6 1.5-.2 2.3-1 2.5-2.4Z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
);

// Warning glyph for failed replies — the one place the reserved danger color
// appears, paired with a shape so the error doesn't rely on color alone.
const AlertIcon = () => (
  <svg
    className="bobbychat__erricon"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 3 1.5 21h21L12 3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M12 10v4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17.6" r="1.1" fill="currentColor" />
  </svg>
);

export default function ChatBot({
  sm = false,
  primary = false,
}: {
  sm?: boolean;
  primary?: boolean;
}) {
  const variant = primary ? 'button--primary' : 'button--secondary';

  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const historyRef = useRef<Turn[]>([]);
  const sessionIdRef = useRef<string>('');
  const deviceIdRef = useRef<string>('');
  const idRef = useRef(0);
  const rafRef = useRef(0);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [showStarters, setShowStarters] = useState(true);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  // Politely announced to screen readers when a reply (or error) is complete,
  // so the flagship feature isn't silent — without re-announcing every
  // typewriter frame the way an aria-live on the visible log would.
  const [announce, setAnnounce] = useState('');

  // Per-visitor ids (client-only). sessionId: session memory + rate-limit key.
  // deviceId: stable per-device, sent raw, stored server-side only as an HMAC hash.
  useEffect(() => {
    const ensure = (key: string) => {
      try {
        let v = localStorage.getItem(key) || '';
        if (!v) {
          v = crypto.randomUUID();
          localStorage.setItem(key, v);
        }
        return v;
      } catch {
        return crypto.randomUUID();
      }
    };
    sessionIdRef.current = ensure('bobbychat_session');
    deviceIdRef.current = ensure('bobbychat_device');
  }, []);

  const scrollToBottomIfNear = useCallback(() => {
    const log = logRef.current;
    if (!log) return;
    const atBottom =
      log.scrollHeight - log.scrollTop - log.clientHeight < 40;
    if (atBottom) log.scrollTop = log.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottomIfNear();
  }, [messages, scrollToBottomIfNear]);

  const open = () => {
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  };
  const close = () => dialogRef.current?.close();

  const setBotText = (id: number, text: string) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, text } : m)),
    );
  const finishBot = (id: number) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
    );
  const setBotError = (id: number, text: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, text, streaming: false, error: true } : m,
      ),
    );
    setAnnounce(text);
  };

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message || busy) return;

      setBusy(true);
      setInput('');
      setShowStarters(false);

      const botId = ++idRef.current;
      setMessages((prev) => [
        ...prev,
        { id: ++idRef.current, role: 'user', text: message, streaming: false },
        { id: botId, role: 'bot', text: '', streaming: true },
      ]);

      let rafId = 0;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            message,
            history: historyRef.current,
            sessionId: sessionIdRef.current,
            deviceId: deviceIdRef.current,
          }),
        });

        if (!res.ok || !res.body) {
          let msg = 'Sorry, something went wrong. Please try again.';
          try {
            const err = await res.json();
            if (err?.error) msg = err.error;
          } catch {}
          setBotError(botId, msg);
        } else {
          const reader = res.body.getReader();
          const dec = new TextDecoder();
          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches;

          let full = ''; // everything received so far
          let shown = 0; // characters currently painted
          let streamDone = false;

          if (prefersReducedMotion) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              full += dec.decode(value, { stream: true });
              shown = full.length;
              setBotText(botId, full);
            }
          } else {
            // Adaptive typewriter: reveal a few chars per frame so the text flows
            // smoothly no matter how bursty the network chunks are.
            const pumping = new Promise<void>((resolve) => {
              const step = () => {
                const remaining = full.length - shown;
                if (remaining > 0) {
                  shown = Math.min(
                    full.length,
                    shown + Math.max(2, Math.ceil(remaining / 6)),
                  );
                  setBotText(botId, full.slice(0, shown));
                }
                if (streamDone && shown >= full.length) {
                  resolve();
                  return;
                }
                rafId = requestAnimationFrame(step);
                rafRef.current = rafId;
              };
              step();
            });

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              full += dec.decode(value, { stream: true });
            }
            streamDone = true;
            await pumping;
          }

          historyRef.current.push({ role: 'user', text: message });
          historyRef.current.push({ role: 'model', text: full });
          setAnnounce(full);
        }
      } catch {
        setBotError(botId, 'Sorry, I could not reach the server. Please try again.');
      } finally {
        if (rafId) cancelAnimationFrame(rafId);
        finishBot(botId);
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy],
  );

  // Clean up any in-flight animation frame on unmount.
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const launchClasses = clsx('button', variant, 'bobbychat__launch', {
    'button--sm': sm,
  });

  if (!CHAT_ENABLED) {
    return (
      <div className="bobbychat" data-endpoint={endpoint}>
        <button
          className={clsx(launchClasses, 'bobbychat__launch--disabled')}
          type="button"
          disabled
          aria-disabled="true"
        >
          Chat with Bobby AI
          <Spark />
          <span className="badge bobbychat__badge">In development</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bobbychat" data-endpoint={endpoint}>
      <button className={launchClasses} type="button" onClick={open}>
        Chat with Bobby AI
        <Spark />
      </button>

      <dialog
        ref={dialogRef}
        className="bobbychat__dialog"
        aria-label="Chat with Bobby AI"
      >
        <header className="bobbychat__head">
          <div>
            <span className="bobbychat__title">Bobby AI</span>
            <span className="bobbychat__sub">an AI version of me</span>
          </div>
          <button
            className="bobbychat__close"
            type="button"
            onClick={close}
            aria-label="Close chat"
          >
            &times;
          </button>
        </header>

        <div className="bobbychat__log" ref={logRef}>
          <div className="bobbychat__msg bobbychat__msg--bot">
            Hi, I&apos;m an AI version of Bobby. Ask me about my work, my
            projects, or how I build with AI.
          </div>

          {showStarters && (
            <div className="bobbychat__starters">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  className="bobbychat__chip"
                  type="button"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={clsx('bobbychat__msg', `bobbychat__msg--${m.role}`, {
                'is-streaming': m.streaming,
                'is-error': m.error,
              })}
            >
              {m.error && <AlertIcon />}
              {m.text}
            </div>
          ))}
        </div>

        {/* Off-screen live region: the completed reply is announced once here,
            keeping the visible typewriter free of aria-live churn. */}
        <div className="bobbychat__sr" role="status" aria-live="polite">
          {announce}
        </div>

        <form
          className="bobbychat__form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input.trim());
          }}
        >
          <input
            ref={inputRef}
            className="bobbychat__input"
            type="text"
            name="q"
            autoComplete="off"
            maxLength={2000}
            placeholder="Ask me something…"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
          />
          <button
            className="button button--primary button--sm"
            type="submit"
            disabled={busy}
          >
            Send
          </button>
        </form>
      </dialog>
    </div>
  );
}
