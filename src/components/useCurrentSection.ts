import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Label of the [data-section="…"] element crossing the middle of the viewport.
export function useCurrentSection() {
  const { pathname } = useLocation();
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(null);
    let io: IntersectionObserver | undefined;
    // Give the incoming page time to mount after the route transition.
    const id = window.setTimeout(() => {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setLabel(e.target.getAttribute("data-section"));
        },
        { rootMargin: "-50% 0px -50% 0px" }
      );
      document.querySelectorAll("[data-section]").forEach((el) => io!.observe(el));
    }, 900);
    return () => {
      window.clearTimeout(id);
      io?.disconnect();
    };
  }, [pathname]);

  return label;
}
