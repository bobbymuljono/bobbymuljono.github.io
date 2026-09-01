'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';
import ChatBot from './ChatBot';
import './Header.css';

// Site navigation — wordmark + section links + primary CTA, per the design system.
// 'Contact' is intentionally omitted — the 'Get in touch' link points to the same
// #contact anchor, so a separate text link would be redundant.
const navLinks = [{ href: '/projects/', label: 'Work' }];

export default function Header() {
  const pathname = usePathname() ?? '';
  const isActive = (href: string) =>
    href === '/projects/' ? pathname.startsWith('/projects') : false;

  return (
    <header className="site-header">
      <div className="wrapper site-header__inner">
        <a href="/" className="site-header__mark">
          Bobby Muljono
        </a>
        <nav aria-label="Primary" className="site-header__nav">
          <ThemeToggle />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={clsx('site-header__link', {
                'is-active': isActive(link.href),
              })}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
          <a href="/#contact" className="site-header__link">
            Get in touch
          </a>
          <ChatBot sm primary />
        </nav>
      </div>
    </header>
  );
}
