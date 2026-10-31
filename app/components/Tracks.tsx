"use client";

import { Vault } from "@lucasmarkes/hairline/react";

/* Problem statements and tracks are announced with the track declaration (see Timeline);
   until then this section remains sealed. Keeps the #tracks anchor. */
export default function Tracks() {
  return (
    <section id="tracks" className="relative scroll-mt-4 overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-24 h-96 w-96 rounded-full bg-spice opacity-[0.07] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="eyebrow">02 — Tracks & Challenges</p>
          <h2 className="section-title mt-5">Problem Statements</h2>
          <p className="section-lead mt-6">
            Tracks and challenges will be revealed with the official track declaration. Stay tuned for problem statements and guidelines.
          </p>
        </div>

        {/* Problem statements stay sealed until the track declaration (see Timeline). */}
        <div className="reveal card mt-10 flex flex-col-reverse items-stretch gap-6 p-6 sm:flex-row sm:items-center sm:p-8 md:mt-16 md:gap-10 md:p-10">
          <div className="flex-1">
            <p className="eyebrow">Sealed</p>
            <h3 className="mt-4 text-2xl font-medium tracking-tight text-ink md:text-3xl">
              Problem Statements: Coming Soon
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ink-2">
              Problem statements and challenge tracks will be revealed with the official track declaration on December 20, 2026.
            </p>
          </div>
          {/* A vault: its dial turns with the pointer until the bolts draw back. */}
          <div className="hl-panel w-full shrink-0 sm:w-72">
            <Vault label="A vault door; its dial turns with the pointer until the bolts draw back" play />
          </div>
        </div>
      </div>
    </section>
  );
}
