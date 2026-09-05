import { Metadata } from "next";
import SponsorshipForm from "../components/SponsorshipForm";
import Footer from "../components/Footer";
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
    <>
      <main className="sponsor-page">
        {/* Background Video — same pattern as About section */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* Desktop Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover hidden md:block"
        >
          <source src="/sponser-video.mp4" type="video/mp4" />
        </video>
        {/* Mobile Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover block md:hidden"
        >
          <source src="/sponser-video-mobile.mp4" type="video/mp4" />
        </video>
        {/* Subtle bottom fade only — lets the video breathe */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060f]" />
      </div>

      <div className="sponsor-page__container">
        {/* Hero Header */}
        <header className="sponsor-page__header animate-slide-up">
          <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-6">
            Partnership Opportunities
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-bold tracking-tighter leading-[1.1] text-black mb-6">
            Sponsor HackIEEE
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-xl mx-auto leading-relaxed font-medium">
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
                className="group rounded-2xl border border-black/10 bg-white/80 p-8 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] cursor-default"
                style={{
                  opacity: 0,
                  animation: `slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 100}ms forwards`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6 border border-black/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-black/10"
                  style={{ color: tier.accent }}
                >
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-semibold text-black mb-2 tracking-tight">
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
                      className="text-sm text-black/60 leading-relaxed font-medium flex items-start gap-2"
                    >
                      <span className="text-black/30 mt-0.5">✓</span>
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
          className="rounded-2xl border border-black/10 bg-white/80 p-8 md:p-12 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-slide-up delay-400"
          style={{
            opacity: 0,
            animation: "slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms forwards",
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-2">
            Interested? <span className="text-sky-500">Let&apos;s talk.</span>
          </h2>
          <p className="text-base text-black/50 mb-8 max-w-lg leading-relaxed font-medium">
            Fill out the form below and we&apos;ll send you our detailed
            sponsorship deck within 24 hours.
          </p>
          <SponsorshipForm />
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}
