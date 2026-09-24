import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { iconWhite as iconReverse } from "../content/brand";
import wordmarkLight from "../assets/brand/wordmark-light.svg";
import SectionHead from "./ui/SectionHead";
import { links, nav } from "../content/links";
import "./Closing.css";

// "Let's make AI useful." + footer — shared by every page.
export default function Closing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-30, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <>
      <section ref={ref} className="closing panel" data-section="Start here">
        <div className="closing__inner">
          <SectionHead label="Start here" tone="light" />
          <h2 className="closing__title">
            Let’s make <br />
            <span className="closing__ai">AI useful.</span>
          </h2>
          <div className="closing__row">
            <p>
              Whether you want to build your own skills, bring AI into your team or contribute to what we’re learning,
              there’s a place to start.
            </p>
            <div className="closing__actions">
              <Link className="btn btn--lg" to="/work-with-us#training">
                Explore training <span className="btn__arrow">→</span>
              </Link>
              <Link className="btn btn--lg btn--cotton" to="/work-with-us#community">
                Join the community <span className="btn__arrow">→</span>
              </Link>
              <Link className="btn btn--lg btn--night" to="/get-involved#survey">
                Take the survey <span className="btn__arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
        <motion.img className="closing__icon" src={iconReverse} alt="" style={{ rotate, y }} />
      </section>

      <footer className="footer">
        <div className="footer__top">
          <Link to="/" aria-label="People using ai — home">
            <img src={wordmarkLight} alt="" className="footer__logo" />
          </Link>
          <nav aria-label="Footer">
            <ul className="footer__nav">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="footer__nav">
            <li>
              <a href={links.linkedin}>LinkedIn</a>
            </li>
            <li>
              <a href={links.instagram}>Instagram</a>
            </li>
            <li>
              <a href={links.substack}>Substack</a>
            </li>
          </ul>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} People using ai</span>
        </div>
      </footer>
    </>
  );
}
