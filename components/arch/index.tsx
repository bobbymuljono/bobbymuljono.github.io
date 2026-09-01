import clsx from 'clsx';
import type { ReactNode } from 'react';

// Architecture-diagram kit. Server components (static markup) provided to MDX so
// write-ups compose diagrams as components instead of hand-written HTML+CSS.
// Styling lives in styles/arch.css (imported by the project detail page).
//
// Authoring, in an .mdx write-up:
//   <Arch caption="…">
//     <ArchFlow>
//       <ArchNode variant="accent" title="…" sub="…" tag="…" />
//       <ArchArrow />
//       <ArchGroup label="…"><ArchFlow>…</ArchFlow></ArchGroup>
//     </ArchFlow>
//   </Arch>

export function Arch({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="arch">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function ArchFlow({ children }: { children: ReactNode }) {
  return <div className="arch__flow">{children}</div>;
}

export function ArchRow({ children }: { children: ReactNode }) {
  return <div className="arch__row">{children}</div>;
}

export function ArchNode({
  title,
  sub,
  tag,
  variant,
  children,
}: {
  title?: string;
  sub?: string;
  tag?: string;
  variant?: 'accent' | 'store';
  children?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'arch__node',
        variant === 'accent' && 'arch__node--accent',
        variant === 'store' && 'arch__node--store',
      )}
    >
      {title && <div className="arch__title">{title}</div>}
      {sub && <div className="arch__sub">{sub}</div>}
      {tag && <span className="arch__tag">{tag}</span>}
      {children}
    </div>
  );
}

export function ArchArrow() {
  return <div className="arch__arrow">↓</div>;
}

export function ArchNote({ children }: { children: ReactNode }) {
  return <div className="arch__note">{children}</div>;
}

export function ArchGroup({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="arch__group">
      {label && <span className="arch__grouplabel">{label}</span>}
      {children}
    </div>
  );
}

export function ArchCross({ children }: { children: ReactNode }) {
  return <div className="arch__cross">{children}</div>;
}

export function ArchTag({ children }: { children: ReactNode }) {
  return <span className="arch__tag">{children}</span>;
}

/** Centered node with a side-exit (the "router can bail and return nothing" shape). */
export function ArchSplit({ children }: { children: ReactNode }) {
  return <div className="arch__split">{children}</div>;
}

export function ArchExit({ note }: { note: string }) {
  return (
    <div className="arch__exit">
      <span className="arch__arrow">→</span>
      <span className="arch__exitnote">{note}</span>
    </div>
  );
}

/** The component map handed to <MDXRemote> so these are usable unqualified in MDX. */
export const archComponents = {
  Arch,
  ArchFlow,
  ArchRow,
  ArchNode,
  ArchArrow,
  ArchNote,
  ArchGroup,
  ArchCross,
  ArchTag,
  ArchSplit,
  ArchExit,
};
