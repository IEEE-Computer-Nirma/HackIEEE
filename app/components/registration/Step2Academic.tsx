"use client";

import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";
import { DEGREE_OPTIONS, YEAR_OF_STUDY_OPTIONS } from "@/app/data/universities";
import UniversityAutocomplete from "./UniversityAutocomplete";

interface Step2AcademicProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
  isDark?: boolean;
}

export default function Step2Academic({
  formData,
  updateFormData,
  errors,
  isDark = false,
}: Step2AcademicProps) {
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => String(currentYear - 1 + i));

  const isCustomDegree = formData.degree === "Other";

  const inputClass = isDark
    ? "bg-[#18110b] border-[rgba(248,207,150,0.2)] text-[#f3e6cf] placeholder:text-[#f3e6cf]/35 hover:border-[rgba(248,207,150,0.35)] focus:border-[#ffa64d] focus:ring-1 focus:ring-[#ffa64d]/30"
    : "bg-[#f5f0e8] border-[#e5dcce] text-[#2b2318] placeholder:text-[#9a9184] hover:border-[#c67634]/60 focus:border-[#c06820] focus:ring-1 focus:ring-[#c06820]/30";

  const labelClass = isDark
    ? "block text-[11px] font-mono uppercase tracking-wider text-[#ffa64d] font-bold mb-1.5"
    : "block text-[11px] font-mono uppercase tracking-wider text-[#c67634] font-bold mb-1.5";

  const asteriskClass = isDark ? "text-[#ffa64d]" : "text-[#c06820]";
  const iconColor = isDark ? "text-[#f3e6cf]/40" : "text-[#8a8073]";

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className={`pb-3 border-b ${isDark ? "border-[rgba(248,207,150,0.15)]" : "border-[#f0e4d7]"}`}>
        <h3 className={`text-xl font-[family-name:var(--font-dune)] lowercase tracking-[0.06em] ${isDark ? "text-white" : "text-[#2b2318]"}`}>
          academic information
        </h3>
        <p className={`text-xs mt-0.5 ${isDark ? "text-[#f3e6cf]/70" : "text-[#7f7669]"}`}>
          Tell us about your educational background.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* University / Institution Name */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            University / Institution Name <span className={asteriskClass}>*</span>
          </label>
          <UniversityAutocomplete
            value={formData.university}
            onChange={(name, univ) => {
              updateFormData({
                university: name,
                universityId: univ?.id || "",
                isCustomUniversity: univ ? !univ.isVerified : true,
              });
            }}
            error={errors.university}
            isDark={isDark}
          />
        </div>

        {/* Degree / Program */}
        <div>
          <label className={labelClass}>
            Degree / Program <span className={asteriskClass}>*</span>
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${iconColor}`}>
              <GraduationCap size={17} />
            </div>
            <select
              value={formData.degree}
              onChange={(e) => {
                const val = e.target.value;
                updateFormData({
                  degree: val,
                  customDegree: val === "Other" ? formData.customDegree : "",
                });
              }}
              className={`w-full pl-10 pr-9 py-3 rounded-xl text-sm transition-all outline-none cursor-pointer appearance-none ${inputClass} ${
                errors.degree ? "border-red-500/80 focus:border-red-500" : ""
              }`}
            >
              <option value="" disabled className={isDark ? "bg-[#18110b] text-[#f3e6cf]" : "bg-[#fefbf6] text-[#2b2318]"}>
                Select degree / program
              </option>
              {DEGREE_OPTIONS.map((d) => (
                <option key={d} value={d} className={isDark ? "bg-[#18110b] text-[#f3e6cf]" : "bg-[#fefbf6] text-[#2b2318]"}>
                  {d}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs ${iconColor}`}>
              ▼
            </div>
          </div>
          {errors.degree && <p className="mt-1 text-xs text-red-500 font-medium">{errors.degree}</p>}
        </div>

        {/* Custom Degree Input */}
        {isCustomDegree && (
          <div className="md:col-span-2">
            <label className={labelClass}>
              Specify Degree / Program <span className={asteriskClass}>*</span>
            </label>
            <input
              type="text"
              value={formData.customDegree || ""}
              onChange={(e) => updateFormData({ customDegree: e.target.value })}
              placeholder="e.g. Dual Degree BS-MS, Diploma, etc."
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
                errors.customDegree ? "border-red-500/80 focus:border-red-500" : ""
              }`}
            />
            {errors.customDegree && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.customDegree}</p>
            )}
          </div>
        )}

        {/* Branch / Department */}
        <div>
          <label className={labelClass}>
            Branch / Department <span className={asteriskClass}>*</span>
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${iconColor}`}>
              <BookOpen size={17} />
            </div>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => updateFormData({ branch: e.target.value })}
              placeholder="e.g. Computer Science, IT, Electronics"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${inputClass} ${
                errors.branch ? "border-red-500/80 focus:border-red-500" : ""
              }`}
            />
          </div>
          {errors.branch && <p className="mt-1 text-xs text-red-500 font-medium">{errors.branch}</p>}
        </div>

        {/* Current Year of Study */}
        <div>
          <label className={labelClass}>
            Current Year of Study <span className={asteriskClass}>*</span>
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${iconColor}`}>
              <Calendar size={17} />
            </div>
            <select
              value={formData.yearOfStudy}
              onChange={(e) => updateFormData({ yearOfStudy: e.target.value })}
              className={`w-full pl-10 pr-9 py-3 rounded-xl text-sm transition-all outline-none cursor-pointer appearance-none ${inputClass} ${
                errors.yearOfStudy ? "border-red-500/80 focus:border-red-500" : ""
              }`}
            >
              <option value="" disabled className={isDark ? "bg-[#18110b] text-[#f3e6cf]" : "bg-[#fefbf6] text-[#2b2318]"}>
                Select current year
              </option>
              {YEAR_OF_STUDY_OPTIONS.map((y) => (
                <option key={y} value={y} className={isDark ? "bg-[#18110b] text-[#f3e6cf]" : "bg-[#fefbf6] text-[#2b2318]"}>
                  {y}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs ${iconColor}`}>
              ▼
            </div>
          </div>
          {errors.yearOfStudy && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.yearOfStudy}</p>
          )}
        </div>

        {/* Expected Graduation Year */}
        <div>
          <label className={labelClass}>
            Expected Graduation Year <span className={asteriskClass}>*</span>
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${iconColor}`}>
              <Calendar size={17} />
            </div>
            <select
              value={formData.graduationYear}
              onChange={(e) => updateFormData({ graduationYear: e.target.value })}
              className={`w-full pl-10 pr-9 py-3 rounded-xl text-sm transition-all outline-none cursor-pointer appearance-none ${inputClass} ${
                errors.graduationYear ? "border-red-500/80 focus:border-red-500" : ""
              }`}
            >
              <option value="" disabled className={isDark ? "bg-[#18110b] text-[#f3e6cf]" : "bg-[#fefbf6] text-[#2b2318]"}>
                Select graduation year
              </option>
              {graduationYears.map((yr) => (
                <option key={yr} value={yr} className={isDark ? "bg-[#18110b] text-[#f3e6cf]" : "bg-[#fefbf6] text-[#2b2318]"}>
                  {yr}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs ${iconColor}`}>
              ▼
            </div>
          </div>
          {errors.graduationYear && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.graduationYear}</p>
          )}
        </div>
      </div>
    </div>
  );
}
