"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowRight, ArrowLeft, Loader2, User } from "lucide-react";
import {
  RegistrationFormData,
  initialRegistrationFormData,
  step1PersonalSchema,
  step2AcademicSchema,
  step3MembershipSchema,
  step4AdditionalSchema,
  fullRegistrationSchema,
} from "@/app/lib/registration-schema";
import RegistrationProgress from "./RegistrationProgress";
import Step1Personal from "./Step1Personal";
import Step2Academic from "./Step2Academic";
import Step3Membership from "./Step3Membership";
import Step4Additional from "./Step4Additional";
import Step5Review from "./Step5Review";
import RegistrationSuccess from "./RegistrationSuccess";
import TeamManagement from "@/app/components/team/TeamManagement";
import ParticipantDashboard from "@/app/components/dashboard/ParticipantDashboard";
import { PortalTab } from "@/app/context/RegistrationContext";

interface RegistrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PortalTab;
}

export default function RegistrationWizard({
  isOpen,
  onClose,
  initialTab = "registration",
}: RegistrationWizardProps) {
  const [portalTab, setPortalTab] = useState<PortalTab>(initialTab);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>(
    initialRegistrationFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [registeredSuccessData, setRegisteredSuccessData] = useState<{
    registrationId: string;
    participantName: string;
    email: string;
  } | null>(null);

  // Sync initial tab when changed externally
  useEffect(() => {
    if (initialTab) {
      setPortalTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAttemptClose = () => {
    // If on registration tab and form has dirty fields, warn before closing
    const isTouched =
      portalTab === "registration" &&
      (Boolean(formData.fullName) ||
        Boolean(formData.personalEmail) ||
        Boolean(formData.phoneNumber) ||
        Boolean(formData.university));

    if (!registeredSuccessData && isTouched) {
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !registeredSuccessData) {
        handleAttemptClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, registeredSuccessData, formData, portalTab]);

  const updateFormData = (fields: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear relevant errors
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(fields)) {
        delete next[k];
      }
      return next;
    });
  };

  const validateCurrentStep = (step: number): boolean => {
    let result;
    setErrors({});
    setSubmissionError(null);

    if (step === 1) {
      result = step1PersonalSchema.safeParse(formData);
    } else if (step === 2) {
      result = step2AcademicSchema.safeParse(formData);
    } else if (step === 3) {
      result = step3MembershipSchema.safeParse(formData);
    } else if (step === 4) {
      result = step4AdditionalSchema.safeParse(formData);
    } else {
      return true;
    }

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxAccessibleStep((prev) => Math.max(prev, nextStep));
      // Scroll wizard container to top
      const modalScroll = document.getElementById("wizard-scroll-container");
      if (modalScroll) modalScroll.scrollTop = 0;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      const modalScroll = document.getElementById("wizard-scroll-container");
      if (modalScroll) modalScroll.scrollTop = 0;
    }
  };

  const handleGoToStep = (targetStep: number) => {
    if (targetStep <= maxAccessibleStep) {
      setCurrentStep(targetStep);
      const modalScroll = document.getElementById("wizard-scroll-container");
      if (modalScroll) modalScroll.scrollTop = 0;
    }
  };

  const getStepForField = (field: string): number => {
    const step1Fields = ["fullName", "city", "state", "country", "countryCode", "phoneNumber", "personalEmail", "collegeEmail"];
    const step2Fields = ["university", "universityId", "isCustomUniversity", "degree", "customDegree", "branch", "yearOfStudy", "graduationYear"];
    const step3Fields = ["isIeeeMember", "ieeeMembershipNumber", "isIeeeCsMember"];
    const step4Fields = ["linkedinUrl", "githubUrl", "hearAbout"];

    if (step1Fields.includes(field)) return 1;
    if (step2Fields.includes(field)) return 2;
    if (step3Fields.includes(field)) return 3;
    if (step4Fields.includes(field)) return 4;
    return 1;
  };

  /**
   * Safely normalizes user-entered social URLs for allowlisted domains (e.g. linkedin.com, github.com).
   * Uses URL constructor parsing and exact hostname matching instead of fragile substring checks.
   */
  const normalizeAllowedUrl = (input: string | undefined, allowedHosts: string[]): string => {
    const trimmed = input?.trim() || "";
    if (!trimmed) return "";

    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const testUrl = hasProtocol ? trimmed : `https://${trimmed}`;

    try {
      const parsed = new URL(testUrl);
      const hostname = parsed.hostname.toLowerCase();

      // Check against allowed hostnames or their www. variants
      const isAllowed = allowedHosts.some(
        (host) => hostname === host || hostname === `www.${host}`
      );

      if (isAllowed && !hasProtocol) {
        return `https://${trimmed}`;
      }
    } catch {
      // If not a parseable URL, return trimmed original so downstream schema validator reports error
    }

    return trimmed;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    // Normalize URLs with exact hostname allowlisting
    const normalizedLinkedin = normalizeAllowedUrl(formData.linkedinUrl, ["linkedin.com"]);
    const normalizedGithub = normalizeAllowedUrl(formData.githubUrl, ["github.com"]);

    const payload: RegistrationFormData = {
      ...formData,
      linkedinUrl: normalizedLinkedin,
      githubUrl: normalizedGithub,
    };

    // Client-side full validation
    const clientValidation = fullRegistrationSchema.safeParse(payload);
    if (!clientValidation.success) {
      const flatErrors: Record<string, string> = {};
      let firstErrorStep = 5;

      for (const issue of clientValidation.error.issues) {
        const fieldKey = issue.path[0] as string;
        if (!flatErrors[fieldKey]) {
          flatErrors[fieldKey] = issue.message;
        }
        const step = getStepForField(fieldKey);
        if (step < firstErrorStep) {
          firstErrorStep = step;
        }
      }

      setErrors(flatErrors);
      setSubmissionError(
        "Some required information is missing or needs correction. Redirected to the step that needs your attention."
      );
      if (firstErrorStep < 5) {
        setCurrentStep(firstErrorStep);
      }
      setIsSubmitting(false);
      const modalScroll = document.getElementById("wizard-scroll-container");
      if (modalScroll) modalScroll.scrollTop = 0;
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        let firstErrorStep = 5;
        if (data.fieldErrors) {
          const flatErrors: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.fieldErrors)) {
            flatErrors[k] = Array.isArray(v) ? v[0] : String(v);
            const step = getStepForField(k);
            if (step < firstErrorStep) {
              firstErrorStep = step;
            }
          }
          setErrors(flatErrors);
        }
        setSubmissionError(
          data.error || "Failed to submit registration. Please check the fields and try again."
        );
        if (firstErrorStep < 5) {
          setCurrentStep(firstErrorStep);
        }
        const modalScroll = document.getElementById("wizard-scroll-container");
        if (modalScroll) modalScroll.scrollTop = 0;
        return;
      }

      // Success!
      setRegisteredSuccessData({
        registrationId: data.registrationId,
        participantName: data.participantName || payload.fullName,
        email: data.email || payload.personalEmail,
      });
      const modalScroll = document.getElementById("wizard-scroll-container");
      if (modalScroll) modalScroll.scrollTop = 0;
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmissionError("Network error. Could not reach server. Please try again.");
      const modalScroll = document.getElementById("wizard-scroll-container");
      if (modalScroll) modalScroll.scrollTop = 0;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-xl p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Container Card */}
      <div
        id="wizard-card"
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-spice/40 bg-[#0e0a07] shadow-[0_0_60px_rgba(226,130,47,0.18)] overflow-hidden"
      >
        {/* Top Header matching reference images */}
        <div className="shrink-0 border-b border-line px-5 py-4 flex items-center justify-between bg-[#140e0a]/90 backdrop-blur-md">
          {/* IEEE CS Nirma Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/organisers/ieee-cs-nirma-dark.svg"
              alt="IEEE Computer Society, Nirma University"
              width={160}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>

          {/* Navigation Pill tabs in header - Fully Interactive! */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs tracking-widest uppercase">
            <button
              type="button"
              onClick={() => setPortalTab("registration")}
              className={`pb-1 transition-all cursor-pointer ${
                portalTab === "registration"
                  ? "text-spice-hot font-bold border-b-2 border-spice"
                  : "text-sand/50 hover:text-ink"
              }`}
            >
              REGISTRATION
            </button>
            <button
              type="button"
              onClick={() => setPortalTab("team")}
              className={`pb-1 transition-all cursor-pointer ${
                portalTab === "team"
                  ? "text-spice-hot font-bold border-b-2 border-spice"
                  : "text-sand/50 hover:text-ink"
              }`}
            >
              TEAM MANAGEMENT
            </button>
            <button
              type="button"
              onClick={() => setPortalTab("dashboard")}
              className={`pb-1 transition-all cursor-pointer ${
                portalTab === "dashboard"
                  ? "text-spice-hot font-bold border-b-2 border-spice"
                  : "text-sand/50 hover:text-ink"
              }`}
            >
              DASHBOARD
            </button>
          </div>

          {/* Right actions: Avatar & Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPortalTab("dashboard")}
              title="View Dashboard"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                portalTab === "dashboard"
                  ? "border-spice bg-spice/20 text-spice-hot"
                  : "border-line bg-surface text-sand/70 hover:text-ink"
              }`}
            >
              <User size={16} />
            </button>
            <button
              type="button"
              onClick={handleAttemptClose}
              className="w-8 h-8 rounded-full border border-line hover:border-spice/50 bg-surface hover:bg-spice/15 flex items-center justify-center text-sand/70 hover:text-ink transition-colors ml-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div
          id="wizard-scroll-container"
          className="flex-1 overflow-y-auto px-5 sm:px-8 py-6"
        >
          {/* ────────────────────────────────────────────────────────
              1. REGISTRATION TAB
          ──────────────────────────────────────────────────────── */}
          <div className={portalTab === "registration" ? "block" : "hidden"}>
            {!registeredSuccessData && (
              <>
                {/* Mission Header */}
                <div className="text-center mb-7">
                  <p className="text-[0.68rem] font-mono tracking-[0.3em] uppercase text-spice font-semibold mb-2">
                    ─── JOIN THE MISSION ───
                  </p>
                  <h2 className="display text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.18em] text-ink uppercase mb-2">
                    Individual Registration
                  </h2>
                  <p className="text-sm text-sand/70 max-w-lg mx-auto">
                    Register as a participant to join or create a team for HackIEEE &apos;26-27.
                  </p>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-spice to-transparent mx-auto mt-4" />
                </div>

                {/* Progress Indicator */}
                <RegistrationProgress
                  currentStep={currentStep}
                  totalSteps={5}
                  onStepClick={handleGoToStep}
                  maxAccessibleStep={maxAccessibleStep}
                />
              </>
            )}

            {/* Error Banner */}
            {submissionError && (
              <div className="mb-6 p-4 rounded-xl border border-ember/50 bg-ember/10 text-sand text-sm flex items-start gap-3">
                <span className="text-ember font-bold text-base">⚠️</span>
                <div>
                  <p className="font-semibold text-ink">Submission Error</p>
                  <p className="text-sand/90 text-xs mt-0.5">{submissionError}</p>
                </div>
              </div>
            )}

            {/* Dynamic Step View */}
            {registeredSuccessData ? (
              <RegistrationSuccess
                registrationId={registeredSuccessData.registrationId}
                participantName={registeredSuccessData.participantName}
                email={registeredSuccessData.email}
                onClose={onClose}
              />
            ) : (
              <div className="min-h-[380px]">
                {currentStep === 1 && (
                  <Step1Personal
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    isDark={true}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Academic
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    isDark={true}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Membership
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    isDark={true}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Additional
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    isDark={true}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Review
                    formData={formData}
                    goToStep={handleGoToStep}
                    isDark={true}
                  />
                )}
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────
              2. TEAM MANAGEMENT TAB
          ──────────────────────────────────────────────────────── */}
          <div className={portalTab === "team" ? "block" : "hidden"}>
            <TeamManagement />
          </div>

          {/* ────────────────────────────────────────────────────────
              3. DASHBOARD TAB
          ──────────────────────────────────────────────────────── */}
          <div className={portalTab === "dashboard" ? "block" : "hidden"}>
            <ParticipantDashboard />
          </div>
        </div>

        {/* Footer Navigation Bar (Shown ONLY on Registration tab when not completed) */}
        {portalTab === "registration" && !registeredSuccessData && (
          <div className="shrink-0 border-t border-line px-5 sm:px-8 py-4 bg-[#140e0a]/90 backdrop-blur-md flex items-center justify-between">
            <span className="text-xs text-sand/50 font-mono">
              * Required field
            </span>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-line-strong hover:border-spice/40 bg-surface hover:bg-surface-solid text-sand hover:text-ink text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice via-spice-hot to-amber-400 hover:brightness-110 text-[#1d130a] text-sm font-semibold tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(226,130,47,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={16} strokeWidth={2.2} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-spice via-spice-hot to-amber-400 hover:brightness-110 disabled:opacity-60 text-[#1d130a] text-sm font-semibold tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(226,130,47,0.5)] flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
