import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "../components/motion";
import Marquee from "../components/ui/Marquee";
import { photo, type PhotoName } from "../content/images";
import { EMAIL, subscribe } from "../lib/subscribe";
import "./Community.css";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name", required: false },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", required: false },
] as const;

// Everyday life: parenting, education, art and creativity.
const everyday: PhotoName[] = ["clay", "scooter", "headphones", "conversation", "scissors", "glassSmile"];

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

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease },
  });

  return (
    <main id="main" className="community">
      <div className="container community__grid">
        <div className="community__copy">
          <motion.h1 className="h1 community__title" {...enter(0.1)}>
            Be early to know about our upcoming events.
          </motion.h1>
          <motion.p className="lede community__body" {...enter(0.3)}>
            AI is moving beyond the workplace into everyday life, from parenting and education to art and creativity. We
            serve as a space for those conversations and learnings.
          </motion.p>
        </div>

        <motion.div className="join" {...enter(0.45)}>
          <AnimatePresence mode="wait" initial={false}>
            {state.kind === "done" ? (
              <motion.div
                key="done"
                className="join__done"
                role="status"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
              >
                <span className="join__tick" aria-hidden="true">
                  ✓
                </span>
                <h2 className="h3">You’re on the list.</h2>
                <p className="muted">We’ll be in touch about upcoming events.</p>
              </motion.div>
            ) : (
              <motion.form key="form" className="join__form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }}>
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

      <motion.div className="community__strip" {...enter(0.7)}>
        <Marquee speed={1.5}>
          {everyday.map((name) => (
            <img key={name} {...photo(name)} sizes="360px" alt="" loading="lazy" className="community__photo" />
          ))}
        </Marquee>
      </motion.div>
    </main>
  );
}
