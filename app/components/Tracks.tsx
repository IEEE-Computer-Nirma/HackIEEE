"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ShieldCheck, HeartPulse, Leaf, Landmark, Lightbulb, ChevronDown } from "lucide-react";
import MorphSlider, { type MorphItem } from "./MorphSlider";

const tracks = [
  {
    title: "Cyber Security",
    description: "Build robust defenses and secure systems to protect data, privacy, and critical infrastructure.",
    icon: ShieldCheck,
    image: "/tracks/cyber-security.webp",
  },
  {
    title: "Healthcare",
    description: "Innovate at the intersection of technology and healthcare to save and improve lives.",
    icon: HeartPulse,
    image: "/tracks/healthcare.webp",
  },
  {
    title: "Sustainability",
    description: "Build tech solutions that address climate change, resource management, and environmental challenges.",
    icon: Leaf,
    image: "/tracks/sustainability.webp",
  },
  {
    title: "Finance",
    description: "Reimagine the financial landscape with innovative fintech solutions, inclusion tools, and digital economies.",
    icon: Landmark,
    image: "/tracks/finance.webp",
  },
  {
    title: "Open Track",
    description: "Unleash your creativity without boundaries. Pitch breakthrough ideas across any domain or emerging tech.",
    icon: Lightbulb,
    image: "/tracks/open-track.webp",
  },
];

// Stable reference — the slider rebuilds its WebGL scene when `items` changes.
const slides: MorphItem[] = tracks.map((t) => ({ image: t.image, caption: t.title }));

const AUTOPLAY_MS = 5500;

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function Tracks() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE_QUERY).matches, () => true);
  const explorerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = explorerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tour the tracks until the visitor takes over; hover only pauses.
  const running = inView && !paused && !interacted && !reduce;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % tracks.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [running, active]);

  const select = (i: number) => {
    setInteracted(true);
    setActive(i);
  };

  return (
    <section id="tracks" className="scroll-mt-4 overflow-hidden px-5 py-20 md:px-8 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-spice opacity-[0.07] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">02 — Tracks</p>
          <h2 className="display mt-5 text-[1.8rem] text-ink sm:text-4xl md:text-5xl">Hackathon Tracks</h2>
          <p className="mt-6 text-base leading-relaxed text-ink-2 md:text-lg">
            Five paths across the sand. Each track brings its own challenges and a dedicated prize pool.
          </p>
        </div>

        <div
          ref={explorerRef}
          className="reveal mt-10 grid grid-cols-1 gap-4 md:mt-16 lg:grid-cols-12 lg:items-center lg:gap-12"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
        >
          {/* The morph stage */}
          <div className="lg:col-span-6" onPointerDown={() => setInteracted(true)}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-line shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] lg:aspect-[5/4]">
              <MorphSlider
                items={slides}
                activeIndex={active}
                onIndexChange={setActive}
                transition="melt"
                duration={1.2}
                intensity={0.5}
                aberration={0.3}
                drift={0.45}
                radius={18}
                overlayColor="#0b0906"
                showIndicators={false}
                label="Track artwork"
              />
              <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-black/35 px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.3em] text-[#f6e6cb] backdrop-blur-sm">
                0{active + 1} / 0{tracks.length}
              </span>
            </div>
          </div>

          {/* Track list — an accordion; the open row is the slide on stage */}
          <ol className="flex flex-col gap-2 lg:col-span-6">
            {tracks.map((track, i) => {
              const Icon = track.icon;
              const open = i === active;
              return (
                <li
                  key={track.title}
                  className={`relative overflow-hidden rounded-2xl border transition-colors duration-500 ${
                    open ? "border-spice/45 bg-surface" : "border-line hover:border-line-strong"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`track-tab-${i}`}
                      aria-expanded={open}
                      aria-controls={`track-panel-${i}`}
                      onClick={() => select(i)}
                      className="flex w-full items-center gap-3.5 px-4 py-3 text-left md:gap-4 md:px-5 md:py-4"
                    >
                      <span className="font-mono text-[0.68rem] tracking-[0.2em] text-ink-3">0{i + 1}</span>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                          open ? "border-spice/60 text-spice" : "border-line-strong text-ink-2"
                        }`}
                      >
                        <Icon size={17} strokeWidth={1.5} />
                      </span>
                      <span className={`display flex-1 text-[0.98rem] transition-colors md:text-lg ${open ? "text-ink" : "text-ink-2"}`}>
                        {track.title}
                      </span>
                      <ChevronDown
                        size={18}
                        strokeWidth={1.6}
                        className={`shrink-0 text-ink-3 transition-transform duration-500 ${open ? "rotate-180 text-spice" : ""}`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`track-panel-${i}`}
                    role="region"
                    aria-labelledby={`track-tab-${i}`}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 pb-3.5 pl-[4.6rem] text-[0.93rem] leading-relaxed text-ink-2 md:px-5 md:pb-5 md:pl-[5.4rem]">
                        {track.description}
                      </p>
                    </div>
                  </div>
                  {/* autoplay timer */}
                  {open && running && (
                    <span
                      key={active}
                      aria-hidden="true"
                      className="track-timer absolute inset-x-0 bottom-0 h-px origin-left bg-spice"
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
