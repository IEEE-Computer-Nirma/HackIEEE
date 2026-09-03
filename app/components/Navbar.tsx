"use client";

import Link from "next/link";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function Navbar() {
  useEffect(() => {
    // Register the plugin only on the client side
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    // Only intercept if we are on the home page and targeting a hash, 
    // or if the target is a hash. For this landing page, they're all hashes.
    if (target.startsWith("#") || target.startsWith("/#")) {
      const id = target.replace("/", ""); // clean "/#about" to "#about"
      const element = document.querySelector(id);
      
      if (element) {
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: id, offsetY: 0 },
          ease: "power3.inOut",
        });
        
        // Optionally update the URL history without jumping
        window.history.pushState(null, "", id);
      }
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="flex items-start justify-between px-6 md:px-12">
        {/* Left: Floating Logo */}
        <div className="pointer-events-auto mt-6 md:mt-8">
          <Link
            href="/"
            onClick={(e) => handleSmoothScroll(e, "#")}
            className="flex items-center text-[#ffebe1] font-bold text-xl md:text-2xl tracking-tight drop-shadow-lg"
          >
            HackIEEE
          </Link>
        </div>

        {/* Center: The Notch (Solid) */}
        <div className="pointer-events-auto hidden md:flex items-center justify-center gap-10 px-12 h-16 bg-[#05060f] border border-t-0 border-white/10 rounded-b-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          <Link
            href="/#about"
            onClick={(e) => handleSmoothScroll(e, "/#about")}
            className="text-sm font-semibold text-[rgba(255,235,225,0.7)] hover:text-[#ffebe1] transition-colors"
          >
            About
          </Link>
          <Link
            href="/#tracks"
            onClick={(e) => handleSmoothScroll(e, "/#tracks")}
            className="text-sm font-semibold text-[rgba(255,235,225,0.7)] hover:text-[#ffebe1] transition-colors"
          >
            Tracks
          </Link>
          <Link
            href="/#sponsorship"
            onClick={(e) => handleSmoothScroll(e, "/#sponsorship")}
            className="text-sm font-semibold text-[rgba(255,235,225,0.7)] hover:text-[#ffebe1] transition-colors"
          >
            Sponsorship
          </Link>
        </div>

        {/* Right: Contact Button */}
        <div className="pointer-events-auto mt-5 md:mt-6">
          <Link
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, "#contact")}
            className="flex items-center text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-full text-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)]"
            style={{ backgroundColor: "#ccff00" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
