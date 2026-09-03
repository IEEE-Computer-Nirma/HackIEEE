const stats = [
  { value: "500+", label: "Participants" },
  { value: "48h", label: "Of Hacking" },
  { value: "₹5L+", label: "In Prizes" },
  { value: "20+", label: "Mentors" },
];

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Learn & Grow",
    description: "Attend expert workshops, gain hands-on experience with new frameworks, and level up your skills.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    title: "Win & Celebrate",
    description: "Compete for exciting prizes, recognition, and the chance to make a real-world impact with your project.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6">
      {/* Section Heading */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="section-heading mb-4">
          <span className="gradient-text">Why HackIEEE?</span>
        </h2>
        <p className="section-subheading">
          More than a hackathon — it&apos;s a launchpad for the next generation of
          innovators, builders, and changemakers.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {features.map((feat, i) => (
          <div
            key={feat.title}
            className="glass-card p-7 group hover:scale-[1.03] transition-all duration-500 cursor-default"
            style={{
              opacity: 0,
              animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 100}ms forwards`,
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
              style={{
                background: "rgba(76, 91, 224, 0.12)",
                color: "#4C5BE0",
              }}
            >
              {feat.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
            <p className="text-sm text-[rgba(240,240,245,0.5)] leading-relaxed">
              {feat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 sm:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
                style={{
                  opacity: 0,
                  animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 100}ms forwards`,
                }}
              >
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[rgba(240,240,245,0.45)] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
