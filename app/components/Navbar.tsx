"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Copy } from "lucide-react";
import SmoothLink, { smoothScrollTo } from "./SmoothLink";
import ThemeSwitch from "./ThemeSwitch";
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
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [onHero, setOnHero] = useState(isHome);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      <header className={`topbar ${hidden ? "is-hidden" : ""} ${onHero ? "on-hero" : ""}`}>
        <SmoothLink href="/#" className="logo-mark" aria-label="HackIEEE home" style={{ color: "var(--text)" }}>
          <LogoMark />
        </SmoothLink>

        <nav className="pill-nav hidden md:flex" aria-label="Main">
          {pills}
        </nav>

        <div className="flex items-center gap-2.5 md:gap-4">
          <ThemeSwitch />
          <a href="#contact" onClick={handleContactClick} className="contact-btn">
            <Mail size={17} strokeWidth={1.75} />
            <span>
              Contact<span className="hidden sm:inline"> Us</span>
            </span>
          </a>
        </div>
      </header>

      <nav className="pill-nav pill-nav--dock" aria-label="Sections">
        {pills}
      </nav>
    </>
  );
}
