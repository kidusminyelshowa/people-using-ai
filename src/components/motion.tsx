import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type Variants } from "motion/react";

// One easing curve and one reveal for the whole site: a slow, smooth
// settle with no overshoot.
export const ease = [0.22, 0, 0.12, 1] as const;
const RISE = 16;

/** Fades its children in and lifts them a little as they enter the screen. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  amount = 0.3,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "p" | "figure" | "article" | "h1" | "h2" | "h3";
  amount?: number;
  id?: string;
}) {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </Tag>
  );
}

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const staggerChild: Variants = {
  hidden: { opacity: 0, y: RISE },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

/** A group whose items (StaggerItem) come in one after another. */
export function Stagger({
  children,
  className,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  amount?: number;
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={staggerChild}>
      {children}
    </Tag>
  );
}

/**
 * A statement headline that grows slightly and comes into full colour
 * as it travels up the screen.
 */
export function Statement({
  children,
  className,
  as = "h2",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "p";
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.2, 1]);
  const Tag = motion[as];
  return (
    <Tag ref={ref} id={id} className={className} style={{ scale, opacity, transformOrigin: "left center" }}>
      {children}
    </Tag>
  );
}

/** A photo that drifts slowly inside its rounded frame as the page scrolls. */
export function Parallax({
  src,
  srcSet,
  sizes = "100vw",
  alt = "",
  className,
  eager,
}: {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`media ${className ?? ""}`}>
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        style={{ y, scale: 1.18 }}
      />
    </div>
  );
}

/** Stands in for a photo that hasn't been supplied yet. */
export function Placeholder({ label, className, as: Tag = "div" }: { label: string; className?: string; as?: ElementType }) {
  return (
    <Tag className={`placeholder ${className ?? ""}`} role="img" aria-label={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="m21 16-5-5-9 9" />
      </svg>
      <span>{label}</span>
    </Tag>
  );
}

/** Counts up to the number inside `value` (keeps any text around it, e.g. "[X]%"). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => (match ? `${match[1]}${Math.round(v)}${match[3]}` : value));
  useEffect(() => {
    if (inView && match) {
      const c = animate(mv, target, { duration: 1.4, ease });
      return () => c.stop();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.span ref={ref} className={className}>
      {match ? text : value}
    </motion.span>
  );
}
