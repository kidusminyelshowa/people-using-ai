import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { CountUp, Placeholder, Reveal, Stagger, StaggerItem, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { caseStudies } from "../content/caseStudies";
import { links } from "../content/links";
import NotFound from "./NotFound";
import "./CaseStudy.css";

function Step({ n, title, children }: { n: string; title: string; children?: ReactNode }) {
  return (
    <div className="cs-step">
      <Reveal as="h2" className="h1 cs-step__title">
        <span className="accent">{n}</span> {title}
      </Reveal>
      {children && (
        <Reveal className="cs-step__body" delay={0.1}>
          {children}
        </Reveal>
      )}
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const cs = caseStudies.find((c) => c.slug === slug && c.published);
  if (!cs) return <NotFound />;

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease },
  });

  return (
    <main id="main" className="cs">
      <section className="container cs-hero">
        {cs.backTo && (
          <motion.div {...enter(0)}>
            <Link className="text-link cs-back" to={cs.backTo.to}>
              ← {cs.backTo.label}
            </Link>
          </motion.div>
        )}
        <motion.h1 className="display cs-hero__title" {...enter(0.1)}>
          {cs.client}
        </motion.h1>
        {cs.summary && (
          <motion.p className="lede cs-hero__summary" {...enter(0.3)}>
            {cs.summary}
          </motion.p>
        )}

        {cs.stats && (
          <Stagger className="cs-stats">
            {cs.stats.map((s, i) => (
              <StaggerItem key={i} className="cs-stat">
                <CountUp value={s.value} className="cs-stat__value" />
                <span className="cs-stat__label">{s.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      {cs.heroPhoto && (
        <Reveal className="cs-hero__photo-wrap">
          <Placeholder label={cs.heroPhoto} className="cs-hero__photo" />
        </Reveal>
      )}

      {cs.challenge && (
        <section className="container cs-block">
          <Step n="01" title="The challenge">
            <p className="statement-text">{cs.challenge.lead}</p>
            <p className="lede">{cs.challenge.context}</p>
          </Step>
        </section>
      )}

      {cs.gaps && (
        <section className="container cs-block">
          <Step n="02" title="The gaps we identified">
            <p className="statement-text">{cs.gaps.intro}</p>
          </Step>
          <Reveal className="cs-chart">
            <div className="cs-chart__head">
              <h3 className="h3">Team score before training, by skill</h3>
              <span className="cs-legend">
                <i className="cs-legend__before" /> Before <i /> After
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
                  {[
                    { v: s.before, c: "cs-bar__fill cs-bar__fill--before", d: 0 },
                    { v: s.after, c: "cs-bar__fill", d: 0.15 },
                  ].map((b) => (
                    <div key={b.c} className="cs-bar__track">
                      <motion.span
                        className={b.c}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: b.v / 100 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1.2, delay: b.d, ease }}
                      />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
            <p className="cs-chart__note">{cs.gaps.note}</p>
          </Reveal>
        </section>
      )}

      {cs.training && (
        <section className="container cs-block">
          <Step n="03" title="The training">
            <p className="statement-text">{cs.training.intro}</p>
          </Step>
          <Stagger className="cs-sessions">
            {cs.training.sessions.map((s, i) => (
              <StaggerItem key={i} as="article" className="cs-session">
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.label}</p>
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
                <Placeholder label={p} className="cs-photo" />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {cs.results && (
        <section className="container cs-block">
          <Step n="04" title="The results" />
          <Stagger className="cs-results">
            {cs.results.map((r, i) => (
              <StaggerItem key={i} className="cs-result">
                <CountUp value={r.value} className="cs-result__value" />
                <span className="cs-result__label">{r.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
          {cs.quote && (
            <Reveal as="figure" className="cs-quote">
              <blockquote className="h1">“{cs.quote.text}”</blockquote>
              <figcaption className="lede">{cs.quote.by}</figcaption>
            </Reveal>
          )}
        </section>
      )}

      <CtaBand lines={["Bring AI learning to your team."]} action={{ label: "Talk to us", href: links.workWithUs }} />
    </main>
  );
}
