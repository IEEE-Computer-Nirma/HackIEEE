"use client";

export default function Timeline() {
  const events = [
    {
      date: "October 20, 2026",
      title: "Registration Opens",
      description: "Sign up and form your team of up to 4 members.",
    },
    {
      date: "November 28, 2026",
      title: "Registration Closes",
      description: "Last day to register. Late entries will not be accepted.",
    },
    {
      date: "December 20–25, 2026",
      title: "Phase 1: Idea Submission + Quiz / CTF",
      description: "Submit your project proposal along with participation in the preliminary Quiz / CTF challenges.",
    },
    {
      date: "January 2–3, 2027",
      title: "Phase 2: Hackathon",
      description: "Intense coding and product building phase with mentor support and technical checkpoints.",
    },
    {
      date: "January 4, 2027",
      title: "Results & Award Ceremony",
      description: "Project presentations, judge evaluations, winner announcements, and prize distributions.",
    },
  ];

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
            background:
              "linear-gradient(to bottom, transparent, rgba(76, 91, 224, 0.5), rgba(248, 106, 200, 0.5), transparent)",
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
            >
              {/* Dot */}
              <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: i < 2 ? "#4C5BE0" : i < 4 ? "#B387E8" : "#FF4E63",
                    background: "#05060F",
                    boxShadow: `0 0 12px ${
                      i < 2
                        ? "rgba(76,91,224,0.6)"
                        : i < 4
                        ? "rgba(179,135,232,0.6)"
                        : "rgba(255,78,99,0.6)"
                    }`,
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
                <div className="glass-card-sm p-5 hover:scale-[1.02] transition-all duration-300">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest mb-1 inline-block"
                    style={{
                      color: i < 2 ? "#4C5BE0" : i < 4 ? "#B387E8" : "#FF4E63",
                    }}
                  >
                    {event.date}
                  </span>
                  <h3 className="text-base font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-sm text-[rgba(240,240,245,0.6)] leading-relaxed">
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

      {/* Star Note */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <p className="text-xs md:text-sm text-sky-300/80 bg-sky-950/30 border border-sky-500/20 rounded-xl py-3 px-5 inline-block backdrop-blur-sm shadow-md">
          <span className="text-amber-400 font-bold mr-1.5">*</span>
          <span className="font-medium">
            Note: All dates are tentative and may shift by ±1 week. Final schedule will be confirmed 1 month prior to the event.
          </span>
        </p>
      </div>
    </section>
  );
}
