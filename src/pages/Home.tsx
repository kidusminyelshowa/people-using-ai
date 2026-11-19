import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Parallax, Reveal, Stagger, StaggerItem, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { useRegister, workshop, type Topic } from "../components/Register";
import { photo, type PhotoName } from "../content/images";
import Flower from "../components/Flower";
import "./Home.css";

// Hero video in public/video: a vertical cut for phones and a horizontal
// one elsewhere, each as AV1 (about 2.7 MB) with an H.264 fallback.
// Set HERO_VIDEO to false to fall back to the photos.
const PHONE = "(max-width: 720px)";
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
              <video
                poster={window.matchMedia(PHONE).matches ? "/video/hero-v-poster.webp" : "/video/hero-h-poster.webp"}
                autoPlay={!reduce}
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src="/video/hero-v-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' media={PHONE} />
                <source src="/video/hero-v.mp4" type="video/mp4" media={PHONE} />
                <source src="/video/hero-h-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
                <source src="/video/hero-h.mp4" type="video/mp4" />
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
          {skills.map((s) => (
            <StaggerItem key={s.name} as="article" className={`skill skill--${skillTone[s.name]}`}>
              <Flower className="skill__shape" />
              <div className="skill__body">
                <h3 className="skill__name">{s.name}</h3>
                <p className="skill__line">{s.line}</p>
              </div>
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
            image="officeMeeting"
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

// Moves on every 5 seconds. Swipe or drag the card, use the arrows or the
// keyboard's arrow keys, or pick a bar; hovering or focusing holds it.
const QUOTE_STEP = 5;
function Testimonials() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduce && !paused;
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(1), QUOTE_STEP * 1000);
    return () => window.clearTimeout(t);
  }, [i, playing]);
  const [dir, setDir] = useState(1);
  const go = (d: number) => {
    setDir(d);
    setI((n) => (n + d + quotes.length) % quotes.length);
  };
  const q = quotes[i];
  const initials = q.by
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <section id="voices" className="block">
      <div className="container">
        <Reveal as="h2" className="h1 voices__title">
          What others say
        </Reveal>
        <Reveal
          className="voices"
          amount={0.4}
        >
          <div
            className="voices__card"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
          >
            <svg className="voices__mark" viewBox="0 0 48 36" aria-hidden="true">
              <path
                fill="currentColor"
                d="M0 36V22C0 9.5 6.2 2.2 18.6 0l2 5.2C13.4 7 9.9 11.3 9.6 18H20v18H0Zm27 0V22C27 9.5 33.2 2.2 45.6 0l2 5.2C40.4 7 36.9 11.3 36.6 18H47v18H27Z"
              />
            </svg>
            <div className="voices__stage" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={i}
                  className="voices__quote"
                  custom={dir}
                  initial={{ opacity: 0, x: 40 * dir }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 * dir }}
                  transition={{ duration: 0.35, ease }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
                    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
                  }}
                >
                  <blockquote>{q.text}</blockquote>
                  <figcaption>
                    <span className="voices__avatar" aria-hidden="true">
                      {initials}
                    </span>
                    {q.by}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div className="voices__nav">
              <ol className="voices__bars">
                {quotes.map((x, n) => (
                  <li key={x.by}>
                    <button type="button" onClick={() => go(n - i)} aria-label={`Quote from ${x.by}`} aria-current={n === i}>
                      <span className="voices__track">
                        <motion.span
                          key={n === i ? `on-${i}-${playing}` : "off"}
                          className="voices__fill"
                          initial={{ scaleX: n === i && !playing ? 1 : 0 }}
                          animate={{ scaleX: n === i ? 1 : 0 }}
                          transition={n === i && playing ? { duration: QUOTE_STEP, ease: "linear" } : { duration: 0.3 }}
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="voices__arrows">
                <button
                  type="button"
                  aria-label="Previous quote"
                  onClick={() => go(-1)}
                >
                  ←
                </button>
                <button type="button" aria-label="Next quote" onClick={() => go(1)}>
                  →
                </button>
              </div>
            </div>
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
