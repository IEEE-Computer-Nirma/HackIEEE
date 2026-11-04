"use client";

import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";
import { DEGREE_OPTIONS, YEAR_OF_STUDY_OPTIONS } from "@/app/data/universities";
import UniversityAutocomplete from "./UniversityAutocomplete";

interface Step2AcademicProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
}

export default function Step2Academic({
  formData,
  updateFormData,
  errors,
}: Step2AcademicProps) {
  // Dynamically generate graduation years: current year - 1 up to current year + 6
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => String(currentYear - 1 + i));

  const isCustomDegree = formData.degree === "Other";

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h3 className="text-xl font-semibold tracking-wide text-ink flex items-center gap-2">
          Academic Information
        </h3>
        <p className="text-sm text-sand/70 mt-1">
          Tell us about your educational background.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* University / Institution Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            University / Institution Name <span className="text-spice">*</span>
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
          />
        </div>

        {/* Degree / Program */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Degree / Program <span className="text-spice">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <GraduationCap size={18} />
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
              className={`w-full pl-11 pr-10 py-3 rounded-xl bg-[#140f0b]/80 border text-ink text-[0.95rem] transition-all outline-none cursor-pointer appearance-none ${
                errors.degree
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            >
              <option value="" disabled className="bg-[#1a140e] text-sand/40">
                Select degree / program
              </option>
              {DEGREE_OPTIONS.map((d) => (
                <option key={d} value={d} className="bg-[#1a140e] text-ink">
                  {d}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sand/50 text-xs">
              ▼
            </div>
          </div>
          {errors.degree && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.degree}</p>
          )}

          {isCustomDegree && (
            <div className="mt-3">
              <input
                type="text"
                value={formData.customDegree || ""}
                onChange={(e) => updateFormData({ customDegree: e.target.value })}
                placeholder="Specify your degree / program"
                className="w-full px-4 py-2.5 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] text-ink placeholder:text-sand/30 text-sm focus:border-spice focus:ring-1 focus:ring-spice/40 outline-none"
              />
            </div>
          )}
        </div>

        {/* Branch / Department */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Branch / Department <span className="text-spice">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <BookOpen size={18} />
            </div>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => updateFormData({ branch: e.target.value })}
              placeholder="e.g. Computer Science, IT, Electronics"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                errors.branch
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            />
          </div>
          {errors.branch && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.branch}</p>
          )}
        </div>

        {/* Current Year of Study */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Current Year of Study <span className="text-spice">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <Calendar size={18} />
            </div>
            <select
              value={formData.yearOfStudy}
              onChange={(e) => updateFormData({ yearOfStudy: e.target.value })}
              className={`w-full pl-11 pr-10 py-3 rounded-xl bg-[#140f0b]/80 border text-ink text-[0.95rem] transition-all outline-none cursor-pointer appearance-none ${
                errors.yearOfStudy
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            >
              <option value="" disabled className="bg-[#1a140e] text-sand/40">
                Select current year
              </option>
              {YEAR_OF_STUDY_OPTIONS.map((y) => (
                <option key={y} value={y} className="bg-[#1a140e] text-ink">
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sand/50 text-xs">
              ▼
            </div>
          </div>
          {errors.yearOfStudy && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.yearOfStudy}</p>
          )}
        </div>

        {/* Expected Graduation Year */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            Expected Graduation Year <span className="text-spice">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <Calendar size={18} />
            </div>
            <select
              value={formData.graduationYear}
              onChange={(e) => updateFormData({ graduationYear: e.target.value })}
              className={`w-full pl-11 pr-10 py-3 rounded-xl bg-[#140f0b]/80 border text-ink text-[0.95rem] transition-all outline-none cursor-pointer appearance-none ${
                errors.graduationYear
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            >
              <option value="" disabled className="bg-[#1a140e] text-sand/40">
                Select graduation year
              </option>
              {graduationYears.map((yr) => (
                <option key={yr} value={yr} className="bg-[#1a140e] text-ink">
                  {yr}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sand/50 text-xs">
              ▼
            </div>
          </div>
          {errors.graduationYear && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.graduationYear}</p>
          )}
        </div>
      </div>
    </div>
  );
}
