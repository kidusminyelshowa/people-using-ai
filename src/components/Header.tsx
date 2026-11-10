import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { iconCoral } from "../content/brand";
import { homeNav, links, pageNav } from "../content/links";
import { ease } from "./motion";
import "./Header.css";

// Sticky top bar. It slides away while you read down the page and comes back
// as soon as you scroll up; once off the top it gains a frosted background.
export default function Header() {
  const { pathname, hash } = useLocation();
  const nav = pathname === "/" ? homeNav : pageNav;
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    if (open) return;
    if (y > 240 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 240) setHidden(false);
  });

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <motion.header
      className={`header ${scrolled ? "header--scrolled" : ""} ${open ? "header--open" : ""}`}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease }}
    >
      <div className="header__bar container">
        <Link to="/" className="header__brand" aria-label="People Using AI — home">
          <img src={iconCoral} alt="" width={34} height={34} />
          <span>People Using AI</span>
        </Link>

        <nav className="header__nav" aria-label="Main">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => `header__link ${isActive && !item.to.includes("#") ? "is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a className="btn btn--ink btn--sm header__cta" href={links.workWithUs}>
          Work with us
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="sheet"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.ul
              className="sheet__list container"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
            >
              {homeNav.map((item) => (
                <motion.li
                  key={item.to}
                  variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                >
                  <Link to={item.to} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
              >
                <a className="btn btn--lg" href={links.workWithUs}>
                  Work with us <span className="btn__arrow">→</span>
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
