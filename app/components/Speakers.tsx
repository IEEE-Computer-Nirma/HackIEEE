import { Mic, ArrowRight } from "lucide-react";
import { Terminal, Dish, Phosphor, Turntable } from "@lucasmarkes/hairline/react";
import { CONTACT_EMAIL } from "../data/timeline";

const SPEAKER_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Speaker enquiry — hackieee 2026")}`;

const SPEAKERS = [
  {
    figure: Terminal,
    label: "A terminal console; its cursor and prompt answer the pointer",
    speaker: "Speaker 01",
    title: "To be announced",
  },
  {
    figure: Dish,
    label: "A communications dish; it turns to track the pointer",
    speaker: "Speaker 02",
    title: "To be announced",
  },
  {
    figure: Phosphor,
    label: "A phosphor display; its grid lights up under the pointer",
    speaker: "Speaker 03",
    title: "To be announced",
  },
  {
    figure: Turntable,
    label: "A precision turntable; its platter rotates with the pointer",
    speaker: "Speaker 04",
    title: "To be announced",
  },
];

export default function Speakers() {
  return (
    <section id="speakers" className="relative scroll-mt-4 overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-spice opacity-[0.06] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal mx-auto max-w-3xl md:text-center">
          <p className="eyebrow">04 — Speakers</p>
          <h2 className="section-title mt-5">Meet the Speakers</h2>
          <p className="section-lead mt-6 md:mx-auto">
            Talks and workshops from people building in the field. The line-up is coming soon.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:mt-20 md:gap-6 lg:grid-cols-4">
          {SPEAKERS.map((slot, i) => {
            const Figure = slot.figure;
            return (
              <li
                key={slot.speaker}
                className="reveal card group relative flex flex-col items-center overflow-hidden p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-spice/40 md:p-5"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* Hairline interactive figure panel replacing the unfinished outline */}
                <div className="hl-panel w-full aspect-[5/4] shrink-0 mb-4">
                  <Figure label={slot.label} play />
                </div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-ink-3">
                  {slot.speaker}
                </p>
                <p className="display mt-2 text-sm text-ink md:text-base">
                  {slot.title}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="reveal card relative mt-6 flex flex-col items-start gap-6 overflow-hidden p-8 md:mt-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex items-start gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line-strong text-spice">
              <Mic size={22} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-2xl font-medium tracking-tight text-ink">Want to speak at hackieee?</h3>
              <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-ink-2">
                We&apos;re looking for speakers and workshop hosts. Tell us what you&apos;d like to share.
              </p>
            </div>
          </div>
          <a href={SPEAKER_MAILTO} className="btn btn-sand shrink-0">
            Speaker enquiries <ArrowRight size={18} strokeWidth={1.75} />
          </a>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-spice opacity-10 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
}
