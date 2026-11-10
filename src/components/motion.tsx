import { Fragment, type ElementType, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import "./motion.css";

export const ease = [0.22, 1, 0.36, 1] as const;

type Segment = string | { text: string; className?: string };

/**
 * Headline whose words rise out of a mask, one after another.
 * `segments` lets parts carry a class (e.g. the coral accent).
 * Plays on mount (`onMount`) or when scrolled into view.
 */
export function SplitHeading({
  as = "h2",
  className,
  segments,
  delay = 0,
  onMount = false,
  stagger = 0.06,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  segments: Segment[];
  delay?: number;
  onMount?: boolean;
  stagger?: number;
}) {
  const Tag = motion[as];
  const parts = segments.map((s) => (typeof s === "string" ? { text: s } : s));
  const words = parts.flatMap((p) =>
    p.text
      .split(/(\s+|<br>)/)
      .filter((w) => w.trim())
      .map((w) => ({ w, className: p.className }))
  );
  const label = parts.map((p) => p.text.replace(/<br>/g, " ")).join(" ").replace(/\s+/g, " ").trim();

  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const word: Variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.9, ease } },
  };

  const trigger = onMount
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } };

  return (
    <Tag className={`split ${className ?? ""}`} aria-label={label} variants={container} {...trigger}>
      {words.map((wd, i) =>
        wd.w === "<br>" ? (
          <br key={i} />
        ) : (
          <Fragment key={i}>
            <span className="split__mask" aria-hidden="true">
              <motion.span className={`split__word ${wd.className ?? ""}`} variants={word}>
                {wd.w}
              </motion.span>
            </span>{" "}
          </Fragment>
        )
      )}
    </Tag>
  );
}

/** Fades and lifts its children in when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "p" | "figure" | "article";
  amount?: number;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </Tag>
  );
}

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

/** A list whose items (StaggerItem) rise in one after another. */
export function Stagger({
  children,
  className,
  as = "div",
  amount = 0.15,
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

/** Soft card standing in for a photo that hasn't been supplied yet. */
export function Placeholder({
  label,
  tint,
  className,
  as: Tag = "div",
}: {
  label: string;
  tint?: boolean;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={`placeholder ${tint ? "placeholder--tint" : ""} ${className ?? ""}`} role="img" aria-label={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="m21 16-5-5-9 9" />
      </svg>
      <span>{label}</span>
    </Tag>
  );
}
