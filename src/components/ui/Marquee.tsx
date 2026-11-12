import type { ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import "../motion.css";

/** A slow, steady, endless horizontal loop. `speed` is % of one copy per second. */
export default function Marquee({ children, speed = 1.2, className }: { children: ReactNode; speed?: number; className?: string }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (!reduce) base.set(base.get() - (speed * delta) / 1000);
  });
  // Content is rendered twice; wrapping over one half makes the loop seamless.
  const x = useTransform(base, (v) => `${(((v % 50) + 50) % 50) - 50}%`);
  return (
    <div className={`marquee ${className ?? ""}`} aria-hidden="true">
      <motion.div className="marquee__track" style={{ x }}>
        {[0, 1].map((i) => (
          <div className="marquee__chunk" key={i}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
