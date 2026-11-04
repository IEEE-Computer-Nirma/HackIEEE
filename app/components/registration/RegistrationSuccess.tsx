"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

interface RegistrationSuccessProps {
  registrationId: string;
  participantName: string;
  email: string;
  onClose: () => void;
}

export default function RegistrationSuccess({
  registrationId,
  participantName,
  email,
  onClose,
}: RegistrationSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-6 px-2 text-center max-w-lg mx-auto">
      {/* Glowing Checkmark Animation */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-spice/20 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-spice to-amber-400 p-0.5 shadow-[0_0_30px_rgba(226,130,47,0.6)]">
          <div className="w-full h-full rounded-full bg-[#16100b] flex items-center justify-center text-spice-hot">
            <CheckCircle2 size={36} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <span className="inline-block px-3 py-1 rounded-full bg-spice/15 border border-spice/40 text-spice-hot font-mono text-xs uppercase tracking-widest mb-3">
        Registration Confirmed
      </span>

      <h3 className="display text-2xl md:text-3xl text-ink font-bold mb-2">
        Welcome to the Mission
      </h3>
      <p className="text-sand/80 text-sm mb-6 leading-relaxed">
        Thank you, <strong className="text-ink font-semibold">{participantName}</strong>. Your registration has been securely recorded.
      </p>

      {/* Registration ID Box */}
      <div className="p-4 rounded-xl border border-spice/40 bg-spice/10 backdrop-blur-md mb-6 relative">
        <p className="text-xs uppercase font-mono tracking-widest text-sand/60 mb-1">
          Your Registration ID
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-bold tracking-widest text-spice-hot selection:bg-spice selection:text-black">
            {registrationId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Registration ID"
            className="p-2 rounded-lg bg-surface hover:bg-spice/20 border border-line hover:border-spice text-sand hover:text-spice-hot transition-all duration-200"
          >
            {copied ? <Check size={16} className="text-spice" /> : <Copy size={16} />}
          </button>
        </div>
        {copied && (
          <p className="text-xs text-spice mt-1.5 font-medium animate-fade-in">
            Registration ID copied to clipboard!
          </p>
        )}
      </div>

      {/* Next Steps Guidance */}
      <div className="text-left rounded-xl border border-line bg-[#16100c]/80 p-4 mb-6 space-y-3">
        <p className="text-xs font-mono uppercase tracking-wider text-sand/60">
          What to do next:
        </p>
        <div className="flex items-start gap-2.5 text-xs text-sand/80">
          <span className="w-5 h-5 rounded-full bg-spice/20 text-spice-hot flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
            1
          </span>
          <p>
            Keep your <strong className="text-ink">Registration ID</strong> safe. You will need it to form or join teams.
          </p>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-sand/80">
          <span className="w-5 h-5 rounded-full bg-spice/20 text-spice-hot flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
            2
          </span>
          <p>
            We&apos;ve logged your confirmation for <span className="text-ink font-medium">{email}</span>.
          </p>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-sand/80">
          <span className="w-5 h-5 rounded-full bg-spice/20 text-spice-hot flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
            3
          </span>
          <p>
            Head over to <strong className="text-ink">Team Management</strong> to create your squad or join an existing team.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand hover:text-ink font-medium text-sm transition-colors"
        >
          Close Wizard
        </button>
      </div>
    </div>
  );
}
