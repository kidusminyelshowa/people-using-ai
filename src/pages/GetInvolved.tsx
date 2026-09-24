import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import PageHero from "../components/PageHero";
import SectionHead from "../components/ui/SectionHead";
import RevealText from "../components/ui/RevealText";
import HoverList from "../components/ui/HoverList";
import Closing from "../components/Closing";
import { iconCoral as icon } from "../content/brand";
import { links } from "../content/links";
import "./GetInvolved.css";

function SurveyBadge() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const text = "Take the survey • 5 minutes • ";

  return (
    <div ref={ref} className="survey-badge" aria-hidden="true">
      <motion.svg viewBox="0 0 200 200" style={{ rotate }}>
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          {/* textLength = circumference, so the phrase closes the ring exactly */}
          <textPath href="#badge-circle" textLength={488} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <img src={icon} alt="" className="survey-badge__icon" />
    </div>
  );
}

export default function GetInvolved() {
  return (
    <main id="main">
      <PageHero
        title="Get involved"
        image="scooter"
        imageAlt="A couple laughing as they ride a scooter through a city street"
        position="center 40%"
        accent="var(--navy)"
      />

      {/* RESEARCH */}
      <section className="section" data-section="Research">
        <div className="container">
          <SectionHead label="Research" />
          <RevealText as="h2" className="display gi-title">
            {[
              "There is limited research into how AI is understood, trusted and used across",
              { text: "Africa and emerging markets.", className: "serif" },
            ]}
          </RevealText>
          <div className="gi-partner">
            <motion.span
              className="gi-partner__chip"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              Research partner · University of Freiburg
            </motion.span>
            <p className="lede">
              In partnership with the University of Freiburg, we’re developing research through an anthropological lens
              to understand the people behind AI adoption in East Africa. We are exploring wide ranging topics from how
              people understand the AI technology, what shapes trust and behaviour, and how language, culture and context
              influence use.
            </p>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="section gi-topics" data-section="What we’re exploring">
        <div className="container">
          <SectionHead label="What we’re exploring" />
          <HoverList
            items={[
              { title: "How people understand the AI technology", image: "eyes" },
              { title: "What shapes trust and behaviour", image: "profileSkin" },
              { title: "How language, culture and context influence use", image: "braids" },
            ]}
          />
        </div>
      </section>

      {/* SURVEY */}
      <section className="section" id="survey" data-section="Survey">
        <div className="container">
          <SectionHead label="Survey" />
          <motion.div
            className="survey"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="survey__copy">
              <h2 className="survey__title">Take 5 minutes to tell us how you use AI.</h2>
              <p className="lede">Your response will help shape what AI becomes for people in emerging markets.</p>
              <a className="btn btn--lg btn--night" href={links.survey}>
                Take the survey <span className="btn__arrow">→</span>
              </a>
            </div>
            <SurveyBadge />
          </motion.div>
        </div>
      </section>

      <Closing />
    </main>
  );
}
