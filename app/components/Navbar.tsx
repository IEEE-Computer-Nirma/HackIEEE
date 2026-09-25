"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  useEffect(() => {
    // Register the plugin only on the client side
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);

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
        
        window.history.pushState(null, "", id);
      }
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // Copy email to clipboard and scroll to contact
    navigator.clipboard.writeText("deep@computer.org");
    setCopyNotice("deep@computer.org copied to clipboard!");
    setTimeout(() => {
      setCopyNotice(null);
    }, 3000);

    const contactEl = document.querySelector("#contact");
    if (contactEl) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: "#contact", offsetY: 0 },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <>
      {copyNotice && (
        <div className="fixed top-20 right-6 z-[100] bg-sky-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-sky-300 animate-bounce">
          <span className="material-symbols-outlined text-xl">content_copy</span>
          <span>{copyNotice}</span>
        </div>
      )}

      <nav className="fixed top-0 inset-x-0 z-[60] pointer-events-none">
        <div className="flex items-start justify-between px-6 md:px-12 relative">
          {/* Left: Empty space */}
          <div className="pointer-events-none mt-6 md:mt-8 w-24">
          </div>

          {/* Center: The Notch (Solid) - Desktop Only */}
          <div className="pointer-events-auto hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 items-center justify-center gap-10 px-12 h-16 bg-[#05060f] border border-t-0 border-white/10 rounded-b-[32px]">
            <Link
              href="/#about"
              onClick={(e) => handleSmoothScroll(e, "/#about")}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/#tracks"
              onClick={(e) => handleSmoothScroll(e, "/#tracks")}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Tracks
            </Link>
            <Link
              href="/#timeline"
              onClick={(e) => handleSmoothScroll(e, "/#timeline")}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Timeline
            </Link>
            <Link
              href="/sponsorship"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Sponsor
            </Link>
          </div>

          {/* Right: Contact Button & Mobile Hamburger */}
          <div className="pointer-events-auto mt-5 md:mt-6 flex items-center gap-4">
            <a href="#contact" onClick={handleContactClick} className="hidden md:block">
              <div 
                className="flex items-center justify-center gap-2 px-4 md:px-6 h-10 md:h-11 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(165,102,58,0.2)] cursor-pointer"
                style={{ backgroundColor: "#A5663A", color: "#f7d16b" }}
              >
                <span className="material-symbols-outlined text-lg">mail</span>
                <span 
                  className="text-[10px] md:text-[11px] whitespace-nowrap tracking-wide leading-none pt-[3px]" 
                  style={{ fontFamily: "var(--font-dune-rise), sans-serif", fontWeight: "bold" }}
                >
                  Contact Us
                </span>
              </div>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative w-5 h-3.5">
                <span className={`absolute left-0 bg-white block transition-all duration-300 ease-in-out h-[2px] w-full rounded-full ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white block transition-all duration-300 ease-in-out h-[2px] w-full rounded-full ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}></span>
                <span className={`absolute left-0 bg-white block transition-all duration-300 ease-in-out h-[2px] w-full rounded-full ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-[#05060f]/95 backdrop-blur-lg flex flex-col items-center justify-center transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-8 text-2xl font-semibold">
          <Link
            href="/#about"
            onClick={(e) => handleSmoothScroll(e, "/#about")}
            className="text-white hover:text-sky-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/#tracks"
            onClick={(e) => handleSmoothScroll(e, "/#tracks")}
            className="text-white hover:text-sky-400 transition-colors"
          >
            Tracks
          </Link>
          <Link
            href="/#timeline"
            onClick={(e) => handleSmoothScroll(e, "/#timeline")}
            className="text-white hover:text-sky-400 transition-colors"
          >
            Timeline
          </Link>
          <Link
            href="/sponsorship"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white hover:text-sky-400 transition-colors"
          >
            Sponsor
          </Link>
          <a href="#contact" onClick={handleContactClick} className="mt-4 block">
            <div 
              className="flex items-center justify-center gap-2 px-8 h-12 rounded-full cursor-pointer"
              style={{ backgroundColor: "#A5663A", color: "#f7d16b" }}
            >
              <span className="material-symbols-outlined">mail</span>
              <span 
                className="text-sm whitespace-nowrap tracking-wide leading-none pt-[3px]" 
                style={{ fontFamily: "var(--font-dune-rise), sans-serif", fontWeight: "bold" }}
              >
                Contact Us
              </span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
