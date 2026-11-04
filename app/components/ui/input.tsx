"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, icon, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 pointer-events-none text-[#e0d3c5]/50 flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full rounded-xl bg-[rgba(26,20,14,0.7)] border border-[rgba(241,214,172,0.18)] px-4 py-2.5 text-sm text-[#f3e6cf] placeholder:text-[#e0d3c5]/40 transition-all duration-200",
              "hover:border-[rgba(241,214,172,0.35)]",
              "focus:outline-none focus:border-[#3576ae] focus:ring-2 focus:ring-[#3576ae]/30 focus:bg-[rgba(26,20,14,0.95)]",
              icon ? "pl-10" : "",
              error ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20" : "",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-400 font-mono">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
