import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Magnetic, Reveal, SplitHeading, ease } from "../components/motion";
import RevealText from "../components/ui/RevealText";
import VelocityMarquee, {
  MarqueeTrack,
  useMarqueeX,
} from "../components/ui/VelocityMarquee";
import { CtaBand } from "../components/Footer";
import { photo, coverSizes, type PhotoName } from "../content/images";
import { links } from "../content/links";
import { caseStudies } from "../content/caseStudies";
import "./Home.css";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const glyph = {
  read: (
    <path d="M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1v-13Zm9 1v13" />
  ),
  write: (
    <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-3.2-3.2L5 15.8 4 20Zm10-13.5 3.5 3.5" />
  ),
  speak: <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z" />,
  listen: <path d="M8 9v6m4-9v12m4-9v6M4 11v2m16-2v2" />,
  globe: (
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  ),
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  ),
  spark: (
    <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6" />
  ),
};

function Icon({
  name,
  className,
}: {
  name: keyof typeof glyph;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero: full-bleed photo that the next section slides over            */
/* ------------------------------------------------------------------ */

const bubbles = [
  { label: "Read", icon: "read", tone: "white", bob: 4.2 },
  { label: "Write", icon: "write", tone: "coral", bob: 5 },
  { label: "Speak", icon: "speak", tone: "yellow", bob: 4.6 },
  { label: "Listen", icon: "listen", tone: "green", bob: 5.4 },
] as const;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="hero">
      <motion.div
        className="hero__panel"
        style={{ scale, borderRadius: radius }}
      >
        <motion.img
          {...photo("conversation")}
          sizes={coverSizes}
          alt="Two friends deep in conversation on a city street"
          className="hero__img"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
        />
        <div className="hero__shade" />

        <motion.div
          className="container hero__content"
          style={{ y: contentY, opacity: fade }}
        >
          <SplitHeading
            as="h1"
            onMount
            delay={0.35}
            className="hero__title"
            segments={[
              "How did you get AI <br> to",
              { text: "do that?", className: "hero__pop" },
            ]}
          />
          <motion.div
            className="hero__copy"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95, ease }}
          >
            <p className="hero__lede">
              Some people get far more out of AI. A lot comes down to how they{" "}
              <em>communicate</em> with it.
            </p>
            <p className="hero__body">
              PUAI helps people build the <strong>communication skills</strong>{" "}
              to understand AI, guide it, question it, and put it to work.
            </p>
            <Magnetic>
              <Link className="btn btn--lg hero__btn" to="/#our-approach">
                Explore our approach <span className="btn__arrow">→</span>
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.ul
          className="hero__bubbles"
          aria-hidden="true"
          style={{ opacity: fade }}
        >
          {bubbles.map((b, i) => (
            <motion.li
              key={b.label}
              className={`bubble bubble--${b.tone}`}
              initial={{ opacity: 0, scale: 0.4, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 15,
                delay: 1.2 + i * 0.18,
              }}
            >
              <motion.span
                className="bubble__inner"
                animate={{ y: [0, -10, 0], rotate: [0, i % 2 ? 2 : -2, 0] }}
                transition={{
                  duration: b.bob,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon name={b.icon} />
                {b.label}
              </motion.span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="hero__scroll"
          style={{ opacity: fade }}
          aria-hidden="true"
        >
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why we exist: pinned section that scrolls sideways through history  */
/* ------------------------------------------------------------------ */

const eras = [
  {
    when: "100,000 BCE",
    what: "Speech",
    note: "We could cooperate.",
    tone: "cream",
    icon: "speak",
  },
  {
    when: "3,200 BCE",
    what: "Writing",
    note: "Ideas outlived us.",
    tone: "yellow",
    icon: "write",
  },
  {
    when: "700 CE",
    what: "Printing",
    note: "Knowledge multiplied.",
    tone: "navy",
    icon: "read",
  },
  {
    when: "1844",
    what: "Telegraph",
    note: "Messages crossed oceans in seconds.",
    tone: "pink",
    icon: "bolt",
  },
  {
    when: "1990s",
    what: "Internet",
    note: "Humanity connected.",
    tone: "green",
    icon: "globe",
  },
  {
    when: "2000s",
    what: "Social media",
    note: "Everyone gained a voice.",
    tone: "orange",
    icon: "heart",
  },
  {
    when: "2020s",
    what: "AI",
    note: "Machines began talking back.",
    tone: "coral",
    icon: "spark",
  },
] as const;

function HistoryRail() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current)
        setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const x = useTransform(smooth, (p) => -p * distance);

  return (
    <div
      ref={wrap}
      className="rail"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="rail__sticky">
        <motion.div ref={track} className="rail__track" style={{ x }}>
          <div className="rail__intro">
            <span className="eyebrow">Why we exist</span>
            <SplitHeading
              className="rail__title"
              segments={[
                "Human progress moves at the speed of",
                { text: "communication.", className: "accent" },
              ]}
            />
            <span className="rail__hint" aria-hidden="true">
              Keep scrolling <span>→</span>
            </span>
          </div>
          {eras.map((e, i) => (
            <EraCard key={e.what} era={e} index={i} progress={smooth} />
          ))}
        </motion.div>
        <div className="rail__progress" aria-hidden="true">
          <motion.span style={{ scaleX: smooth }} />
        </div>
      </div>
    </div>
  );
}

function EraCard({
  era,
  index,
  progress,
}: {
  era: (typeof eras)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // Each card tilts and settles as it travels through the middle of the screen.
  const at = (index + 1) / (eras.length + 0.5);
  const rotate = useTransform(progress, [at - 0.3, at, at + 0.3], [6, 0, -4]);
  const y = useTransform(progress, [at - 0.3, at, at + 0.3], [60, 0, 20]);
  const iconRotate = useTransform(progress, [0, 1], [0, 220]);
  return (
    <motion.article
      className={`era era--${era.tone} ${era.what === "AI" ? "era--ai" : ""}`}
      style={{ rotate, y }}
    >
      <div className="era__top">
        <span className="era__when">{era.when}</span>
        <motion.span className="era__icon" style={{ rotate: iconRotate }}>
          <Icon name={era.icon} />
        </motion.span>
      </div>
      <h3 className="era__what">{era.what}</h3>
      <p className="era__note">{era.note}</p>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Our approach: four skill cards that stack as you scroll             */
/* ------------------------------------------------------------------ */

const skills = [
  {
    key: "read",
    title: "Read",
    body: "Understand how AI works, what it can do, and where it falls short.",
    tone: "coral",
  },
  {
    key: "write",
    title: "Write",
    body: "Give AI clear direction and context.",
    tone: "navy",
  },
  {
    key: "speak",
    title: "Speak",
    body: "Refine ideas through back-and-forth conversation.",
    tone: "yellow",
  },
  {
    key: "listen",
    title: "Listen",
    body: "Check what comes back and decide what to keep.",
    tone: "green",
  },
] as const;

function SkillVisual({ kind }: { kind: (typeof skills)[number]["key"] }) {
  if (kind === "read")
    return (
      <div className="viz viz--read" aria-hidden="true">
        {[92, 78, 86, 54, 70].map((w, i) => (
          <motion.span
            key={i}
            style={{ width: `${w}%` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease }}
          />
        ))}
      </div>
    );
  if (kind === "write")
    return (
      <div className="viz viz--write" aria-hidden="true">
        <span className="viz__line">
          <motion.span
            className="viz__typed"
            initial={{ width: "0ch" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 2.2, ease: "linear" }}
          >
            Context. Goal. Tone. Audience.
          </motion.span>
          <span className="viz__caret" />
        </span>
      </div>
    );
  if (kind === "speak")
    return (
      <div className="viz viz--speak" aria-hidden="true">
        {["you", "ai", "you", "ai"].map((who, i) => (
          <motion.span
            key={i}
            className={`viz__msg viz__msg--${who}`}
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: i * 0.35,
            }}
          />
        ))}
      </div>
    );
  return (
    <div className="viz viz--listen" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <motion.span
          key={i}
          animate={{ scaleY: [0.25, 0.5 + ((i * 37) % 50) / 100, 0.25] }}
          transition={{
            duration: 1 + (i % 5) * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 7) * 0.08,
          }}
        />
      ))}
    </div>
  );
}

function SkillStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return (
    <div ref={ref} className="stack">
      {skills.map((s, i) => (
        <SkillCard key={s.key} skill={s} index={i} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function SkillCard({
  skill,
  index,
  progress,
}: {
  skill: (typeof skills)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const n = skills.length;
  const start = index / n;
  const scale = useTransform(
    progress,
    [start, 1],
    [1, 1 - (n - index - 1) * 0.05],
  );
  const dim = useTransform(
    progress,
    [start, Math.min(1, start + 0.4)],
    [0, index === n - 1 ? 0 : 0.18],
  );
  return (
    <div
      className="stack__slot"
      style={{ top: `calc(var(--header-h) + 24px + ${index * 28}px)` }}
    >
      <motion.article
        className={`skill skill--${skill.tone}`}
        style={{ scale }}
      >
        <div className="skill__text">
          <span className="skill__icon">
            <Icon name={skill.key} />
          </span>
          <h3 className="skill__title">{skill.title}</h3>
          <p className="skill__body">{skill.body}</p>
        </div>
        <SkillVisual kind={skill.key} />
        <motion.span className="skill__dim" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* What we do                                                          */
/* ------------------------------------------------------------------ */

function Offer({
  n,
  title,
  body,
  image,
  imageAlt,
  tone,
  cta,
  index,
  children,
}: {
  n: string;
  title: string;
  body: string;
  image: PhotoName;
  imageAlt: string;
  tone: string;
  cta: { label: string; to?: string; href?: string };
  index: number;
  children?: ReactNode;
}) {
  const label = (
    <>
      {cta.label} <span className="btn__arrow">→</span>
    </>
  );
  return (
    <motion.article
      className={`offer offer--${tone}`}
      initial={{
        opacity: 0,
        y: 120,
        rotate: index === 1 ? 0 : index === 0 ? -4 : 4,
      }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay: index * 0.12, ease }}
    >
      <div className="offer__media">
        <img
          {...photo(image)}
          sizes="(max-width: 960px) 84vw, 33vw"
          alt={imageAlt}
          loading="lazy"
        />
        <span className="offer__n">{n}</span>
      </div>
      <div className="offer__content">
        <h3 className="offer__title">{title}</h3>
        <p className="offer__body">{body}</p>
        {children}
        <div className="offer__cta">
          {cta.to ? (
            <Link className="btn offer__btn" to={cta.to}>
              {label}
            </Link>
          ) : (
            <a className="btn offer__btn" href={cta.href}>
              {label}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Giant motto marquee                                                 */
/* ------------------------------------------------------------------ */

function Motto() {
  const x1 = useMarqueeX(-3);
  const x2 = useMarqueeX(3);
  const item = (cls: string) => (
    <span className={`motto__item ${cls}`}>
      People first <Icon name="spark" className="motto__star" /> AI in context{" "}
      <Icon name="spark" className="motto__star" />
    </span>
  );
  return (
    <section className="motto" aria-label="People first. AI in context.">
      <MarqueeTrack x={x1}>{item("motto__item--solid")}</MarqueeTrack>
      <MarqueeTrack x={x2}>{item("motto__item--outline")}</MarqueeTrack>
    </section>
  );
}

const strip: PhotoName[] = [
  "workshop",
  "headphones",
  "teamTable",
  "braids",
  "clay",
  "laptopMeeting",
  "glassSmile",
  "goldenPortrait",
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main id="main" className="home">
      <Hero />

      <div className="home__over">
        <section className="dark why" id="why-we-exist">
          <HistoryRail />
          <div className="container why__close-wrap">
            <RevealText as="p" className="why__close">
              {[
                "AI is the technology that will continue to change humanity. The skills to work with it are the ones we already have:",
                {
                  text: "understanding, expressing, exchanging ideas, and interpreting what comes back.",
                  className: "accent",
                },
              ]}
            </RevealText>
          </div>
        </section>

        <div className="home__rest">
          <section className="approach" id="our-approach">
            <div className="container">
              <Reveal>
                <span className="eyebrow">Our approach</span>
              </Reveal>
              <SplitHeading
                className="h2 approach__title"
                segments={[
                  "We teach",
                  { text: "communication.", className: "accent" },
                  "Basic literacy, adapted for AI.",
                ]}
              />
              <Reveal delay={0.2}>
                <p className="lede approach__sub">
                  Four skills you already use. Now applied to AI.
                </p>
              </Reveal>
              <SkillStack />
            </div>
          </section>

          <section className="what" id="what-we-do">
            <div className="container">
              <Reveal>
                <span className="eyebrow">What we do</span>
              </Reveal>
              <SplitHeading
                className="h2 what__title"
                segments={[
                  "Three ways to",
                  { text: "work with us.", className: "accent" },
                ]}
              />
            </div>
            <div className="offers container">
              <Offer
                index={0}
                n="01"
                tone="white"
                image="workshop"
                imageAlt="A team working through an exercise together at a workshop table"
                title="Workforce Upskilling"
                body="We help individuals and teams navigate the AI landscape, identify tools that fit their work, and build the communication skills to use them effectively, confidently, and with good judgment."
                cta={{
                  label: "Bring AI learning to your team",
                  href: links.workWithUs,
                }}
              >
                <ul className="cases">
                  {caseStudies.map((c) => (
                    <li key={c.slug}>
                      {c.published ? (
                        <Link className="case" to={`/work/${c.slug}`}>
                          <span className="case__text">
                            <strong>{c.client}</strong>
                            <span>{c.kind}</span>
                          </span>
                          <span className="case__go">
                            View case study{" "}
                            <span className="btn__arrow">→</span>
                          </span>
                        </Link>
                      ) : (
                        <div className="case case--soon">
                          <span className="case__text">
                            <strong>{c.client}</strong>
                            <span>{c.kind}</span>
                          </span>
                          <span className="case__go">Case study soon</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Offer>
              <Offer
                index={1}
                n="02"
                tone="coral"
                image="clay"
                imageAlt="A young woman smiling as she works with clay in a studio"
                title="Community & Storytelling"
                body="AI is moving beyond the workplace into everyday life, from parenting and education to art and creativity. We serve as a space for those conversations and learnings."
                cta={{ label: "Join the community", to: "/community" }}
              />
              <Offer
                index={2}
                n="03"
                tone="navy"
                image="braids"
                imageAlt="Close-up portrait of a woman with braided hair"
                title="Anthropological Research"
                body="We partner with leading universities, anthropologists, and researchers to study how AI is shaping human behaviour, work, and culture in East Africa."
                cta={{ label: "Partner with us", href: links.partner }}
              />
            </div>
          </section>

          <Motto />

          <section
            className="strip"
            aria-label="Photos of people at work and in conversation"
          >
            <VelocityMarquee baseVelocity={-1.4}>
              {strip.map((name, i) => (
                <img
                  key={name}
                  {...photo(name)}
                  sizes="360px"
                  alt=""
                  loading="lazy"
                  className={`strip__img strip__img--${i % 3}`}
                />
              ))}
            </VelocityMarquee>
          </section>

          <CtaBand
            title={["People first. <br>", { text: "AI in context." }]}
            action={{ label: "Get to know PUAI", to: "/about" }}
          />
        </div>
      </div>
    </main>
  );
}
