import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem, ease } from "../components/motion";
import { CtaBand } from "../components/Footer";
import { Stars } from "../components/Stars";
import { caseStudies } from "../content/caseStudies";
import { photoBySlug } from "../content/images";
import { links } from "../content/links";
import NotFound from "./NotFound";
import "./CaseStudy.css";

function Gallery({ slugs, sizes, className, alt }: { slugs: string[]; sizes: string; className: string; alt: string }) {
  return (
    <Stagger className={className}>
      {slugs.map((slug) => (
        <StaggerItem key={slug} className="cs-shot">
          <img {...photoBySlug(slug)} sizes={sizes} alt={alt} className="photo--colour" loading="lazy" decoding="async" />
        </StaggerItem>
      ))}
    </Stagger>
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
  const alt = `Workshop with the ${cs.client} team`;

  return (
    <main id="main" className="cs">
      <section className="cs-top">
        <div className="container cs-top__inner">
          <div className="cs-top__brand">
            {cs.backTo && (
              <motion.div {...enter(0)}>
                <Link className="text-link cs-back" to={cs.backTo.to}>
                  ← {cs.backTo.label}
                </Link>
              </motion.div>
            )}
            <motion.h1 className="cs-logo" {...enter(0.1)}>
              {cs.logo ? <img src={cs.logo} alt={cs.client} /> : <span className="display">{cs.client}</span>}
            </motion.h1>
          </div>

          {cs.timeline && (
            <ol className="cs-timeline">
              {cs.timeline.map((t, i) => (
                <motion.li key={t.label} className="cs-timeline__item" {...enter(0.25 + i * 0.15)}>
                  <h2 className="h3">{t.label}</h2>
                  <p>{t.text}</p>
                  {t.by && <p className="cs-timeline__by">{t.by}</p>}
                </motion.li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {cs.photos && (
        <section className="container cs-gallery">
          <Gallery
            slugs={cs.photos.top}
            className="cs-row cs-row--top"
            sizes="(max-width: 860px) 100vw, 66vw"
            alt={alt}
          />

          {(cs.partners || cs.rating) && (
            <Reveal className="cs-band">
              {cs.partners && (
                <div className="cs-band__partners">
                  <h2 className="h3">Partnership</h2>
                  <ul>
                    {cs.partners.map((p) => (
                      <li key={p} className="cs-pill">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cs.rating && (
                <div className="cs-band__rating">
                  <Stars value={cs.rating} />
                  <p>
                    <strong>{cs.rating}/5</strong> rating
                  </p>
                </div>
              )}
            </Reveal>
          )}

          <Gallery
            slugs={cs.photos.bottom}
            className="cs-row cs-row--bottom"
            sizes="(max-width: 860px) 100vw, 50vw"
            alt={alt}
          />
        </section>
      )}

      <CtaBand lines={["Bring AI learning to your team."]} action={{ label: "Talk to us", href: links.workWithUs }} />
    </main>
  );
}
