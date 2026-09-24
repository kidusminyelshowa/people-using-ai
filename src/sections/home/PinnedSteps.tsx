import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { photo, type PhotoName } from "../../content/images";
import "./PinnedSteps.css";

const steps: { label: string; image: PhotoName; alt: string }[] = [
  { label: "Understanding the tools", image: "glasses", alt: "Close-up of a person in glasses, reading intently" },
  { label: "Communicating with them", image: "conversation", alt: "Two friends deep in conversation outdoors" },
  { label: "Experimenting", image: "clay", alt: "A young woman smiling as she shapes clay in a studio" },
  { label: "Finding what works for you", image: "headphones", alt: "A confident woman with headphones leaning on a bike" },
];

const ease = [0.22, 1, 0.36, 1] as const;

// Every step is rendered at once in the same grid cell; each one slides to
// above / on / below the line depending on the active step. Nothing mounts
// or unmounts while scrolling, so the change is seamless in both directions
// and the row keeps the height of its longest label.
function position(i: number, active: number) {
  return i < active ? "-105%" : i > active ? "105%" : "0%";
}

export default function PinnedSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    setActive((cur) => (cur === next ? cur : next));
  });

  // Dot position along the curve drawn in the SVG below.
  const dotX = useTransform(progress, (p) => 8 + p * 584);
  const dotY = useTransform(progress, (p) => {
    const t = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    return 172 - t * 160;
  });

  return (
    <div ref={ref} className="pinned" style={{ height: `${steps.length * 90 + 40}vh` }}>
      <div className="pinned__sticky">
        <div className="pinned__grid">
          <div className="pinned__media">
            {steps.map((s, i) => (
              <motion.img
                key={s.image}
                {...photo(s.image)}
                sizes="84vw"
                alt={i === active ? s.alt : ""}
                aria-hidden={i !== active}
                initial={false}
                // Later photos wipe up over earlier ones; scrolling back wipes them down.
                animate={{
                  clipPath: i <= active ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
                  scale: i === active ? 1 : 1.08,
                }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                style={{ zIndex: i }}
              />
            ))}
            <span className="pinned__counter">
              0{active + 1} / 0{steps.length}
            </span>
          </div>

          <div className="pinned__copy">
            <div className="pinned__rows">
              <span className="pinned__num">
                {steps.map((_, i) => (
                  <motion.span
                    key={i}
                    className="pinned__swap"
                    aria-hidden={i !== active}
                    initial={false}
                    animate={{ y: position(i, active) }}
                    transition={{ duration: 0.6, ease }}
                  >
                    0{i + 1}
                  </motion.span>
                ))}
              </span>
              <span className="pinned__row">
                <span className="mark">Learning curve</span>
              </span>
              <span className="pinned__row">
                {steps.map((s, i) => (
                  <motion.span
                    key={s.label}
                    className="pinned__swap"
                    aria-hidden={i !== active}
                    initial={false}
                    animate={{ y: position(i, active) }}
                    transition={{ duration: 0.6, ease }}
                  >
                    {s.label}
                  </motion.span>
                ))}
              </span>
            </div>

            <div className="pinned__curve" aria-hidden="true">
              <svg viewBox="0 0 600 184">
                <path className="pinned__track" d="M8 172 C 200 172, 260 150, 300 92 S 420 12, 592 12" />
                <motion.path
                  className="pinned__line"
                  d="M8 172 C 200 172, 260 150, 300 92 S 420 12, 592 12"
                  style={{ pathLength: progress }}
                />
                <motion.circle r="9" cx={dotX} cy={dotY} className="pinned__dot" />
              </svg>
              <div className="pinned__ends">
                <span className="serif">Access</span>
                <span className="serif">Active use</span>
              </div>
            </div>

            <p className="pinned__caption">
              We help you navigate that learning curve. Understanding the tools, communicating with them, experimenting
              and finding what works for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
