const tracks = [
  {
    title: "Cyber Security",
    description: "Build robust defenses and secure systems to protect data, privacy, and critical infrastructure.",
    color: "#4C5BE0",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Healthcare",
    description: "Innovate at the intersection of technology and healthcare to save and improve lives.",
    color: "#B387E8",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
      </svg>
    ),
  },
  {
    title: "Sustainability",
    description: "Build tech solutions that address climate change, resource management, and environmental challenges.",
    color: "#F86AC8",
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
  {
    title: "Finance",
    description: "Reimagine the financial landscape with innovative fintech solutions, inclusion tools, and digital economies.",
    color: "#FF4E63",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="relative min-h-[100dvh] flex flex-col justify-center py-24 px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/tracks-bg-mobile.png" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tracks-bg.png"
            alt="Tracks Background"
            className="w-full h-full object-cover"
          />
        </picture>
        {/* Dark tint for readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Seamless transition gradients at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060f] via-transparent to-[#05060f]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-full">
        {/* Subtle background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #4C5BE0, transparent 70%)",
          }}
        />

      <div className="w-full max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-sky-400 mb-4">
          Hackathon Tracks
        </h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Choose your arena. Each track offers unique challenges and dedicated prize pools.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tracks.map((track, i) => (
          <div
            key={track.title}
            className="group rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] cursor-default relative overflow-hidden"
            style={{
              opacity: 0,
              animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 100}ms forwards`,
            }}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div
                className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 text-gray-900 border border-gray-200 transition-transform duration-300 group-hover:scale-110"
              >
                {track.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight text-[#4C5BE0]">
                {track.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {track.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
