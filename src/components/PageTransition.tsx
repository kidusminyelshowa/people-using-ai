import type { ReactNode } from "react";
import { motion } from "motion/react";
import { iconWhite as icon } from "../content/brand";
import "./PageTransition.css";

const ease = [0.76, 0, 0.24, 1] as const;

// Each page owns a coral curtain: it lifts away when the page mounts and
// drops back down when the page exits, so navigation reads as one sweep.
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={{ y: "0%" }}
        animate={{ y: "-110%", transition: { duration: 0.9, ease, delay: 0.1 } }}
        exit={{ y: "0%", transition: { duration: 0.6, ease } }}
      >
        <motion.img
          src={icon}
          alt=""
          className="curtain__icon"
          initial={{ scale: 1, rotate: 0 }}
          animate={{ scale: 0.6, rotate: -8, transition: { duration: 0.6, ease } }}
          exit={{ scale: 1, rotate: 0 }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 1, transition: { duration: 0.6 } }}
      >
        {children}
      </motion.div>
    </>
  );
}
