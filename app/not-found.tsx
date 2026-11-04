"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HorizonStars from "./components/HorizonStars";

export default function NotFound() {
  // Ensure document title reflects 404 state
  useEffect(() => {
    document.title = "404 — Sector Uncharted | HackIEEE 2026-27";
  }, []);

  return (
    <main 
      className="relative z-[80] min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#0b0906] px-6 text-center select-none pt-12"
      style={{ "--grain-opacity": "0" } as React.CSSProperties}
    >
      {/* ── 1. BASE LAYER: HORIZONBLOOM PROCEDURAL STARS (NO OVERLAPPING STARS ON PLANET) ── */}
      <HorizonStars className="fixed inset-0 z-0 w-full h-full" speed={0.4} />

      {/* ── 2. MIDDLE LAYER: UNCLIPPED NATURAL PLANET IMAGE ── */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <div 
          id="planet-disk"
          className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px] lg:w-[680px] lg:h-[680px]"
        >
          <Image
            src="/planet.jpg"
            alt="Planet Arrakis"
            fill
            priority
            sizes="(max-width: 768px) 480px, 680px"
            className="object-contain mix-blend-screen"
          />
        </div>
      </div>

      {/* ── 3. TOP LAYER: TEXT & BUTTON ── */}
      <div className="relative z-20 flex flex-col items-center max-w-xl mx-auto">
        {/* Eyebrow / Kicker in Crisp White Text */}
        <p className="font-mono text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-white mb-2">
          Sector Uncharted 404
        </p>

        {/* Dune Rise 404 Heading */}
        <h1 className="font-[family-name:var(--font-dune)] text-7xl sm:text-8xl md:text-9xl tracking-[0.06em] lowercase text-[#f8cf96] drop-shadow-[0_12px_40px_rgba(248,207,150,0.3)] leading-none my-2">
          404
        </h1>

        {/* Subtitle in Crisp White Text */}
        <p className="mt-4 text-white text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-md text-center">
          The dunes have shifted. The coordinates you seek have drifted into uncharted space.
        </p>

        {/* Return Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="btn btn-sand text-xs sm:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2.5 px-7 py-3 rounded-full shadow-lg"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
