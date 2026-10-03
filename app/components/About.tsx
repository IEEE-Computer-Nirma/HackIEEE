import { Layers, Users, Sparkles, Cpu, Route, AudioWaveform, Handshake, Rocket, Gem, Building2, Megaphone, ArrowRight } from "lucide-react";
import SmoothLink from "./SmoothLink";
import ShapeWaves from "./ShapeWaves";
import DuneEdge from "./DuneEdge";

const features = [
  {
    icon: Layers,
    title: "Build & Ship",
    description: "Transform your ideas into working products in 48 hours with cutting-edge tools and technologies.",
  },
  {
    icon: Users,
    title: "Connect & Network",
    description: "Meet fellow innovators, industry experts, and potential co-founders from across the globe.",
  },
  {
    icon: Sparkles,
    title: "Learn & Grow",
    description: "Attend expert workshops, gain hands-on experience with new frameworks, and level up your skills.",
  },
];

const facts = [
  { value: "48", label: "Hours to build" },
  { value: "05", label: "Tracks" },
  { value: "04", label: "Max team size" },
];

const societies = [
  { icon: Cpu, name: "Computer Society", href: "https://www.instagram.com/ieee.cs.sbnu/" },
  { icon: Route, name: "Intelligent Transportation Systems Society", href: "https://www.instagram.com/ieee.itss.sbnu/" },
  { icon: AudioWaveform, name: "Signal Processing Society", href: "https://www.instagram.com/ieee_sps_sbnu/" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-4 px-5 pb-12 pt-14 md:px-8 md:pb-20 md:pt-24">
      <DuneEdge id="about-edge" />
      <ShapeWaves className="waves--calm-top" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="eyebrow">01 — About</p>
          <h2 className="display mt-5 text-[1.8rem] text-ink sm:text-4xl md:text-5xl">
            What is <span className="text-spice">hackieee</span>?
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">
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

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <article
                key={feat.title}
                className="reveal card group relative overflow-hidden p-6 transition-colors duration-500 hover:border-line-strong md:p-8"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-line-strong text-spice transition-transform duration-500 group-hover:scale-110">
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-xs tracking-[0.3em] text-ink-3">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight text-ink md:mt-8 md:text-2xl">{feat.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{feat.description}</p>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-spice opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20"
                />
              </article>
            );
          })}
        </div>

        <div className="reveal mt-16 md:mt-24">
          <p className="mono-meta flex items-center justify-center gap-4 text-center text-[0.62rem] text-ink-3 md:text-[0.7rem]">
            <span className="h-px w-10 bg-line-strong md:w-20" />
            Organised by
            <span className="h-px w-10 bg-line-strong md:w-20" />
          </p>
          <ul className="relative mt-8 grid grid-cols-3 gap-2 md:mx-auto md:max-w-3xl">
            <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-8 h-px bg-line-strong md:top-10" />
            {societies.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.name} className="relative">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 text-center"
                  >
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-spice/60 bg-bg text-spice shadow-[0_0_30px_-8px_var(--glow)] transition-transform duration-500 group-hover:scale-105 md:h-20 md:w-20">
                      <Icon size={24} strokeWidth={1.4} />
                    </span>
                    <span className="mono-meta text-[0.56rem] leading-[1.7] tracking-[0.18em] text-ink-2 transition-colors group-hover:text-ink md:text-[0.66rem]">
                      IEEE
                      <br />
                      {s.name}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="reveal mt-16 md:mt-24 max-w-3xl mx-auto flex flex-col gap-10 md:gap-14">
          
          {/* Contact Us block (Under IN COLLABORATION WITH) */}
          <div className="flex flex-col gap-6 md:gap-8">
            <p className="mono-meta flex items-center justify-center gap-4 text-center text-[0.62rem] text-ink-3 md:text-[0.7rem] w-full">
              <span className="h-px flex-1 bg-line-strong" />
              IN COLLABORATION WITH
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

          {/* Sponsors block */}
          <div className="flex flex-col gap-6 md:gap-8">
            <p className="mono-meta flex items-center justify-center gap-4 text-center text-[0.62rem] text-ink-3 md:text-[0.7rem] w-full">
              <span className="h-px flex-1 bg-line-strong" />
              SPONSORS
              <span className="h-px flex-1 bg-line-strong" />
            </p>
            <SmoothLink href="/sponsorship" className="card group relative overflow-hidden p-6 md:p-8 transition-colors duration-500 hover:border-line-strong flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 min-h-[140px]">
              <span className="grid shrink-0 h-14 w-14 md:h-16 md:w-16 place-items-center rounded-full border border-line-strong text-spice transition-transform duration-500 group-hover:scale-110">
                <Megaphone size={24} strokeWidth={1.5} className="md:h-7 md:w-7" />
              </span>
              <div className="flex-1 pr-12">
                <h3 className="text-xl font-medium tracking-tight text-ink md:text-2xl">Sponsors</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2 max-w-md">Partner with us to support innovation, student talent, and real-world impact.</p>
              </div>
              <div className="absolute right-6 top-6 font-mono text-[0.6rem] tracking-[0.3em] text-ink-3 md:right-8 md:top-8">02</div>
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
