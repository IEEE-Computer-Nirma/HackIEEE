export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Neon Rise SVG Background ── */}
      <div className="absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1920 1080"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="hbar0" gradientUnits="userSpaceOnUse" x1="0" y1="911" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(9,19,65)" />
              <stop offset="0.3" stopColor="rgb(69,84,211)" />
              <stop offset="0.5" stopColor="rgb(169,129,223)" />
              <stop offset="0.7" stopColor="rgb(237,102,192)" />
              <stop offset="1" stopColor="rgb(245,75,95)" />
            </linearGradient>
            <linearGradient id="hbar1" gradientUnits="userSpaceOnUse" x1="0" y1="819" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(15,22,58)" />
              <stop offset="0.25" stopColor="rgb(43,59,180)" />
              <stop offset="0.5" stopColor="rgb(166,132,231)" />
              <stop offset="0.75" stopColor="rgb(248,108,196)" />
              <stop offset="1" stopColor="rgb(255,82,102)" />
            </linearGradient>
            <linearGradient id="hbar2" gradientUnits="userSpaceOnUse" x1="0" y1="745" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,13,39)" />
              <stop offset="0.2" stopColor="rgb(27,41,157)" />
              <stop offset="0.45" stopColor="rgb(105,101,215)" />
              <stop offset="0.65" stopColor="rgb(193,120,209)" />
              <stop offset="0.85" stopColor="rgb(238,92,156)" />
              <stop offset="1" stopColor="rgb(241,74,93)" />
            </linearGradient>
            <linearGradient id="hbar3" gradientUnits="userSpaceOnUse" x1="0" y1="681" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(21,27,53)" />
              <stop offset="0.2" stopColor="rgb(36,50,165)" />
              <stop offset="0.4" stopColor="rgb(106,110,227)" />
              <stop offset="0.6" stopColor="rgb(200,137,225)" />
              <stop offset="0.8" stopColor="rgb(249,112,194)" />
              <stop offset="1" stopColor="rgb(255,87,107)" />
            </linearGradient>
            <linearGradient id="hbar4" gradientUnits="userSpaceOnUse" x1="0" y1="613" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,13,40)" />
              <stop offset="0.15" stopColor="rgb(24,38,157)" />
              <stop offset="0.35" stopColor="rgb(68,84,211)" />
              <stop offset="0.55" stopColor="rgb(182,129,221)" />
              <stop offset="0.75" stopColor="rgb(241,100,181)" />
              <stop offset="1" stopColor="rgb(247,75,96)" />
            </linearGradient>
            <linearGradient id="hbar5" gradientUnits="userSpaceOnUse" x1="0" y1="535" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(15,21,48)" />
              <stop offset="0.2" stopColor="rgb(40,56,175)" />
              <stop offset="0.4" stopColor="rgb(108,108,227)" />
              <stop offset="0.6" stopColor="rgb(201,132,223)" />
              <stop offset="0.8" stopColor="rgb(249,107,189)" />
              <stop offset="1" stopColor="rgb(255,83,103)" />
            </linearGradient>
            <linearGradient id="hbar6" gradientUnits="userSpaceOnUse" x1="0" y1="446" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(9,17,61)" />
              <stop offset="0.2" stopColor="rgb(32,47,163)" />
              <stop offset="0.4" stopColor="rgb(96,97,212)" />
              <stop offset="0.6" stopColor="rgb(199,117,205)" />
              <stop offset="0.8" stopColor="rgb(235,94,161)" />
              <stop offset="1" stopColor="rgb(240,73,93)" />
            </linearGradient>
            <linearGradient id="hbar7" gradientUnits="userSpaceOnUse" x1="0" y1="357" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(21,31,77)" />
              <stop offset="0.2" stopColor="rgb(45,60,178)" />
              <stop offset="0.4" stopColor="rgb(113,112,228)" />
              <stop offset="0.6" stopColor="rgb(215,130,218)" />
              <stop offset="0.8" stopColor="rgb(250,106,171)" />
              <stop offset="1" stopColor="rgb(255,86,106)" />
            </linearGradient>
            <linearGradient id="hbar8" gradientUnits="userSpaceOnUse" x1="0" y1="272" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,15,49)" />
              <stop offset="0.2" stopColor="rgb(37,52,174)" />
              <stop offset="0.4" stopColor="rgb(108,104,221)" />
              <stop offset="0.6" stopColor="rgb(200,123,214)" />
              <stop offset="0.8" stopColor="rgb(244,95,158)" />
              <stop offset="1" stopColor="rgb(248,76,96)" />
            </linearGradient>
            <linearGradient id="hbar9" gradientUnits="userSpaceOnUse" x1="0" y1="189" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(17,23,50)" />
              <stop offset="0.2" stopColor="rgb(37,52,169)" />
              <stop offset="0.4" stopColor="rgb(97,104,226)" />
              <stop offset="0.6" stopColor="rgb(206,132,222)" />
              <stop offset="0.8" stopColor="rgb(249,108,183)" />
              <stop offset="1" stopColor="rgb(255,85,105)" />
            </linearGradient>
            <linearGradient id="hbar10" gradientUnits="userSpaceOnUse" x1="0" y1="103" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(7,13,39)" />
              <stop offset="0.2" stopColor="rgb(30,44,160)" />
              <stop offset="0.4" stopColor="rgb(92,95,212)" />
              <stop offset="0.6" stopColor="rgb(185,122,210)" />
              <stop offset="0.8" stopColor="rgb(234,97,179)" />
              <stop offset="1" stopColor="rgb(239,73,93)" />
            </linearGradient>
            <linearGradient id="hbar11" gradientUnits="userSpaceOnUse" x1="0" y1="9" x2="0" y2="1080">
              <stop offset="0" stopColor="rgb(17,23,50)" />
              <stop offset="0.2" stopColor="rgb(42,58,176)" />
              <stop offset="0.4" stopColor="rgb(109,109,228)" />
              <stop offset="0.6" stopColor="rgb(213,130,219)" />
              <stop offset="0.8" stopColor="rgb(249,109,189)" />
              <stop offset="1" stopColor="rgb(255,85,105)" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="rgb(5,6,15)" />
          <rect x="-17" y="911" width="194" height="169" fill="url(#hbar0)" />
          <rect x="143" y="819" width="194" height="261" fill="url(#hbar1)" />
          <rect x="303" y="745" width="194" height="335" fill="url(#hbar2)" />
          <rect x="463" y="681" width="194" height="399" fill="url(#hbar3)" />
          <rect x="623" y="613" width="194" height="467" fill="url(#hbar4)" />
          <rect x="783" y="535" width="194" height="545" fill="url(#hbar5)" />
          <rect x="943" y="446" width="194" height="634" fill="url(#hbar6)" />
          <rect x="1103" y="357" width="194" height="723" fill="url(#hbar7)" />
          <rect x="1263" y="272" width="194" height="808" fill="url(#hbar8)" />
          <rect x="1423" y="189" width="194" height="891" fill="url(#hbar9)" />
          <rect x="1583" y="103" width="194" height="977" fill="url(#hbar10)" />
          <rect x="1743" y="9" width="194" height="1071" fill="url(#hbar11)" />
        </svg>
      </div>

      {/* ── Dark Overlay (top) ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,6,15,0.7) 0%, rgba(5,6,15,0.3) 40%, rgba(5,6,15,0.1) 60%, rgba(5,6,15,0.6) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-slide-down"
          style={{
            background: "rgba(76, 91, 224, 0.12)",
            border: "1px solid rgba(76, 91, 224, 0.25)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "#4C5BE0",
              boxShadow: "0 0 8px #4C5BE0",
            }}
          />
          <span className="text-sm font-medium text-[rgba(240,240,245,0.8)]">
            48 Hours · Limitless Possibilities
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <span className="gradient-text-hero">Hack</span>
          <span className="text-white">IEEE</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-[rgba(240,240,245,0.6)] max-w-xl mx-auto mb-10 animate-slide-up opacity-0"
          style={{ animationDelay: "250ms", animationFillMode: "forwards" }}
        >
          Where innovation meets impact. Build the future in 48 hours alongside
          the brightest minds in technology.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up opacity-0"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <a href="#register" className="btn-gradient text-base">
            <span className="flex items-center gap-2">
              Register Now
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
          <a href="#about" className="btn-outline text-base">
            Learn More
          </a>
        </div>

        {/* Date Badge */}
        <div
          className="mt-14 inline-flex items-center gap-3 text-sm text-[rgba(240,240,245,0.45)] animate-slide-up opacity-0"
          style={{ animationDelay: "550ms", animationFillMode: "forwards" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          March 2026 · Registration Opening Soon
        </div>
      </div>

      {/* ── Bottom Fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{
          background: "linear-gradient(to top, #05060F 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
