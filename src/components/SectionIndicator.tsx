import { AnimatePresence, motion } from "motion/react";
import { useFooterInView } from "./useFooterInView";
import { useCurrentSection } from "./useCurrentSection";
import "./FloatingPills.css";

// Current section name in a pill at the bottom left (desktop and tablet;
// on phones it lives inside the bottom bar instead).
export default function SectionIndicator() {
  const label = useCurrentSection();
  const footerInView = useFooterInView();

  return (
    <div className="float-pill float-pill--left" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        {label && !footerInView && (
          <motion.span
            key={label}
            className="indicator"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <span className="indicator__dot" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
