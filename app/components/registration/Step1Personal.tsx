"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";
import CustomSelect from "./CustomSelect";

interface Step1PersonalProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
  isDark?: boolean;
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
  isDark = false,
}: Step1PersonalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const nameParts = (formData.fullName || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const handleFirstNameChange = (val: string) => {
    const combined = lastName ? `${val} ${lastName}`.trim() : val;
    updateFormData({ fullName: combined });
  };

  const handleLastNameChange = (val: string) => {
    const combined = firstName ? `${firstName} ${val}`.trim() : val;
    updateFormData({ fullName: combined });
  };

  const inputClass = isDark
    ? "bg-[#18110b] border-[rgba(248,207,150,0.2)] text-[#f3e6cf] placeholder:text-[#f3e6cf]/35 hover:border-[rgba(248,207,150,0.35)] focus:border-[#ffa64d] focus:ring-1 focus:ring-[#ffa64d]/30"
    : "bg-[#f5f0e8] border-[#e5dcce] text-[#2b2318] placeholder:text-[#9a9184] hover:border-[#c67634]/60 focus:border-[#c06820] focus:ring-1 focus:ring-[#c06820]/30";

  const labelClass = isDark
    ? "block text-[11px] font-mono uppercase tracking-wider text-[#ffa64d] font-bold mb-1.5"
    : "block text-[11px] font-mono uppercase tracking-wider text-[#c67634] font-bold mb-1.5";

  const asteriskClass = isDark ? "text-[#ffa64d]" : "text-[#c06820]";
  const subtextClass = isDark ? "text-[#f3e6cf]/45" : "text-[#8a8073]";

  return (
    <div className="space-y-4">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="reg-firstname" className={labelClass}>
            First Name <span className={asteriskClass}>*</span>
          </label>
          <input
            id="reg-firstname"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            placeholder="ex. Deep"
            className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
              errors.fullName ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30" : ""
            }`}
          />
        </div>

        <div>
          <label htmlFor="reg-lastname" className={labelClass}>
            Last Name <span className={asteriskClass}>*</span>
          </label>
          <input
            id="reg-lastname"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
            placeholder="ex. Joshi"
            className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass}`}
          />
        </div>
      </div>
      {errors.fullName && (
        <p className="-mt-2 text-xs text-red-500 font-medium">{errors.fullName}</p>
      )}

      {/* Email Address */}
      <div>
        <label htmlFor="reg-email" className={labelClass}>
          Email <span className={asteriskClass}>*</span>
        </label>
        <div className="relative">
          <input
            id="reg-email"
            name="personalEmail"
            type="email"
            required
            autoComplete="email"
            value={formData.personalEmail}
            onChange={(e) => updateFormData({ personalEmail: e.target.value })}
            placeholder="deep@computer.org"
            className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
              errors.personalEmail ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30" : ""
            }`}
          />
        </div>
        {errors.personalEmail && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.personalEmail}</p>
        )}
      </div>

      {/* Password with Eye toggle */}
      <div>
        <label htmlFor="reg-password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="Secure your account"
            autoComplete="new-password"
            className={`w-full pl-4 pr-11 py-3 rounded-xl text-sm transition-all outline-none ${inputClass}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer ${
              isDark ? "text-[#f3e6cf]/50 hover:text-[#ffa64d]" : "text-[#9a9184] hover:text-[#c06820]"
            }`}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className={`mt-1 text-[11px] font-mono ${subtextClass}`}>
          Requires at least 8 symbols. (Optional for direct portal access)
        </p>
      </div>

      {/* Phone Number with Country Code */}
      <div>
        <label htmlFor="reg-phone" className={labelClass}>
          Phone Number <span className={asteriskClass}>*</span>
        </label>
        <div className="flex gap-2.5">
          <div className="w-36 sm:w-40 shrink-0">
            <CustomSelect
              id="reg-countrycode"
              name="countryCode"
              value={formData.countryCode}
              onChange={(val) => updateFormData({ countryCode: val })}
              options={COUNTRY_CODES.map((c) => ({ value: c.code, label: c.label }))}
              placeholder="+91"
              isDark={isDark}
            />
          </div>

          <div className="relative flex-1">
            <input
              id="reg-phone"
              name="phoneNumber"
              type="tel"
              required
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              placeholder="98765 43210"
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
                errors.phoneNumber ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30" : ""
              }`}
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.phoneNumber}</p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="reg-city" className={labelClass}>
            City <span className={asteriskClass}>*</span>
          </label>
          <input
            id="reg-city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            placeholder="ex. Ahmedabad"
            className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
              errors.city ? "border-red-500/80 focus:border-red-500" : ""
            }`}
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="reg-state" className={labelClass}>
            State <span className={asteriskClass}>*</span>
          </label>
          <input
            id="reg-state"
            name="state"
            type="text"
            required
            autoComplete="address-level1"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            placeholder="ex. Gujarat"
            className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
              errors.state ? "border-red-500/80 focus:border-red-500" : ""
            }`}
          />
          {errors.state && <p className="mt-1 text-xs text-red-400">{errors.state}</p>}
        </div>
      </div>

      {/* College Email (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="reg-collegeemail" className={labelClass.replace(" mb-1.5", "")}>
            College / Institutional Email
          </label>
          <span className={`text-[11px] font-mono ${subtextClass}`}>Optional</span>
        </div>
        <input
          id="reg-collegeemail"
          name="collegeEmail"
          type="email"
          autoComplete="email"
          value={formData.collegeEmail || ""}
          onChange={(e) => updateFormData({ collegeEmail: e.target.value })}
          placeholder="deep.j@nirmauni.ac.in"
          className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass}`}
        />
        {errors.collegeEmail && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.collegeEmail}</p>
        )}
      </div>
    </div>
  );
}
