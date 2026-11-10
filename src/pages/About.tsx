import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Placeholder, Reveal, SplitHeading, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import "./About.css";

const story = [
  {
    text: [
      "We’ve spent over 20 years combined working across communication, marketing, strategy, and business in emerging markets.",
    ],
    image: "[IMAGE 1: logos of organisations we’ve worked with]",
    tone: "cream",
  },
  {
    text: ["We are both mums.", { accent: "Sometimes the kids join our calls." }],
    image: "[IMAGE 2: us on a call with the kids]",
    tone: "pink",
  },
  {
    text: [
      "We’ve spent time in tech spaces and noticed something: so much is built around developers, and so little around the people actually using the AI technology.",
    ],
    image: "[IMAGE 3: both of us at tech events]",
    tone: "yellow",
  },
];

const dislikes = [
  "Too much focus on tools, not enough on people.",
  "Too much jargon, not enough plain language.",
  "Too much hype, not enough honesty.",
  "Too much pressure to keep up, not enough help knowing where to begin.",
  "Too much talking at people, not enough helping them think.",
  "Too much emphasis on prompting, not enough on judgment.",
  "Too much global noise, not enough local context.",
  "Too much fear or fantasy, not enough practical use.",
  "Every new AI tool being presented as something you absolutely need.",
  "Making people feel behind before they’ve even started.",
  "Assuming everyone using AI has a technical background.",
  "Training people on features instead of teaching them how to think with AI.",
  "Treating AI as a shortcut rather than a tool for doing better work.",
  "Presenting the first AI response as the final answer.",
  "Talking about productivity without talking about the quality of work.",
  "Making AI adoption sound like a software purchase.",
  "One-size-fits-all training for people doing very different jobs.",
  "Forgetting that different people have different needs, resources, and realities.",
  "Assuming everyone has access to the latest paid AI tools.",
  "Overcomplicating things that could be explained simply.",
  "Celebrating what AI produces without questioning whether it’s accurate.",
  "Ignoring the importance of privacy, trust, and responsibility.",
  "Assuming the same tools and approaches work equally well across cultures and languages.",
  "Talking about replacing people instead of helping them do more.",
  "Spending so much time predicting the future of AI that we forget the people trying to use it today.",
];

const shapes = [
  { className: "shape shape--coral", speed: -260, rotate: 40 },
  { className: "shape shape--yellow", speed: -120, rotate: -30 },
  { className: "shape shape--green", speed: -340, rotate: 60 },
  { className: "shape shape--navy", speed: -180, rotate: -50 },
];

function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return (
    <section ref={ref} className="about-hero">
      {shapes.map((s, i) => (
        <Shape key={i} {...s} progress={scrollYProgress} index={i} />
      ))}
      <div className="container about-hero__inner">
        <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
          About PUAI
        </motion.span>
        <SplitHeading
          as="h1"
          onMount
          delay={0.15}
          className="about-hero__title"
          segments={["We are", { text: "communicators.", className: "accent" }]}
        />
        <motion.p
          className="lede about-hero__intro"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease }}
        >
          We met in Nairobi. People Using AI grew out of our shared interest in communication, people, and how AI is
          changing everyday life and work.
        </motion.p>
      </div>
    </section>
  );
}

function Shape({
  className,
  speed,
  rotate,
  progress,
  index,
}: {
  className: string;
  speed: number;
  rotate: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
}) {
  const y = useTransform(progress, [0, 1], [0, speed]);
  const r = useTransform(progress, [0, 1], [0, rotate]);
  return (
    <motion.span className={className} style={{ y, rotate: r }} aria-hidden="true">
      <motion.span
        className="shape__inner"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -14, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 180, damping: 14, delay: 0.5 + index * 0.12 },
          opacity: { duration: 0.4, delay: 0.5 + index * 0.12 },
          y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </motion.span>
  );
}

function StoryRow({ row, index }: { row: (typeof story)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 ? 6 : -6, 0, index % 2 ? -3 : 3]);
  const flip = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      className={`story story--${row.tone} ${flip ? "story--flip" : ""}`}
      initial={{ opacity: 0, y: 80, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease }}
    >
      <div className="story__text">
        <p>
          {row.text.map((t, i) =>
            typeof t === "string" ? (
              <span key={i}>{t} </span>
            ) : (
              <span key={i} className="accent">
                {t.accent}
              </span>
            )
          )}
        </p>
      </div>
      <motion.div className="story__media" style={{ y, rotate }}>
        <Placeholder label={row.image} className="story__ph" />
      </motion.div>
    </motion.div>
  );
}

// The 25 points scroll past while a big counter on the left keeps count.
function Dislikes() {
  const ref = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(dislikes.length, Math.max(1, Math.ceil(p * dislikes.length))));
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="pov__grid">
      <div className="pov__side">
        <div className="pov__counter" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={current}
              initial={{ y: "70%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-70%", opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {String(current).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <small>/25</small>
        </div>
        <div className="pov__meter" aria-hidden="true">
          <motion.span style={{ scaleY: fill }} />
        </div>
      </div>
      <ol ref={ref} className="dislikes">
        {dislikes.map((d, i) => (
          <Dislike key={i} text={d} index={i} active={i + 1 === current} />
        ))}
      </ol>
    </div>
  );
}

function Dislike({ text, index, active }: { text: string; index: number; active: boolean }) {
  return (
    <motion.li
      className={`dislike ${active ? "is-active" : ""}`}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease }}
    >
      <span className="dislike__n">{String(index + 1).padStart(2, "0")}</span>
      <span className="dislike__text">{text}</span>
    </motion.li>
  );
}

export default function About() {
  return (
    <main id="main">
      <AboutHero />

      <section className="stories-wrap">
        <div className="container stories">
          {story.map((row, i) => (
            <StoryRow key={i} row={row} index={i} />
          ))}
        </div>
      </section>

      <section className="section dark pov">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our point of view</span>
          </Reveal>
          <SplitHeading
            className="h2 pov__title"
            segments={["Too much of the AI conversation feels detached from real people and real contexts."]}
            stagger={0.035}
          />
          <Reveal delay={0.2}>
            <p className="lede pov__sub">
              Here are <span className="accent">25 things we dislike about it.</span> And part of why we started PUAI.
            </p>
          </Reveal>
          <Dislikes />
        </div>
      </section>

      <CtaBand
        kicker="If that sounds like you, welcome."
        title={["People first. <br>", { text: "AI in context." }]}
        action={{ label: "Join the community", to: "/community" }}
      />
    </main>
  );
}
