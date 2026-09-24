import { Link } from "react-router-dom";
import { iconCoral as icon } from "../content/brand";

export default function NotFound() {
  return (
    <main
      id="main"
      className="container"
      style={{ minHeight: "100svh", display: "grid", placeContent: "center", justifyItems: "center", gap: 24, textAlign: "center" }}
    >
      <img src={icon} alt="" width={120} />
      <h1 className="display">This page wandered off.</h1>
      <Link className="btn btn--lg" to="/">
        Back home <span className="btn__arrow">→</span>
      </Link>
    </main>
  );
}
