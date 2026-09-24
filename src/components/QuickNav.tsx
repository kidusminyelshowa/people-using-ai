import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useFooterInView } from "./useFooterInView";
import { useCurrentSection } from "./useCurrentSection";
import { iconCoral as icon } from "../content/brand";
import "./FloatingPills.css";

const items = [
  { to: "/work-with-us", label: "Work with us", short: "Work" },
  { to: "/about", label: "About", short: "About" },
  { to: "/get-involved", label: "Get involved", short: "Involved" },
];

// The site's main navigation: a floating pill in the bottom-right corner,
// which becomes a full-width bottom bar on phones.
export default function QuickNav() {
  const footerInView = useFooterInView();
  const section = useCurrentSection();

  return (
    <AnimatePresence>
      {!footerInView && (
        <motion.nav
          className="float-pill float-pill--right quicknav"
          aria-label="Main"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <NavLink to="/" end className="quicknav__home" aria-label="People using ai — home">
            <img src={icon} alt="" width={30} height={22} />
          </NavLink>
          {/* Phones only: the current section, as on wembi.ai's bottom bar. */}
          <span className="quicknav__section" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              {section && (
                <motion.span
                  key={section}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                >
                  {section}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className="quicknav__link">
              <span className="quicknav__long">{item.label}</span>
              <span className="quicknav__short">{item.short}</span>
            </NavLink>
          ))}
          <Link to="/get-involved#survey" className="quicknav__cta">
            Take the survey
          </Link>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
