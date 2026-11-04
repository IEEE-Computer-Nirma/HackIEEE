"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "sand" | "blue" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-9 px-3 text-xs rounded-lg",
      md: "h-11 px-4 py-2 text-sm rounded-xl",
      lg: "h-12 px-6 text-base rounded-xl",
      icon: "h-10 w-10 rounded-xl p-0",
    }[size];

    const variantClasses = {
      default: "bg-white text-black font-semibold hover:bg-neutral-100 shadow-md active:scale-[0.99]",
      secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10 active:scale-[0.99]",
      outline: "border border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-white/30 active:scale-[0.99]",
      ghost: "text-white/70 hover:text-white hover:bg-white/5 active:scale-[0.99]",
      sand: "bg-gradient-to-r from-[#ba9241] via-[#cbaa5c] to-[#e9cb8e] text-[#1a140e] font-semibold hover:brightness-110 shadow-[0_0_20px_rgba(233,203,142,0.25)] border border-[#e9cb8e]/30 active:scale-[0.98]",
      blue: "bg-gradient-to-r from-[#3576ae] via-[#4a8cc6] to-[#68aec9] text-white font-semibold hover:brightness-110 shadow-[0_0_20px_rgba(53,118,174,0.35)] border border-[#a9d8de]/30 active:scale-[0.98]",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
