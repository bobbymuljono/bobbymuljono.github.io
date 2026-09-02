'use client';

import { useEffect, useRef, useState } from 'react';

const PREFIX = 'The WISMO rate of CS tickets for SG region for the week of 24 August 2026 is ';
const RATE = '30%';
const MIDDLE = ', a ';
const CHANGE = '2%';
const SUFFIX = ' markup versus the previous week. Would you like me to dive deeper into the WISMO sub-categories?';
const ANSWER = `${PREFIX}${RATE}${MIDDLE}${CHANGE}${SUFFIX}`;

const START_DELAY_MS = 4200;
const STREAM_DURATION_MS = 1700;
const LOOP_DURATION_MS = 7000;

function Part({ text, from, shown }: { text: string; from: number; shown: number }) {
  return text.slice(0, Math.max(0, shown - from));
}

/**
 * Recreates the analytics agent's streamed answer without making a network call.
 * It only runs while visible, stops in background tabs, and renders the complete
 * answer immediately when the visitor prefers reduced motion.
 */
export default function AnalyticsStreamingAnswer() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(ANSWER.length);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const demo = root.closest('.amini');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      demo?.classList.remove('amini--running');
      setShown(ANSWER.length);
      return;
    }

    let visible = false;
    let frame = 0;
    let cycleStartedAt = 0;

    const tick = (now: number) => {
      if (!visible || document.hidden) return;

      const elapsed = (now - cycleStartedAt) % LOOP_DURATION_MS;
      if (elapsed < START_DELAY_MS) {
        setShown(0);
      } else {
        const progress = Math.min(1, (elapsed - START_DELAY_MS) / STREAM_DURATION_MS);
        setShown(Math.floor(ANSWER.length * progress));
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      demo?.classList.add('amini--running');
      setShown(0);
      cycleStartedAt = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      demo?.classList.remove('amini--running');
      setShown(ANSWER.length);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    }, { threshold: 0.2 });

    const onVisibilityChange = () => {
      if (visible && !document.hidden) start();
      else stop();
    };

    observer.observe(root);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(frame);
      demo?.classList.remove('amini--running');
    };
  }, []);

  let offset = 0;
  const prefixOffset = offset;
  offset += PREFIX.length;
  const rateOffset = offset;
  offset += RATE.length;
  const middleOffset = offset;
  offset += MIDDLE.length;
  const changeOffset = offset;
  offset += CHANGE.length;
  const suffixOffset = offset;

  return (
    <span ref={rootRef} className="amini__stream">
      <span className="amini__stream-reserve">
        {PREFIX}<b>{RATE}</b>{MIDDLE}<b>{CHANGE}</b>{SUFFIX}
      </span>
      <span className="amini__stream-live">
        <Part text={PREFIX} from={prefixOffset} shown={shown} />
        <b><Part text={RATE} from={rateOffset} shown={shown} /></b>
        <Part text={MIDDLE} from={middleOffset} shown={shown} />
        <b><Part text={CHANGE} from={changeOffset} shown={shown} /></b>
        <Part text={SUFFIX} from={suffixOffset} shown={shown} />
        {shown > 0 && shown < ANSWER.length ? <span className="amini__caret" /> : null}
      </span>
    </span>
  );
}
