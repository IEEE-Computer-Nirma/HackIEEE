"use client";

import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";
import { DEGREE_OPTIONS, YEAR_OF_STUDY_OPTIONS } from "@/app/data/universities";
import UniversityAutocomplete from "./UniversityAutocomplete";
import CustomSelect from "./CustomSelect";

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
          <CustomSelect
            value={formData.degree}
            onChange={(val) => {
              updateFormData({
                degree: val,
                customDegree: val === "Other" ? formData.customDegree : "",
              });
            }}
            options={DEGREE_OPTIONS}
            placeholder="Select degree / program"
            icon={<GraduationCap size={17} />}
            error={errors.degree}
            isDark={isDark}
            id="reg-degree"
            name="degree"
          />
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
          <CustomSelect
            value={formData.yearOfStudy}
            onChange={(val) => updateFormData({ yearOfStudy: val })}
            options={YEAR_OF_STUDY_OPTIONS}
            placeholder="Select current year"
            icon={<Calendar size={17} />}
            error={errors.yearOfStudy}
            isDark={isDark}
            id="reg-yearOfStudy"
            name="yearOfStudy"
          />
        </div>

        {/* Expected Graduation Year */}
        <div>
          <label className={labelClass}>
            Expected Graduation Year <span className={asteriskClass}>*</span>
          </label>
          <CustomSelect
            value={formData.graduationYear}
            onChange={(val) => updateFormData({ graduationYear: val })}
            options={graduationYears}
            placeholder="Select graduation year"
            icon={<Calendar size={17} />}
            error={errors.graduationYear}
            isDark={isDark}
            id="reg-graduationYear"
            name="graduationYear"
          />
        </div>
      </div>
    </div>
  );
}
