// External destinations and site navigation.
const contactEmail = "hello@peopleusingai.org";

export const links = {
  contactEmail,
  // "Work with us", "Bring AI learning to your team", "Talk to us".
  // Swap for a booking link (e.g. Calendly) when there is one.
  workWithUs: `mailto:rahwameskel65@gmail.com?subject=${encodeURIComponent("Working with PUAI")}`,
  // Registration for the upcoming workshop (Google Form).
  workshopForm: "https://docs.google.com/forms/d/e/1FAIpQLSd_yeLwviuTi01ZOM89pZ-9nUtjDZQMDQaMj7qaLr97ujMoUQ/viewform?usp=header",
  partner: `mailto:${contactEmail}?subject=${encodeURIComponent("Research partnership")}`,
  // Footer "Contact us": opens a WhatsApp chat with each number.
  whatsapp: ["+254 114 697 922", "+254 796 353 455"],
  linkedin: "https://www.linkedin.com/company/people-using-ai-org/about/",
  instagram: "https://www.instagram.com/peopleusingai?exln=N2o4Y2hmM2VpcnIx&utm_source=qr",
};

// Header navigation: the three ways to work with us, on the home page.
export const mainNav = [
  { to: "/#training", label: "Training" },
  { to: "/#research", label: "Research" },
  { to: "/#community", label: "Community" },
] as const;
