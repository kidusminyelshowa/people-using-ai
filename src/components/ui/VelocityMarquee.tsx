import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Drives an endless horizontal loop that speeds up (and reverses) with
 * scroll velocity. Returns an `x` value any number of tracks can share, so
 * layered marquees stay perfectly in sync.
 */
export function useMarqueeX(baseVelocity = -2) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    base.set(base.get() + move);
  });

  // Content is rendered 4x; wrapping over one quarter makes the loop seamless.
  return useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
}

export function MarqueeTrack({
  x,
  children,
  className,
}: {
  x: MotionValue<string>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`marquee ${className ?? ""}`} aria-hidden="true">
      <motion.div className="marquee__track" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <div className="marquee__chunk" key={i}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function VelocityMarquee({
  children,
  baseVelocity,
  className,
}: {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const x = useMarqueeX(baseVelocity);
  return (
    <MarqueeTrack x={x} className={className}>
      {children}
    </MarqueeTrack>
  );
}
