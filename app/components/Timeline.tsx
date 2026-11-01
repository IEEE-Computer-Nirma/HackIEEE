"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Calendar, ExternalLink } from "lucide-react";
import HorizonBloom, { type HorizonBloomHandle } from "./HorizonBloom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface TimelineMilestone {
  id: string;
  phase: string;
  numeral: string;
  title: string;
  date: string;
  description: string;
  xPercent: number; // Left position %
  yPercent: number; // Bottom anchor % aligning right above the arc
  googleDates: string;
}

const MILESTONES: TimelineMilestone[] = [
  {
    id: "phase-0",
    phase: "Phase 0",
    numeral: "00",
    title: "Registration",
    date: "Nov 15, 2026",
    description: "Team formation & global registration portal goes live.",
    xPercent: 18,
    yPercent: 68,
    googleDates: "20261115T033000Z/20261115T183000Z",
  },
  {
    id: "phase-1",
    phase: "Phase 1",
    numeral: "01",
    title: "Problem Statement Declaration",
    date: "Dec 20, 2026",
    description: "Challenge tracks unveiled & shortlisted teams confirmed.",
    xPercent: 50,
    yPercent: 57,
    googleDates: "20261220T053000Z/20261220T143000Z",
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    numeral: "02",
    title: "Final Round",
    date: "Jan 2–4, 2027",
    description: "36-hour national offline hackathon & grand finale at Nirma.",
    xPercent: 82,
    yPercent: 68,
    googleDates: "20270102T043000Z/20270105T123000Z",
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const bloomRef = useRef<HorizonBloomHandle>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (ctx) => {
          const { desktop, mobile } = ctx.conditions as {
            desktop: boolean;
            mobile: boolean;
          };

          if (desktop) {
            const cards = section.querySelectorAll<HTMLElement>(".timeline-card");

            gsap.fromTo(
              cards,
              {
                opacity: 0,
                y: 28,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 72%",
                  toggleActions: "play none none reverse",
                  onEnter: () => {
                    bloomRef.current?.bloom(0.5, 1.25);
                  },
                },
              }
            );
          }

          if (mobile) {
            const mobileCards = section.querySelectorAll<HTMLElement>(".mobile-card");

            gsap.fromTo(
              mobileCards,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.18,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        }
      );

      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative scroll-mt-4 overflow-hidden px-4 py-24 md:px-8 md:py-36"
    >
      {/* ── EXPANSIVE HORIZON BLOOM STAGE BACKDROP ── */}
      {/* Soft gradient edge fade into the dark background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <HorizonBloom
          ref={bloomRef}
          colors={["#f8cf96", "#993e0e"]}
          backgroundColor="transparent"
          horizon={0.62}
          curvature={1.05}
          sunPosition={0}
          sunrise={1.25}
          spread={0.48}
          atmosphere={1.35}
          thickness={1.15}
          rim={1.3}
          flare={1.2}
          airglow={0.5}
          clouds={0.6}
          stars={0.85}
          aurora={0.75}
          autoAurora={true}
          speed={0.4}
          drift={0.3}
          parallax={0.55}
          bloom={0.6}
          grain={0.12}
          interactive={true}
          intro={true}
          className="h-full w-full"
        />
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="reveal relative z-10 mx-auto mb-16 max-w-4xl text-center md:mb-20">
        <p className="eyebrow">03 — Timeline</p>
        <h2 className="section-title mt-5">event Timeline</h2>
        <p className="section-lead mt-5 md:mx-auto">
          Key milestones on the long walk from idea to impact.
        </p>

        {/* Global Add to Calendar Button */}
        <div className="mt-6 flex items-center justify-center">
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=hackieee+2026+Hackathon&dates=20270102T043000Z/20270105T123000Z&details=The+flagship+Dune-themed+36-hour+hackathon+at+Nirma+University.&location=Nirma+University%2C+Ahmedabad"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-spice/40 bg-black/45 px-4 py-2 font-mono text-xs text-sand shadow-lg backdrop-blur-md transition-all duration-300 hover:border-sand hover:bg-spice/20 hover:shadow-[0_0_20px_var(--glow)]"
          >
            <Calendar size={13} className="text-sand transition-transform group-hover:scale-110" />
            <span>Add to Calendar</span>
            <ExternalLink size={11} className="opacity-60 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
      </div>

      {/* ── DESKTOP: 3 ELEVATED HORIZON GLASS CARDS FLOATING ABOVE THE PLANET ARC ── */}
      <div className="relative z-10 mx-auto hidden min-h-[520px] w-full max-w-6xl md:block">
        {MILESTONES.map((item) => {
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            `hackieee 2026: ${item.title}`
          )}&dates=${item.googleDates}&details=${encodeURIComponent(
            `${item.title} (${item.phase}) - hackieee 2026. ${item.description}`
          )}&location=${encodeURIComponent("Nirma University, Ahmedabad")}`;

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${item.xPercent}%`, top: `${item.yPercent}%` }}
            >
              <article
                className="timeline-card group relative w-[260px] lg:w-[290px] overflow-hidden rounded-2xl border border-sand/15 bg-gradient-to-b from-[#1b120a]/85 via-[#110b07]/90 to-[#070503]/95 p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(248,207,150,0.22)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-spice/50 hover:shadow-[0_28px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(226,130,47,0.22),inset_0_1px_2px_rgba(248,207,150,0.45)]"
              >
                {/* Top specular hairline (light catch) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sand/40 to-transparent"
                />

                {/* Ambient horizon bounce light inside bottom of card */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 left-1/2 h-20 w-36 -translate-x-1/2 rounded-full bg-spice/15 blur-2xl transition-opacity duration-300 group-hover:bg-spice/28"
                />

                {/* Subtle Dune Rise Numeral Watermark */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3.5 top-2.5 select-none font-display text-4xl font-light text-sand/[0.04] transition-all duration-300 group-hover:text-sand/[0.09] group-hover:scale-105"
                >
                  {item.numeral}
                </span>

                {/* ── HEADER: Telemetry Phase Badge & Date ── */}
                <div className="relative flex items-center justify-between gap-2 border-b border-sand/10 pb-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-spice/40 bg-spice/10 px-2.5 py-0.5 shadow-[0_0_10px_rgba(226,130,47,0.2)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-spice shadow-[0_0_6px_var(--spice)]" />
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-spice">
                      {item.phase}
                    </span>
                  </div>
                  <span className="font-mono text-[0.7rem] tracking-wider text-sand/75">
                    {item.date}
                  </span>
                </div>

                {/* ── BODY: Title & Description ── */}
                <div className="relative mt-3.5">
                  <h3 className="text-lg font-semibold tracking-tight text-[#fdf6ee] transition-colors duration-200 group-hover:text-sand lg:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#bca793] transition-colors duration-200 group-hover:text-[#dbccbe]">
                    {item.description}
                  </p>
                </div>

                {/* ── FOOTER: Tactile Add to Calendar Pill ── */}
                <div className="relative mt-4 border-t border-sand/10 pt-3">
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex w-full items-center justify-center gap-2 rounded-xl border border-spice/30 bg-spice/10 px-3 py-2 font-mono text-[0.7rem] font-medium tracking-wide text-sand transition-all duration-300 hover:border-sand/60 hover:bg-spice/25 hover:shadow-[0_0_18px_rgba(226,130,47,0.35)]"
                  >
                    <Calendar size={12} className="text-spice transition-transform duration-300 group-hover/btn:scale-110" />
                    <span>Add to Calendar</span>
                    <ExternalLink size={10} className="opacity-60 transition-opacity duration-300 group-hover/btn:opacity-100" />
                  </a>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE: ELEVATED MINIMAL CARDS STACK (< 768px) ── */}
      <div className="relative z-10 mx-auto max-w-sm space-y-4 md:hidden">
        {MILESTONES.map((item) => {
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            `hackieee 2026: ${item.title}`
          )}&dates=${item.googleDates}&details=${encodeURIComponent(
            `${item.title} (${item.phase}) - hackieee 2026. ${item.description}`
          )}&location=${encodeURIComponent("Nirma University, Ahmedabad")}`;

          return (
            <article
              key={item.id}
              className="mobile-card relative overflow-hidden rounded-2xl border border-sand/15 bg-gradient-to-b from-[#1c120a]/90 via-[#110b07]/92 to-[#070503]/96 p-5 text-left shadow-xl backdrop-blur-2xl"
            >
              {/* Top specular hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sand/40 to-transparent"
              />

              {/* Header: Phase & Date */}
              <div className="relative flex items-center justify-between gap-2 border-b border-sand/10 pb-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-spice/40 bg-spice/10 px-2.5 py-0.5 shadow-[0_0_10px_rgba(226,130,47,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-spice shadow-[0_0_6px_var(--spice)]" />
                  <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-spice">
                    {item.phase}
                  </span>
                </div>
                <span className="font-mono text-[0.7rem] tracking-wider text-sand/75">
                  {item.date}
                </span>
              </div>

              {/* Title & Description */}
              <div className="relative mt-3">
                <h3 className="text-base font-semibold tracking-tight text-[#fdf6ee]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#bca793]">
                  {item.description}
                </p>
              </div>

              {/* Footer */}
              <div className="relative mt-4 border-t border-sand/10 pt-3">
                <a
                  href={calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-spice/30 bg-spice/10 px-3 py-2 font-mono text-[0.7rem] font-medium tracking-wide text-sand"
                >
                  <Calendar size={12} className="text-spice" />
                  <span>Add to Calendar</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── FOOTNOTE ── */}
      <p className="reveal relative z-10 mx-auto mt-14 max-w-xl text-center text-xs leading-relaxed text-ink-3 md:mt-16">
        <span className="mr-1 text-spice">*</span>
        All dates are tentative and subject to confirmation.
      </p>
    </section>
  );
}
