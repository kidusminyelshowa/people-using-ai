// Case studies. Text in [square brackets] is a placeholder from the copy
// deck: replace it with the real numbers, quotes and photos before launch.
// A study with `published: false` is listed on the home page without a link.

export type CaseStudy = {
  slug: string;
  client: string;
  kind: string; // shown under the client's name on the home page
  published: boolean;
  backTo?: { label: string; to: string };
  eyebrow?: string;
  summary?: string;
  stats?: { value: string; label: string }[];
  heroPhoto?: string;
  challenge?: { lead: string; context: string };
  gaps?: {
    intro: string;
    note: string;
    // before/after scores in %, used for the bar lengths
    skills: { label: string; before: number; after: number; beforeText: string; afterText: string }[];
  };
  training?: {
    intro: string;
    sessions: { label: string; title: string; topics: string[] }[];
    photos: string[];
  };
  results?: { value: string; label: string }[];
  quote?: { text: string; by: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "sierra-premium-breweries",
    client: "Sierra Premium Breweries",
    kind: "Employee training",
    published: true,
    backTo: { label: "Workforce Upskilling", to: "/#what-we-do" },
    eyebrow: "Case study · Employee training",
    summary: "[ONE-LINE SUMMARY: what Sierra’s back-office team can do now that they couldn’t before.]",
    stats: [
      { value: "14", label: "back-office staff trained" },
      { value: "2", label: "half-day sessions" },
      { value: "[X]", label: "skill gaps identified" },
      { value: "[X]%", label: "[RESULT, e.g. said they now use AI weekly]" },
    ],
    heroPhoto: "[PHOTO: training session at Sierra]",
    challenge: {
      lead: "[What Sierra wanted: e.g. the back-office team had access to AI but used it rarely or only for simple tasks.]",
      context:
        "[Context: team size, departments, and any limits, e.g. company rules on which tools and connections staff can use.]",
    },
    gaps: {
      intro:
        "Before training, we ran a gap assessment with every participant using our AISA framework. [One line on the biggest finding.]",
      note: "[Bar lengths are placeholders. Replace with your assessment scores.]",
      skills: [
        { label: "Read: understanding AI and its limits", before: 34, after: 72, beforeText: "[XX]%", afterText: "[XX]%" },
        { label: "Write: giving clear direction and context", before: 28, after: 70, beforeText: "[XX]%", afterText: "[XX]%" },
        { label: "Speak: refining through conversation", before: 22, after: 64, beforeText: "[XX]%", afterText: "[XX]%" },
        { label: "Listen: checking what comes back", before: 30, after: 74, beforeText: "[XX]%", afterText: "[XX]%" },
      ],
    },
    training: {
      intro:
        "We built a custom curriculum from the gaps and delivered it in person over two half-day sessions, using Claude Team.",
      sessions: [
        { label: "Session 1 · Half day", title: "[SESSION TITLE]", topics: ["[Topic or exercise]", "[Topic or exercise]", "[Topic or exercise]"] },
        { label: "Session 2 · Half day", title: "[SESSION TITLE]", topics: ["[Topic or exercise]", "[Topic or exercise]", "[Topic or exercise]"] },
      ],
      photos: ["[PHOTO: participants at work]", "[PHOTO: workshop exercise]", "[PHOTO: group or certificates]"],
    },
    results: [
      { value: "[XX]%", label: "[e.g. rated the training useful for their daily work]" },
      { value: "[X] hrs", label: "[e.g. saved per person each week]" },
      { value: "[X]", label: "[e.g. tasks the team now handles with AI]" },
    ],
    quote: { text: "[Quote from a participant or manager at Sierra.]", by: "[Name], [Role], Sierra Premium Breweries" },
  },
  {
    slug: "influencers-and-content-creators",
    client: "Influencers & content creators",
    kind: "Workshop",
    published: false, // no case study copy yet
  },
];
