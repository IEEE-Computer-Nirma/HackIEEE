import { Metadata } from "next";
import SponsorshipForm from "../components/SponsorshipForm";
import { Award, Crown, Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsor HackIEEE 2026 | Partner With Innovation",
  description:
    "Partner with HackIEEE 2026 to reach top computing students. Support our hackathon and make an impact.",
};

const tiers = [
  {
    name: "Silver Partner",
    price: "₹10,000",
    icon: Award,
    accent: "#4C5BE0",
    perks: ["Logo on website", "Social media shoutout", "Certificate of partnership"],
  },
  {
    name: "Gold Partner",
    price: "₹25,000",
    icon: Crown,
    accent: "#B387E8",
    perks: [
      "Everything in Silver",
      "Booth at the event",
      "Resume book access",
      "Opening ceremony mention",
    ],
  },
  {
    name: "Platinum Partner",
    price: "₹50,000+",
    icon: Gem,
    accent: "#F86AC8",
    perks: [
      "Everything in Gold",
      "Keynote speaking slot",
      "Co-branded hackathon track",
      "Exclusive mentorship access",
    ],
  },
];

export default function SponsorshipPage() {
  return (
    <main className="sponsor-page">
      {/* Background ambient glow */}
      <div className="sponsor-page__glow sponsor-page__glow--1" />
      <div className="sponsor-page__glow sponsor-page__glow--2" />

      <div className="sponsor-page__container">
        {/* Hero Header — clean white like main page */}
        <header className="sponsor-page__header animate-slide-up">
          <p className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-6">
            Partnership Opportunities
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-bold tracking-tighter leading-[1.1] text-white mb-6">
            Sponsor HackIEEE
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-medium">
            Partner with us to reach top computing talent. Support our hackathon,
            workshops, and research initiatives — and make a lasting impact.
          </p>
        </header>

        {/* Tier Cards — glassmorphic like About section */}
        <section className="sponsor-tiers animate-slide-up delay-200">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className="group rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/[0.15] cursor-default"
                style={{
                  opacity: 0,
                  animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 100}ms forwards`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20"
                  style={{ color: tier.accent }}
                >
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                  {tier.name}
                </h3>

                <p
                  className="text-sm font-bold mb-5 tracking-wide"
                  style={{ color: tier.accent }}
                >
                  {tier.price}
                </p>

                <ul className="flex flex-col gap-2.5">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="text-sm text-white/60 leading-relaxed font-medium flex items-start gap-2"
                    >
                      <span className="text-white/30 mt-0.5">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Form Section — glassmorphic container */}
        <section
          className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 md:p-12 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)] animate-slide-up delay-400"
          style={{
            opacity: 0,
            animation: "slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms forwards",
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Interested? <span className="text-sky-400">Let&apos;s talk.</span>
          </h2>
          <p className="text-base text-white/60 mb-8 max-w-lg leading-relaxed font-medium">
            Fill out the form below and we&apos;ll send you our detailed
            sponsorship deck within 24 hours.
          </p>
          <SponsorshipForm />
        </section>
      </div>
    </main>
  );
}
