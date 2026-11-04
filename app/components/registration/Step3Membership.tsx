"use client";

import { CreditCard, Check, ShieldCheck, Award } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";

interface Step3MembershipProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
  isDark?: boolean;
}

export default function Step3Membership({
  formData,
  updateFormData,
  errors,
  isDark = false,
}: Step3MembershipProps) {
  const labelClass = isDark
    ? "block text-[11px] font-mono uppercase tracking-wider text-[#ffa64d] font-bold mb-2"
    : "block text-[11px] font-mono uppercase tracking-wider text-[#c67634] font-bold mb-2";

  const asteriskClass = isDark ? "text-[#ffa64d]" : "text-[#c06820]";
  const subtextClass = isDark ? "text-[#f3e6cf]/60" : "text-[#7f7669]";

  const activeBtnClass = isDark
    ? "border-[#ffa64d] bg-[#e2822f]/20 ring-1 ring-[#ffa64d]/30 shadow-[0_4px_16px_rgba(226,130,47,0.2)]"
    : "border-[#c06820] bg-[#faefe3] ring-1 ring-[#c06820]/30 shadow-[0_4px_16px_rgba(192,104,32,0.15)]";

  const inactiveBtnClass = isDark
    ? "border-[rgba(248,207,150,0.18)] bg-[#18110b] hover:border-[rgba(248,207,150,0.35)]"
    : "border-[#e5dcce] bg-[#f5f0e8] hover:border-[#c67634]/60";

  const activeDotClass = isDark
    ? "border-[#ffa64d] bg-[#ffa64d] text-[#140e0a] font-bold"
    : "border-[#c06820] bg-[#c06820] text-white font-bold";

  const inactiveDotClass = isDark ? "border-[#f3e6cf]/30" : "border-[#d8cfc2]";

  return (
    <div className="space-y-6">
      {/* IEEE Member Question */}
      <div>
        <label className={labelClass}>
          Are you an active IEEE Member? <span className={asteriskClass}>*</span>
        </label>
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => updateFormData({ isIeeeMember: true })}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
              formData.isIeeeMember ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  formData.isIeeeMember ? activeDotClass : inactiveDotClass
                }`}
              >
                {formData.isIeeeMember && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-[#2b2318]"}`}>
                  Yes
                </span>
                <span className={`text-xs ${subtextClass}`}>Active member</span>
              </div>
            </div>
            <ShieldCheck size={18} className={formData.isIeeeMember ? (isDark ? "text-[#ffa64d]" : "text-[#c06820]") : (isDark ? "text-[#f3e6cf]/30" : "text-[#9a9184]")} />
          </button>

          <button
            type="button"
            onClick={() =>
              updateFormData({
                isIeeeMember: false,
                ieeeMembershipNumber: "",
                isIeeeCsMember: false,
              })
            }
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
              !formData.isIeeeMember ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  !formData.isIeeeMember ? activeDotClass : inactiveDotClass
                }`}
              >
                {!formData.isIeeeMember && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-[#2b2318]"}`}>
                  No
                </span>
                <span className={`text-xs ${subtextClass}`}>Not a member</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Conditional IEEE Membership Number */}
      {formData.isIeeeMember && (
        <div className={`p-4 rounded-xl border transition-all space-y-2 ${
          isDark ? "border-[rgba(248,207,150,0.2)] bg-[#18110b]/80" : "border-[#ecd8c5] bg-[#faefe3]/60"
        }`}>
          <label className={labelClass.replace(" mb-2", "")}>
            IEEE Membership Number <span className={asteriskClass}>*</span>
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${isDark ? "text-[#f3e6cf]/40" : "text-[#8a8073]"}`}>
              <CreditCard size={17} />
            </div>
            <input
              type="text"
              value={formData.ieeeMembershipNumber || ""}
              onChange={(e) => updateFormData({ ieeeMembershipNumber: e.target.value })}
              placeholder="e.g. 98765432"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                isDark
                  ? "bg-[#140e0a] border-[rgba(248,207,150,0.2)] text-[#f3e6cf] placeholder:text-[#f3e6cf]/35 focus:border-[#ffa64d] focus:ring-1 focus:ring-[#ffa64d]/30"
                  : "bg-[#f5f0e8] border-[#e5dcce] text-[#2b2318] placeholder:text-[#9a9184] hover:border-[#c67634]/60 focus:border-[#c06820] focus:ring-1 focus:ring-[#c06820]/30"
              } ${errors.ieeeMembershipNumber ? "border-red-500/80 focus:border-red-500" : ""}`}
            />
          </div>
          {errors.ieeeMembershipNumber ? (
            <p className="text-xs text-red-500 font-medium">
              {errors.ieeeMembershipNumber}
            </p>
          ) : (
            <p className={`text-[11px] font-mono ${subtextClass}`}>
              Found on your IEEE membership card or profile on ieee.org
            </p>
          )}
        </div>
      )}

      {/* IEEE Computer Society Member Question */}
      <div>
        <label className={labelClass.replace(" mb-2", " mb-1")}>
          Are you an IEEE Computer Society (CS) Member? <span className={asteriskClass}>*</span>
        </label>
        <p className={`text-xs mb-3 ${subtextClass}`}>
          Specialized society under IEEE offering extra computational tracks.
        </p>
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => updateFormData({ isIeeeCsMember: true })}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
              formData.isIeeeCsMember ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  formData.isIeeeCsMember ? activeDotClass : inactiveDotClass
                }`}
              >
                {formData.isIeeeCsMember && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-[#2b2318]"}`}>
                  Yes
                </span>
                <span className={`text-xs ${subtextClass}`}>CS member</span>
              </div>
            </div>
            <Award size={18} className={formData.isIeeeCsMember ? (isDark ? "text-[#ffa64d]" : "text-[#c06820]") : (isDark ? "text-[#f3e6cf]/30" : "text-[#9a9184]")} />
          </button>

          <button
            type="button"
            onClick={() => updateFormData({ isIeeeCsMember: false })}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
              !formData.isIeeeCsMember ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  !formData.isIeeeCsMember ? activeDotClass : inactiveDotClass
                }`}
              >
                {!formData.isIeeeCsMember && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <span className={`text-sm font-semibold block ${isDark ? "text-white" : "text-[#2b2318]"}`}>
                  No
                </span>
                <span className={`text-xs ${subtextClass}`}>Not a CS member</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
