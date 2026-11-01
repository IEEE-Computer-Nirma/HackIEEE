"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { UserPlus, CalendarX, FileCode, Code, Trophy } from "lucide-react";
import { timelineEvents, type TimelineEvent } from "../data/timeline";
import BellReminder from "./BellReminder";
import HorizonBloom, { type HorizonBloomHandle } from "./HorizonBloom";

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
  const desktopBloomRef = useRef<HorizonBloomHandle>(null);

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
            const items = section.querySelectorAll<HTMLElement>(".tl-item");
            const dots = section.querySelectorAll<HTMLElement>(".tl-dot");
            const stems = section.querySelectorAll<HTMLElement>(".tl-stem");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                  desktopBloomRef.current?.bloom(0.5, 1.25);
                },
              },
            });

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
              }
            )
              .fromTo(
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
              )
              .fromTo(
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
            const mobileItems = section.querySelectorAll<HTMLElement>(".tl-mobile-item");

            const mobileTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });

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
    <section ref={sectionRef} id="timeline" className="relative scroll-mt-4 overflow-hidden px-5 py-24 md:px-8 md:py-36">
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

      {/* ── DESKTOP: WebGL Horizon Bloom Planetary Arc (md: and up) ── */}
      <div className="relative mx-auto hidden min-h-[580px] w-full max-w-6xl md:block">
        {/* Horizon Bloom WebGL Canvas Container */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <HorizonBloom
            ref={desktopBloomRef}
            colors={["#f8cf96", "#993e0e"]}
            backgroundColor="transparent"
            horizon={0.65}
            curvature={1.05}
            sunPosition={0}
            sunrise={1.2}
            spread={0.45}
            atmosphere={1.25}
            thickness={1.15}
            rim={1.25}
            flare={1.15}
            airglow={0.5}
            clouds={0.65}
            stars={0.8}
            aurora={0.85}
            autoAurora={true}
            speed={0.45}
            drift={0.35}
            parallax={0.6}
            bloom={0.6}
            grain={0.15}
            interactive={true}
            intro={true}
            className="h-full w-full"
          />
        </div>

        {/* Milestone Nodes mapped along the planetary arc */}
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
                <article className="tl-card w-[230px] rounded-2xl border border-line/60 bg-surface/50 p-4 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:border-spice/50 hover:bg-surface/70 hover:shadow-[0_0_28px_var(--glow)] lg:w-[300px] lg:p-5">
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
                    className="absolute -inset-1.5 rounded-full opacity-70 blur-xs transition-opacity duration-300"
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

      {/* ── MOBILE VIEW (< 768px): Vertical Milestones with Horizon Bloom Atmosphere ── */}
      <div className="relative mx-auto max-w-lg md:hidden">
        {/* Mobile Horizon Bloom Backdrop */}
        <div className="pointer-events-none absolute inset-x-0 -top-12 h-64 select-none overflow-hidden rounded-2xl opacity-80">
          <HorizonBloom
            colors={["#f8cf96", "#993e0e"]}
            backgroundColor="transparent"
            horizon={0.55}
            curvature={1.4}
            sunPosition={0}
            sunrise={1.1}
            spread={0.5}
            atmosphere={1.2}
            thickness={1.1}
            rim={1.2}
            flare={1}
            airglow={0.4}
            clouds={0.5}
            stars={0.7}
            aurora={0.7}
            autoAurora={true}
            speed={0.4}
            bloom={0.5}
            grain={0.15}
            interactive={false}
            intro={true}
            className="h-full w-full"
          />
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
                  <article className="tl-mobile-card rounded-2xl border border-line/60 bg-surface/50 p-5 shadow-md backdrop-blur-md">
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
