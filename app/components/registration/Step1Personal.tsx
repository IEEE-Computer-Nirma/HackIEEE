"use client";

import { User, Phone, Mail, MapPin, Globe } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";

interface Step1PersonalProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
}

const COUNTRY_CODES = [
  { code: "+91", label: "+91 (India)" },
  { code: "+1", label: "+1 (US/Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+33", label: "+33 (France)" },
];

export default function Step1Personal({
  formData,
  updateFormData,
  errors,
}: Step1PersonalProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h3 className="text-xl font-semibold tracking-wide text-ink flex items-center gap-2">
          Personal Information
        </h3>
        <p className="text-sm text-sand/70 mt-1">
          Let&apos;s start with some basic information about you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Full Name <span className="text-spice">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <User size={18} />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="Enter your full name"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                errors.fullName
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number with Country Code */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Phone Number <span className="text-spice">*</span>
          </label>
          <div className="flex gap-2.5">
            <div className="relative w-36 shrink-0">
              <select
                value={formData.countryCode}
                onChange={(e) => updateFormData({ countryCode: e.target.value })}
                className="w-full px-3 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] text-ink text-sm focus:border-spice focus:ring-1 focus:ring-spice/40 outline-none cursor-pointer appearance-none"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#1a140e] text-ink">
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sand/50 text-xs">
                ▼
              </div>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                  errors.phoneNumber
                    ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                    : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
                }`}
              />
            </div>
          </div>
          {errors.phoneNumber && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Personal Email Address */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Personal Email Address <span className="text-spice">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={formData.personalEmail}
              onChange={(e) => updateFormData({ personalEmail: e.target.value })}
              placeholder="Enter your personal email"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                errors.personalEmail
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            />
          </div>
          {errors.personalEmail && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.personalEmail}</p>
          )}
        </div>

        {/* College Email Address */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            College Email Address <span className="text-sand/40 normal-case tracking-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={formData.collegeEmail || ""}
              onChange={(e) => updateFormData({ collegeEmail: e.target.value })}
              placeholder="Enter your college email"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                errors.collegeEmail
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            />
          </div>
          {errors.collegeEmail && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.collegeEmail}</p>
          )}
        </div>

        {/* City, State, Country */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
              City <span className="text-spice">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="Enter city"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                  errors.city
                    ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                    : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
                }`}
              />
            </div>
            {errors.city && (
              <p className="mt-1.5 text-xs text-ember font-medium">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
              State <span className="text-spice">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => updateFormData({ state: e.target.value })}
                placeholder="Enter state"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                  errors.state
                    ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                    : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
                }`}
              />
            </div>
            {errors.state && (
              <p className="mt-1.5 text-xs text-ember font-medium">{errors.state}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
              Country <span className="text-spice">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
                <Globe size={18} />
              </div>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
                placeholder="Enter country"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                  errors.country
                    ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                    : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
                }`}
              />
            </div>
            {errors.country && (
              <p className="mt-1.5 text-xs text-ember font-medium">{errors.country}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
