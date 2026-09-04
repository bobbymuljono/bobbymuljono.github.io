import './experience-scenes.css';

/**
 * Looping line-art scenes for the Experience bands, one per role. Pure CSS, zero
 * client JS: talking mouths, tapping hands, and popping callouts run off keyframes,
 * and everything goes static (final frame) under prefers-reduced-motion. Token-driven
 * so the figures, boards, and washes invert in dark mode. Rendered in app/page.tsx.
 */

// Shopee — you at the keyboard, three callouts (an AI agent, analytics charts, a
// database) rising from the monitor to say what the work produces.
export function ShopeeScene() {
  return (
    <svg className="scene" viewBox="0 0 260 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* floor */}
      <line className="fig" x1="24" y1="140" x2="240" y2="140" />
      {/* table */}
      <line className="fig" x1="110" y1="94" x2="236" y2="94" />
      <line className="fig" x1="122" y1="94" x2="122" y2="140" />
      <line className="fig" x1="228" y1="94" x2="228" y2="140" />
      {/* chair: tall backrest (clear of head) + seat + two splayed legs */}
      <line className="fig" x1="74" y1="44" x2="74" y2="106" />
      <line className="fig" x1="74" y1="106" x2="104" y2="106" />
      <path className="fig" d="M76 106 L70 138" />
      <path className="fig" d="M100 106 L104 138" />
      {/* seated person, upright, facing right */}
      <circle className="fig" cx="90" cy="52" r="11" />
      <circle className="fig-fill" cx="96" cy="50" r="1.5" />
      <path className="fig" d="M90 106 L89 66" />
      <path className="fig" d="M90 106 L120 106 L124 138" />
      <path className="fig" d="M89 70 Q99 81 121 85" />
      {/* keyboard on table */}
      <rect className="fig" x="118" y="88" width="44" height="6" rx="2" />
      <rect className="fig-fill hand" x="124" y="83" width="6" height="5" rx="1.5" />
      <rect className="fig-fill hand hand-b" x="140" y="83" width="6" height="5" rx="1.5" />
      {/* monitor on table */}
      <rect className="board" x="178" y="54" width="52" height="34" rx="3" />
      <line className="fig" x1="204" y1="88" x2="204" y2="94" />
      <line className="fig" x1="192" y1="94" x2="216" y2="94" />
      {/* connectors fan up from the monitor top to the row of callouts (fade in with them) */}
      <path className="conn" d="M186 54 L166 34" />
      <path className="conn conn-2" d="M204 54 L204 34" />
      <path className="conn conn-3" d="M222 54 L242 34" />
      {/* callout: AI bot */}
      <g className="call">
        <rect className="callbox" x="150" y="6" width="32" height="26" rx="7" />
        <rect className="fig" x="159" y="13" width="14" height="11" rx="3" />
        <line className="fig" x1="166" y1="13" x2="166" y2="9" />
        <circle className="fig-fill" cx="166" cy="8" r="1.3" />
        <circle className="fig-fill" cx="163" cy="18.5" r="1.2" />
        <circle className="fig-fill" cx="169" cy="18.5" r="1.2" />
      </g>
      {/* callout: charts */}
      <g className="call call-2">
        <rect className="callbox" x="188" y="6" width="32" height="26" rx="7" />
        <rect className="bar" x="197" y="18" width="4" height="8" rx="1" />
        <rect className="bar bar-2" x="203" y="14" width="4" height="12" rx="1" />
        <rect className="bar bar-3" x="209" y="11" width="4" height="15" rx="1" />
      </g>
      {/* callout: database — lifted into the row, aligned with the bot and charts */}
      <g className="call call-3">
        <rect className="callbox" x="226" y="6" width="32" height="26" rx="7" />
        <ellipse className="fig" cx="242" cy="14" rx="7" ry="3" />
        <path className="fig" d="M235 14 v11 a7 3 0 0 0 14 0 v-11" />
        <path className="fig" d="M235 20 a7 3 0 0 0 14 0" />
      </g>
    </svg>
  );
}

// ISS Facility Services — pointing at a trendline on a whiteboard, talking an
// audience through what the data means.
export function ISSScene() {
  return (
    <svg className="scene talking" viewBox="0 0 260 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect className="board" x="22" y="14" width="150" height="74" rx="4" />
      <line className="axis" x1="34" y1="76" x2="160" y2="76" />
      <line className="axis" x1="34" y1="24" x2="34" y2="76" />
      <polyline className="fig trend" points="38,68 64,54 90,60 116,38 156,46" />
      <circle className="fig-fill pt" cx="64" cy="54" r="2" />
      <circle className="fig-fill pt pt-2" cx="116" cy="38" r="2" />
      <path className="fig" d="M203 68 L178 52" />
      <path className="fig" d="M196 116 Q196 74 210 71 Q224 74 224 116" />
      <circle className="fig" cx="210" cy="54" r="12" />
      <circle className="fig-fill" cx="205" cy="52" r="1.4" />
      <line className="mc fig" x1="204" y1="60" x2="210" y2="60" />
      <ellipse className="mo fig-fill" cx="207" cy="60" rx="2.4" ry="1.7" />
      <g className="aud">
        <circle cx="66" cy="134" r="13" /><rect x="47" y="146" width="38" height="14" rx="8" />
        <circle cx="122" cy="136" r="13" /><rect x="103" y="148" width="38" height="14" rx="8" />
        <circle cx="178" cy="134" r="13" /><rect x="159" y="146" width="38" height="14" rx="8" />
      </g>
    </svg>
  );
}

// First Code Academy — pointing at print("Hello world!") on a whiteboard, teaching
// a small audience their first line of code.
export function FirstCodeScene() {
  return (
    <svg className="scene talking" viewBox="0 0 260 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect className="board" x="22" y="14" width="150" height="74" rx="4" />
      <text className="code codeline" x="34" y="42">print(</text>
      <text className="code codeline codeline-2" x="46" y="58">&quot;Hello world!&quot;)</text>
      <path className="fig" d="M203 68 L178 52" />
      <path className="fig" d="M196 116 Q196 74 210 71 Q224 74 224 116" />
      <circle className="fig" cx="210" cy="54" r="12" />
      <circle className="fig-fill" cx="205" cy="52" r="1.4" />
      <line className="mc fig" x1="204" y1="60" x2="210" y2="60" />
      <ellipse className="mo fig-fill" cx="207" cy="60" rx="2.4" ry="1.7" />
      <g className="aud">
        <circle cx="66" cy="134" r="13" /><rect x="47" y="146" width="38" height="14" rx="8" />
        <circle cx="122" cy="136" r="13" /><rect x="103" y="148" width="38" height="14" rx="8" />
        <circle cx="178" cy="134" r="13" /><rect x="159" y="146" width="38" height="14" rx="8" />
      </g>
    </svg>
  );
}
