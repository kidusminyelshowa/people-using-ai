import { motion } from "motion/react";
import PageHero from "../components/PageHero";
import SectionHead from "../components/ui/SectionHead";
import RevealText from "../components/ui/RevealText";
import ParallaxImage from "../components/ui/ParallaxImage";
import StackedPills from "../components/ui/StackedPills";
import CountUp from "../components/ui/CountUp";
import VelocityMarquee from "../components/ui/VelocityMarquee";
import Closing from "../components/Closing";
import { coverSizes, photo, type PhotoName } from "../content/images";
import "./About.css";

const story = [
  "We’ve also worked closely with technologists. As AI tools have evolved, we found ourselves overwhelmed by the way they were explained, often with the assumption that access to the tools meant knowing how to use them.",
  "PUAI was born from wanting a space to learn and experiment, and to build the skills needed to keep up as the technology evolves.",
  "Today, we bring that perspective to AI upskilling, training and research.",
];

const faces: PhotoName[] = ["eyes", "goldenPortrait", "glasses", "braids", "portraitCalm", "profileSkin", "blueProfile"];

export default function About() {
  return (
    <main id="main">
      <PageHero
        title="About us"
        image="glassSmile"
        imageAlt="A smiling woman reflected in a glass wall"
        position="center 30%"
      />

      {/* WHO */}
      <section className="section" data-section="Who we are">
        <div className="container">
          <SectionHead label="Who we are" />
          <RevealText as="h2" className="about-statement">
            {["We are", { text: "communicators.", className: "serif" }]}
          </RevealText>
          <div className="about-who">
            <motion.div
              className="about-stat"
              initial={{ opacity: 0, y: 40, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
            >
              <span className="about-stat__num">
                <CountUp to={20} suffix="+" />
              </span>
              <span className="about-stat__label">years across marketing, strategy, operations and commercial growth</span>
            </motion.div>
            <p className="lede">
              We understand people, make ideas clear and solve business problems. We’ve spent 20+ years doing this across
              marketing, strategy, operations and commercial growth in emerging markets.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section about-story" data-section="Our story">
        <div className="container">
          <SectionHead label="Our story" />
          <div className="about-story__grid">
            <div className="about-story__media">
              <ParallaxImage
                name="scissors"
                alt="Hands cutting out a photo at a desk covered in sketches"
                className="about-story__img"
                sizes="(max-width: 860px) 92vw, 86vw"
                strength={8}
              />
            </div>
            <div className="about-story__copy">
              {story.map((para, i) => (
                <RevealText key={i} className="about-story__para">
                  {para}
                </RevealText>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOCUS */}
      <section className="panel about-focus" data-section="What we focus on">
        <ParallaxImage name="conversation" alt="Two friends laughing together outdoors" className="about-focus__img" sizes={coverSizes} />
        <div className="about-focus__inner">
          <SectionHead label="What we focus on" tone="light" />
          <p className="about-focus__intro">We focus on the human skills that make technology useful:</p>
          <StackedPills
            items={[
              { label: "Communication", color: "var(--coral)", ink: "#fff" },
              { label: "Critical thinking", color: "var(--cotton)" },
              { label: "Creativity", color: "var(--yellow)" },
              { label: "Judgement", color: "var(--green)" },
              { label: "Problem-solving", color: "var(--pink)" },
            ]}
          />
        </div>
      </section>

      {/* WHERE */}
      <section className="section" data-section="Nairobi">
        <div className="container">
          <SectionHead label="Where we are" />
          <div className="about-nairobi">
            <RevealText as="h2" className="display">
              {["We’re building this from", { text: "Nairobi.", className: "serif" }]}
            </RevealText>
            <p className="lede">
              With lived experience of East Africa and its rapidly growing AI ecosystem. We want to help shape what AI
              becomes for people in emerging markets.
            </p>
          </div>
        </div>
        <VelocityMarquee className="about-faces" baseVelocity={-1.2}>
          {faces.map((f) => (
            <img key={f} {...photo(f)} sizes="(max-width: 860px) 360px, 540px" alt="" loading="lazy" className="about-faces__img" />
          ))}
        </VelocityMarquee>
      </section>

      <Closing />
    </main>
  );
}
