"use client";

import { useState, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Code2,
} from "lucide-react";
import HorizonBloom, { type HorizonBloomHandle } from "./HorizonBloom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface MilestonePhase {
  id: string;
  phaseLabel: string;
  title: string;
  dateDisplay: string;
  monthIndex: number; // 10 = Nov, 11 = Dec, 0 = Jan
  year: number;
  highlightDays: number[];
  status: "UPCOMING" | "SELECTION" | "FINALE";
  headline: string;
  description: string;
  location: string;
  keyDetails: { label: string; value: string }[];
  scheduleHighlights: { time: string; title: string; desc: string }[];
  googleDates: string; // YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ
}

const MILESTONES: MilestonePhase[] = [
  {
    id: "phase-0",
    phaseLabel: "Phase 0",
    title: "Registrations Open",
    dateDisplay: "November 15, 2026",
    monthIndex: 10,
    year: 2026,
    highlightDays: [15],
    status: "UPCOMING",
    headline: "Registration Portal Live & Team Formation",
    description:
      "Form your fellowship of up to 4 builders. Brainstorm initial project concepts, explore the Dune problem statements, and submit your team's application.",
    location: "Online Portal (Global)",
    keyDetails: [
      { label: "Team Size", value: "1 – 4 Builders" },
      { label: "Eligibility", value: "All College Students" },
      { label: "Registration Fee", value: "100% Free" },
      { label: "Submissions", value: "Concept Pitch Deck" },
    ],
    scheduleHighlights: [
      { time: "09:00 AM", title: "Registration Portal Opens", desc: "Online application system goes live globally." },
      { time: "04:00 PM", title: "Problem Statements Teaser", desc: "Overview of themes and industry problem statements." },
      { time: "08:00 PM", title: "Team Mixer & Discord Live", desc: "Find complementary teammates and project partners." },
    ],
    googleDates: "20261115T033000Z/20261115T183000Z",
  },
  {
    id: "phase-1",
    phaseLabel: "Phase 1",
    title: "Confirmations & Track Reveal",
    dateDisplay: "December 20, 2026",
    monthIndex: 11,
    year: 2026,
    highlightDays: [20],
    status: "SELECTION",
    headline: "Team Shortlisting & Track Deep Dives",
    description:
      "Shortlisted teams receive formal invitations and mentor allocations. The comprehensive problem tracks and sponsor challenges are officially declared.",
    location: "Online / Email Confirmation",
    keyDetails: [
      { label: "Shortlisted Teams", value: "Top 80 Teams Selected" },
      { label: "Track Details", value: "5 Focused Dune Challenges" },
      { label: "Mentorship", value: "Direct Industry Mentors" },
      { label: "Preparation", value: "APIs & Dev Kits Released" },
    ],
    scheduleHighlights: [
      { time: "11:00 AM", title: "Shortlist Announcement", desc: "Selected teams receive acceptance letters and onboarding kit." },
      { time: "03:00 PM", title: "Challenge Tracks Unveiling", desc: "Deep dive into sponsor bounties, APIs, and rubric." },
      { time: "06:00 PM", title: "Mentor Office Hours", desc: "Pre-event architecture sync with seasoned engineers." },
    ],
    googleDates: "20261220T053000Z/20261220T143000Z",
  },
  {
    id: "phase-2",
    phaseLabel: "Phase 2",
    title: "The 36h Grand Event",
    dateDisplay: "January 2–4, 2027",
    monthIndex: 0,
    year: 2027,
    highlightDays: [2, 3, 4],
    status: "FINALE",
    headline: "36-Hour National On-Site Hackathon",
    description:
      "Three consecutive days of non-stop hacking, high-stakes sprint reviews, late-night gaming, and final stage project demos in front of a venture jury.",
    location: "Nirma University, Ahmedabad (Offline)",
    keyDetails: [
      { label: "Duration", value: "36 Hours Continuous" },
      { label: "Prize Pool", value: "₹1,50,000+ & Grants" },
      { label: "Hospitality", value: "Meals, Snacks & Resting Lounges" },
      { label: "Judging", value: "Live Demos to VCs & Founders" },
    ],
    scheduleHighlights: [
      { time: "Day 1 (Jan 2) · 10:00 AM", title: "Opening Ceremony & Hack Kickoff", desc: "Keynotes, kit distribution, and coding sprint begins." },
      { time: "Day 2 (Jan 3) · 02:00 PM", title: "Round 1 Mentorship Evaluation", desc: "Mid-way progress checkpoint and architectural critique." },
      { time: "Day 3 (Jan 4) · 04:00 PM", title: "Final Stage Demos & Awards", desc: "Top 10 team presentations, jury deliberation, and trophy ceremony." },
    ],
    googleDates: "20270102T043000Z/20270105T123000Z",
  },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const bloomRef = useRef<HorizonBloomHandle>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const activeMilestone = MILESTONES[activePhaseIndex];

  // Calendar math for the selected milestone's month
  const calendarData = useMemo(() => {
    const { year, monthIndex, highlightDays } = activeMilestone;
    const firstDayIndex = new Date(year, monthIndex, 1).getDay(); // 0 is Sun
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return {
      monthName: MONTH_NAMES[monthIndex],
      year,
      blanks,
      days,
      highlightDays: new Set(highlightDays),
    };
  }, [activeMilestone]);

  // Calendar link builders
  const eventTitle = encodeURIComponent(`hackieee 2026: ${activeMilestone.title}`);
  const eventDetails = encodeURIComponent(
    `${activeMilestone.headline}\n\n${activeMilestone.description}\n\nVenue: ${activeMilestone.location}`
  );
  const eventLocation = encodeURIComponent(activeMilestone.location);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${activeMilestone.googleDates}&details=${eventDetails}&location=${eventLocation}`;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelector(".timeline-hub"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              bloomRef.current?.bloom(0.5, 1.3);
            },
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const handleSelectPhase = (index: number) => {
    setActivePhaseIndex(index);
    // Trigger horizon bloom flare when switching phases
    const normPositions = [0.2, 0.5, 0.8];
    bloomRef.current?.bloom(normPositions[index], 1.1);
  };

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative scroll-mt-4 overflow-hidden px-4 py-24 md:px-8 md:py-36"
    >
      {/* ── EXPANSIVE HORIZON BLOOM STAGE BACKDROP ── */}
      {/* Blends smoothly into the page with top & bottom edge mask */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        <HorizonBloom
          ref={bloomRef}
          colors={["#f8cf96", "#993e0e"]}
          backgroundColor="transparent"
          horizon={0.64}
          curvature={1.12}
          sunPosition={0}
          sunrise={1.22}
          spread={0.48}
          atmosphere={1.3}
          thickness={1.18}
          rim={1.28}
          flare={1.18}
          airglow={0.5}
          clouds={0.65}
          stars={0.85}
          aurora={0.8}
          autoAurora={true}
          speed={0.4}
          drift={0.3}
          parallax={0.5}
          bloom={0.6}
          grain={0.12}
          interactive={true}
          intro={true}
          className="h-full w-full"
        />
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="reveal relative z-10 mx-auto mb-12 max-w-4xl text-center md:mb-16">
        <p className="eyebrow">03 — Timeline</p>
        <h2 className="section-title mt-5">event Timeline</h2>
        <p className="section-lead mt-5 md:mx-auto">
          Key milestones on the long walk from idea to impact.
        </p>
      </div>

      {/* ── TIMELINE STAGE & CALENDAR HUB ── */}
      <div className="timeline-hub relative z-10 mx-auto w-full max-w-6xl">
        {/* 1. HORIZONTAL INTERACTIVE MILESTONE RAIL */}
        <div className="relative mb-10 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative mx-auto flex min-w-[620px] items-center justify-between px-6 sm:px-12 md:max-w-4xl">
            {/* Glowing spine rail behind milestone buttons */}
            <div
              className="absolute left-10 right-10 top-1/2 h-[2px] -translate-y-1/2"
              style={{
                background: "linear-gradient(90deg, rgba(226,130,47,0.2) 0%, rgba(248,207,150,0.65) 50%, rgba(226,130,47,0.2) 100%)",
                boxShadow: "0 0 12px var(--glow)",
              }}
            />

            {MILESTONES.map((milestone, idx) => {
              const isActive = idx === activePhaseIndex;
              return (
                <button
                  key={milestone.id}
                  type="button"
                  onClick={() => handleSelectPhase(idx)}
                  className="group relative z-10 flex flex-col items-center focus:outline-hidden"
                >
                  {/* Glowing orbital marker */}
                  <div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                      isActive
                        ? "border-sand bg-spice/40 shadow-[0_0_24px_var(--glow)] scale-110"
                        : "border-line-strong/80 bg-surface/80 hover:border-spice/60 hover:bg-surface/95"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-sand shadow-[0_0_12px_#ffffff]"
                          : "bg-ink-3/60 group-hover:bg-spice/80"
                      }`}
                    />
                    {isActive && (
                      <span className="absolute -inset-1.5 animate-ping rounded-full border border-sand/40 opacity-40 duration-1000" />
                    )}
                  </div>

                  {/* Step phase pill & date label */}
                  <div className="mt-3.5 flex flex-col items-center text-center">
                    <span
                      className={`font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-200 ${
                        isActive ? "text-sand font-bold" : "text-ink-3 group-hover:text-ink-2"
                      }`}
                    >
                      {milestone.phaseLabel}
                    </span>
                    <span
                      className={`mt-1 text-sm font-medium tracking-tight transition-colors duration-200 ${
                        isActive ? "text-ink" : "text-ink-2 group-hover:text-ink"
                      }`}
                    >
                      {milestone.title}
                    </span>
                    <span className="mt-0.5 font-mono text-[0.72rem] text-ink-3">
                      {milestone.dateDisplay}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DUNE CALENDAR & PHASE SHOWCASE PANEL */}
        <div
          className="relative overflow-hidden rounded-3xl border border-spice/25 p-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-9 lg:p-11"
          style={{
            background: "linear-gradient(135deg, rgba(20, 13, 8, 0.72) 0%, rgba(10, 7, 5, 0.88) 100%)",
          }}
        >
          {/* Subtle warm ambient flare inside panel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-spice/15 blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* ── LEFT: INTERACTIVE MONTH CALENDAR (lg: 5 cols) ── */}
            <div className="flex flex-col justify-between rounded-2xl border border-line/50 bg-black/35 p-5 md:p-6 lg:col-span-5">
              <div>
                {/* Calendar Header with Month & Year */}
                <div className="flex items-center justify-between border-b border-line/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={18} className="text-sand" />
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-sand">
                      Event Calendar
                    </span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-ink">
                    {calendarData.monthName} {calendarData.year}
                  </span>
                </div>

                {/* Weekday Labels */}
                <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono text-[0.68rem] uppercase tracking-wider text-ink-3">
                  {WEEKDAY_NAMES.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day Number Grid */}
                <div className="mt-2 grid grid-cols-7 gap-1.5 text-center font-mono text-sm">
                  {calendarData.blanks.map((i) => (
                    <div key={`blank-${i}`} className="h-9 w-full" />
                  ))}

                  {calendarData.days.map((day) => {
                    const isHighlighted = calendarData.highlightDays.has(day);
                    return (
                      <div
                        key={`day-${day}`}
                        className={`relative flex h-9 w-full items-center justify-center rounded-xl transition-all duration-200 ${
                          isHighlighted
                            ? "bg-gradient-to-br from-sand to-spice font-semibold text-bg shadow-[0_0_16px_var(--glow)] scale-105"
                            : "text-ink-2/80 hover:bg-white/5 hover:text-ink"
                        }`}
                      >
                        <span>{day}</span>
                        {isHighlighted && (
                          <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-sand shadow-[0_0_6px_#fff]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1-Click Calendar Sync Action */}
              <div className="mt-6 border-t border-line/40 pt-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-widest text-ink-3">
                  Direct Calendar Sync
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-spice/40 bg-spice/10 px-3 py-1.5 font-mono text-xs text-sand transition-all hover:border-sand hover:bg-spice/20"
                  >
                    Google Calendar <ExternalLink size={12} />
                  </a>
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 font-mono text-xs text-ink-2 transition-all hover:border-line-strong hover:text-ink"
                  >
                    Outlook / iCal <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* ── RIGHT: PHASE SPOTLIGHT & KEY DETAILS (lg: 7 cols) ── */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                {/* Status Badge & Phase Indicator */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-sand/40 bg-sand/10 px-3 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sand">
                    {activeMilestone.phaseLabel}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-spice/40 bg-spice/10 px-3 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-spice">
                    <Sparkles size={11} /> {activeMilestone.status}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-ink-2">
                    <Clock size={13} className="text-sand" /> {activeMilestone.dateDisplay}
                  </span>
                </div>

                {/* Phase Headline & Narrative */}
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                  {activeMilestone.headline}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                  {activeMilestone.description}
                </p>

                {/* Venue / Mode Tag */}
                <div className="mt-4 flex items-center gap-2 font-mono text-xs text-sand">
                  <MapPin size={14} className="shrink-0 text-spice" />
                  <span>{activeMilestone.location}</span>
                </div>

                {/* Key Information Chips */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {activeMilestone.keyDetails.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-line/40 bg-black/25 p-3 text-center"
                    >
                      <p className="font-mono text-[0.62rem] uppercase tracking-wider text-ink-3">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs font-medium text-ink md:text-sm">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Schedule Itinerary Breakdown */}
                <div className="mt-7">
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-2">
                    <Layers size={13} className="text-sand" /> Schedule Highlights
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {activeMilestone.scheduleHighlights.map((step) => (
                      <li
                        key={step.title}
                        className="flex items-start gap-3 rounded-xl border border-line/30 bg-surface/30 p-3 transition-colors hover:border-spice/40"
                      >
                        <span className="shrink-0 rounded-md bg-spice/15 px-2 py-0.5 font-mono text-[0.68rem] font-medium text-sand">
                          {step.time}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-ink md:text-sm">
                            {step.title}
                          </p>
                          <p className="mt-0.5 text-[0.78rem] text-ink-3">
                            {step.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Navigation between phases */}
              <div className="mt-8 flex items-center justify-between border-t border-line/40 pt-5">
                <span className="font-mono text-xs text-ink-3">
                  Step {activePhaseIndex + 1} of {MILESTONES.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectPhase((activePhaseIndex + 1) % MILESTONES.length)}
                  className="flex items-center gap-1.5 font-mono text-xs text-sand transition-colors hover:text-ink"
                >
                  Next Phase <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTNOTE ── */}
      <p className="reveal relative z-10 mx-auto mt-12 max-w-xl text-center text-xs leading-relaxed text-ink-3 md:mt-16">
        <span className="mr-1 text-spice">*</span>
        All dates and timelines are subject to institutional confirmation. Registered teams will receive realtime notifications via email and WhatsApp.
      </p>
    </section>
  );
}
