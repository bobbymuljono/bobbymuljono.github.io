import './Footer.css';

// Site footer — minimal & editorial: brand + tagline on the left, external links
// on the right. Work/Contact live in the (sticky) header, so the footer does NOT
// repeat them — only the off-site links and the copyright line.
export default function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="site-footer">
      <div className="wrapper site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__mark">Bobby Muljono</div>
          <p>Senior Data Analyst who builds with AI.</p>
          <p className="site-footer__copy">&copy; {year}</p>
        </div>

        <nav aria-label="Elsewhere" className="site-footer__links">
          <a href="https://github.com/bobbymuljono" rel="me">
            GitHub
          </a>
          <span aria-hidden="true" className="site-footer__sep">
            &middot;
          </span>
          <a href="https://www.linkedin.com/in/bobbymul" rel="me">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
