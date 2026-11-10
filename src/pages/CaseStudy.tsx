import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Placeholder, Reveal, SplitHeading, Stagger, StaggerItem, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { caseStudies } from "../content/caseStudies";
import { links } from "../content/links";
import NotFound from "./NotFound";
import "./CaseStudy.css";

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="cs-step">
      <Reveal className="cs-step__head">
        <span className="cs-step__n">{n}</span>
        <h2 className="h2 cs-step__title">{title}</h2>
      </Reveal>
      <Reveal className="cs-step__body" delay={0.1}>
        {children}
      </Reveal>
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const cs = caseStudies.find((c) => c.slug === slug && c.published);
  if (!cs) return <NotFound />;

  return (
    <main id="main" className="cs">
      <section className="cs-hero container">
        {cs.backTo && (
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }}>
            <Link className="text-link cs-back" to={cs.backTo.to}>
              ← {cs.backTo.label}
            </Link>
          </motion.div>
        )}
        {cs.eyebrow && <span className="eyebrow">{cs.eyebrow}</span>}
        <SplitHeading as="h1" onMount delay={0.1} className="display cs-hero__title" segments={[cs.client]} />
        {cs.summary && (
          <motion.p
            className="lede cs-hero__summary"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
          >
            {cs.summary}
          </motion.p>
        )}

        {cs.stats && (
          <Stagger className="cs-stats">
            {cs.stats.map((s, i) => (
              <StaggerItem key={i} className="cs-stat">
                <span className="cs-stat__value">{s.value}</span>
                <span className="cs-stat__label">{s.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {cs.heroPhoto && (
          <Reveal y={60}>
            <Placeholder label={cs.heroPhoto} tint className="cs-hero__photo" />
          </Reveal>
        )}
      </section>

      {cs.challenge && (
        <section className="section--tight container">
          <Step n="01" title="The challenge">
            <p className="lede">{cs.challenge.lead}</p>
            <p className="body-lg cs-muted">{cs.challenge.context}</p>
          </Step>
        </section>
      )}

      {cs.gaps && (
        <section className="section--tight cs-gaps">
          <div className="container">
            <Step n="02" title="The gaps we identified">
              <p className="lede">{cs.gaps.intro}</p>
            </Step>
            <Reveal className="cs-chart">
              <div className="cs-chart__head">
                <span>Team score before training, by skill</span>
                <span className="cs-legend">
                  <i className="cs-legend__before" /> Before <i className="cs-legend__after" /> After
                </span>
              </div>
              <ul>
                {cs.gaps.skills.map((s) => (
                  <li key={s.label} className="cs-bar">
                    <div className="cs-bar__row">
                      <span>{s.label}</span>
                      <span className="cs-bar__nums">
                        {s.beforeText} → {s.afterText}
                      </span>
                    </div>
                    <div className="cs-bar__track">
                      <motion.span
                        className="cs-bar__fill cs-bar__fill--before"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: s.before / 100 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1.1, ease }}
                      />
                    </div>
                    <div className="cs-bar__track">
                      <motion.span
                        className="cs-bar__fill"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: s.after / 100 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1.3, delay: 0.15, ease }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="cs-chart__note">{cs.gaps.note}</p>
            </Reveal>
          </div>
        </section>
      )}

      {cs.training && (
        <section className="section--tight container">
          <Step n="03" title="The training">
            <p className="lede">{cs.training.intro}</p>
          </Step>
          <Stagger className="cs-sessions">
            {cs.training.sessions.map((s, i) => (
              <StaggerItem key={i} as="article" className="cs-session">
                <span className="eyebrow">{s.label}</span>
                <h3 className="h3">{s.title}</h3>
                <ul>
                  {s.topics.map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="cs-photos">
            {cs.training.photos.map((p, i) => (
              <StaggerItem key={i}>
                <Placeholder label={p} tint className="cs-photo" />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {cs.results && (
        <section className="section dark">
          <div className="container">
            <Reveal className="cs-step__head cs-step__head--solo">
              <span className="cs-step__n">04</span>
              <h2 className="h2">The results</h2>
            </Reveal>
            <Stagger className="cs-results">
              {cs.results.map((r, i) => (
                <StaggerItem key={i} className="cs-result">
                  <span className="cs-result__value">{r.value}</span>
                  <span className="cs-result__label">{r.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
            {cs.quote && (
              <Reveal as="figure" className="cs-quote">
                <blockquote>“{cs.quote.text}”</blockquote>
                <figcaption>{cs.quote.by}</figcaption>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <CtaBand title={["Bring AI learning to your team."]} action={{ label: "Talk to us", href: links.workWithUs }} />
    </main>
  );
}
