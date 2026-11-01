"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Calendar,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Clock,
  UserCheck,
  FileCode2,
  Trophy,
} from "lucide-react";
import HorizonBloom, { type HorizonBloomHandle } from "./HorizonBloom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ArcPhase {
  id: string;
  phase: string;
  title: string;
  date: string;
  tagline: string;
  icon: typeof UserCheck;
  xPercent: number; // Position along the planetary arc width
  yPercent: number; // Exact height aligning with the horizon curvature
  googleDates: string;
}

const ARC_PHASES: ArcPhase[] = [
  {
    id: "phase-0",
    phase: "Phase 0",
    title: "Registration",
    date: "November 15, 2026",
    tagline: "Team formation & online portal live",
    icon: UserCheck,
    xPercent: 18,
    yPercent: 70,
    googleDates: "20261115T033000Z/20261115T183000Z",
  },
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "Problem Statement Declaration",
    date: "December 20, 2026",
    tagline: "Tracks unveiled & shortlisted teams confirmed",
    icon: FileCode2,
    xPercent: 50,
    yPercent: 62,
    googleDates: "20261220T053000Z/20261220T143000Z",
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "Final Round",
    date: "January 2–4, 2027",
    tagline: "36-hour offline code sprint & grand finale",
    icon: Trophy,
    xPercent: 82,
    yPercent: 70,
    googleDates: "20270102T043000Z/20270105T123000Z",
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const bloomRef = useRef<HorizonBloomHandle>(null);
  const [activePhase, setActivePhase] = useState<string | null>(null);

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
            const nodes = section.querySelectorAll<HTMLElement>(".arc-node");
            const stems = section.querySelectorAll<HTMLElement>(".arc-stem");
            const labels = section.querySelectorAll<HTMLElement>(".arc-content");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 72%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                  bloomRef.current?.bloom(0.5, 1.3);
                },
              },
            });

            tl.fromTo(
              nodes,
              { scale: 0.2, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.65,
                stagger: 0.2,
                ease: "back.out(2)",
              }
            )
              .fromTo(
                stems,
                { scaleY: 0, transformOrigin: "bottom center", opacity: 0 },
                {
                  scaleY: 1,
                  opacity: 1,
                  duration: 0.45,
                  stagger: 0.2,
                  ease: "power2.out",
                },
                "<+=0.1"
              )
              .fromTo(
                labels,
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2,
                  ease: "power3.out",
                },
                "<+=0.15"
              );
          }

          if (mobile) {
            const mobileItems = section.querySelectorAll<HTMLElement>(".mobile-milestone");

            gsap.fromTo(
              mobileItems,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
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

  const handleNodeClick = (phaseId: string, normX: number) => {
    setActivePhase(activePhase === phaseId ? null : phaseId);
    bloomRef.current?.bloom(normX, 1.15);
  };

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative scroll-mt-4 overflow-hidden px-4 py-24 md:px-8 md:py-36"
    >
      {/* ── SEAMLESS FULL-BLEED HORIZON BLOOM STAGE ── */}
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

        {/* Global 1-Click All Events Calendar Sync */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=hackieee+2026+Hackathon&dates=20270102T043000Z/20270105T123000Z&details=The+flagship+Dune-themed+36-hour+hackathon+at+Nirma+University.&location=Nirma+University%2C+Ahmedabad"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-spice/40 bg-black/40 px-4 py-2 font-mono text-xs text-sand shadow-lg backdrop-blur-md transition-all duration-300 hover:border-sand hover:bg-spice/20 hover:shadow-[0_0_20px_var(--glow)]"
          >
            <Calendar size={13} className="text-sand transition-transform group-hover:scale-110" />
            <span>Add Event to Calendar</span>
            <ExternalLink size={11} className="opacity-60 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
      </div>

      {/* ── DESKTOP: PLANETARY ARC MAPPING (md: and up) ── */}
      {/* Three phases mapped directly along the horizon curvature */}
      <div className="relative z-10 mx-auto hidden min-h-[580px] w-full max-w-6xl md:block">
        {ARC_PHASES.map((item) => {
          const isSelected = activePhase === item.id;
          const Icon = item.icon;
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            `hackieee: ${item.title}`
          )}&dates=${item.googleDates}&details=${encodeURIComponent(
            `${item.title} (${item.phase}) - hackieee 2026. ${item.tagline}`
          )}&location=${encodeURIComponent("Nirma University, Ahmedabad")}`;

          return (
            <div
              key={item.id}
              className="absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${item.xPercent}%`, top: `${item.yPercent}%` }}
            >
              {/* Floating Typography & Quick Calendar (Sitting directly above the planet rim) */}
              <div className="arc-content flex -translate-y-full flex-col items-center pb-2 text-center">
                <div
                  onClick={() => handleNodeClick(item.id, item.xPercent / 100)}
                  className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                    isSelected
                      ? "border-sand/60 bg-black/75 shadow-[0_0_30px_var(--glow)] backdrop-blur-xl"
                      : "border-transparent bg-black/30 hover:border-spice/30 hover:bg-black/50 backdrop-blur-md"
                  } w-[240px] lg:w-[270px]`}
                >
                  {/* Phase Pill & Date */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="rounded-full border border-sand/30 bg-sand/10 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-sand">
                      {item.phase}
                    </span>
                    <span className="font-mono text-[0.72rem] tracking-wider text-ink-2">
                      {item.date}
                    </span>
                  </div>

                  {/* Clean Title */}
                  <h3 className="mt-2.5 text-base font-medium tracking-tight text-ink lg:text-lg group-hover:text-sand transition-colors">
                    {item.title}
                  </h3>

                  {/* Minimal Subtitle */}
                  <p className="mt-1 text-xs leading-relaxed text-ink-3">
                    {item.tagline}
                  </p>

                  {/* 1-Click Calendar Sync Pill */}
                  <div className="mt-3.5 pt-2.5 border-t border-line/30 flex items-center justify-center">
                    <a
                      href={calUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-sand/80 hover:text-sand transition-colors"
                    >
                      <Calendar size={11} /> Add to Calendar <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* Glowing Hairline Connector Stem (Rises directly from the orbital node) */}
                <div
                  className="arc-stem mt-2 w-[1.5px] bg-gradient-to-b from-transparent via-sand/60 to-sand"
                  style={{
                    height: "32px",
                    boxShadow: "0 0 8px var(--glow)",
                  }}
                />
              </div>

              {/* Glowing Orbital Marker (Sits exactly on the curved planet rim) */}
              <button
                type="button"
                onClick={() => handleNodeClick(item.id, item.xPercent / 100)}
                className="arc-node group relative z-20 -translate-y-1/2 focus:outline-hidden"
                aria-label={`Select ${item.title}`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Atmospheric outer glow ring */}
                  <div
                    className={`absolute -inset-2.5 rounded-full transition-all duration-300 ${
                      isSelected
                        ? "scale-125 opacity-90 blur-xs"
                        : "opacity-40 group-hover:opacity-75 blur-xs"
                    }`}
                    style={{
                      background: "radial-gradient(circle, var(--sand) 0%, var(--spice) 60%, transparent 80%)",
                    }}
                  />

                  {/* Core Eclipse Marker */}
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
                      isSelected
                        ? "border-sand bg-sand/20 shadow-[0_0_18px_#ffffff] scale-110"
                        : "border-sand/60 bg-surface/80 group-hover:border-sand group-hover:scale-105"
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        isSelected ? "bg-white shadow-[0_0_8px_#fff]" : "bg-sand"
                      }`}
                    />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE: CLEAN MINIMAL MILESTONE STACK (< 768px) ── */}
      <div className="relative z-10 mx-auto max-w-md md:hidden">
        {/* Vertical Glowing Horizon Guide Spine */}
        <div className="relative pl-6">
          <div
            className="absolute bottom-4 left-[10px] top-4 w-[1.5px]"
            style={{
              background: "linear-gradient(to bottom, var(--sand), var(--spice) 65%, var(--ember))",
              boxShadow: "0 0 8px var(--glow)",
            }}
          />

          <div className="space-y-6">
            {ARC_PHASES.map((item) => {
              const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                `hackieee: ${item.title}`
              )}&dates=${item.googleDates}&details=${encodeURIComponent(
                `${item.title} (${item.phase}) - hackieee 2026. ${item.tagline}`
              )}&location=${encodeURIComponent("Nirma University, Ahmedabad")}`;

              return (
                <div key={item.id} className="mobile-milestone relative">
                  {/* Glowing orbital marker */}
                  <div className="absolute -left-[20px] top-3.5 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-sand bg-surface shadow-[0_0_8px_var(--glow)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-sand" />
                  </div>

                  {/* Minimal Typography Card */}
                  <div className="rounded-2xl border border-line/40 bg-black/40 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-sand/30 bg-sand/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-sand">
                        {item.phase}
                      </span>
                      <span className="font-mono text-[0.7rem] text-ink-2">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-medium text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {item.tagline}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-line/30">
                      <a
                        href={calUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-sand"
                      >
                        <Calendar size={11} /> Add to Calendar <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FOOTNOTE ── */}
      <p className="reveal relative z-10 mx-auto mt-14 max-w-xl text-center text-xs leading-relaxed text-ink-3 md:mt-16">
        <span className="mr-1 text-spice">*</span>
        All dates are tentative. Schedule details will be communicated directly to registered participants.
      </p>
    </section>
  );
}
