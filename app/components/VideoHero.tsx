const cards = [
  {
    title: "Real-time sync",
    description: "Changes appear across every device instantly.",
  },
  {
    title: "Version history",
    description: "Every edit is saved automatically.",
  },
  {
    title: "Team permissions",
    description: "Control who can view or edit each project.",
  },
  {
    title: "Offline mode",
    description: "Keep working even when the connection drops.",
  },
];

export default function VideoHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/madder-dusk-web.mp4"
        poster="/videos/madder-dusk-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />

      {/* Transparent scrim — this is the "overlay" that keeps card text
          legible regardless of how bright the footage underneath is */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/65" />

      {/* Cards */}
      <div className="relative z-10 flex h-full items-end justify-center px-6 pb-16 sm:items-center sm:pb-0">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              tabIndex={0}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md
                         shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                         transition-all duration-200 ease-out
                         hover:-translate-y-1 hover:bg-white/[0.15]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <h3 className="text-[16px] font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/75">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
