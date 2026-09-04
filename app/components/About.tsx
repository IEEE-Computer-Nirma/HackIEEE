const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Build & Ship",
    description: "Transform your ideas into working products in 48 hours with cutting-edge tools and technologies.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Connect & Network",
    description: "Meet fellow innovators, industry experts, and potential co-founders from across the globe.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Learn & Grow",
    description: "Attend expert workshops, gain hands-on experience with new frameworks, and level up your skills.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Desktop Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover hidden md:block"
        >
          <source src="/about-video.mp4" type="video/mp4" />
        </video>
        {/* Mobile Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover block md:hidden"
        >
          <source src="/about-video-mobile.mp4" type="video/mp4" />
        </video>
        {/* Transparent scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#05060f]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center items-center h-full">
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
            What is HackIEEE?
          </h2>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            More than a hackathon it&apos;s a launchpad for the next generation of
            innovators, builders, and changemakers.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="group rounded-2xl border border-white/10 bg-white/10 p-8 sm:p-10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/[0.15] cursor-default"
              style={{
                opacity: 0,
                animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 100}ms forwards`,
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20"
              >
                {feat.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">
                {feat.title}
              </h3>
              <p className="text-base text-white/70 leading-relaxed font-medium">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
