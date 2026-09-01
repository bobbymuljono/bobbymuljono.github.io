import type { Metadata } from 'next';
import ChatBot from '@/components/ChatBot';
import './not-found.css';

export const metadata: Metadata = {
  title: 'Page not found',
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>This page wandered off.</h1>
      <p>
        The link is broken or the page has moved. No dead end, though. Here are a
        few ways back in.
      </p>
      <div className="not-found__actions">
        <a className="button button--primary" href="/">
          Back home
        </a>
        <a className="button button--secondary" href="/projects/">
          See my work
        </a>
        <ChatBot />
      </div>
    </section>
  );
}
