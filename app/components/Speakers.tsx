import { Mic, UserRound, ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "../data/timeline";

const SPEAKER_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Speaker enquiry — hackieee 2026")}`;

// Placeholder slots until the line-up is announced.
const SLOTS = 4;

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
          {Array.from({ length: SLOTS }, (_, i) => (
            <li
              key={i}
              className="reveal card relative flex flex-col items-center overflow-hidden px-4 py-8 text-center md:px-6 md:py-10"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-line-strong text-ink-3 md:h-28 md:w-28">
                <UserRound size={34} strokeWidth={1.2} />
              </span>
              <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-ink-3">Speaker 0{i + 1}</p>
              <p className="display mt-2 text-sm text-ink md:text-base">To be announced</p>
            </li>
          ))}
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
