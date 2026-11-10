import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Placeholder, Reveal, SplitHeading, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import "./About.css";

const story = [
  {
    text: [
      "We’ve spent over 20 years combined working across communication, marketing, strategy, and business in emerging markets.",
    ],
    image: "[IMAGE 1: logos of organisations we’ve worked with]",
    tint: false,
  },
  {
    text: ["We are both mums.", { accent: "Sometimes the kids join our calls." }],
    image: "[IMAGE 2: us on a call with the kids]",
    tint: true,
  },
  {
    text: [
      "We’ve spent time in tech spaces and noticed something: so much is built around developers, and so little around the people actually using the AI technology.",
    ],
    image: "[IMAGE 3: both of us at tech events]",
    tint: false,
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

function StoryRow({ row, index }: { row: (typeof story)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 ? 2 : -2, 0]);

  return (
    <div ref={ref} className={`story ${index % 2 ? "story--flip" : ""}`}>
      <Reveal className="story__text">
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
      </Reveal>
      <motion.div className="story__media" style={{ y, rotate }}>
        <Placeholder label={row.image} tint={row.tint} className="story__ph" />
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <main id="main">
      <section className="about-hero">
        <div className="container">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            About PUAI
          </motion.span>
          <SplitHeading
            as="h1"
            onMount
            delay={0.15}
            className="display"
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

      <section className="section--tight">
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
            <p className="body-lg pov__sub">
              Here are <span className="accent">25 things we dislike about it.</span> And part of why we started PUAI.
            </p>
          </Reveal>
          <ol className="dislikes">
            {dislikes.map((d, i) => (
              <motion.li
                key={i}
                className="dislike"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease, delay: (i % 4) * 0.05 }}
              >
                <span className="dislike__n">{String(i + 1).padStart(2, "0")}</span>
                <span>{d}</span>
              </motion.li>
            ))}
          </ol>
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
