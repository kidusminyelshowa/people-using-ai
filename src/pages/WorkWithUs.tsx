import { Fragment, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import PageHero from "../components/PageHero";
import SectionHead from "../components/ui/SectionHead";
import Countdown from "../components/ui/Countdown";
import Closing from "../components/Closing";
import { photo, type PhotoName } from "../content/images";
import { links, masterclassDate } from "../content/links";
import "./WorkWithUs.css";

type Offer = {
  id: string;
  tag: string;
  title: string;
  theme: "navy" | "yellow" | "green";
  image: PhotoName;
  imageAlt: string;
  body: ReactNode;
};

const offers: Offer[] = [
  {
    id: "training",
    tag: "For teams",
    title: "Corporate Training",
    theme: "navy",
    image: "workshop",
    imageAlt: "A team gathered around a laptop during a workshop",
    body: (
      <>
        <p className="offer__lede">
          Custom built in person AI training for your team. We assess your skills gaps and design training around your
          work and context.
        </p>
        <div className="offer__actions">
          <a className="btn btn--lg" href={links.bookConversation}>
            Book a conversation <span className="btn__arrow">→</span>
          </a>
          <a className="link" href={links.caseStudy}>
            View case study
          </a>
        </div>
      </>
    ),
  },
  {
    id: "masterclass",
    tag: "Nairobi · Nov 21 2026",
    title: "PUAI Upskilling Masterclass",
    theme: "yellow",
    image: "laptopMeeting",
    imageAlt: "Colleagues around a table reviewing charts on a laptop",
    body: (
      <>
        <p className="offer__lede">
          A full-day in person masterclass covering AI fundamentals and sector-specific applications. Join us for a day
          of learning and get certified. Nairobi, Nov 21 2026.
        </p>
        <Countdown to={masterclassDate} />
        <div className="offer__actions">
          <a className="btn btn--lg btn--night" href={links.masterclassRegister}>
            Register here <span className="btn__arrow">→</span>
          </a>
          <span className="chip chip--outline">Certified</span>
          <span className="chip chip--outline">Full day · In person</span>
        </div>
      </>
    ),
  },
  {
    id: "community",
    tag: "Free",
    title: "Join the community",
    theme: "green",
    image: "officeMeeting",
    imageAlt: "Colleagues talking around a table in a bright office",
    body: (
      <>
        <p className="offer__lede">
          Free learning, AI experiments, conversations and research for people figuring out how to use AI in their
          work.
        </p>
        <div className="offer__actions">
          <a className="btn btn--lg btn--night" href={links.linkedin}>
            LinkedIn <span className="btn__arrow">→</span>
          </a>
          <a className="btn btn--lg btn--night" href={links.instagram}>
            Instagram <span className="btn__arrow">→</span>
          </a>
          <a className="btn btn--lg btn--night" href={links.substack}>
            Substack <span className="btn__arrow">→</span>
          </a>
        </div>
      </>
    ),
  },
];

function OfferCard({
  offer,
  i,
  progress,
}: {
  offer: Offer;
  i: number;
  progress: MotionValue<number>;
}) {
  // Each card shrinks slightly as the ones after it slide over the top.
  const start = i / offers.length;
  const scale = useTransform(progress, [start, 1], [1, 1 - (offers.length - 1 - i) * 0.04]);

  return (
    <motion.article
      id={offer.id}
      data-section={offer.title}
      className={`offer offer--${offer.theme}`}
      style={{ scale, top: `calc(96px + ${i * 22}px)` }}
    >
        <div className="offer__body">
          <span className="offer__tag">
            <span className="serif">0{i + 1}</span> {offer.tag}
          </span>
          <h2 className="offer__title">{offer.title}</h2>
          {offer.body}
        </div>
        <div className="offer__media">
          <img {...photo(offer.image)} sizes="(max-width: 860px) 92vw, 70vw" alt={offer.imageAlt} loading="lazy" />
        </div>
    </motion.article>
  );
}

export default function WorkWithUs() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <main id="main">
      <PageHero
        title="Work with us"
        image="scissors"
        imageAlt="Hands cutting out a photo at a creative desk"
      />

      <section className="section">
        <div className="container">
          <SectionHead label="Ways to work with us" />
          <div ref={ref} className="offers">
            {offers.map((offer, i) => (
              <Fragment key={offer.id}>
                <OfferCard offer={offer} i={i} progress={scrollYProgress} />
                {/* Spacers (not margins) set the scroll distance, so every card
                    releases at the same moment when the stack finishes. */}
                <div className={i < offers.length - 1 ? "offers__gap" : "offers__hold"} aria-hidden="true" />
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <Closing />
    </main>
  );
}
