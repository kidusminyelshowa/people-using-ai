import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { photo, type PhotoName } from "../../content/images";
import "./ui.css";

type Props = {
  name: PhotoName;
  alt: string;
  className?: string;
  sizes?: string;
  /** How far (in %) the image drifts across the scroll. */
  strength?: number;
  position?: string;
  eager?: boolean;
};

export default function ParallaxImage({
  name,
  alt,
  className,
  sizes = "100vw",
  strength = 12,
  position = "center",
  eager,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`parallax ${className ?? ""}`}>
      <motion.img
        {...photo(name)}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ y, scale: 1 + (strength * 2.2) / 100, objectPosition: position }}
      />
    </div>
  );
}
