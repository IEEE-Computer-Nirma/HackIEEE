import { Mic, ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "../data/timeline";

const SPEAKER_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Speaker enquiry — hackieee 2026")}`;

export default function Speakers() {
  return (
    <section id="speakers" className="scroll-mt-4 overflow-hidden px-5 py-20 md:px-8 md:py-32">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">04 — Speakers</p>
          <h2 className="display mt-5 text-[1.8rem] text-ink sm:text-4xl md:text-5xl">Speakers</h2>
        </div>

        <div className="reveal card relative mt-10 flex flex-col items-center overflow-hidden px-6 py-14 text-center md:mt-16 md:py-20">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-line-strong text-spice">
            <Mic size={22} strokeWidth={1.5} />
          </span>
          <p className="display mt-7 text-2xl text-ink md:text-4xl">Coming Soon</p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-2">
            Our speaker line-up will be announced soon. Want to speak at hackieee? Get in touch.
          </p>
          <a href={SPEAKER_MAILTO} className="btn btn-sand mt-8">
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
