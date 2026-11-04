"use client";

import { Edit3, User, School, Shield, Sparkles } from "lucide-react";
import { RegistrationFormData } from "@/app/lib/registration-schema";

interface Step5ReviewProps {
  formData: RegistrationFormData;
  goToStep: (step: number) => void;
  isDark?: boolean;
}

export default function Step5Review({
  formData,
  goToStep,
  isDark = false,
}: Step5ReviewProps) {
  const cardClass = isDark
    ? "rounded-2xl border border-[rgba(248,207,150,0.18)] bg-[#18110b] p-5 transition-colors hover:border-[rgba(226,130,47,0.35)] shadow-md"
    : "rounded-2xl border border-[#e5dcce] bg-[#fbf7f0] p-5 transition-colors hover:border-[#c67634]/50 shadow-sm";

  const dividerClass = isDark ? "border-[rgba(248,207,150,0.15)]" : "border-[#ecd8c5]";
  const headingColor = isDark ? "text-[#ffa64d]" : "text-[#c67634]";
  const labelColor = isDark ? "text-[#f3e6cf]/50" : "text-[#7f7669]";
  const valueColor = isDark ? "text-[#f3e6cf]" : "text-[#2b2318]";

  const editBtnClass = isDark
    ? "inline-flex items-center gap-1.5 text-xs text-[#ffa64d] hover:text-[#f8cf96] font-medium px-2.5 py-1 rounded-md bg-[#e2822f]/10 hover:bg-[#e2822f]/20 border border-[#ffa64d]/30 transition-colors cursor-pointer"
    : "inline-flex items-center gap-1.5 text-xs text-[#c06820] hover:text-[#a85514] font-semibold px-2.5 py-1 rounded-md bg-[#c06820]/10 hover:bg-[#c06820]/20 border border-[#c06820]/30 transition-colors cursor-pointer";

  return (
    <div className="space-y-4">
      {/* 1. Personal Information Section */}
      <div className={cardClass}>
        <div className={`flex items-center justify-between pb-3 border-b ${dividerClass} mb-3`}>
          <div className={`flex items-center gap-2.5 ${headingColor}`}>
            <User size={16} />
            <h4 className="text-[11px] font-bold tracking-wider uppercase font-mono">
              Personal Information
            </h4>
          </div>
          <button type="button" onClick={() => goToStep(1)} className={editBtnClass}>
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm">
          <div>
            <p className={`text-xs ${labelColor}`}>Full Name</p>
            <p className={`font-semibold ${valueColor} truncate`}>{formData.fullName}</p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Phone Number</p>
            <p className={`font-semibold ${valueColor}`}>
              {formData.countryCode} {formData.phoneNumber}
            </p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Personal Email</p>
            <p className={`font-semibold ${valueColor} truncate`}>{formData.personalEmail}</p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>College Email</p>
            <p className={`font-semibold ${valueColor} truncate`}>
              {formData.collegeEmail || <span className={isDark ? "text-[#f3e6cf]/30 italic" : "text-[#9a9184] italic"}>Not provided</span>}
            </p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Location</p>
            <p className={`font-semibold ${valueColor}`}>
              {formData.city}, {formData.state}, {formData.country}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Academic Information Section */}
      <div className={cardClass}>
        <div className={`flex items-center justify-between pb-3 border-b ${dividerClass} mb-3`}>
          <div className={`flex items-center gap-2.5 ${headingColor}`}>
            <School size={16} />
            <h4 className="text-[11px] font-bold tracking-wider uppercase font-mono">
              Academic Information
            </h4>
          </div>
          <button type="button" onClick={() => goToStep(2)} className={editBtnClass}>
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm">
          <div className="sm:col-span-2 md:col-span-3">
            <p className={`text-xs ${labelColor}`}>University / Institution</p>
            <p className={`font-semibold ${valueColor}`}>{formData.university}</p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Degree / Program</p>
            <p className={`font-semibold ${valueColor}`}>
              {formData.degree === "Other" && formData.customDegree
                ? `${formData.customDegree} (Other)`
                : formData.degree}
            </p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Branch / Department</p>
            <p className={`font-semibold ${valueColor}`}>{formData.branch}</p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Current Year of Study</p>
            <p className={`font-semibold ${valueColor}`}>{formData.yearOfStudy}</p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Expected Graduation</p>
            <p className={`font-semibold ${valueColor}`}>{formData.graduationYear}</p>
          </div>
        </div>
      </div>

      {/* 3. IEEE Membership Section */}
      <div className={cardClass}>
        <div className={`flex items-center justify-between pb-3 border-b ${dividerClass} mb-3`}>
          <div className={`flex items-center gap-2.5 ${headingColor}`}>
            <Shield size={16} />
            <h4 className="text-[11px] font-bold tracking-wider uppercase font-mono">
              IEEE Membership
            </h4>
          </div>
          <button type="button" onClick={() => goToStep(3)} className={editBtnClass}>
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
          <div>
            <p className={`text-xs ${labelColor}`}>IEEE Member</p>
            <p className={`font-semibold ${valueColor}`}>
              {formData.isIeeeMember ? "Yes" : "No"}
            </p>
          </div>
          {formData.isIeeeMember && (
            <div>
              <p className={`text-xs ${labelColor}`}>Membership Number</p>
              <p className={`font-mono font-bold ${isDark ? "text-[#ffa64d]" : "text-[#c06820]"}`}>
                {formData.ieeeMembershipNumber}
              </p>
            </div>
          )}
          <div>
            <p className={`text-xs ${labelColor}`}>IEEE Computer Society Member</p>
            <p className={`font-semibold ${valueColor}`}>
              {formData.isIeeeCsMember ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Additional Information Section */}
      <div className={cardClass}>
        <div className={`flex items-center justify-between pb-3 border-b ${dividerClass} mb-3`}>
          <div className={`flex items-center gap-2.5 ${headingColor}`}>
            <Sparkles size={16} />
            <h4 className="text-[11px] font-bold tracking-wider uppercase font-mono">
              Additional Information
            </h4>
          </div>
          <button type="button" onClick={() => goToStep(4)} className={editBtnClass}>
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className={`text-xs ${labelColor}`}>LinkedIn</p>
            <p className={`font-semibold ${valueColor} truncate`}>
              {formData.linkedinUrl || <span className={isDark ? "text-[#f3e6cf]/30 italic" : "text-[#9a9184] italic"}>None</span>}
            </p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>GitHub</p>
            <p className={`font-semibold ${valueColor} truncate`}>
              {formData.githubUrl || <span className={isDark ? "text-[#f3e6cf]/30 italic" : "text-[#9a9184] italic"}>None</span>}
            </p>
          </div>
          <div>
            <p className={`text-xs ${labelColor}`}>Referral Source</p>
            <p className={`font-semibold ${valueColor}`}>
              {formData.hearAbout || <span className={isDark ? "text-[#f3e6cf]/30 italic" : "text-[#9a9184] italic"}>None</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
