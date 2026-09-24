import { useRef, type ElementType } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import "./ui.css";

type Segment = string | { text: string; className?: string };

type Props = {
  as?: ElementType;
  className?: string;
  /** Plain string, or segments so parts can carry a class (e.g. serif). */
  children: string | Segment[];
};

// Words brighten one by one as the block scrolls through the viewport.
export default function RevealText({ as: Tag = "p", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });

  const segments: { text: string; className?: string }[] =
    typeof children === "string" ? [{ text: children }] : children.map((s) => (typeof s === "string" ? { text: s } : s));
  const words = segments.flatMap((s) =>
    s.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, className: s.className }))
  );
  const plain = segments.map((s) => s.text).join(" ");

  return (
    <Tag ref={ref} className={`reveal-text ${className ?? ""}`} aria-label={plain}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} className={word.className}>
          {word.w}
        </Word>
      ))}
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className={`reveal-text__word ${className ?? ""}`} aria-hidden="true">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}
