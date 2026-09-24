import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import SectionIndicator from "./components/SectionIndicator";
import QuickNav from "./components/QuickNav";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import WorkWithUs from "./pages/WorkWithUs";
import About from "./pages/About";
import GetInvolved from "./pages/GetInvolved";
import NotFound from "./pages/NotFound";

const titles: Record<string, string> = {
  "/": "People using ai — Communication is how you make AI useful",
  "/work-with-us": "Work with us — People using ai",
  "/about": "About us — People using ai",
  "/get-involved": "Get involved — People using ai",
};

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    document.title = titles[pathname] ?? "People using ai";
  }, [pathname]);

  // Wait for the exit transition, then jump to the top (or to the #hash).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (lenis) lenis.scrollTo(target ?? 0, { immediate: !target, offset: -24, force: true });
      else if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    }, 50);
    return () => window.clearTimeout(id);
  }, [pathname, hash, lenis]);

  return null;
}

export default function App() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: reduce ? 1 : 0.1, smoothWheel: !reduce }} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <SectionIndicator />
      <QuickNav />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work-with-us" element={<WorkWithUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </MotionConfig>
  );
}
