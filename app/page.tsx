import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ChatBot from '@/components/ChatBot';
import ContactForm from '@/components/ContactForm';
import { CopilotMiniDemo, AnalyticsChatDemo } from '@/components/demos/SelectedWorkDemos';
import { ShopeeScene, ISSScene, FirstCodeScene } from '@/components/demos/ExperienceScenes';
import { getAllProjects } from '@/lib/content';
import './home.css';

// The animated visual that fronts each featured card, chosen by slug. Projects
// without a bespoke visual fall through to null and render a copy-only card.
const projectVisuals: Record<string, () => ReactNode> = {
  'chat-recommendation-copilot': CopilotMiniDemo,
  'data-analyst-ai-agent': AnalyticsChatDemo,
};

export const metadata: Metadata = {
  // Absolute bypasses the "%s — Bobby Muljono" template so the home title stays
  // just "Bobby Muljono" (matches the old Astro page).
  title: { absolute: 'Bobby Muljono' },
  description:
    'Senior Data Analyst building with AI — RAG chatbots, multi-agent workflows, and analytics.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const featured = getAllProjects().slice(0, 2);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" data-reveal>
        <div className="hero__intro">
          <h1>I build with AI, and I storytell with data for a living.</h1>
          <p className="hero__lead">
            Hey guys, welcome to my site. I'm Bobby, a Senior Data Analyst, with 6+ years in SQL (a little bit of Python),
            dashboarding, and data analytics. These days that expertise is
            evolving into building the AI that does it with me: RAG chatbots,
            automated SQL execution, automated insight and visualization, and last but not least, workflow automations.
          </p>
        </div>
        <div className="hero__portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bobby-headshot.png"
            alt="Bobby Muljono"
            width={896}
            height={1036}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="hero__body">
          {/* Buttons share one row: See my work (primary) + Chat with Bobby AI. */}
          <div className="hero__cta">
            <a className="button button--primary" href="/projects/">
              See my work
            </a>
            <ChatBot />
          </div>
        </div>
      </section>

      {/* Currently building — a "now" band under the hero */}
      <section className="building" data-reveal>
        <span className="eyebrow">Currently building</span>
        <div className="nowband">
          <div className="nowband__logo">
            {/* Dark-green mark for light mode; cream mark swaps in under dark. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="nowband__logo-img nowband__logo-img--light"
              src="/logo-notext-dark.png"
              alt="PersoFin"
              width={1254}
              height={1254}
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="nowband__logo-img nowband__logo-img--dark"
              src="/logo-notext-light.png"
              alt=""
              aria-hidden="true"
              width={1254}
              height={1254}
              loading="lazy"
            />
          </div>
          <div className="nowband__body">
            <h3 className="nowband__name">PersoFin</h3>
            <p className="nowband__desc">
              An open-source personal finance web app that tracks spending and
              budgets from bank exports.
            </p>
            <ul className="tag-list">
              <li className="tag">JavaScript</li>
              <li className="tag">TypeScript</li>
              <li className="tag">Next.js</li>
            </ul>
            <p className="nowband__status">
              <span className="nowband__dot" aria-hidden="true" />
              <span className="nowband__status-live">
                Cloud version close to completion, open source first
              </span>
              <span className="nowband__sep" aria-hidden="true">
                &middot;
              </span>
              <span className="nowband__status-soon">GitHub repo coming soon</span>
            </p>
          </div>
        </div>
      </section>

      {/* Experience — full bands: an animated scene beside each role */}
      <section className="experience" data-reveal>
        <span className="eyebrow">Experience</span>
        <ul className="exp-list">
          <li className="exp">
            <div className="band">
              <div className="band__vis"><ShopeeScene /></div>
              <div className="band__body">
                <div className="exp__head">
                  <h3 className="exp__company">Shopee</h3>
                  <span className="exp__years">2020 &mdash; Present</span>
                </div>
                <p className="exp__role">Senior Data Analyst</p>
                <p className="exp__note">Building analytical solutions with AI</p>
              </div>
            </div>
          </li>

          <li className="exp">
            <div className="band">
              <div className="band__vis"><ISSScene /></div>
              <div className="band__body">
                <div className="exp__head">
                  <h3 className="exp__company">ISS Facility Services</h3>
                  <span className="exp__years">2019 &mdash; 2020</span>
                </div>
                <p className="exp__role">Data Analyst</p>
                <p className="exp__note">Drawing insights from data</p>
              </div>
            </div>
          </li>

          <li className="exp">
            <div className="band">
              <div className="band__vis"><FirstCodeScene /></div>
              <div className="band__body">
                <div className="exp__head">
                  <h3 className="exp__company">First Code Academy</h3>
                  <span className="exp__years">2017</span>
                </div>
                <p className="exp__role">STEM Course Facilitator</p>
                <p className="exp__note">Teaching kids how to code</p>
              </div>
            </div>
          </li>
        </ul>
      </section>

      {/* Selected work */}
      {featured.length > 0 && (
        <section className="selected" data-reveal>
          <div className="selected__head">
            <span className="eyebrow">Selected work</span>
            <a href="/projects/" className="selected__all">
              All projects &rarr;
            </a>
          </div>
          <div className="selected__stack">
            {featured.map((p, i) => {
              const Visual = projectVisuals[p.slug];
              return (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}/`}
                  className={`feat${i % 2 === 1 ? ' feat--flip' : ''}`}
                >
                  {Visual && (
                    <div className="feat__vis">
                      <Visual />
                    </div>
                  )}
                  <div className="feat__body">
                    {p.frontmatter.kind && (
                      <span className="feat__kind">{p.frontmatter.kind}</span>
                    )}
                    <h3>{p.frontmatter.title}</h3>
                    <p>{p.frontmatter.description}</p>
                    <ul className="tag-list">
                      {p.frontmatter.techStack.map((t) => (
                        <li className="tag" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <span className="feat__more">
                      Read the write-up{' '}
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="contact" data-reveal>
        <span className="eyebrow"></span>
        <h2>Want to have a chat? Let's connect.</h2>
        <p className="contact__lead">
          Building cool stuff with AI or need me to work something out with you? Reach out to me via the following channels below.
        </p>
        <div className="contact__actions">
          <a className="button button--secondary" href="https://github.com/bobbymuljono">
            GitHub
          </a>
          <a
            className="button button--secondary"
            href="https://www.linkedin.com/in/bobbymul"
          >
            LinkedIn
          </a>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
