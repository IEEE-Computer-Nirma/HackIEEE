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
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/ieee-computer-nirma-university/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919265641668",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.101.573-.104 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.733 1.484h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.18-1.238-6.163-3.485-8.412" />
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            LinkedIn
          </span>
        ),
        href: "https://www.linkedin.com/company/ieee-computer-nirma-university/"
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
      className="relative pt-24 pb-8 mt-16 overflow-hidden bg-slate-900 border-t border-slate-800 text-slate-100"
    >
      {/* ── Subtle Shape-Changing Morphing Gradient Blobs ── */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full pointer-events-none opacity-20 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, #22c55e 0%, #06b6d4 50%, transparent 70%)",
          animation: "blob-morph 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, #10b981 60%, transparent 70%)",
          animation: "blob-morph-alt 14s ease-in-out infinite alternate",
        }}
      />

      <style jsx>{`
        @keyframes blob-morph {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%;
          }
          50% {
            transform: translate(40px, -30px) scale(1.1) rotate(90deg);
            border-radius: 60% 40% 30% 70% / 50% 30% 70% 50%;
          }
          100% {
            transform: translate(-20px, 40px) scale(0.95) rotate(180deg);
            border-radius: 30% 70% 50% 50% / 30% 60% 40% 70%;
          }
        }
        @keyframes blob-morph-alt {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
            border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
          }
          50% {
            transform: translate(-50px, 20px) scale(1.15) rotate(-120deg);
            border-radius: 70% 30% 50% 50% / 40% 60% 50% 50%;
          }
          100% {
            transform: translate(30px, -40px) scale(0.9) rotate(-240deg);
            border-radius: 40% 60% 60% 40% / 50% 30% 70% 50%;
          }
        }
      `}</style>

      {/* Copy Toast Notification */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-sky-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-sky-300 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span>{copiedText}</span>
        </div>
      )}

      <div className="w-full px-6 md:px-12 mx-auto relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-sky-400 font-extrabold text-3xl tracking-tight">Hack</span>
              <span className="text-white font-extrabold text-3xl tracking-tight">IEEE</span>
            </div>
            <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-sm mb-6">
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-sky-400 hover:bg-slate-800 transition-all duration-300 border border-slate-700/60"
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
                        className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors duration-300"
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
                  className="text-sm font-bold text-slate-200 hover:text-sky-400 transition-colors flex items-center gap-2.5 text-left group"
                >
                  <span className="material-symbols-outlined text-lg text-sky-400 group-hover:scale-110 transition-transform">
                    mail
                  </span>
                  <span>deep@computer.org</span>
                  <span className="material-symbols-outlined text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    content_copy
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard("+919265641668", "Phone number (+91 92656 41668)")}
                    className="text-sm font-bold text-slate-200 hover:text-sky-400 transition-colors flex items-center gap-2.5 text-left group flex-1"
                  >
                    <span className="material-symbols-outlined text-lg text-sky-400 group-hover:scale-110 transition-transform">
                      call
                    </span>
                    <span>+91 92656 41668</span>
                    <span className="material-symbols-outlined text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                      content_copy
                    </span>
                  </button>

                  <a
                    href="https://wa.me/919265641668"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                    title="Chat on WhatsApp"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.101.573-.104 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.733 1.484h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.18-1.238-6.163-3.485-8.412" />
                    </svg>
                  </a>
                </div>

                <a
                  href="https://maps.google.com/?q=Nirma+University,+Sarkhej-Gandhinagar+Highway,+Gota,+Ahmedabad,+Gujarat+382481,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors flex items-start gap-2.5"
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
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80"
        >
          <p className="text-xs font-semibold text-slate-400">
            HackIEEE 2026
          </p>
          <p className="text-xs font-semibold text-slate-400">
            Powered by IEEE Student Chapters Nirma University
          </p>
        </div>
      </div>
    </footer>
  );
}
