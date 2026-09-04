"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Timeline from "./components/Timeline";
import Footer from "./components/Footer";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollToPlugin);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const id = target.replace("/", "");
    const element = document.querySelector(id);
    
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: id, offsetY: 0 },
        ease: "power3.inOut",
      });
      window.history.pushState(null, "", id);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    
    // Animation configuration
    const animConfig = {
      y: -150, // Gentle but noticeable rise
      duration: 4.5, // Slow and smooth
      ease: "sine.inOut",
      force3D: true, // Force GPU acceleration for Chrome SVG performance
      stagger: {
        each: 0.3,
        repeat: -1,
        yoyo: true,
      },
    };

    // Desktop
    mm.add("(min-width: 768px)", () => {
      gsap.to(".desktop-bar", animConfig);
    });

    // Mobile
    mm.add("(max-width: 767px)", () => {
      gsap.to(".mobile-bar", animConfig);
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col" style={{ background: "#0a0a0f" }} ref={container}>
      
      {/* ── Animated Neon Rise Bars Background (Desktop) ── */}
      <div className="absolute top-0 inset-x-0 h-[100dvh] overflow-hidden z-0 pointer-events-none hidden md:block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1920 1080"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="b0" gradientUnits="userSpaceOnUse" x1="0" y1="911" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(9,19,65)" /><stop offset="0.3" stopColor="rgb(69,84,211)" />
              <stop offset="0.5" stopColor="rgb(169,129,223)" /><stop offset="0.7" stopColor="rgb(237,102,192)" />
              <stop offset="1" stopColor="rgb(245,75,95)" />
            </linearGradient>
            <linearGradient id="b1" gradientUnits="userSpaceOnUse" x1="0" y1="819" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(15,22,58)" /><stop offset="0.25" stopColor="rgb(43,59,180)" />
              <stop offset="0.5" stopColor="rgb(166,132,231)" /><stop offset="0.75" stopColor="rgb(248,108,196)" />
              <stop offset="1" stopColor="rgb(255,82,102)" />
            </linearGradient>
            <linearGradient id="b2" gradientUnits="userSpaceOnUse" x1="0" y1="745" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,13,39)" /><stop offset="0.2" stopColor="rgb(27,41,157)" />
              <stop offset="0.45" stopColor="rgb(105,101,215)" /><stop offset="0.65" stopColor="rgb(193,120,209)" />
              <stop offset="0.85" stopColor="rgb(238,92,156)" /><stop offset="1" stopColor="rgb(241,74,93)" />
            </linearGradient>
            <linearGradient id="b3" gradientUnits="userSpaceOnUse" x1="0" y1="681" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(21,27,53)" /><stop offset="0.2" stopColor="rgb(36,50,165)" />
              <stop offset="0.4" stopColor="rgb(106,110,227)" /><stop offset="0.6" stopColor="rgb(200,137,225)" />
              <stop offset="0.8" stopColor="rgb(249,112,194)" /><stop offset="1" stopColor="rgb(255,87,107)" />
            </linearGradient>
            <linearGradient id="b4" gradientUnits="userSpaceOnUse" x1="0" y1="613" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,13,40)" /><stop offset="0.15" stopColor="rgb(24,38,157)" />
              <stop offset="0.35" stopColor="rgb(68,84,211)" /><stop offset="0.55" stopColor="rgb(182,129,221)" />
              <stop offset="0.75" stopColor="rgb(241,100,181)" /><stop offset="1" stopColor="rgb(247,75,96)" />
            </linearGradient>
            <linearGradient id="b5" gradientUnits="userSpaceOnUse" x1="0" y1="535" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(15,21,48)" /><stop offset="0.2" stopColor="rgb(40,56,175)" />
              <stop offset="0.4" stopColor="rgb(108,108,227)" /><stop offset="0.6" stopColor="rgb(201,132,223)" />
              <stop offset="0.8" stopColor="rgb(249,107,189)" /><stop offset="1" stopColor="rgb(255,83,103)" />
            </linearGradient>
            <linearGradient id="b6" gradientUnits="userSpaceOnUse" x1="0" y1="446" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(9,17,61)" /><stop offset="0.2" stopColor="rgb(32,47,163)" />
              <stop offset="0.4" stopColor="rgb(96,97,212)" /><stop offset="0.6" stopColor="rgb(199,117,205)" />
              <stop offset="0.8" stopColor="rgb(235,94,161)" /><stop offset="1" stopColor="rgb(240,73,93)" />
            </linearGradient>
            <linearGradient id="b7" gradientUnits="userSpaceOnUse" x1="0" y1="357" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(21,31,77)" /><stop offset="0.2" stopColor="rgb(45,60,178)" />
              <stop offset="0.4" stopColor="rgb(113,112,228)" /><stop offset="0.6" stopColor="rgb(215,130,218)" />
              <stop offset="0.8" stopColor="rgb(250,106,171)" /><stop offset="1" stopColor="rgb(255,86,106)" />
            </linearGradient>
            <linearGradient id="b8" gradientUnits="userSpaceOnUse" x1="0" y1="272" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,15,49)" /><stop offset="0.2" stopColor="rgb(37,52,174)" />
              <stop offset="0.4" stopColor="rgb(108,104,221)" /><stop offset="0.6" stopColor="rgb(200,123,214)" />
              <stop offset="0.8" stopColor="rgb(244,95,158)" /><stop offset="1" stopColor="rgb(248,76,96)" />
            </linearGradient>
            <linearGradient id="b9" gradientUnits="userSpaceOnUse" x1="0" y1="189" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(17,23,50)" /><stop offset="0.2" stopColor="rgb(37,52,169)" />
              <stop offset="0.4" stopColor="rgb(97,104,226)" /><stop offset="0.6" stopColor="rgb(206,132,222)" />
              <stop offset="0.8" stopColor="rgb(249,108,183)" /><stop offset="1" stopColor="rgb(255,85,105)" />
            </linearGradient>
            <linearGradient id="b10" gradientUnits="userSpaceOnUse" x1="0" y1="103" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,13,39)" /><stop offset="0.2" stopColor="rgb(30,44,160)" />
              <stop offset="0.4" stopColor="rgb(92,95,212)" /><stop offset="0.6" stopColor="rgb(185,122,210)" />
              <stop offset="0.8" stopColor="rgb(234,97,179)" /><stop offset="1" stopColor="rgb(239,73,93)" />
            </linearGradient>
            <linearGradient id="b11" gradientUnits="userSpaceOnUse" x1="0" y1="9" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(17,23,50)" /><stop offset="0.2" stopColor="rgb(42,58,176)" />
              <stop offset="0.4" stopColor="rgb(109,109,228)" /><stop offset="0.6" stopColor="rgb(213,130,219)" />
              <stop offset="0.8" stopColor="rgb(249,109,189)" /><stop offset="1" stopColor="rgb(255,85,105)" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="#0a0a0f" />
          {/* GSAP animated bars */}
          <rect className="desktop-bar" x="-17"  y="911" width="194" height="469"  fill="url(#b0)" />
          <rect className="desktop-bar" x="143"  y="819" width="194" height="561"  fill="url(#b1)" />
          <rect className="desktop-bar" x="303"  y="745" width="194" height="635"  fill="url(#b2)" />
          <rect className="desktop-bar" x="463"  y="681" width="194" height="699"  fill="url(#b3)" />
          <rect className="desktop-bar" x="623"  y="613" width="194" height="767"  fill="url(#b4)" />
          <rect className="desktop-bar" x="783"  y="535" width="194" height="845"  fill="url(#b5)" />
          <rect className="desktop-bar" x="943"  y="446" width="194" height="934"  fill="url(#b6)" />
          <rect className="desktop-bar" x="1103" y="357" width="194" height="1023" fill="url(#b7)" />
          <rect className="desktop-bar" x="1263" y="272" width="194" height="1108" fill="url(#b8)" />
          <rect className="desktop-bar" x="1423" y="189" width="194" height="1191" fill="url(#b9)" />
          <rect className="desktop-bar" x="1583" y="103" width="194" height="1277" fill="url(#b10)" />
          <rect className="desktop-bar" x="1743" y="9"   width="194" height="1371" fill="url(#b11)" />
        </svg>
      </div>

      {/* ── Animated Neon Rise Bars Background (Mobile/Tablet) ── */}
      <div className="absolute top-0 inset-x-0 h-[100dvh] overflow-hidden z-0 pointer-events-none block md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1290 2796"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="bar0" gradientUnits="userSpaceOnUse" x1="0" y1="2246.61" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(9,18,63)"/><stop offset="0.2581" stopColor="rgb(60,76,201)"/><stop offset="0.5161" stopColor="rgb(181,129,223)"/><stop offset="0.7742" stopColor="rgb(244,93,151)"/><stop offset="1.0000" stopColor="rgb(248,76,96)"/></linearGradient>
            <linearGradient id="bar1" gradientUnits="userSpaceOnUse" x1="0" y1="2006.37" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(18,23,50)"/><stop offset="0.2581" stopColor="rgb(61,76,198)"/><stop offset="0.5161" stopColor="rgb(177,138,232)"/><stop offset="0.7742" stopColor="rgb(250,106,174)"/><stop offset="1.0000" stopColor="rgb(255,85,105)"/></linearGradient>
            <linearGradient id="bar2" gradientUnits="userSpaceOnUse" x1="0" y1="1830.70" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(7,13,39)"/><stop offset="0.2581" stopColor="rgb(41,56,173)"/><stop offset="0.5161" stopColor="rgb(145,118,217)"/><stop offset="0.7742" stopColor="rgb(234,96,175)"/><stop offset="1.0000" stopColor="rgb(239,73,93)"/></linearGradient>
            <linearGradient id="bar3" gradientUnits="userSpaceOnUse" x1="0" y1="1707.61" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(17,23,50)"/><stop offset="0.2581" stopColor="rgb(48,64,183)"/><stop offset="0.5161" stopColor="rgb(154,128,230)"/><stop offset="0.7742" stopColor="rgb(249,109,193)"/><stop offset="1.0000" stopColor="rgb(255,84,104)"/></linearGradient>
            <linearGradient id="bar4" gradientUnits="userSpaceOnUse" x1="0" y1="1596.89" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(7,13,40)"/><stop offset="0.2581" stopColor="rgb(45,61,184)"/><stop offset="0.5161" stopColor="rgb(156,124,225)"/><stop offset="0.7742" stopColor="rgb(242,99,176)"/><stop offset="1.0000" stopColor="rgb(248,76,96)"/></linearGradient>
            <linearGradient id="bar5" gradientUnits="userSpaceOnUse" x1="0" y1="1457.29" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(21,28,63)"/><stop offset="0.2581" stopColor="rgb(65,81,202)"/><stop offset="0.5161" stopColor="rgb(183,141,233)"/><stop offset="0.7742" stopColor="rgb(251,105,167)"/><stop offset="1.0000" stopColor="rgb(255,86,106)"/></linearGradient>
            <linearGradient id="bar6" gradientUnits="userSpaceOnUse" x1="0" y1="1273.87" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(9,18,64)"/><stop offset="0.2581" stopColor="rgb(59,74,197)"/><stop offset="0.5161" stopColor="rgb(178,124,215)"/><stop offset="0.7742" stopColor="rgb(237,89,142)"/><stop offset="1.0000" stopColor="rgb(240,73,93)"/></linearGradient>
            <linearGradient id="bar7" gradientUnits="userSpaceOnUse" x1="0" y1="1064.10" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(17,26,70)"/><stop offset="0.2581" stopColor="rgb(66,82,207)"/><stop offset="0.5161" stopColor="rgb(188,136,229)"/><stop offset="0.7742" stopColor="rgb(251,100,157)"/><stop offset="1.0000" stopColor="rgb(255,83,103)"/></linearGradient>
            <linearGradient id="bar8" gradientUnits="userSpaceOnUse" x1="0" y1="859.19" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(7,13,40)"/><stop offset="0.2581" stopColor="rgb(51,66,190)"/><stop offset="0.5161" stopColor="rgb(166,128,224)"/><stop offset="0.7742" stopColor="rgb(242,96,165)"/><stop offset="1.0000" stopColor="rgb(247,75,96)"/></linearGradient>
            <linearGradient id="bar9" gradientUnits="userSpaceOnUse" x1="0" y1="677.59" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(22,27,54)"/><stop offset="0.2581" stopColor="rgb(55,70,188)"/><stop offset="0.5161" stopColor="rgb(160,133,232)"/><stop offset="0.7742" stopColor="rgb(249,111,190)"/><stop offset="1.0000" stopColor="rgb(255,88,107)"/></linearGradient>
            <linearGradient id="bar10" gradientUnits="userSpaceOnUse" x1="0" y1="513.14" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(7,13,39)"/><stop offset="0.2581" stopColor="rgb(38,54,171)"/><stop offset="0.5161" stopColor="rgb(143,117,218)"/><stop offset="0.7742" stopColor="rgb(236,98,181)"/><stop offset="1.0000" stopColor="rgb(242,74,94)"/></linearGradient>
            <linearGradient id="bar11" gradientUnits="userSpaceOnUse" x1="0" y1="346.38" x2="0" y2="2796"><stop offset="0.0000" stopColor="rgb(14,20,47)"/><stop offset="0.2581" stopColor="rgb(52,67,190)"/><stop offset="0.5161" stopColor="rgb(166,132,231)"/><stop offset="0.7742" stopColor="rgb(249,105,182)"/><stop offset="1.0000" stopColor="rgb(255,82,102)"/></linearGradient>
          </defs>
          <rect width="1290" height="2796" fill="#0a0a0f" />
          <rect className="mobile-bar" x="-11.39" y="2246.61" width="130.29" height="849.39" fill="url(#bar0)" />
          <rect className="mobile-bar" x="96.11"  y="2006.37" width="130.29" height="1089.63" fill="url(#bar1)" />
          <rect className="mobile-bar" x="203.60" y="1830.70" width="130.29" height="1265.30" fill="url(#bar2)" />
          <rect className="mobile-bar" x="311.11" y="1707.61" width="130.29" height="1388.39" fill="url(#bar3)" />
          <rect className="mobile-bar" x="418.61" y="1596.89" width="130.29" height="1499.11" fill="url(#bar4)" />
          <rect className="mobile-bar" x="526.11" y="1457.29" width="130.29" height="1638.71" fill="url(#bar5)" />
          <rect className="mobile-bar" x="633.61" y="1273.87" width="130.29" height="1822.13" fill="url(#bar6)" />
          <rect className="mobile-bar" x="741.11" y="1064.10" width="130.29" height="2031.90" fill="url(#bar7)" />
          <rect className="mobile-bar" x="848.61" y="859.19" width="130.29" height="2236.81" fill="url(#bar8)" />
          <rect className="mobile-bar" x="956.11" y="677.59" width="130.29" height="2418.41" fill="url(#bar9)" />
          <rect className="mobile-bar" x="1063.61" y="513.14" width="130.29" height="2582.86" fill="url(#bar10)" />
          <rect className="mobile-bar" x="1171.11" y="346.38" width="130.29" height="2749.62" fill="url(#bar11)" />
        </svg>
      </div>

      {/* ── Hero Content ── */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[100dvh] transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1
          className="text-[clamp(3rem,10vw,7.5rem)] font-bold tracking-tighter leading-[1.1] md:leading-[1] mb-6"
          style={{ color: "#ffebe1" }}
        >
          HackIEEE
        </h1>

        <p
          className="text-base md:text-lg lg:text-xl max-w-lg font-medium leading-relaxed mb-10"
          style={{ color: "rgba(255, 235, 225, 0.75)" }}
        >
          Build, stage and ship code that feels<br className="hidden md:block" />
          considered, from first draft to launch.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 w-full md:w-auto">
          <a
            href="#tracks"
            onClick={(e) => handleSmoothScroll(e, "#tracks")}
            className="w-full md:w-auto px-8 py-3.5 text-[15px] font-semibold rounded-2xl shadow-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#ffebe1",
              color: "#0a0a0f",
            }}
          >
            See our tracks
          </a>
          <a
            href="#timeline"
            onClick={(e) => handleSmoothScroll(e, "#timeline")}
            className="w-full md:w-auto px-8 py-3.5 text-[15px] font-semibold rounded-2xl shadow-lg transition-opacity hover:opacity-90 bg-white/10 backdrop-blur-md text-white border border-white/20 md:bg-white md:text-black md:border-transparent md:backdrop-blur-none"
          >
            Timeline
          </a>
        </div>
      </div>
      
      {/* ── Page Content ── */}
      <div className="relative z-20 w-full bg-[#05060f]">
        <About />
        <Tracks />
        <Timeline />
        <Footer />
      </div>

    </div>
  );
}
