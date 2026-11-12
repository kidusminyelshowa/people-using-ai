import { Link } from "react-router-dom";
import { footerNav, links } from "../content/links";
import { Reveal } from "./motion";
import "./Footer.css";

type Action = { label: string; to?: string; href?: string };

/** The page's one coral band: a closing line or two and a single button. */
export function CtaBand({ lines, action }: { lines: string[]; action: Action }) {
  const inner = (
    <>
      {action.label} <span className="btn__arrow">→</span>
    </>
  );
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <Reveal as="h2" className="display cta-band__title">
          {lines.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </Reveal>
        <Reveal delay={0.15}>
          {action.to ? (
            <Link className="btn btn--white btn--lg" to={action.to}>
              {inner}
            </Link>
          ) : (
            <a className="btn btn--white btn--lg" href={action.href}>
              {inner}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Link to="/" className="footer__brand">
          People Using AI
        </Link>
        <nav aria-label="Footer">
          <ul className="footer__nav">
            {footerNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </nav>
        <p className="footer__meta">Nairobi, Kenya · © {new Date().getFullYear()} PUAI</p>
      </div>
    </footer>
  );
}
