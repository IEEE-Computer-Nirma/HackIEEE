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
      className="relative z-[80] min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#0b0906] px-4 text-center select-none"
      style={{ "--grain-opacity": "0" } as React.CSSProperties}
    >
      {/* ── 1. BASE LAYER: HORIZONBLOOM PROCEDURAL STARS ── */}
      <HorizonStars className="fixed inset-0 z-0 w-full h-full" speed={0.4} />

      {/* ── 2. MIDDLE LAYER: UNCLIPPED NATURAL PLANET (TRANSPARENT WEBP, PROMINENT ON MOBILE) ── */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <div 
          id="planet-disk"
          className="relative w-[min(92vw,360px)] h-[min(92vw,360px)] sm:w-[480px] sm:h-[480px] md:w-[580px] md:h-[580px] lg:w-[660px] lg:h-[660px]"
        >
          <Image
            src="/planet.webp"
            alt="Planet Arrakis"
            fill
            priority
            sizes="(max-width: 640px) 360px, (max-width: 1024px) 580px, 660px"
            className="object-contain pointer-events-none select-none"
          />
        </div>
      </div>

      {/* ── 3. TOP LAYER: TEXT & BUTTON (PERFECTLY CENTERED IN PLANET) ── */}
      <div className="relative z-20 flex flex-col items-center max-w-xl mx-auto px-4">
        {/* Eyebrow / Kicker in Crisp White Text */}
        <p className="font-mono text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.24em] uppercase text-white mb-1.5 sm:mb-2">
          Sector Uncharted 404
        </p>

        {/* Dune Rise 404 Heading */}
        <h1 className="font-[family-name:var(--font-dune)] text-7xl sm:text-8xl md:text-9xl tracking-[0.06em] lowercase text-[#f8cf96] drop-shadow-[0_12px_40px_rgba(248,207,150,0.3)] leading-none my-1 sm:my-2">
          404
        </h1>

        {/* Subtitle in Crisp White Text */}
        <p className="mt-2.5 sm:mt-4 text-white text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-[280px] sm:max-w-md text-center">
          The dunes have shifted. The coordinates you seek have drifted into uncharted space.
        </p>

        {/* Return Button */}
        <div className="mt-6 sm:mt-8">
          <Link
            href="/"
            className="btn btn-sand text-xs sm:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-lg"
          >
            <ArrowLeft size={15} strokeWidth={2} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
