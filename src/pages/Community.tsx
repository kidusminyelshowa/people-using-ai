import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplitHeading, ease } from "../components/motion";
import { EMAIL, subscribe } from "../lib/subscribe";
import "./Community.css";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name", required: false },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", required: false },
] as const;

export default function Community() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("company")) return setState({ kind: "done" }); // bots fill the hidden field
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("name")) return setState({ kind: "error", message: "Please tell us your name." });
    if (!EMAIL.test(get("email"))) return setState({ kind: "error", message: "Please enter a valid email address." });
    setState({ kind: "sending" });
    try {
      await subscribe(get("email"), "community", { name: get("name"), country: get("country"), phone: get("phone") });
      setState({ kind: "done" });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <main id="main" className="community">
      <div className="container community__grid">
        <div className="community__copy">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Community &amp; storytelling
          </motion.span>
          <SplitHeading
            as="h1"
            onMount
            delay={0.15}
            className="display community__title"
            segments={["Be early to know about our", { text: "upcoming events.", className: "accent" }]}
          />
          <motion.p
            className="body-lg community__body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
          >
            AI is moving beyond the workplace into everyday life, from parenting and education to art and creativity. We
            serve as a space for those conversations and learnings.
          </motion.p>
        </div>

        <motion.div
          className="join"
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state.kind === "done" ? (
              <motion.div
                key="done"
                className="join__done"
                role="status"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <span className="join__tick" aria-hidden="true">
                  ✓
                </span>
                <h2 className="h3">You’re on the list.</h2>
                <p>We’ll be in touch about upcoming events.</p>
              </motion.div>
            ) : (
              <motion.form key="form" className="join__form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -16 }}>
                <h2 className="h3">Join the community</h2>
                {fields.map((f) => (
                  <label key={f.name} className="field">
                    <span className="field__label">{f.label}</span>
                    <input
                      className="field__input"
                      name={f.name}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      required={f.required}
                    />
                  </label>
                ))}
                <input className="visually-hidden" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button className="btn btn--lg join__submit" type="submit" disabled={state.kind === "sending"}>
                  {state.kind === "sending" ? "Registering…" : "Register"}
                </button>
                {state.kind === "error" && (
                  <p className="join__error" role="alert">
                    {state.message}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
