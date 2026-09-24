import { motion } from "motion/react";
import "./ui.css";

type Pill = { label: string; color: string; ink?: string; shape?: "round" | "square" };

// A loose stack of labels that drop in with a spring, like the
// "Effective / Sustainable / Efficient / Free" stack on wembi.ai.
export default function StackedPills({ items, className }: { items: Pill[]; className?: string }) {
  return (
    <motion.ul
      className={`pill-stack ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.12 }}
    >
      {items.map((p, i) => {
        const tilt = [-4, 3, -2, 5, -3][i % 5];
        return (
          <motion.li
            key={p.label}
            className={`pill-stack__item pill-stack__item--${p.shape ?? (i % 2 ? "square" : "round")}`}
            style={{ background: p.color, color: p.ink ?? "var(--night)" }}
            variants={{
              hidden: { y: -120, opacity: 0, rotate: tilt * 3 },
              show: {
                y: 0,
                opacity: 1,
                rotate: tilt / 2,
                transition: { type: "spring", stiffness: 260, damping: 16 },
              },
            }}
            whileHover={{ rotate: 0, scale: 1.04 }}
          >
            {p.label}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
