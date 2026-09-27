/* Single source of truth for event dates — used by the Timeline section and
   the "Add to calendar" bell. `start`/`end` are ISO dates; `end` is inclusive. */

export type TimelineEvent = {
  date: string;
  start: string;
  end: string;
  title: string;
  description: string;
  phase: string;
  icon: "register" | "closed" | "idea" | "code" | "trophy";
};

export const timelineEvents: TimelineEvent[] = [
  {
    date: "October 20, 2026",
    start: "2026-10-20",
    end: "2026-10-20",
    title: "Registration Opens",
    description: "Sign up and form your team of up to 4 members.",
    phase: "Phase 0",
    icon: "register",
  },
  {
    date: "November 28, 2026",
    start: "2026-11-28",
    end: "2026-11-28",
    title: "Registration Closes",
    description: "Last day to register. Late entries will not be accepted.",
    phase: "Phase 0",
    icon: "closed",
  },
  {
    date: "December 20–25, 2026",
    start: "2026-12-20",
    end: "2026-12-25",
    title: "Idea Submission + Quiz / CTF",
    description:
      "Submit your project proposal along with participation in the preliminary Quiz / CTF challenges.",
    phase: "Phase 1",
    icon: "idea",
  },
  {
    date: "January 2–3, 2027",
    start: "2027-01-02",
    end: "2027-01-03",
    title: "Hackathon",
    description:
      "Intense coding and product building phase with mentor support and technical checkpoints.",
    phase: "Phase 2",
    icon: "code",
  },
  {
    date: "January 4, 2027",
    start: "2027-01-04",
    end: "2027-01-04",
    title: "Results & Award Ceremony",
    description:
      "Project presentations, judge evaluations, winner announcements, and prize distributions.",
    phase: "Finale",
    icon: "trophy",
  },
];

export const CONTACT_EMAIL = "deep@computer.org";
