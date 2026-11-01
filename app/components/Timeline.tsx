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
  step: string;
  title: string;
  date: string;
  description: string;
  xPercent: number; // Left position %
  yPercent: number; // Bottom anchor % aligning right above the arc
  googleDates: string;
}

const MILESTONES: TimelineMilestone[] = [
  {
    id: "step-01",
    step: "01",
    title: "Registration",
    date: "November 15, 2026",
    description: "Team formation & global registration portal goes live.",
    xPercent: 18,
    yPercent: 68,
    googleDates: "20261115T033000Z/20261115T183000Z",
  },
  {
    id: "step-02",
    step: "02",
    title: "Problem Statement Declaration",
    date: "December 20, 2026",
    description: "Challenge tracks unveiled & shortlisted teams confirmed.",
    xPercent: 50,
    yPercent: 57,
    googleDates: "20261220T053000Z/20261220T143000Z",
  },
  {
    id: "step-03",
    step: "03",
    title: "Final Round",
    date: "January 2–4, 2027",
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

      {/* ── DESKTOP: 3 TRANSPARENT FROSTED CARDS FLOATING DIRECTLY ABOVE THE PLANET ARC ── */}
      {/* No lines, no dots — clean, minimal frosted cards floating naturally right over the horizon contour */}
      <div className="relative z-10 mx-auto hidden min-h-[520px] w-full max-w-6xl md:block">
        {MILESTONES.map((item) => {
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            `hackieee 2026: ${item.title}`
          )}&dates=${item.googleDates}&details=${encodeURIComponent(
            `${item.title} (${item.step}) - hackieee 2026. ${item.description}`
          )}&location=${encodeURIComponent("Nirma University, Ahmedabad")}`;

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${item.xPercent}%`, top: `${item.yPercent}%` }}
            >
              <article
                className="timeline-card group relative w-[250px] lg:w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-5 text-center shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-spice/50 hover:bg-black/65 hover:shadow-[0_12px_32px_rgba(226,130,47,0.25)]"
              >
                {/* Subtle top specular hairline for premium depth */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sand/25 to-transparent"
                />

                {/* Custom Dune Typography 01 / 02 / 03 & Date */}
                <div className="flex items-center justify-center gap-3">
                  <span className="display text-2xl tracking-[0.08em] text-sand transition-colors duration-200 group-hover:text-spice lg:text-3xl">
                    {item.step}
                  </span>
                  <span className="font-mono text-xs tracking-wider text-ink-2">
                    {item.date}
                  </span>
                </div>

                {/* Minimal Title */}
                <h3 className="mt-3 text-lg font-medium tracking-tight text-ink transition-colors duration-200 group-hover:text-sand lg:text-xl">
                  {item.title}
                </h3>

                {/* Short, crisp description */}
                <p className="mt-1.5 text-xs leading-relaxed text-ink-3">
                  {item.description}
                </p>

                {/* 1-Click Calendar Sync */}
                <div className="mt-3.5 border-t border-line/25 pt-2.5">
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-sand/80 transition-colors hover:text-sand"
                  >
                    <Calendar size={11} />
                    <span>Sync Date</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE: CLEAN MINIMAL CARDS STACK (< 768px) ── */}
      <div className="relative z-10 mx-auto max-w-sm space-y-4 md:hidden">
        {MILESTONES.map((item) => {
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            `hackieee 2026: ${item.title}`
          )}&dates=${item.googleDates}&details=${encodeURIComponent(
            `${item.title} (${item.step}) - hackieee 2026. ${item.description}`
          )}&location=${encodeURIComponent("Nirma University, Ahmedabad")}`;

          return (
            <article
              key={item.id}
              className="mobile-card rounded-2xl border border-white/10 bg-black/50 p-5 text-center shadow-xl backdrop-blur-xl"
            >
              {/* Custom Dune Typography 01 / 02 / 03 & Date */}
              <div className="flex items-center justify-center gap-2.5">
                <span className="display text-2xl tracking-[0.08em] text-sand">
                  {item.step}
                </span>
                <span className="font-mono text-xs text-ink-2">
                  {item.date}
                </span>
              </div>

              <h3 className="mt-2.5 text-base font-medium tracking-tight text-ink">
                {item.title}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-ink-3">
                {item.description}
              </p>

              <div className="mt-3 border-t border-line/25 pt-2.5">
                <a
                  href={calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-sand"
                >
                  <Calendar size={11} />
                  <span>Add to Calendar</span>
                  <ExternalLink size={10} />
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
