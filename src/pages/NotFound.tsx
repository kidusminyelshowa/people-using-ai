import { Link } from "react-router-dom";
import { iconCoral as icon } from "../content/brand";

export default function NotFound() {
  return (
    <main
      id="main"
      className="container"
      style={{ minHeight: "80svh", display: "grid", placeContent: "center", justifyItems: "center", gap: 28, textAlign: "center" }}
    >
      <img src={icon} alt="" width={88} style={{ borderRadius: 20 }} />
      <h1 className="h2">This page wandered off.</h1>
      <Link className="btn btn--lg" to="/">
        Back home <span className="btn__arrow">→</span>
      </Link>
    </main>
  );
}
