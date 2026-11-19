import { useId } from "react";
import "./Stars.css";

export function Stars({ value }: { value: number }) {
  const id = useId();
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((n) => {
        const fill = Math.max(0, Math.min(1, value - n));
        return (
          <svg key={n} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={`${id}-${n}`}>
                <stop offset={fill} stopColor="var(--coral)" />
                <stop offset={fill} stopColor="var(--line)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${id}-${n})`}
              d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
            />
          </svg>
        );
      })}
    </span>
  );
}
