// Placeholder home — Phase 1 scaffold checkpoint only.
// Replaced with the real hero / experience / featured-work home in Phase 2
// (feature/static-pages).

export default function Home() {
  return (
    <section style={{ padding: 'var(--space-8) 0' }}>
      <p className="eyebrow">Next.js migration · Phase 1</p>
      <h1 style={{ fontFamily: 'var(--font-display)' }}>Scaffold is up.</h1>
      <p style={{ maxWidth: 'var(--measure)', color: 'var(--color-text-muted)' }}>
        Root layout, design tokens, self-hosted fonts, the anti-flash theme
        script, and scroll-reveal are wired. Header, footer, and the real home
        page land in Phase 2.
      </p>
    </section>
  );
}
