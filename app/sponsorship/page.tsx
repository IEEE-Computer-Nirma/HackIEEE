import { Metadata } from "next";
import SponsorshipForm from "../components/SponsorshipForm";
import Footer from "../components/Footer";
import { Award, Crown, Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsor HackIEEE 2026 | Partner With Innovation",
  description:
    "Partner with HackIEEE 2026 to reach top computing students. Support our hackathon and make an impact.",
};


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
