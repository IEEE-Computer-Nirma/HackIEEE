import { FileText } from "lucide-react";

/* Problem statements are announced with the track declaration (see Timeline);
   until then this is a single placeholder. Keeps the #tracks anchor. */
export default function Tracks() {
  return (
    <section id="tracks" className="scroll-mt-4 overflow-hidden px-5 py-20 md:px-8 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-spice opacity-[0.07] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">02 — Problem Statement</p>
          <h2 className="display mt-5 text-[1.8rem] text-ink sm:text-4xl md:text-5xl">Problem Statement</h2>
        </div>

        <div className="reveal card relative mt-10 flex flex-col items-center overflow-hidden px-6 py-14 text-center md:mt-16 md:py-20">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-line-strong text-spice">
            <FileText size={22} strokeWidth={1.5} />
          </span>
          <p className="display mt-7 text-2xl text-ink md:text-4xl">Coming Soon</p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-2">
            The problem statement will be revealed with the track declaration.
          </p>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-spice opacity-10 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
}
