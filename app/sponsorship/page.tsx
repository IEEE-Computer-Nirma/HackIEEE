import { Metadata } from "next";
import SponsorshipForm from "../components/SponsorshipForm";
import Footer from "../components/Footer";
import ShapeWaves from "../components/ShapeWaves";
import { Award, Crown, Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsor hackieee 2026 | Partner With Innovation",
  description:
    "Partner with hackieee 2026 to reach top computing students. Support our hackathon and make an impact.",
};

const tiers = [
  { icon: Crown, label: "Title" },
  { icon: Award, label: "Track" },
  { icon: Gem, label: "Goodies / Swag" },
];

export default function SponsorshipPage() {
  return (
    <>
      <main className="sponsor-page">
        <div className="absolute inset-x-0 top-0 h-[34rem] md:h-[40rem]">
          <ShapeWaves className="waves--frame" />
        </div>

        <div className="sponsor-page__container">
          <header className="sponsor-page__header animate-slide-up">
            <p className="eyebrow">Partnership Opportunities</p>
            <h1 className="display mt-6 text-[2rem] leading-tight text-ink sm:text-5xl md:text-6xl">
              Sponsor hackieee
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">
              Partner with us to power the next generation of builders; become a Title, Track, or Goodies/Swag
              Sponsor!
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
              {tiers.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm text-ink"
                >
                  <Icon size={16} strokeWidth={1.6} className="text-spice" />
                  {label}
                </li>
              ))}
            </ul>
          </header>

          <section
            className="card mx-auto max-w-4xl p-6 md:p-12"
            style={{
              opacity: 0,
              animation: "slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards",
              background: "color-mix(in srgb, var(--surface-solid) 88%, transparent)",
            }}
          >
            <h2 className="text-2xl font-medium tracking-tight text-ink md:text-3xl">
              Interested? <span className="text-spice">Let&apos;s talk.</span>
            </h2>
            <p className="mb-8 mt-2 max-w-lg text-base leading-relaxed text-ink-2">
              Interested in teaming up? Drop your details below and we&apos;ll get back to you shortly!
            </p>
            <SponsorshipForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
