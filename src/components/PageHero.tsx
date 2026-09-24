import type { ReactNode } from "react";
import { motion } from "motion/react";
import ParallaxImage from "./ui/ParallaxImage";
import { coverSizes, type PhotoName } from "../content/images";
import "./PageHero.css";

type Props = {
  title: string;
  image: PhotoName;
  imageAlt: string;
  position?: string;
  children?: ReactNode;
  accent?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageHero({ title, image, imageAlt, position, children, accent = "var(--coral)" }: Props) {
  return (
    <header className="page-hero panel" data-section={title} style={{ ["--accent" as string]: accent }}>
      <ParallaxImage name={image} alt={imageAlt} className="page-hero__img" strength={10} position={position} sizes={coverSizes} eager />
      <div className="page-hero__shade" />
      <div className="page-hero__content">
        <h1 className="page-hero__title">
          {title.split(" ").map((word, i) => (
            <span className="page-hero__mask" key={i}>
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.6 + i * 0.08 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        {children && (
          <motion.div
            className="page-hero__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
