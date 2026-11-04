"use client";

import { RegistrationFormData } from "@/app/lib/registration-schema";
import { HEAR_ABOUT_US_OPTIONS } from "@/app/data/universities";

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V9.94H5.06v8.56h2.8z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

interface Step4AdditionalProps {
  formData: RegistrationFormData;
  updateFormData: (fields: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
}

export default function Step4Additional({
  formData,
  updateFormData,
  errors,
}: Step4AdditionalProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h3 className="text-xl font-semibold tracking-wide text-ink flex items-center gap-2">
          Additional Information
        </h3>
        <p className="text-sm text-sand/70 mt-1">
          Tell us a little more about your online profiles and how you found us. All fields are optional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LinkedIn Profile */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            LinkedIn Profile <span className="text-sand/40 normal-case tracking-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <LinkedinIcon />
            </div>
            <input
              type="url"
              value={formData.linkedinUrl || ""}
              onChange={(e) => updateFormData({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                errors.linkedinUrl
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            />
          </div>
          {errors.linkedinUrl && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.linkedinUrl}</p>
          )}
        </div>

        {/* GitHub Profile */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            GitHub Profile <span className="text-sand/40 normal-case tracking-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
              <GithubIcon />
            </div>
            <input
              type="url"
              value={formData.githubUrl || ""}
              onChange={(e) => updateFormData({ githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all outline-none ${
                errors.githubUrl
                  ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
                  : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
              }`}
            />
          </div>
          {errors.githubUrl && (
            <p className="mt-1.5 text-xs text-ember font-medium">{errors.githubUrl}</p>
          )}
        </div>

        {/* How did you hear about this event? */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
            How did you hear about this event? <span className="text-sand/40 normal-case tracking-normal">(Optional)</span>
          </label>
          <div className="relative">
            <select
              value={formData.hearAbout || ""}
              onChange={(e) => updateFormData({ hearAbout: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] text-ink text-[0.95rem] focus:border-spice focus:ring-1 focus:ring-spice/40 outline-none cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#1a140e] text-sand/40">
                Select an option
              </option>
              {HEAR_ABOUT_US_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#1a140e] text-ink">
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sand/50 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
