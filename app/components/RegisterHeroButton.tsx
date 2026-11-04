"use client";

import { useRegistration } from "@/app/context/RegistrationContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function RegisterHeroButton({
  className = "",
}: {
  className?: string;
}) {
  const { openWizard } = useRegistration();

  return (
    <button
      type="button"
      onClick={() => openWizard("registration")}
      className={`btn btn-sand group flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(226,130,47,0.45)] hover:shadow-[0_0_35px_rgba(226,130,47,0.6)] transition-all ${className}`}
    >
      <Sparkles size={16} className="text-sand-ink group-hover:rotate-12 transition-transform" />
      <span>Register Now</span>
      <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
