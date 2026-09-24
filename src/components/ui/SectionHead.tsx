import { motion } from "motion/react";
import "./ui.css";

type Props = { label: string; tone?: "dark" | "light" };

// Section label over a rule that draws in as it scrolls into view.
export default function SectionHead({ label, tone = "dark" }: Props) {
  return (
    <div className={`section-head section-head--${tone}`}>
      <span className="section-head__label">{label}</span>
      <motion.div
        className="section-head__rule"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
