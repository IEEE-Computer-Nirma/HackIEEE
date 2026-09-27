"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Copy } from "lucide-react";
import SmoothLink, { smoothScrollTo } from "./SmoothLink";
import { CONTACT_EMAIL } from "../data/timeline";

const links = [
  { label: "About", href: "/#about", section: "about" },
  { label: "Tracks", href: "/#tracks", section: "tracks" },
  { label: "Timeline", href: "/#timeline", section: "timeline" },
  { label: "Sponsor", href: "/sponsorship", section: null },
];

function LogoMark() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <circle cx="21" cy="23" r="17.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="21" cy="23" r="3.2" fill="currentColor" />
      <path d="M26 23h32" stroke="url(#logo-flare)" strokeWidth="1.2" />
      <circle cx="33" cy="23" r="2" fill="#fff1dc" />
      <defs>
        <linearGradient id="logo-flare" x1="26" x2="58" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffb061" stopOpacity="0" />
          <stop offset="0.25" stopColor="#ffb061" />
          <stop offset="1" stopColor="#ffb061" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [onHero, setOnHero] = useState(isHome);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  /* Top bar: hide while scrolling down, return on scroll up. */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > lastY + 4 ? true : y < lastY - 4 || y < 120 ? false : (h) => h);
      setOnHero(isHome && y < window.innerHeight * 0.8);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /* Active pill follows the section in view. */
  useEffect(() => {
    if (!isHome) return;
    const ids = ["top", "about", "tracks", "timeline", "contact"];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          setActive(links.some((l) => l.section === id) ? id : null);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigator.clipboard?.writeText(CONTACT_EMAIL).catch(() => {});
    setToast(`${CONTACT_EMAIL} copied to clipboard`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
    smoothScrollTo("#contact");
  };

  const isActive = (l: (typeof links)[number]) =>
    l.section ? isHome && active === l.section : pathname === l.href;

  const pills = (
    <>
      {links.map((l) => (
        <SmoothLink
          key={l.label}
          href={l.href}
          className={`pill ${isActive(l) ? "active" : ""}`}
          aria-current={isActive(l) ? (l.section ? "true" : "page") : undefined}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {l.label}
        </SmoothLink>
      ))}
    </>
  );

  return (
    <>
      {toast && (
        <div className="toast" role="status">
          <Copy size={16} strokeWidth={1.8} />
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-8 text-2xl font-medium mt-12">
          {links.map((l) => (
            <SmoothLink
              key={l.label}
              href={l.href}
              className="text-ink hover:text-spice transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {l.label}
            </SmoothLink>
          ))}
          <a
            href="#contact"
            onClick={handleContactClick}
            className="mt-4 px-6 py-3 rounded-full border border-line-strong bg-surface text-ink text-lg flex items-center gap-2"
          >
            <Mail size={20} />
            Contact Us
          </a>
        </div>
      </div>

      <header className={`topbar z-[70] ${hidden && !isMobileMenuOpen ? "is-hidden" : ""} ${onHero && !isMobileMenuOpen ? "on-hero" : ""}`}>
        {/* Spacer for grid balance on desktop */}
        <div className="topbar-spacer" aria-hidden="true" />

        <nav className="pill-nav hidden md:flex" aria-label="Main">
          {pills}
        </nav>

        <div className="topbar-actions col-start-3">
          <a href="#contact" onClick={handleContactClick} className="contact-btn hidden md:flex">
            <Mail size={17} strokeWidth={1.75} />
            <span>
              Contact Us
            </span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-line-strong bg-surface backdrop-blur-md relative z-[70]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-4 h-3">
              <span className={`absolute left-0 bg-ink block transition-all duration-300 ease-in-out h-[1.5px] w-full rounded-full ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`}></span>
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 bg-ink block transition-all duration-300 ease-in-out h-[1.5px] w-full rounded-full ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}></span>
              <span className={`absolute left-0 bg-ink block transition-all duration-300 ease-in-out h-[1.5px] w-full rounded-full ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`}></span>
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
