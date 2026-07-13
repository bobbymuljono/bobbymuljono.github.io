// Contact-form endpoint — delivers the "Shoot me an email" dialog to Bobby's
// inbox via Resend (https://resend.com).
//
// Runs on-demand (not prerendered), same as /api/chat. Flow per request:
//   1. parse + validate (name / email / message) and drop honeypot hits
//   2. send one email via the Resend REST API, TO the owner inbox, with the
//      visitor's address as `reply_to` so a Gmail "Reply" goes straight to them
//   3. return JSON { ok: true } or a friendly error
//
// Secrets are read server-side only. RESEND_API_KEY is required for delivery.
// FREE-TIER NOTE: without a verified domain, Resend only allows sending FROM
// `onboarding@resend.dev` and TO the account owner's own email. So CONTACT_TO
// must be the Gmail the Resend account was created with. Verify a custom domain
// later to (a) send from a branded address and (b) add a visitor auto-reply.

export const prerender = false;

import type { APIRoute } from 'astro';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
// Overridable, with sensible defaults for the free-tier sandbox sender.
const CONTACT_TO = import.meta.env.CONTACT_TO || 'bobbymul93@gmail.com';
const CONTACT_FROM = import.meta.env.CONTACT_FROM || 'Portfolio Contact <onboarding@resend.dev>';

const MAX_NAME_CHARS = 120;
const MAX_EMAIL_CHARS = 200;
const MAX_MESSAGE_CHARS = 4000;
// Cap the outbound Resend call so a hung upstream can't leave the request (and
// the visitor's "Sending…" state) waiting until the platform's function timeout.
const RESEND_TIMEOUT_MS = 10000;

// Deliberately permissive — just enough to reject obvious non-addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: { name?: string; email?: string; message?: string; company?: string };
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  // Honeypot: real users never fill the hidden `company` field. Pretend success
  // so bots get no signal, but send nothing.
  if ((payload.company ?? '').trim()) {
    return json(200, { ok: true });
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const message = (payload.message ?? '').trim();

  if (!name || !email || !message) {
    return json(400, { error: 'Please fill in your name, email, and message.' });
  }
  if (name.length > MAX_NAME_CHARS || email.length > MAX_EMAIL_CHARS) {
    return json(413, { error: 'Name or email is too long.' });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return json(413, { error: `Message is too long (max ${MAX_MESSAGE_CHARS} characters).` });
  }
  if (!EMAIL_RE.test(email)) {
    return json(400, { error: 'That email address does not look right.' });
  }

  if (!RESEND_API_KEY) {
    console.error('Contact form: RESEND_API_KEY is not set.');
    return json(500, { error: 'The contact form is not configured yet. Please reach out via GitHub or LinkedIn.' });
  }

  const text =
    `New message from your portfolio contact form.\n\n` +
    `Name:  ${name}\n` +
    `Email: ${email}\n\n` +
    `${message}\n`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = '';
      try {
        detail = JSON.stringify(await res.json());
      } catch {}
      console.error(`Resend send failed (${res.status}):`, detail);
      return json(502, { error: 'Sorry, the message could not be sent. Please try again later.' });
    }
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'AbortError';
    console.error(
      timedOut ? `Resend request timed out after ${RESEND_TIMEOUT_MS}ms` : 'Resend request threw:',
      err,
    );
    return json(502, { error: 'Sorry, the message could not be sent. Please try again later.' });
  } finally {
    clearTimeout(timer);
  }

  return json(200, { ok: true });
};
