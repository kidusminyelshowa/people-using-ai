import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLenis } from "lenis/react";
import { Parallax, Reveal, Stagger, StaggerItem, Statement, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { coverSizes, photo, type PhotoName } from "../content/images";
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

const heroPhotos: PhotoName[] = ["laptopMeeting", "clay", "headphones"];
const HERO_STEP = 6;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % heroPhotos.length), HERO_STEP * 1000);
    return () => window.clearTimeout(t);
  }, [i, reduce]);

  // As you scroll away, the photo sinks a little slower than the page and
  // the words drift up and fade, so the hero hands over gently.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="hero">
      <motion.div
        className="hero__frame"
        initial={{ clipPath: "inset(6% 4% 0% 4% round 32px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
        transition={{ duration: 1.4, ease }}
      >
        <motion.div className="hero__photos" style={{ y: photoY }}>
          {heroPhotos.map((name, n) => (
            <motion.img
              key={name}
              {...photo(name)}
              sizes={coverSizes}
              alt=""
              initial={false}
              animate={{ opacity: n === i ? 1 : 0, scale: n === i ? 1 : 1.08 }}
              transition={{ opacity: { duration: 1.4, ease }, scale: { duration: HERO_STEP + 1.5, ease: "linear" } }}
            />
          ))}
        </motion.div>
        <div className="hero__shade" aria-hidden="true" />

        <motion.div className="container hero__copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.h1
            className="display hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease }}
          >
            How did you get AI to do that?
          </motion.h1>
          <motion.div
            className="hero__bottom"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.65, ease }}
          >
            <div className="hero__text">
              <p>Some people get far more out of AI. A lot comes down to how they communicate with it.</p>
              <p>PUAI helps people build the communication skills to understand AI, guide it, question it, and put it to work.</p>
            </div>
            <div className="hero__actions">
              <Link className="btn btn--lg" to="/#our-approach">
                Explore our approach <span className="btn__arrow">→</span>
              </Link>
              <ol className="hero__dots" aria-hidden="true">
                {heroPhotos.map((name, n) => (
                  <li key={name}>
                    <motion.span
                      key={n === i ? `on-${i}` : "off"}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: n === i && !reduce ? 1 : 0 }}
                      transition={n === i ? { duration: HERO_STEP, ease: "linear" } : { duration: 0.3 }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// The moments of communication history, pinned to the screen. Scrolling
// moves through them one at a time; each gets most of a screen of scroll,
// and the bars show where you are. Clicking a bar glides to that moment.
const SCROLL_PER_MOMENT = 70; // svh
function Moments() {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  const dir = useRef(1);
  const N = moments.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setI((cur) => {
      if (next !== cur) dir.current = next > cur ? 1 : -1;
      return next;
    });
  });

  function goTo(n: number) {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const y = top + ((n + 0.5) / N) * travel;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  const m = moments[i];
  return (
    <div ref={ref} className="moments" style={{ height: `calc(${N * SCROLL_PER_MOMENT}svh + 100svh)` }}>
      <div className="moments__sticky">
        <div className="container moments__inner">
          <div className="moments__stage" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
              <motion.div
                key={i}
                className="moments__slide"
                custom={dir.current}
                variants={{
                  enter: (d: number) => ({ opacity: 0, y: d * 60 }),
                  center: { opacity: 1, y: 0 },
                  exit: (d: number) => ({ opacity: 0, y: d * -60 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease }}
              >
                <p className="moments__when">{m.when}</p>
                <h3 className={`moments__what ${m.what === "AI" ? "accent" : ""}`}>{m.what}</h3>
                <p className="moments__line">{m.line}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <ol className="moments__bars">
            {moments.map((x, n) => (
              <li key={x.what}>
                <button type="button" onClick={() => goTo(n)} aria-current={n === i} aria-label={`${x.when}, ${x.what}`}>
                  <span className="moments__track">
                    <Fill progress={scrollYProgress} from={n / N} to={(n + 1) / N} />
                  </span>
                  <span className="moments__label">{x.what}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Fill({ progress, from, to }: { progress: MotionValue<number>; from: number; to: number }) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  return <motion.span className="moments__fill" style={{ scaleX }} />;
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
        </div>
        <Moments />
        <div className="container">
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
