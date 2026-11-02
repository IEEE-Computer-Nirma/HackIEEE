"use client";

import { Check } from "lucide-react";

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  maxAccessibleStep: number;
}

const STEPS = [
  { step: 1, label: "Personal Info", short: "Personal" },
  { step: 2, label: "Academic Info", short: "Academic" },
  { step: 3, label: "IEEE Membership", short: "Membership" },
  { step: 4, label: "Additional Info", short: "Interests" },
  { step: 5, label: "Review & Submit", short: "Review" },
];

export default function RegistrationProgress({
  currentStep,
  totalSteps,
  onStepClick,
  maxAccessibleStep,
}: RegistrationProgressProps) {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full mb-8">
      {/* Percentage Bar */}
      <div className="flex items-center justify-between text-xs font-mono tracking-wider text-sand/70 mb-2">
        <span className="uppercase">Step {currentStep} of {totalSteps}</span>
        <span className="text-spice font-semibold">{percentage}% Completed</span>
      </div>

      <div className="w-full h-1.5 bg-[#251b14] rounded-full overflow-hidden mb-6 relative">
        <div
          className="h-full bg-gradient-to-r from-spice via-spice-hot to-amber-300 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(226,130,47,0.7)]"
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>

      {/* Step Pills / Icons */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {STEPS.map((s) => {
          const isDone = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isAccessible = s.step <= maxAccessibleStep;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick && onStepClick(s.step)}
              className={`group flex flex-col items-center text-center transition-all duration-200 py-1 ${
                isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 mb-1.5 ${
                  isDone
                    ? "bg-spice text-[#1d130a] shadow-[0_0_10px_rgba(226,130,47,0.5)]"
                    : isCurrent
                    ? "border-2 border-spice bg-[#1e150e] text-spice-hot shadow-[0_0_15px_rgba(226,130,47,0.4)] scale-105"
                    : "border border-line bg-[#16100c] text-sand/40"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={2.5} /> : s.step}
              </div>
              <span
                className={`hidden md:block text-[0.72rem] font-medium tracking-wide uppercase transition-colors truncate max-w-full ${
                  isCurrent
                    ? "text-spice-hot font-semibold"
                    : isDone
                    ? "text-sand/90"
                    : "text-sand/40"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`block md:hidden text-[0.65rem] font-medium tracking-tight uppercase transition-colors truncate max-w-full ${
                  isCurrent
                    ? "text-spice-hot font-semibold"
                    : isDone
                    ? "text-sand/90"
                    : "text-sand/40"
                }`}
              >
                {s.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
