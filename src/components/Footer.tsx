import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { EMAIL, subscribe } from "../lib/subscribe";
import { iconCoral } from "../content/brand";
import { links } from "../content/links";
import { useLenis } from "lenis/react";
import { Reveal } from "./motion";
import "./Footer.css";

type Action = { label: string; to?: string; href?: string; onClick?: () => void };

/** The page's one coral band: a closing line or two and a single button. */
export function CtaBand({ lines, action }: { lines: string[]; action: Action }) {
  const inner = (
    <>
      {action.label} <span className="btn__arrow">→</span>
    </>
  );
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <Reveal as="h2" className="display cta-band__title">
          {lines.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </Reveal>
        <Reveal delay={0.15}>
          {action.onClick ? (
            <button type="button" className="btn btn--white btn--lg" onClick={action.onClick}>
              {inner}
            </button>
          ) : action.to ? (
            <Link className="btn btn--white btn--lg" to={action.to}>
              {inner}
            </Link>
          ) : (
            <a
              className="btn btn--white btn--lg"
              href={action.href}
              {...(action.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {inner}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

const groups = [
  [
    { to: "/#training", label: "Training" },
    { to: "/#research", label: "Research" },
    { to: "/#community", label: "Community" },
  ],
];

type SendState = { kind: "idle" | "sending" | "done" } | { kind: "error"; message: string };

function ContactForm() {
  const [state, setState] = useState<SendState>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("puai_check")) return setState({ kind: "done" }); // bots fill the hidden field
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("name")) return setState({ kind: "error", message: "Please tell us your name." });
    if (!EMAIL.test(get("email"))) return setState({ kind: "error", message: "Please enter a valid email address." });
    if (!get("message")) return setState({ kind: "error", message: "Please write a message." });
    setState({ kind: "sending" });
    try {
      await subscribe(get("email"), "contact", { name: get("name"), message: get("message") });
      form.reset();
      setState({ kind: "done" });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  if (state.kind === "done")
    return (
      <p className="footer__sent" role="status">
        Thanks, your message is on its way. We’ll get back to you soon.
      </p>
    );

  return (
    <form className="footer__form" onSubmit={onSubmit} noValidate>
      <label className="field">
        <span className="field__label">Name</span>
        <input className="field__input" name="name" type="text" autoComplete="name" required />
      </label>
      <label className="field">
        <span className="field__label">Email</span>
        <input className="field__input" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field footer__wide">
        <span className="field__label">Message</span>
        <textarea className="field__input footer__message" name="message" rows={4} required />
      </label>
      <input className="visually-hidden" type="text" name="puai_check" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.kind === "error" && (
        <p className="footer__error footer__wide" role="alert">
          {state.message}
        </p>
      )}
      <button className="btn footer__wide" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending…" : "Send"} <span className="btn__arrow">→</span>
      </button>
    </form>
  );
}

export default function Footer() {
  const lenis = useLenis();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" aria-label="People Using AI, home">
              <img src={iconCoral} alt="" width={56} height={56} />
            </Link>
            <h2 className="footer__email">Contact us</h2>
            <ContactForm />
            <p className="footer__place">Nairobi, Kenya</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {groups.map((g, i) => (
              <ul key={i}>
                {g.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            ))}
            <ul>
              <li>
                <a href={links.workWithUs}>Work with us</a>
              </li>
              <li>
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} PUAI</p>
          <button
            type="button"
            className="footer__top-link"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
