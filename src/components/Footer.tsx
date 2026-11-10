import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { iconWhite } from "../content/brand";
import { footerNav, links } from "../content/links";
import { SplitHeading } from "./motion";
import "./Footer.css";

type Action = { label: string; to?: string; href?: string };

/** The coral call-to-action band that closes every page. */
export function CtaBand({
  kicker,
  title,
  action,
}: {
  kicker?: ReactNode;
  title: (string | { text: string; className?: string })[];
  action: Action;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-24, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  const inner = (
    <>
      {action.label} <span className="btn__arrow">→</span>
    </>
  );

  return (
    <section ref={ref} className="cta-band">
      <div className="container cta-band__inner">
        <div>
          {kicker && <p className="cta-band__kicker">{kicker}</p>}
          <SplitHeading className="cta-band__title" segments={title} />
        </div>
        {action.to ? (
          <Link className="btn btn--white btn--lg" to={action.to}>
            {inner}
          </Link>
        ) : (
          <a className="btn btn--white btn--lg" href={action.href}>
            {inner}
          </a>
        )}
      </div>
      <motion.img className="cta-band__icon" src={iconWhite} alt="" aria-hidden="true" style={{ rotate, y }} />
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
