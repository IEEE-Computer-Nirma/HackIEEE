"use client";

const tracks = [
  {
    title: "Cyber Security",
    description: "Build robust defenses and secure systems to protect data, privacy, and critical infrastructure.",
    color: "#4C5BE0",
    iconName: "security",
  },
  {
    title: "Healthcare",
    description: "Innovate at the intersection of technology and healthcare to save and improve lives.",
    color: "#B387E8",
    iconName: "health_and_safety",
  },
  {
    title: "Sustainability",
    description: "Build tech solutions that address climate change, resource management, and environmental challenges.",
    color: "#F86AC8",
    iconName: "eco",
  },
  {
    title: "Finance",
    description: "Reimagine the financial landscape with innovative fintech solutions, inclusion tools, and digital economies.",
    color: "#FF4E63",
    iconName: "account_balance",
  },
  {
    title: "Open Track",
    description: "Unleash your creativity without boundaries. Pitch breakthrough ideas across any domain or emerging tech.",
    color: "#22C55E",
    iconName: "lightbulb",
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

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
          {tracks.map((track) => (
            <div
              key={track.title}
              className="group rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] cursor-default relative overflow-hidden flex flex-col justify-between"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div
                  className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 text-gray-900 border border-gray-200 transition-transform duration-300 group-hover:scale-110"
                >
                  <span className="material-symbols-outlined text-3xl" style={{ color: track.color }}>
                    {track.iconName}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: track.color }}>
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
