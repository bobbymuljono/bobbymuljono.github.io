import type { Metadata } from 'next';
import ChatBot from '@/components/ChatBot';
import ContactForm from '@/components/ContactForm';
import { getAllProjects } from '@/lib/content';
import './home.css';

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
            I&apos;m Bobby — a Senior Data Analyst, with 6+ years in SQL,
            dashboarding, and data analytics. These days that expertise is
            evolving into building the AI that does it with me: RAG chatbots,
            automated SQL execution, and automated insight and visualization
            generation.
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

      {/* Experience — minimalist progression list */}
      <section className="experience" data-reveal>
        <span className="eyebrow">Experience</span>
        <ul className="exp-list">
          <li className="exp">
            <div className="exp__head">
              <h3 className="exp__company">Shopee</h3>
              <span className="exp__years">2020 &mdash; Present</span>
            </div>
            <p className="exp__role">Senior Data Analyst</p>
            <p className="exp__note">Building analytical solutions with AI</p>
          </li>

          <li className="exp">
            <div className="exp__head">
              <h3 className="exp__company">ISS Facility Services</h3>
              <span className="exp__years">2019 &mdash; 2020</span>
            </div>
            <p className="exp__role">Data Analyst</p>
            <p className="exp__note">Drawing insights from data</p>
          </li>

          <li className="exp">
            <div className="exp__head">
              <h3 className="exp__company">First Code Academy</h3>
              <span className="exp__years">2017</span>
            </div>
            <p className="exp__role">STEM Course Facilitator</p>
            <p className="exp__note">Teaching kids how to code</p>
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
          <div className="selected__grid">
            {featured.map((p) => (
              <a
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className="card card--interactive project-preview"
              >
                {p.frontmatter.kind && (
                  <span className="eyebrow">{p.frontmatter.kind}</span>
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
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="contact" data-reveal>
        <span className="eyebrow">Contact</span>
        <h2>Let&apos;s talk.</h2>
        <p className="contact__lead">
          Building something at the seam of analytics and AI, or just want to
          compare notes? I&apos;m happy to hear from you.
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
