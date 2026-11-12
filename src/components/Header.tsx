import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { iconCoral } from "../content/brand";
import { links, mainNav } from "../content/links";
import { ease } from "./motion";
import "./Header.css";

// A slim white bar. It steps aside while you read down the page and
// returns as soon as you scroll up.
export default function Header() {
  const { pathname, hash } = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    if (open) return;
    if (y > 200 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 200) setHidden(false);
  });

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <motion.header
      className={`header ${scrolled ? "header--scrolled" : ""} ${open ? "header--open" : ""}`}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="header__bar container">
        <Link to="/" className="header__brand" aria-label="People Using AI, home">
          <img src={iconCoral} alt="" width={32} height={32} />
          <span>People Using AI</span>
        </Link>

        <nav className="header__nav" aria-label="Main">
          {mainNav.map((item) => (
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

        <a className="btn header__cta" href={links.workWithUs}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.ul
              className="sheet__list container"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
            >
              {mainNav.map((item) => (
                <motion.li
                  key={item.to}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
                >
                  <Link to={item.to} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
              >
                <a className="btn btn--lg" href={links.workWithUs}>
                  Work with us
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
