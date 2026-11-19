// Case studies. Each one renders at /work/<slug> with the same layout:
// a solid-colour top block (client logo + challenge, deliverable and outcome),
// then a photo gallery with a partnership and rating band.
// A study with `published: false` is listed on the home page without a link.

export type CaseStudy = {
  slug: string;
  client: string;
  kind: string; // shown under the client's name on the home page
  published: boolean;
  backTo?: { label: string; to: string };
  // The client's brand colour for the top block, and the colour of the
  // logo and text on it. Defaults to yellow with night text.
  theme?: { bg: string; fg: string };
  // Path to the client's logo: a one-colour SVG with no background, drawn
  // in theme.fg, e.g. /logos/sierra.svg. Without one the client's name is
  // set as a wordmark instead.
  logo?: string;
  // Shown top to bottom beside the logo. `items` renders as a list.
  timeline?: { label: string; text?: string; items?: string[]; by?: string }[];
  // Photo slugs from public/images (see src/content/image-manifest.json).
  photos?: { top: string[]; bottom: string[] };
  partners?: string[];
  rating?: number;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "sierra-premium-breweries",
    client: "Sierra Premium Breweries",
    kind: "Employee training",
    published: true,
    backTo: { label: "Workforce Upskilling", to: "/#training" },
    // Sierra's label green, sampled from their logo.
    theme: { bg: "#18401b", fg: "#f2efd9" },
    logo: "/logos/sierra.svg",
    timeline: [
      {
        label: "Challenge",
        text: "Sierra Breweries' staff were already using AI, but mostly for individual tasks, with limited business impact. Without shared tools, training, or guidelines, AI use was fragmented, output quality varied, and some workflows created more work for others. Staff also lacked clarity on which tasks were best suited for AI.",
      },
      {
        label: "What we delivered",
        items: [
          "Gap assessments for 14 back-office staff to identify skills gaps and AI opportunities.",
          "A tailored curriculum based on individual needs and real workplace challenges.",
          "Claude Team setup to bring AI use onto one shared platform.",
          "Two half-day training sessions combining AI fundamentals with hands-on practice.",
          "Technical support and live demos using participants' own business challenges.",
          "A trial phase to evaluate performance on the new platform.",
        ],
      },
      {
        label: "Outcome",
        text: "“I’ve done Jan 2025 to June 2026 audit prep and financials prep in 4 hours with Claude. Would have taken me days.”",
        by: "Sierra Breweries Finance Team",
      },
    ],
    // Balanced between both facilitators.
    photos: {
      top: ["sierra-workshop-19", "sierra-workshop-01", "sierra-workshop-20"],
      bottom: [
        "sierra-workshop-04", "sierra-workshop-21", "sierra-workshop-06", "sierra-workshop-07", "sierra-workshop-08",
        "sierra-workshop-09", "sierra-workshop-11", "sierra-workshop-02", "sierra-workshop-23", "sierra-workshop-03",
        "sierra-workshop-22", "sierra-workshop-12", "sierra-workshop-13", "sierra-workshop-24", "sierra-workshop-18",
      ],
    },
    partners: ["OpenAI Community Nairobi", "Claude Community Nairobi"],
    rating: 4.5,
  },
  {
    slug: "influencers-and-content-creators",
    client: "Influencers & content creators",
    kind: "Workshop",
    published: false, // no case study copy yet
  },
];
