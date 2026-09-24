import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./ui.css";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    mins: Math.floor(ms / 60_000) % 60,
    secs: Math.floor(ms / 1000) % 60,
  };
}

export default function Countdown({ to }: { to: Date }) {
  const [t, setT] = useState(() => diff(to));
  useEffect(() => {
    const id = window.setInterval(() => setT(diff(to)), 1000);
    return () => window.clearInterval(id);
  }, [to]);

  const units: [string, number][] = [
    ["days", t.days],
    ["hrs", t.hours],
    ["min", t.mins],
    ["sec", t.secs],
  ];

  return (
    <div className="countdown" role="timer" aria-label={`${t.days} days to go`}>
      {units.map(([label, value]) => (
        <div className="countdown__unit" key={label}>
          <span className="countdown__value">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={value}
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {String(value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
