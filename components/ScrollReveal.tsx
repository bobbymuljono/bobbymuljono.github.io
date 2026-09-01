'use client';

import { useEffect } from 'react';

/**
 * Scroll-reveal: ports the IntersectionObserver from Astro's BaseLayout.
 *
 * The `js-reveal` class is added to <html> in the blocking head script (see
 * app/layout.tsx) BEFORE first paint, so `[data-reveal]` elements start hidden
 * with no flash. This component only wires up the observer that toggles
 * `is-revealed` as elements scroll into view. Fully progressive enhancement:
 * with no JS (or prefers-reduced-motion), `js-reveal` is never added and all
 * content is visible.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) return;

    // Idempotent: the head script normally adds this already.
    document.documentElement.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    document
      .querySelectorAll('[data-reveal]')
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
