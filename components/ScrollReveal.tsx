'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Scroll-reveal: ports the IntersectionObserver from Astro's BaseLayout.
 *
 * The `js-reveal` class is added to <html> in the blocking head script (see
 * app/layout.tsx) BEFORE first paint, so `[data-reveal]` elements start hidden
 * with no flash. This component wires the observer that toggles `is-revealed`.
 *
 * Two things this must get right that Astro's per-page inline script got for free:
 *  - Client navigation: the root layout (and this component) stay mounted across
 *    route changes, so we re-observe the new page's `[data-reveal]` elements on
 *    each `pathname` change — otherwise below-the-fold content on a navigated-to
 *    page would stay at opacity:0.
 *  - A single persistent observer that is never disconnected. It lives for the
 *    app's lifetime with the layout, so it keeps firing on scroll (and survives
 *    React's dev StrictMode double-invoke of effects). Re-observing an element
 *    is a no-op, and `:not(.is-revealed)` skips ones already shown.
 *
 * Fully progressive enhancement: with no JS (or prefers-reduced-motion), the
 * `js-reveal` class is never added and all content is visible.
 */
export default function ScrollReveal() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-reveal');

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observerRef.current?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
      );
    }

    const observer = observerRef.current;
    document
      .querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')
      .forEach((el) => observer.observe(el));

    // Intentionally no disconnect on cleanup: the observer is app-lifetime state
    // (this component never unmounts inside the root layout) and must keep firing
    // after StrictMode's dev re-run and across client-side navigation.
  }, [pathname]);

  return null;
}
