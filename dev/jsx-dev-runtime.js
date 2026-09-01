'use strict';

/*
 * Dev-only shim over React's automatic JSX dev runtime.
 *
 * React 19 removed `fiber._debugSource`, which every off-the-shelf
 * "click-to-component" tool relied on to map a DOM node back to its source line.
 * React still *passes* the source location (file / line / column) to `jsxDEV`,
 * though -- it just no longer stores it anywhere readable. So we intercept
 * `jsxDEV` and record that location on each host element, which `DevInspector`
 * reads on Alt+Click to open the file in VS Code.
 *
 * We attach it through an injected `ref` (not a `data-inspect` prop) on purpose:
 *   - The server build is NOT shimmed, so the SSR HTML has no `data-inspect`. A
 *     client-only *prop* would never survive hydration (React trusts the server
 *     markup and does not write client-only attributes onto hydrated nodes) and
 *     would additionally spew hydration-mismatch warnings. A ref callback runs on
 *     the real DOM node during the hydration/mount commit, so `setAttribute`
 *     lands regardless of what the SSR HTML contained, and React never sees a
 *     prop diff.
 *   - Any user-supplied ref is preserved (composed), so injecting ours is safe.
 *
 * `next.config.mjs` aliases the JSX dev runtime specifiers to this file in the
 * browser dev build only, so it never touches a production build or the server
 * (RSC) bundle. It also aliases the private name `@real/jsx-dev-runtime` to the
 * real vendored runtime, required here so the alias does not recurse.
 *
 * Limitation: elements produced by Server Components are reconstructed on the
 * client from the RSC payload without re-running the original `jsxDEV` (source
 * location is not serialized), so they carry no marker. Client Components -- the
 * interactive UI -- are fully covered, SSR'd and client-navigated alike.
 */
const runtime = require('@real/jsx-dev-runtime');

const Fragment = runtime.Fragment;

/**
 * A ref that stamps `data-inspect` onto the host node on attach, then defers to
 * any ref the element already had (object or callback form).
 */
function stampRef(location, userRef) {
  return (node) => {
    if (node && typeof node.setAttribute === 'function') {
      node.setAttribute('data-inspect', location);
    }
    if (typeof userRef === 'function') userRef(node);
    else if (userRef && typeof userRef === 'object' && 'current' in userRef) {
      userRef.current = node;
    }
  };
}

/**
 * Only host (DOM) elements get the marker. Components receive their props
 * verbatim -- the nearest host node they render carries its own marker, so
 * nothing is lost, and we never disturb a component's ref or prop contract.
 */
function withSource(type, props, source) {
  if (
    source &&
    source.fileName &&
    typeof type === 'string' &&
    props &&
    typeof props === 'object'
  ) {
    const location = `${source.fileName}:${source.lineNumber ?? 1}:${source.columnNumber ?? 1}`;
    return { ...props, ref: stampRef(location, props.ref) };
  }
  return props;
}

function jsxDEV(type, props, key, isStaticChildren, source, self) {
  return runtime.jsxDEV(type, withSource(type, props, source), key, isStaticChildren, source, self);
}

module.exports = { Fragment, jsxDEV };
