import './selected-demos.css';
import AnalyticsStreamingAnswer from './AnalyticsStreamingAnswer';

/**
 * Compact looping visuals for the landing "Selected work" feature cards. The
 * copilot miniature is pure CSS; the analytics answer uses a tiny client-side
 * typewriter so its reply reads like a real stream. Both go static under
 * prefers-reduced-motion. Chosen per project by slug in app/page.tsx.
 */

const PhoneMini = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);

const SparkleMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 4.6L19 9l-4 3.3L16 18l-4-2.6L8 18l1-5.7L5 9l5.1-1.4z" />
  </svg>
);

const BookMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const DatabaseMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);

// Card 1 — a miniature of the copilot: buyer asks, a suggestion panel drops in with
// two ready-to-send options.
export function CopilotMiniDemo() {
  return (
    <div className="cmini" aria-hidden="true">
      <div className="cmini__bar"><i /> Shop chat</div>
      <div className="cmini__body">
        <div className="cmini__row cmini__row--r"><div className="cmini__bub">Is the iPhone 16 still in stock?</div></div>
        <div className="cmini__panel">
          <div className="cmini__panel-top">
            <SparkleMini />
            Copilot suggested
          </div>
          <div className="cmini__opt cmini__opt--1">
            <span className="cmini__thumb"><PhoneMini /></span>
            <b>iPhone 17</b><span className="cmini__price">$1,299</span><span className="cmini__send">Send</span>
          </div>
          <div className="cmini__opt cmini__opt--2">
            <span className="cmini__thumb"><PhoneMini /></span>
            <b>iPhone 17 Pro</b><span className="cmini__price">$1,499</span><span className="cmini__send">Send</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card 2 — the analytics agent as a chat: an analyst asks a metric question, the
// agent works (reads the knowledge base, runs SQL), then answers with the number.
export function AnalyticsChatDemo() {
  return (
    <div className="amini" aria-hidden="true">
      <div className="amini__bar"><i /> Analytics agent</div>
      <div className="amini__body">
        <div className="amini__row amini__row--r"><div className="amini__bub amini__bub--user">What is the WISMO rate of all CS tickets for SG region last week?</div></div>
        <div className="amini__tool amini__tool--1"><BookMini /> Reading the knowledge base</div>
        <div className="amini__tool amini__tool--2"><DatabaseMini /> Running SQL query</div>
        <div className="amini__row"><div className="amini__bub amini__bub--agent"><AnalyticsStreamingAnswer /></div></div>
      </div>
    </div>
  );
}
