import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal, SplitHeading, Stagger, StaggerItem, ease } from "../components/motion";
import RevealText from "../components/ui/RevealText";
import VelocityMarquee from "../components/ui/VelocityMarquee";
import { CtaBand } from "../components/Footer";
import { photo, coverSizes, type PhotoName } from "../content/images";
import { links } from "../content/links";
import { caseStudies } from "../content/caseStudies";
import "./Home.css";

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <SplitHeading
          as="h1"
          onMount
          delay={0.15}
          className="display hero__title"
          segments={["How did you get AI <br> to", { text: "do that?", className: "accent" }]}
        />
        <motion.div
          className="hero__copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
        >
          <p className="lede">
            Some people get far more out of AI. A lot comes down to how they{" "}
            <span className="accent">communicate</span> with it.
          </p>
          <p className="body-lg">
            PUAI helps people build the <mark className="hero__mark">communication skills</mark> to understand AI, guide
            it, question it, and put it to work.
          </p>
          <Link className="btn btn--lg" to="/#our-approach">
            Explore our approach <span className="btn__arrow">→</span>
          </Link>
        </motion.div>
      </div>
      <HeroMedia />
    </section>
  );
}

const chips = [
  { label: "Read", className: "hero-chip--1", speed: -90 },
  { label: "Write", className: "hero-chip--2", speed: -160 },
  { label: "Speak", className: "hero-chip--3", speed: -60 },
  { label: "Listen", className: "hero-chip--4", speed: -130 },
];

// A rounded photo that opens out to the full width of the screen as it
// scrolls up, with the four skills drifting over it at different speeds.
function HeroMedia() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.15"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const { scrollYProgress: through } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(through, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="hero-media">
      <motion.div className="hero-media__frame" style={{ scale, borderRadius: radius }}>
        <motion.img
          {...photo("conversation")}
          sizes={coverSizes}
          alt="Two friends deep in conversation on a city street"
          className="hero-media__img"
          style={{ y: imgY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
      </motion.div>
      {chips.map((c, i) => (
        <Chip key={c.label} {...c} progress={through} index={i} />
      ))}
    </div>
  );
}

function Chip({
  label,
  className,
  speed,
  progress,
  index,
}: {
  label: string;
  className: string;
  speed: number;
  progress: MotionValue<number>;
  index: number;
}) {
  const y = useTransform(progress, [0, 1], [0, speed * 2]);
  return (
    <motion.span className={`hero-chip ${className}`} style={{ y }} aria-hidden="true">
      <motion.span
        className="hero-chip__inner"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 + index * 0.12 }}
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

/* ---------------- Why we exist ---------------- */

const eras = [
  { when: "100,000 BCE", what: "Speech", note: "We could cooperate." },
  { when: "3,200 BCE", what: "Writing", note: "Ideas outlived us." },
  { when: "700 CE", what: "Printing", note: "Knowledge multiplied." },
  { when: "1844", what: "Telegraph", note: "Messages crossed oceans in seconds." },
  { when: "1990s", what: "Internet", note: "Humanity connected." },
  { when: "2000s", what: "Social media", note: "Everyone gained a voice." },
  { when: "2020s", what: "AI", note: "Machines began talking back." },
];

function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const p = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="timeline">
      <span className="timeline__rail" aria-hidden="true">
        <motion.span className="timeline__fill" style={{ "--p": p } as never} />
      </span>
      {eras.map((era, i) => (
        <Era key={era.what} {...era} index={i} count={eras.length} progress={p} last={i === eras.length - 1} />
      ))}
    </ol>
  );
}

function Era({
  when,
  what,
  note,
  index,
  count,
  progress,
  last,
}: (typeof eras)[number] & { index: number; count: number; progress: MotionValue<number>; last: boolean }) {
  const at = index / (count - 1);
  const opacity = useTransform(progress, [Math.max(0, at - 0.12), at], [0.28, 1]);
  const dot = useTransform(progress, [Math.max(0, at - 0.04), at], [0, 1]);
  return (
    <motion.li className={`era ${last ? "era--ai" : ""}`} style={{ opacity }}>
      <span className="era__dot" aria-hidden="true">
        <motion.span style={{ scale: dot }} />
      </span>
      <span className="era__when">{when}</span>
      <span className="era__what">{what}</span>
      <span className="era__note">{note}</span>
    </motion.li>
  );
}

/* ---------------- Our approach ---------------- */

const icons = {
  read: (
    <path d="M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1v-13Zm9 1v13" />
  ),
  write: <path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-3.2-3.2L5 15.8 4 20Zm10-13.5 3.5 3.5" />,
  speak: <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z" />,
  listen: <path d="M8 9v6m4-9v12m4-9v6M4 11v2m16-2v2" />,
};

