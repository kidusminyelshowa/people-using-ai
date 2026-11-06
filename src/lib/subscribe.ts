// Adds an email to the launch waitlist: a Google Sheet, through the Apps
// Script web app in scripts/waitlist-apps-script.gs. Set VITE_WAITLIST_URL
// to that web app's /exec URL.
const endpoint = import.meta.env.VITE_WAITLIST_URL as string | undefined;

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribe(email: string, source = "coming-soon"): Promise<void> {
  if (!endpoint) throw new Error("The waitlist isn't connected yet.");
  // Sent as text/plain so the browser doesn't need a CORS preflight,
  // which Apps Script can't answer.
  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), source }),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!res.ok || !data?.ok) throw new Error("Something went wrong. Please try again.");
}
