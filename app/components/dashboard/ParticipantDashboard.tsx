"use client";

import {
  User,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useRegistration } from "@/app/context/RegistrationContext";

export default function ParticipantDashboard() {
  const { openWizard } = useRegistration();
  const [copied, setCopied] = useState(false);
  const regId = "HACK-2026-6S9UU";

  const handleCopy = () => {
    navigator.clipboard?.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full text-ink space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-[0.68rem] font-mono tracking-[0.3em] uppercase text-spice font-semibold mb-2">
          PARTICIPANT PORTAL
        </p>
        <h2 className="display text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-ink uppercase mb-2">
          Dashboard
        </h2>
        <p className="text-sm text-sand/70 max-w-lg mx-auto">
          Track your registration, squad status, and upcoming event milestones.
        </p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-spice to-transparent mx-auto mt-4" />
      </div>

      {/* Participant Profile Banner */}
      <div className="rounded-2xl border border-spice/40 bg-[#120d09]/95 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(226,130,47,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-spice/50 bg-gradient-to-tr from-spice/20 to-amber-500/20 flex items-center justify-center text-spice-hot shadow-[0_0_20px_rgba(226,130,47,0.3)]">
            <User size={30} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-ink">Vishwa Ghori</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold">
                Verified
              </span>
            </div>
            <p className="text-xs text-sand/70 mt-0.5">
              Nirma University · B.Tech CSE (2nd Year)
            </p>
            <p className="text-xs text-sand/50">vishwa@ieeenirma.org</p>
          </div>
        </div>

        {/* Reg ID Box */}
        <div className="p-4 rounded-xl border border-spice/30 bg-spice/10 flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-sand/60">
              Registration ID
            </p>
            <p className="font-mono text-lg font-bold text-spice-hot">{regId}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-surface hover:bg-spice/20 text-sand hover:text-spice transition-colors cursor-pointer"
            title="Copy ID"
          >
            {copied ? <Check size={16} className="text-spice" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Registration Status */}
        <div className="p-5 rounded-2xl border border-line bg-[#16100c] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-sand/60 font-mono uppercase">Registration</p>
            <p className="text-sm font-bold text-ink">Confirmed ✓</p>
            <p className="text-[11px] text-emerald-400">Step 5 Completed</p>
          </div>
        </div>

        {/* Team Status */}
        <div className="p-5 rounded-2xl border border-line bg-[#16100c] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-spice/10 border border-spice/30 text-spice flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-sand/60 font-mono uppercase">Team Status</p>
            <p className="text-sm font-bold text-ink">Sandwalkers</p>
            <p className="text-[11px] text-spice-hot">4 / 4 Members (Leader)</p>
          </div>
        </div>

        {/* Event Mode */}
        <div className="p-5 rounded-2xl border border-line bg-[#16100c] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-xs text-sand/60 font-mono uppercase">Hackathon Mode</p>
            <p className="text-sm font-bold text-ink">In-Person Offline</p>
            <p className="text-[11px] text-sand/60">Nirma University</p>
          </div>
        </div>
      </div>

      {/* Event Roadmap Checklist */}
      <div className="rounded-2xl border border-line-strong bg-[#140e0a]/90 backdrop-blur-md p-6">
        <h4 className="text-sm font-mono uppercase tracking-widest text-sand/80 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-spice" />
          <span>Event Roadmap & Checklist</span>
        </h4>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-ink">1. Individual Participant Registration</p>
                <p className="text-sand/60">Registered with personal and academic details</p>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-semibold">Done</span>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-ink">2. Form or Join a Team (2-4 Members)</p>
                <p className="text-sand/60">Team Sandwalkers formed with 4 members</p>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-semibold">Done</span>
          </div>

          <div className="p-3.5 rounded-xl border border-line bg-surface flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border border-sand/40 flex items-center justify-center shrink-0 text-[10px]">
                3
              </div>
              <div>
                <p className="font-semibold text-ink">3. Confirmations & Track Declaration</p>
                <p className="text-sand/60">Selected teams confirmed and problem statements declared</p>
              </div>
            </div>
            <span className="font-mono text-spice font-semibold">Dec 20, 2026</span>
          </div>

          <div className="p-3.5 rounded-xl border border-line bg-surface flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border border-sand/40 flex items-center justify-center shrink-0 text-[10px]">
                4
              </div>
              <div>
                <p className="font-semibold text-ink">4. 48-Hour Hackathon Main Event</p>
                <p className="text-sand/60">3 days of offline hacking, mentoring, and pitches</p>
              </div>
            </div>
            <span className="font-mono text-sand/60 font-semibold">Jan 2–4, 2027</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => openWizard("team")}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice via-spice-hot to-amber-500 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] flex items-center gap-2 cursor-pointer"
        >
          <Users size={16} />
          <span>Manage Team</span>
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          onClick={() => openWizard("registration")}
          className="px-6 py-2.5 rounded-xl border border-line hover:border-spice bg-surface hover:bg-surface-solid text-sand hover:text-ink text-xs font-medium transition-colors cursor-pointer"
        >
          Edit Registration
        </button>
      </div>
    </div>
  );
}
