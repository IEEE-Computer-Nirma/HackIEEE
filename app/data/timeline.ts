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
    date: "November 15, 2026",
    start: "2026-11-15",
    end: "2026-11-15",
    title: "Registrations Open",
    description: "Sign up and form your team of up to 4 members.",
    phase: "Phase 0",
    icon: "register",
  },
  {
    date: "December 20, 2026",
    start: "2026-12-20",
    end: "2026-12-20",
    title: "Confirmations and Track Declaration",
    description: "Selected teams are confirmed and the tracks are declared.",
    phase: "Phase 1",
    icon: "idea",
  },
  {
    date: "January 2–4, 2027",
    start: "2027-01-02",
    end: "2027-01-04",
    title: "Event",
    description: "Three days of hackieee: January 2, 3 and 4.",
    phase: "Phase 2",
    icon: "code",
  },
];

export const CONTACT_EMAIL = "deep@computer.org";
