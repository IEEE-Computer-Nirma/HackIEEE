"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Sponsors", href: "#sponsors" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-5"
      }`}
    >
      {/* ── Notch Container ── */}
      <div
        className={`relative flex items-center gap-1 px-2 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(5,6,15,0.85)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-[rgba(5,6,15,0.5)] backdrop-blur-md"
        }`}
        style={{
          borderRadius: "9999px",
          border: scrolled
            ? "1px solid rgba(76, 91, 224, 0.2)"
            : "1px solid rgba(76, 91, 224, 0.08)",
          padding: "6px 8px",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 text-white font-bold text-lg tracking-tight whitespace-nowrap"
        >
          <span className="gradient-text font-extrabold text-xl">Hack</span>
          <span className="text-white font-extrabold text-xl -ml-1.5">IEEE</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-[rgba(240,240,245,0.65)] hover:text-white rounded-full transition-all duration-300 hover:bg-[rgba(76,91,224,0.1)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="#register"
          className="hidden md:flex items-center gap-2 ml-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #4C5BE0, #F86AC8)",
            boxShadow: "0 4px 20px rgba(76, 91, 224, 0.3)",
          }}
        >
          Register Now
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 ml-2 text-white"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-20 z-40 md:hidden animate-fade-in"
          style={{ background: "rgba(5, 6, 15, 0.95)", backdropFilter: "blur(24px)" }}
        >
          <div className="flex flex-col items-center gap-2 pt-12">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-[rgba(240,240,245,0.7)] hover:text-white py-3 px-8 rounded-xl transition-all duration-300 hover:bg-[rgba(76,91,224,0.1)] animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setMobileOpen(false)}
              className="mt-6 px-8 py-3 text-white font-semibold rounded-full animate-slide-up"
              style={{
                background: "linear-gradient(135deg, #4C5BE0, #F86AC8)",
                animationDelay: "400ms",
              }}
            >
              Register Now →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
