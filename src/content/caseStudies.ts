// Case studies. Each one renders at /work/<slug> with the same layout:
// a top block (client logo + challenge, deliverable and outcome),
// then a photo gallery with a partnership and rating band.
// A study with `published: false` is listed on the home page without a link.

export type CaseStudy = {
  slug: string;
  client: string;
  kind: string; // shown under the client's name on the home page
  published: boolean;
  backTo?: { label: string; to: string };
  // Path to the client's logo (e.g. /logos/sierra.svg). Without one the
  // client's name is set as a wordmark instead.
  logo?: string;
  // Shown top to bottom beside the logo.
  timeline?: { label: string; text: string; by?: string }[];
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
    logo: "/logos/sierra.webp",
    timeline: [
      {
        label: "Challenge",
        text: "Sierra’s back-office team had access to AI but used it rarely, or only for simple tasks.",
      },
      {
        label: "Deliverable",
        text: "A gap assessment for every participant, then a custom curriculum delivered in person to 14 back-office staff over two half-day sessions, using Claude Team.",
      },
      {
        label: "Outcome",
        text: "“I’ve done Jan 2025 to June 2026 audit prep and financials prep in 4 hours with Claude. Would have taken me days.”",
        by: "Sierra Breweries Finance Team",
      },
    ],
    photos: {
      top: ["sierra-workshop-01", "sierra-workshop-02", "sierra-workshop-03"],
      bottom: ["sierra-workshop-04", "sierra-workshop-05", "sierra-workshop-06", "sierra-workshop-07", "sierra-workshop-08",
        "sierra-workshop-09", "sierra-workshop-10", "sierra-workshop-11", "sierra-workshop-12", "sierra-workshop-13",
        "sierra-workshop-14", "sierra-workshop-15", "sierra-workshop-16", "sierra-workshop-17", "sierra-workshop-18",
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
