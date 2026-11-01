"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { UserPlus, CalendarX, FileCode, Code, Trophy } from "lucide-react";
import { timelineEvents, type TimelineEvent } from "../data/timeline";
import BellReminder from "./BellReminder";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const icons: Record<TimelineEvent["icon"], typeof Code> = {
  register: UserPlus,
  closed: CalendarX,
  idea: FileCode,
  code: Code,
  trophy: Trophy,
};

// Desktop mapping along the planetary arc:
// Left slope (~18% X), Center apex (50% X), Right slope (~82% X)
const nodePositions = [
  { x: 18, y: 62 },
  { x: 50, y: 53.1 },
  { x: 82, y: 62 },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizonPathRef = useRef<SVGPathElement>(null);

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
            // 1. Prepare SVG horizon curve paths for drawing from left to right
            const arcLines = section.querySelectorAll<SVGPathElement>(".horizon-arc-line");
            arcLines.forEach((line) => {
              const length = line.getTotalLength?.() || 1420;
              gsap.set(line, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });
            });

            // Master timeline for synchronized scroll animation
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            });

            // Animate glowing SVG horizon curve drawing itself from left to right
            tl.to(arcLines, {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: "power2.inOut",
            });

            // 2. Sequential Fade-In & slide-up of milestone cards & orbital dots
            const items = section.querySelectorAll<HTMLElement>(".tl-item");
            const dots = section.querySelectorAll<HTMLElement>(".tl-dot");
            const stems = section.querySelectorAll<HTMLElement>(".tl-stem");

            tl.fromTo(
              items,
              {
                opacity: 0,
                y: 36,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                stagger: 0.22,
                ease: "power3.out",
              },
              "-=0.9" // Staggered reveal overlaps as the arc draws past each milestone
            );

            tl.fromTo(
              dots,
              {
                scale: 0.3,
                opacity: 0,
              },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.22,
                ease: "back.out(2.2)",
              },
              "<"
            );

            tl.fromTo(
              stems,
              {
                scaleY: 0,
                transformOrigin: "bottom center",
                opacity: 0,
              },
              {
                scaleY: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.22,
                ease: "power2.out",
              },
              "<+=0.1"
            );
          }

          if (mobile) {
            // Mobile SVG line drawing
            const mobileArc = section.querySelector<SVGPathElement>(".mobile-arc-line");
            if (mobileArc) {
              const length = mobileArc.getTotalLength?.() || 700;
              gsap.set(mobileArc, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });
            }

            const mobileItems = section.querySelectorAll<HTMLElement>(".tl-mobile-item");

            const mobileTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });

            if (mobileArc) {
              mobileTl.to(mobileArc, {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: "power2.inOut",
              });
            }

            mobileTl.fromTo(
              mobileItems,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.2,
                ease: "power3.out",
              },
              "-=0.8"
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
    <section ref={sectionRef} id="timeline" className="relative scroll-mt-4 overflow-hidden px-5 py-24 md:px-8 md:py-36">
      {/* Ambient CSS Pulsing Styles for the sunrise bloom */}
      <style>{`
        @keyframes horizonAtmospherePulse {
          0%, 100% {
            opacity: 0.65;
            transform: scale(0.97);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes horizonFlarePulse {
          0%, 100% {
            opacity: 0.75;
            transform: scaleX(0.94) scaleY(0.9);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.08) scaleY(1.18);
          }
        }

        @keyframes mobileFlarePulse {
          0%, 100% {
            opacity: 0.75;
            transform: scale(0.96);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .horizon-pulse-sky {
          animation: horizonAtmospherePulse 4.5s ease-in-out infinite;
          transform-origin: 600px 255px;
        }

        .horizon-pulse-flare {
          animation: horizonFlarePulse 3s ease-in-out infinite;
          transform-origin: 600px 255px;
        }

        .mobile-pulse-flare {
          animation: mobileFlarePulse 3.5s ease-in-out infinite;
          transform-origin: 300px 120px;
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-spice opacity-[0.05] blur-3xl"
      />

      <div className="reveal relative mx-auto mb-14 max-w-6xl md:mb-24 md:text-center">
        <p className="eyebrow">03 — Timeline</p>
        <h2 className="section-title mt-5">event Timeline</h2>
        <p className="section-lead mt-6 md:mx-auto">
          Key milestones on the long walk from idea to impact.
        </p>
        <div className="mt-7">
          <BellReminder />
        </div>
      </div>

      {/* ── DESKTOP: Horizon Bloom Planetary Arc (md: and up) ── */}
      <div className="relative mx-auto hidden min-h-[540px] w-full max-w-6xl md:block">
        {/* Planetary Horizon & Sunrise Bloom SVG */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          viewBox="0 0 1200 480"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Atmospheric blur filters for the horizon sunrise bloom */}
            <filter id="bloom-filter-wide" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" />
            </filter>
            <filter id="bloom-filter-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="bloom-filter-rim" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>

            {/* Sky atmospheric glow centered at the curve apex */}
            <radialGradient id="bloom-grad-sky" cx="50%" cy="53.1%" r="48%" fx="50%" fy="53.1%">
              <stop offset="0%" stopColor="var(--sand)" stopOpacity="0.45" />
              <stop offset="22%" stopColor="var(--spice)" stopOpacity="0.3" />
              <stop offset="52%" stopColor="var(--ember)" stopOpacity="0.12" />
              <stop offset="82%" stopColor="var(--glow)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Specular sunrise flare at the horizon apex */}
            <radialGradient id="bloom-grad-dawn" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="var(--sand)" stopOpacity="0.9" />
              <stop offset="50%" stopColor="var(--spice)" stopOpacity="0.5" />
              <stop offset="80%" stopColor="var(--ember)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Planetary body: deep dark silhouette fading into transparent shadow at bottom */}
            <linearGradient id="bloom-grad-planet" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#140d08" stopOpacity="0.88" />
              <stop offset="35%" stopColor="#0c0805" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#080503" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#050302" stopOpacity="0.05" />
            </linearGradient>

            {/* Subsurface inner limb illumination */}
            <radialGradient id="bloom-grad-planet-subtle" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="var(--spice)" stopOpacity="0.12" />
              <stop offset="40%" stopColor="var(--ember)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Atmospheric rim glow gradient */}
            <linearGradient id="bloom-grad-rim-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.05" />
              <stop offset="18%" stopColor="var(--spice)" stopOpacity="0.55" />
              <stop offset="50%" stopColor="var(--sand)" stopOpacity="0.9" />
              <stop offset="82%" stopColor="var(--spice)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--ember)" stopOpacity="0.05" />
            </linearGradient>

            {/* Crisp glowing rim line gradient with white-hot apex */}
            <linearGradient id="bloom-grad-rim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.1" />
              <stop offset="18%" stopColor="var(--spice)" stopOpacity="0.75" />
              <stop offset="42%" stopColor="var(--sand)" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="58%" stopColor="var(--sand)" stopOpacity="0.95" />
              <stop offset="82%" stopColor="var(--spice)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="var(--ember)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Layer 1: Atmospheric sky dome bloom above apex (Ambient Continuous Pulse) */}
          <ellipse
            cx="600"
            cy="255"
            rx="500"
            ry="190"
            fill="url(#bloom-grad-sky)"
            className="horizon-pulse-sky"
          />

          {/* Layer 2: Planetary body silhouette beneath the curve */}
          <path
            d="M -60 380 Q 600 130 1260 380 L 1260 480 L -60 480 Z"
            fill="url(#bloom-grad-planet)"
          />
          <path
            d="M -60 380 Q 600 130 1260 380 L 1260 480 L -60 480 Z"
            fill="url(#bloom-grad-planet-subtle)"
          />

          {/* Layer 3: Atmospheric limb haze hugging the curve (Animated Line Drawing) */}
          <path
            className="horizon-arc-line"
            d="M -60 380 Q 600 130 1260 380"
            fill="none"
            stroke="url(#bloom-grad-rim-glow)"
            strokeWidth="32"
            opacity="0.38"
            filter="url(#bloom-filter-wide)"
          />
          <path
            className="horizon-arc-line"
            d="M -60 380 Q 600 130 1260 380"
            fill="none"
            stroke="url(#bloom-grad-rim-glow)"
            strokeWidth="12"
            opacity="0.65"
            filter="url(#bloom-filter-soft)"
          />

          {/* Layer 4: Crisp glowing horizon rim path (Animated Line Drawing) */}
          <path
            ref={horizonPathRef}
            className="horizon-arc-line"
            d="M -60 380 Q 600 130 1260 380"
            fill="none"
            stroke="url(#bloom-grad-rim)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Layer 5: Sunrise beacon / flare right at apex (Ambient Continuous Pulse) */}
          <ellipse
            cx="600"
            cy="255"
            rx="280"
            ry="18"
            fill="url(#bloom-grad-dawn)"
            filter="url(#bloom-filter-soft)"
            className="horizon-pulse-flare"
          />
          <ellipse
            cx="600"
            cy="255"
            rx="90"
            ry="8"
            fill="#ffffff"
            opacity="0.85"
            filter="url(#bloom-filter-rim)"
            className="horizon-pulse-flare"
          />
        </svg>

        {/* 3 Milestone Nodes mapped along the planetary arc */}
        {timelineEvents.map((event, i) => {
          const pos = nodePositions[i];
          const Icon = icons[event.icon];
          return (
            <div
              key={event.title}
              className="tl-item absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Floating Milestone Card & Stem sitting above the arc rim */}
              <div className="flex -translate-y-full flex-col items-center pb-2">
                <article className="tl-card w-[230px] rounded-2xl border border-line/50 bg-surface/35 p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-spice/40 hover:bg-surface/50 hover:shadow-[0_0_24px_var(--glow)] lg:w-[300px] lg:p-5">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-full border border-spice/40 bg-spice/10 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-spice">
                      {event.phase}
                    </span>
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-2">
                      {event.date}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2.5">
                    <Icon size={20} strokeWidth={1.5} className="shrink-0 text-spice" />
                    <h3 className="text-lg font-medium tracking-tight text-ink lg:text-xl">
                      {event.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    {event.description}
                  </p>
                </article>

                {/* Glowing vertical connector stem rising up from the dot */}
                <div
                  className="tl-stem mt-2 w-[1.5px] origin-bottom bg-gradient-to-b from-spice/80 via-spice/40 to-spice"
                  style={{
                    height: "36px",
                    boxShadow: "0 0 8px var(--glow)",
                  }}
                />
              </div>

              {/* Orbital Marker sitting centered right on the glowing arc rim */}
              <div className="tl-dot absolute top-0 z-20 -translate-y-1/2">
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute -inset-1.5 rounded-full opacity-60 blur-xs transition-opacity duration-300"
                    style={{
                      background: "radial-gradient(circle, var(--sand) 0%, var(--spice) 50%, transparent 75%)",
                    }}
                  />
                  <div className="eclipse h-[18px] w-[18px]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE FALLBACK (< 768px): Clean Stacked Milestones over Horizon Bloom ── */}
      <div className="relative mx-auto max-w-lg md:hidden">
        {/* Mobile Horizon Bloom Backdrop */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-44 select-none overflow-hidden opacity-85">
          <svg
            viewBox="0 0 600 200"
            className="h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="mobile-grad-dawn" cx="50%" cy="55%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="25%" stopColor="var(--sand)" stopOpacity="0.65" />
                <stop offset="55%" stopColor="var(--spice)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mobile-grad-rim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.1" />
                <stop offset="20%" stopColor="var(--spice)" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="80%" stopColor="var(--spice)" stopOpacity="0.75" />
                <stop offset="100%" stopColor="var(--ember)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <ellipse
              cx="300"
              cy="120"
              rx="220"
              ry="45"
              fill="url(#mobile-grad-dawn)"
              className="mobile-pulse-flare"
            />
            <path
              className="mobile-arc-line"
              d="M -20 180 Q 300 70 620 180"
              fill="none"
              stroke="url(#mobile-grad-rim)"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Stacked Vertical Milestones */}
        <div className="relative pl-7 pt-6">
          {/* Glowing vertical spine connector for mobile */}
          <div
            className="absolute bottom-6 left-[12px] top-10 w-[2px]"
            style={{
              background: "linear-gradient(to bottom, var(--sand), var(--spice) 60%, var(--ember))",
              boxShadow: "0 0 8px var(--glow)",
            }}
          />

          <div className="space-y-8">
            {timelineEvents.map((event) => {
              const Icon = icons[event.icon];
              return (
                <div key={event.title} className="tl-mobile-item relative">
                  {/* Orbital marker */}
                  <div className="tl-mobile-dot absolute -left-[28px] top-5 z-20">
                    <div className="eclipse h-[18px] w-[18px]" />
                  </div>

                  {/* Milestone Card */}
                  <article className="tl-mobile-card rounded-2xl border border-line/50 bg-surface/35 p-5 backdrop-blur-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-spice/40 bg-spice/10 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-spice">
                        {event.phase}
                      </span>
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-2">
                        {event.date}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2.5">
                      <Icon size={20} strokeWidth={1.5} className="shrink-0 text-spice" />
                      <h3 className="text-lg font-medium tracking-tight text-ink">
                        {event.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                      {event.description}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="reveal relative mx-auto mt-14 max-w-xl rounded-2xl border border-line px-5 py-4 text-sm leading-relaxed text-ink-2 md:mt-20 md:text-center">
        <span className="mr-1.5 text-spice">*</span>
        All dates are tentative and may shift by ±1 week. Final schedule will be confirmed 1 month prior to the event.
      </p>
    </section>
  );
}
