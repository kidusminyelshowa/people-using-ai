// External destinations and site navigation.
const contactEmail = "hello@peopleusingai.org";

export const links = {
  contactEmail,
  // "Work with us", "Bring AI learning to your team", "Talk to us".
  // Swap for a booking link (e.g. Calendly) when there is one.
  workWithUs: `mailto:${contactEmail}?subject=${encodeURIComponent("Working with PUAI")}`,
  partner: `mailto:${contactEmail}?subject=${encodeURIComponent("Research partnership")}`,
  linkedin: "https://www.linkedin.com/company/people-using-ai-org/about/",
  instagram: "https://www.instagram.com/peopleusingai?exln=N2o4Y2hmM2VpcnIx&utm_source=qr",
};

// Header navigation, in the order of the copy.
export const mainNav = [
  { to: "/#why-we-exist", label: "Why we exist" },
  { to: "/#our-approach", label: "Our approach" },
  { to: "/#what-we-do", label: "What we do" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
] as const;

export const footerNav = [
  { to: "/", label: "Home" },
  { to: "/#our-approach", label: "Our approach" },
  { to: "/#what-we-do", label: "What we do" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
] as const;
