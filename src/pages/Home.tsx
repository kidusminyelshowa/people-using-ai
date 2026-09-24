import Hero from "../sections/home/Hero";
import PinnedSteps from "../sections/home/PinnedSteps";
import SectionHead from "../components/ui/SectionHead";
import RevealText from "../components/ui/RevealText";
import ParallaxImage from "../components/ui/ParallaxImage";
import StackedPills from "../components/ui/StackedPills";
import HoverList from "../components/ui/HoverList";
import Closing from "../components/Closing";
import { coverSizes } from "../content/images";
import "./Home.css";

export default function Home() {
  return (
    <main id="main">
      <Hero />

      {/* Why */}
      <section className="section" id="why" data-section="Why">
        <div className="container">
          <SectionHead label="Why" />
          <RevealText as="h2" className="display home-why__title">
            {["AI access has gone global.", { text: "How people use it hasn’t caught up.", className: "serif" }]}
          </RevealText>
        </div>
      </section>

      <section className="panel home-why__panel" data-section="Why">
        <ParallaxImage
          name="blueProfile"
          alt="Close-up profile of a young man against a blue wall, looking ahead"
          className="home-why__img"
          sizes={coverSizes}
          position="56% 58%"
          strength={7}
        />
        <div className="home-why__cards">
          <p className="home-why__card">
            The way people understand, trust and use AI tools is shaped by where they live, the language they speak, the
            work they do and the context they operate in.
          </p>
          <p className="home-why__card home-why__card--coral">
            We bring an emerging-market perspective to AI adoption. Combining technology, business, communication and
            human behaviour to make AI tools relevant to the way people live and work.
          </p>
        </div>
      </section>

      {/* How */}
      <section className="section" data-section="How">
        <div className="container">
          <SectionHead label="How" />
          <RevealText as="h2" className="display home-how__title">
            {["Between access and active use is a", { text: "learning curve.", className: "serif" }]}
          </RevealText>
          <div className="home-how__intro">
            <p className="lede">
              You don't need to be a developer or technical expert to use AI well. If you are a professional,
              entrepreneur, freelancer or consultant with access to AI tools, you can learn to make them useful in the
              way you work.
            </p>
          </div>
        </div>
      </section>

      <section className="panel home-who" data-section="Who it's for">
        <ParallaxImage
          name="glassSmile"
          alt="A smiling woman reflected in a glass wall"
          className="home-who__img"
          sizes={coverSizes}
          strength={8}
        />
        <div className="home-who__stack">
          <StackedPills
            items={[
              { label: "Professional", color: "var(--cotton)" },
              { label: "Entrepreneur", color: "var(--green)" },
              { label: "Freelancer", color: "var(--yellow)" },
              { label: "Consultant", color: "var(--night)", ink: "var(--cotton)" },
            ]}
          />
        </div>
      </section>

      <section data-section="How">
        <PinnedSteps />
      </section>

      {/* Where to start */}
      <section className="section" data-section="Where to start">
        <div className="container">
          <SectionHead label="Where to start" />
          <HoverList
            items={[
              {
                title: "Corporate Training",
                body: "Custom built in person AI training for your team.",
                image: "workshop",
                to: "/work-with-us#training",
              },
              {
                title: "Upskilling Masterclass",
                body: "A full-day in person masterclass. Nairobi, Nov 21 2026.",
                image: "laptopMeeting",
                to: "/work-with-us#masterclass",
              },
              {
                title: "Join the community",
                body: "Free learning, AI experiments, conversations and research.",
                image: "officeMeeting",
                to: "/work-with-us#community",
              },
              {
                title: "Shape the research",
                body: "Take 5 minutes to tell us how you use AI.",
                image: "profileSkin",
                to: "/get-involved#survey",
              },
            ]}
          />
        </div>
      </section>

      <Closing />
    </main>
  );
}
