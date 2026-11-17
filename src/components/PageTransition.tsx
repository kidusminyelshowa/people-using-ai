import type { ReactNode } from "react";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Pages fade and lift in, and fade out quickly, so navigation feels calm.
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease } }}
    >
      {children}
    </motion.div>
  );
}
