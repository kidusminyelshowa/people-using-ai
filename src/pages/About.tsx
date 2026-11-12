import { motion } from "motion/react";
import { Placeholder, Reveal, Stagger, StaggerItem, Statement, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import "./About.css";

const story = [
  {
    text: "We’ve spent over 20 years combined working across communication, marketing, strategy, and business in emerging markets.",
    image: "[IMAGE 1: logos of organisations we’ve worked with]",
  },
  {
    text: "We are both mums. Sometimes the kids join our calls.",
    image: "[IMAGE 2: us on a call with the kids]",
  },
  {
    text: "We’ve spent time in tech spaces and noticed something: so much is built around developers, and so little around the people actually using the AI technology.",
    image: "[IMAGE 3: both of us at tech events]",
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

export default function About() {
  return (
    <main id="main" className="about">
      <section className="container about__hero">
        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease }}
        >
          We are communicators.
        </motion.h1>
        <motion.p
          className="lede about__intro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
        >
          We met in Nairobi. People Using AI grew out of our shared interest in communication, people, and how AI is
          changing everyday life and work.
        </motion.p>
      </section>

      <section className="container story">
        {story.map((s, i) => (
          <article key={i} className={`story__row ${i % 2 ? "story__row--flip" : ""}`}>
            <Reveal className="story__text">
              <p className="statement-text">{s.text}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Placeholder label={s.image} className="story__image" />
            </Reveal>
          </article>
        ))}
      </section>

      <section className="container pov">
        <Statement className="h1 pov__title">
          Too much of the AI conversation feels detached from real people and real contexts.
        </Statement>
        <Reveal>
          <p className="lede pov__intro">Here are 25 things we dislike about it. And part of why we started PUAI.</p>
        </Reveal>
        <Stagger as="ol" className="pov__list" amount={0.05}>
          {dislikes.map((d, i) => (
            <StaggerItem key={i} as="li" className="pov__item">
              <span className="pov__n">{i + 1}</span>
              <span>{d}</span>
            </StaggerItem>
          ))}
        </Stagger>
        <Statement as="p" className="display pov__welcome">
          If that sounds like you, welcome.
        </Statement>
      </section>

      <CtaBand lines={["People first.", "AI in context."]} action={{ label: "Join the community", to: "/community" }} />
    </main>
  );
}
