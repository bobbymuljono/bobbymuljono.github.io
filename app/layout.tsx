import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/fonts.css';
import '@/styles/global.css';

// Root metadata defaults. Per-page `metadata` / `generateMetadata` override
// title, description, and canonical. Ports the <head> logic from BaseLayout.astro.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bobby Muljono',
    template: '%s — Bobby Muljono',
  },
  description:
    'Bobby Muljono — data and AI, building things that ship. Selected work and a live AI persona.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Bobby Muljono',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Runs before first paint (blocking, in <head>). Sets the stored theme so there
// is no dark-mode flash, and adds `js-reveal` up front so scroll-reveal elements
// start hidden without a jump. Defaults to light; never reads prefers-color-scheme.
const bootScript = `(function () {
  try {
    var d = document.documentElement;
    var theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    d.setAttribute('data-theme', theme);
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.classList.add('js-reveal');
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Brand webfonts, self-hosted from /public/fonts (see styles/fonts.css).
            Preload the two above-the-fold latin faces: body text + hero heading. */}
        <link
          rel="preload"
          href="/fonts/hanken-grotesk-normal-400-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/newsreader-normal-600-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="wrapper">
          {children}
        </main>
        <Footer />
        <ScrollReveal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
