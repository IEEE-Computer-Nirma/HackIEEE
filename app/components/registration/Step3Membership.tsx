"use client";

import { CreditCard, Check, ShieldCheck, Award } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";

interface Step3MembershipProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
}

export default function Step3Membership({
  formData,
  updateFormData,
  errors,
}: Step3MembershipProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h3 className="text-xl font-semibold tracking-wide text-ink flex items-center gap-2">
          IEEE Membership Information
        </h3>
        <p className="text-sm text-sand/70 mt-1">
          Help us understand your IEEE membership status. Non-members are warmly welcome to participate!
        </p>
      </div>

      <div className="space-y-6">
        {/* IEEE Member Question */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-3">
            Are you an IEEE Member? <span className="text-spice">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateFormData({ isIeeeMember: true })}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                formData.isIeeeMember
                  ? "border-spice bg-spice/10 ring-1 ring-spice shadow-[0_0_20px_rgba(226,130,47,0.15)]"
                  : "border-[rgba(241,214,172,0.18)] bg-[#140f0b]/80 hover:border-spice/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    formData.isIeeeMember
                      ? "border-spice bg-spice text-[#1d130a]"
                      : "border-sand/40"
                  }`}
                >
                  {formData.isIeeeMember && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-ink block">Yes</span>
                  <span className="text-xs text-sand/60">I am an active IEEE member</span>
                </div>
              </div>
              <ShieldCheck size={20} className={formData.isIeeeMember ? "text-spice" : "text-sand/30"} />
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
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                !formData.isIeeeMember
                  ? "border-spice bg-spice/10 ring-1 ring-spice shadow-[0_0_20px_rgba(226,130,47,0.15)]"
                  : "border-[rgba(241,214,172,0.18)] bg-[#140f0b]/80 hover:border-spice/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    !formData.isIeeeMember
                      ? "border-spice bg-spice text-[#1d130a]"
                      : "border-sand/40"
                  }`}
                >
                  {!formData.isIeeeMember && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-ink block">No</span>
                  <span className="text-xs text-sand/60">Not a member currently</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Conditional IEEE Membership Number */}
        {formData.isIeeeMember && (
          <div className="p-4 rounded-xl border border-spice/30 bg-[#19120b] transition-all duration-300">
            <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
              IEEE Membership Number <span className="text-spice">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
                <CreditCard size={18} />
              </div>
              <input
                type="text"
                value={formData.ieeeMembershipNumber || ""}
                onChange={(e) => updateFormData({ ieeeMembershipNumber: e.target.value })}
                placeholder="Enter your 8 or 9 digit IEEE membership number"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                  errors.ieeeMembershipNumber
                    ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                    : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
                }`}
              />
            </div>
            {errors.ieeeMembershipNumber ? (
              <p className="mt-1.5 text-xs text-ember font-medium">
                {errors.ieeeMembershipNumber}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-sand/50">
                Found on your IEEE membership card or profile on ieee.org
              </p>
            )}
          </div>
        )}

        {/* IEEE Computer Society Member Question */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-1">
            Are you an IEEE Computer Society Member? <span className="text-spice">*</span>
          </label>
          <p className="text-xs text-sand/60 mb-3">
            IEEE Computer Society (IEEE CS) is a specialized society under IEEE.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateFormData({ isIeeeCsMember: true })}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                formData.isIeeeCsMember
                  ? "border-spice bg-spice/10 ring-1 ring-spice shadow-[0_0_20px_rgba(226,130,47,0.15)]"
                  : "border-[rgba(241,214,172,0.18)] bg-[#140f0b]/80 hover:border-spice/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    formData.isIeeeCsMember
                      ? "border-spice bg-spice text-[#1d130a]"
                      : "border-sand/40"
                  }`}
                >
                  {formData.isIeeeCsMember && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-ink block">Yes</span>
                  <span className="text-xs text-sand/60">I am an IEEE CS member</span>
                </div>
              </div>
              <Award size={20} className={formData.isIeeeCsMember ? "text-spice" : "text-sand/30"} />
            </button>

            <button
              type="button"
              onClick={() => updateFormData({ isIeeeCsMember: false })}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                !formData.isIeeeCsMember
                  ? "border-spice bg-spice/10 ring-1 ring-spice shadow-[0_0_20px_rgba(226,130,47,0.15)]"
                  : "border-[rgba(241,214,172,0.18)] bg-[#140f0b]/80 hover:border-spice/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    !formData.isIeeeCsMember
                      ? "border-spice bg-spice text-[#1d130a]"
                      : "border-sand/40"
                  }`}
                >
                  {!formData.isIeeeCsMember && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-ink block">No</span>
                  <span className="text-xs text-sand/60">Not a CS member</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
