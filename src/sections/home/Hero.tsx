import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import bowl from "../../assets/brand/bowl.svg";
import { coverSizes, photo } from "../../content/images";
import { MarqueeTrack, useMarqueeX } from "../../components/ui/VelocityMarquee";
import "./Hero.css";

const ease = [0.22, 1, 0.36, 1] as const;
const bowlVar = { ["--bowl" as string]: `url("${bowl}")` };

function MarqueeWords() {
  return (
    <span className="hero-marquee__words">
      AI access has gone global<span className="hero-marquee__sep">•</span>
    </span>
  );
}

/*
  The coral bowl is split across two sections: its top (the text) sits at
  the bottom of the full-screen hero, and its lower half (the photo) opens
  the slate section below, so the fold lands exactly on the seam.
*/
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bowlRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgScale = useTransform(heroProgress, [0, 1], [1.05, 1.2]);
  const bgY = useTransform(heroProgress, [0, 1], ["0%", "14%"]);
  const { scrollYProgress: bowlProgress } = useScroll({ target: bowlRef, offset: ["start end", "end start"] });
  const photoY = useTransform(bowlProgress, [0, 1], ["-8%", "8%"]);
  // One shared x value keeps the filled and outlined marquee layers aligned.
  const x = useMarqueeX(-1.6);

  return (
    <>
      <section ref={heroRef} className="hero" data-section="Welcome" aria-labelledby="hero-title" style={bowlVar}>
        <div className="hero__bg">
          <motion.img
            {...photo("teamWall")}
            sizes={coverSizes}
            alt="Two colleagues planning together at a glass wall covered in sticky notes"
            style={{ scale: bgScale, y: bgY }}
            fetchPriority="high"
          />
        </div>

        <motion.div
          className="hero-card hero-card--top"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
        >
          <div className="hero-card__shape" />
          <div className="hero-card__text">
            <h1 id="hero-title">
              <span className="hero-card__mask">
                <motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.95 }}>
                  You have access to powerful AI tools.
                </motion.span>
              </span>
              <span className="hero-card__mask hero-card__line2">
                <motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 1.05 }}>
                  Communication is how you make them useful.
                </motion.span>
              </span>
            </h1>
            <motion.div
              className="hero-card__row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 1.25 }}
            >
              <p>
                Language, culture, context and the way you work all shape what AI tools can do for you. You are the
                bridge between technology and your reality. We exist to make that process simpler, helping you
                understand AI, communicate with it effectively and turning your access into meaningful use.
              </p>
              <a className="btn" href="#why">
                Learn more
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section ref={bowlRef} className="hero-bowl" data-section="Welcome" aria-hidden="true" style={bowlVar}>
        <MarqueeTrack x={x} className="hero-marquee hero-marquee--fill">
          <MarqueeWords />
        </MarqueeTrack>

        <div className="hero-card hero-card--bottom">
          <div className="hero-card__frame">
            <div className="hero-card__shape" />
            <div className="hero-card__photo">
              <motion.img
                {...photo("teamTable")}
                sizes="(max-width: 900px) 96vw, (max-width: 1024px) 88vw, 74vw"
                alt=""
                style={{ y: photoY }}
              />
            </div>
          </div>
        </div>

        <MarqueeTrack x={x} className="hero-marquee hero-marquee--outline">
          <MarqueeWords />
        </MarqueeTrack>

        {/* Outline by erosion: the font's overlapping contours make a text
            stroke draw doubled lines, so trace the merged letter shape instead. */}
        <svg className="hero-marquee__defs" aria-hidden="true" focusable="false">
          <filter id="marquee-outline" x="-2%" y="-10%" width="104%" height="120%">
            <feMorphology in="SourceAlpha" operator="erode" radius="1.1" result="inner" />
            <feComposite in="SourceGraphic" in2="inner" operator="out" />
          </filter>
        </svg>
      </section>
    </>
  );
}
