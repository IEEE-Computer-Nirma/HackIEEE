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

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* ── Lines end exactly at the last marker; re-measured on every refresh ── */
      const setHeights = () => {
        const dots = section.querySelectorAll<HTMLElement>(".tl-dot");
        const spine = spineRef.current;
        if (!dots.length || !spine) return;
        const last = dots[dots.length - 1].getBoundingClientRect();
        const h = last.top + last.height / 2 - spine.getBoundingClientRect().top;
        if (trackRef.current) trackRef.current.style.height = `${h}px`;
        if (lineRef.current) lineRef.current.style.height = `${h}px`;
      };
      setHeights();
      ScrollTrigger.addEventListener("refreshInit", setHeights);

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: spineRef.current, start: "top 65%", end: "bottom 65%", scrub: 0.8 },
          }
        );
      }

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          if (reduce) return;
          gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item, i) => {
            const card = item.querySelector(".tl-card");
            const dot = item.querySelector(".tl-dot");
            const trigger = { trigger: item, start: "top 85%", toggleActions: "play none none reverse" };
            gsap.from(card, {
              ...(desktop ? { x: i % 2 === 0 ? -70 : 70 } : { y: 40 }),
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: trigger,
            });
            gsap.from(dot, { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2.5)", scrollTrigger: trigger });
          });
        }
      );

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", setHeights);
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="timeline" className="scroll-mt-4 overflow-hidden px-5 py-20 md:px-8 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-spice opacity-[0.05] blur-3xl"
      />

      <div className="reveal relative mx-auto mb-14 max-w-6xl md:mb-24 md:text-center">
        <p className="eyebrow">03 — Timeline</p>
        <h2 className="display mt-5 text-[1.8rem] text-ink sm:text-4xl md:text-5xl">Event Timeline</h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:mx-auto md:text-lg">
          Key milestones on the long walk from idea to impact.
        </p>
        <div className="mt-7">
          <BellReminder />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl" ref={spineRef}>
        <div ref={trackRef} className="tl-spine absolute left-[19px] top-0 w-[2px] md:left-1/2 md:-translate-x-1/2" />
        <div
          ref={lineRef}
          className="absolute left-[19px] top-0 w-[2px] origin-top md:left-1/2 md:-translate-x-1/2"
          style={{
            background: "linear-gradient(to bottom, var(--sand), var(--spice) 60%, var(--ember))",
            boxShadow: "0 0 10px var(--glow), 0 0 24px var(--glow)",
          }}
        />

        {timelineEvents.map((event, i) => {
          const isLeft = i % 2 === 0;
          const Icon = icons[event.icon];
          return (
            <div
              key={event.title}
              className={`tl-item relative mb-10 flex items-start last:mb-0 md:mb-16 ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="tl-dot absolute left-[20px] top-6 z-20 -translate-x-1/2 md:left-1/2">
                <div className="eclipse h-[18px] w-[18px]" />
              </div>

              <div className={`tl-card ml-12 w-full md:ml-0 md:w-[calc(50%-48px)] ${isLeft ? "md:text-right" : ""}`}>
                <article className="card group p-5 transition-colors duration-500 hover:border-line-strong md:p-7">
                  <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${isLeft ? "md:justify-end" : ""}`}>
                    <span className="rounded-full border border-spice/40 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-spice">
                      {event.phase}
                    </span>
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-2">{event.date}</span>
                  </div>
                  <div className={`mt-3 flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                    <Icon size={20} strokeWidth={1.5} className="shrink-0 text-spice" />
                    <h3 className="text-lg font-medium tracking-tight text-ink md:text-xl">{event.title}</h3>
                  </div>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2">{event.description}</p>
                </article>
              </div>

              <div className="hidden md:block md:w-[calc(50%-48px)]" />
            </div>
          );
        })}
      </div>

      <p className="reveal relative mx-auto mt-14 max-w-xl rounded-2xl border border-line px-5 py-4 text-sm leading-relaxed text-ink-2 md:mt-20 md:text-center">
        <span className="mr-1.5 text-spice">*</span>
        All dates are tentative and may shift by ±1 week. Final schedule will be confirmed 1 month prior to the event.
      </p>
    </section>
  );
}
