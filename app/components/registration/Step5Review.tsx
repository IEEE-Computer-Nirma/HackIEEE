"use client";

import { Edit3, User, School, Shield, Sparkles } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";

interface Step5ReviewProps {
  formData: RegistrationFormData;
  goToStep: (step: number) => void;
}

export default function Step5Review({ formData, goToStep }: Step5ReviewProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h3 className="text-xl font-semibold tracking-wide text-ink flex items-center gap-2">
          Review Your Information
        </h3>
        <p className="text-sm text-sand/70 mt-1">
          Almost there! Please verify your information before final submission. Click &quot;Edit&quot; on any section to make changes.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Personal Information Section */}
        <div className="rounded-xl border border-line-strong bg-[#16100b]/80 p-5 transition-colors hover:border-spice/40">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2.5 text-spice-hot">
              <User size={18} />
              <h4 className="text-sm font-semibold tracking-wide uppercase font-mono">
                Personal Information
              </h4>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-spice hover:text-spice-hot font-medium px-2.5 py-1 rounded-md hover:bg-spice/10 transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm">
            <div>
              <p className="text-xs text-sand/50">Full Name</p>
              <p className="font-medium text-ink truncate">{formData.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Phone Number</p>
              <p className="font-medium text-ink">
                {formData.countryCode} {formData.phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Personal Email</p>
              <p className="font-medium text-ink truncate">{formData.personalEmail}</p>
            </div>
            <div>
              <p className="text-xs text-sand/50">College Email</p>
              <p className="font-medium text-ink truncate">
                {formData.collegeEmail || <span className="text-sand/30 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Location</p>
              <p className="font-medium text-ink">
                {formData.city}, {formData.state}, {formData.country}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Academic Information Section */}
        <div className="rounded-xl border border-line-strong bg-[#16100b]/80 p-5 transition-colors hover:border-spice/40">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2.5 text-spice-hot">
              <School size={18} />
              <h4 className="text-sm font-semibold tracking-wide uppercase font-mono">
                Academic Information
              </h4>
            </div>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="inline-flex items-center gap-1.5 text-xs text-spice hover:text-spice-hot font-medium px-2.5 py-1 rounded-md hover:bg-spice/10 transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm">
            <div className="sm:col-span-2 md:col-span-3">
              <p className="text-xs text-sand/50">University / Institution</p>
              <p className="font-medium text-ink">{formData.university}</p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Degree / Program</p>
              <p className="font-medium text-ink">
                {formData.degree === "Other" && formData.customDegree
                  ? `${formData.customDegree} (Other)`
                  : formData.degree}
              </p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Branch / Department</p>
              <p className="font-medium text-ink">{formData.branch}</p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Current Year of Study</p>
              <p className="font-medium text-ink">{formData.yearOfStudy}</p>
            </div>
            <div>
              <p className="text-xs text-sand/50">Expected Graduation</p>
              <p className="font-medium text-ink">{formData.graduationYear}</p>
            </div>
          </div>
        </div>

        {/* 3. IEEE Membership Section */}
        <div className="rounded-xl border border-line-strong bg-[#16100b]/80 p-5 transition-colors hover:border-spice/40">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2.5 text-spice-hot">
              <Shield size={18} />
              <h4 className="text-sm font-semibold tracking-wide uppercase font-mono">
                IEEE Membership
              </h4>
            </div>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="inline-flex items-center gap-1.5 text-xs text-spice hover:text-spice-hot font-medium px-2.5 py-1 rounded-md hover:bg-spice/10 transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
            <div>
              <p className="text-xs text-sand/50">IEEE Member</p>
              <p className="font-medium text-ink">
                {formData.isIeeeMember ? (
                  <span className="text-spice font-semibold">Yes</span>
                ) : (
                  "No"
                )}
              </p>
            </div>
            {formData.isIeeeMember && (
              <div>
                <p className="text-xs text-sand/50">Membership Number</p>
                <p className="font-mono text-ink font-semibold">
                  {formData.ieeeMembershipNumber}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-sand/50">IEEE Computer Society Member</p>
              <p className="font-medium text-ink">
                {formData.isIeeeCsMember ? (
                  <span className="text-spice font-semibold">Yes</span>
                ) : (
                  "No"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Additional Information Section */}
        <div className="rounded-xl border border-line-strong bg-[#16100b]/80 p-5 transition-colors hover:border-spice/40">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2.5 text-spice-hot">
              <Sparkles size={18} />
              <h4 className="text-sm font-semibold tracking-wide uppercase font-mono">
                Additional Information
              </h4>
            </div>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="inline-flex items-center gap-1.5 text-xs text-spice hover:text-spice-hot font-medium px-2.5 py-1 rounded-md hover:bg-spice/10 transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-sand/50">LinkedIn</p>
                <p className="font-medium text-ink truncate">
                  {formData.linkedinUrl || <span className="text-sand/30 italic">None</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-sand/50">GitHub</p>
                <p className="font-medium text-ink truncate">
                  {formData.githubUrl || <span className="text-sand/30 italic">None</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-sand/50">Referral Source</p>
                <p className="font-medium text-ink">
                  {formData.hearAbout || <span className="text-sand/30 italic">None</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
