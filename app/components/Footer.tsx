"use client";

import { useState } from "react";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ieee.cs.sbnu/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const footerLinks = [
  {
    title: "Event",
    links: [
      { label: "About", href: "#about" },
      { label: "Tracks", href: "#tracks" },
      { label: "Timeline", href: "#timeline" },
    ],
  },
  {
    title: "Socials",
    links: [
      { 
        label: (
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            CS Instagram
          </span>
        ), 
        href: "https://www.instagram.com/ieee.cs.sbnu/" 
      },
      { 
        label: (
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            ITSS Instagram
          </span>
        ), 
        href: "https://www.instagram.com/ieee.itss.sbnu/" 
      },
      { 
        label: (
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            SPS Instagram
          </span>
        ), 
        href: "https://www.instagram.com/ieee_sps_sbnu/" 
      },
    ],
  },
];

export default function Footer() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedText(null);
    }, 2500);
  };

  return (
    <footer 
      id="contact"
      className="relative pt-20 pb-12 overflow-hidden bg-[#05060f] text-slate-100"
    >
      {/* ── Dynamic Ambient Floating Blobs ── */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-3xl animate-blob-1"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, #06b6d4 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full pointer-events-none opacity-20 blur-3xl animate-blob-2"
        style={{
          background: "radial-gradient(circle, #10b981 0%, #3b82f6 60%, transparent 70%)",
        }}
      />

      {/* Copy Toast Notification */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-sky-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-sky-300 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span>{copiedText}</span>
        </div>
      )}

      <div className="w-full px-6 md:px-12 mx-auto relative z-10">
        {/* Subtle Accent Separator */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-16" />

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-sky-400 font-extrabold text-3xl tracking-tight">Hack</span>
              <span className="text-white font-extrabold text-3xl tracking-tight">IEEE</span>
            </div>
            <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm mb-6">
              Where innovation meets impact. HackIEEE 2026 brings together the
              brightest minds to build solutions that matter.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-800/60 transition-all duration-300 border border-slate-800"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side Columns */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row justify-end gap-12 lg:gap-20">
            {/* Link Columns */}
            {footerLinks.map((col) => (
              <div key={col.title} className="min-w-[140px]">
                <h4 className="text-sm font-bold text-sky-400 mb-4 uppercase tracking-widest">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Info Column */}
            <div className="max-w-xs">
              <h4 className="text-sm font-bold text-sky-400 mb-4 uppercase tracking-widest">
                REACH US
              </h4>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => copyToClipboard("deep@computer.org", "Email (deep@computer.org)")}
                  className="text-sm font-bold text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-2.5 text-left group"
                >
                  <span className="material-symbols-outlined text-lg text-sky-400 group-hover:scale-110 transition-transform">
                    mail
                  </span>
                  <span>deep@computer.org</span>
                  <span className="material-symbols-outlined text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    content_copy
                  </span>
                </button>

                <button
                  onClick={() => copyToClipboard("+919265641668", "Phone number (+91 92656 41668)")}
                  className="text-sm font-bold text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-2.5 text-left group"
                >
                  <span className="material-symbols-outlined text-lg text-sky-400 group-hover:scale-110 transition-transform">
                    call
                  </span>
                  <span>+91 92656 41668</span>
                  <span className="material-symbols-outlined text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    content_copy
                  </span>
                </button>

                <a
                  href="https://maps.google.com/?q=Nirma+University,+Sarkhej-Gandhinagar+Highway,+Gota,+Ahmedabad,+Gujarat+382481,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors flex items-start gap-2.5"
                >
                  <span className="material-symbols-outlined text-lg text-sky-400 shrink-0 mt-0.5">
                    location_on
                  </span>
                  <span>Nirma University, Sarkhej - Gandhinagar Highway, Gota, Ahmedabad, Gujarat 382481, India</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/40"
        >
          <p className="text-xs font-semibold text-slate-500">
            HackIEEE 2026
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Powered by IEEE Student Chapters Nirma University
          </p>
        </div>
      </div>
    </footer>
  );
}
