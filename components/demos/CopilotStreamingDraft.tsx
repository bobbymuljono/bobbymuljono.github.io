'use client';

import { useEffect, useRef, useState } from 'react';

const DRAFT = 'Good news, the 16 is in stock! If you want a step up, the 17 Pro has the same new chip with a sharper display and the pro camera. Want me to send a few photos?';
const START_DELAY_MS = 6350;
const STREAM_DURATION_MS = 900;
const STREAM_END_MS = START_DELAY_MS + STREAM_DURATION_MS;
const CURSOR_MOVE_MS = STREAM_END_MS + 450;
const SEND_MS = STREAM_END_MS + 750;
const SENT_MS = STREAM_END_MS + 1100;
const PANEL_DISMISS_MS = STREAM_END_MS + 1450;
const REPLY_MS = STREAM_END_MS + 1900;
const LOOP_DURATION_MS = 11000;

const TIMELINE_CLASSES = [
  'ccd--cursor-to-send',
  'ccd--sending',
  'ccd--sent',
  'ccd--panel-dismissed',
  'ccd--reply',
] as const;

/** Replays the edited reply as a typewriter within the demo's shared 11s loop. */
export default function CopilotStreamingDraft() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(DRAFT.length);

  useEffect(() => {
    const demo = rootRef.current?.closest('.ccd');
    if (!demo) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(DRAFT.length);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = (now - startedAt) % LOOP_DURATION_MS;

      demo.classList.toggle('ccd--cursor-to-send', elapsed >= CURSOR_MOVE_MS);
      demo.classList.toggle('ccd--sending', elapsed >= SEND_MS);
      demo.classList.toggle('ccd--sent', elapsed >= SENT_MS);
      demo.classList.toggle('ccd--panel-dismissed', elapsed >= PANEL_DISMISS_MS);
      demo.classList.toggle('ccd--reply', elapsed >= REPLY_MS);

      if (elapsed < START_DELAY_MS) {
        setShown(0);
      } else {
        const progress = Math.min(1, (elapsed - START_DELAY_MS) / STREAM_DURATION_MS);
        setShown(Math.floor(DRAFT.length * progress));
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      demo.classList.remove(...TIMELINE_CLASSES);
    };
  }, []);

  return (
    <span ref={rootRef} className="ccd__draft-stream">
      <span className="ccd__draft-stream-reserve">{DRAFT}</span>
      <span className="ccd__draft-stream-live">
        {DRAFT.slice(0, shown)}
        {shown > 0 && shown < DRAFT.length ? <span className="ccd__caret" /> : null}
      </span>
    </span>
  );
}
