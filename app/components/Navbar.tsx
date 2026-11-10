"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Copy, LogIn, UserPlus } from "lucide-react";
import SmoothLink, { smoothScrollTo } from "./SmoothLink";
import { CONTACT_EMAIL } from "../data/contact";

export type AuthNavMode = "registration_only" | "both" | "login_only" | "none";

interface NavbarProps {
  authNavMode?: AuthNavMode;
  isRegistrationActive?: boolean;
}

const links = [
  { label: "About", href: "/#about", section: "about" },
  { label: "Tracks", href: "/#tracks", section: "tracks" },
  { label: "Timeline", href: "/#timeline", section: "timeline" },
  { label: "Speakers", href: "/#speakers", section: "speakers" },
];

export default function Navbar({
  authNavMode,
  isRegistrationActive = true,
}: NavbarProps) {
  // Resolve mode: default to registration_only (or none if registration is explicitly false)
  const mode: AuthNavMode =
    authNavMode ?? (isRegistrationActive ? "registration_only" : "none");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuthPage = pathname === "/register" || pathname === "/login";

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
    if (isAuthPage) return;
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
  }, [isHome, isAuthPage]);

  /* Active pill follows the section in view. */
  useEffect(() => {
    if (!isHome) return;
    const ids = ["top", "about", "tracks", "timeline", "speakers", "contact"];
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

  // Suppress landing page topbar on admin, standalone registration & login pages
  if (pathname?.startsWith("/admin") || isAuthPage) {
    return null;
  }

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
        <div className="flex flex-col items-center gap-7 text-2xl font-medium mt-12 w-full px-6">
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

          {/* Auth & Action Buttons in Mobile Menu */}
          {mode === "both" && (
            <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-[240px]">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-3 rounded-full border border-line-strong bg-surface text-ink text-base flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Sign In
              </Link>
              <Link
                href="/register"
                prefetch={true}
                data-no-transition
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-3 rounded-full bg-sand text-ink-strong text-base font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          )}

          {mode === "registration_only" && (
            <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-[240px]">
              <Link
                href="/register"
                prefetch={true}
                data-no-transition
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-3 rounded-full bg-sand text-ink-strong text-base font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          )}

          {mode === "login_only" && (
            <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-[240px]">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-3 rounded-full bg-sand text-ink-strong text-base font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={18} />
                Sign In
              </Link>
            </div>
          )}

          {mode === "none" && isHome && (
            <a
              href="#contact"
              onClick={handleContactClick}
              className="mt-4 px-6 py-3 rounded-full border border-line-strong bg-surface text-ink text-lg flex items-center gap-2"
            >
              <Mail size={20} />
              Contact Us
            </a>
          )}
        </div>
      </div>

      <header className={`topbar z-[70] ${hidden && !isMobileMenuOpen ? "is-hidden" : ""} ${onHero && !isMobileMenuOpen ? "on-hero" : ""}`}>
        {/* Spacer for grid balance on desktop */}
        <div className="topbar-spacer" aria-hidden="true" />

        <nav className="pill-nav hidden md:flex" aria-label="Main">
          {pills}
        </nav>

        <div className="topbar-actions col-start-3 flex items-center justify-end gap-2 md:gap-3">
          {/* Mode 1: Both (Login on the left, Register on the right corner) */}
          {mode === "both" && (
            <div className="hidden md:flex items-center gap-2.5">
              <Link href="/login" className="contact-btn">
                <LogIn size={16} strokeWidth={1.75} />
                <span>Login</span>
              </Link>
              <Link 
                href="/register" 
                prefetch={true}
                data-no-transition
                className="btn btn-sand !py-1.5 !px-4 !text-xs font-semibold rounded-full shadow-sm hover:brightness-105"
              >
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mode 2: Registration Only (Register on the right corner) */}
          {mode === "registration_only" && (
            <div className="hidden md:flex items-center">
              <Link 
                href="/register" 
                prefetch={true}
                data-no-transition
                className="btn btn-sand !py-1.5 !px-4 !text-xs font-semibold rounded-full shadow-sm hover:brightness-105"
              >
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mode 3: Login Only (Login on the right corner) */}
          {mode === "login_only" && (
            <div className="hidden md:flex items-center">
              <Link 
                href="/login" 
                className="btn btn-sand !py-1.5 !px-4 !text-xs font-semibold rounded-full shadow-sm hover:brightness-105"
              >
                <LogIn size={16} strokeWidth={1.75} />
                <span>Login</span>
              </Link>
            </div>
          )}

          {/* Mode 4: None (Contact Us on the right corner) */}
          {mode === "none" && isHome && (
            <a href="#contact" onClick={handleContactClick} className="contact-btn hidden md:flex">
              <Mail size={17} strokeWidth={1.75} />
              <span>Contact Us</span>
            </a>
          )}

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
