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

function DraggableThopter({ initialTop, initialRight, widthClass, opacityClass }: { initialTop: number, initialRight: number, widthClass: string, opacityClass: string }) {
  const [pos, setPos] = useState({ top: initialTop, right: initialRight });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const parent = dragRef.current?.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const newRight = ((rect.right - e.clientX) / rect.width) * 100;
      const newTop = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ top: newTop, right: newRight });
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      ref={dragRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute ${widthClass} ${opacityClass} cursor-move touch-none ${isDragging ? 'z-50 ring-2 ring-red-500 bg-black/20' : ''}`}
      style={{ top: `${pos.top}%`, right: `${pos.right}%`, transform: 'translate(50%, -50%)' }}
    >
      <video src="/ornithopter.webm" autoPlay loop muted playsInline className="w-full h-auto pointer-events-none" />
      {isDragging && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          top-[{pos.top.toFixed(1)}%] right-[{pos.right.toFixed(1)}%]
        </div>
      )}
    </div>
  );
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
      
      {/* ── Background: Dune + Rocks stacked for depth ── */}
      <div className="absolute top-0 inset-x-0 h-[100dvh] overflow-hidden z-0">
        {/* Back layer: Dune landscape */}
        <img 
          src="/Hero-bg-dune.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* ── Ornithopter Formation ── */}
        <DraggableThopter initialTop={68} initialRight={18} widthClass="w-[150px] md:w-[250px] lg:w-[350px]" opacityClass="opacity-100" />
        <DraggableThopter initialTop={58} initialRight={26} widthClass="w-[100px] md:w-[160px] lg:w-[200px]" opacityClass="opacity-90" />
        <DraggableThopter initialTop={59} initialRight={12} widthClass="w-[80px] md:w-[130px] lg:w-[170px]" opacityClass="opacity-80" />

        {/* Front layer: Rocky foreground for depth */}
        <img 
          src="/Hero-bg-rocks.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

                  {/* ── Hero Content ── */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[100dvh] transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1
          className="text-[clamp(3rem,10vw,7.5rem)] tracking-tighter leading-[1.1] md:leading-[1] mb-6"
          style={{ color: "#f59c0c", fontFamily: "var(--font-dune-rise), sans-serif", fontWeight: "normal" }}
        >
          hackIeee
        </h1>

        <p
          className="text-base md:text-lg lg:text-xl max-w-lg font-medium leading-relaxed mb-10 tracking-widest uppercase"
          style={{ color: "rgba(255, 255, 255, 0.75)" }}
        >
          People . Idea . possibility
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 w-full md:w-auto">
          <a href="#tracks" onClick={(e) => handleSmoothScroll(e, "#tracks")} className="w-full md:w-auto block">
            <div 
              className="flex items-center justify-center px-6 md:px-8 h-12 rounded-full shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#E9CB8E", color: "#8a6200" }}
            >
              <span className="text-xs md:text-sm whitespace-nowrap leading-none pt-1" style={{ fontFamily: "var(--font-dune-rise), sans-serif", fontWeight: "bold" }}>
                See our tracks
              </span>
            </div>
          </a>
          <a href="#timeline" onClick={(e) => handleSmoothScroll(e, "#timeline")} className="w-full md:w-auto block">
            <div 
              className="flex items-center justify-center px-6 md:px-8 h-12 rounded-full shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#E9CB8E", color: "#8a6200" }}
            >
              <span className="text-xs md:text-sm whitespace-nowrap leading-none pt-1" style={{ fontFamily: "var(--font-dune-rise), sans-serif", fontWeight: "bold" }}>
                Timeline
              </span>
            </div>
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
