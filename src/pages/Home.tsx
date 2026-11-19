import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Parallax, Reveal, Stagger, StaggerItem, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { useRegister, workshop, type Topic } from "../components/Register";
import { photo, type PhotoName } from "../content/images";
import Flower from "../components/Flower";
import "./Home.css";

// Hero video in public/video, compressed from the 15 MB master: AV1 for
// browsers that play it (3.7 MB), H.264 otherwise (5.3 MB), and a 720p
// H.264 cut for phones (3 MB). Set to false to fall back to the photos.
const HERO_VIDEO = true;
const heroPhotos: PhotoName[] = ["laptopMeeting", "clay", "headphones"];
const HERO_STEP = 6;

// Faces in flower-shaped frames, with a few solid brand-colour flowers
// between them. Each drifts at its own speed as the section scrolls by.
type Bloom = { className: string; speed: number; spin?: number } & ({ name: PhotoName } | { color: string });
const blooms: Bloom[] = [
  { className: "bloom--a", name: "headphones", speed: -40 },
  { className: "bloom--b", name: "goldenPortrait", speed: 30 },
  { className: "bloom--c", name: "glasses", speed: -60 },
  { className: "bloom--d", name: "portraitCalm", speed: 50 },
  { className: "bloom--e", color: "var(--yellow)", speed: -90, spin: 40 },
  { className: "bloom--f", color: "var(--green)", speed: 70, spin: -50 },
  { className: "bloom--g", color: "var(--pink)", speed: -20, spin: 30 },
];

// Each skill gets one of the brand's playful colours.
const skillTone = { Read: "yellow", Write: "green", Speak: "pink", Listen: "navy" } as const;

const skills = [
  { name: "Read", line: "Understand how AI works, what its tools can do and where their limitations and risks lie." },
  { name: "Write", line: "Give your ideas direction through clear instructions, relevant context and defined intentions." },
  { name: "Speak", line: "Develop ideas through questions, dialogue, experimentation and exchange." },
  { name: "Listen", line: "Evaluate what AI gives back. Check accuracy, question assumptions and decide what is useful." },
] as const;

const quotes = [
  { text: "Eye-opener! I didn’t know AI was capable of so much.", by: "Yvonne Wandia Wamuyu" },
  { text: "Excellent delivery. I enjoyed every bit of it, and I look forward to doing more with AI tools.", by: "Korir Kipkirui Isaac" },
  {
    text: "The training was insightful and practical providing good understanding of how AI tools like Claude can be leveraged to improve productivity and simplify day-to-day tasks.",
    by: "Julius Mutie Safari",
  },
  {
    text: "I’ve done Jan 2025 to June 2026 audit prep and financials prep in 4 hours with Claude. Would have taken me days… days of sleepless nights! Thank you",
    by: "Sierra Breweries Finance Team",
  },
];

/* ---------- Hero ---------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce || HERO_VIDEO) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % heroPhotos.length), HERO_STEP * 1000);
    return () => window.clearTimeout(t);
  }, [i, reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  // Tablet and up lay the words over the media; phones stack them above it.
  return (
    <section ref={ref} className="hero">
      <div className="hero__stage">
        <motion.div
          className="hero__frame"
          initial={{ clipPath: "inset(6% 3% 0% 3% round 32px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
          transition={{ duration: 1.4, ease }}
        >
          <motion.div className="hero__media" style={{ y: mediaY }}>
            {HERO_VIDEO ? (
              <video poster="/video/hero-poster.webp" autoPlay={!reduce} muted loop playsInline preload="auto" aria-hidden="true">
                <source src="/video/hero-720.mp4" type="video/mp4" media="(max-width: 720px)" />
                <source src="/video/hero-1080-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
                <source src="/video/hero-1080.mp4" type="video/mp4" />
              </video>
            ) : (
              heroPhotos.map((name, n) => (
                <motion.img
                  key={name}
                  {...photo(name)}
                  sizes="100vw"
                  alt=""
                  initial={false}
                  animate={{ opacity: n === i ? 1 : 0, scale: n === i ? 1 : 1.08 }}
                  transition={{ opacity: { duration: 1.4, ease }, scale: { duration: HERO_STEP + 1.5, ease: "linear" } }}
                />
              ))
            )}
          </motion.div>
          <div className="hero__shade" aria-hidden="true" />
          {!HERO_VIDEO && (
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
          )}
        </motion.div>

        <div className="hero__copy">
          <div className="container">
            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.35, ease }}
            >
              Upskilling the future workforce in an AI enabled world.
            </motion.h1>
            <motion.div
              className="hero__text"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease }}
            >
              <p>We help people understand, explore, and apply AI, grounded in African contexts.</p>
              <Link className="btn btn--lg" to="/#approach">
                Explore our approach <span className="btn__arrow">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- AI didn't come with a manual ---------- */

