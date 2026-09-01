'use client';

import { useEffect } from 'react';

/**
 * DevInspector — hold Alt and click any element to open its source line in
 * VS Code. A dev-only replacement for the click-to-component family, which all
 * broke on React 19 when `fiber._debugSource` was removed.
 *
 * How it works: `dev/jsx-dev-runtime.js` (wired in via next.config.mjs, browser
 * dev build only) stamps every host element with `data-inspect="file:line:col"`.
 * Here we read the nearest one under the cursor and open it with a
 * `vscode://file/...` deep link. No external dependency, no fiber internals.
 *
 * Why not Next's `/__nextjs_launch-editor`? Two Windows dead-ends: it detects the
 * editor via `wmic`, which Windows 11 removed, and it rejects any path containing
 * a space (this repo lives under ".../OneDrive/Desktop/...") as an RCE mitigation.
 * The `vscode://` handler sidesteps both -- the OS routes it straight to VS Code.
 *
 * Interactions, only while Alt is held:
 *   - move the pointer → the matched element is outlined with a small label
 *   - left-click       → open that element's source line in the editor
 *
 * Note: elements rendered by Server Components carry no `data-inspect` (the
 * shim only touches the browser build), so only client-rendered UI is clickable.
 * That covers the interactive components; a purely server-rendered wrapper is not.
 */
export function DevInspector() {
  useEffect(() => {
    const ACCENT = 'var(--color-accent, #2e5e43)';
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;z-index:2147483646;pointer-events:none;display:none;border:1px solid ${ACCENT};background:color-mix(in srgb, ${ACCENT} 12%, transparent);border-radius:3px;transition:left 60ms ease-out,top 60ms ease-out,width 60ms ease-out,height 60ms ease-out;`;
    const label = document.createElement('div');
    label.style.cssText = `position:fixed;z-index:2147483647;pointer-events:none;display:none;padding:2px 6px;border-radius:3px;background:${ACCENT};color:#fff;font:500 11px/1.4 var(--font-mono, ui-monospace, monospace);white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis;`;
    document.body.append(overlay, label);

    let current: HTMLElement | null = null;

    // Parse "path:line:col" from the RIGHT — a Windows path ("C:\...\x.tsx")
    // contains its own colons, so only the trailing two numeric groups are the
    // line and column.
    const parse = (el: HTMLElement) => {
      const m = el.getAttribute('data-inspect')?.match(/^(.*):(\d+):(\d+)$/);
      if (!m) return null;
      const [, file, line, col] = m;
      if (file === undefined || line === undefined || col === undefined) return null;
      return { file, line, col };
    };

    const match = (target: EventTarget | null): HTMLElement | null =>
      target instanceof Element ? target.closest('[data-inspect]') : null;

    const hide = () => {
      overlay.style.display = label.style.display = 'none';
      current = null;
    };

    const place = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      overlay.style.display = 'block';
      Object.assign(overlay.style, {
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      });
      const info = parse(el);
      if (!info) return;
      label.textContent = `${info.file.split(/[\\/]/).pop()}:${info.line}`;
      label.style.display = 'block';
      const above = r.top - 22;
      label.style.left = `${Math.max(0, r.left)}px`;
      label.style.top = `${above < 0 ? r.bottom + 4 : above}px`;
    };

    const onMove = (e: MouseEvent) => {
      if (!e.altKey) return hide();
      const el = match(e.target);
      if (!el) return hide();
      current = el;
      place(el);
    };

    const onClick = (e: MouseEvent) => {
      if (!e.altKey || e.button !== 0) return;
      const el = match(e.target);
      const info = el && parse(el);
      if (!info) return;
      // Intercept before the app's own handlers so Alt+click never navigates.
      e.preventDefault();
      e.stopPropagation();
      // vscode://file/<abs path, forward slashes, spaces encoded>:<line>:<col>.
      // encodeURI keeps ":" and "/" intact and encodes the space in the repo path.
      const uri = `vscode://file/${encodeURI(info.file.replace(/\\/g, '/'))}:${info.line}:${info.col}`;
      const a = document.createElement('a');
      a.href = uri;
      document.body.appendChild(a);
      a.click();
      a.remove();
      hide();
    };

    const onReposition = () => current && place(current);
    const onKeyUp = (e: KeyboardEvent) => e.key === 'Alt' && hide();

    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('click', onClick, true);
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', hide);

    return () => {
      window.removeEventListener('mousemove', onMove, true);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', hide);
      overlay.remove();
      label.remove();
    };
  }, []);

  return null;
}
