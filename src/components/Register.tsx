import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { EMAIL, subscribe } from "../lib/subscribe";
import { ease } from "./motion";
import "./Register.css";

// One registration form for the workshop, the research and the community.
// Anything on the page can open it with useRegister()("workshop").

export type Topic = "workshop" | "research" | "community";

export const workshop = {
  title: "Marketing Professionals & Content Creators",
  meta: "November 28 | Nairobi | Full-day workshop",
};

const topics: Record<Topic, { title: string; sub?: string; source: string }> = {
  workshop: { title: "Register for the workshop", sub: `${workshop.title} · ${workshop.meta}`, source: "workshop" },
  research: { title: "Be part of the research", source: "research" },
  community: { title: "Join our community", source: "community" },
};

const fields = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "phone", label: "Phone number (with country code)", type: "tel", autoComplete: "tel" },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

const Ctx = createContext<(t: Topic) => void>(() => {});
export const useRegister = () => useContext(Ctx);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const lenis = useLenis();
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((t: Topic) => {
    opener.current = document.activeElement as HTMLElement | null;
    setState({ kind: "idle" });
    setTopic(t);
  }, []);
  const close = useCallback(() => {
    setTopic(null);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!topic) return;
    lenis?.stop();
    document.documentElement.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [topic, lenis, close]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!topic) return;
    const data = new FormData(e.currentTarget);
    if (data.get("puai_check")) return setState({ kind: "done" }); // bots fill the hidden field
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("name")) return setState({ kind: "error", message: "Please tell us your full name." });
    if (!get("phone")) return setState({ kind: "error", message: "Please add a phone number with its country code." });
    if (!get("country")) return setState({ kind: "error", message: "Please tell us your country." });
    if (!EMAIL.test(get("email"))) return setState({ kind: "error", message: "Please enter a valid email address." });
    setState({ kind: "sending" });
    try {
      await subscribe(get("email"), topics[topic].source, { name: get("name"), country: get("country"), phone: get("phone") });
      setState({ kind: "done" });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  const t = topic ? topics[topic] : null;

  return (
    <Ctx.Provider value={open}>
      {children}
      <AnimatePresence>
        {t && (
          <motion.div
            className="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            onClick={close}
          >
            <motion.div
              className="register__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="register-title"
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
            >
              <button type="button" className="register__close" aria-label="Close" onClick={close}>
                <span />
                <span />
              </button>
              {state.kind === "done" ? (
                <div className="register__done" role="status">
                  <span className="register__tick" aria-hidden="true">
                    ✓
                  </span>
                  <h2 className="h3">You’re registered.</h2>
                  <p className="muted">We’ll be in touch with the details soon.</p>
                  <button type="button" className="btn" onClick={close}>
                    Done
                  </button>
                </div>
              ) : (
                <form className="register__form" onSubmit={onSubmit} noValidate>
                  <div className="register__head">
                    <h2 id="register-title" className="h3">
                      {t.title}
                    </h2>
                    {t.sub && <p className="muted">{t.sub}</p>}
                  </div>
                  {fields.map((f, i) => (
                    <label key={f.name} className="field">
                      <span className="field__label">{f.label}</span>
                      <input
                        className="field__input"
                        name={f.name}
                        type={f.type}
                        autoComplete={f.autoComplete}
                        required
                        autoFocus={i === 0}
                      />
                    </label>
                  ))}
                  <input className="visually-hidden" type="text" name="puai_check" tabIndex={-1} autoComplete="one-time-code" aria-hidden="true" />
                  <button className="btn btn--lg register__submit" type="submit" disabled={state.kind === "sending"}>
                    {state.kind === "sending" ? "Registering…" : "Register"}
                  </button>
                  {state.kind === "error" && (
                    <p className="register__error" role="alert">
                      {state.message}
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
