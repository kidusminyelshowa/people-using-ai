import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";

// Until launch, every URL shows the launching-soon page.
// Set VITE_COMING_SOON=false to open the full site.
const comingSoonOnly = import.meta.env.VITE_COMING_SOON !== "false";

const titles: Record<string, string> = {
  "/": "People Using AI",
  "/about": "About — People Using AI",
  "/community": "Community — People Using AI",
  "/work/sierra-premium-breweries": "Sierra Premium Breweries — People Using AI",
};

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    document.title = titles[pathname] ?? "People Using AI";
  }, [pathname]);

  // On a new page, wait for the old one to leave; then jump to the top, or
  // glide to the #hash once the new page has rendered it.
  const prevPath = useRef(pathname);
  useEffect(() => {
    const changedPage = prevPath.current !== pathname;
    prevPath.current = pathname;
    let tries = 0;
    let id = 0;
    const go = () => {
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (hash && !target && tries++ < 30) {
        id = window.setTimeout(go, 50);
        return;
      }
      if (lenis) lenis.scrollTo(target ?? 0, { immediate: !target || changedPage, offset: -72, force: true });
      else if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    };
    id = window.setTimeout(go, changedPage ? 360 : 0);
    return () => window.clearTimeout(id);
  }, [pathname, hash, lenis]);

  return null;
}

export default function App() {
  const location = useLocation();
  const reduce = useReducedMotion();

  // The launching-soon page stands alone: no site navigation around it.
  if (comingSoonOnly || location.pathname === "/coming-soon") {
    return (
      <MotionConfig reducedMotion="user">
        <ComingSoon />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: reduce ? 1 : 0.1, smoothWheel: !reduce }} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            {/* Old addresses */}
            <Route path="/work-with-us" element={<Navigate to="/#what-we-do" replace />} />
            <Route path="/get-involved" element={<Navigate to="/community" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </PageTransition>
      </AnimatePresence>
    </MotionConfig>
  );
}
