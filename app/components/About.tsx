import { Handshake, ArrowRight } from "lucide-react";
import { Branches, Hub, Laptop } from "@lucasmarkes/hairline/react";
import Image from "next/image";
import SmoothLink from "./SmoothLink";
import GhostFibers from "./GhostFibers";
import DuneEdge from "./DuneEdge";

const features = [
  {
    figure: Laptop,
    label: "A laptop whose lid opens toward the pointer",
    title: "Build & Ship",
    description: "Transform your ideas into working products in 48 hours with cutting-edge tools and technologies.",
  },
  {
    figure: Hub,
    label: "A hub with tiles on links; the tile under the pointer rises",
    title: "Connect & Network",
    description: "Meet fellow innovators, industry experts, and potential co-founders from across the globe.",
  },
  {
    figure: Branches,
    label: "A commit graph; the commit under the pointer rises with its history",
    title: "Learn & Grow",
    description: "Attend expert workshops, gain hands-on experience with new frameworks, and level up your skills.",
  },
];

const facts = [
  { value: "01", label: "Inaugural edition" },
  { value: "48", label: "Hours to build" },
  { value: "04", label: "Max team size" },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-4 overflow-hidden px-5 pb-16 pt-20 md:px-8 md:pb-28 md:pt-32">
      <DuneEdge id="about-edge" />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <GhostFibers
          glowColor="#e9cb8e"
          layers={3}
          twist={1.2}
          threads={72}
          fiberStyle="dots"
          depthOfField={0.85}
          hoverEffect="focus"
          intro
          mouseInteraction
          lineColor="#66280c"
          secondaryColor="#a5663a"
          gradient="depth"
          waves={1}
          volume={0.7}
          spread={1}
          scale={1}
          rotation={18}
          perspective={0.65}
          density={1}
          thickness={1}
          tips={0}
          foldGlow={1}
          speed={0.5}
          flow={0.4}
          rollSpeed={0.15}
          focusDepth={0}
          particles={0.5}
          sparkle={0.5}
          glow={0.8}
          brightness={1}
          vignette={0.3}
          grain={0.06}
          mouseStrength={1}
          pulseOnClick
          lightMode={false}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="eyebrow">01 — About</p>
          <h2 className="section-title mt-5">
            What is <span className="text-spice">hackieee</span>?
          </h2>
          <p className="section-lead mt-6">
            More than a hackathon — it&apos;s a launchpad for the next generation of innovators, builders, and
            changemakers.
          </p>
        </div>

        <div className="reveal mt-10 grid grid-cols-3 border-y border-line md:mt-14">
          {facts.map((f, i) => (
            <div key={f.label} className={`py-5 md:py-7 ${i > 0 ? "border-l border-line pl-4 md:pl-8" : ""}`}>
              <p className="display text-3xl tracking-[0.06em] text-ink md:text-5xl">{f.value}</p>
              <p className="mono-meta mt-2 text-[0.58rem] leading-relaxed text-ink-3 md:text-[0.68rem]">{f.label}</p>
            </div>
          ))}
        </div>

        {/* Each card leads with a Hairline figure: a line drawing that answers the
            pointer. Side by side with the copy until lg, where there's room to stack. */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:gap-6 lg:grid-cols-3">
          {features.map((feat, i) => {
            const Figure = feat.figure;
            return (
              <article
                key={feat.title}
                className="reveal card group relative flex flex-col gap-6 overflow-hidden p-5 transition-colors duration-500 hover:border-line-strong sm:flex-row sm:items-center sm:p-6 lg:flex-col lg:items-stretch lg:p-7"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="hl-panel w-full shrink-0 sm:w-64 lg:w-full">
                  <Figure label={feat.label} play />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-medium tracking-tight text-ink">{feat.title}</h3>
                    <span className="font-mono text-xs tracking-[0.3em] text-ink-3">0{i + 1}</span>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-ink-2">{feat.description}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-spice opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20"
                />
              </article>
            );
          })}
        </div>

        {/* Organisers. The logo's height is tied to the Kiro logo's in the hero
            (see .org-logo in globals.css), so its emblem is never the smaller one. */}
        <div id="organisers" className="reveal mt-16 md:mt-24">
          <h3 className="mono-meta flex items-center justify-center gap-4 text-center text-[0.62rem] font-normal text-ink-3 md:text-[0.7rem]">
            <span className="h-px w-10 bg-line-strong md:w-20" />
            Organised by
            <span className="h-px w-10 bg-line-strong md:w-20" />
          </h3>
          <a
            href="https://www.instagram.com/ieee.cs.sbnu/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex flex-col items-center gap-5 text-center"
          >
            {/* Full lockup; the day theme swaps in the dark-text version. */}
            <Image
              src="/organisers/ieee-cs-nirma-dark.svg"
              alt="IEEE Computer Society, Nirma University"
              width={400}
              height={100}
              unoptimized
              className="org-logo org-logo--night"
            />
            <Image
              src="/organisers/ieee-cs-nirma.svg"
              alt="IEEE Computer Society, Nirma University"
              width={400}
              height={100}
              unoptimized
              className="org-logo org-logo--day"
            />
            <span className="text-[0.95rem] font-medium text-ink">IEEE Computer Society at Nirma University</span>
          </a>
        </div>

        <div className="reveal mt-16 md:mt-24 max-w-3xl mx-auto flex flex-col gap-10 md:gap-14">
          
          {/* Contact Us block */}
          <div className="flex flex-col gap-6 md:gap-8">
            <p className="mono-meta flex items-center justify-center gap-4 text-center text-[0.62rem] text-ink-3 md:text-[0.7rem] w-full">
              <span className="h-px flex-1 bg-line-strong" />
              GET IN TOUCH
              <span className="h-px flex-1 bg-line-strong" />
            </p>
            <SmoothLink href="#contact" className="card group relative overflow-hidden p-6 md:p-8 transition-colors duration-500 hover:border-line-strong flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 min-h-[140px]">
              <span className="grid shrink-0 h-14 w-14 md:h-16 md:w-16 place-items-center rounded-full border border-line-strong text-spice transition-transform duration-500 group-hover:scale-110">
                <Handshake size={24} strokeWidth={1.5} className="md:h-7 md:w-7" />
              </span>
              <div className="flex-1 pr-12">
                <h3 className="text-xl font-medium tracking-tight text-ink md:text-2xl">Contact Us</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2 max-w-md">Have a question, partnership inquiry, or just want to say hello? We&apos;d love to hear from you.</p>
              </div>
              <div className="absolute right-6 top-6 font-mono text-[0.6rem] tracking-[0.3em] text-ink-3 md:right-8 md:top-8">01</div>
              <div className="absolute right-6 bottom-6 text-spice transition-transform duration-500 group-hover:translate-x-1 md:right-8 md:bottom-8">
                <ArrowRight size={20} strokeWidth={1.5} />
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-spice opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-10" />
            </SmoothLink>
          </div>

        </div>
      </div>
    </section>
  );
}
