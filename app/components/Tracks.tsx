const tracks = [
  {
    title: "AI & Machine Learning",
    description: "Build intelligent systems that push the boundaries of what machines can learn and achieve.",
    color: "#4C5BE0",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.93" />
        <path d="M8.24 4.65A4 4 0 0 1 12 2" />
        <path d="M12 18a8 8 0 0 0 8-8" />
        <path d="M12 18a8 8 0 0 1-8-8" />
        <path d="M12 18v4" />
        <path d="M8 22h8" />
      </svg>
    ),
  },
  {
    title: "Web3 & Blockchain",
    description: "Decentralize the future — create dApps, smart contracts, and novel blockchain solutions.",
    color: "#B387E8",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a4 4 0 0 0-8 0v2" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
  },
  {
    title: "HealthTech",
    description: "Innovate at the intersection of technology and healthcare to save and improve lives.",
    color: "#F86AC8",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
      </svg>
    ),
  },
  {
    title: "Sustainability",
    description: "Build tech solutions that address climate change, resource management, and environmental challenges.",
    color: "#FF4E63",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22c1.25-1.25 2.5-2 4.5-2 3 0 3 2 6 2s3-2 6-2c2 0 3.25.75 4.5 2" />
        <path d="M12 2C6.5 2 2 6.5 2 12" />
        <path d="M12 2c5.523 0 10 4.477 10 10" />
        <path d="M12 2v10" />
        <path d="M2 12h10" />
      </svg>
    ),
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="relative py-28 px-6">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #4C5BE0, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="section-heading mb-4">
          <span className="gradient-text">Hackathon Tracks</span>
        </h2>
        <p className="section-subheading">
          Choose your arena. Each track offers unique challenges and dedicated
          prize pools.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tracks.map((track, i) => (
          <div
            key={track.title}
            className="group relative glass-card p-8 hover:scale-[1.02] transition-all duration-500 cursor-default overflow-hidden"
            style={{
              opacity: 0,
              animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 120}ms forwards`,
            }}
          >
            {/* Gradient accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, transparent, ${track.color}, transparent)`,
              }}
            />

            {/* Corner glow on hover */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle, ${track.color}, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `rgba(${track.color === "#4C5BE0" ? "76,91,224" : track.color === "#B387E8" ? "179,135,232" : track.color === "#F86AC8" ? "248,106,200" : "255,78,99"},0.12)`,
                  color: track.color,
                }}
              >
                {track.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
              <p className="text-sm text-[rgba(240,240,245,0.5)] leading-relaxed">
                {track.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
