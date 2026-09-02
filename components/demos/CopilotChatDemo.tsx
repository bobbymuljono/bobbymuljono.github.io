import './copilot-chat-demo.css';
import CopilotStreamingDraft from './CopilotStreamingDraft';

/**
 * CopilotChatDemo — a looping, scripted walkthrough of the item-recommendation
 * copilot: a buyer asks about stock, the agent taps "Suggest reply", the copilot
 * drafts three options, the agent edits the iPhone 17 Pro draft and sends it, and
 * the reply lands in the thread with a product card. CSS owns the shared timeline;
 * a tiny client component types the edited draft into its reserved textbox.
 * Fully readable and still under prefers-reduced-motion.
 */

const PhoneIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);

const SparkleIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 4.6L19 9l-4 3.3L16 18l-4-2.6L8 18l1-5.7L5 9l5.1-1.4z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function CopilotChatDemo({ caption }: { caption?: string }) {
  return (
    <figure className="ccd" role="img" aria-label="A support agent asks the copilot for a reply. It drafts three product options; the agent edits the iPhone 17 Pro draft, sends it, and the reply lands in the chat with a product card.">
      <div className="ccd__win" aria-hidden="true">
        <div className="ccd__bar">
          <span className="ccd__who"><span className="ccd__dot" /> Shop chat</span>
          <span className="ccd__ctx">viewing: iPhone 16 &middot; 128GB</span>
        </div>

        <div className="ccd__stage">
          <div className="ccd__chat">
            <div className="ccd-buyer">
              <p className="ccd__cap ccd__cap--right">Buyer</p>
              <div className="ccd__row ccd__row--right"><div className="ccd__bubble ccd__bubble--buyer">Hi! Is the iPhone 16 still in stock? Been eyeing this one.</div></div>
            </div>

            <div className="ccd-agent">
              <p className="ccd__cap">Support agent</p>
              <div className="ccd__row"><div className="ccd__bubble ccd__bubble--shop">Hi there, thanks for inquiring, let me check for you.</div></div>
            </div>

            <div className="ccd__think">Reading the conversation <span className="ccd__dots"><i /><i /><i /></span></div>

            <div className="ccd__sent">
              <p className="ccd__cap">Support agent</p>
              <div className="ccd__row"><div className="ccd__msg">
                <div className="ccd__msg-text">Good news, the 16 is in stock! If you want a step up, the 17 Pro has the same new chip with a sharper display and the pro camera. Want me to send a few photos?</div>
                <div className="ccd__msg-card">
                  <span className="ccd__thumb"><PhoneIcon size={15} /></span>
                  <span className="ccd__msg-name">iPhone 17 Pro</span>
                  <span className="ccd__msg-price">$1,499</span>
                </div>
              </div></div>
            </div>
          </div>

          <div className="ccd__panel">
            <div className="ccd__panel-top">
              <span className="ccd__panel-ey">
                <SparkleIcon />
                Copilot suggestion &middot; 3 options
              </span>
              <span className="ccd__intent">Upsell</span>
            </div>

            <div className="ccd-r1 ccd__rec">
            <div className="ccd__rec-head">
              <span className="ccd__thumb"><PhoneIcon /></span>
              <span className="ccd__rec-name">iPhone 17</span>
              <span className="ccd__rec-price">$1,299</span>
            </div>
            <div className="ccd__draft">Yes, the 16 is in stock! If you want the newest, the 17 just dropped with a better camera and battery for a bit more.</div>
            <div className="ccd__act"><span className="ccd__send">Send reply <ArrowIcon /></span></div>
            </div>

            <div className="ccd-r2 ccd__rec">
            <div className="ccd__rec-head">
              <span className="ccd__thumb"><PhoneIcon /></span>
              <span className="ccd__rec-name">iPhone 17 Pro</span>
              <span className="ccd__rec-price">$1,499</span>
            </div>
            <div className="ccd__draft ccd__draftwrap">
              <span className="ccd__dold">We also have the 17 Pro: same new chip, plus a sharper display and the pro camera system. Want me to send the specs?</span>
              <span className="ccd__dnew"><CopilotStreamingDraft /></span>
            </div>
            <div className="ccd__act"><span className="ccd__send ccd__send--pro"><span className="ccd__lbl-send">Send reply <ArrowIcon /></span><span className="ccd__lbl-sent">Sent <CheckIcon /></span></span></div>
            </div>

            <div className="ccd-r3 ccd__rec">
            <div className="ccd__rec-head">
              <span className="ccd__thumb"><PhoneIcon /></span>
              <span className="ccd__rec-name">iPhone 17 Pro Max</span>
              <span className="ccd__rec-price">$1,699</span>
            </div>
            <div className="ccd__draft">If you want the top of the line, the 17 Pro Max has the biggest screen and the longest battery. Happy to share the details.</div>
            <div className="ccd__act"><span className="ccd__send">Send reply <ArrowIcon /></span></div>
            </div>
          </div>
        </div>

        <div className="ccd__compose">
          <span className="ccd__compose-ph">Type a reply</span>
          <span className="ccd__suggest">
            <SparkleIcon />
            Suggest reply
          </span>
        </div>

        <span className="ccd__cursor">
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 2.5l14.5 8.2-6.4 1.4-2.7 6.4L5 2.5z" fill="var(--color-text)" stroke="var(--color-bg)" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        </span>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
