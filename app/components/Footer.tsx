"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Copy, CircleCheck, ArrowUpRight } from "lucide-react";
import SmoothLink from "./SmoothLink";
import { CONTACT_EMAIL } from "../data/timeline";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const eventLinks = [
  { label: "About", href: "/#about" },
  { label: "Tracks", href: "/#tracks" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Sponsor", href: "/sponsorship" },
];

const socials = [
  { label: "CS Instagram", href: "https://www.instagram.com/ieee.cs.sbnu/" },
  { label: "ITSS Instagram", href: "https://www.instagram.com/ieee.itss.sbnu/" },
  { label: "SPS Instagram", href: "https://www.instagram.com/ieee_sps_sbnu/" },
];

const PHONE = "+919265641668";

export default function Footer() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedText(`${label} copied to clipboard`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiedText(null), 2500);
  };

  const heading = "mb-5 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-spice";
  const link = "text-[0.95rem] text-ink-2 transition-colors duration-300 hover:text-ink";

  return (
    <footer id="contact" className="relative overflow-hidden bg-bg-2 pb-28 pt-16 text-ink md:pb-12 md:pt-24">
      {/* horizon with a setting sun */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-spice/60 to-transparent" />
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-40 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-spice opacity-[0.12] blur-3xl" />

      {copiedText && (
        <div className="toast" role="status">
          <CircleCheck size={16} strokeWidth={1.8} />
          <span>{copiedText}</span>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="display text-3xl tracking-[0.3em] text-ink">HackIEEE</p>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              Where innovation meets impact. HackIEEE 2026 brings together the brightest minds to build solutions
              that matter.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:justify-items-end">
            <div>
              <h4 className={heading}>Event</h4>
              <ul className="space-y-3">
                {eventLinks.map((l) => (
                  <li key={l.label}>
                    <SmoothLink href={l.href} className={link}>
                      {l.label}
                    </SmoothLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={heading}>Socials</h4>
              <ul className="space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}>
                      <InstagramIcon />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1 sm:max-w-xs">
              <h4 className={heading}>Reach us</h4>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => copyToClipboard(CONTACT_EMAIL, "Email")}
                  className="group flex items-center gap-2.5 text-left text-[0.95rem] font-medium text-ink transition-colors hover:text-spice"
                >
                  <Mail size={17} strokeWidth={1.6} className="shrink-0 text-spice" />
                  <span>{CONTACT_EMAIL}</span>
                  <Copy size={13} className="ml-auto text-ink-3 opacity-60 transition-opacity group-hover:opacity-100" />
                </button>
                <button
                  onClick={() => copyToClipboard(PHONE, "Phone number")}
                  className="group flex items-center gap-2.5 text-left text-[0.95rem] font-medium text-ink transition-colors hover:text-spice"
                >
                  <Phone size={17} strokeWidth={1.6} className="shrink-0 text-spice" />
                  <span>+91 92656 41668</span>
                  <Copy size={13} className="ml-auto text-ink-3 opacity-60 transition-opacity group-hover:opacity-100" />
                </button>
                <a
                  href="https://maps.google.com/?q=Nirma+University,+Sarkhej-Gandhinagar+Highway,+Gota,+Ahmedabad,+Gujarat+382481,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 text-sm leading-relaxed text-ink-2 transition-colors hover:text-ink"
                >
                  <MapPin size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-spice" />
                  <span>
                    Nirma University, Sarkhej - Gandhinagar Highway, Gota, Ahmedabad, Gujarat 382481, India
                    <ArrowUpRight size={13} className="ml-1 inline opacity-60 transition-opacity group-hover:opacity-100" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* oversized wordmark sinking into the sand */}
        <p
          aria-hidden="true"
          className="display pointer-events-none -mr-[0.18em] mt-16 select-none whitespace-nowrap text-center text-[9.4vw] leading-none tracking-[0.18em] md:mt-24 md:text-[min(8.4vw,7.4rem)]"
          style={{
            background: "linear-gradient(180deg, var(--line-strong), transparent 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          hackieee
        </p>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-line pt-6 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-3 sm:flex-row">
          <p>HackIEEE 2026</p>
          <p className="text-center">Powered by IEEE Student Chapters Nirma University</p>
        </div>
      </div>
    </footer>
  );
}
