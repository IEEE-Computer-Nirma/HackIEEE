"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const events = [
  {
    date: "October 20, 2026",
    title: "Registration Opens",
    description: "Sign up and form your team of up to 4 members.",
    icon: "how_to_reg",
    phase: "Phase 0",
  },
  {
    date: "November 28, 2026",
    title: "Registration Closes",
    description: "Last day to register. Late entries will not be accepted.",
    icon: "event_busy",
    phase: "Phase 0",
  },
  {
    date: "December 20–25, 2026",
    title: "Idea Submission + Quiz / CTF",
    description:
      "Submit your project proposal along with participation in the preliminary Quiz / CTF challenges.",
    icon: "assignment",
    phase: "Phase 1",
  },
  {
    date: "January 2–3, 2027",
    title: "Hackathon",
    description:
      "Intense coding and product building phase with mentor support and technical checkpoints.",
    icon: "code",
    phase: "Phase 2",
  },
  {
    date: "January 4, 2027",
    title: "Results & Award Ceremony",
    description:
      "Project presentations, judge evaluations, winner announcements, and prize distributions.",
    icon: "emoji_events",
    phase: "Finale",
  },
];

/* Color palette matching the Neon Rise design system */
const palette = [
  { accent: "#4C5BE0", glow: "rgba(76, 91, 224, 0.35)" },
  { accent: "#6E6FE8", glow: "rgba(110, 111, 232, 0.35)" },
  { accent: "#B387E8", glow: "rgba(179, 135, 232, 0.35)" },
  { accent: "#F86AC8", glow: "rgba(248, 106, 200, 0.35)" },
  { accent: "#FF4E63", glow: "rgba(255, 78, 99, 0.35)" },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      /* ── Set line height to end at the last dot ── */
      const dots = sectionRef.current.querySelectorAll<HTMLElement>(".tl-dot");
      const spine = spineRef.current;
      if (dots.length > 0 && spine) {
        const lastDot = dots[dots.length - 1];
        const spineTop = spine.getBoundingClientRect().top;
        const lastDotTop = lastDot.getBoundingClientRect().top;
        const lineHeight = lastDotTop - spineTop + 9; // +9 to center on the dot

        // Set both lines to end at the last dot
        if (trackRef.current) trackRef.current.style.height = `${lineHeight}px`;
        if (lineRef.current) lineRef.current.style.height = `${lineHeight}px`;
      }

      /* ── Animate the glowing progress line ── */
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 0.8,
            },
          }
        );
      }

      /* ── Section heading fade-in ── */
      gsap.from(".tl-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".tl-heading",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* ── Stagger-reveal each timeline card ── */
      const cards = gsap.utils.toArray<HTMLElement>(".tl-card");
      cards.forEach((card, i) => {
        const isLeft = i % 2 === 0;

        // Card slide-in
        gsap.from(card, {
          x: isLeft ? -80 : 80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // Dot pop-in
        const dot = sectionRef.current!.querySelectorAll(".tl-dot")[i];
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });

      /* ── Note badge ── */
      gsap.from(".tl-note", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".tl-note",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-28 md:py-36 px-6 scroll-mt-24 overflow-hidden"
    >
      {/* ── Ambient background glow ── */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #B387E8, transparent 70%)",
        }}
      />

      {/* ── Section Heading ── */}
      <div className="tl-heading max-w-4xl mx-auto text-center mb-20 md:mb-28">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5">
          Event <span style={{ color: "#ccff00" }}>Timeline</span>
        </h2>
        <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
          Key milestones on your journey from idea to impact.
        </p>
      </div>

      {/* ── Timeline Spine ── */}
      <div className="max-w-5xl mx-auto relative" ref={spineRef}>
        {/* Static track line (subtle) */}
        <div
          ref={trackRef}
          className="absolute left-[28px] md:left-1/2 md:-translate-x-[1px] top-0 w-[2px]"
          style={{ background: "rgba(204, 255, 0, 0.08)" }}
        />

        {/* Animated glowing progress line */}
        <div
          ref={lineRef}
          className="absolute left-[28px] md:left-1/2 md:-translate-x-[1px] top-0 w-[2px] origin-top"
          style={{
            background:
              "linear-gradient(to bottom, #4C5BE0 0%, #6E6FE8 25%, #B387E8 50%, #F86AC8 75%, #FF4E63 100%)",
            boxShadow:
              "0 0 8px rgba(179, 135, 232, 0.4), 0 0 20px rgba(248, 106, 200, 0.2)",
          }}
        />

        {/* ── Event Cards ── */}
        {events.map((event, i) => {
          const isLeft = i % 2 === 0;
          const { accent, glow } = palette[i];

          return (
            <div
              key={event.title}
              className={`relative flex items-start mb-16 md:mb-20 last:mb-0 ${
                isLeft
                  ? "md:flex-row"
                  : "md:flex-row-reverse"
              } flex-row`}
            >
              {/* ── Dot on the line ── */}
              <div className="tl-dot absolute left-[28px] md:left-1/2 -translate-x-1/2 z-20">
                <div
                  className="relative w-[18px] h-[18px] rounded-full border-[2.5px] flex items-center justify-center"
                  style={{
                    borderColor: accent,
                    background: "#0a0a0f",
                    boxShadow: `0 0 16px ${glow}, 0 0 40px ${glow}`,
                  }}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full"
                    style={{ background: accent }}
                  />
                </div>
              </div>

              {/* ── Card ── */}
              <div
                className={`tl-card ml-16 md:ml-0 ${
                  isLeft
                    ? "md:w-[calc(50%-48px)] md:pr-0 md:text-right"
                    : "md:w-[calc(50%-48px)] md:pl-0 md:text-left"
                } w-full`}
              >
                <div
                  className="group relative rounded-2xl p-6 md:p-7 transition-all duration-400 ease-out hover:-translate-y-1"
                  style={{
                    background: "rgba(5, 6, 15, 0.55)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: `1px solid ${accent}20`,
                  }}
                >


                  {/* Content */}
                  <div className="relative z-10">
                    {/* Phase badge + Date */}
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        isLeft ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                        style={{
                          color: accent,
                          background: `${accent}15`,
                          border: `1px solid ${accent}30`,
                        }}
                      >
                        {event.phase}
                      </span>
                      <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: `${accent}CC` }}
                      >
                        {event.date}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-3 mb-2 ${
                        isLeft ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ color: accent }}
                      >
                        {event.icon}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                        {event.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/55 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Spacer for the opposite side on desktop */}
              <div className="hidden md:block md:w-[calc(50%-48px)]" />
            </div>
          );
        })}
      </div>

      {/* ── Note Badge ── */}
      <div className="tl-note max-w-2xl mx-auto mt-16 text-center">
        <p className="text-xs md:text-sm text-sky-300/80 bg-sky-950/30 border border-sky-500/20 rounded-xl py-3 px-5 inline-block backdrop-blur-sm shadow-md">
          <span className="text-amber-400 font-bold mr-1.5">*</span>
          <span className="font-medium">
            Note: All dates are tentative and may shift by ±1 week.
            <br />
            Final schedule will be confirmed 1 month prior to the event.
          </span>
        </p>
      </div>
    </section>
  );
}
