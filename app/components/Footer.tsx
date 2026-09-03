const socialLinks = [
  {
    name: "Instagram",
    href: "#",
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
    href: "#",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
            CS
          </span>
        ), 
        href: "https://www.instagram.com/ieee.cs.sbnu/" 
      },
      { 
        label: (
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            ITSS
          </span>
        ), 
        href: "https://www.instagram.com/ieee.itss.sbnu/" 
      },
      { 
        label: (
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            SPS
          </span>
        ), 
        href: "https://www.instagram.com/ieee_sps_sbnu/" 
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer 
      id="contact"
      className="relative pt-24 pb-8 mt-16 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/footer-bg.svg')" }}
    >
      <div className="w-full px-6 md:px-12 mx-auto relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-[#4C5BE0] font-extrabold text-2xl">Hack</span>
              <span className="text-black font-extrabold text-2xl">IEEE</span>
            </div>
            <p className="text-sm font-medium text-black leading-relaxed max-w-sm mb-6">
              Where innovation meets impact. HackIEEE 2026 brings together the
              brightest minds to build solutions that matter.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-black hover:text-[#4C5BE0] transition-all duration-300 hover:bg-black/5"
                  aria-label={social.name}
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
              <div key={col.title} className="min-w-[120px]">
                <h4 className="text-sm font-bold text-[#4C5BE0] mb-4 uppercase tracking-widest drop-shadow-sm">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-black hover:text-[#4C5BE0] transition-colors duration-300"
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
              <h4 className="text-sm font-bold text-[#4C5BE0] mb-4 uppercase tracking-widest drop-shadow-sm">
                REACH US
              </h4>
              <div className="flex flex-col gap-4">
                <a href="mailto:deep@computer.org" className="text-sm font-bold text-black hover:text-[#4C5BE0] transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  deep@computer.org
                </a>
                <a href="tel:+919265641668" className="text-sm font-bold text-black hover:text-[#4C5BE0] transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +91 92656 41668
                </a>
                <a href="https://maps.google.com/?q=Nirma+University,+Sarkhej-Gandhinagar+Highway,+Gota,+Ahmedabad,+Gujarat+382481,+India" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:text-[#4C5BE0] transition-colors flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Nirma University, Sarkhej - Gandhinagar Highway, Gota, Ahmedabad, Gujarat 382481, India</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <p className="text-xs font-semibold text-black">
            HackIEEE 2026
          </p>
          <p className="text-xs font-semibold text-black">
            Powered by IEEE Student Chapters Nirma University
          </p>
        </div>
      </div>
    </footer>
  );
}
