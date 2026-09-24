import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// True while the site footer is on screen, so floating UI can step aside.
export function useFooterInView() {
  const { pathname } = useLocation();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setInView(false);
    let io: IntersectionObserver | undefined;
    const id = window.setTimeout(() => {
      const footer = document.querySelector(".footer");
      if (!footer) return;
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
      io.observe(footer);
    }, 900);
    return () => {
      window.clearTimeout(id);
      io?.disconnect();
    };
  }, [pathname]);

  return inView;
}
