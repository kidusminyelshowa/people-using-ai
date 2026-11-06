// External destinations. Replace the "#" placeholders with real URLs.
export const links = {
  bookConversation: "#", // TODO: booking / Calendly link
  caseStudy: "#", // TODO: case study page or PDF
  masterclassRegister: "#", // TODO: registration form
  survey: "#", // TODO: survey form
  linkedin: "https://www.linkedin.com/company/people-using-ai-org/about/",
  instagram: "https://www.instagram.com/peopleusingai?exln=N2o4Y2hmM2VpcnIx&utm_source=qr",
  substack: "#", // TODO
};

export const masterclassDate = new Date("2026-11-21T09:00:00+03:00"); // Nairobi (EAT)

export const nav = [
  { to: "/", label: "Home" },
  { to: "/work-with-us", label: "Work with us" },
  { to: "/about", label: "About us" },
  { to: "/get-involved", label: "Get involved" },
] as const;