function BloomShape(b: Bloom) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [b.speed, -b.speed]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-(b.spin ?? 0), b.spin ?? 0]);
  return (
    <motion.div ref={ref} className={`bloom ${b.className}`} style={{ y }}>
      <motion.div
        className="bloom__inner"
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease }}
      >
        {"name" in b ? (
          <img {...photo(b.name)} sizes="(max-width: 860px) 50vw, 25vw" alt="" loading="lazy" />
        ) : (
          <motion.div style={{ rotate }}>
            <Flower color={b.color} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Manual() {
  return (
    <section id="why" className="block manual">
      <div className="container manual__grid">
        <div className="manual__copy">
          <Reveal as="h2" className="display manual__title">
            AI is moving faster than most of us can keep up with.
          </Reveal>
          <Reveal delay={0.1}>
            <p className="statement-text">The tools are here, but contextually practical guidance on how to apply them is hard to find.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lede">
              We close that gap for everyday AI users in Africa.
            </p>
          </Reveal>
        </div>
        <div className="manual__faces" aria-hidden="true">
          {blooms.map((b) => (
            <BloomShape key={b.className} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Framework ---------- */

function Framework() {
  return (
    <section id="approach" className="block framework">
      <div className="container">
        <div className="framework__head">
          <Reveal as="h2" className="h1 framework__title">
            Our Framework
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              We put critical thinking and human judgment at the heart of working with AI. Our framework adapts four essential human skills to the AI context.
            </p>
          </Reveal>
        </div>
        <Stagger className="skills">
          {skills.map((s, n) => (
            <StaggerItem key={s.name} as="article" className={`skill skill--${skillTone[s.name]}`}>
              <span className="skill__badge" aria-hidden="true">
                <Flower />
                <span>{String(n + 1).padStart(2, "0")}</span>
              </span>
              <h3 className="skill__name">{s.name}</h3>
              <p className="skill__line">{s.line}</p>
              <Flower className="skill__bloom" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Three ways to work with us ---------- */

function Offer({
  id,
  title,
  body,
  image,
  flip,
  children,
}: {
  id: string;
  title: string;
  body: string;
  image: PhotoName;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <article id={id} className={`offer ${flip ? "offer--flip" : ""}`}>
      <Parallax {...photo(image)} sizes="(max-width: 860px) 100vw, 95vw" className="offer__photo" />
      <Reveal className="offer__text">
        <h3 className="h2 offer__title">{title}</h3>
        <p className="lede">{body}</p>
        {children}
      </Reveal>
    </article>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((n) => {
        const fill = Math.max(0, Math.min(1, value - n));
        return (
          <svg key={n} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={`star-${n}`}>
                <stop offset={fill} stopColor="var(--coral)" />
                <stop offset={fill} stopColor="var(--line)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-${n})`}
              d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function Ways() {
  const register = useRegister();
  const open = (t: Topic) => () => register(t);
  return (
    <section id="what-we-do" className="block">
      <div className="container">
        <Reveal as="h2" className="display ways__title">
          Three ways to work with us.
        </Reveal>
        <div className="offers">
          <Offer
            id="training"
            title="Workforce Upskilling"
            image="laptopMeeting"
            body="We help individuals and teams explore AI, discover relevant tools, and build the skills to use them confidently and effectively."
          >
            <div className="rating">
              <Stars value={4.5} />
              <p>
                Our curriculum has been rated 4.5/5 stars by previous cohorts.{" "}
                <Link className="text-link" to="/work/sierra-premium-breweries">
                  See case study <span className="btn__arrow">→</span>
                </Link>
              </p>
            </div>
            <div className="workshop">
              <h4 className="workshop__label">Upcoming workshop</h4>
              <p className="workshop__title">{workshop.title}</p>
              <p className="workshop__meta">{workshop.meta}</p>
              <button type="button" className="btn" onClick={open("workshop")}>
                Register here <span className="btn__arrow">→</span>
              </button>
            </div>
          </Offer>
          <Offer
            id="research"
            title="Anthropological Research"
            image="teamWall"
            flip
            body="We explore how AI is shaping human behaviour, communication, and everyday life, and how culture and context influence its adoption across East Africa."
          >
            <button type="button" className="btn" onClick={open("research")}>
              Be part of the research <span className="btn__arrow">→</span>
            </button>
          </Offer>
          <Offer
            id="community"
            title="Community & Storytelling"
            image="conversation"
            body="We bring people together to share experiences, exchange ideas, and explore AI's role in everyday life, from work and education to parenting and creativity."
          >
            <button type="button" className="btn" onClick={open("community")}>
              Join our community <span className="btn__arrow">→</span>
            </button>
          </Offer>
        </div>
      </div>
    </section>
  );
}

/* ---------- What others say ---------- */

// A row of quote cards you can swipe, drag or step through with the arrows.
// It moves on by itself every few seconds until you take over; hovering
// or focusing it holds it still.
const QUOTE_STEP = 5;
const quoteTones = ["yellow", "pink", "green", "navy"] as const;

function Testimonials() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLOListElement>(null);
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [taken, setTaken] = useState(false); // the visitor has stepped through themselves
  const [inView, setInView] = useState(false);
  const playing = !reduce && !held && !taken && inView;

  const go = (n: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[(n + quotes.length) % quotes.length] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };
  const step = (d: number) => {
    setTaken(true);
    go(i + d);
  };

  // Which card is in front follows the scroll position, however it got there.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.children[0] as HTMLElement;
      const second = el.children[1] as HTMLElement;
      const pitch = second.offsetLeft - first.offsetLeft;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setI(atEnd ? quotes.length - 1 : Math.round(el.scrollLeft / pitch));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(i + 1), QUOTE_STEP * 1000);
    return () => window.clearTimeout(t);
  }, [i, playing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="voices" className="block">
      <div className="container">
        <div className="voices__head">
          <Reveal as="h2" className="h1 voices__title">
            What others say
          </Reveal>
          <div className="voices__arrows">
            <button type="button" aria-label="Previous quote" onClick={() => step(-1)}>
              ←
            </button>
            <button type="button" aria-label="Next quote" onClick={() => step(1)}>
              →
            </button>
          </div>
        </div>
        <Reveal amount={0.3}>
          <ol
            ref={track}
            className="voices__track"
            aria-label="Testimonials"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={() => setHeld(false)}
            onPointerDown={() => setTaken(true)}
            onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && setTaken(true)}
          >
            {quotes.map((q, n) => (
              <li key={q.by} className={`voice voice--${quoteTones[n % quoteTones.length]}`}>
                <Flower className="voice__bloom" />
                <blockquote>“{q.text}”</blockquote>
                <p className="voice__by">{q.by}</p>
              </li>
            ))}
          </ol>
          <div className="voices__dots">
            {quotes.map((q, n) => (
              <button
                key={q.by}
                type="button"
                aria-label={`Quote from ${q.by}`}
                aria-current={n === i}
                onClick={() => {
                  setTaken(true);
                  go(n);
                }}
              >
                <span className="voices__dot">
                  {n === i && (
                    <motion.span
                      key={`${i}-${playing}`}
                      className="voices__fill"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={playing ? { duration: QUOTE_STEP, ease: "linear" } : { duration: 0 }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const register = useRegister();
  return (
    <main id="main" className="home">
      <Hero />
      <Manual />
      <Framework />
      <Ways />
      <Testimonials />
      <CtaBand
        lines={["AI creates possibilities.", "People shape what comes next."]}
        action={{ label: "Register for upcoming workshops", onClick: () => register("workshop") }}
      />
    </main>
  );
}
