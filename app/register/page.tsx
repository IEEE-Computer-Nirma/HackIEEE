"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/app/lib/supabase/client";
import {
  RegistrationFormData,
  initialRegistrationFormData,
  step1PersonalSchema,
  step2AcademicSchema,
  step3MembershipSchema,
  step4AdditionalSchema,
} from "@/app/lib/registration-schema";
import Step1Personal from "@/app/components/registration/Step1Personal";
import Step2Academic from "@/app/components/registration/Step2Academic";
import Step3Membership from "@/app/components/registration/Step3Membership";
import Step4Additional from "@/app/components/registration/Step4Additional";
import Step5Review from "@/app/components/registration/Step5Review";
import RegistrationSuccess from "@/app/components/registration/RegistrationSuccess";
import GradientASCII from "@/app/components/GradientASCII";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

// 5 Sequential Steps on Left Card
const STEPS = [
  { id: 1, title: "Register your identity" },
  { id: 2, title: "Configure your academic profile" },
  { id: 3, title: "IEEE membership status" },
  { id: 4, title: "Finalize your profile" },
  { id: 5, title: "Review & confirm" },
];

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg className={`w-4 h-4 fill-current shrink-0 ${isDark ? "text-[#f3e6cf]" : "text-[#2b2318]"}`} viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function RegisterContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>(initialRegistrationFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Multi-Theme Support: Dark, Light, & System Default ──
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hackieee-theme-mode") as ThemeMode | null;
      if (saved && ["light", "dark", "system"].includes(saved)) {
        setThemeMode(saved);
      }
    } catch {}

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Compute resolved theme: light or dark
  const resolvedTheme: "light" | "dark" =
    themeMode === "system" ? (systemPrefersDark ? "dark" : "light") : themeMode;

  const isDark = resolvedTheme === "dark";

  // Sync dataset.theme with root document
  useEffect(() => {
    if (resolvedTheme === "light") {
      document.documentElement.dataset.theme = "day";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#efe3c8");
    } else {
      delete document.documentElement.dataset.theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0b0906");
    }
  }, [resolvedTheme]);

  const handleSetTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem("hackieee-theme-mode", mode);
      localStorage.setItem("hackieee-theme", mode === "light" ? "day" : mode === "dark" ? "night" : (systemPrefersDark ? "night" : "day"));
    } catch {}
  };

  const [registeredSuccessData, setRegisteredSuccessData] = useState<{
    registrationId: string;
    participantName: string;
    email: string;
  } | null>(null);

  const [isDemoSuccess, setIsDemoSuccess] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("demo") === "success") {
        setIsDemoSuccess(true);
      }
    }
  }, []);

  const activeSuccessData = registeredSuccessData || (isDemoSuccess ? {
    registrationId: "HACK-2026-K6EPN",
    participantName: "Priyansh Patel",
    email: "priyanshpatel9506@gmail.com",
  } : null);

  const activeAuraBackground = isDark
    ? "radial-gradient(130% 90% at 50% -15%, rgba(30, 63, 216, 0.45) 0%, rgba(56, 189, 248, 0.18) 45%, rgba(11, 9, 6, 0.95) 85%)"
    : "radial-gradient(130% 90% at 50% -15%, rgba(30, 63, 216, 0.35) 0%, rgba(56, 189, 248, 0.15) 45%, transparent 85%)";

  const updateFormData = (fields: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(fields)) {
        delete next[k];
      }
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    let result;
    setErrors({});
    setSubmitError(null);

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

  const handleGoForward = () => {
    if (validateStep(currentStep)) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxAccessibleStep((prev) => Math.max(prev, next));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoBackward = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoToStep = (stepId: number) => {
    if (stepId <= maxAccessibleStep || stepId < currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      setSocialLoading(provider);
      setSubmitError(null);
      const supabase = getSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=/register`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setSubmitError(err.message || `Failed to sign in with ${provider}`);
      setSocialLoading(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit registration");
      }

      setRegisteredSuccessData({
        registrationId: result.registrationId,
        participantName: result.participantName || formData.fullName,
        email: result.email || formData.personalEmail,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`min-h-screen w-full flex flex-col justify-start relative overflow-x-hidden transition-colors duration-700 ${
        isDark ? "bg-[#0b0906] text-[#f3e6cf]" : "bg-[#f0eae0] text-[#2b2318]"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-8 relative z-10">
      {/* ── Dynamic Ambient Sky Aura ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000 opacity-60 blur-[130px]"
        style={{
          background: activeAuraBackground,
        }}
      />

      {/* ── Background: ReactBits GradientASCII (Original Celestial Horizon Sky with White Flickering Dots) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-95">
        <GradientASCII
          key={`sky-step-${currentStep}`}
          colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
          shape="horizon"
          characters=" .·•●"
          cellSize={18}
          density={0.8}
          glyphOpacity={0.85}
          glow={0.2}
          depthOfField={0}
          flicker={0.2}
          softness={0.5}
          scale={1}
          flow={0.5}
          speed={1}
          gradientOpacity={0.9}
          grain={0.08}
          variation={0}
          mouseInteraction
          scrambleRadius={0.1}
          clickEffect="wave"
          intro
          lightMode={false}
        />
      </div>

      {/* ── Floating Island Header Navigation Bar ── */}
      <header className="mb-5 sm:mb-6 lg:mb-8 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Island: Home */}
        <Link
          href="/"
          className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border backdrop-blur-xl text-xs sm:text-sm font-semibold group transition-all shrink-0 ${
            isDark
              ? "bg-[#18110b]/85 border-[rgba(248,207,150,0.22)] text-[#f3e6cf] hover:text-white hover:border-[#ffa64d]/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              : "bg-[#fefcf8]/90 border-[#eddccb] text-[#2b2318] hover:text-[#c06820] hover:border-[#c06820]/50 hover:bg-[#faefe3] shadow-[0_6px_20px_rgba(40,25,10,0.06)]"
          }`}
        >
          <ArrowLeft
            size={14}
            className={`${isDark ? "text-[#ffa64d]" : "text-[#c06820]"} transition-transform group-hover:-translate-x-0.5`}
          />
          <span>Home</span>
        </Link>

        {/* Right Islands: Theme Mode Switcher + Login */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Segmented Island Theme Switcher: Light | System | Dark */}
          <div
            className={`flex items-center p-1 rounded-full border backdrop-blur-xl transition-all ${
              isDark
                ? "bg-[#18110b]/85 border-[rgba(248,207,150,0.22)] shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                : "bg-[#fefcf8]/90 border-[#eddccb] shadow-[0_6px_20px_rgba(40,25,10,0.06)]"
            }`}
          >
            <button
              type="button"
              onClick={() => handleSetTheme("light")}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                themeMode === "light"
                  ? "bg-[#c06820] text-white font-bold shadow-sm"
                  : isDark
                    ? "text-[#f3e6cf]/60 hover:text-white"
                    : "text-[#6e6456] hover:text-[#2b2318]"
              }`}
              title="Light theme"
              aria-label="Light theme"
            >
              <Sun size={13} />
              <span className="hidden sm:inline">Light</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetTheme("system")}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                themeMode === "system"
                  ? "bg-[#c06820] text-white font-bold shadow-sm"
                  : isDark
                    ? "text-[#f3e6cf]/60 hover:text-white"
                    : "text-[#6e6456] hover:text-[#2b2318]"
              }`}
              title="System theme"
              aria-label="System theme"
            >
              <Laptop size={13} />
              <span className="hidden sm:inline">Auto</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetTheme("dark")}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                themeMode === "dark"
                  ? "bg-[#c06820] text-white font-bold shadow-sm"
                  : isDark
                    ? "text-[#f3e6cf]/60 hover:text-white"
                    : "text-[#6e6456] hover:text-[#2b2318]"
              }`}
              title="Dark theme"
              aria-label="Dark theme"
            >
              <Moon size={13} />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Simple Login Button */}
          <Link
            href="/login"
            className={`inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border backdrop-blur-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              isDark
                ? "bg-[#18110b]/85 border-[rgba(248,207,150,0.22)] text-[#f3e6cf] hover:text-white hover:border-[#ffa64d]/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                : "bg-[#fefcf8]/90 border-[#eddccb] text-[#2b2318] hover:text-[#c06820] hover:border-[#c06820]/50 hover:bg-[#faefe3] shadow-[0_6px_20px_rgba(40,25,10,0.06)]"
            }`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* ── Mobile / Tablet Navigation Island ("go backward" and "go forward" arrows) ── */}
      <div
        className={`flex lg:hidden items-center justify-between gap-2.5 mb-5 p-3 rounded-2xl border backdrop-blur-xl shadow-lg ${
          isDark
            ? "bg-[#18110b]/90 border-[rgba(248,207,150,0.22)] text-[#f3e6cf]"
            : "bg-[#fefcf8]/95 border-[#eddccb] text-[#2b2318]"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#c06820] shadow-[0_0_8px_rgba(192,104,32,0.5)]"
          />
          <span className={`text-[11px] sm:text-xs font-mono uppercase tracking-wider truncate font-semibold ${isDark ? "text-[#f8cf96]" : "text-[#7a481e]"}`}>
            Step {currentStep} of 5 • {STEPS[currentStep - 1].title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleGoBackward}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors ${
                isDark
                  ? "border-[rgba(248,207,150,0.2)] bg-[#241910] text-[#f3e6cf] hover:bg-[#2d2015]"
                  : "border-[#e5dcce] bg-[#f5f0e8] text-[#5c5245] hover:bg-[#ede5da]"
              }`}
              title="Go backward"
              aria-label="Go backward"
            >
              <ChevronUp size={13} className={isDark ? "text-[#ffa64d]" : "text-[#c06820]"} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          {currentStep < 5 && (
            <button
              type="button"
              onClick={handleGoForward}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-colors ${
                isDark
                  ? "border-[#ffa64d]/40 bg-[#e2822f]/20 text-[#f3e6cf] hover:bg-[#e2822f]/30"
                  : "border-[#edd5c0] bg-[#faefe3] text-[#c06820] hover:bg-[#f6e6d5]"
              }`}
              title="Next step"
              aria-label="Next step"
            >
              <span>Next</span>
              <ChevronDown size={13} className={isDark ? "text-[#ffa64d]" : "text-[#c06820]"} />
            </button>
          )}
        </div>
      </div>

      {/* ── Main Two-Column Grid: Both Card Tops Flush on the Exact Same Level (items-start) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
        {/* ── LEFT COLUMN: Adaptive Card (White/Beige in Light, Charcoal/Pitch Black in Dark) ── */}
        <aside
          className={`hidden lg:flex lg:col-span-5 relative rounded-[32px] overflow-hidden p-8 xl:p-10 flex-col justify-between min-h-[640px] border backdrop-blur-xl transition-all duration-700 ${
            isDark
              ? "bg-[#140f0b]/95 border-[rgba(248,207,150,0.18)] shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
              : "bg-[#fefcf8]/95 border-[#eddccb] shadow-[0_20px_50px_rgba(40,25,10,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Subtle Top Inner Glow matching horizon sky */}
          <div
            className="absolute top-0 left-0 right-0 h-72 pointer-events-none transition-all duration-700 z-0 opacity-40"
            style={{
              background: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(56, 189, 248, 0.25) 0%, rgba(248, 207, 150, 0.08) 50%, transparent 75%)",
            }}
          />

          {/* Top Brand & Title Block with Large Dune Rise Typography */}
          <div className="relative z-10 space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                isDark
                  ? "bg-[#e2822f]/15 border-[#e2822f]/30"
                  : "bg-[#faefe3] border-[#edd5c0]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-500 animate-pulse ${
                  isDark ? "bg-[#ffa64d]" : "bg-[#c06820]"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(56, 189, 248, 0.4)",
                }}
              />
              <span
                className={`font-[family-name:var(--font-dune)] lowercase tracking-[0.12em] text-xs font-bold ${
                  isDark ? "text-[#ffa64d]" : "text-[#c06820]"
                }`}
              >
                hackieee 2026-27
              </span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl xl:text-[2.65rem] font-[family-name:var(--font-dune)] tracking-[0.05em] lowercase leading-tight ${
                isDark ? "text-white" : "text-[#231b12]"
              }`}
            >
              join hackieee
            </h1>

            <p
              className={`text-sm sm:text-base leading-relaxed max-w-sm ${
                isDark ? "text-[#f3e6cf]/75" : "text-[#6e6456]"
              }`}
            >
              Follow these 5 quick phases to activate your participant space for the 48-hour offline hackathon.
            </p>
          </div>

          {/* Vertical 5-Step Navigation Pills in Theme-Adaptive Palette */}
          <div className="relative z-10 space-y-3.5 my-auto py-6">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              if (isActive) {
                return (
                  <div
                    key={step.id}
                    className="w-full font-bold rounded-full py-4 px-5 flex items-center gap-4 transition-all select-none shadow-[0_8px_24px_rgba(192,104,32,0.35)] bg-[#c06820] text-white"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm bg-white text-[#c06820]"
                    >
                      {step.id}
                    </span>
                    <span className="text-sm sm:text-base font-bold tracking-tight truncate text-white">
                      {step.title}
                    </span>
                  </div>
                );
              }

              if (isCompleted) {
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleGoToStep(step.id)}
                    className={`w-full rounded-full py-3.5 px-5 flex items-center gap-4 text-left transition-all cursor-pointer border ${
                      isDark
                        ? "bg-[#f8cf96]/[0.08] border-[rgba(248,207,150,0.22)] hover:bg-[#f8cf96]/[0.14] text-[#f3e6cf]"
                        : "bg-[#faefe3] border-[#edd5c0] hover:bg-[#f6e6d5] hover:border-[#c06820]/40 text-[#5c3e21]"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDark ? "bg-[#e2822f]/20 text-[#ffa64d] border border-[#ffa64d]/30" : "bg-[#c06820] text-white"
                      }`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-semibold truncate">
                      {step.title}
                    </span>
                  </button>
                );
              }

              return (
                <div
                  key={step.id}
                  className={`w-full rounded-full py-3.5 px-5 flex items-center gap-4 text-left transition-all border ${
                    isDark
                      ? "bg-transparent border-[rgba(248,207,150,0.1)] text-[#f3e6cf]/40"
                      : "bg-[#f8f5ee]/70 border-[#e8ded1] text-[#9c9386]"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                      isDark ? "bg-white/[0.04] text-[#f3e6cf]/35" : "bg-[#ede5da] text-[#9c9386]"
                    }`}
                  >
                    {step.id}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Card Footer */}
          <div
            className={`relative z-10 pt-4 flex items-center justify-between text-xs font-mono border-t ${
              isDark
                ? "text-[#f8cf96]/60 border-[rgba(248,207,150,0.15)]"
                : "text-[#8a8073] border-[#ede3d5]"
            }`}
          >
            <span>48-Hour Sprint</span>
            <span>•</span>
            <span>Nirma University</span>
            <span>•</span>
            <span>Free Entry</span>
          </div>
        </aside>

        {/* ── RIGHT COLUMN: Adaptive Form Panel (Starts at Exact Same Top Level) ── */}
        <section className="lg:col-span-7 flex flex-col justify-start relative z-20">
          <div
            className={`rounded-[32px] border backdrop-blur-xl p-7 sm:p-10 transition-all duration-700 ${
              isDark
                ? "bg-[#140f0b]/95 border-[rgba(248,207,150,0.18)] shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
                : "bg-[#fefcf8]/95 border-[#eddccb] shadow-[0_20px_50px_rgba(40,25,10,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
            }`}
          >
            {activeSuccessData ? (
              <RegistrationSuccess
                registrationId={activeSuccessData.registrationId}
                participantName={activeSuccessData.participantName}
                email={activeSuccessData.email}
                onClose={() => (window.location.href = "/")}
                isDark={isDark}
              />
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentStep < 5) handleGoForward();
                  else handleSubmit();
                }}
                className="w-full space-y-6 relative z-20 pointer-events-auto"
              >
                {/* Header Title with Large Dune Rise Typography */}
                <div
                  className={`space-y-2 pb-2 border-b ${
                    isDark ? "border-[rgba(248,207,150,0.15)]" : "border-[#ede3d5]"
                  }`}
                >
                  <h2
                    className={`text-2xl sm:text-3xl xl:text-4xl font-[family-name:var(--font-dune)] tracking-[0.06em] lowercase ${
                      isDark ? "text-white" : "text-[#231b12]"
                    }`}
                  >
                    {currentStep === 1 && "create new profile"}
                    {currentStep === 2 && "academic details"}
                    {currentStep === 3 && "ieee membership"}
                    {currentStep === 4 && "finalize profile"}
                    {currentStep === 5 && "review & confirm"}
                  </h2>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? "text-[#f3e6cf]/75" : "text-[#7a6f62]"
                    }`}
                  >
                    {currentStep === 1 && "Input your basic details to begin the journey."}
                    {currentStep === 2 && "Tell us about your university, branch, and graduation timeline."}
                    {currentStep === 3 && "Tell us about your IEEE and IEEE Computer Society affiliation."}
                    {currentStep === 4 && "Connect your online presence and project repositories."}
                    {currentStep === 5 && "Verify your registration details before confirming."}
                  </p>
                </div>

                {/* Step 1 Social Auth Buttons */}
                {currentStep === 1 && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => handleSocialAuth("google")}
                        disabled={Boolean(socialLoading)}
                        className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm ${
                          isDark
                            ? "border-[rgba(248,207,150,0.2)] bg-[#1a130d] hover:bg-[#241910] hover:border-[#ffa64d]/50 text-[#f3e6cf]"
                            : "border-[#e5dcce] bg-[#f5f0e8] hover:bg-[#ede5da] hover:border-[#c06820]/50 text-[#2b2318]"
                        }`}
                      >
                        <GoogleIcon />
                        <span>Google</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialAuth("github")}
                        disabled={Boolean(socialLoading)}
                        className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm ${
                          isDark
                            ? "border-[rgba(248,207,150,0.2)] bg-[#1a130d] hover:bg-[#241910] hover:border-[#ffa64d]/50 text-[#f3e6cf]"
                            : "border-[#e5dcce] bg-[#f5f0e8] hover:bg-[#ede5da] hover:border-[#c06820]/50 text-[#2b2318]"
                        }`}
                      >
                        <GithubIcon isDark={isDark} />
                        <span>Github</span>
                      </button>
                    </div>

                    {/* OR Divider */}
                    <div className="relative flex items-center justify-center py-1">
                      <div className={`w-full border-t ${isDark ? "border-[rgba(248,207,150,0.15)]" : "border-[#ede3d5]"}`} />
                      <span
                        className={`absolute px-4 text-[10px] uppercase font-mono tracking-widest ${
                          isDark ? "bg-[#140f0b] text-[#f8cf96]/60" : "bg-[#fefcf8] text-[#9c9488]"
                        }`}
                      >
                        OR
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {submitError && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-medium ${
                      isDark
                        ? "border-red-500/40 bg-red-950/25 text-red-300"
                        : "border-red-500/30 bg-red-50 text-red-700"
                    }`}
                  >
                    {submitError}
                  </div>
                )}

                {/* Form Step Switcher */}
                <div className="min-h-[280px]">
                  {currentStep === 1 && (
                    <Step1Personal
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      isDark={isDark}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2Academic
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      isDark={isDark}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Membership
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      isDark={isDark}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Additional
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      isDark={isDark}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5Review
                      formData={formData}
                      goToStep={(step) => {
                        setCurrentStep(step);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      isDark={isDark}
                    />
                  )}
                </div>

                {/* Action Buttons & Navigation */}
                <div
                  className={`pt-4 border-t space-y-4 ${
                    isDark ? "border-[rgba(248,207,150,0.15)]" : "border-[#ede3d5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Backward navigation button */}
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handleGoBackward}
                        disabled={isSubmitting}
                        className={`py-3.5 px-6 rounded-full border text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm ${
                          isDark
                            ? "border-[rgba(248,207,150,0.25)] bg-[#18110b] hover:bg-[#22170f] text-[#f3e6cf]"
                            : "border-[#e5dcce] bg-[#f5f0e8] hover:bg-[#ede5da] text-[#5c5245]"
                        }`}
                        title="Back"
                      >
                        <ArrowLeft size={16} className={isDark ? "text-[#ffa64d]" : "text-[#c06820]"} />
                        <span>Back</span>
                      </button>
                    )}

                    {/* Primary forward / submit button */}
                    {currentStep < 5 ? (
                      <button
                        type="submit"
                        className="flex-1 py-4 px-7 rounded-full bg-[#c06820] hover:bg-[#ad5915] active:scale-[0.99] text-sm sm:text-base font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer font-sans shadow-[0_8px_25px_rgba(192,104,32,0.35)] text-white"
                      >
                        <span>Continue to Next Phase</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 px-7 rounded-full bg-[#c06820] hover:bg-[#ad5915] active:scale-[0.99] disabled:opacity-60 text-sm sm:text-base font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer font-sans shadow-[0_8px_25px_rgba(192,104,32,0.35)] text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-white" />
                            <span>Submitting Registration...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Registration</span>
                            <ShieldCheck size={18} strokeWidth={2.4} />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Footer Link */}
                  <p
                    className={`text-center text-xs pt-1 ${
                      isDark ? "text-[#f3e6cf]/60" : "text-[#7a6f62]"
                    }`}
                  >
                    Member of the team?{" "}
                    <Link
                      href="/login"
                      className={`font-bold hover:underline ${
                        isDark ? "text-[#ffa64d] hover:text-[#f8cf96]" : "text-[#c06820] hover:text-[#9e4e10]"
                      }`}
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#f0eae0] text-center font-mono text-[#c06820] py-24">
          Loading registration...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
