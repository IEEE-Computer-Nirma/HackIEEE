"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

interface RegistrationSuccessProps {
  registrationId: string;
  participantName: string;
  email: string;
  onClose: () => void;
  isDark?: boolean;
}

export default function RegistrationSuccess({
  registrationId,
  participantName,
  email,
  onClose,
  isDark = false,
}: RegistrationSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-6 px-2 text-center max-w-lg mx-auto">
      {/* Checkmark with Cosmic Horizon Sky Accent matching the sky */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#38bdf8]/25 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#1e3fd8] via-[#38bdf8] to-white p-0.5 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
          <div
            className={`w-full h-full rounded-full flex items-center justify-center ${
              isDark ? "bg-[#140f0b] text-[#38bdf8]" : "bg-[#fefcf8] text-[#1e3fd8]"
            }`}
          >
            <CheckCircle2 size={34} strokeWidth={2.4} />
          </div>
        </div>
      </div>

      {/* Confirmation Badge */}
      <span
        className={`inline-block px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-3 border ${
          isDark
            ? "bg-[#1e3fd8]/20 border-[#38bdf8]/40 text-[#38bdf8]"
            : "bg-[#e0f2fe] border-[#bae6fd] text-[#0284c7]"
        }`}
      >
        Registration Confirmed
      </span>

      {/* Welcome Title */}
      <h3
        className={`text-2xl sm:text-3xl font-[family-name:var(--font-dune)] tracking-[0.05em] lowercase mb-2 ${
          isDark ? "text-white" : "text-[#231b12]"
        }`}
      >
        welcome to hackieee
      </h3>

      {/* Participant Subtitle */}
      <p
        className={`text-sm mb-6 leading-relaxed ${
          isDark ? "text-[#f3e6cf]/75" : "text-[#6e6456]"
        }`}
      >
        Thank you,{" "}
        <strong className={isDark ? "text-white font-bold" : "text-[#231b12] font-bold"}>
          {participantName}
        </strong>
        . Your registration has been securely recorded.
      </p>

      {/* Registration ID Box */}
      <div
        className={`p-5 rounded-2xl border mb-6 relative transition-all ${
          isDark
            ? "bg-[#18110b] border-[rgba(248,207,150,0.2)] shadow-md"
            : "bg-[#f5f0e8] border-[#e5dcce] shadow-sm"
        }`}
      >
        <p
          className={`text-[11px] uppercase font-mono font-bold tracking-wider mb-1.5 ${
            isDark ? "text-[#ffa64d]" : "text-[#c67634]"
          }`}
        >
          Your Registration ID
        </p>
        <div className="flex items-center justify-center gap-3">
          <span
            className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-widest selection:bg-[#c06820] selection:text-white ${
              isDark ? "text-white" : "text-[#231b12]"
            }`}
          >
            {registrationId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Registration ID"
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "bg-[#241910] hover:bg-[#2e2015] border-[rgba(248,207,150,0.25)] text-[#ffa64d]"
                : "bg-[#faefe3] hover:bg-[#f6e6d5] border-[#edd5c0] text-[#c06820]"
            }`}
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
        </div>
        {copied && (
          <p className="text-xs text-emerald-500 mt-2 font-medium">
            ✓ Registration ID copied to clipboard!
          </p>
        )}
      </div>

      {/* Next Steps Guidance */}
      <div
        className={`text-left rounded-2xl border p-5 mb-6 space-y-3.5 ${
          isDark
            ? "border-[rgba(248,207,150,0.18)] bg-[#18110b]"
            : "border-[#e5dcce] bg-[#f8f5ee]"
        }`}
      >
        <p
          className={`text-xs font-mono uppercase tracking-wider font-bold ${
            isDark ? "text-[#ffa64d]" : "text-[#c67634]"
          }`}
        >
          What to do next:
        </p>
        <div className="flex items-start gap-3 text-xs leading-relaxed">
          <span className="w-5 h-5 rounded-full bg-[#c06820] text-white flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
            1
          </span>
          <p className={isDark ? "text-[#f3e6cf]/80" : "text-[#5c5245]"}>
            Keep your <strong className={isDark ? "text-white" : "text-[#231b12]"}>Registration ID</strong> safe for check-in and communications.
          </p>
        </div>
        <div className="flex items-start gap-3 text-xs leading-relaxed">
          <span className="w-5 h-5 rounded-full bg-[#c06820] text-white flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
            2
          </span>
          <p className={isDark ? "text-[#f3e6cf]/80" : "text-[#5c5245]"}>
            We&apos;ve sent your confirmation receipt to{" "}
            <span className={`font-semibold ${isDark ? "text-white" : "text-[#231b12]"}`}>{email}</span>.
          </p>
        </div>
        <div className="flex items-start gap-3 text-xs leading-relaxed">
          <span className="w-5 h-5 rounded-full bg-[#c06820] text-white flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
            3
          </span>
          <p className={isDark ? "text-[#f3e6cf]/80" : "text-[#5c5245]"}>
            Prepare your project ideas for the 48-hour offline hackathon sprint!
          </p>
        </div>
      </div>

      {/* Actions: Solid Orange Button, no gradient tricks */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#c06820] hover:bg-[#b05c18] active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_8px_25px_rgba(192,104,32,0.35)] cursor-pointer"
        >
          Return to HackIEEE
        </button>
      </div>
    </div>
  );
}
