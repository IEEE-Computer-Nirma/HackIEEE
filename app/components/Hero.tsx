export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background: Dune + Rocks stacked for depth ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Hero-bg-dune.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img 
          src="/Hero-bg-rocks.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ── Dark Overlay (top) ── */}
      <div
        className="absolute inset-0 z-[2]"
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
