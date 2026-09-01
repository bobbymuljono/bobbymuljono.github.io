import type { Metadata } from 'next';
import './not-found.css';

export const metadata: Metadata = {
  title: 'Page not found',
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Page not found</h1>
      <p>
        The page you&apos;re looking for doesn&apos;t exist.{' '}
        <a href="/">Back home</a>.
      </p>
    </section>
  );
}
