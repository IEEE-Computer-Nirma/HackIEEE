const events = [
  {
    date: "Jan 15, 2026",
    title: "Registration Opens",
    description: "Sign up and form your team of up to 4 members.",
  },
  {
    date: "Feb 20, 2026",
    title: "Registration Closes",
    description: "Last day to register. Late entries will not be accepted.",
  },
  {
    date: "Mar 01, 2026",
    title: "Opening Ceremony",
    description: "Kickoff with keynote speakers and track announcements.",
  },
  {
    date: "Mar 01–03",
    title: "48 Hours of Hacking",
    description: "Build, iterate, and bring your vision to life with mentor support.",
  },
  {
    date: "Mar 03, 2026",
    title: "Demo & Judging",
    description: "Present your project to our panel of industry-leading judges.",
  },
  {
    date: "Mar 03, 2026",
    title: "Awards Ceremony",
    description: "Winners announced, prizes awarded, and celebrations begin!",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="section-heading mb-4">
          <span className="gradient-text">Event Timeline</span>
        </h2>
        <p className="section-subheading">
          Key milestones on your journey from idea to impact.
        </p>
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Vertical Line */}
        <div
          className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px]"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(76, 91, 224, 0.3), rgba(248, 106, 200, 0.3), transparent)",
          }}
        />

        {events.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={event.title}
              className={`relative flex items-start mb-12 last:mb-0 ${
                isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
              } flex-row`}
              style={{
                opacity: 0,
                animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 120}ms forwards`,
              }}
            >
              {/* Dot */}
              <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: i < 2 ? "#4C5BE0" : i < 4 ? "#B387E8" : "#FF4E63",
                    background: "#05060F",
                    boxShadow: `0 0 12px ${i < 2 ? "rgba(76,91,224,0.5)" : i < 4 ? "rgba(179,135,232,0.5)" : "rgba(255,78,99,0.5)"}`,
                  }}
                />
              </div>

              {/* Card */}
              <div
                className={`ml-14 sm:ml-0 ${
                  isLeft
                    ? "sm:w-[calc(50%-32px)] sm:pr-8 sm:text-right"
                    : "sm:w-[calc(50%-32px)] sm:pl-8 sm:text-left"
                } w-full`}
              >
                <div className="glass-card-sm p-5 hover:scale-[1.02] transition-all duration-500">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest mb-1 inline-block"
                    style={{
                      color: i < 2 ? "#4C5BE0" : i < 4 ? "#B387E8" : "#FF4E63",
                    }}
                  >
                    {event.date}
                  </span>
                  <h3 className="text-base font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-sm text-[rgba(240,240,245,0.45)]">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Spacer for opposite side */}
              <div className="hidden sm:block sm:w-[calc(50%-32px)]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