const skills = [
  { key: "read", title: "Read", body: "Understand how AI works, what it can do, and where it falls short." },
  { key: "write", title: "Write", body: "Give AI clear direction and context." },
  { key: "speak", title: "Speak", body: "Refine ideas through back-and-forth conversation." },
  { key: "listen", title: "Listen", body: "Check what comes back and decide what to keep." },
] as const;

/* ---------------- What we do ---------------- */

function Offer({
  n,
  title,
  body,
  cta,
  children,
}: {
  n: string;
  title: string;
  body: string;
  cta: { label: string; to?: string; href?: string };
  children?: ReactNode;
}) {
  const link = (
    <>
      {cta.label} <span className="btn__arrow">→</span>
    </>
  );
  return (
    <StaggerItem as="article" className="offer">
      <span className="offer__n">{n}</span>
      <h3 className="h3 offer__title">{title}</h3>
      <p className="offer__body">{body}</p>
      {children}
      <div className="offer__cta">
        {cta.to ? (
          <Link className="text-link" to={cta.to}>
            {link}
          </Link>
        ) : (
          <a className="text-link" href={cta.href}>
            {link}
          </a>
        )}
      </div>
    </StaggerItem>
  );
}

const strip: PhotoName[] = ["workshop", "headphones", "teamTable", "braids", "laptopMeeting", "glassSmile", "officeMeeting", "goldenPortrait"];

/* ---------------- Page ---------------- */

export default function Home() {
  return (
    <main id="main">
      <Hero />

      <section className="section dark why" id="why-we-exist">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Why we exist</span>
          </Reveal>
          <SplitHeading
            className="h2 why__title"
            segments={["Human progress moves at the speed of", { text: "communication.", className: "accent" }]}
          />
          <Timeline />
          <RevealText as="p" className="why__close">
            {[
              "AI is the technology that will continue to change humanity. The skills to work with it are the ones we already have:",
              { text: "understanding, expressing, exchanging ideas, and interpreting what comes back.", className: "accent" },
            ]}
          </RevealText>
        </div>
      </section>

      <section className="section" id="our-approach">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our approach</span>
          </Reveal>
          <SplitHeading
            className="h2 approach__title"
            segments={["We teach", { text: "communication.", className: "accent" }, "Basic literacy, adapted for AI."]}
          />
          <Reveal delay={0.2}>
            <p className="body-lg approach__sub">Four skills you already use. Now applied to AI.</p>
          </Reveal>
          <Stagger className="skills">
            {skills.map((s) => (
              <StaggerItem key={s.key} as="article" className={`skill skill--${s.key}`}>
                <span className="skill__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {icons[s.key]}
                  </svg>
                </span>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section what" id="what-we-do">
        <div className="container">
          <Reveal>
            <span className="eyebrow">What we do</span>
          </Reveal>
          <SplitHeading className="h2" segments={["Three ways to work with us."]} />
        </div>
        <Stagger className="offers container">
          <Offer
            n="01"
            title="Workforce Upskilling"
            body="We help individuals and teams navigate the AI landscape, identify tools that fit their work, and build the communication skills to use them effectively, confidently, and with good judgment."
            cta={{ label: "Bring AI learning to your team", href: links.workWithUs }}
          >
            <ul className="cases">
              {caseStudies.map((c) => (
                <li key={c.slug} className="case">
                  <div>
                    <strong>{c.client}</strong>
                    <span>{c.kind}</span>
                  </div>
                  {c.published ? (
                    <Link className="text-link case__link" to={`/work/${c.slug}`}>
                      View case study <span className="btn__arrow">→</span>
                    </Link>
                  ) : (
                    <span className="case__soon">Case study soon</span>
                  )}
                </li>
              ))}
            </ul>
          </Offer>
          <Offer
            n="02"
            title="Community & Storytelling"
            body="AI is moving beyond the workplace into everyday life, from parenting and education to art and creativity. We serve as a space for those conversations and learnings."
            cta={{ label: "Join the community", to: "/community" }}
          />
          <Offer
            n="03"
            title="Anthropological Research"
            body="We partner with leading universities, anthropologists, and researchers to study how AI is shaping human behaviour, work, and culture in East Africa."
            cta={{ label: "Partner with us", href: links.partner }}
          />
        </Stagger>
      </section>

      <section className="strip" aria-label="People we work with">
        <VelocityMarquee baseVelocity={-1.4}>
          {strip.map((name) => (
            <img key={name} {...photo(name)} sizes="360px" alt="" loading="lazy" className="strip__img" />
          ))}
        </VelocityMarquee>
      </section>

      <CtaBand
        title={["People first. <br>", { text: "AI in context." }]}
        action={{ label: "Get to know PUAI", to: "/about" }}
      />
    </main>
  );
}
