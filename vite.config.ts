import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // VERCEL_ENV ("production" | "preview" | "development") is set by Vercel at
  // build time; exposing it lets preview deployments skip the coming-soon gate.
  envPrefix: ["VITE_", "VERCEL_ENV"],
});
