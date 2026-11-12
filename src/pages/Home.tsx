import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Parallax, Reveal, Stagger, StaggerItem, Statement, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { photo, type PhotoName } from "../content/images";
import { links } from "../content/links";
import { caseStudies } from "../content/caseStudies";
import "./Home.css";

const moments = [
  { when: "100,000 BCE", what: "Speech", line: "We could cooperate." },
  { when: "3,200 BCE", what: "Writing", line: "Ideas outlived us." },
  { when: "700 CE", what: "Printing", line: "Knowledge multiplied." },
  { when: "1844", what: "Telegraph", line: "Messages crossed oceans in seconds." },
  { when: "1990s", what: "Internet", line: "Humanity connected." },
  { when: "2000s", what: "Social media", line: "Everyone gained a voice." },
  { when: "2020s", what: "AI", line: "Machines began talking back." },
];

const skills = [
  { name: "Read", line: "Understand how AI works, what it can do, and where it falls short." },
  { name: "Write", line: "Give AI clear direction and context." },
  { name: "Speak", line: "Refine ideas through back-and-forth conversation." },
  { name: "Listen", line: "Check what comes back and decide what to keep." },
];

function Hero() {
  const media = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: media, offset: ["start end", "start 0.25"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const img = photo("laptopMeeting");

  return (
    <section className="hero">
      <div className="container hero__copy">
        <motion.h1
          className="display hero__title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease }}
        >
          How did you get AI to do that?
        </motion.h1>
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
        >
          <p className="lede">Some people get far more out of AI. A lot comes down to how they communicate with it.</p>
          <p className="lede">PUAI helps people build the communication skills to understand AI, guide it, question it, and put it to work.</p>
          <Link className="btn btn--lg" to="/#our-approach">
            Explore our approach <span className="btn__arrow">→</span>
          </Link>
        </motion.div>
      </div>
      <motion.div ref={media} className="hero__media" style={{ scale }}>
        <Parallax {...img} className="hero__photo" eager />
      </motion.div>
    </section>
  );
}

// One moment at a time, advancing on its own with a progress bar, like a story.
const STEP = 4.5;
function Moments() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const playing = inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % moments.length), STEP * 1000);
    return () => window.clearTimeout(t);
  }, [i, playing]);

  const m = moments[i];
  return (
    <div ref={ref} className="moments">
      <div className="moments__stage" aria-live="polite">
        <motion.div
          key={i}
          className="moments__slide"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="moments__when">{m.when}</p>
          <h3 className={`moments__what ${m.what === "AI" ? "accent" : ""}`}>{m.what}</h3>
          <p className="lede moments__line">{m.line}</p>
        </motion.div>
      </div>
      <ol className="moments__bars">
        {moments.map((x, n) => (
          <li key={x.what}>
            <button type="button" onClick={() => setI(n)} aria-current={n === i} aria-label={`${x.when}, ${x.what}`}>
              <span className="moments__track">
                <motion.span
                  key={n === i ? `on-${i}` : "off"}
                  className="moments__fill"
                  initial={{ scaleX: n < i ? 1 : 0 }}
                  animate={{ scaleX: n < i ? 1 : n === i ? (playing ? 1 : 0.5) : 0 }}
                  transition={n === i && playing ? { duration: STEP, ease: "linear" } : { duration: 0.3 }}
                />
              </span>
              <span className="moments__label">{x.what}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Offer({
  n,
  title,
  body,
  image,
  flip,
  children,
}: {
  n: string;
  title: string;
  body: string;
  image: PhotoName;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={`offer ${flip ? "offer--flip" : ""}`}>
      <Parallax {...photo(image)} sizes="(max-width: 860px) 100vw, 50vw" className="offer__photo" />
      <Reveal className="offer__text">
        <h3 className="h2 offer__title">
          <span className="offer__n">{n}</span> {title}
        </h3>
        <p className="lede">{body}</p>
        {children}
      </Reveal>
    </article>
  );
}

export default function Home() {
  return (
    <main id="main" className="home">
      <Hero />

      <section id="why-we-exist" className="block">
        <div className="container">
          <Statement className="display">Human progress moves at the speed of communication.</Statement>
          <Moments />
          <Reveal className="block__close">
            <p className="statement-text">
              AI is the technology that will continue to change humanity. The skills to work with it are the ones we
              already have: understanding, expressing, exchanging ideas, and interpreting what comes back.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="our-approach" className="block">
        <div className="container">
          <Statement className="display">We teach communication.</Statement>
          <Reveal>
            <p className="h3 muted block__sub">Basic literacy, adapted for AI.</p>
          </Reveal>
          <Reveal className="skills__intro">
            <p className="lede">Four skills you already use. Now applied to AI.</p>
          </Reveal>
          <Stagger className="skills">
            {skills.map((s) => (
              <StaggerItem key={s.name} as="article" className="skill">
                <h3 className="h1">{s.name}</h3>
                <p className="lede">{s.line}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="what-we-do" className="block">
        <div className="container">
          <Statement className="display">Three ways to work with us.</Statement>
          <div className="offers">
            <Offer
              n="01"
              title="Workforce Upskilling"
              image="workshop"
              body="We help individuals and teams navigate the AI landscape, identify tools that fit their work, and build the communication skills to use them effectively, confidently, and with good judgment."
            >
              <ul className="cases">
                {caseStudies.map((c) => (
                  <li key={c.slug}>
                    {c.published ? (
                      <Link className="case" to={`/work/${c.slug}`}>
                        <span className="case__name">{c.client}</span>
                        <span className="case__kind">{c.kind}</span>
                        <span className="case__go">
                          View case study <span className="btn__arrow">→</span>
                        </span>
                      </Link>
                    ) : (
                      <div className="case case--soon">
                        <span className="case__name">{c.client}</span>
                        <span className="case__kind">{c.kind}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <a className="btn" href={links.workWithUs}>
                Bring AI learning to your team <span className="btn__arrow">→</span>
              </a>
            </Offer>
            <Offer
              n="02"
              title="Community & Storytelling"
              image="conversation"
              flip
              body="AI is moving beyond the workplace into everyday life, from parenting and education to art and creativity. We serve as a space for those conversations and learnings."
            >
              <Link className="btn" to="/community">
                Join the community <span className="btn__arrow">→</span>
              </Link>
            </Offer>
            <Offer
              n="03"
              title="Anthropological Research"
              image="teamTable"
              body="We partner with leading universities, anthropologists, and researchers to study how AI is shaping human behaviour, work, and culture in East Africa."
            >
              <a className="btn" href={links.partner}>
                Partner with us <span className="btn__arrow">→</span>
              </a>
            </Offer>
          </div>
        </div>
      </section>

      <CtaBand lines={["People first.", "AI in context."]} action={{ label: "Get to know PUAI", to: "/about" }} />
    </main>
  );
}
