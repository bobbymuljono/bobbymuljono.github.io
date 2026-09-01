'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import './ContactForm.css';

// "Shoot me an email" dialog — a native <dialog> modal with name / email /
// message fields that POST to /api/contact (Resend). Ports the Astro island to
// React. Progressive enhancement note no longer applies (this is a client
// component), but the GitHub / LinkedIn links beside it remain the JS-free path.
const endpoint = '/api/contact';

export default function ContactForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [done, setDone] = useState(false);

  const open = () => {
    // Reset to a clean form each time it opens.
    setDone(false);
    setStatus('');
    setIsError(false);
    dialogRef.current?.showModal();
    const nameInput = formRef.current?.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement | null;
    nameInput?.focus();
  };

  const close = () => dialogRef.current?.close();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;

    const data = new FormData(e.currentTarget);
    const body = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
      company: String(data.get('company') || ''), // honeypot
    };

    setBusy(true);
    setIsError(false);
    setStatus('Sending…');

    // Backstop the request so a hung connection can't leave the button stuck on
    // "Sending…" forever. Slightly longer than the server's own Resend timeout.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (res.ok) {
        setDone(true);
      } else {
        let msg = 'Something went wrong. Please try again.';
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        setStatus(msg);
        setIsError(true);
      }
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === 'AbortError';
      setStatus(
        timedOut
          ? 'That took too long. Please try again, or reach out via GitHub or LinkedIn.'
          : 'Could not reach the server. Please try again.',
      );
      setIsError(true);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  return (
    <div className="contactform" data-endpoint={endpoint}>
      <button
        className="button button--secondary contactform__launch"
        type="button"
        onClick={open}
      >
        Shoot me an email
      </button>

      <dialog
        ref={dialogRef}
        className="contactform__dialog"
        aria-label="Send Bobby an email"
      >
        <header className="contactform__head">
          <div>
            <span className="contactform__title">Shoot me an email</span>
            <span className="contactform__sub">goes straight to my inbox</span>
          </div>
          <button
            className="contactform__close"
            type="button"
            onClick={close}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <form
          ref={formRef}
          className="contactform__form"
          onSubmit={onSubmit}
          hidden={done}
        >
          {/* Honeypot: hidden from humans, catches bots. Out of the tab order. */}
          <div className="contactform__hp" aria-hidden="true">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <label className="contactform__field">
            <span className="contactform__label">Name</span>
            <input
              className="contactform__input"
              type="text"
              name="name"
              maxLength={120}
              autoComplete="name"
              required
            />
          </label>

          <label className="contactform__field">
            <span className="contactform__label">Email</span>
            <input
              className="contactform__input"
              type="email"
              name="email"
              maxLength={200}
              autoComplete="email"
              required
            />
          </label>

          <label className="contactform__field">
            <span className="contactform__label">Message</span>
            <textarea
              className="contactform__input contactform__textarea"
              name="message"
              rows={4}
              maxLength={4000}
              required
            />
          </label>

          <p
            className={clsx('contactform__status', { 'is-error': isError })}
            role="status"
            aria-live="polite"
          >
            {isError && (
              <svg
                className="contactform__erricon"
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
                <path
                  d="M12 10v4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17.6" r="1.1" fill="currentColor" />
              </svg>
            )}
            {status}
          </p>

          <div className="contactform__actions">
            <button
              className="button button--primary button--sm"
              type="submit"
              disabled={busy}
            >
              Send message
            </button>
          </div>
        </form>

        <div className="contactform__done" hidden={!done}>
          <p className="contactform__donetitle">
            Thanks, your message is on its way.
          </p>
          <p className="contactform__donesub">
            I&apos;ll reply to the email you gave me. Talk soon.
          </p>
          <button
            className="button button--secondary button--sm"
            type="button"
            onClick={close}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
