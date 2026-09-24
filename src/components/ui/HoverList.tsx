import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { photo, type PhotoName } from "../../content/images";
import "./ui.css";

export type HoverItem = {
  title: string;
  body?: ReactNode;
  image: PhotoName;
  to?: string;
  tag?: string;
};

// Big rows; hovering one floats its photo beside the cursor.
export default function HoverList({ items }: { items: HoverItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26 });
  const sy = useSpring(y, { stiffness: 220, damping: 26 });

  return (
    <div
      className="hover-list"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onMouseLeave={() => setActive(null)}
    >
      <ol className="hover-list__rows">
        {items.map((item, i) => {
          const inner = (
            <>
              <span className="hover-list__num serif">0{i + 1}</span>
              <span className="hover-list__title">{item.title}</span>
              {item.body && <span className="hover-list__body">{item.body}</span>}
              {item.to && (
                <span className="hover-list__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </>
          );
          return (
            <motion.li
              key={item.title}
              className={`hover-list__row${active === i ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.to ? (
                <Link to={item.to} className="hover-list__link">
                  {inner}
                </Link>
              ) : (
                <div className="hover-list__link">{inner}</div>
              )}
              {/* Touch screens get the photo inline instead of the cursor float. */}
              <img className="hover-list__inline" {...photo(item.image)} sizes="(max-width: 640px) 92vw, 46vw" alt="" loading="lazy" />
            </motion.li>
          );
        })}
      </ol>

      <motion.div className="hover-list__float" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {active !== null && (
            <motion.img
              key={active}
              {...photo(items[active].image)}
              sizes="700px"
              alt=""
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: active % 2 ? 4 : -4 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
