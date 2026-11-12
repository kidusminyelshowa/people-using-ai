import { Link } from "react-router-dom";
import { iconCoral } from "../content/brand";
import { links } from "../content/links";
import { useLenis } from "lenis/react";
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

const groups = [
  [
    { to: "/", label: "Home" },
    { to: "/community", label: "Community" },
    { to: "/about", label: "About" },
  ],
];

export default function Footer() {
  const lenis = useLenis();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" aria-label="People Using AI, home">
              <img src={iconCoral} alt="" width={56} height={56} />
            </Link>
            <a className="footer__email" href={`mailto:${links.contactEmail}`}>
              {links.contactEmail}
            </a>
            <p className="footer__place">Nairobi, Kenya</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {groups.map((g, i) => (
              <ul key={i}>
                {g.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            ))}
            <ul>
              <li>
                <a href={links.workWithUs}>Work with us</a>
              </li>
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
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} PUAI</p>
          <button
            type="button"
            className="footer__top-link"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
